/* Learning policy is intentionally explicit: an adjustable heuristic, not a rating. */
let learningSessionKind = 'mixed';
let activeLessonId = null;
let currentAttemptIndex = null;
let currentHintUsed = false;
let currentReflashUsed = false;
let currentConfidence = null;
const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
const DAY_MS = 86400000;

function normalizedLearning(value) {
  return { version:1, geometry:normalizeGeometryCourse(value?.geometry), training:normalizeTraining(value?.training), ui:{demoSeen:Object.fromEntries(['single','multi','trace','verdict','flash','before'].filter(key=>value?.ui?.demoSeen?.[key]===true).map(key=>[key,true])),workedSeen:Array.isArray(value?.ui?.workedSeen)?value.ui.workedSeen.filter(id=>typeof id==='string'):[]}, assessmentSeen:Array.isArray(value?.assessmentSeen) ? value.assessmentSeen.filter(id=>typeof id==='string') : [], lessonsViewed:value?.lessonsViewed && typeof value.lessonsViewed === 'object' && !Array.isArray(value.lessonsViewed) ? value.lessonsViewed : {},
    notes:Array.isArray(value?.notes) ? value.notes.filter(note => note && typeof note.text === 'string' && Number.isFinite(note.timestamp)).slice(-100) : [] };
}

function initLearning() {
  appData.learning = normalizedLearning(appData.learning);
  document.getElementById('navBtnLearn').addEventListener('click', () => openLearningPath());
  document.getElementById('btnContinueLearning').addEventListener('click', () => openLesson(recommendedLesson().id));
  document.getElementById('btnReviewDue').addEventListener('click', () => startDueReview());
  document.getElementById('btnDiagnostic').addEventListener('click', () => {
    startAssessment();
  });
  document.getElementById('btnBackToPath').addEventListener('click', () => openLearningPath());
  document.getElementById('btnWorkedExample').addEventListener('click', () => showWorkedExample(activeLessonId));
  document.getElementById('btnLessonPractice').addEventListener('click', () => startLessonPractice(activeLessonId, false));
  document.getElementById('btnGuidedPractice').addEventListener('click', () => startLessonPractice(activeLessonId, true));
  document.getElementById('btnSaveReflection').addEventListener('click', () => {
    const input = document.getElementById('inputReflection');
    const text = input.value.trim().slice(0, 500);
    if (!text) { announce('Write one cue you want to remember first.'); return; }
    appData.learning.notes.push({ lessonId:activeLessonId, text, timestamp:Date.now() });
    appData.learning.notes = appData.learning.notes.slice(-100);
    saveLocalState(); input.value = ''; renderLearningProgress(); announce('Reflection saved on this device.');
  });
  document.querySelectorAll('[data-confidence]').forEach(button => button.addEventListener('click', () => {
    if (isRevealed) return;
    currentConfidence = Number(button.dataset.confidence);
    renderConfidence();
  }));
  renderLearningProgress();
}

function resetLearningRound() {
  currentAttemptIndex = null; currentHintUsed = learningSessionKind === 'guided'; currentReflashUsed = false; currentConfidence = null;
  document.getElementById('understandingCheck').classList.add('hidden');
  document.getElementById('understandingResult').textContent = '';
  document.getElementById('btnNextExercise').disabled = false;
  document.getElementById('confidenceGroup').classList.remove('hidden');
  renderConfidence();
  if (learningSessionKind === 'guided') {
    document.getElementById('hintBox').classList.remove('hidden');
    document.getElementById('btnToggleHint').textContent = 'Hide hint';
  }
}

function renderConfidence() {
  document.querySelectorAll('[data-confidence]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.confidence) === currentConfidence)));
}

function annotateLearningAttempt(errorCategory) {
  if (!appData.attempts.length) return;
  currentAttemptIndex = appData.attempts.length - 1;
  Object.assign(appData.attempts[currentAttemptIndex], {
    lessonId:currentExercise.lessonId || null, sessionKind:learningSessionKind,
    hintUsed:currentHintUsed, reflashUsed:currentReflashUsed, confidence:currentConfidence,
    responseType:currentExercise.responseType, errorCategory,
    selectedSquares:currentExercise.responseType==='select_set' ? [...setSelections] : undefined,
    assessmentSessionId:currentExercise.assessmentSessionId || null,
    exposureMs:currentExercise.flashDurationMs || null,
    decisionTimeMs:decisionLatency(appData.attempts[currentAttemptIndex].responseTimeMs),
    validAssessmentExposure:learningSessionKind==='assessment' ? !currentAssessmentRestarted && currentAssessmentFirstExposure : null,
    unfamiliar:learningSessionKind==='assessment' ? currentAssessmentFirstExposure : !appData.learning.ui.workedSeen.includes(currentExercise.id) && !appData.learning.training.understandingSeen.includes(currentExercise.quality?.sourceId) && !appData.attempts.slice(0,-1).some(a => a.exerciseId === currentExercise.id),
    calibrationSessionId:currentExercise.calibrationSessionId || null, contentVersion:currentExercise.quality?.version || 1, qualityRule:currentExercise.quality?.rule.kind || null, sourcePositionId:currentExercise.quality?.sourceId || null,
    understandingCorrect:null
  });
  if(learningSessionKind==='calibration')recordCalibration();
}

function renderUnderstanding() { renderVisualUnderstanding(); }

function recordWrittenUnderstanding() { /* Legacy history remains readable; new checks are visual. */ }

function independentSuccess(attempt) {
  return attempt.correct && attempt.hintUsed === false && attempt.reflashUsed === false && attempt.understandingCorrect === true && !['guided','assessment','calibration'].includes(attempt.sessionKind);
}

function itemSchedule(id, now = Date.now()) {
  const attempts = appData.attempts.filter(a => a.exerciseId === id && !['assessment','calibration'].includes(a.sessionKind)).slice().sort((a,b) => a.timestamp - b.timestamp);
  if (!attempts.length) return { seen:false, dueAt:0, due:false, stage:0, last:null };
  let stage = 0, lastIndependentAt = null;
  for (const attempt of attempts) {
    if (!independentSuccess(attempt)) { stage = 0; lastIndependentAt = null; continue; }
    // Repeating immediately cannot advance a spaced stage.
    if (lastIndependentAt === null || attempt.timestamp - lastIndependentAt >= DAY_MS) {
      stage = Math.min(stage + 1, REVIEW_INTERVALS_DAYS.length); lastIndependentAt = attempt.timestamp;
    }
  }
  const last = attempts[attempts.length - 1];
  const dueAt = last.timestamp + (independentSuccess(last) ? REVIEW_INTERVALS_DAYS[Math.max(0, stage - 1)] * DAY_MS : 10 * 60000);
  return { seen:true, dueAt, due:now >= dueAt, stage, last };
}

function lessonEvidence(lessonId, now = Date.now()) {
  const items = allLearningExercises().filter(e => e.lessonId === lessonId);
  const ids = new Set(items.map(e => e.id));
  const attempts = appData.attempts.filter(a => ids.has(a.exerciseId) && a.sessionKind !== 'assessment');
  const independent = attempts.filter(independentSuccess);
  const uniqueIndependent = new Set(independent.map(a => a.exerciseId)).size;
  const seen = new Set(attempts.map(a => a.exerciseId)).size;
  const delayedItems = items.filter(e => itemSchedule(e.id, now).stage >= 2).length;
  const status = uniqueIndependent >= 3 && delayedItems >= 2 ? 'Retention evidence' : uniqueIndependent >= 2 ? 'Practiced' : attempts.length ? 'Learning' : appData.learning?.lessonsViewed[lessonId] ? 'Introduced' : 'New';
  return { items:items.length, seen, attempts:attempts.length, independent:independent.length, uniqueIndependent, delayedItems, status, coverage:Math.round(seen / items.length * 100) };
}

function recommendedLesson() {
  return LEARNING_LESSONS.find(lesson => lessonEvidence(lesson.id).uniqueIndependent < 2) || LEARNING_LESSONS.find(lesson => lessonEvidence(lesson.id).status !== 'Retention evidence') || LEARNING_LESSONS[0];
}

function buildLearningQueue(mode, count = 8, now = Date.now()) {
  const all = allLearningExercises();
  const pool = mode ? all.filter(e => e.mode === mode) : all;
  const offset = appData.attempts.length % Math.max(1, pool.length);
  const rotated = [...pool.slice(offset), ...pool.slice(0,offset)];
  const scored = rotated.map((exercise, i) => {
    const schedule = itemSchedule(exercise.id, now);
    const score = schedule.due ? 1000 + Math.min(30, (now - schedule.dueAt) / DAY_MS) : !schedule.seen ? 500 : schedule.last && !independentSuccess(schedule.last) ? 350 : 100;
    return { exercise, score:score - i / 1000 };
  }).sort((a,b) => b.score - a.score);
  const chosen = [];
  while (scored.length && chosen.length < count) {
    const different = scored.findIndex(row => row.exercise.lessonId !== chosen[chosen.length - 1]?.lessonId);
    chosen.push(scored.splice(different >= 0 ? different : 0,1)[0].exercise);
  }
  return chosen;
}

function openLearningPath() {
  activeLessonId = null;
  document.getElementById('learningCatalog').classList.remove('hidden');
  document.getElementById('lessonDetail').classList.add('hidden');
  switchTab('learn'); renderLearningProgress();
}

function openLesson(id) {
  const lesson = LEARNING_LESSONS.find(l => l.id === id);
  if (!lesson) return;
  activeLessonId = id;
  appData.learning = normalizedLearning(appData.learning);
  appData.learning.lessonsViewed[id] = Date.now(); saveLocalState();
  document.getElementById('learningCatalog').classList.add('hidden');
  document.getElementById('lessonDetail').classList.remove('hidden');
  document.getElementById('lessonStage').textContent = lesson.stage;
  document.getElementById('lessonName').textContent = lesson.title;
  document.getElementById('lessonGoal').textContent = lesson.goal;
  document.getElementById('lessonPrinciple').textContent = lesson.principle;
  document.getElementById('lessonTransfer').textContent = lesson.transfer;
  const steps = document.getElementById('lessonSteps'); steps.innerHTML = '';
  lesson.steps.forEach(text => { const li = document.createElement('li'); li.textContent = text; steps.appendChild(li); });
  switchTab('learn'); document.getElementById('lessonName').focus();
}

function startLessonPractice(id, guided) {
  const exercises = allLearningExercises().filter(e => e.lessonId === id);
  const offset = appData.attempts.filter(a => a.lessonId === id).length % exercises.length;
  learningSessionKind = guided ? 'guided' : 'lesson';
  startSprintSession([...exercises.slice(offset),...exercises.slice(0,offset)].slice(0, 6), learningSessionKind);
}

function showWorkedExample(id) {
  const exercise=CURRICULUM_EXERCISES.find(e=>e.lessonId===id);
  if(exercise)startSprintSession([attachLesson(exercise)],'worked-example');
}

function startDueReview() {
  const due = intermediatePool().filter(exercise => itemSchedule(exercise.id).due);
  if (!due.length) { announce('No reviews due. Start a lesson or mixed practice.'); return; }
  learningSessionKind = 'review'; startSprintSession(due.slice(0, 8), 'review');
}

function renderLearningProgress() {
  if (!document.getElementById('learningLessonList')) return;
  appData.learning = normalizedLearning(appData.learning);
  const all = allLearningExercises();
  const due = intermediatePool().filter(exercise => itemSchedule(exercise.id).due).length;
  document.getElementById('dueReviewCount').textContent = String(due);
  document.getElementById('btnReviewDue').disabled = due === 0;
  refreshVisualHome();renderTrainingProfile();
  const next = recommendedLesson();
  document.getElementById('nextLessonLabel').textContent = next.title;
  document.getElementById('learningInventory').textContent = 'SEE → CONNECT → ANTICIPATE → VERIFY · 12 lessons · ' + (all.length + REAL_GAME_EXERCISES.filter(e => e.assessmentOnly).length) + ' exercises, including 96 reserved for assessment · all offline';
  const list = document.getElementById('learningLessonList'); list.innerHTML = '';
  LEARNING_LESSONS.forEach(lesson => {
    const evidence = lessonEvidence(lesson.id);
    const button = document.createElement('button'); button.type = 'button'; button.className = 'lesson-card';
    button.innerHTML = '<span class="eyebrow">' + lesson.stage + '</span><strong>' + lesson.title + '</strong><span class="lesson-goal">' + lesson.goal + '</span><span class="lesson-evidence">' + evidence.status + ' · ' + evidence.seen + '/' + evidence.items + ' explored · ' + evidence.uniqueIndependent + ' independent</span><span class="skill-track"><span style="width:' + evidence.coverage + '%"></span></span>';
    button.addEventListener('click', () => openLesson(lesson.id)); list.appendChild(button);
  });
  const attempts = appData.attempts.filter(a => a.sessionKind !== "assessment");
  const independent = attempts.filter(independentSuccess).length;
  const understanding = attempts.filter(a => typeof a.understandingCorrect === 'boolean');
  const confidenceKnown = attempts.filter(a => a.confidence === 3);
  document.getElementById('learningEvidenceSummary').textContent = independent + ' independent recalls · ' + (understanding.length ? Math.round(understanding.filter(a => a.understandingCorrect).length / understanding.length * 100) + '% understanding checks (' + understanding.length + ')' : 'understanding not measured yet');
  document.getElementById('confidenceInsight').textContent = confidenceKnown.length ? 'Certain answers: ' + Math.round(confidenceKnown.filter(a => a.correct).length / confidenceKnown.length * 100) + '% accurate across ' + confidenceKnown.length + ' attempts. Confidence is a reflection, not proof of mastery.' : 'Choose confidence before answering to compare how sure you feel with what you demonstrate.';
  const recentErrors = attempts.slice().reverse().filter(a => !a.correct || a.understandingCorrect === false).slice(0, 5);
  const errorList = document.getElementById('learningErrorList'); errorList.innerHTML = '';
  if (!recentErrors.length) { const li = document.createElement('li'); li.textContent = 'Missed connections will appear here with a path back to practice.'; errorList.appendChild(li); }
  for (const attempt of recentErrors) {
    const exercise = all.find(e => e.id === attempt.exerciseId);
    const li = document.createElement('li');
    const button = document.createElement('button'); button.className = 'text-button'; button.type = 'button';
    button.textContent = (attempt.errorCategory ? attempt.errorCategory.replaceAll('_',' ') + ': ' : '') + (exercise?.title || CATEGORY_LABELS[attempt.category] || 'Imported position') + (attempt.correct ? ' · revisit the principle' : ' · revisit the position');
    button.addEventListener('click', () => { if (exercise) { learningSessionKind = 'repair'; startSprintSession([exercise], 'repair'); } else { switchTab('games'); announce('Reimport the original PGN or FEN to revisit this personal position.'); } });
    li.appendChild(button); errorList.appendChild(li);
  }
  renderResearchProgress(); renderCourseCatalog();
  renderVisualLearningPath(); renderProgressOverview();
  const notes = document.getElementById('reflectionList'); notes.innerHTML = '';
  appData.learning.notes.slice(-5).reverse().forEach(note => { const li = document.createElement('li'); li.textContent = note.text; notes.appendChild(li); });
}

