/* Shared presentation and editable-answer state. Rules/scoring stay in trainer.js. */
let uiStage='answer',draftChangedAt=0,activeVisualCheck=null,conceptSelection=null,conceptGraded=false;
let demoState=null;
let learningCapability='SEE';
function nodeText(id,text){document.getElementById(id).textContent=text;}
function showNode(id,visible){document.getElementById(id).classList.toggle('hidden',!visible);}
function canCheckDraft(){
  if(!currentExercise || isRevealed || isFlashLocked() || demoState)return false;
  if(currentExercise.traceSteps)return traceSelections.length===currentExercise.traceSteps.length;
  if(currentExercise.responseType==='select_set')return setSelections.size>0;
  return Boolean(selectedSquare && (currentExercise.responseType!=='verdict_and_square' || selectedVerdict));
}
function changeDraft(){draftChangedAt=Date.now();renderBoardAndOverlay();renderVisualFlow();}
function handleDraftSquare(square){
  if(isRevealed || isFlashLocked() || demoState)return;
  if(currentExercise.traceSteps){if(traceSelections.length>=currentExercise.traceSteps.length)return;traceSelections.push(square);selectedSquare=square;}
  else if(currentExercise.responseType==='select_set'){if(setSelections.has(square))setSelections.delete(square);else setSelections.add(square);selectedSquare=null;}
  else if(currentExercise.responseType==='move_drag') {
    if (!selectedSquare) {
      selectedSquare = square;
    } else {
      if (selectedSquare !== square) {
        // execute move drop
        evaluateAndReveal(selectedSquare + square, selectedVerdict);
        return;
      }
      selectedSquare = null;
    }
  }
  else selectedSquare=selectedSquare===square?null:square;
  playTone('tap');changeDraft();
}
function commitDraft(){
  if(!canCheckDraft())return;
  if(learningSessionKind==='worked-example'){revealWorkedExample();return;}
  const square=currentExercise.traceSteps?traceSelections.at(-1):currentExercise.responseType==='select_set'?currentExercise.correctSquares[0]:selectedSquare;
  evaluateAndReveal(square,selectedVerdict);
}
function undoDraft(){
  if(isRevealed || isFlashLocked() || demoState)return;
  if(currentExercise.traceSteps){traceSelections.pop();selectedSquare=traceSelections.at(-1)||null;}
  else if(currentExercise.responseType==='select_set'){const last=[...setSelections].at(-1);if(last)setSelections.delete(last);}
  else selectedSquare=null;
  changeDraft();
}
function resetDraft(){if(isRevealed || isFlashLocked() || demoState)return;traceSelections=[];setSelections.clear();selectedSquare=null;selectedVerdict=null;changeDraft();}
function resetVisualFlow(){nodeText('conceptExplanation','');showNode('conceptExplanation',false);document.getElementById('conceptGeometry').innerHTML='';document.querySelector('.coach-scroll').scrollTop=0;document.querySelector('.context-scroll').scrollTop=0;document.getElementById('drillActiveContainer').style.minHeight='';uiStage='answer';draftChangedAt=0;activeVisualCheck=null;conceptSelection=null;conceptGraded=false;document.body.dataset.trainingStage='answer';document.getElementById('trainingHelp').open=false;nodeText('connectionList','');nodeText('fullExplanation','');}
function renderAnswerGuide(){renderVisualFlow();}
function renderVisualFlow(){
  if(!currentExercise)return;
  const presentation=currentExercise.presentation || taskPresentation(currentExercise);
  const concept=uiStage==='understanding';showNode('conceptExplanation',concept&&conceptGraded);
  document.body.dataset.trainingStage=uiStage;
  document.body.dataset.sessionKind=learningSessionKind;
  nodeText('taskGoal',concept && activeVisualCheck?activeVisualCheck.goal:presentation.goal);
  const family=interactionFamily(currentExercise);
  const chips=presentation.chips.slice();
  if(learningSessionKind==='guided')chips.push('Guided');
  if(learningSessionKind==='assessment')chips.push('Assessment');
  nodeText('taskChips',concept?'Understand · new example':learningSessionKind==='calibration'?'Calibration · untimed':chips.join(' · ') || (family==='multi'?'Select all':family==='trace'?'Connect the pieces':'Spot the relationship'));
  nodeText('fullTask',concept && activeVisualCheck?activeVisualCheck.goal:presentation.fullGoal || currentExercise.prompt);
  nodeText('fullExplanation',concept?(conceptGraded?activeVisualCheck.explanation:''):isRevealed?currentExercise.explanation:'');
  showNode('geometryControls',isRevealed && !concept);showNode('connectionList',isRevealed && !concept);
  showNode('btnToggleHint',!isRevealed && !concept);showNode('confidenceGroup',!isRevealed && learningSessionKind!=='assessment');
  nodeText('stageSpot',isRevealed?'✓ Spot':'1 · Spot');
  nodeText('stageUnderstand',conceptGraded?'✓ Understand':'2 · Understand');
  document.getElementById('stageUnderstand').setAttribute('aria-current',concept?'step':'false');
  let status='Tap a target';
  if(family==='trace')status=['Attacker','Target','Defender'].map((label,i)=>traceSelections[i]?'✓ '+traceSelections[i]:i===traceSelections.length?'● '+label:label).join(' → ');
  else if(family==='multi')status=setSelections.size?setSelections.size+' selected':'Select every target';
  else if(selectedSquare)status='✓ '+selectedSquare+' selected';
  if(family==='verdict' && !selectedVerdict)status='Choose Yes or No, then a target';
  if(flashPhase==='ready' && currentExercise.mode==='flash_vision')status='Start when ready';
  else if(isFlashLocked())status=flashPhase==='invalidated'?'Paused · restart':'Look and remember';
  else if(flashPhase==='masked' && !isRevealed)status=selectedSquare?'✓ '+selectedSquare+' selected':'Where was the target?';
  if(concept)status=conceptGraded?(appData.attempts[currentAttemptIndex]?.understandingCorrect?'✓ Connection understood':'See the connection'):conceptSelection?'✓ '+conceptSelection+' selected':'Tap your answer on this example';
  nodeText('draftStatus',coachGuidance(family,status));
  showNode('btnUndoSelection',!isRevealed && Boolean(selectedSquare || setSelections.size || traceSelections.length));
  showNode('btnResetDraft',!isRevealed && Boolean(selectedSquare || setSelections.size || traceSelections.length || selectedVerdict));
  showNode('btnCheckAnswer',concept?!conceptGraded:!isRevealed && !(currentExercise.mode==='flash_vision' && (flashPhase==='ready' || isFlashLocked())));
  document.getElementById('btnCheckAnswer').disabled=concept?!conceptSelection || conceptGraded:!canCheckDraft();
  nodeText('btnCheckAnswer','Check');
  if(learningSessionKind==='calibration'){const answers=appData.attempts.filter(a=>a.calibrationSessionId===currentExercise.calibrationSessionId),done=new Set(answers.map(a=>a.exerciseId)).size,step=Math.min(12,done+(answers.some(a=>a.exerciseId===currentExercise.id)?0:1));nodeText('drillStepCounter',step+' / 12');document.getElementById('lessonProgress').innerHTML=Array.from({length:12},(_,i)=>'<span class="'+(i<step-1?'done':i===step-1?'current':'')+'"></span>').join('');document.getElementById('lessonProgress').setAttribute('aria-label','Calibration position '+step+' of 12');}
  nodeText('btnVerdictReal',currentExercise.verdictLabels?.real || 'Yes · real');nodeText('btnVerdictIllusion',currentExercise.verdictLabels?.illusion || 'No · illusion');
  showNode('btnStartExposure',!isRevealed && currentExercise.mode==='flash_vision' && flashPhase==='ready');
  nodeText('btnStartExposure','Start · '+((currentExercise.flashDurationMs || 2300)/1000)+'s');
  showNode('btnContinueUnderstanding',isRevealed && uiStage==='feedback' && Boolean(activeVisualCheck) && !conceptGraded);
  showNode('btnNextExercise',isRevealed && (!activeVisualCheck || conceptGraded || learningSessionKind==='worked-example'));
  showNode('btnReviewConnection',concept && conceptGraded);
  showNode('focusFeedback',isRevealed && !concept);
  if(isRevealed){
    const attempt=appData.attempts[currentAttemptIndex];
    nodeText('resultBadge',learningSessionKind==='worked-example'?'Worked example':attempt?.correct?'✓ Correct':'Look at this connection');
    nodeText('resultSummary',String(currentExercise.explanation || '').split(/(?<=[.!?])\s/)[0]);
  }
  showNode('mainBoardSurface',!concept);showNode('conceptSurface',concept);
  showNode('verdictGroup',!isRevealed && currentExercise.responseType==='verdict_and_square');
  document.getElementById('btnVerdictReal').setAttribute('aria-pressed',String(selectedVerdict==='real'));
  document.getElementById('btnVerdictIllusion').setAttribute('aria-pressed',String(selectedVerdict==='illusion'));
  document.getElementById('btnDemoAgain').disabled=['assessment','calibration'].includes(learningSessionKind) || concept;
  document.getElementById('btnReflash').disabled=learningSessionKind==='assessment' || flashPhase==='ready';
  if(currentExercise.afterFen && currentExercise.moveSan){
    const game=new Chess(currentExercise.fen),move=game.move(currentExercise.moveSan);
    nodeText('moveCue',move?move.from+' → '+move.to+' · '+currentExercise.moveSan:currentExercise.moveSan);
  } else nodeText('moveCue','');
  if(learningSessionKind==='worked-example' && !isRevealed)nodeText('draftStatus','Tap the pulsing target, then Check. This example is unscored.');
  requestAnimationFrame(fitFocusBoard);
}
function revealWorkedExample(){
  isRevealed=true;clearFlashTimers();viewingAfterFen=Boolean(currentExercise.afterFen);uiStage='feedback';
  appData.learning=normalizedLearning(appData.learning);
  if(!appData.learning.ui.workedSeen.includes(currentExercise.id))appData.learning.ui.workedSeen.push(currentExercise.id);
  appData.learning.ui.demoSeen[interactionFamily(currentExercise)]=true;saveLocalState();
  renderBoardAndOverlay();renderLessonState();renderVisualFlow();
}
function fitFocusBoard(){
  const area=document.getElementById('focusBoardArea');
  if(!area?.getBoundingClientRect || activeTab!=='train')return;
  const rect=area.getBoundingClientRect();
  if(rect.width<=0 || rect.height<=0)return;
  const concept=uiStage==='understanding',surface=document.getElementById(concept?'conceptSurface':'mainBoardSurface');
  // Reserve the perspective label or explanation before calculating square geometry.
  const reserve=concept?0:(document.querySelector('.compact-board-tools')?.getBoundingClientRect?.().height||0);
  const size=Math.max(0,Math.floor(Math.min(rect.width,rect.height-reserve)));
  surface.style.width=size+'px';
}
function renderVisualUnderstanding(){
  activeVisualCheck=null;
  if(learningSessionKind!=='worked-example' && !['assessment','calibration'].includes(learningSessionKind)){
    if(currentExercise.quality){activeVisualCheck=realUnderstanding(currentExercise);}
    const choices=currentExercise.quality?[]:VISUAL_CHECKS.filter(c=>c.lessonId===currentExercise.lessonId);
    if(choices.length){const seen=appData.attempts.filter(a=>a.lessonId===currentExercise.lessonId).length;activeVisualCheck=choices[(seen-1+choices.length)%choices.length];}
  }
  uiStage='feedback';document.getElementById('btnNextExercise').disabled=Boolean(activeVisualCheck);
  renderVisualFlow();
}
function openVisualUnderstanding(){if(!activeVisualCheck)return;if(activeVisualCheck.sourcePositionId){const seen=appData.learning.training.understandingSeen;if(!seen.includes(activeVisualCheck.sourcePositionId))seen.push(activeVisualCheck.sourcePositionId);saveLocalState();}uiStage='understanding';conceptSelection=null;conceptGraded=false;renderConceptBoard();renderVisualFlow();}
function handleConceptTap(square){if(conceptGraded)return;conceptSelection=conceptSelection===square?null:square;renderConceptBoard();renderVisualFlow();}
function commitVisualUnderstanding(){
  if(!activeVisualCheck || !conceptSelection || conceptGraded)return;
  const attempt=appData.attempts[currentAttemptIndex];if(!attempt || attempt.understandingCorrect!==null)return;
  attempt.understandingCorrect=activeVisualCheck.correctSquares.includes(conceptSelection);
  attempt.understandingKind='visual';attempt.understandingOrigin=activeVisualCheck.origin || 'teaching';attempt.understandingCheckId=activeVisualCheck.id;attempt.understandingChoice=conceptSelection;
  conceptGraded=true;document.getElementById('btnNextExercise').disabled=false;
  nodeText('conceptExplanation',activeVisualCheck.explanation);saveLocalState();renderStatsUI();renderConceptBoard();renderVisualFlow();
}
function answerUnderstanding(index){
  // Retained public hook: an explicit square is required by visual checks.
  if(typeof index==='string'){conceptSelection=index;commitVisualUnderstanding();}
}
function miniBoard(container,fen,selected,onTap,options={}){
  const game=new Chess(fen);container.innerHTML='';
  for(let rank=8;rank>=1;rank--)for(let file=0;file<8;file++){
    const square=FILES[file]+rank,piece=game.get(square),button=document.createElement('button');
    button.type='button';button.dataset.square=square;button.className='mini-square '+((file+rank)%2?'sq-dark':'sq-light');
    const isSelected=selected.includes(square);button.setAttribute('aria-pressed',String(isSelected));
    button.setAttribute('aria-label',options.masked?'Square '+square:square+(piece?', '+(piece.color==='w'?'White ':'Black ')+PIECE_NAMES[piece.type]:', empty'));
    if(options.focus===square)button.classList.add('demo-focus');
    if(options.correct?.includes(square))button.classList.add('mini-correct');
    button.innerHTML=(piece && !options.masked?PIECE_SVGS[piece.color+piece.type.toUpperCase()]:'')+(file===0?'<span class="coord-rank">'+rank+'</span>':'')+(rank===1?'<span class="coord-file">'+FILES[file]+'</span>':'')+(isSelected?'<span class="selection-check" aria-hidden="true">✓</span>':'');
    button.disabled=Boolean(options.disabled);button.addEventListener('click',()=>onTap(square));container.appendChild(button);
  }
}
function renderConceptBoard(){
  if(!activeVisualCheck)return;
  miniBoard(document.getElementById('conceptBoard'),activeVisualCheck.fen,conceptSelection?[conceptSelection]:[],handleConceptTap,{disabled:conceptGraded,correct:conceptGraded?activeVisualCheck.correctSquares:[]});
  const svg=document.getElementById('conceptGeometry');svg.innerHTML=conceptGraded?simpleArrows(activeVisualCheck.arrows):'';
  showNode('conceptExplanation',conceptGraded);
}
function simpleArrows(arrows){const center=s=>({x:(FILES.indexOf(s[0])+.5)*12.5,y:(8-Number(s[1])+.5)*12.5});return arrows.map(a=>{const p=center(a.from),q=center(a.to);return '<path d="M '+p.x+' '+p.y+' L '+q.x+' '+q.y+'" class="mini-ray '+a.kind+'"/><circle cx="'+q.x+'" cy="'+q.y+'" r="2.4" class="mini-end '+a.kind+'"/>';}).join('');}
const DEMO_FEN=diagramFen({g1:'K',g8:'k',b2:'B',e1:'R',e5:'q',f6:'p'});
function demoSpec(family){return {
  single:{goal:'Tap the queen',targets:['e5'],cue:'Tap the pulsing piece'},
  multi:{goal:'Select both White attackers',targets:['b2','e1'],cue:'Select both pulsing pieces'},
  trace:{goal:'Connect the pieces',targets:['b2','e5','f6'],cue:'Attacker → target → defender'},
  verdict:{goal:'Is the queen undefended?',targets:['e5'],cue:'Choose No, then select the queen'},
  before:{goal:'Imagine the rook moving e1 → e2',targets:['e2'],cue:'Select its destination'},
  flash:{goal:'Remember the queen',targets:['e5'],cue:'Watch, then select its square'}
}[family];}
function maybeShowDemo(){
  if(['assessment','calibration','worked-example'].includes(learningSessionKind))return;
  const family=interactionFamily(currentExercise);
  if(!appData.learning.ui?.demoSeen?.[family])openDemo(family);
}
function openDemo(family=interactionFamily(currentExercise)){
  if(['assessment','calibration'].includes(learningSessionKind))return;
  if(currentExercise.mode==='flash_vision' && flashPhase!=='ready' && !isRevealed)invalidateFlash();
  demoState={family,selected:[],verdict:null,stage:family==='flash'?'ready':'answer',done:false,timer:null,priorFocus:document.activeElement};
  document.getElementById('trainingHelp').open=false;
  showNode('demoDialog',true);document.getElementById('drillActiveContainer').inert=true;
  renderDemo();document.getElementById('demoSkip').focus();
}
function renderDemo(){
  if(!demoState)return;
  const spec=demoSpec(demoState.family),trace=demoState.family==='trace';
  nodeText('demoGoal',spec.goal);nodeText('demoCue',demoState.done?'✓ You’ve got it':demoState.stage==='observe'?'Look and remember':trace?['Tap the bishop','Tap the queen','Tap its defending pawn'][Math.min(2,demoState.selected.length)]:spec.cue);
  const focus=demoState.done?null:trace?spec.targets[demoState.selected.length]:spec.targets.find(s=>!demoState.selected.includes(s));
  const demoFen=demoState.family==='before' && demoState.done?diagramFen({g1:'K',g8:'k',b2:'B',e2:'R',e5:'q',f6:'p'}):DEMO_FEN;
  miniBoard(document.getElementById('demoBoard'),demoFen,demoState.selected,demoTap,{masked:demoState.family==='flash' && !demoState.done && demoState.stage!=='observe',disabled:demoState.done || ['ready','observe'].includes(demoState.stage),focus:demoState.stage==='answer'?focus:null,correct:demoState.done?spec.targets:[]});
  showNode('demoVerdicts',demoState.family==='verdict' && !demoState.done);
  document.getElementById('demoYes').setAttribute('aria-pressed',String(demoState.verdict==='real'));
  document.getElementById('demoNo').setAttribute('aria-pressed',String(demoState.verdict==='illusion'));
  showNode('demoStart',demoState.stage==='ready');showNode('demoCheck',!demoState.done && demoState.stage==='answer');showNode('demoFinish',demoState.done);
  document.getElementById('demoCheck').disabled=demoState.selected.length!==spec.targets.length || demoState.family==='verdict' && !demoState.verdict;
  document.getElementById('demoGeometry').innerHTML=demoState.done?simpleArrows(demoState.family==='before'?[{from:'e1',to:'e2',kind:'attack'}]:[{from:'b2',to:'e5',kind:'attack'},{from:'e1',to:'e5',kind:'attack'},{from:'f6',to:'e5',kind:'defense'}]):'';
}
function demoTap(square){
  if(!demoState || demoState.done || demoState.stage!=='answer')return;
  const spec=demoSpec(demoState.family);
  if(demoState.family==='trace'){
    if(square!==spec.targets[demoState.selected.length]){nodeText('demoCue','Follow the pulsing piece');return;}
    demoState.selected.push(square);
  } else {if(demoState.selected.includes(square))demoState.selected=demoState.selected.filter(s=>s!==square);else if(demoState.family==='multi')demoState.selected.push(square);else demoState.selected=[square];}
  renderDemo();
}
function checkDemo(){
  if(!demoState)return;const spec=demoSpec(demoState.family);
  const correct=spec.targets.length===demoState.selected.length && spec.targets.every(s=>demoState.selected.includes(s)) && (demoState.family!=='verdict' || demoState.verdict==='illusion');
  if(!correct){demoState.selected=[];nodeText('demoCue','Try the pulsing target');renderDemo();return;}
  demoState.done=true;renderDemo();
}
function closeDemo(){
  if(!demoState)return;clearTimeout(demoState.timer);
  const family=demoState.family,prior=demoState.priorFocus;demoState=null;
  appData.learning=normalizedLearning(appData.learning);appData.learning.ui.demoSeen[family]=true;saveLocalState();
  document.getElementById('drillActiveContainer').inert=false;showNode('demoDialog',false);renderVisualFlow();
  if(prior?.focus)prior.focus({preventScroll:true});document.getElementById(flashPhase==='ready'?'btnStartExposure':'taskGoal').focus({preventScroll:true});
}
function initVisualFlow(){
  if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(fitFocusBoard);observer.observe(document.getElementById('focusBoardArea'));}
  window.addEventListener('resize',fitFocusBoard);
  document.getElementById('btnCheckAnswer').addEventListener('click',()=>uiStage==='understanding'?commitVisualUnderstanding():commitDraft());
  document.getElementById('btnContinueUnderstanding').addEventListener('click',openVisualUnderstanding);
  document.getElementById('btnReviewConnection').addEventListener('click',()=>{uiStage='feedback';renderVisualFlow();});
  document.getElementById('btnUndoSelection').addEventListener('click',undoDraft);
  document.getElementById('btnResetDraft').addEventListener('click',resetDraft);
  document.getElementById('btnExitTraining').addEventListener('click',()=>switchTab('today'));
  document.getElementById('btnOpenHelp').addEventListener('click',()=>{if(currentExercise.mode==='flash_vision' && !isRevealed && flashPhase!=='ready')invalidateFlash();document.getElementById('trainingHelp').open=true;});
  document.getElementById('btnCloseHelp').addEventListener('click',()=>{document.getElementById('trainingHelp').open=false;});
  document.getElementById('btnDemoAgain').addEventListener('click',()=>openDemo());
  document.getElementById('demoSkip').addEventListener('click',closeDemo);document.getElementById('demoFinish').addEventListener('click',closeDemo);
  document.getElementById('demoCheck').addEventListener('click',checkDemo);
  for(const [id,verdict] of [['demoYes','real'],['demoNo','illusion']])document.getElementById(id).addEventListener('click',()=>{demoState.verdict=verdict;renderDemo();});
  document.getElementById('demoStart').addEventListener('click',()=>{if(!demoState || demoState.stage!=='ready')return;demoState.stage='observe';renderDemo();demoState.timer=setTimeout(()=>{if(!demoState)return;demoState.stage='answer';renderDemo();},1600);});
  document.getElementById('btnPrimaryPractice').addEventListener('click',()=>{if(appData.learning.training.active || (!appData.learning.training.calibrations.length && canCalibrate()))startCalibration();else if(Number(document.getElementById('dueReviewCount').textContent)>0)startDueReview();else startSprintSession(buildAdaptiveQueue(null,8));});
  document.getElementById('btnPersonalGameMode').addEventListener('click',()=>switchTab('games'));
  document.getElementById('demoDialog').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeDemo();}if(event.key==='Tab'){const buttons=[...document.getElementById('demoDialog').querySelectorAll('button')].filter(b=>!b.disabled && b.getClientRects().length);if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1);if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}}});
}
function refreshVisualHome(){
  const due=Number(document.getElementById('dueReviewCount').textContent)||0;
  const training=normalizeTraining(appData.learning?.training);
  nodeText('btnPrimaryPractice',training.active?'Resume calibration':!training.calibrations.length&&canCalibrate()?'Calibrate your vision':due?'Review '+due+' due positions':'Start today’s practice');
  nodeText('homeRecommendation',!training.calibrations.length&&canCalibrate()?'1200–1800 · start with 12 real-game positions':due?'Keep yesterday’s connections sharp':'Eight positions. One clearer view.');
}
function renderVisualLearningPath(){
  const tabs=document.getElementById('capabilityCards');tabs.innerHTML='';
  const lessons=CAPABILITIES.find(c=>c.name===learningCapability).lessons;
  for(const capability of CAPABILITIES){
    const button=document.createElement('button');button.type='button';button.className='capability-tab';button.textContent=capability.name;
    button.setAttribute('aria-pressed',String(capability.name===learningCapability));
    button.addEventListener('click',()=>{learningCapability=capability.name;renderVisualLearningPath();});tabs.appendChild(button);
  }
  const cards=document.getElementById('learningLessonList').children;
  for(let i=0;i<cards.length;i++)cards[i].classList.toggle('hidden',!lessons.includes(LEARNING_LESSONS[i].id));
}
function renderProgressOverview(){
  const metrics=recognitionMetrics(),checks=appData.attempts.filter(a=>a.sessionKind!=='assessment' && typeof a.understandingCorrect==='boolean');
  const explored=LEARNING_LESSONS.filter(l=>lessonEvidence(l.id).seen>0).length;
  const figures=[['Recognition',metrics.accuracy===null?'—':metrics.accuracy+'%'],['Understanding',checks.length?Math.round(checks.filter(a=>a.understandingCorrect).length/checks.length*100)+'%':'—'],['Skills explored',explored+'/12']];
  document.getElementById('progressOverview').innerHTML=figures.map(([label,value])=>'<div><strong>'+value+'</strong><span>'+label+'</span></div>').join('');
  const short={board:'Board',pressure:'Attack & defense',alignment:'Alignment',forks:'Forks',change:'Changes',helpers:'Defenders',king:'King safety',memory:'Memory',pawns:'Pawns',positional:'Position',endgames:'Endgames',routine:'Verify'};
  const map=document.getElementById('skillCoverage');map.innerHTML='';
  for(const lesson of LEARNING_LESSONS){const evidence=lessonEvidence(lesson.id),button=document.createElement('button');button.className='coverage-skill';button.type='button';button.setAttribute('aria-label',lesson.title+': '+evidence.status);
    button.innerHTML='<span>'+short[lesson.id]+'</span><span class="skill-track"><span style="width:'+evidence.coverage+'%"></span></span><small>'+evidence.uniqueIndependent+' independent</small>';
    button.addEventListener('click',()=>openLesson(lesson.id));map.appendChild(button);}
}

function coachGuidance(family,status){
  if(uiStage==='understanding')return conceptGraded?'Review the highlighted connection. Choose Next position when ready.':conceptSelection?'Your square is selected. Check your understanding.':'Try this new example: tap a piece or its square, then Check.';
  if(isRevealed)return activeVisualCheck && !conceptGraded?'Follow the connections on the board, then choose Understand.':'Review the connection, then choose Next position.';
  if(currentExercise.mode==='flash_vision'){
    if(flashPhase==='ready')return 'Press Start. Remember the target; when the pieces disappear, tap its square and Check.';
    if(flashPhase==='invalidated')return 'The exposure was paused. Press Restart for a fresh look.';
    if(isFlashLocked())return 'Look at the board and remember the target. Answer after the pieces disappear.';
    if(flashPhase==='masked')return selectedSquare?'Your remembered square is selected. Press Check.':'The pieces are hidden. Tap the square you remember, then Check.';
  }
  if(family==='trace')return status+(canCheckDraft()?'. Connection selected. Press Check.':'. Tap the next piece or its square.');
  if(family==='multi')return (setSelections.size?setSelections.size+' selected. ':'')+'Tap matches. Tap again to undo. Check the full set.';
  if(family==='verdict')return !selectedVerdict?'Choose Yes or No below, then select the requested target.':!selectedSquare?'Now tap the requested piece or square.':'Verdict and target selected. Press Check.';
  if(selectedSquare)return selectedSquare+' selected. Change your selection or press Check.';
  return family==='before'?'Imagine the stated move. Tap the target that changes; Check reveals the transition.':'Tap one matching piece or square, then press Check.';
}
