const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assets = path.join(__dirname, '../app/src/main/assets');
const storage = fs.readFileSync(path.join(assets, 'storage.js'), 'utf8');
const trainer = fs.readFileSync(path.join(assets, 'trainer.js'), 'utf8');
const presentation = fs.readFileSync(path.join(assets, 'presentation.js'), 'utf8');
const checks = fs.readFileSync(path.join(assets, 'visual-checks.js'), 'utf8');
const visualFlow = fs.readFileSync(path.join(assets, 'visual-flow.js'), 'utf8');
const trainingContent=fs.readFileSync(path.join(assets,'training-content.js'),'utf8');
const experience = fs.readFileSync(path.join(assets, 'experience.js'), 'utf8');
const curriculum = fs.readFileSync(path.join(assets, 'curriculum.js'), 'utf8');
const learning = fs.readFileSync(path.join(assets, 'learning.js'), 'utf8');
const rules = fs.readFileSync(path.join(assets, 'vendor/chess-rules.js'), 'utf8');
const positions = fs.readFileSync(path.join(assets, 'positions.js'), 'utf8');
const recognition = fs.readFileSync(path.join(assets, 'recognition.js'), 'utf8');
const contrasts = fs.readFileSync(path.join(assets, 'contrasts.js'), 'utf8');
const sets = fs.readFileSync(path.join(assets, 'sets.js'), 'utf8');
const geometryData = fs.readFileSync(path.join(assets, 'geometry-course-data.js'), 'utf8');
const geometryRayEngine = fs.readFileSync(path.join(assets, 'geometry-ray-engine.js'), 'utf8');
const engineClient = fs.readFileSync(path.join(assets, 'engine-client.js'), 'utf8');
const woodpecker = fs.readFileSync(path.join(assets, 'woodpecker.js'), 'utf8');
const pgnImporter = fs.readFileSync(path.join(assets, 'pgn-importer.js'), 'utf8');
const geometryCourse = fs.readFileSync(path.join(assets, 'geometry-course.js'), 'utf8');
const html = fs.readFileSync(path.join(assets, 'index.html'), 'utf8');

test('original geometry algorithms and 14 starter seeds are unchanged', () => {
  const block = trainer.slice(trainer.indexOf('    // Geometry & Ray Tracing Functions'), trainer.indexOf('    // 5. LOCAL STORAGE'));
  assert.equal(crypto.createHash('sha256').update(block).digest('hex'), '631ebdfb2e33b9b371e17e57382277f9f625287604c01a5cc42e4de9e80f04ea');
});

// Small DOM fixture for controller checks; this is not a browser/layout emulator.
function fixture() {
  const nodes = new Map(), stored = new Map(), timers = new Map();
  let nextTimer = 0;
  function node(id = '') {
    const classes = new Set();
    const element = { id, dataset: {}, style: {}, children: [], value: '', textContent: '', disabled: false, attrs: {}, listeners: {},
      classList: { add: (...xs) => xs.forEach(x => classes.add(x)), remove: (...xs) => xs.forEach(x => classes.delete(x)), contains: x => classes.has(x), toggle: (x, force) => { const on = force ?? !classes.has(x); if (on) classes.add(x); else classes.delete(x); return on; } },
      setAttribute(k, v) { this.attrs[k] = String(v); }, getAttribute(k) { return this.attrs[k] ?? null; },
      addEventListener(k, fn) { this.listeners[k] = fn; }, appendChild(child) { this.children.push(child); },
      focus() { doc.activeElement = this; }, select() {}, click() { this.listeners.click?.({ target: this }); },
      querySelector() { return null; }, querySelectorAll() { return this.children; }
    };
    Object.defineProperty(element, 'innerHTML', { get() { return this._html || ''; }, set(value) { this._html = value; this.children = []; } });
    return element;
  }
  for (const match of html.matchAll(/id="([^"]+)"/g)) nodes.set(match[1], node(match[1]));
  const doc = { getElementById(id) { assert.ok(nodes.has(id), 'Missing DOM id: ' + id); return nodes.get(id); },
    createElement: () => node(), activeElement: null, body: node(), documentElement: node(),
    querySelector: () => node(), querySelectorAll(selector) { return selector === '#chessboardGrid button' ? nodes.get('chessboardGrid').children : []; },
    addEventListener() {}, execCommand: () => true
  };
  doc.documentElement.dataset.theme = 'dark';
  const context = vm.createContext({ console, document: doc, Date, Intl, URL, Blob, AbortController,
    localStorage: { getItem: key => stored.get(key) || null, setItem: (key, value) => stored.set(key, value) },
    setTimeout: (fn, duration) => { const id = ++nextTimer; timers.set(id, { fn, duration }); return id; }, clearTimeout: id => timers.delete(id),
    setInterval: (fn, duration) => { const id = ++nextTimer; timers.set(id, { fn, duration, interval: true }); return id; }, clearInterval: id => timers.delete(id),
    requestAnimationFrame: fn => fn(), fetch: async () => { throw new Error('Offline fixture'); },
    window: { addEventListener(type, fn) { if (type === 'DOMContentLoaded') this.boot = fn; }, scrollTo() {}, confirm: () => true }
  });
  vm.runInContext(storage + '\n' + rules + '\n' + trainer + '\n' + presentation + '\n' + curriculum + '\n' + contrasts + '\n' + sets + '\n' + positions + '\n' + recognition + '\n' + learning + '\n' + checks + '\n' + visualFlow + '\n' + trainingContent + '\n' + geometryData + '\n' + geometryRayEngine + '\n' + engineClient + '\n' + woodpecker + '\n' + pgnImporter + '\n' + geometryCourse + '\n' + experience, context);
  // Legacy scenarios use explicit select-and-submit helpers; new tests exercise drafts directly.
  vm.runInContext(`appData.learning=normalizedLearning(appData.learning);appData.learning.ui.demoSeen={single:true,multi:true,trace:true,verdict:true,flash:true,before:true};
    function answerSquare(sq){if(isRevealed)return;handleSquareTap(sq);if(currentExercise.quality && currentExercise.responseType==='select_set'){if(currentExercise.correctSquares.includes(sq))for(const s of currentExercise.correctSquares)if(!setSelections.has(s))handleSquareTap(s);commitDraft();return;}if(canCheckDraft() && currentExercise.responseType!=='select_set')commitDraft();}
    function answerVerdict(verdict){handleVerdictClick(verdict);if(canCheckDraft() && currentExercise.responseType!=='select_set')commitDraft();}
    function answerLegacyUnderstanding(index){if(!activeVisualCheck)return;openVisualUnderstanding();handleConceptTap(index===currentExercise.understanding.answer?activeVisualCheck.correctSquares[0]:ALL_SQUARES.find(s=>!activeVisualCheck.correctSquares.includes(s)));commitVisualUnderstanding();}
  `,context);
  return { context, nodes, stored, timers, doc, run: code => vm.runInContext(code, context), boot: () => context.window.boot() };
}

test('all controller IDs exist and HTML IDs are unique', () => {
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of (trainer + experience + learning).matchAll(/getElementById\(["']([^"']+)["']\)/g)) assert.ok(ids.includes(match[1]), match[1]);
});

test('boot initializes themes, inline board and empty progress without a server', () => {
  const f = fixture(); f.boot();
  assert.match(f.nodes.get('previewBoard').innerHTML, /preview-arrow/);
  assert.match(f.nodes.get('weaknessListContainer').innerHTML, /No independent attempts yet/);
  assert.equal(f.nodes.get('todayStatAttempts').textContent, '0');
});

test('all starter exercises and adaptive queues remain constructible', () => {
  const f = fixture();
  assert.equal(f.run('STARTER_SEEDS.length'), 14);
  assert.equal(f.run('STARTER_SEEDS.map(buildExerciseFromSeed).length'), 14);
  for (const mode of [null, 'geometry_xray', 'flash_vision', 'pattern_or_illusion', 'before_after']) {
    assert.ok(f.run('buildAdaptiveQueue(' + JSON.stringify(mode) + ', 8).length') > 0);
  }
});

test('initial chess position, move replay and attack rays', () => {
  const f = fixture();
  assert.equal(f.run('new Chess().moves().length'), 20);
  assert.equal(f.run('const game = new Chess(); game.move("e4"); game.move("e5"); game.move("Nf3"); game.get("f3").type'), 'n');
  assert.equal(f.run('getRaySegmentSquares("b2", "g7").join(",")'), 'b2,c3,d4,e5,f6,g7');
  assert.throws(() => f.run('new Chess("not a fen")'));
});

test('correct answer creates one persisted attempt and reveals geometry', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("geometry_xray", 2)); answerSquare(currentExercise.correctSquares[0]);');
  assert.equal(f.run('appData.attempts.length'), 1);
  assert.equal(f.run('appData.attempts[0].correct'), true);
  assert.match(f.nodes.get('geometryOverlaySvg').innerHTML, /marker/);
  f.run('answerSquare("a1")'); assert.equal(f.run('appData.attempts.length'), 1);
  assert.equal(JSON.parse(f.stored.get('chess_vision_local_state_v1')).attempts.length, 1);
});

test('wrong answer is explained and counted once', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("geometry_xray", 1)); answerSquare(ALL_SQUARES.find(s => !currentExercise.correctSquares.includes(s)));');
  assert.equal(f.run('appData.attempts[0].correct'), false);
  assert.ok(f.nodes.get('feedbackExplanation').textContent.length > 10);
});

test('verdict training requires both choices and exposes selected state', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("pattern_or_illusion", 1)); answerVerdict(currentExercise.correctOption);');
  assert.equal(f.run('isRevealed'), false);
  const selected = f.run('currentExercise.correctOption') === 'real' ? 'btnVerdictReal' : 'btnVerdictIllusion';
  assert.equal(f.nodes.get(selected).getAttribute('aria-pressed'), 'true');
  f.run('answerSquare(currentExercise.correctSquares[0]);'); assert.equal(f.run('appData.attempts[0].correct'), true);
});

test('flash cannot be answered during exposure, then hides pieces and accessible labels', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("flash_vision", 1)); startFlashExposure(currentExercise.flashDurationMs); answerSquare("a1");');
  assert.equal(f.run('isRevealed'), false); assert.equal(f.run('selectedSquare'), null);
  const timeout = [...f.timers.values()].find(timer => !timer.interval); timeout.fn();
  assert.equal(f.run('flashPhase'), 'masked');
  assert.ok(f.nodes.get('chessboardGrid').children.every(square => !square.getAttribute('aria-label').includes('White')));
  assert.ok(f.nodes.get('chessboardGrid').children.every(square => square.children.length <= 2));
  f.run('answerSquare(currentExercise.correctSquares[0])'); assert.equal(f.run('appData.attempts.length'), 1);
});

test('leaving flash invalidates exposure and restart unlocks the round', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("flash_vision", 1)); switchTab("today"); switchTab("train"); answerSquare("a1");');
  assert.equal(f.run('flashPhase'), 'invalidated'); assert.equal(f.run('appData.attempts.length'), 0);
  assert.equal(f.timers.size, 0);
  f.run('startFlashExposure(2000)'); assert.equal(f.run('flashPhase'), 'exposed');
});

test('untimed flash remains answerable and visible', () => {
  const f = fixture(); f.run('appData.untimedMode = true; startSprintSession(buildAdaptiveQueue("flash_vision", 1));');
  assert.equal(f.run('isFlashLocked()'), false); assert.equal(f.timers.size, 0);
  f.run('answerSquare(currentExercise.correctSquares[0])'); assert.equal(f.run('isRevealed'), true);
});

test('switching a paused flash round to untimed practice records its answer', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("flash_vision",1)); switchTab("today"); appData.untimedMode = true; updateUntimedSession(); switchTab("train"); answerSquare(currentExercise.correctSquares[0]);');
  assert.equal(f.run('appData.attempts.length'), 1);
});

test('before/after comparison never shows future attacks on the before board', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("before_after", 1)); answerSquare(currentExercise.correctSquares[0]);');
  assert.equal(f.run('viewingAfterFen'), true);
  f.run('showComparison(false)');
  assert.equal(f.nodes.get('btnShowBefore').getAttribute('aria-pressed'), 'true');
  assert.ok(!f.nodes.get('geometryOverlaySvg').innerHTML.includes('url(#mk-attack)'));
  f.run('showComparison(true)'); assert.equal(f.nodes.get('btnShowAfter').getAttribute('aria-pressed'), 'true');
});

test('board flip rotates square geometry and keyboard follows visual squares', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("geometry_xray", 1))');
  assert.equal(f.run('squareCenterCoords("a8").x'), 6.25);
  f.run('currentOrientation = "b"; renderBoardAndOverlay();');
  assert.equal(f.run('squareCenterCoords("a8").x'), 93.75);
  const first = f.nodes.get('chessboardGrid').children[0];
  f.context.keyEvent = { key: 'ArrowRight', currentTarget: first, preventDefault() {} };
  f.run('handleBoardKey(keyEvent)'); assert.equal(f.doc.activeElement, f.nodes.get('chessboardGrid').children[1]);
});

test('attack layer can be hidden independently of other lines', () => {
  const f = fixture(); f.run('startSprintSession([buildExerciseFromSeed(STARTER_SEEDS[0])]); answerSquare(currentExercise.correctSquares[0]); geometryLayers.attack = false; renderTeachingOverlay();');
  assert.ok(!f.nodes.get('geometryOverlaySvg').innerHTML.includes('url(#mk-attack)'));
  assert.ok(f.nodes.get('geometryOverlaySvg').innerHTML.includes('url(#mk-defense)'));
});

test('supported sample imports while empty and malformed imports report errors', () => {
  const f = fixture(); f.run('parsePgnAndBuildDrills(SAMPLE_TACTICAL_PGN)');
  assert.equal(f.run('activeTab'), 'train'); assert.equal(f.run('appData.gamesCount'), 1);
  f.run('parsePgnAndBuildDrills("")'); assert.match(f.nodes.get('gamesStatusBanner').textContent, /paste a PGN/);
  f.run('parsePgnAndBuildDrills("invalid moves")'); assert.match(f.nodes.get('gamesStatusBanner').textContent, /Could not extract/);
});

test('valid FEN creates a custom exercise and no-motif FEN is empty', () => {
  const f = fixture();
  assert.ok(f.run('generateExerciseFromArbitraryFen(STARTER_SEEDS[1].fen, "fixture")'));
  assert.equal(f.run('generateExerciseFromArbitraryFen("4k3/8/8/8/8/8/8/4K3 w - - 0 1", "empty")'), null);
});

test('v1 progress is reloaded and malformed backup attempts are rejected', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("geometry_xray", 1)); answerSquare(currentExercise.correctSquares[0]); appData.attempts = []; loadLocalState();');
  assert.equal(f.run('appData.attempts.length'), 1);
  assert.equal(f.run('isValidBackup({app:"chess-vision",schemaVersion:1,attempts:appData.attempts,gamesCount:2})'), true);
  for (const attempts of ['[null]', '[{}]', '[{correct:true,category:"pin"}]']) assert.equal(f.run('isValidBackup({app:"chess-vision",attempts:' + attempts + '})'), false);
  assert.equal(f.run('isValidBackup({app:"chess-vision",schemaVersion:2,attempts:[]})'), false);
});

test('storage failure is visible and does not lose the in-memory attempt', () => {
  const f = fixture(); f.run('localStorage.setItem = () => { throw new Error("Storage full"); }; startSprintSession(buildAdaptiveQueue("geometry_xray",1)); answerSquare(currentExercise.correctSquares[0]);');
  assert.equal(f.nodes.get('storageWarning').classList.contains('hidden'), false);
  assert.equal(f.run('appData.attempts.length'), 1);
});

test('completed session summary is stable and Practice starts a new set', () => {
  const f = fixture(); f.boot(); f.run('startSprintSession(buildAdaptiveQueue("geometry_xray",1)); answerSquare(currentExercise.correctSquares[0]);');
  f.run('answerLegacyUnderstanding(currentExercise.understanding.answer)');
  f.nodes.get('btnNextExercise').click();
  assert.equal(f.run('sessionQueue.length'), 0);
  assert.ok(f.nodes.get('summaryPatterns').innerHTML.includes('pill'));
  f.nodes.get('navBtnTrain').click(); assert.ok(f.run('sessionQueue.length') > 0);
});

test('restoring backup updates untimed switch and malformed restore preserves history', () => {
  const f = fixture(); f.boot();
  f.nodes.get('textareaBackupJson').value = JSON.stringify({ app:'chess-vision', schemaVersion:1, attempts:[], gamesCount:3, untimedMode:true });
  f.nodes.get('btnApplyPastedBackup').click(); assert.equal(f.nodes.get('chkUntimedMode').checked, true);
  assert.equal(f.run('appData.gamesCount'), 3);
  f.nodes.get('textareaBackupJson').value = '{bad'; f.nodes.get('btnApplyPastedBackup').click();
  assert.equal(f.run('appData.gamesCount'), 3);
});

test('native back returns home and leaves exposure invalidated', () => {
  const f = fixture(); f.run('startSprintSession(buildAdaptiveQueue("flash_vision",1))');
  assert.equal(f.run('handleNativeBack()'), true); assert.equal(f.run('activeTab'), 'today');
  assert.equal(f.run('flashPhase'), 'invalidated'); assert.equal(f.run('handleNativeBack()'), false);
});

test('optional network failure resets import control and explains offline fallback', async () => {
  const f = fixture(); f.boot(); f.nodes.get('inputLichessUser').value = 'example';
  await f.nodes.get('btnImportLichess').listeners.click();
  assert.equal(f.nodes.get('btnImportLichess').disabled, false);
  assert.match(f.nodes.get('gamesStatusBanner').textContent, /paste a PGN/);
});

test('training requires only bundled resources and retains zoom and reduced motion', () => {
  assert.ok(!/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(html));
  assert.ok(!html.includes('user-scalable=no'));
  assert.match(fs.readFileSync(path.join(assets, 'vision.css'), 'utf8'), /prefers-reduced-motion/);
});

test('curriculum has 12 lessons, 48 teaching drills, 28 contrasts, 6 set drills and 480 practice items', () => {
  const f = fixture();
  assert.equal(f.run('LEARNING_LESSONS.length'), 12);
  assert.equal(f.run('CURRICULUM_EXERCISES.length'), 48);
  assert.equal(f.run('CONTRAST_EXERCISES.length'), 28);
  assert.equal(f.run('SET_EXERCISES.length'), 6);
  assert.equal(f.run('allLearningExercises().length'), 480);
  assert.equal(f.run('new Set(allLearningExercises().map(e => e.id)).size'), 480);
  assert.equal(f.run('LEARNING_LESSONS.every(l => CURRICULUM_EXERCISES.filter(e => e.lessonId === l.id).length === 4)'), true);
});

test('every study position has valid geometry coordinates, two kings and a principle check', () => {
  const f = fixture();
  assert.equal(f.run(`CURRICULUM_EXERCISES.every(e => {
    const game = new Chess(e.fen);
    const pieces = game.board().flat().filter(Boolean);
    return pieces.filter(p => p.type === 'k' && p.color === 'w').length === 1 && pieces.filter(p => p.type === 'k' && p.color === 'b').length === 1 &&
      e.correctSquares.every(s => ALL_SQUARES.includes(s)) && e.overlay.arrows.every(a => ALL_SQUARES.includes(a.from) && ALL_SQUARES.includes(a.to)) &&
      e.understanding.options[e.understanding.answer] && e.explanation.length > 30;
  })`), true);
});

test('all declared attack and nonattack assertions match actual blockers and movement', () => {
  const f = fixture();
  assert.equal(f.run(`CURRICULUM_EXERCISES.every(e => (e.checks || []).every(([kind, from, to, color]) => {
    const attacks = new Chess(e.fen).attackers(to, color).includes(from);
    return kind === 'attack' ? attacks : !attacks;
  }))`), true);
});

test('fork destination attacks both targets while its guarded counterexample is defended', () => {
  const f = fixture();
  assert.equal(f.run(`const fork = new Chess(CURRICULUM_EXERCISES.find(e => e.id === 'learn-forks-1').fen); fork.move({from:'d5',to:'c7'}); fork.attackers('e8','w').includes('c7') && fork.attackers('a8','w').includes('c7')`), true);
  assert.equal(f.run("new Chess(CURRICULUM_EXERCISES.find(e => e.id === 'learn-forks-2').fen).attackers('c7','b').includes('b8')"), true);
});

test('before/after curriculum snapshots exactly match the declared legal moves', () => {
  const f = fixture();
  assert.equal(f.run(`CURRICULUM_EXERCISES.filter(e => e.afterFen).every(e => { const game = new Chess(e.fen); game.move(e.moveSan); return game.fen().split(' ').slice(0,2).join(' ') === e.afterFen.split(' ').slice(0,2).join(' '); })`), true);
});

test('absolute pin and false pin differ in their number of blockers', () => {
  const f = fixture();
  assert.equal(f.run("detectPins(CURRICULUM_EXERCISES.find(e=>e.id==='learn-alignment-1').fen).some(p=>p.pinnedPiece.square==='e7' && p.isTruePin)"), true);
  assert.equal(f.run("new Chess(CURRICULUM_EXERCISES.find(e=>e.id==='learn-alignment-3').fen).attackers('e7','w').includes('e1')"), false);
});

test('passed-pawn and supported-outpost diagrams have their claimed pawn geometry', () => {
  const f = fixture();
  assert.equal(f.run(`const passed = new Chess(CURRICULUM_EXERCISES.find(e=>e.id==='learn-pawns-3').fen); !passed.board().flat().filter(Boolean).some(p => p.type==='p' && p.color==='b' && Math.abs(FILES.indexOf(p.square[0])-FILES.indexOf('e')) <= 1 && Number(p.square[1]) > 5)`), true);
  assert.equal(f.run("new Chess(CURRICULUM_EXERCISES.find(e=>e.id==='learn-positional-2').fen).attackers('d5','w').includes('e4')"), true);
});

test('lesson opens educational steps and worked example creates no scored attempt', () => {
  const f = fixture(); f.boot(); f.run("openLesson('board'); showWorkedExample('board')");
  assert.equal(f.run('appData.attempts.length'), 0);
  assert.equal(f.run('isRevealed'), false);
  f.run('answerSquare(currentExercise.correctSquares[0])');
  assert.equal(f.run('appData.attempts.length'),0);
  assert.equal(f.nodes.get('btnNextExercise').textContent, 'Return to lesson →');
  f.nodes.get('btnNextExercise').click(); assert.equal(f.run('activeTab'), 'learn');
});

test('guided practice records assistance and cannot count as independent retrieval', () => {
  const f = fixture(); f.boot(); f.run("startLessonPractice('board',true); answerSquare(currentExercise.correctSquares[0]); answerLegacyUnderstanding(currentExercise.understanding.answer)");
  assert.equal(f.run('appData.attempts[0].hintUsed'), true);
  assert.equal(f.run('independentSuccess(appData.attempts[0])'), false);
});

test('understanding check gates progression and persists one first-response result', () => {
  const f = fixture(); f.run("startSprintSession([CURRICULUM_EXERCISES[0]]); answerSquare('e4')");
  assert.equal(f.nodes.get('btnNextExercise').disabled, true);
  f.run('answerLegacyUnderstanding(currentExercise.understanding.answer)');
  assert.equal(f.nodes.get('btnNextExercise').disabled, false);
  assert.equal(f.run('independentSuccess(appData.attempts[0])'), true);
  f.run('answerLegacyUnderstanding(2)'); assert.equal(f.run('appData.attempts[0].understandingCorrect'), true);
});

test('incorrect principle answer is tracked separately from a correct square', () => {
  const f = fixture(); f.run("startSprintSession([CURRICULUM_EXERCISES[0]]); answerSquare('e4'); answerLegacyUnderstanding((currentExercise.understanding.answer+1)%3)");
  assert.equal(f.run('appData.attempts[0].correct'), true);
  assert.equal(f.run('appData.attempts[0].understandingCorrect'), false);
  assert.equal(f.run('independentSuccess(appData.attempts[0])'), false);
});

test('v1 historical answers remain visible without being misreported as new mastery', () => {
  const f = fixture(); f.run(`appData.attempts = [{exerciseId:'learn-board-1',category:'board_fluency',correct:true,isTruePattern:true,timestamp:100,responseTimeMs:500}];`);
  assert.equal(f.run("lessonEvidence('board').attempts"), 1);
  assert.equal(f.run("lessonEvidence('board').uniqueIndependent"), 0);
});

test('spacing uses 1/3/7-day stages and immediate repetition cannot advance a stage', () => {
  const f = fixture();
  f.run(`const success = t => ({exerciseId:'learn-board-1',timestamp:t,correct:true,hintUsed:false,reflashUsed:false,understandingCorrect:true}); appData.attempts = [success(1000),success(2000)];`);
  assert.equal(f.run("itemSchedule('learn-board-1',2000).stage"), 1);
  f.run('appData.attempts.push(success(DAY_MS+2000))');
  assert.equal(f.run("itemSchedule('learn-board-1',DAY_MS+2000).stage"), 2);
  assert.equal(f.run("itemSchedule('learn-board-1',DAY_MS+2000).dueAt"), 4*86400000+2000);
  f.run('appData.attempts.push(success(4*DAY_MS+2000))');
  assert.equal(f.run("itemSchedule('learn-board-1',4*DAY_MS+2000).stage"), 3);
});

test('a lapse or assisted answer resets the stage and queues short repair review', () => {
  const f = fixture(); f.run(`appData.attempts=[{exerciseId:'learn-board-1',timestamp:1000,correct:false,hintUsed:false,reflashUsed:false,understandingCorrect:true}];`);
  assert.equal(f.run("itemSchedule('learn-board-1',601000).due"), true);
  assert.equal(f.run("itemSchedule('learn-board-1',1000).stage"), 0);
  assert.equal(f.run("itemSchedule('learn-board-2',Date.now()).seen"), false);
});

test('retention requires distinct items and delayed independent successes', () => {
  const f = fixture(); f.run(`const win = (id,t) => ({exerciseId:'learn-board-'+id,timestamp:t,correct:true,hintUsed:false,reflashUsed:false,understandingCorrect:true}); appData.attempts=[win(1,1000),win(1,DAY_MS+2000),win(2,1000),win(2,DAY_MS+2000),win(3,1000)];`);
  assert.equal(f.run("lessonEvidence('board').status"), 'Retention evidence');
  f.run('appData.attempts = appData.attempts.filter(a => a.exerciseId === "learn-board-1")');
  assert.notEqual(f.run("lessonEvidence('board').status"), 'Retention evidence');
});

test('mixed queue is unique, interleaved and prioritizes overdue positions', () => {
  const f = fixture(); f.run(`appData.attempts=[{exerciseId:'learn-endgames-4',timestamp:0,correct:false}];`);
  assert.equal(f.run("buildLearningQueue(null,8,Date.now())[0].id"), 'learn-endgames-4');
  assert.equal(f.run('new Set(buildLearningQueue(null,8).map(e=>e.id)).size'), 8);
  assert.equal(f.run('buildLearningQueue(null,8).every((e,i,a)=>i===0||e.lessonId!==a[i-1].lessonId)'), true);
});

test('learning metadata and reflections survive save, reload and JSON backup restore', () => {
  const f = fixture(); f.boot(); f.run("openLesson('board')");
  f.nodes.get('inputReflection').value = 'Count the blockers first.'; f.nodes.get('btnSaveReflection').click();
  f.run('appData.learning = normalizedLearning(null); loadLocalState()');
  assert.equal(f.run('appData.learning.notes[0].text'), 'Count the blockers first.');
  assert.ok(f.run('appData.learning.lessonsViewed.board') > 0);
  f.nodes.get('btnExportBackup').click();
  const backup = JSON.parse(f.nodes.get('textareaBackupJson').value);
  assert.equal(backup.learning.notes[0].text, 'Count the blockers first.');
});

test('confidence is optional, preserved and never changes correctness', () => {
  const f = fixture(); f.run("startSprintSession([CURRICULUM_EXERCISES[0]]); currentConfidence=3; answerSquare('a1')");
  assert.equal(f.run('appData.attempts[0].confidence'), 3);
  assert.equal(f.run('appData.attempts[0].correct'), false);
});

test('bundled rules support castling, en passant and promotion', () => {
  const f=fixture();
  assert.equal(f.run(`const castle=new Chess(); ['e4','e5','Nf3','Nc6','Bc4','Nf6','O-O'].forEach(m=>castle.move(m)); castle.get('g1').type==='k' && castle.get('f1').type==='r'`),true);
  assert.equal(f.run(`const ep=new Chess('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1'); ep.move('exd6'); ep.get('d6').color==='w' && ep.get('d5')===null`),true);
  assert.equal(f.run(`const promotion=new Chess('7k/P7/8/8/8/8/8/7K w - - 0 1'); promotion.move('a8=Q+'); promotion.get('a8').type`),'q');
});

test('geometric knight control is distinguished from a pinned knight’s legal moves', () => {
  const f=fixture();
  assert.equal(f.run(`const pinned=new Chess('k3r3/8/8/8/8/8/4N3/4K3 w - - 0 1'); pinned.attackers('d4','w').includes('e2') && !pinned.moves({square:'e2',verbose:true}).some(m=>m.to==='d4')`),true);
});

test('PGN importer accepts castling, comments, variations and NAGs without partial-game scoring',()=>{
  const f=fixture();
  f.context.pgn='[Event "Castle test"]\n\n1. e4 {center} e5 2. Nf3 (2. Bc4) Nc6 3. Bc4 Nf6 4. O-O $1 Bc5 5. d3 d6 *';
  f.run('parsePgnAndBuildDrills(pgn)');
  assert.equal(f.run('appData.gamesCount'),1);
  assert.ok(f.run('sessionQueue.length')>0);
  f.run('parsePgnAndBuildDrills("1. e4 e5 2. impossible")');
  assert.equal(f.run('appData.gamesCount'),1);
});

test('480 CC0 real-game exercises include 96 held-out items and no source-game leakage',()=>{
  const f=fixture();
  assert.equal(f.run('REAL_GAME_EXERCISES.length'),480);
  assert.equal(f.run('REAL_GAME_EXERCISES.filter(e=>e.assessmentOnly).length'),96);
  assert.equal(f.run(`const gameKey=e=>e.source.game.split('#')[0].replace('/white','').replace('/black',''); const held=new Set(REAL_GAME_EXERCISES.filter(e=>e.assessmentOnly).map(gameKey)); REAL_GAME_EXERCISES.filter(e=>!e.assessmentOnly).every(e=>!held.has(gameKey(e)))`),true);
  assert.equal(f.run('allLearningExercises().some(e=>e.assessmentOnly)'),false);
});

test('all 480 source targets agree between chess.js and independently recorded python-chess facts',()=>{
  const f=fixture();
  assert.equal(f.run(`REAL_GAME_EXERCISES.every(e=>{
    const game=new Chess(e.afterFen || e.fen), square=e.validation.target, piece=game.get(square);
    if(!piece)return false;
    const atk=game.attackers(square,piece.color==='w'?'b':'w').sort();
    const def=game.attackers(square,piece.color).sort();
    return JSON.stringify(atk)===JSON.stringify(e.validation.attackers.slice().sort()) && JSON.stringify(def)===JSON.stringify(e.validation.defenders.slice().sort());
  })`),true);
});

test('every real-game transformation exactly replays the source setup move',()=>{
  const f=fixture();
  assert.equal(f.run(`REAL_GAME_EXERCISES.filter(e=>e.afterFen).every(e=>{
    const game=new Chess(e.fen), move=e.source.setupMove; game.move({from:move.slice(0,2),to:move.slice(2,4),promotion:move[4]});
    return game.fen()===e.afterFen;
  })`),true);
});

test('paired contrast answers are independently derived from the board geometry',()=>{
  const f=fixture();
  assert.equal(f.run(`CONTRAST_EXERCISES.every(e=>{
    const game=new Chess(e.fen), v=e.contrastVerifier;
    let result;
    if(v.kind==='attack') result=game.attackers(v.target,v.color).some(s=>v.from?s===v.from:game.get(s).type===v.fromType);
    if(v.kind==='undefended') result=game.attackers(v.target,v.color==='w'?'b':'w').length>0 && game.attackers(v.target,v.color).length===0;
    if(v.kind==='support') result=game.attackers(v.target,v.color).some(s=>game.get(s).type==='p');
    if(v.kind==='pin') result=detectPins(e.fen).some(p=>p.isTruePin&&p.pinType==='absolute'&&p.pinnedPiece.square===v.target);
    if(v.kind==='fork') { game.move({from:v.from,to:v.target}); result=game.attackers(v.target,'b').length===0; }
    if(v.kind==='afterAttack') { game.move(e.afterMove); result=game.attackers(v.target,v.color).includes(v.from); }
    if(v.kind==='twoDuties') result=v.targets.every(t=>game.attackers(t,v.color).includes(v.from));
    if(v.kind==='passed') { const target=sqToCoords(v.target); result=!game.board().flat().filter(Boolean).some(p=>p.type==='p'&&p.color==='b'&&Math.abs(sqToCoords(p.square).file-target.file)<=1&&sqToCoords(p.square).rank>target.rank); }
    if(v.kind==='opposition') { const kings=game.board().flat().filter(p=>p?.type==='k').map(p=>sqToCoords(p.square));result=kings[0].file===kings[1].file&&Math.abs(kings[0].rank-kings[1].rank)===2; }
    if(v.kind==='legalCapture') result=game.moves({square:v.from,verbose:true}).some(m=>m.to===v.target);
    return result===e.isTruePattern;
  })`),true);
});

test('relationship tracing scores the full attacker-target-defender sequence',()=>{
  const f=fixture();f.run("startActivity('relationship_trace')");
  assert.equal(f.run('currentExercise.traceSteps.length'),3);
  f.run('answerSquare(currentExercise.traceSteps[0].squares[0])');assert.equal(f.run('isRevealed'),false);
  f.run('answerSquare(currentExercise.traceSteps[1].squares[0]);answerSquare(currentExercise.traceSteps[2].squares[0])');
  assert.equal(f.run('appData.attempts[0].correct'),true);
});

test('wrong trace origin is diagnosed even if the final defender square is right',()=>{
  const f=fixture();f.run(`startActivity('relationship_trace'); answerSquare(ALL_SQUARES.find(s=>!currentExercise.traceSteps[0].squares.includes(s))); answerSquare(currentExercise.traceSteps[1].squares[0]);answerSquare(currentExercise.traceSteps[2].squares[0])`);
  assert.equal(f.run('appData.attempts[0].correct'),false);
  assert.equal(f.run('appData.attempts[0].errorCategory'),'missed_attacker');
});

test('assessment enforces fixed exposure even with untimed practice enabled and disables assistance',()=>{
  const f=fixture();f.boot();f.run('appData.untimedMode=true;startAssessment()');
  assert.equal(f.run('isFlashLocked()'),true);
  assert.equal(f.run('currentExercise.flashDurationMs'),5000);
  assert.equal(f.nodes.get('btnToggleHint').disabled,true);
  assert.equal(f.nodes.get('btnReflash').disabled,true);
  f.nodes.get('btnToggleHint').listeners.click();f.nodes.get('btnReflash').listeners.click();
  assert.equal(f.run('currentHintUsed'),false);assert.equal(f.run('currentReflashUsed'),false);
});

test('assessment interruption is excluded and exposed items are not reused as unfamiliar',()=>{
  const f=fixture();f.run('startAssessment();const exposedId=currentExercise.id;switchTab("today");switchTab("train");startFlashExposure(5000)');
  [...f.timers.values()].find(t=>!t.interval).fn();
  f.run('answerSquare(currentExercise.correctSquares[0])');
  assert.equal(f.run('appData.attempts[0].validAssessmentExposure'),false);
  f.run('startAssessment()');assert.notEqual(f.run('currentExercise.id'),f.run('exposedId'));
});

test('assessment results never change practice mastery, adaptive metrics or review schedules',()=>{
  const f=fixture();f.run('startAssessment();startFlashExposure(5000)');[...f.timers.values()].find(t=>!t.interval).fn();
  f.run('answerSquare(currentExercise.correctSquares[0]);answerLegacyUnderstanding(currentExercise.understanding.answer)');
  assert.equal(f.run('appData.attempts[0].validAssessmentExposure'),true);
  assert.equal(f.run('recognitionMetrics().count'),0);
  assert.equal(f.run('independentSuccess(appData.attempts[0])'),false);
  assert.equal(f.run('itemSchedule(currentExercise.id).seen'),false);
});

test('time pressure promotion requires varied accurate recognition across separate days',()=>{
  const f=fixture();f.run(`appData.attempts=Array.from({length:30},(_,i)=>({exerciseId:'same',lessonId:'memory',timestamp:i*DAY_MS,correct:true,hintUsed:false,reflashUsed:false,sessionKind:'recognition'}))`);
  assert.equal(f.run("exposureForLesson('memory')"),6000);
  f.run(`appData.attempts=Array.from({length:10},(_,i)=>({exerciseId:'different-'+i,lessonId:'memory',timestamp:i%2*DAY_MS,correct:true,hintUsed:false,reflashUsed:false,sessionKind:'recognition'}))`);
  assert.equal(f.run("exposureForLesson('memory')"),4000);
});

test('recognition metrics use correct-response medians and false-positive denominators',()=>{
  const f=fixture();f.run(`appData.attempts=[100,300,8000].map((time,i)=>({hintUsed:false,reflashUsed:false,sessionKind:'recognition',correct:true,responseTimeMs:time,responseType:'verdict_and_square',isTruePattern:false,selectedVerdict:i===2?'real':'illusion'}))`);
  assert.equal(f.run('recognitionMetrics().medianMs'),300);
  assert.equal(f.run('recognitionMetrics().falsePositiveRate'),33);
});

test('set answers require all expected squares and reject an incomplete or extra selection',()=>{
  const f=fixture();f.boot();f.run('startSprintSession([SET_EXERCISES[1]]);answerSquare("d7")');
  assert.equal(f.run('isRevealed'),false);
  f.nodes.get('btnSubmitSet').click(); assert.equal(f.run('appData.attempts[0].correct'),false);
  f.run('startSprintSession([SET_EXERCISES[1]]);answerSquare("d7");answerSquare("h5");answerSquare("a1")');
  f.nodes.get('btnSubmitSet').click();assert.equal(f.run('appData.attempts[1].correct'),false);
  f.run('startSprintSession([SET_EXERCISES[1]]);answerSquare("d7");answerSquare("h5")');
  f.nodes.get('btnSubmitSet').click();assert.equal(f.run('appData.attempts[2].correct'),true);
});

test('all-knight-target and all-defender sets exactly match the rules library',()=>{
  const f=fixture();
  assert.equal(f.run(`const knightSet=SET_EXERCISES[4]; JSON.stringify(new Chess(knightSet.fen).moves({square:'d4',verbose:true}).map(m=>m.to).sort())===JSON.stringify(knightSet.correctSquares.slice().sort())`),true);
  assert.equal(f.run(`const defenderSet=SET_EXERCISES[1];JSON.stringify(new Chess(defenderSet.fen).attackers('g4','b').sort())===JSON.stringify(defenderSet.correctSquares.slice().sort())`),true);
});

test('legacy flash examples no longer mislabel a defended or unattacked piece as hanging',()=>{
  const f=fixture();
  assert.equal(f.run(`const nine=allLearningExercises().find(e=>e.id==='starter-09-flash-f7-battery'); new Chess(nine.fen).attackers('f7','b').length>0 && nine.category==='pressure_target'`),true);
  assert.equal(f.run(`const ten=allLearningExercises().find(e=>e.id==='starter-10-flash-undefended-knight'); new Chess(ten.fen).attackers('g4','w').length===0 && ten.category==='memory_chunks'`),true);
});

test('recognition targets without a verdict do not disclose their answer square in the prompt',()=>{
  const f=fixture();
  assert.equal(f.run(`REAL_GAME_EXERCISES.filter(e=>!e.traceSteps && e.responseType==='select_square').every(e=>!e.correctSquares.some(s=>new RegExp('\\\\b'+s+'\\\\b').test(e.prompt)))`),true);
});

test('native storage migrates existing v1 progress without clearing history', () => {
  const f = fixture(), durable = new Map();
  f.stored.set('chess_vision_local_state_v1', JSON.stringify({attempts:[], gamesCount:7, untimedMode:true, learning:{notes:[]}}));
  f.context.ChessVisionStorage = { getItem: key => durable.get(key), setItem(key,value) { durable.set(key,value); return true; } };
  f.run('loadLocalState()');
  assert.equal(f.run('appData.gamesCount'),7);
  assert.equal(f.run('appData.untimedMode'),true);
  assert.equal(durable.get('chess_vision_local_state_v1'),f.stored.get('chess_vision_local_state_v1'));
});

test('committed native progress wins over a stale WebView mirror after restart', () => {
  const f = fixture();
  const latest=JSON.stringify({attempts:[], gamesCount:9, untimedMode:true, learning:{notes:[]}});
  f.stored.set('chess_vision_local_state_v1',JSON.stringify({attempts:[],gamesCount:1}));
  f.context.ChessVisionStorage = { getItem: () => latest, setItem() { throw Error('must not overwrite committed native data'); } };
  f.run('loadLocalState()');
  assert.equal(f.run('appData.gamesCount'),9);
  assert.equal(f.stored.get('chess_vision_local_state_v1'),latest);
});

test('native commit survives Web storage failure and is readable in a fresh context', () => {
  const durable=new Map();
  const bridge={getItem:key=>durable.get(key)??null,setItem(key,value){durable.set(key,value);return true;}};
  const f=fixture(); f.context.ChessVisionStorage=bridge;
  f.context.localStorage.setItem=()=>{throw Error('WebView mirror unavailable');};
  f.run('appData.gamesCount=11;saveLocalState()');
  assert.equal(f.nodes.get('storageWarning').classList.contains('hidden'),true);
  const reopened=fixture(); reopened.context.ChessVisionStorage=bridge;
  reopened.run('loadLocalState()');
  assert.equal(reopened.run('appData.gamesCount'),11);
});

test('failed native commit is reported and never claimed as a successful browser-only save', () => {
  const f=fixture();
  f.context.ChessVisionStorage={getItem:()=>null,setItem:()=>false};
  f.run('appData.gamesCount=12;saveLocalState()');
  assert.equal(f.nodes.get('storageWarning').classList.contains('hidden'),false);
  assert.equal(f.stored.has('chess_vision_local_state_v1'),false);
  assert.equal(f.run('appData.gamesCount'),12);
});


test('all 576 questions have explicit compact presentation preserving their original task',()=>{
  const f=fixture();
  assert.equal(f.run('Object.keys(PRESENTATION_CATALOG).length'),576);
  assert.equal(f.run('[...allLearningExercises(),...REAL_GAME_EXERCISES.filter(e=>e.assessmentOnly).map(attachLesson)].every(e=>e.presentation.fullGoal===e.prompt && e.presentation.goal.length>3 && e.presentation.goal.length<=80)'),true);
});

test('24 separate visual checks have two variants per lesson and rule-verified answers',()=>{
  const f=fixture();
  assert.equal(f.run('VISUAL_CHECKS.length'),24);
  assert.equal(f.run('LEARNING_LESSONS.every(l=>VISUAL_CHECKS.filter(c=>c.lessonId===l.id).length===2)'),true);
  assert.equal(f.run(`VISUAL_CHECKS.every(check=>{
    const board=new Chess(check.fen),a=check.assertion;
    if(a.kind==='blocked'||a.kind==='pin'){
      if(board.attackers(a.to,a.color).includes(a.from)||!board.get(a.blocker))return false;
      board.remove(a.blocker);return board.attackers(a.to,a.color).includes(a.from);
    }
    return board.attackers(a.to,a.color).includes(a.from);
  })`),true);
  assert.equal(f.run('VISUAL_CHECKS.every(c=>!REAL_GAME_EXERCISES.some(e=>e.assessmentOnly && e.fen===c.fen))'),true);
});

test('single-target taps remain editable and Check alone scores one answer',()=>{
  const f=fixture();f.boot();f.run('startSprintSession([CURRICULUM_EXERCISES[0]]);handleSquareTap("a1");handleSquareTap("e4")');
  assert.equal(f.run('appData.attempts.length'),0);assert.equal(f.run('isRevealed'),false);
  assert.equal(f.run('selectedSquare'),'e4');assert.equal(f.nodes.get('btnCheckAnswer').disabled,false);
  f.nodes.get('btnCheckAnswer').click();assert.equal(f.run('appData.attempts.length'),1);assert.equal(f.run('appData.attempts[0].correct'),true);
  f.run('commitDraft()');assert.equal(f.run('appData.attempts.length'),1);
});

test('verdict and target can both be revised before committing',()=>{
  const f=fixture();f.boot();f.run(`startSprintSession(buildAdaptiveQueue('pattern_or_illusion',1));handleVerdictClick('real');handleSquareTap('a1');handleVerdictClick(currentExercise.correctOption);handleSquareTap(currentExercise.correctSquares[0])`);
  assert.equal(f.run('appData.attempts.length'),0);f.run('commitDraft()');assert.equal(f.run('appData.attempts[0].correct'),true);
});

test('multi-target drafts toggle selections without recording attempts',()=>{
  const f=fixture();f.boot();f.run(`startSprintSession([SET_EXERCISES[1]]);handleSquareTap('a1');handleSquareTap('a1');handleSquareTap('d7');handleSquareTap('h5')`);
  assert.equal(f.run('setSelections.size'),2);assert.equal(f.run('appData.attempts.length'),0);
  f.run('commitDraft()');assert.equal(f.run('appData.attempts[0].correct'),true);
});

test('trace draft supports Undo and Reset and never submits on its third tap',()=>{
  const f=fixture();f.boot();f.run(`startActivity('relationship_trace');handleSquareTap(currentExercise.traceSteps[0].squares[0]);undoDraft()`);
  assert.equal(f.run('traceSelections.length'),0);
  f.run('currentExercise.traceSteps.forEach(step=>handleSquareTap(step.squares[0]))');
  assert.equal(f.run('appData.attempts.length'),0);assert.equal(f.run('canCheckDraft()'),true);
  f.run('resetDraft()');assert.equal(f.run('traceSelections.length'),0);
  f.run('currentExercise.traceSteps.forEach(step=>handleSquareTap(step.squares[0]));commitDraft()');assert.equal(f.run('appData.attempts[0].correct'),true);
});

test('recognition timing ends at the final selection change, excluding Check delay',()=>{
  const f=fixture();let now=100000;const NativeDate=Date;
  f.context.Date=class extends NativeDate {constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}};
  f.boot();f.run('startSprintSession([CURRICULUM_EXERCISES[0]])');now=101000;f.run('handleSquareTap("a1")');now=102000;f.run('handleSquareTap("e4")');now=110000;f.run('commitDraft()');
  assert.equal(f.run('appData.attempts[0].responseTimeMs'),2000);assert.equal(f.run('appData.attempts[0].decisionTimeMs'),2000);
});

test('visual understanding uses a separate board and records its first answer once',()=>{
  const f=fixture();f.boot();f.run('startSprintSession([CURRICULUM_EXERCISES[0]]);handleSquareTap("e4");commitDraft();openVisualUnderstanding()');
  assert.equal(f.run('uiStage'),'understanding');assert.equal(f.nodes.get('conceptBoard').children.length,64);
  f.run('handleConceptTap(ALL_SQUARES.find(s=>!activeVisualCheck.correctSquares.includes(s)));commitVisualUnderstanding()');
  assert.equal(f.run('appData.attempts[0].understandingCorrect'),false);
  assert.equal(f.run('appData.attempts[0].understandingKind'),'visual');
  f.run('handleConceptTap(activeVisualCheck.correctSquares[0]);commitVisualUnderstanding()');
  assert.equal(f.run('appData.attempts.length'),1);assert.equal(f.run('appData.attempts[0].understandingCorrect'),false);
});

test('interactive worked examples expose teaching guidance but never create a scored attempt',()=>{
  const f=fixture();f.boot();f.run("showWorkedExample('pressure');handleSquareTap(currentExercise.correctSquares[0]);commitDraft()");
  assert.equal(f.run('isRevealed'),true);assert.equal(f.run('appData.attempts.length'),0);
  assert.equal(f.run('appData.learning.ui.workedSeen.includes(currentExercise.id)'),true);
  assert.equal(f.nodes.get('btnNextExercise').disabled,false);
});

test('all six interaction demonstrations teach on an unrelated unscored board',()=>{
  const f=fixture();f.boot();
  for(const family of ['single','multi','trace','verdict','before','flash']){
    f.run(`startSprintSession([CURRICULUM_EXERCISES[0]]);openDemo('${family}')`);
    assert.equal(f.run('demoState.family'),family);assert.equal(f.run('appData.attempts.length'),0);
    if(family==='flash'){f.nodes.get('demoStart').click();[...f.timers.values()].find(t=>!t.interval).fn();}
    if(family==='verdict')f.nodes.get('demoNo').click();
    f.run('demoSpec(demoState.family).targets.forEach(demoTap);checkDemo()');
    assert.equal(f.run('demoState.done'),true);f.nodes.get('demoFinish').click();
    assert.equal(f.run(`appData.learning.ui.demoSeen['${family}']`),true);
  }
  assert.equal(f.run('appData.attempts.length'),0);
});

test('first-use demonstration opens automatically, supports Skip and does not repeat',()=>{
  const f=fixture();f.boot();f.run('appData.learning.ui.demoSeen={};startSprintSession([CURRICULUM_EXERCISES[0]])');
  assert.equal(f.run('demoState.family'),'single');f.nodes.get('demoSkip').click();
  assert.equal(f.run('appData.attempts.length'),0);f.run('startSprintSession([CURRICULUM_EXERCISES[0]])');assert.equal(f.run('demoState'),null);
});

test('flash starts on demand and cannot be submitted while observing',()=>{
  const f=fixture();f.boot();f.run('startSprintSession(buildAdaptiveQueue("flash_vision",1))');
  assert.equal(f.run('flashPhase'),'ready');assert.equal(f.timers.size,0);f.run('handleSquareTap("e4");commitDraft()');assert.equal(f.run('appData.attempts.length'),0);
  f.nodes.get('btnStartExposure').click();assert.equal(f.run('flashPhase'),'exposed');f.run('commitDraft()');assert.equal(f.run('appData.attempts.length'),0);
});

test('assessment never starts a tutorial or visual concept-check and retains fixed exposure',()=>{
  const f=fixture();f.boot();f.run('appData.learning.ui.demoSeen={};startAssessment()');assert.equal(f.run('demoState'),null);
  assert.equal(f.run('currentExercise.flashDurationMs'),5000);assert.equal(f.nodes.get('btnToggleHint').disabled,true);
  f.nodes.get('btnStartExposure').click();[...f.timers.values()].find(t=>!t.interval).fn();f.run('handleSquareTap(currentExercise.correctSquares[0]);commitDraft()');
  assert.equal(f.run('activeVisualCheck'),null);assert.equal(f.run('appData.attempts[0].validAssessmentExposure'),true);
});

test('Help does not contain the solution or previous geometry before submission',()=>{
  const f=fixture();f.boot();f.run('startSprintSession([CURRICULUM_EXERCISES[0]])');
  assert.equal(f.nodes.get('fullExplanation').textContent,'');assert.equal(f.nodes.get('geometryControls').classList.contains('hidden'),true);
  assert.equal(f.nodes.get('connectionList').textContent,'');
});

test('demonstration history is additive and survives backup while old written evidence stays unchanged',()=>{
  const f=fixture();f.run(`appData.learning=normalizedLearning({notes:[],ui:{demoSeen:{single:true},workedSeen:['learn-board-1']}});saveLocalState();loadLocalState()`);
  assert.equal(f.run('appData.learning.ui.demoSeen.single'),true);assert.equal(f.run('appData.learning.ui.workedSeen[0]'),'learn-board-1');
  assert.equal(f.run('independentSuccess({correct:true,hintUsed:false,reflashUsed:false,understandingCorrect:true,sessionKind:"lesson"})'),true);
});

test('coach guides selection and submission without recording draft attempts',()=>{
  const f=fixture();f.boot();f.run('startSprintSession([attachLesson(buildExerciseFromSeed(STARTER_SEEDS[0]))])');
  assert.match(f.nodes.get('draftStatus').textContent,/Tap one matching piece or square/);
  f.run('handleSquareTap(currentExercise.correctSquares[0])');
  assert.match(f.nodes.get('draftStatus').textContent,/selected.*Check/);assert.equal(f.run('appData.attempts.length'),0);
  f.run('commitDraft()');assert.match(f.nodes.get('draftStatus').textContent,/Understand/);assert.equal(f.run('appData.attempts.length'),1);
});
test('coach advances tracing one relationship at a time',()=>{
  const f=fixture();f.boot();f.run('startSprintSession([allLearningExercises().find(e=>e.traceSteps)])');
  assert.match(f.nodes.get('draftStatus').textContent,/Attacker/);f.run('handleSquareTap(currentExercise.traceSteps[0].squares[0])');
  assert.match(f.nodes.get('draftStatus').textContent,/Target.*Tap the next piece/);assert.equal(f.run('appData.attempts.length'),0);
});
test('coach distinguishes ready, observation and masked flash instructions',()=>{
  const f=fixture();f.boot();f.run('startSprintSession(buildAdaptiveQueue("flash_vision",1))');
  assert.match(f.nodes.get('draftStatus').textContent,/Press Start/);f.nodes.get('btnStartExposure').click();
  assert.match(f.nodes.get('draftStatus').textContent,/Look at the board/);
  [...f.timers.values()].find(t=>!t.interval).fn();assert.match(f.nodes.get('draftStatus').textContent,/pieces are hidden/);
  assert.equal(f.run('appData.attempts.length'),0);
});

test('normal intermediate queues contain only validated non-assessment real games',()=>{
 const f=fixture();f.boot();for(const mode of [null,'geometry_xray','flash_vision','pattern_or_illusion','before_after']){
  assert.equal(f.run(`buildAdaptiveQueue(${JSON.stringify(mode)},8).every(e=>e.quality?.version===2&&e.source&&e.quality.pieceCount>=18&&!e.assessmentOnly)`),true);
  assert.ok(f.run(`buildAdaptiveQueue(${JSON.stringify(mode)},8).length`)>0);
 }
 for(const activity of ['threat_scan','relationship_trace','mixed']){f.run('startActivity('+JSON.stringify(activity)+')');assert.equal(f.run('sessionQueue.every(e=>e.quality&&e.quality.pieceCount>=18)'),true);}
 f.run('startFocusedSession()');assert.equal(f.run('sessionQueue.length'),16);assert.equal(f.run('sessionQueue.every(e=>e.quality&&!e.guidedItem)'),true);
});
test('foundation diagrams remain explicit Learn content, not due reviews',()=>{
 const f=fixture();f.boot();f.run('startLessonPractice("board",false)');assert.equal(f.run('sessionQueue.some(e=>!e.quality)'),true);
 f.run('appData.attempts=[{exerciseId:CURRICULUM_EXERCISES[0].id,correct:false,timestamp:Date.now()-86400000}];startDueReview()');assert.equal(f.run('learningSessionKind'), 'lesson');
});
test('new real-game labels derive from the current FEN and invalid source facts are quarantined',()=>{
 const f=fixture();assert.equal(f.run(`validatedCatalog().every(e=>{const g=new Chess(e.afterFen||e.fen),p=g.get(e.quality.target);return !!p&&e.source&&e.presentation.fullGoal===e.prompt&&!/safe fork|wins material/i.test(e.prompt)})`),true);
 assert.equal(f.run('makeValidatedExercise({...REAL_GAME_EXERCISES[0],validation:{...REAL_GAME_EXERCISES[0].validation,attackers:[]}})'),null);
 assert.equal(f.run('makeValidatedExercise({...REAL_GAME_EXERCISES[0],fen:"invalid"})'),null);
});
test('calibration and assessment positions never enter practice or share a source game',()=>{
 const f=fixture();assert.equal(f.run(`(()=>{const c=new Set(calibrationCatalog().map(e=>e.source.game)),a=assessmentPool();return calibrationCatalog().length===24&&a.length>=12&&!a.some(e=>c.has(e.source.game))&&!intermediatePool().some(e=>e.assessmentOnly||c.has(e.source.game))})()`),true);
});
function calibrationAnswer(f,correct=true){f.run(`(()=>{if(currentExercise.responseType==='verdict_and_square')handleVerdictClick(${correct?'currentExercise.correctOption':"currentExercise.correctOption==='real'?'illusion':'real'"});const squares=currentExercise.traceSteps?currentExercise.traceSteps.map(s=>s.squares[0]):currentExercise.responseType==='select_set'?currentExercise.correctSquares:[currentExercise.correctSquares[0]];for(const [i,s] of squares.entries())handleSquareTap(${correct?'s':"i===0?ALL_SQUARES.find(q=>!squares.includes(q)):s"});commitDraft()})()`);}
test('calibration is untimed, unassisted, resumable and separate from mastery',()=>{
 const f=fixture();f.boot();f.run('appData.learning.ui.demoSeen={};startCalibration()');assert.equal(f.run('sessionQueue.length'),12);assert.equal(f.run('demoState'),null);assert.equal(f.nodes.get('btnToggleHint').disabled,true);
 assert.equal(f.run('sessionQueue.every(e=>e.mode!=="flash_vision"&&e.quality.pieceCount>=16)'),true);
 for(let i=0;i<4;i++){calibrationAnswer(f);f.nodes.get('btnNextExercise').click();}
 const id=f.run('appData.learning.training.active.id');f.run('saveLocalState();loadLocalState();startCalibration()');assert.equal(f.run('sessionQueue.length'),8);assert.equal(f.nodes.get('drillStepCounter').textContent,'5 / 12');assert.equal(f.run('appData.learning.training.active.id'),id);
 for(let i=0;i<8;i++){calibrationAnswer(f);if(i<7)f.nodes.get('btnNextExercise').click();}
 assert.equal(f.run('appData.learning.training.active'),null);assert.equal(f.run('appData.learning.training.calibrations.length'),1);assert.equal(f.run('appData.learning.training.challenge'),'stretch');
 assert.equal(f.run('recognitionMetrics().count'),0);assert.equal(f.run('appData.attempts.every(a=>a.sessionKind==="calibration"&&!independentSuccess(a))'),true);
 f.run('saveLocalState();loadLocalState()');assert.equal(f.run('appData.learning.training.calibrations[0].total'),12);assert.equal(f.run('minimumPracticePieces()'),20);
});
test('low calibration accuracy supports recognition without reverting to diagrams',()=>{
 const f=fixture();f.boot();f.run('startCalibration()');for(let i=0;i<12;i++){calibrationAnswer(f,false);if(i<11)f.nodes.get('btnNextExercise').click();}
 assert.equal(f.run('appData.learning.training.challenge'),'supported');assert.equal(f.run('minimumPracticePieces()'),16);assert.equal(f.run('intermediatePool().every(e=>e.quality&&e.source)'),true);
});
test('normal understanding checks use another full real position and record origin',()=>{
 const f=fixture();f.boot();f.run('startSprintSession(buildAdaptiveQueue("geometry_xray",1))');calibrationAnswer(f);
 assert.equal(f.run('activeVisualCheck.origin'),'real-game');assert.equal(f.run('new Chess(activeVisualCheck.fen).board().flat().filter(Boolean).length>=18'),true);assert.equal(f.run('activeVisualCheck.fen!==currentExercise.fen'),true);
 f.run('openVisualUnderstanding();handleConceptTap(activeVisualCheck.correctSquares[0]);commitVisualUnderstanding()');assert.equal(f.run('appData.attempts[0].understandingOrigin'),'real-game');assert.equal(f.run('independentSuccess(appData.attempts[0])'),true);
});
test('imported-game drills and manual FEN questions use board-derived validation',()=>{
 const f=fixture();f.boot();f.run('parsePgnAndBuildDrills(SAMPLE_TACTICAL_PGN)');assert.equal(f.run('sessionQueue.every(e=>e.quality.origin==="pgn"&&e.quality.pieceCount>=18)'),true);
 assert.equal(f.run('makeImportedExercise("invalid","custom-fen",true)'),null);
});

test('calibration exhaustion keeps normal practice available and old progress intact',()=>{
 const f=fixture();f.boot();f.run('appData.learning.assessmentSeen=calibrationCatalog().map(e=>e.quality.sourceId);renderLearningProgress()');assert.equal(f.run('canCalibrate()'),false);assert.equal(f.nodes.get('btnCalibration').disabled,true);f.nodes.get('btnPrimaryPractice').click();assert.notEqual(f.run('learningSessionKind'),'calibration');assert.ok(f.run('sessionQueue.length')>0);
});
test('restored malformed active calibration recovers without clearing history',()=>{
 const f=fixture();f.boot();f.run('appData.learning.training.active={id:"bad",exerciseIds:["bad"]};startCalibration()');assert.equal(f.run('sessionQueue.length'),12);assert.notEqual(f.run('appData.learning.training.active.id'),'bad');
});
test('challenge selection persists and understanding exposures are recorded',()=>{
 const f=fixture();f.boot();f.nodes.get('trainingChallenge').value='stretch';f.nodes.get('trainingChallenge').listeners.change();f.run('loadLocalState()');assert.equal(f.run('minimumPracticePieces()'),20);
 f.run('startSprintSession(buildAdaptiveQueue("geometry_xray",1))');calibrationAnswer(f);const source=f.run('activeVisualCheck.sourcePositionId');f.run('openVisualUnderstanding();saveLocalState();loadLocalState()');assert.equal(f.run('appData.learning.training.understandingSeen.includes('+JSON.stringify(source)+')'),true);
});

test('resumed calibration summary includes answers from before interruption',()=>{
 const f=fixture();f.boot();f.run('startCalibration()');for(let i=0;i<3;i++){calibrationAnswer(f,false);f.nodes.get('btnNextExercise').click();}f.run('saveLocalState();loadLocalState();startCalibration()');for(let i=0;i<9;i++){calibrationAnswer(f);f.nodes.get('btnNextExercise').click();}assert.equal(f.nodes.get('summaryAccuracy').textContent,'9/12 (75%)');assert.equal(f.run('appData.learning.training.challenge'),'standard');
});

test('material-target questions explicitly exclude kings and retain compact constraints',()=>{
 const f=fixture();assert.equal(f.run('validatedCatalog().filter(e=>["loose","convergence"].includes(e.quality.rule.kind)).every(e=>e.prompt.includes("non-king"))'),true);assert.equal(f.run('validatedCatalog().every(e=>e.presentation.goal.length<=80)'),true);
});

test('personal-position identity follows the FEN, not an import counter',()=>{
 const f=fixture();f.boot();assert.equal(f.run(`(()=>{const a=makeImportedExercise(STARTER_SEEDS[0].fen,'pgn-1-ply6'),b=makeImportedExercise(STARTER_SEEDS[0].fen,'pgn-2-ply20');return a.id===b.id})()`),true);
});

test('imported-game progress is schema-valid and survives a fresh app boot',()=>{
 const f=fixture();f.boot();f.run('parsePgnAndBuildDrills(SAMPLE_TACTICAL_PGN)');calibrationAnswer(f);f.run('saveLocalState()');
 assert.equal(f.run('isValidBackup({...JSON.parse(localStorage.getItem(STORAGE_KEY)),app:"chess-vision"})'),true);
 const reopened=fixture();for(const [key,value] of f.stored)reopened.stored.set(key,value);reopened.boot();assert.equal(reopened.run('appData.attempts.length'),1);assert.equal(reopened.run('appData.attempts[0].contentVersion'),2);
});

test('new exercises clear previous-position explanation text and overlays',()=>{
 const f=fixture();f.boot();f.run('startSprintSession(buildAdaptiveQueue("geometry_xray",2))');calibrationAnswer(f);f.run('openVisualUnderstanding();handleConceptTap(activeVisualCheck.correctSquares[0]);commitVisualUnderstanding()');assert.equal(f.nodes.get('conceptExplanation').classList.contains('hidden'),false);f.nodes.get('btnNextExercise').click();assert.equal(f.nodes.get('conceptExplanation').textContent,'');assert.equal(f.nodes.get('conceptExplanation').classList.contains('hidden'),true);assert.equal(f.nodes.get('conceptGeometry').innerHTML,'');
});


test('private geometry pack has 11 chapters, 224 examples and independently legal course lines',()=>{
 const f=fixture();f.boot();assert.equal(f.run('GEOMETRY_COURSE.chapters.length'),11);assert.equal(f.run('GEOMETRY_COURSE.examples.length'),224);
 assert.equal(f.run('GEOMETRY_COURSE.examples.filter(e=>e.kind==="line").length'),218);
 assert.equal(f.run(`(()=>{let plies=0;for(const e of GEOMETRY_COURSE.examples){if(e.kind==='concept'){if(e.frames.length)throw Error('concept has moves');continue;}const b=new Chess(e.fen);for(const frame of e.frames){if(b.fen()!==frame.fen)throw Error(e.id+' before');const m=b.move({from:frame.uci.slice(0,2),to:frame.uci.slice(2,4),promotion:frame.uci[4]});if(m.san!==frame.san||b.fen()!==frame.afterFen)throw Error(e.id+' after');plies++;}}return plies;})()`),2275);
 assert.equal(f.run('GEOMETRY_COURSE.sourceSha256'),'a52f769a302a49a61a24b6ad9f673800414c512a64f8ec34889cf7a2bbf9d878');
});
function finishCourseLine(f){f.run(`while(!courseSession.completed){const m=courseExample(courseSession.exampleId).frames[courseSession.ply].uci;courseTap(m.slice(0,2));courseTap(m.slice(2,4));document.getElementById('coursePromotion').value=m[4]||'q';checkCourseMove();nextCourseStep();}`);}
test('course draft only Check grades; entire recall is recorded once, separate from normal mastery',()=>{
 const f=fixture();f.boot();f.run('startCourseExample(GEOMETRY_COURSE.examples[0].id,"recall");courseTap("h8");courseTap("g7")');assert.equal(f.run('courseState().attempts.length'),0);assert.equal(f.run('courseGraded'),false);f.run('checkCourseMove()');assert.equal(f.run('courseGraded'),true);assert.equal(f.run('courseState().attempts.length'),0);f.run('nextCourseStep()');finishCourseLine(f);assert.equal(f.run('courseState().attempts.length'),1);assert.equal(f.run('courseState().attempts[0].correct && !courseState().attempts[0].assisted'),true);assert.equal(f.run('appData.attempts.length'),0);assert.equal(f.run('recognitionMetrics().count'),0);f.run('completeCourse()');assert.equal(f.run('courseState().attempts.length'),1);
});
test('course wrong legal move differs from illegal input; corrections before Check are unscored',()=>{
 const f=fixture();f.boot();f.run('startCourseExample(GEOMETRY_COURSE.examples[0].id,"recall");courseTap("h8");courseTap("h6");checkCourseMove()');assert.equal(f.run('courseGraded'),false);assert.equal(f.run('courseSession.missed'),false);assert.match(f.nodes.get('courseStatus').textContent,/illegal/);f.run('courseTap("h8");courseTap("h7");checkCourseMove()');assert.equal(f.run('courseSession.missed'),true);assert.match(f.nodes.get('courseStatus').textContent,/Other moves are not evaluated/);f.run('nextCourseStep()');finishCourseLine(f);assert.equal(f.run('courseState().attempts[0].correct'),false);
});
test('course reveal is assisted, study never scores and concept diagrams invent no moves',()=>{
 const f=fixture();f.boot();f.run('startCourseExample(GEOMETRY_COURSE.examples[0].id,"recall")');f.nodes.get('btnCourseReveal').click();f.run('nextCourseStep()');finishCourseLine(f);assert.equal(f.run('courseState().attempts[0].assisted'),true);assert.equal(f.run('courseSchedule(GEOMETRY_COURSE.examples[0].id).independent'),false);
 f.run('startCourseExample(GEOMETRY_COURSE.examples.find(e=>e.chapter==="seven"&&e.kind==="concept").id,"recall");courseTap("e4");nextCourseStep()');assert.equal(f.run('courseSession.mode'),'study');assert.equal(f.run('courseSession.completed'),true);assert.equal(f.run('courseState().attempts.length'),1);assert.equal(f.run('courseState().studied.length'),2);
});
test('course active recall and results survive fresh boot and backup normalization',()=>{
 const f=fixture();f.boot();f.run('startCourseExample(GEOMETRY_COURSE.examples[0].id,"recall");courseTap("h8");courseTap("g7");checkCourseMove();nextCourseStep();closeCourse()');const saved=f.stored.get('chess_vision_local_state_v1'),g=fixture();g.stored.set('chess_vision_local_state_v1',saved);g.boot();assert.equal(g.run('courseState().active.ply'),2);g.nodes.get('btnCourseContinue').click();assert.equal(g.run('courseSession.ply'),2);finishCourseLine(g);assert.equal(g.run('courseState().attempts.length'),1);g.run('closeCourse()');const data=JSON.parse(g.stored.get('chess_vision_local_state_v1'));assert.ok(g.run('isValidBackup('+JSON.stringify({...data,app:'chess-vision'})+')'));const h=fixture();h.stored.set('chess_vision_local_state_v1',JSON.stringify(data));h.boot();assert.equal(h.run('courseState().attempts.length'),1);assert.equal(h.run('courseState().studied.length'),1);
});
test('course spacing requires delayed independent recalls; normal practice excludes course material',()=>{
 const f=fixture();f.boot();f.run(`const id=GEOMETRY_COURSE.examples[0].id;courseState().attempts=[{exampleId:id,correct:true,assisted:false,timestamp:Date.now()-2*DAY_MS,elapsedMs:0}];`);assert.equal(f.run('courseSchedule(id).due'),true);assert.equal(f.run('courseSchedule(id).stage'),1);f.run('courseState().attempts.push({...courseState().attempts[0],timestamp:courseState().attempts[0].timestamp+1})');assert.equal(f.run('courseSchedule(id).stage'),1);f.run('courseState().attempts.push({...courseState().attempts[0],timestamp:Date.now()})');assert.equal(f.run('courseSchedule(id).stage'),2);assert.equal(f.run('intermediatePool().some(e=>e.id.startsWith("ashley"))'),false);assert.equal(f.run('normalizeGeometryCourse({active:{exampleId:"fake",mode:"recall",ply:0},attempts:[{exampleId:id}]}).active'),null);
});
test('course inspection, original notes and overlays cannot leak into independent recall',()=>{
 const f=fixture();f.boot();f.run('startCourseExample(GEOMETRY_COURSE.examples[0].id,"study")');assert.match(f.nodes.get('courseOverlay').innerHTML,/path d=/);assert.equal(f.nodes.get('courseNotes').classList.contains('hidden'),false);f.run('startCourseExample(GEOMETRY_COURSE.examples[0].id,"recall")');assert.equal(f.nodes.get('courseNotes').classList.contains('hidden'),true);assert.equal(f.nodes.get('courseCueBlock').classList.contains('hidden'),true);assert.doesNotMatch(f.nodes.get('courseOverlay').innerHTML,/stroke-width/);f.run('handleNativeBack()');assert.equal(f.run('courseSession'),null);
});


test('every playable course example completes through the real recall controller, including promotions',()=>{
 const f=fixture();f.boot();const ids=JSON.parse(f.run('JSON.stringify(GEOMETRY_COURSE.examples.filter(e=>e.kind==="line").map(e=>e.id))'));
 for(const id of ids){f.run('startCourseExample('+JSON.stringify(id)+',"recall")');finishCourseLine(f);assert.equal(f.run('courseState().attempts.at(-1).correct&&!courseState().attempts.at(-1).assisted'),true,id);}
 assert.equal(f.run('courseState().attempts.length'),218);assert.equal(f.run('appData.attempts.length'),0);
 for(const id of JSON.parse(f.run('JSON.stringify(GEOMETRY_COURSE.examples.filter(e=>e.kind==="concept").map(e=>e.id))'))){f.run('startCourseExample('+JSON.stringify(id)+',"study");courseTap("e4");nextCourseStep()');assert.equal(f.run('courseSession.completed'),true,id);}
 assert.equal(f.run('courseState().studied.length'),224);assert.equal(f.run('courseState().attempts.length'),218);
});

test('course due-review button builds and advances a separate recall queue',()=>{
 const f=fixture();f.boot();f.run(`const reviewIds=GEOMETRY_COURSE.examples.filter(e=>e.kind==='line').slice(0,2).map(e=>e.id);courseState().attempts=reviewIds.map(id=>({exampleId:id,correct:false,assisted:false,timestamp:Date.now()-DAY_MS,elapsedMs:1}));renderCourseCatalog()`);assert.equal(f.nodes.get('btnCourseReview').disabled,false);f.nodes.get('btnCourseReview').click();assert.equal(f.run('courseSession.mode'),'recall');assert.equal(f.run('courseSession.queue.length'),1);finishCourseLine(f);const first=f.run('courseSession.exampleId');f.run('nextCourseStep()');assert.notEqual(f.run('courseSession.exampleId'),first);assert.equal(f.run('courseSession.mode'),'recall');assert.equal(f.run('courseSession.queue.length'),0);assert.equal(f.run('appData.attempts.length'),0);
});

test('geometry ray engine calculates collinearity, concurrency, cross pins and backward vision on FEN positions',()=>{
 const f=fixture();f.boot();
 const startFen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
 const res=f.run('ChessGeometryRayEngine.computeGeometryRays("'+startFen+'")');
 assert.ok(res);
 assert.equal(res.piecesCount, 32);
 assert.ok(res.collinearity.length > 0);
 assert.ok(res.concurrency.length > 0);
 assert.ok(Array.isArray(res.backwardVision));

 const pinFen='r1bqk2r/ppp2ppp/2n5/3pP3/1b1P1n2/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 8';
 const pinRes=f.run('ChessGeometryRayEngine.computeGeometryRays("'+pinFen+'")');
 assert.ok(pinRes);
 assert.ok(pinRes.collinearity.some(c=>c.blockers.length>0));
});

test('engine client initializes and evaluates positions with evaluation score and candidate moves',()=>{
 const f=fixture();f.boot();
 const client=f.run('new StockfishEngineClient()');
 assert.ok(client);
 client.setSkillLevel(15);
 assert.equal(client.skillLevel, 15);
 let evalResult = null;
 client.evaluateFen('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 10, res => { evalResult = res; });
 assert.ok(evalResult);
 assert.ok(evalResult.bestMove);
});

test('woodpecker method session records attempts, calculates cycle accuracy and target compression times',()=>{
 const f=fixture();f.boot();
 const Woodpecker=f.run('ChessWoodpeckerEngine');
 assert.ok(Woodpecker);
 const session=f.run('new ChessWoodpeckerEngine.WoodpeckerSession("set1", ["p1", "p2", "p3"], 1, 60000)');
 assert.equal(session.cycle, 1);
 session.recordAttempt("p1", true, 5000, "pin");
 session.recordAttempt("p2", true, 4000, "fork");
 session.recordAttempt("p3", false, 6000, "skewer");
 assert.ok(session.isComplete());
 const stats=session.getStats();
 assert.equal(stats.completedPuzzles, 3);
 assert.equal(stats.correctCount, 2);
 assert.equal(stats.accuracy, 66.7);
 const nextTarget=Woodpecker.calculateNextCycleTargetTime(60000, 2);
 assert.equal(nextTarget, 30000); // 50% target for cycle 2
});

test('pgn importer parses multi-game PGN content, headers, FENs and tags cleanly',()=>{
 const f=fixture();f.boot();
 const pgnText='[Event "Woodpecker Pin Set"]\n[FEN "r1bqk2r/ppp2ppp/2n5/3pP3/1b1P1n2/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 8"]\n[PuzzleCategory "Pin"]\n[TargetSquare "c3"]\n\n1. Qd2 Ne6 *';
 const games=f.run('ChessPgnImporterEngine.parsePgnFileContent('+JSON.stringify(pgnText)+')');
 assert.ok(Array.isArray(games));
 assert.equal(games.length, 1);
 assert.equal(games[0].category, 'Pin');
 assert.equal(games[0].targetSquare, 'c3');
 assert.ok(f.run('ChessPgnImporterEngine.validateImportedGame('+JSON.stringify(games[0])+')'));
});




