/* Presentation and interaction helpers. Engine and persisted v1 attempts live in trainer.js. */
const geometryLayers = { attack: true, defense: true, structure: true };
const MODE_NAMES = { geometry_xray: 'Geometry X-Ray', flash_vision: 'Flash Vision', pattern_or_illusion: 'Pattern or illusion?', before_after: 'Before & after' };

function announce(message) {
  const live = document.getElementById('liveAnnouncement');
  live.textContent = '';
  requestAnimationFrame(() => { live.textContent = message; });
}

function isValidBackup(data) {
  return Boolean(data && data.app === 'chess-vision' && (!data.schemaVersion || data.schemaVersion === 1) &&
    Array.isArray(data.attempts) && data.attempts.every(a => a && typeof a.category === 'string' &&
      typeof a.correct === 'boolean' && typeof a.isTruePattern === 'boolean' &&
      Number.isFinite(a.timestamp) && a.timestamp >= 0 && Number.isFinite(a.responseTimeMs) && a.responseTimeMs >= 0) &&
    (data.gamesCount === undefined || Number.isInteger(data.gamesCount) && data.gamesCount >= 0));
}

function readLocalFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function initExperience() {
  initVisualFlow();
  const root = document.documentElement;
  const updateTheme = () => {
    const light = root.dataset.theme === 'light';
    document.getElementById('btnThemeToggle').setAttribute('aria-label', 'Switch to ' + (light ? 'dark' : 'light') + ' theme');
    document.querySelector('meta[name="theme-color"]').content = light ? '#f4f4eb' : '#262522';
  };
  updateTheme();
  document.getElementById('btnThemeToggle').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { writePersistentItem('chess_vision_theme', root.dataset.theme); } catch (_) {}
    updateTheme();
  });
  try { soundMuted = readPersistentItem('chess_vision_muted') === 'true'; } catch (_) {}
  updateSoundButton();
  document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); switchTab('today'); });
  document.getElementById('todayDate').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()).toUpperCase();
  document.getElementById('btnShowBefore').addEventListener('click', () => showComparison(false));
  document.getElementById('btnShowAfter').addEventListener('click', () => showComparison(true));
  document.querySelectorAll('[data-layer]').forEach(button => button.addEventListener('click', () => {
    geometryLayers[button.dataset.layer] = !geometryLayers[button.dataset.layer];
    button.setAttribute('aria-pressed', String(geometryLayers[button.dataset.layer]));
    renderTeachingOverlay();
  }));
  document.getElementById('btnStartExposure').addEventListener('click',()=>{if(!isRevealed && flashPhase==='ready'){startFlashExposure(currentExercise.flashDurationMs || 2300);document.getElementById('chessboardGrid').scrollIntoView?.({block:'center',behavior:'instant'});}});
  document.getElementById('btnResetTrace').addEventListener('click',()=>{if(isRevealed || !currentExercise?.traceSteps)return;traceSelections=[];selectedSquare=null;renderBoardAndOverlay();announce('Taps cleared. Start with an attacker.');});
  renderPreviewBoard();
}

function updateSoundButton() {
  const button = document.getElementById('btnSoundToggle');
  button.setAttribute('aria-label', soundMuted ? 'Enable sound' : 'Mute sound');
  button.setAttribute('aria-pressed', String(soundMuted));
  try { writePersistentItem('chess_vision_muted', String(soundMuted)); } catch (_) {}
}

function renderPreviewBoard() {
  // Bishop b2 and rook e1 both attack the queen on e5; no decorative random rays.
  const pieces = { b2: 'wB', e1: 'wR', e5: 'bQ', g1: 'wK', g8: 'bK', h7: 'bP' };
  let html = '';
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
    const square = FILES[col] + (8 - row);
    html += '<span class="' + ((row + col) % 2 ? 'sq-dark' : 'sq-light') + '">' + (PIECE_SVGS[pieces[square]] || '') + '</span>';
  }
  html += '<svg class="overlay-svg" viewBox="0 0 100 100"><defs><marker id="preview-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="m0 1 8 4-8 4Z" fill="#9b3c2c"/></marker></defs><path d="M20 78 53 45 M56 90V47" fill="none" stroke="#9b3c2c" stroke-width="1.6" marker-end="url(#preview-arrow)"/><circle cx="56.25" cy="43.75" r="6" fill="none" stroke="#9b3c2c" stroke-width=".9"/></svg>';
  document.getElementById('previewBoard').innerHTML = html;
}

function renderSkillCard(skill) {
  const score = skill.attempts ? skill.accuracyPercent + '%' : '—';
  const detail = skill.attempts ? skill.attempts + ' independent attempts · ' + (skill.avgMs ? (skill.avgMs / 1000).toFixed(1) + 's median correct' : 'no correct latency yet') + ' · ' + (skill.accuracyPercent < 75 ? 'Worth revisiting' : 'Keep building') : 'No independent attempts yet · a new connection to explore';
  return '<article class="skill-card"><div class="skill-top"><strong>' + skill.label + '</strong><span class="skill-score">' + score + '</span></div><div class="skill-track" role="meter" aria-label="' + skill.label + ' accuracy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + skill.accuracyPercent + '" aria-valuetext="' + (skill.attempts ? score + ' across ' + skill.attempts + ' attempts' : 'Not practiced yet') + '"><span style="width:' + skill.accuracyPercent + '%"></span></div><small>' + detail + '</small></article>';
}

function localDay(timestamp) {
  const date = new Date(timestamp);
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}

function renderExperienceStats(rankings) {
  document.getElementById('progressEmpty').classList.toggle('hidden', appData.attempts.length > 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - 6 + index);
    const count = appData.attempts.filter(a => localDay(a.timestamp) === localDay(date)).length;
    return { date, count };
  });
  const maxCount = Math.max(1, ...days.map(d => d.count));
  document.getElementById('activityChart').innerHTML = days.map(({ date, count }) => {
    const day = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);
    const fullDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
    return '<div class="activity-day" aria-label="' + fullDate + ': ' + count + ' positions"><span class="activity-count">' + (count || '·') + '</span><span class="activity-bar ' + (count ? 'has-practice' : '') + '" style="height:' + Math.max(3, count / maxCount * 72) + 'px"></span><span>' + day + '</span></div>';
  }).join('');
  document.getElementById('progressInsight').textContent = appData.attempts.length ? 'Next focus: ' + rankings[0].label + '. Short, regular practice builds recognition.' : 'A clean slate. Your practice will appear here, one position at a time.';
}

function isFlashLocked() {
  return currentExercise?.mode === 'flash_vision' && (!appData.untimedMode || learningSessionKind === 'assessment') && !isRevealed && (flashPhase === 'ready' || flashPhase === 'exposed' || flashPhase === 'invalidated');
}

function invalidateFlash() {
  if (activeTab !== 'train' || !currentExercise || currentExercise.mode !== 'flash_vision' || (appData.untimedMode && learningSessionKind !== 'assessment') || isRevealed) return;
  if(learningSessionKind==='assessment') currentAssessmentRestarted=true;
  clearFlashTimers();
  flashPhase = 'invalidated';
  const banner = document.getElementById('flashInvalidBanner');
  banner.classList.remove('hidden'); banner.classList.add('flex');
  document.getElementById('flashStatusText').textContent = 'Exposure paused — restart when ready';
  renderBoardAndOverlay(); renderLessonState();
}

function updateUntimedSession() {
  if (learningSessionKind === 'assessment') return;
  if (!currentExercise || currentExercise.mode !== 'flash_vision' || isRevealed) return;
  clearFlashTimers();
  flashPhase = appData.untimedMode ? 'exposed' : 'invalidated';
  document.getElementById('flashTimerWrap').classList.toggle('hidden', appData.untimedMode);
  const banner = document.getElementById('flashInvalidBanner');
  banner.classList.toggle('hidden', appData.untimedMode);
  banner.classList.toggle('flex', (!appData.untimedMode || learningSessionKind === 'assessment'));
  renderBoardAndOverlay(); renderLessonState();
}

function renderLessonState() {
  if (!currentExercise) return;
  document.getElementById('drillPrompt').textContent = currentExercise.prompt;
  document.getElementById('drillSubPrompt').textContent = currentExercise.subPrompt;
  document.getElementById('lessonMode').textContent = MODE_NAMES[currentExercise.mode] || 'THE GEOMETRY LAB';
  document.getElementById('lessonProgress').innerHTML = sessionQueue.map((_, i) => '<span class="' + (i < currentDrillIndex ? 'done' : i === currentDrillIndex ? 'current' : '') + '"></span>').join('');
  document.getElementById('lessonProgress').setAttribute('aria-label', 'Position ' + (currentDrillIndex + 1) + ' of ' + sessionQueue.length);
  const compare = isRevealed && Boolean(currentExercise.afterFen);
  document.getElementById('beforeAfterTabs').classList.toggle('hidden', !compare);
  document.getElementById('btnShowBefore').setAttribute('aria-pressed', String(!viewingAfterFen));
  document.getElementById('btnShowAfter').setAttribute('aria-pressed', String(viewingAfterFen));
  document.getElementById('btnShowAfter').textContent = currentExercise.moveSan ? 'After ' + currentExercise.moveSan : 'After';
  document.getElementById('btnNextExercise').textContent = learningSessionKind === 'worked-example' ? 'Return to lesson →' : currentDrillIndex + 1 === sessionQueue.length ? 'See practice results →' : 'Next position →';
  renderBoardCaption();
  if (currentExercise.activity) document.getElementById('lessonMode').textContent = ACTIVITY_LABELS[currentExercise.activity] || 'Assessment';
  if (currentExercise.phaseLabel) document.getElementById('lessonMode').textContent = currentExercise.phaseLabel;
}

function renderBoardCaption() {
  if (!currentExercise) return;
  renderAnswerGuide();
  document.getElementById('boardPerspective').textContent = currentOrientation === 'w' ? 'WHITE PERSPECTIVE' : 'BLACK PERSPECTIVE';
  document.getElementById('boardStateLabel').textContent = isRevealed ? (currentExercise.afterFen ? viewingAfterFen ? 'After the move' : 'Before the move' : 'Connection revealed') : flashPhase === 'invalidated' ? 'Exposure paused' : flashPhase === 'ready' ? 'Board hidden until you start' : isFlashLocked() ? 'Observe the relationships' : flashPhase === 'masked' ? 'Recall the position' : 'Find the connection';
  document.getElementById('boardStateDetail').textContent = isRevealed ? 'Explore the geometry below' : isFlashLocked() ? 'Read How to answer above' : document.getElementById('answerAction').textContent;
  document.getElementById('btnVerdictReal').setAttribute('aria-pressed', String(selectedVerdict === 'real'));
  document.getElementById('btnVerdictIllusion').setAttribute('aria-pressed', String(selectedVerdict === 'illusion'));
}

function showComparison(after) {
  if (!isRevealed || !currentExercise?.afterFen) return;
  viewingAfterFen = after;
  renderBoardAndOverlay(); renderLessonState();
  announce(after ? 'Position after ' + currentExercise.moveSan : 'Position before ' + currentExercise.moveSan);
}

function handleBoardKey(event) {
  const directions = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8 };
  if (!(event.key in directions)) return;
  event.preventDefault();
  const squares = [...document.querySelectorAll('#chessboardGrid button')];
  const index = squares.indexOf(event.currentTarget);
  const next = index + directions[event.key];
  if (next < 0 || next >= 64 || event.key === 'ArrowLeft' && index % 8 === 0 || event.key === 'ArrowRight' && index % 8 === 7) return;
  squares.forEach((square, i) => { square.tabIndex = i === next ? 0 : -1; });
  squares[next].focus();
}

function renderTeachingOverlay() {
  const svg = document.getElementById('geometryOverlaySvg');
  svg.classList.toggle('hidden', !isRevealed || !currentExercise);
  if (!isRevealed || !currentExercise) { svg.innerHTML = ''; return; }
  // After-position threats must never be presented as present in the before position.
  const before = currentExercise.afterFen && !viewingAfterFen;
  const allArrows = before ? currentExercise.overlay.arrows.filter(a => a.kind === 'move') : currentExercise.overlay.arrows;
  const layer = kind => kind === 'attack' || kind === 'defense' ? kind : 'structure';
  const visible = allArrows.filter(a => geometryLayers[layer(a.kind)]);
  const colors = { attack: '#b73a26', defense: '#086543', pin: '#805300', blocked: '#4c5266', move: '#245c9b' };
  const descriptions = { attack: 'attacks', defense: 'defends', pin: 'pin / alignment toward', blocked: 'blocked line toward', move: 'moves to' };
  let markup = '<defs>' + Object.keys(colors).map(kind => '<marker id="mk-' + kind + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="m0 1 8 4-8 4Z" fill="' + colors[kind] + '"/></marker>').join('') + '</defs>';
  markup += visible.map(arrow => {
    const start = squareCenterCoords(arrow.from), end = squareCenterCoords(arrow.to);
    const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy) || 1;
    const sx = start.x + dx / length * 3.8, sy = start.y + dy / length * 3.8;
    const ex = end.x - dx / length * 4, ey = end.y - dy / length * 4;
    const dash = arrow.kind === 'defense' ? '2.2 1.5' : arrow.kind === 'pin' || arrow.kind === 'blocked' ? '0.5 1.4' : '';
    // Knight geometry is an L, rather than an apparent sliding diagonal.
    const knightJump = Math.min(Math.abs(dx), Math.abs(dy)) === 12.5 && Math.max(Math.abs(dx), Math.abs(dy)) === 25;
    const knight = knightJump && ((currentExercise.afterFen && arrow.kind === 'move' ? new Chess(currentExercise.fen) : new Chess(before ? currentExercise.fen : currentExercise.afterFen || currentExercise.fen)).get(arrow.from)?.type === 'n' || ['knight_fork', 'fake_fork'].includes(currentExercise.category));
    const d = knight && Math.abs(dx) !== Math.abs(dy) ? 'M' + sx + ' ' + sy + ' L' + sx + ' ' + ey + ' L' + ex + ' ' + ey : 'M' + sx + ' ' + sy + ' L' + ex + ' ' + ey;
    return '<path class="teaching-line" d="' + d + '" fill="none" stroke="#fff8e6" stroke-opacity=".75" stroke-width="2.1" stroke-linecap="round"/><path class="teaching-line" d="' + d + '" fill="none" stroke="' + colors[arrow.kind] + '" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="' + dash + '" marker-end="url(#mk-' + arrow.kind + ')"/>';
  }).join('');
  const badges = before ? [] : currentExercise.overlay.badges;
  markup += badges.filter(b => b.role === 'target' || b.role === 'illusion').map(b => {
    const center = squareCenterCoords(b.square);
    return '<circle cx="' + center.x + '" cy="' + center.y + '" r="5.5" fill="none" stroke="#fff8e6" stroke-width="1.2"/><circle cx="' + center.x + '" cy="' + center.y + '" r="5.5" fill="none" stroke="#805300" stroke-width=".6"/>';
  }).join('');
  svg.innerHTML = markup;
  const list = document.getElementById('connectionList');
  list.innerHTML = visible.map(a => '<li><span class="line-key ' + layer(a.kind) + '"></span><code>' + a.from + ' → ' + a.to + '</code><span>' + descriptions[a.kind] + '</span></li>').join('');
  if (!visible.length) {
    const item = document.createElement('li');
    item.textContent = before ? 'Visualize the move first. Switch to After to inspect the changed relationships.' : allArrows.length ? 'All relevant layers are hidden. Enable a layer to see its connections.' : 'No additional rays in this example. Read the explanation above.';
    list.appendChild(item);
  }
}

function handleNativeBack() {
  if(courseSession){closeCourse();return true;}
  if(demoState){closeDemo();return true;}
  if(document.getElementById('trainingHelp').open){document.getElementById('trainingHelp').open=false;return true;}
  if (activeTab === 'today') return false;
  switchTab('today');
  return true;
}

function renderSummary() {
  const measured = sessionResults.filter(r => !r.assisted);
  const correct = measured.filter(r => r.correct).length;
  document.getElementById('summaryAccuracy').textContent = measured.length ? correct + '/' + measured.length + ' (' + Math.round(correct/measured.length*100) + '%)' : 'Guided';
  const typical = median(measured.filter(r => r.correct).map(recognitionLatency));
  document.getElementById('summarySpeed').textContent = typical === null ? '—' : (typical/1000).toFixed(1) + 's';
  document.getElementById('summaryEvidence').textContent = learningSessionKind === 'calibration' ? 'Calibration complete · '+(appData.learning.training.calibrations.at(-1)?.challenge || 'standard')+' recognition. This is not an Elo estimate.' : learningSessionKind === 'assessment' ? 'Assessment · fixed 5s exposure · held-out real-game positions. Separate from practice mastery.' : measured.length + ' independent recognition attempts · ' + (sessionResults.length-measured.length) + ' assisted. Principle checks and delayed recall are tracked separately.';
  document.getElementById('summaryMessage').textContent = correct === sessionResults.length ? 'Every connection found. Carry that clarity into your next game.' : 'Review the missed connections. Seeing why matters more than answering quickly.';
  if(learningSessionKind==='calibration'){
    const result=appData.learning.training.calibrations.find(c=>c.id===currentExercise.calibrationSessionId);
    if(result){document.getElementById('summaryAccuracy').textContent=result.correct+'/'+result.total+' ('+Math.round(result.accuracy*100)+'%)';document.getElementById('summarySpeed').textContent=result.medianMs===null?'—':(result.medianMs/1000).toFixed(1)+'s';document.getElementById('summaryEvidence').textContent='12 first attempts across real-game positions · '+result.challenge+' recognition. Separate from mastery and Elo.';document.getElementById('summaryMessage').textContent='Calibration saved on this device. Your practice now uses the recommended challenge; you can adjust it on Today.';}
  }
  const patterns = [...new Set(sessionQueue.map(exercise => CATEGORY_LABELS[exercise.category]))];
  document.getElementById('summaryPatterns').innerHTML = patterns.map(label => '<span class="pill">' + label + '</span>').join('');
}

function setImportBusy(id, busy) {
  const button = document.getElementById(id);
  button.disabled = busy;
  button.textContent = busy ? 'Loading…' : 'Import';
  button.setAttribute('aria-busy', String(busy));
}

async function fetchWithTimeout(input, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(input, { ...options, signal: controller.signal });
    // Consume the body within the timeout as well as the headers.
    const body = await response.text();
    return { ok: response.ok, status: response.status, text: async () => body, json: async () => JSON.parse(body) };
  } finally { clearTimeout(timeout); }
}



