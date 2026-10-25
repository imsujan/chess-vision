/* On-device, rules-validated real-game recognition. No best-move or exchange claims. */
const CONTENT_VERSION=2;
let validatedContentCache=null,calibrationContentCache=null,assessmentContentCache=null;
function normalizeTraining(v){
 const challenge=['supported','standard','stretch'].includes(v?.challenge)?v.challenge:'standard';
 const records=Array.isArray(v?.calibrations)?v.calibrations.filter(x=>x&&typeof x.id==='string'&&Number.isFinite(x.accuracy)&&x.accuracy>=0&&x.accuracy<=1).slice(-20).map(x=>({...x,weakKinds:Array.isArray(x.weakKinds)?x.weakKinds.filter(k=>typeof k==='string'):[]})):[];
 const active=v?.active&&typeof v.active.id==='string'&&Array.isArray(v.active.exerciseIds)?{id:v.active.id,exerciseIds:v.active.exerciseIds.filter(x=>typeof x==='string').slice(0,12),startedAt:Number(v.active.startedAt)||0}:null;
 return {understandingSeen:Array.isArray(v?.understandingSeen)?v.understandingSeen.filter(x=>typeof x==='string').slice(-2000):[],version:1,profile:'intermediate-1200-1800',challenge,calibrations:records,active,calibrationSeen:Array.isArray(v?.calibrationSeen)?v.calibrationSeen.filter(x=>typeof x==='string'):[]};
}
function squareList(game){return game.board().flat().filter(Boolean);}
function equalSquares(a,b){return JSON.stringify([...a].sort())===JSON.stringify([...b].sort());}
function pieceLabel(game,square){const p=game.get(square);if(!p)throw Error('Missing piece at '+square);return (p.color==='w'?'White ':'Black ')+PIECE_NAMES[p.type].toLowerCase()+' on '+square;}
function colorLabel(c){return c==='w'?'White':'Black';}
function makeValidatedExercise(raw){
 try{
  if(!raw.source||!raw.validation)return null;
  const fen=raw.afterFen||raw.fen,game=new Chess(fen),target=raw.validation.target,piece=game.get(target);if(!piece||piece.type==='k')return null;
  const atk=game.attackers(target,piece.color==='w'?'b':'w'),def=game.attackers(target,piece.color);
  if(!atk.length||!equalSquares(atk,raw.validation.attackers)||!equalSquares(def,raw.validation.defenders))return null;
  const ex={...raw,isTruePattern:raw.isTruePattern!==false,id:'v2-'+raw.id,understanding:null,correctSquares:[],traceSteps:null,responseType:'select_set',quality:{version:CONTENT_VERSION,sourceId:raw.id,pieceCount:squareList(game).length,validation:'legal-source-replay + independent geometry',target,rule:null},source:{...raw.source},category:'pressure_target',lessonId:'pressure'};
  let rule,goal,arrows=[];
  if(raw.mode==='before_after'){
   const before=new Chess(raw.fen),move=before.move(raw.moveSan);if(!move||before.fen()!==fen)return null;
   const original=new Chess(raw.fen);
   const changed=squareList(game).filter(p=>p.type===piece.type&&p.color===piece.color&&original.get(p.square)?.type===p.type&&original.get(p.square)?.color===p.color&&(!equalSquares(original.attackers(p.square,'w'),game.attackers(p.square,'w'))||!equalSquares(original.attackers(p.square,'b'),game.attackers(p.square,'b')))).map(p=>p.square);
   if(!changed.length)return null;
   ex.correctSquares=changed;ex.lessonId='change';rule={kind:'transition',color:piece.color,type:piece.type};goal='After '+raw.moveSan+', select every '+colorLabel(piece.color)+' '+PIECE_NAMES[piece.type].toLowerCase()+' with changed connections';arrows=[{from:move.from,to:move.to,kind:'move'}];
  }else if(raw.traceSteps){
   if(!def.length)return null;ex.responseType='trace';ex.traceSteps=[{label:'Attacker',squares:atk},{label:'Target',squares:[target]},{label:'Defender',squares:def}];ex.correctSquares=def;ex.lessonId='helpers';rule={kind:'trace',target};goal='Trace geometric attack and defense around '+pieceLabel(game,target);
  }else if(raw.mode==='pattern_or_illusion'){
   ex.responseType='verdict_and_square';ex.correctSquares=[target];ex.correctOption=def.length?'illusion':'real';ex.isTruePattern=def.length===0;ex.verdictLabels={real:'Yes · undefended',illusion:'No · defended'};rule={kind:'verdict',target};goal='Is the '+pieceLabel(game,target)+' attacked and geometrically undefended?';
  }else if(raw.mode==='flash_vision'){
   const matches=squareList(game).filter(p=>p.type===piece.type&&p.color===piece.color&&game.attackers(p.square,p.color==='w'?'b':'w').length>0&&Boolean(game.attackers(p.square,p.color).length)===Boolean(def.length));if(matches.length!==1)return null;
   ex.responseType='select_square';ex.correctSquares=[target];ex.lessonId='memory';rule={kind:'flash',target,color:piece.color,type:piece.type,defended:!!def.length};goal='Remember the attacked, geometrically '+(def.length?'defended ':'undefended ')+colorLabel(piece.color)+' '+PIECE_NAMES[piece.type].toLowerCase();
  }else{
   const hash=[...raw.id].reduce((a,c)=>a+c.charCodeAt(0),0),pieces=squareList(game).filter(p=>p.color===piece.color&&p.type!=='k');
   const loose=pieces.filter(p=>game.attackers(p.square,p.color==='w'?'b':'w').length&&!game.attackers(p.square,p.color).length).map(p=>p.square);
   const converging=pieces.filter(p=>game.attackers(p.square,p.color==='w'?'b':'w').length>=2).map(p=>p.square);
   if(loose.length&&(raw.activity==='threat_scan'||hash%4===0)){rule={kind:'loose',color:piece.color};ex.correctSquares=loose;goal='Select every attacked '+colorLabel(piece.color)+' non-king piece with no geometric defender';}
   else if(converging.length&&hash%4===1){rule={kind:'convergence',color:piece.color};ex.correctSquares=converging;goal='Select every '+colorLabel(piece.color)+' non-king piece with at least two geometric attackers';}
   else if(def.length&&hash%2===0){rule={kind:'defenders',target};ex.correctSquares=def;ex.lessonId='helpers';goal='Select every geometric defender of the '+pieceLabel(game,target);}
   else{rule={kind:'attackers',target};ex.correctSquares=atk;goal='Select every geometric attacker of the '+pieceLabel(game,target);}
  }
  if(!ex.correctSquares.length)return null;
  ex.quality.rule=rule;ex.prompt=goal+'.';ex.title='Read the whole position';ex.hint='Trace occupied lines and knight jumps. Count geometric control; do not assume a capture wins.';
  const relation='Attackers of '+pieceLabel(game,target)+': '+atk.join(', ')+'. Defenders: '+(def.join(', ')||'none')+'.';
  ex.explanation=(rule.kind==='transition'?'The move changes attack or defense connections for '+ex.correctSquares.map(s=>pieceLabel(game,s)).join(', ')+'.':rule.kind==='loose'||rule.kind==='convergence'?'Matching pieces: '+ex.correctSquares.map(s=>pieceLabel(game,s)).join(', ')+'.':relation)+' These are geometric relationships, not a best-move or material-gain evaluation.';
  if(!arrows.length){if(rule.kind==='loose'||rule.kind==='convergence')for(const sq of ex.correctSquares)for(const from of game.attackers(sq,piece.color==='w'?'b':'w'))arrows.push({from,to:sq,kind:'attack'});else arrows=[...atk.map(from=>({from,to:target,kind:'attack'})),...def.map(from=>({from,to:target,kind:'defense'}))];}
  ex.overlay={arrows,badges:ex.correctSquares.map(square=>({square,role:'target'})),raySquares:ex.correctSquares};
  ex.subPrompt='Validated real-game geometry · '+ex.source.puzzleId;ex.presentation={goal,fullGoal:ex.prompt,targetKind:ex.responseType==='select_set'?'pieces':'piece',chips:['Real game','1200–1800'],demoId:interactionFamily(ex)};return ex;
 }catch(_){return null;}
}
function validatedCatalog(){if(!validatedContentCache)validatedContentCache=REAL_GAME_EXERCISES.map(makeValidatedExercise).filter(Boolean);return validatedContentCache;}
function minimumPracticePieces(){return {supported:16,standard:18,stretch:20}[normalizeTraining(appData.learning?.training).challenge];}
function intermediatePool(mode=null){return validatedCatalog().filter(e=>!e.assessmentOnly&&e.quality.pieceCount>=minimumPracticePieces()&&(!mode||e.mode===mode));}
function calibrationCatalog(){if(calibrationContentCache)return calibrationContentCache;return calibrationContentCache=REAL_GAME_EXERCISES.filter(e=>e.assessmentOnly).map(e=>makeValidatedExercise(e.mode==='flash_vision'?{...e,mode:'geometry_xray'}:e)).filter(e=>e&&e.quality.pieceCount>=16).slice(0,24);}
function intermediateQueue(mode,count=8,now=Date.now()){
 const pool=intermediatePool(mode),offset=appData.attempts.length%Math.max(1,pool.length),rotated=[...pool.slice(offset),...pool.slice(0,offset)];
 const cal=normalizeTraining(appData.learning?.training).calibrations.at(-1),weak=cal?.weakKinds||[];
 return rotated.map((e,i)=>{const s=itemSchedule(e.id,now);return {e,score:(s.due?1000:!s.seen?500:!s.last?.correct?350:100)+(weak.includes(e.quality.rule.kind)?80:0)-i/10000}}).sort((a,b)=>b.score-a.score).slice(0,count).map(x=>x.e);
}
function realUnderstanding(exercise){
 const pool=intermediatePool().filter(e=>e.quality.sourceId!==exercise.quality.sourceId&&e.fen!==(exercise.afterFen||exercise.fen));
 for(let i=0;i<pool.length;i++){const e=pool[(appData.attempts.length+i)%pool.length],g=new Chess(e.afterFen||e.fen),t=e.quality.target,p=g.get(t),def=g.attackers(t,p.color),atk=g.attackers(t,p.color==='w'?'b':'w'),squares=def.length?def:atk;if(!squares.length)continue;
 return {sourcePositionId:e.quality.sourceId,id:'real-check-'+e.quality.sourceId,lessonId:exercise.lessonId,fen:g.fen(),goal:'Select one geometric '+(def.length?'defender':'attacker')+' of the '+pieceLabel(g,t),correctSquares:squares,arrows:squares.map(from=>({from,to:t,kind:def.length?'defense':'attack'})),explanation:'For example, '+pieceLabel(g,squares[0])+' '+(def.length?'defends':'attacks')+' '+t+'.'+(squares.length>1?' Other correct answers: '+squares.slice(1).join(', ')+'.':''),origin:'real-game'};
 }return null;
}
function startCalibration(){
 appData.learning=normalizedLearning(appData.learning);const t=appData.learning.training;
 let active=t.active;
 if(active&&(active.exerciseIds.length!==12||new Set(active.exerciseIds).size!==12||active.exerciseIds.some(id=>!calibrationCatalog().some(e=>e.id===id)))){t.active=null;active=null;saveLocalState();}
 if(!active){const fresh=freshCalibrationItems();
 if(fresh.length<12){announce('Fewer than 12 fresh calibration positions remain. Your previous result is kept.');return;}
 // Cover three board-density bands without treating piece count as an Elo rating.
 const chosen=[];for(const [lo,hi] of [[16,19],[20,23],[24,32]])chosen.push(...fresh.filter(e=>e.quality.pieceCount>=lo&&e.quality.pieceCount<=hi).slice(0,4));for(const e of fresh)if(chosen.length<12&&!chosen.includes(e))chosen.push(e);
 active={id:'calibration-'+Date.now(),exerciseIds:chosen.map(e=>e.id),startedAt:Date.now()};t.active=active;saveLocalState();}
 const answered=new Set(appData.attempts.filter(a=>a.calibrationSessionId===active.id).map(a=>a.exerciseId));
 const items=active.exerciseIds.filter(id=>!answered.has(id)).map(id=>calibrationCatalog().find(e=>e.id===id)).filter(Boolean).map(e=>({...e,mode:e.mode==='flash_vision'?'geometry_xray':e.mode,calibrationSessionId:active.id}));
 if(!items.length){announce('Calibration is complete.');return;}startSprintSession(items,'calibration');
}
function recordCalibration(){
 const t=appData.learning.training,a=t.active;if(!a)return;
 const rows=a.exerciseIds.map(id=>appData.attempts.find(x=>x.exerciseId===id&&x.calibrationSessionId===a.id));if(rows.some(x=>!x))return;
 const accuracy=rows.filter(x=>x.correct).length/rows.length,challenge=accuracy>=.85?'stretch':accuracy>=.6?'standard':'supported';
 const weakKinds=[...new Set(rows.filter(x=>!x.correct).map(x=>x.qualityRule))];
 t.calibrations.push({id:a.id,completedAt:Date.now(),accuracy,correct:rows.filter(x=>x.correct).length,total:rows.length,medianMs:median(rows.filter(x=>x.correct).map(recognitionLatency)),challenge,weakKinds});t.calibrations=t.calibrations.slice(-20);t.challenge=challenge;t.calibrationSeen=[...new Set([...t.calibrationSeen,...a.exerciseIds])];t.active=null;
}
function renderTrainingProfile(){
 const t=normalizeTraining(appData.learning?.training),last=t.calibrations.at(-1),status=t.active?'Calibration in progress · resume anytime':last?last.correct+'/'+last.total+' ('+Math.round(last.accuracy*100)+'%) calibration · '+t.challenge+' recognition':freshCalibrationItems().length<12?'Fresh calibration exhausted · '+t.challenge+' practice remains available':'Standard recognition · calibration recommended';
 for(const id of ['trainingProfileStatus','calibrationProgress'])document.getElementById(id).textContent=status;
 document.getElementById('trainingChallenge').value=t.challenge;
 document.getElementById('btnCalibration').disabled=!t.active&&freshCalibrationItems().length<12;
 document.getElementById('btnCalibration').textContent=t.active?'Resume calibration':last?'Recalibrate · 12 fresh positions':'Calibrate · 12 positions';
}
function initIntermediateTraining(){document.getElementById('trainingChallenge').addEventListener('change',()=>{appData.learning.training.challenge=document.getElementById('trainingChallenge').value;saveLocalState();renderLearningProgress();});document.getElementById('btnCalibration').addEventListener('click',startCalibration);renderTrainingProfile();}
function makeImportedExercise(fen,id,allowSparse=false){
 try{const game=new Chess(fen),pieces=squareList(game);if(!allowSparse&&pieces.length<minimumPracticePieces())return null;
 const target=pieces.filter(p=>p.type!=='k'&&game.attackers(p.square,p.color==='w'?'b':'w').length).sort((a,b)=>a.square.localeCompare(b.square))[0];if(!target)return null;
 const canonical=game.fen().split(' ').slice(0,4).join('_').split('/').join('~'),positionId=(allowSparse?'custom-fen-':'pgn-')+canonical;
 const ex=makeValidatedExercise({id:positionId,fen:game.fen(),mode:'geometry_xray',source:{provider:allowSparse?'User FEN':'Personal PGN',puzzleId:id},validation:{target:target.square,attackers:game.attackers(target.square,target.color==='w'?'b':'w'),defenders:game.attackers(target.square,target.color)},orientation:game.turn()});
 if(ex){ex.quality.validation=allowSparse?'FEN geometry; game provenance not verified':'Legal PGN replay + geometric control';ex.quality.origin=allowSparse?'fen':'pgn';ex.presentation.chips=[allowSparse?'Your FEN':'Your game','Validated geometry'];}return ex;
 }catch(_){return null;}
}
function assessmentPool(){if(assessmentContentCache)return assessmentContentCache;const cal=new Set(calibrationCatalog().map(e=>e.id));return assessmentContentCache=REAL_GAME_EXERCISES.filter(e=>e.assessmentOnly).map(raw=>makeValidatedExercise({...raw,fen:raw.afterFen||raw.fen,afterFen:null,mode:'flash_vision',traceSteps:null})).filter(e=>e&&e.quality.pieceCount>=16&&!cal.has(e.id));}

function freshCalibrationItems(){const t=normalizeTraining(appData.learning?.training),used=new Set([...appData.attempts.map(a=>a.exerciseId),...(appData.learning?.assessmentSeen||[]),...t.calibrationSeen]);return calibrationCatalog().filter(e=>!used.has(e.id)&&!used.has(e.quality.sourceId));}
function canCalibrate(){return Boolean(appData.learning?.training?.active)||freshCalibrationItems().length>=12;}
