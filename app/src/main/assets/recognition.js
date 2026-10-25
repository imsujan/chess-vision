/* Assessment items are segregated by source game and never enter practice queues. */
let traceSelections = [];
let setSelections = new Set();
let assessmentActive = false;
let currentAssessmentRestarted = false;
let currentAssessmentFirstExposure = true;
const ASSESSMENT_EXPOSURE_MS = 5000;
const PROGRAM_WEEKS = [
  ['Week 1 · See', 'pressure', 'board'], ['Week 2 · Trace', 'board', 'alignment'],
  ['Week 3 · Connect', 'forks', 'change'], ['Week 4 · Verify', 'alignment', 'king'],
  ['Week 5 · Anticipate', 'change', 'pawns'], ['Week 6 · Transfer', 'routine', 'positional']
];
const ACTIVITY_LABELS = { threat_scan:'Threat Scan', relationship_trace:'Relationship Tracing', mixed:'Mixed Recognition', illusion:'Pattern or Illusion', before_after:'Before / After', flash:'Flash Recognition' };
const CAPABILITIES = [
  {name:'SEE',lesson:'pressure',lessons:['board','pressure','king'],cue:'What is happening right now?'},
  {name:'CONNECT',lesson:'alignment',lessons:['alignment','forks','helpers','pawns','positional'],cue:'How do the pieces depend on one another?'},
  {name:'ANTICIPATE',lesson:'change',lessons:['change','memory','endgames'],cue:'What changes after the move?'},
  {name:'VERIFY',lesson:'routine',lessons:['routine'],cue:'Does the attractive pattern hold up?'}
];

function isRecognitionAttempt(attempt) {
  return attempt.hintUsed === false && attempt.reflashUsed === false && !['guided','assessment','worked-example','calibration'].includes(attempt.sessionKind);
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a,b) => a-b), half = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[half] : (sorted[half-1] + sorted[half])/2;
}

function recognitionLatency(attempt) { return attempt.decisionTimeMs ?? attempt.responseTimeMs; }
function decisionLatency(elapsedMs) {
  return currentExercise?.mode==='flash_vision' && (!appData.untimedMode || learningSessionKind==='assessment')
    ? Math.max(150,elapsedMs-(currentExercise.flashDurationMs || 0)) : elapsedMs;
}

function recognitionMetrics(attempts = appData.attempts) {
  const independent = attempts.filter(isRecognitionAttempt);
  const illusionTrials = independent.filter(a => a.responseType === 'verdict_and_square' && a.isTruePattern === false);
  const falsePositives = illusionTrials.filter(a => a.selectedVerdict === 'real').length;
  const helped = attempts.filter(a => a.hintUsed || a.reflashUsed || a.sessionKind === 'guided');
  return { count:independent.length, accuracy:independent.length ? Math.round(independent.filter(a => a.correct).length/independent.length*100) : null,
    medianMs:median(independent.filter(a => a.correct).map(recognitionLatency)), falsePositiveRate:illusionTrials.length ? Math.round(falsePositives/illusionTrials.length*100) : null,
    falsePositiveTrials:illusionTrials.length, hintDependence:attempts.length ? Math.round(helped.length/attempts.length*100) : null };
}

function exposureForLesson(lessonId) {
  const attempts=appData.attempts.filter(a => a.lessonId===lessonId && isRecognitionAttempt(a));
  const examples=new Set(attempts.map(a=>a.exerciseId)).size;
  const days=new Set(attempts.map(a=>localDay(a.timestamp))).size;
  const accuracy=attempts.length ? attempts.filter(a=>a.correct).length/attempts.length : 0;
  if (examples>=20 && days>=3 && accuracy>=0.9) return 2500;
  if (examples>=10 && days>=2 && accuracy>=0.85) return 4000;
  return 6000;
}

function diagnoseError(exercise, squareMatched, verdictMatched) {
  if (squareMatched && verdictMatched) return null;
  if(exercise.errorKind) return exercise.errorKind;
  if (exercise.traceSteps) {
    const bad=exercise.traceSteps.findIndex((step,i)=>!step.squares.includes(traceSelections[i]));
    return ['missed_attacker','wrong_target','missed_defender'][bad] || 'wrong_target';
  }
  if (exercise.mode==='before_after') return 'failed_transformation';
  if (['false_pin','blocked_line'].includes(exercise.category)) return 'blocked_ray';
  if (exercise.category==='fake_fork') return 'false_fork';
  if (!exercise.isTruePattern && !verdictMatched) return 'missed_defender';
  if (exercise.mode==='flash_vision') return 'memory_update';
  return exercise.category==='hanging_piece' ? 'missed_attacker' : 'premature_recognition';
}

function handleTraceTap(square) {if(!currentExercise.traceSteps)return false;handleDraftSquare(square);return true;}

function handleSetTap(square) {if(currentExercise.responseType!=='select_set')return false;handleDraftSquare(square);return true;}

function reportAwareQueue(count=8,now=Date.now()){return intermediateQueue(null,count,now);}

function startActivity(activity) {
  const pool=intermediatePool();
  let exercises;
  if (activity==='threat_scan') exercises=pool.filter(e=>e.activity==='threat_scan' || e.category==='hanging_piece');
  else if(activity==='relationship_trace') exercises=pool.filter(e=>e.traceSteps);
  else exercises=reportAwareQueue(8);
  const offset=appData.attempts.length%Math.max(1,exercises.length);
  startSprintSession([...exercises.slice(offset),...exercises.slice(0,offset)].slice(0,8),'recognition');
}

function startFocusedSession(){startSprintSession(intermediateQueue(null,16),'focused');}

function startAssessment() {
  const used=new Set([...appData.attempts.filter(a=>a.sessionKind==='assessment').map(a=>a.exerciseId),...(appData.learning?.assessmentSeen || [])]);
  const calibrationIds=new Set(calibrationCatalog().map(e=>e.id));
  const unseen=assessmentPool().filter(e=>!used.has(e.id)&&!used.has(e.quality.sourceId));
  if(unseen.length<12) { announce('There are fewer than 12 fresh assessment items left. Your previous results stay available; repeated items cannot be called unseen.'); return; }
  const sessionId='assessment-'+Date.now();
  const items=unseen.slice(0,12).map(e=>({...attachLesson(e),mode:'flash_vision',activity:'assessment',flashDurationMs:ASSESSMENT_EXPOSURE_MS,assessmentSessionId:sessionId,title:'Unfamiliar position',traceSteps:null}));
  startSprintSession(items,'assessment');
}

function initRecognition() {
  document.getElementById('btnThreatScan').addEventListener('click',()=>startActivity('threat_scan'));
  document.getElementById('btnTraceRelations').addEventListener('click',()=>startActivity('relationship_trace'));
  document.getElementById('btnMixedRecognition').addEventListener('click',()=>startActivity('mixed'));
  document.getElementById('btnFocusedSession').addEventListener('click',()=>startFocusedSession());
  document.getElementById('btnAssessment').addEventListener('click',()=>startAssessment());
  document.getElementById('btnSubmitSet').addEventListener('click',()=>{
    commitDraft();
  });
  renderResearchProgress();
}

function resetRecognitionRound() {
  traceSelections=[];
  setSelections=new Set();
  document.getElementById('btnSubmitSet').classList.toggle('hidden',currentExercise.responseType!=='select_set');
  currentAssessmentRestarted=false;
  currentAssessmentFirstExposure=true;
  if(currentExercise.traceSteps) document.getElementById('selectionHintLabel').textContent=currentExercise.traceSteps[0].label;
  if(currentExercise.responseType==='select_set')document.getElementById('selectionHintLabel').textContent='Select every matching square, then check';
  const assessment=['assessment','calibration'].includes(learningSessionKind);
  if(learningSessionKind==='assessment') {
    appData.learning=normalizedLearning(appData.learning);
    currentAssessmentFirstExposure=!appData.learning.assessmentSeen.includes(currentExercise.id);
    if(currentAssessmentFirstExposure) appData.learning.assessmentSeen.push(currentExercise.id);
    saveLocalState();
  }
  document.getElementById('btnToggleHint').disabled=assessment;
  document.getElementById('btnReflash').disabled=assessment;
  document.getElementById('btnToggleHint').textContent=assessment?'Assessment · no hints':'Show geometry hint';
  if(currentExercise.guidedItem) { currentHintUsed=true; document.getElementById('hintBox').classList.remove('hidden'); }
  if(learningSessionKind==='assessment') {
    document.getElementById('drillCategoryPill').textContent='Unfamiliar · fixed 5-second exposure';
    document.getElementById('drillTitle').textContent='Assessment position '+(currentDrillIndex+1);
  } else if(currentExercise.activity==='mixed' || learningSessionKind==='mixed') {
    document.getElementById('drillCategoryPill').textContent='Mixed recognition';
    document.getElementById('drillTitle').textContent='Read the whole position';
  }
}

function renderResearchProgress() {
  if(!document.getElementById('researchMetrics')) return;
  const metrics=recognitionMetrics();
  const capabilities=document.getElementById('capabilityCards');capabilities.innerHTML='';
  CAPABILITIES.forEach(capability=>{
    const attempts=appData.attempts.filter(a=>capability.lessons.includes(a.lessonId) || capability.name==='VERIFY' && a.responseType==='verdict_and_square');
    const evidence=recognitionMetrics(attempts);
    const button=document.createElement('button');button.className='capability-card';button.type='button';
    button.innerHTML='<strong>'+capability.name+'</strong><span>'+capability.cue+'</span><small>'+evidence.count+' independent · '+(evidence.accuracy===null?'no score yet':evidence.accuracy+'% accurate')+'</small>';
    button.addEventListener('click',()=>openLesson(capability.lesson));capabilities.appendChild(button);
  });
  const personal=appData.attempts.filter(a=>a.exerciseId?.startsWith('pgn-') || a.exerciseId?.startsWith('custom-fen') || a.sourcePositionId?.startsWith('pgn-') || a.sourcePositionId?.startsWith('custom-fen'));
  document.getElementById('personalGameEvidence').textContent=appData.gamesCount+' games analyzed · '+personal.length+' personal-position attempts. These records support review; they do not establish that you missed a tactic during the original game or that your rating has improved.';
  document.getElementById('researchMetrics').textContent='Independent recognition: '+(metrics.accuracy===null?'not measured':metrics.accuracy+'% across '+metrics.count+' attempts')+' · median correct response '+(metrics.medianMs===null?'—':(metrics.medianMs/1000).toFixed(1)+'s')+' · false positives '+(metrics.falsePositiveRate===null?'—':metrics.falsePositiveRate+'% ('+metrics.falsePositiveTrials+' illusion trials)')+' · assisted '+(metrics.hintDependence??0)+'% of all practice.';
  const assessments=appData.attempts.filter(a=>a.sessionKind==='assessment');
  const sessions=[...new Set(assessments.map(a=>a.assessmentSessionId))];
  const container=document.getElementById('assessmentResults'); container.innerHTML='';
  if(!sessions.length) { const p=document.createElement('p');p.className='muted';p.textContent='No assessment yet. Use a baseline now, then a fresh check at weeks 2, 4 and 6. Assessment never changes practice mastery.';container.appendChild(p); }
  for(const session of sessions.slice(-4)) {
    const results=assessments.filter(a=>a.assessmentSessionId===session);
    const valid=results.filter(a=>a.validAssessmentExposure);
    const p=document.createElement('p');p.className='muted';
    p.textContent=new Date(results[0].timestamp).toLocaleDateString()+': '+valid.filter(a=>a.correct).length+'/'+valid.length+' valid first exposures correct · fixed 5s · '+(results.length===12?'complete':'incomplete')+' · '+(results.length-valid.length)+' interrupted/repeated exposures excluded';container.appendChild(p);
  }
  const weeks=document.getElementById('sixWeekPlan');weeks.innerHTML='';
  PROGRAM_WEEKS.forEach(([label,...lessonIds])=>{
    const button=document.createElement('button');button.className='button week-button';button.type='button';
    button.textContent=label+' · '+lessonIds.map(id=>LEARNING_LESSONS.find(l=>l.id===id).title).join(' + ');
    button.addEventListener('click',()=>openLesson(lessonIds[0]));weeks.appendChild(button);
  });
}
