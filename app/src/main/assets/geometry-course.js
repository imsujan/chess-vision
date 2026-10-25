/* Personal annotated-course study. Kept separate from recognition and assessment. */
let courseSession=null,courseDraft=[],courseGraded=false,courseSelected=null,courseControls=false;
const courseExample=id=>GEOMETRY_COURSE.examples.find(e=>e.id===id);
const courseChapter=id=>GEOMETRY_COURSE.chapters.find(c=>c.id===id);
function normalizeGeometryCourse(value){
 const known=id=>typeof id==='string'&&Boolean(courseExample(id));
 const attempts=Array.isArray(value?.attempts)?value.attempts.filter(a=>known(a?.exampleId)&&courseExample(a.exampleId).kind==='line'&&typeof a.correct==='boolean'&&typeof a.assisted==='boolean'&&Number.isFinite(a.timestamp)&&a.timestamp>=0).slice(-5000).map(a=>({exampleId:a.exampleId,correct:a.correct,assisted:a.assisted,timestamp:a.timestamp,elapsedMs:Math.max(0,Number(a.elapsedMs)||0)})):[];
 const a=value?.active,e=courseExample(a?.exampleId);
 const active=e&&['study','recall'].includes(a.mode)&&Number.isInteger(a.ply)&&a.ply>=0&&a.ply<=e.frames.length&&(a.mode!=='recall'||e.kind==='line')?{exampleId:e.id,mode:a.mode,ply:a.ply,assisted:a.assisted===true,missed:a.missed===true,startedAt:Number(a.startedAt)||Date.now(),completed:a.completed===true&&a.ply===e.frames.length,queue:Array.isArray(a.queue)?a.queue.filter(known).slice(0,8):[]}:null;
 return {version:1,studied:Array.isArray(value?.studied)?[...new Set(value.studied.filter(known))]:[],attempts,active};
}
function courseState(){return appData.learning.geometry;}
function courseSchedule(id,now=Date.now()){
 const rows=courseState().attempts.filter(a=>a.exampleId===id).sort((a,b)=>a.timestamp-b.timestamp);
 let stage=0,lastDay=null;
 for(const a of rows){if(!a.correct||a.assisted){stage=0;lastDay=null;}else if(lastDay===null||a.timestamp-lastDay>=DAY_MS){stage=Math.min(4,stage+1);lastDay=a.timestamp;}}
 const last=rows.at(-1),dueAt=last?last.timestamp+(last.correct&&!last.assisted?[1,3,7,14][Math.max(0,stage-1)]*DAY_MS:10*60000):0;
 return {seen:Boolean(last),stage,dueAt,due:Boolean(last)&&dueAt<=now,independent:Boolean(last?.correct&&!last?.assisted)};
}
function courseRecommendation(chapter){
 const items=GEOMETRY_COURSE.examples.filter(e=>!chapter||e.chapter===chapter);
 return items.find(e=>courseSchedule(e.id).due)||items.find(e=>!courseState().studied.includes(e.id))||items.find(e=>e.kind==='line'&&!courseSchedule(e.id).independent)||items[0];
}
function initGeometryCourse(){
 document.getElementById('btnCourseContinue').addEventListener('click',()=>{const active=courseState().active;if(active)openCourseSession(active);else startCourseExample(courseRecommendation().id,'study');});
 document.getElementById('btnCourseReview').addEventListener('click',()=>{const due=GEOMETRY_COURSE.examples.filter(e=>e.kind==='line'&&courseSchedule(e.id).due).sort((a,b)=>courseSchedule(a.id).dueAt-courseSchedule(b.id).dueAt).slice(0,5);if(due.length)startCourseExample(due[0].id,'recall',due.slice(1).map(e=>e.id));});
 document.getElementById('btnCourseExit').addEventListener('click',closeCourse);
 document.getElementById('btnCourseCheck').addEventListener('click',checkCourseMove);
 document.getElementById('btnCourseNext').addEventListener('click',nextCourseStep);
 document.getElementById('btnCoursePrevious').addEventListener('click',()=>{if(courseSession?.mode==='study'){courseSession.ply=Math.max(0,courseSession.ply-1);courseSession.completed=false;resetCourseDraft();persistCourse();renderCourse();}});
 document.getElementById('btnCourseReset').addEventListener('click',()=>{if(!courseGraded){resetCourseDraft();renderCourse();}});
 document.getElementById('btnCourseReveal').addEventListener('click',()=>{if(!courseSession||courseSession.completed)return;courseSession.assisted=true;courseGraded=true;courseDraft=[];persistCourse();renderCourse();announce('Course move revealed. This recall is assisted.');});
 document.getElementById('btnCourseRecall').addEventListener('click',()=>startCourseExample(courseSession.exampleId,'recall',courseSession.queue));
 document.getElementById('btnCourseControl').addEventListener('click',()=>{courseControls=!courseControls;renderCourse();});
 document.getElementById('coursePromotion').addEventListener('change',()=>{if(!courseGraded)renderCourse();});
 document.getElementById('geometryWorkspace').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeCourse();}});
 renderCourseCatalog();
}
function renderCourseCatalog(){
 if(!document.getElementById('geometryChapterList'))return;
 const state=courseState(),items=GEOMETRY_COURSE.examples,independent=items.filter(e=>courseSchedule(e.id).independent).length,due=items.filter(e=>courseSchedule(e.id).due).length;
 document.getElementById('courseOverview').textContent=state.studied.length+'/224 studied · '+independent+'/218 lines recalled independently · '+due+' due';
 document.getElementById('btnCourseContinue').textContent=state.active?'Resume '+courseChapter(courseExample(state.active.exampleId).chapter).title:'Start geometry path →';
 document.getElementById('btnCourseReview').textContent='Review due · '+due;document.getElementById('btnCourseReview').disabled=!due;
 const list=document.getElementById('geometryChapterList');list.innerHTML='';
 for(const chapter of GEOMETRY_COURSE.chapters){
  const examples=items.filter(e=>e.chapter===chapter.id),studied=examples.filter(e=>state.studied.includes(e.id)).length,recalled=examples.filter(e=>courseSchedule(e.id).independent).length;
  const group=document.createElement('details');group.className='course-chapter panel';
  const summary=document.createElement('summary');summary.textContent=chapter.number+'. '+chapter.title+' · '+studied+'/'+examples.length;group.appendChild(summary);
  const cue=document.createElement('p');cue.textContent=chapter.goal;group.appendChild(cue);
  const progress=document.createElement('p');progress.className='muted';progress.textContent=recalled+' independently recalled · '+examples.filter(e=>courseSchedule(e.id).due).length+' due';group.appendChild(progress);
  const begin=document.createElement('button');begin.className='button primary';begin.textContent='Continue this chapter →';begin.addEventListener('click',()=>startCourseExample(courseRecommendation(chapter.id).id,'study'));group.appendChild(begin);
  for(const e of examples){const button=document.createElement('button');button.className='course-example text-button';button.textContent=e.number+'. '+e.title+' · '+(e.kind==='concept'?'Inspect diagram':courseSchedule(e.id).due?'Review due':courseSchedule(e.id).independent?'Recalled':state.studied.includes(e.id)?'Studied':'New');button.addEventListener('click',()=>startCourseExample(e.id,'study'));group.appendChild(button);}list.appendChild(group);
 }
}
function startCourseExample(id,mode='study',queue=[]){
 const e=courseExample(id);if(!e)return;
 openCourseSession({exampleId:id,mode:e.kind==='concept'?'study':mode,ply:0,assisted:false,missed:false,completed:false,startedAt:Date.now(),queue});
}
function openCourseSession(session){
 courseSession={...session,queue:[...(session.queue||[])]};resetCourseDraft();courseControls=false;
 switchTab('learn');document.querySelector('.app-shell').inert=true;showNode('geometryWorkspace',true);document.body.dataset.course='open';
 persistCourse();renderCourse();document.getElementById('courseTitle').focus();
}
function resetCourseDraft(){courseDraft=[];courseSelected=null;courseGraded=false;document.getElementById('coursePromotion').value='q';}
function persistCourse(){courseState().active=courseSession?{...courseSession,queue:[...courseSession.queue]}:null;saveLocalState();}
function closeCourse(){
 if(!courseSession)return false;persistCourse();courseSession=null;showNode('geometryWorkspace',false);document.body.dataset.course='';document.querySelector('.app-shell').inert=false;renderCourseCatalog();document.getElementById('btnCourseContinue').focus();return true;
}
function courseBoard(){const e=courseExample(courseSession.exampleId);return new Chess(e.frames[courseSession.ply]?.fen||e.frames.at(-1)?.afterFen||e.fen,{skipValidation:e.kind==='concept'});}
function courseCandidate(){return courseDraft.length===2?courseDraft.join('')+(courseNeedsPromotion()?document.getElementById('coursePromotion').value:''):null;}
function courseNeedsPromotion(){const b=courseBoard(),p=b.get(courseDraft[0]);return courseDraft.length===2&&p?.type==='p'&&['1','8'].includes(courseDraft[1][1]);}
function courseTap(square){
 if(!courseSession)return;
 const board=courseBoard(),p=board.get(square);
 if(courseSession.mode==='study'||courseSession.completed||courseGraded){courseSelected=courseSelected===square?null:square;renderCourse();return;}
 if(!courseDraft.length||p?.color===board.turn()){courseDraft=p?.color===board.turn()?[square]:[];}
 else if(courseDraft[0]===square)courseDraft=[];
 else courseDraft=[courseDraft[0],square];
 renderCourse();
}
function checkCourseMove(){
 if(!courseSession||courseSession.mode!=='recall'||courseGraded||courseSession.completed||courseDraft.length!==2)return;
 const b=courseBoard(),uci=courseCandidate(),e=courseExample(courseSession.exampleId),frame=e.frames[courseSession.ply];
 let legal=null;try{legal=b.move({from:courseDraft[0],to:courseDraft[1],promotion:document.getElementById('coursePromotion').value});}catch(_){}
 if(!legal){document.getElementById('courseStatus').textContent='That move is illegal. Select your piece, then another destination.';announce('Illegal move. Change your selection before Check.');return;}
 courseGraded=true;if(uci!==frame.uci)courseSession.missed=true;persistCourse();renderCourse();
}
function completeCourse(){
 const state=courseState(),e=courseExample(courseSession.exampleId);
 if(!state.studied.includes(e.id))state.studied.push(e.id);
 if(!courseSession.completed&&courseSession.mode==='recall')state.attempts.push({exampleId:e.id,correct:!courseSession.missed,assisted:courseSession.assisted,timestamp:Date.now(),elapsedMs:Math.max(0,Date.now()-courseSession.startedAt)});
 state.attempts=state.attempts.slice(-5000);courseSession.completed=true;persistCourse();
}
function nextCourseStep(){
 if(!courseSession)return;const e=courseExample(courseSession.exampleId);
 if(courseSession.completed){
  const nextId=courseSession.queue[0];if(nextId){startCourseExample(nextId,'recall',courseSession.queue.slice(1));return;}
  const items=GEOMETRY_COURSE.examples,index=items.findIndex(x=>x.id===e.id);if(index<items.length-1)startCourseExample(items[index+1].id,'study');else closeCourse();return;
 }
 if(courseSession.mode==='recall'&&!courseGraded)return;
 courseSession.ply++;
 if(courseSession.mode==='recall')while(courseSession.ply<e.frames.length&&new Chess(e.frames[courseSession.ply].fen).turn()!==e.learner)courseSession.ply++;
 if(courseSession.ply>=e.frames.length){courseSession.ply=e.frames.length;completeCourse();}
 resetCourseDraft();persistCourse();renderCourse();
}
function renderCourse(){
 if(!courseSession)return;
 const e=courseExample(courseSession.exampleId),c=courseChapter(e.chapter),frame=e.frames[courseSession.ply],b=courseBoard(),done=courseSession.completed,recall=courseSession.mode==='recall',visible=!recall||courseGraded||done;
 nodeText('courseTitle',c.title);nodeText('courseCounter',e.number+' / '+GEOMETRY_COURSE.examples.filter(x=>x.chapter===c.id).length);
 nodeText('courseExampleTitle',e.title);nodeText('courseStage',done?'Saved on this device':recall?'Recall · course line':e.kind==='concept'?'Study · concept diagram':'Study · annotated line');
 nodeText('courseGoal',done?(recall?(courseSession.missed?'Review the course continuation':courseSession.assisted?'Recalled with help':'Course line recalled'):'Example studied'):recall?(b.turn()==='w'?'White':'Black')+' to move · recall the course move':c.goal);
 let status=done?'Choose another example or recall this one.':recall?(courseDraft.length===2?courseDraft[0]+' → '+courseDraft[1]+' selected · Check':courseDraft.length?'Now tap the destination square.':'Tap your piece, then its destination.'):e.kind==='concept'?'Tap any square to inspect its controllers. Mark studied when ready.':'Tap a square to inspect. Next plays the supplied move.';
 if(recall&&courseGraded){const matches=courseCandidate()===frame.uci;status=courseSession.assisted&&courseDraft.length===0?'Revealed · '+frame.san:matches?'✓ Matches the course line · '+frame.san:'Legal move; the course uses '+frame.san+'. Other moves are not evaluated.';}
 nodeText('courseStatus',status);nodeText('courseCue',c.cue);nodeText('courseMoveLabel',visible&&frame?'Course move · '+pieceLabel(b,frame.uci.slice(0,2))+' → '+frame.uci.slice(2,4)+(frame.uci.length===5?' · promote to '+PIECE_NAMES[frame.uci[4]].toLowerCase():''):done?'End of supplied line':'No answer hints during recall');
 const note=courseSession.ply===0?e.note:e.frames[courseSession.ply-1]?.note||'';
 nodeText('courseOriginalNote',note||'No annotation at this point.');showNode('courseNotes',visible);showNode('courseCueBlock',!recall||courseGraded||done);
 showNode('btnCoursePrevious',!recall&&!done&&courseSession.ply>0);showNode('btnCourseCheck',recall&&!courseGraded&&!done);document.getElementById('btnCourseCheck').disabled=courseDraft.length!==2;
 showNode('btnCourseNext',!recall||courseGraded||done);nodeText('btnCourseNext',done?(courseSession.queue.length?'Next review →':'Next example →'):e.kind==='concept'?'Mark studied →':recall?'Continue course line →':'Play '+(frame?.san||'line')+' →');
 showNode('btnCourseRecall',e.kind==='line'&&(!recall||done));nodeText('btnCourseRecall',done?'Recall again':'Recall from the start');
 showNode('btnCourseReveal',recall&&!courseGraded&&!done);showNode('btnCourseReset',recall&&!courseGraded&&!done&&courseDraft.length>0);showNode('coursePromotionLabel',recall&&!courseGraded&&courseNeedsPromotion());
 showNode('btnCourseControl',!recall||courseGraded||done);document.getElementById('btnCourseControl').setAttribute('aria-pressed',String(courseControls));
 renderCourseBoard(b,visible);nodeText('courseLineProgress',e.kind==='concept'?'Concept · no invented solution':Math.min(courseSession.ply,e.frames.length)+' / '+e.frames.length+' half-moves');
 document.getElementById('courseProgress').max=Math.max(1,e.frames.length);document.getElementById('courseProgress').value=done?Math.max(1,e.frames.length):courseSession.ply;
}
function renderCourseBoard(board,visible){
 const grid=document.getElementById('courseBoard'),e=courseExample(courseSession.exampleId),frame=e.frames[courseSession.ply],selected=courseSelected,controls=selected&&visible?['w','b'].map(color=>({color,squares:ALL_SQUARES.filter(s=>board.attackers(s,color).includes(selected))})):[];
 grid.innerHTML='';let inspection='';
 if(selected&&visible){inspection=['w','b'].map(color=>{const from=board.attackers(selected,color);return colorLabel(color)+': '+(from.length?from.map(s=>PIECE_NAMES[board.get(s).type].toLowerCase()+' '+s).join(', '):'none');}).join(' · ');}
 nodeText('courseInspection',selected&&visible?selected+' controllers · '+inspection:'After submission: inspect squares for geometric control. Control does not guarantee a safe capture.');
 const legalDest=[];
 for(let row=0;row<8;row++)for(let col=0;col<8;col++){
  const square=String.fromCharCode(97+col)+(8-row),p=board.get(square),button=document.createElement('button');button.type='button';button.dataset.square=square;button.className='course-square '+((row+col)%2?'sq-dark':'sq-light');
  if(courseDraft.includes(square)||square===selected)button.classList.add('course-selected');
  if(visible&&courseControls&&controls.some(x=>x.squares.includes(square)))button.classList.add('course-controlled');
  if(legalDest.includes(square))button.classList.add('course-candidate');
  button.setAttribute('aria-label',square+(p?' · '+(p.color==='w'?'White ':'Black ')+PIECE_NAMES[p.type].toLowerCase():' · empty'));button.setAttribute('aria-pressed',String(courseDraft.includes(square)||square===selected));
  button.innerHTML=(p?PIECE_SVGS[p.color+p.type.toUpperCase()]:'')+'<span class="course-coordinate">'+square+'</span>'+(courseDraft.includes(square)?'<span class="course-selection-mark">✓</span>':'');
  button.addEventListener('click',()=>courseTap(square));grid.appendChild(button);
 }
 const arrow=visible&&frame?{from:frame.uci.slice(0,2),to:frame.uci.slice(2,4)}:!frame&&courseSession.ply?{from:e.frames.at(-1).uci.slice(0,2),to:e.frames.at(-1).uci.slice(2,4)}:null;
 const svg=document.getElementById('courseOverlay');let markup='<defs><marker id="courseArrowHead" markerWidth="5" markerHeight="5" refX="3.8" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" fill="#145c44"/></marker></defs>';
 if(arrow){const point=s=>[(s.charCodeAt(0)-97)*12.5+6.25,(8-Number(s[1]))*12.5+6.25],a=point(arrow.from),z=point(arrow.to),p=board.get(arrow.from),knight=p?.type==='n',d='M'+a.join(' ')+(knight?'L'+a[0]+' '+z[1]:'')+'L'+z.join(' ');markup+='<path d="'+d+'" stroke="#fff" stroke-width="2.4" fill="none"/><path d="'+d+'" stroke="#145c44" stroke-width="1.2" fill="none" marker-end="url(#courseArrowHead)"/>';}
 svg.innerHTML=markup;
}


