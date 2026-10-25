const fs=require('fs'),assert=require('assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
process.env.CHESS_PREVIEW_PORT='4174';require('./preview.cjs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const rows=[];
 for(const [width,height] of [[1440,900],[1024,768],[768,1024],[360,740],[411,866],[667,375]]){
  const page=await browser.newPage({viewport:{width,height},colorScheme:'dark'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4174/');await page.waitForFunction(()=>typeof startSprintSession==='function');
  await page.evaluate(()=>{appData.learning=normalizedLearning(appData.learning);appData.learning.ui.demoSeen={single:true,multi:true,trace:true,verdict:true,flash:true,before:true};startSprintSession([attachLesson(buildExerciseFromSeed(STARTER_SEEDS[0]))]);});await page.waitForTimeout(150);
  for(const mode of ['geometry_xray','flash_vision','pattern_or_illusion','before_after','relationship_trace','threat_scan','mixed_recognition']){
   await page.evaluate(mode=>['relationship_trace','threat_scan','mixed_recognition'].includes(mode)?startActivity(mode):startSprintSession(buildAdaptiveQueue(mode,1)),mode);await page.waitForTimeout(100);
   const fit=await page.evaluate(()=>{const r=document.getElementById('focusBoardArea').getBoundingClientRect(),b=document.getElementById('mainBoardSurface').getBoundingClientRect(),coach=document.querySelector('.coach-narration').getBoundingClientRect();return {mode:currentExercise.mode,doc:document.documentElement.scrollHeight,inner:innerHeight,body:document.body.scrollHeight,board:{x:b.x,y:b.y,w:b.width,h:b.height},area:{x:r.x,y:r.y,w:r.width,h:r.height},coach:{x:coach.x,y:coach.y,w:coach.width,h:coach.height},action:[...document.querySelectorAll('.action-dock button')].filter(b=>b.getClientRects().length).map(b=>({id:b.id,bottom:b.getBoundingClientRect().bottom}))}});
   assert.ok(fit.doc<=height+1,`document overflow ${width} ${mode}: ${fit.doc}`);assert.ok(fit.board.y>=-1 && fit.board.y+fit.board.h<=height+1,`board vertical overflow ${JSON.stringify(fit)}`);assert.ok(fit.board.x>=0&&fit.board.x+fit.board.w<=width+1,`board horizontal overflow`);assert.ok(fit.action.every(a=>a.bottom<=height+1),`action overflow`);rows.push({width,height,...fit});
  }
  await page.evaluate(()=>startSprintSession(buildAdaptiveQueue('geometry_xray',1)));await page.waitForTimeout(100);
  const square=await page.evaluate(()=>currentExercise.traceSteps?currentExercise.traceSteps[0].squares[0]:currentExercise.correctSquares[0]);await page.locator('#chessboardGrid [data-square="'+square+'"]').click();assert.equal(await page.evaluate(()=>appData.attempts.length),0);
  await page.screenshot({path:`${width}x${height}-workspace.png`});
  // Long narration has its own scroll; moving it must not move the board.
  const before=await page.locator('#mainBoardSurface').boundingBox();await page.evaluate(()=>{document.getElementById('draftStatus').textContent='Long coach explanation. '.repeat(500);document.querySelector('.coach-scroll').scrollTop=1000;window.scrollTo(0,9999)});await page.waitForTimeout(80);const after=await page.locator('#mainBoardSurface').boundingBox();assert.equal(Math.round(before.y),Math.round(after.y));assert.equal(await page.evaluate(()=>window.scrollY),0);
  for(const tab of ['today','learn','games','progress']){await page.evaluate(tab=>switchTab(tab),tab);await page.waitForTimeout(40);assert.equal(await page.evaluate(()=>window.scrollY),0);assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  assert.deepEqual(errors,[]);await page.close();
 }
 await browser.close();fs.writeFileSync('layout-results.json',JSON.stringify(rows,null,2));console.log(`PASS ${rows.length} mode/viewport checks, editable selection, long narration isolation and all destinations`);process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
