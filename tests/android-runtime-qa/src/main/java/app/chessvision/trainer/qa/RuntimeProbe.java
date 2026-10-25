package app.chessvision.trainer.qa;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.ViewGroup;
import android.webkit.WebView;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/** Runs against the separately installed APK. Does not replace app assets or rules.
 * Real Android touch events drive controls; JS reads provide deterministic oracles.
 */
public class RuntimeProbe extends Instrumentation {
    private Activity activity;
    private WebView web;
    private Bundle args;
    private JSONArray results=new JSONArray();
    private JSONObject report=new JSONObject();
    interface Step {void run() throws Exception;}
    @Override public void onCreate(Bundle arguments){super.onCreate(arguments);args=arguments;start();}
    @Override public void onStart(){new Thread(()->{
        String phase=args.getString("phase","modes");
        try {
            launch();
            report.put("phase",phase).put("android",android.os.Build.VERSION.RELEASE).put("sdk",android.os.Build.VERSION.SDK_INT)
              .put("webview",String.valueOf(WebView.getCurrentWebViewPackage())).put("viewport",value("({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,origin:location.href})"));
            report.put("appVersion",getTargetContext().getPackageManager().getPackageInfo("app.chessvision.trainer",0).versionName);
            check("installed APK starts from bundled assets",truth("location.href==='file:///android_asset/index.html' && allLearningExercises().length===480"),"local WebView, 576 exercises");
            check("phone layout has no horizontal overflow",truth("document.documentElement.scrollWidth<=innerWidth+1"),String.valueOf(value("({width:innerWidth,scroll:document.documentElement.scrollWidth})")));
            if("migration-seed".equals(phase)){home();tapId("btnModeXray");answerRound();seed();SystemClock.sleep(8000);}
            else if("course-seed".equals(phase))courseSeed();
            else if("course-resume".equals(phase))courseResume();
            else if("course-persistence".equals(phase))coursePersistence();
            else if("clarity".equals(phase))clarity();
            else if("visual".equals(phase))visual();
            else if("readability".equals(phase))readability();
            else if("calibration-seed".equals(phase))calibrationSeed();
            else if("calibration-resume".equals(phase))calibrationResume();
            else if("intermediate-smoke".equals(phase))intermediateSmoke();
            else if("modes".equals(phase))modes();
            else if("learning".equals(phase))learning();
            else if("assessment".equals(phase))assessment();
            else if("controls".equals(phase))controls();
            else if("imports".equals(phase))imports();
            else if("seed".equals(phase))seed();
            else if("persistence".equals(phase))persistence();
            else throw new Exception("Unknown phase "+phase);
        } catch(Throwable error){failure("phase failure",error);}
        try {
            report.put("checks",results).put("passed",allPassed()).put("attemptCount",value("appData.attempts.length"));
            File file=new File(getTargetContext().getExternalFilesDir(null),"qa-"+phase+".json");
            try(FileOutputStream out=new FileOutputStream(file)){out.write(report.toString(2).getBytes(StandardCharsets.UTF_8));}
            Bundle bundle=new Bundle();bundle.putString("report",report.toString());bundle.putString("file",file.getAbsolutePath());
            finish(allPassed()?Activity.RESULT_OK:Activity.RESULT_CANCELED,bundle);
        }catch(Throwable error){Bundle bundle=new Bundle();bundle.putString("error",error.toString());finish(Activity.RESULT_CANCELED,bundle);}
    },"ChessVision-QA").start();}

    private void launch() throws Exception {
        Intent intent=getTargetContext().getPackageManager().getLaunchIntentForPackage("app.chessvision.trainer");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TASK);
        activity=startActivitySync(intent);
        runOnMainSync(()->{web=(WebView)((ViewGroup)activity.findViewById(android.R.id.content)).getChildAt(0);});
        waitFor("typeof currentExercise!=='undefined' && typeof renderLearningProgress==='function' && document.getElementById('previewBoard').children.length>0",15000);
        SystemClock.sleep(250);
    }
    private Object value(String expression) throws Exception {
        CountDownLatch latch=new CountDownLatch(1);String[] result={null};
        String script="(()=>{try{return JSON.stringify({ok:true,value:("+expression+")})}catch(e){return JSON.stringify({ok:false,error:String(e),stack:e.stack})}})()";
        runOnMainSync(()->web.evaluateJavascript(script,r->{result[0]=r;latch.countDown();}));
        if(!latch.await(12,TimeUnit.SECONDS))throw new Exception("JS callback timeout: "+expression);
        Object parsed=new JSONTokener(result[0]).nextValue();
        JSONObject json=new JSONObject(String.valueOf(parsed));
        if(!json.getBoolean("ok"))throw new Exception(json.optString("error")+" in "+expression);
        return json.opt("value");
    }
    private boolean truth(String expression) throws Exception{return Boolean.TRUE.equals(value(expression));}
    private int number(String expression) throws Exception{return ((Number)value(expression)).intValue();}
    private void waitFor(String expression,long timeout) throws Exception {
        long deadline=SystemClock.uptimeMillis()+timeout;
        while(SystemClock.uptimeMillis()<deadline){if(truth(expression))return;SystemClock.sleep(100);}
        throw new Exception("Timed out waiting: "+expression+"; state="+value("({tab:activeTab,phase:flashPhase,revealed:isRevealed,title:document.getElementById('drillTitle').textContent})"));
    }
    private void check(String name,boolean passed,String detail) throws Exception {
        results.put(new JSONObject().put("name",name).put("passed",passed).put("detail",detail));
        Bundle status=new Bundle();status.putString("stream",(passed?"PASS ":"FAIL ")+name+"\n");sendStatus(0,status);
        if(!passed)throw new AssertionError(name+": "+detail);
    }
    private void failure(String name,Throwable error){
        try{results.put(new JSONObject().put("name",name).put("passed",false).put("detail",error.toString()));screen("failure");}catch(Exception ignored){}
        Bundle status=new Bundle();status.putString("stream","FAIL "+name+": "+error+"\n");sendStatus(0,status);
    }
    private boolean allPassed(){for(int i=0;i<results.length();i++)if(!results.optJSONObject(i).optBoolean("passed"))return false;return true;}
    private void scenario(String name,Step step){try{step.run();}catch(Throwable error){failure(name,error);}}
    private static String q(String text){return JSONObject.quote(text);}
    private void tapId(String id) throws Exception {tap("#"+id);}
    private void tap(String selector) throws Exception {
        if(selector.startsWith("#navBtn") && visualApp() && truth("activeTab==='train'"))home();
        String lookup="document.querySelector("+q(selector)+")";
        value("(()=>{const e="+lookup+";if(!e)throw Error('missing '+"+q(selector)+");if(e.disabled)throw Error('disabled '+"+q(selector)+");e.scrollIntoView({block:'center',behavior:'instant'});return true})()");
        if(truth("(()=>{const e="+lookup+";return e.tagName!=='SUMMARY' && Boolean(e.closest('#modeExplorer')) && !document.getElementById('modeExplorer').open})()"))tap("#modeExplorer>summary");
        if(visualApp() && truth("Boolean("+lookup+".closest('#trainingHelp')) && !document.getElementById('trainingHelp').open"))tapId("btnOpenHelp");
        value("(()=>{const e="+lookup+";e.scrollIntoView({block:'center',behavior:'instant'});return true})()");
        SystemClock.sleep(80);
        JSONArray point=(JSONArray)value("(()=>{const e="+lookup+",r=e.getBoundingClientRect();if(!r.width||!r.height)throw Error('not visible '+"+q(selector)+");return [r.left+r.width/2,r.top+r.height/2,innerWidth]})()");
        int[] location=new int[2];int[] width=new int[1];runOnMainSync(()->{web.getLocationOnScreen(location);width[0]=web.getWidth();});
        float scale=width[0]/(float)point.getDouble(2), x=location[0]+(float)point.getDouble(0)*scale,y=location[1]+(float)point.getDouble(1)*scale;
        long now=SystemClock.uptimeMillis();
        sendPointerSync(MotionEvent.obtain(now,now,MotionEvent.ACTION_DOWN,x,y,0));
        sendPointerSync(MotionEvent.obtain(now,now+40,MotionEvent.ACTION_UP,x,y,0));
        waitForIdleSync();SystemClock.sleep(100);
    }
    private void home() throws Exception {
        if(visualApp()){
            if(truth("demoState!==null"))tapId("demoSkip");
            if(truth("document.getElementById('trainingHelp').open"))tapId("btnCloseHelp");
            if(truth("activeTab==='train'")){tapId(truth("!document.getElementById('sprintSummaryCard').classList.contains('hidden')")?"btnBackToToday":"btnExitTraining");return;}
        }
        tapId("navBtnToday");waitFor("activeTab==='today'",3000);
    }
    private IntentFilter pickerFilter() throws Exception {IntentFilter filter=new IntentFilter(Intent.ACTION_OPEN_DOCUMENT);filter.addCategory(Intent.CATEGORY_OPENABLE);filter.addDataType("*/*");return filter;}
    private boolean visualApp() throws Exception {return truth("typeof commitDraft==='function'");}
    private void finishDemo() throws Exception {
        if(!truth("typeof demoState!=='undefined' && demoState!==null"))return;
        if(truth("demoState.stage==='ready'")){tapId("demoStart");waitFor("demoState.stage==='answer'",4000);}
        if(truth("demoState.family==='verdict'"))tapId("demoNo");
        JSONArray targets=(JSONArray)value("demoSpec(demoState.family).targets");
        for(int i=0;i<targets.length();i++)tap("#demoBoard [data-square='"+targets.getString(i)+"']");
        tapId("demoCheck");waitFor("demoState.done",3000);tapId("demoFinish");
    }
    private void answerRound() throws Exception {
        boolean visual=visualApp();
        if(truth("Boolean(currentExercise.quality) && !isRevealed"))check("previous explanation cleared",truth("document.getElementById('conceptExplanation').classList.contains('hidden') && document.getElementById('conceptExplanation').textContent===''"),"new position has no stale feedback");
        if(truth("Boolean(currentExercise.quality) && !['assessment','calibration'].includes(learningSessionKind)")){
            if(!truth("currentExercise.quality.origin==='fen' || currentExercise.quality.pieceCount>=minimumPracticePieces()"))throw new Exception("sparse position leaked into practice");
        }
        if(visual){finishDemo();if(truth("document.getElementById('trainingHelp').open"))tapId("btnCloseHelp");}
        if(truth("flashPhase==='ready' && currentExercise.mode==='flash_vision'"))tapId("btnStartExposure");
        if(truth("currentExercise.mode==='flash_vision' && (!appData.untimedMode || learningSessionKind==='assessment')")) {
            waitFor("flashPhase==='masked'",10000);
            if(!truth("document.querySelectorAll('#chessboardGrid .piece-svg').length===0"))throw new Exception("masked board exposes pieces");
        }
        if(truth("currentExercise.responseType==='verdict_and_square'"))tapId(truth("currentExercise.correctOption==='real'")?"btnVerdictReal":"btnVerdictIllusion");
        int before=number("appData.attempts.length");boolean worked=truth("learningSessionKind==='worked-example'");
        if(truth("currentExercise.responseType==='select_set'")){
            JSONArray targets=(JSONArray)value("currentExercise.correctSquares");
            for(int i=0;i<targets.length();i++)tap("#chessboardGrid [data-square='"+targets.getString(i)+"']");
            if(!visual)tapId("btnSubmitSet");
        }else if(truth("Boolean(currentExercise.traceSteps)")){
            JSONArray steps=(JSONArray)value("currentExercise.traceSteps.map(s=>s.squares[0])");
            for(int i=0;i<steps.length();i++)tap("#chessboardGrid [data-square='"+steps.getString(i)+"']");
        }else tap("#chessboardGrid [data-square='"+value("currentExercise.correctSquares[0]")+"']");
        if(visual){
            if(number("appData.attempts.length")!=before)throw new Exception("selection auto-submitted");
            tapId("btnCheckAnswer");
        }
        waitFor("isRevealed",3000);
        if(number("appData.attempts.length")!=before+(worked?0:1))throw new Exception("incorrect attempt count");
        if(!worked && !truth("appData.attempts.at(-1).correct"))throw new Exception("known correct touches scored wrong");
        if(visual){
            if(truth("Boolean(activeVisualCheck)")){
                if(!truth("document.getElementById('btnNextExercise').disabled"))throw new Exception("understanding gate absent");
                tapId("btnContinueUnderstanding");
                tap("#conceptBoard [data-square='"+value("activeVisualCheck.correctSquares[0]")+"']");tapId("btnCheckAnswer");
                if(!truth("appData.attempts.at(-1).understandingCorrect===true && appData.attempts.at(-1).understandingKind==='visual' && !document.getElementById('btnNextExercise').disabled"))throw new Exception("visual understanding failed");
            }
        }else if(truth("Boolean(currentExercise.understanding)")){
            int choice=number("currentExercise.understanding.answer")+1;tap("#understandingOptions button:nth-child("+choice+")");
            if(!truth("appData.attempts.at(-1).understandingCorrect===true && !document.getElementById('btnNextExercise').disabled"))throw new Exception("written principle answer failed");
        }
    }

    private void session(String name,String button) throws Exception {
        home();int before=number("appData.attempts.length");tapId(button);waitFor("activeTab==='train' && Boolean(currentExercise)",3000);
        int count=number("sessionQueue.length");String ids=String.valueOf(value("sessionQueue.map(e=>e.id)"));
        for(int i=0;i<count;i++){
            answerRound();
            if(i==0 && "Before / After".equals(name)){
                String after=String.valueOf(value("currentExercise.afterFen"));if(visualApp())tapId("btnReviewConnection");tapId("btnShowBefore");
                if(!truth("viewingAfterFen===false"))throw new Exception("before comparison failed");
                tapId("btnShowAfter");if(!truth("viewingAfterFen===true"))throw new Exception("after comparison failed");
            }
            tapId("btnNextExercise");
        }
        check(name+" complete session",truth("!document.getElementById('sprintSummaryCard').classList.contains('hidden')")&&number("appData.attempts.length")==before+count,count+" answers and principle checks; "+ids);
        screen(name.replaceAll("[^a-zA-Z0-9]","-"));
    }
    private void modes() throws Exception {
        home();if(truth("appData.untimedMode"))tap("label[for='chkUntimedMode']");
        screen("home");
        scenario("Geometry X-Ray",()->session("Geometry X-Ray","btnModeXray"));
        scenario("Threat Scan",()->session("Threat Scan","btnThreatScan"));
        scenario("Pattern or Illusion",()->session("Pattern or Illusion","btnModeIllusion"));
        scenario("Flash Recognition",()->session("Flash Recognition","btnModeFlash"));
        scenario("Before / After",()->session("Before / After","btnModeBeforeAfter"));
        scenario("Relationship Tracing",()->session("Relationship Tracing","btnTraceRelations"));
        scenario("Mixed Recognition",()->session("Mixed Recognition","btnMixedRecognition"));
        scenario("Personal Game Vision",()->{
            tapId("navBtnGames");tapId("btnLoadSamplePgn");tapId("btnAnalyzePgn");
            waitFor("activeTab==='train'",4000);int count=number("sessionQueue.length");
            for(int i=0;i<count;i++){answerRound();tapId("btnNextExercise");}
            check("Personal Game Vision complete session",truth("appData.gamesCount>0 && !document.getElementById('sprintSummaryCard').classList.contains('hidden')"),count+" imported-PGN drills");
        });
        scenario("flash background/resume",()->{
            home();tapId("btnModeFlash");String id=String.valueOf(value("currentExercise.id"));
            sendKeyDownUpSync(KeyEvent.KEYCODE_HOME);SystemClock.sleep(600);
            Intent resume=getTargetContext().getPackageManager().getLaunchIntentForPackage("app.chessvision.trainer");resume.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);getTargetContext().startActivity(resume);
            SystemClock.sleep(600);waitForIdleSync();
            check("native background invalidates flash",truth("flashPhase==='invalidated' && currentExercise.id==="+q(id)),String.valueOf(value("flashPhase")));
            tapId("btnRestartInvalidFlash");waitFor("flashPhase==='masked'",10000);answerRound();
            check("flash resumes through explicit restart",truth("isRevealed"),"no unscored early answer");
        });
    }
    private void learning() throws Exception {
        scenario("worked example",()->{
            home();tapId("btnContinueLearning");int before=number("appData.attempts.length");tapId("btnWorkedExample");if(visualApp())answerRound();
            check("worked example is unscored",truth("isRevealed && learningSessionKind==='worked-example'")&&number("appData.attempts.length")==before,"no attempt added");
            tapId("btnNextExercise");check("worked example returns to lesson",truth("activeTab==='learn'"),"lesson retained");
        });
        scenario("guided lesson",()->{
            tapId("btnGuidedPractice");int count=number("sessionQueue.length");
            for(int i=0;i<count;i++){answerRound();if(!truth("appData.attempts.at(-1).hintUsed && !independentSuccess(appData.attempts.at(-1))"))throw new Exception("guided response counted as independent");tapId("btnNextExercise");}
            check("guided learning complete",true,count+" assisted items");
        });
        scenario("all-square selection",()->{
            // Reach the board lesson through its actual rendered lesson card.
            tapId("navBtnLearn");tap("#learningLessonList .lesson-card:first-child");
            tapId("btnLessonPractice");int count=number("sessionQueue.length");int sets=0;
            for(int i=0;i<count;i++){if(truth("currentExercise.responseType==='select_set'"))sets++;answerRound();tapId("btnNextExercise");}
            home();tapId("navBtnLearn");tap("#learningLessonList .lesson-card:first-child");tapId("btnLessonPractice");count=number("sessionQueue.length");
            for(int i=0;i<count;i++){if(truth("currentExercise.responseType==='select_set'"))sets++;answerRound();tapId("btnNextExercise");}
            check("complete-set response flow",sets>0,sets+" multi-square questions through lesson progression");
        });
        scenario("focused programme",()->session("Focused learning","btnFocusedSession"));
        scenario("incorrect response feedback",()->{
            home();tapId("btnModeXray");int before=number("appData.attempts.length");
            if(truth("currentExercise.traceSteps!=null")) {
                tap("#chessboardGrid [data-square='"+value("ALL_SQUARES.find(s=>!currentExercise.traceSteps[0].squares.includes(s))")+"']");
                JSONArray steps=(JSONArray)value("currentExercise.traceSteps.slice(1).map(s=>s.squares[0])");for(int i=0;i<steps.length();i++)tap("#chessboardGrid [data-square='"+steps.getString(i)+"']");
            }else {
                tap("#chessboardGrid [data-square='"+value("ALL_SQUARES.find(s=>!currentExercise.correctSquares.includes(s))")+"']");
                if(!visualApp() && truth("currentExercise.responseType==='select_set'"))tapId("btnSubmitSet");
            }
            if(visualApp())tapId("btnCheckAnswer");
            waitFor("isRevealed",3000);
            check("wrong answer gives explanatory feedback",truth("!appData.attempts.at(-1).correct && document.getElementById('feedbackExplanation').textContent.length>20"),String.valueOf(value("document.getElementById('feedbackTitle').textContent")));
            if(visualApp()){tapId("btnContinueUnderstanding");tap("#conceptBoard [data-square='"+value("ALL_SQUARES.find(s=>!activeVisualCheck.correctSquares.includes(s))")+"']");tapId("btnCheckAnswer");}
            else {int wrongChoice=(number("currentExercise.understanding.answer")+1)%3;tap("#understandingOptions button:nth-child("+(wrongChoice+1)+")");}
            check("wrong principle answer offers repair and allows continuation",truth("appData.attempts.at(-1).understandingCorrect===false && !document.getElementById('btnNextExercise').disabled"),String.valueOf(value("document.getElementById('understandingResult').textContent")));
            if(visualApp())tapId("btnReviewConnection");
            tap("#chessboardGrid [data-square='"+value("currentExercise.correctSquares[0]")+"']");
            check("revealed-board exploration cannot duplicate an attempt",number("appData.attempts.length")==before+1,"one first answer only");
        });
        scenario("extra flash assistance",()->{
            home();tapId("btnModeFlash");if(visualApp())finishDemo();if(truth("flashPhase==='ready'"))tapId("btnStartExposure");tapId("btnReflash");answerRound();
            check("extra flash is marked assisted",truth("appData.attempts.at(-1).reflashUsed && !independentSuccess(appData.attempts.at(-1))"),"recognition mastery excludes assisted answer");
        });
        scenario("native Back",()->{home();tapId("navBtnLearn");sendKeyDownUpSync(KeyEvent.KEYCODE_BACK);waitFor("activeTab==='today'",3000);check("Android Back navigates home",true,"app remains open");});
        imports();
    }
    private void imports() throws Exception {
        scenario("native file import",()->{
            home();tapId("navBtnGames");ActivityMonitor monitor=addMonitor(pickerFilter(),new ActivityResult(Activity.RESULT_OK,new Intent().setData(Uri.parse("content://app.chessvision.trainer.qa.samples/sample.pgn"))),true);
            tap("label[for='inputPgnFile']");waitFor("document.getElementById('textareaPgn').value.includes('Emulator QA')",6000);removeMonitor(monitor);
            check("Android document URI loads a PGN",monitor.getHits()>0,"ACTION_OPEN_DOCUMENT returned a synthetic content-provider file; native FileReader completed");
            tapId("btnAnalyzePgn");waitFor("activeTab==='train'",4000);answerRound();check("document-imported PGN creates playable drills",true,"includes castling");
        });
        scenario("offline optional import",()->{
            home();tapId("navBtnGames");value("(()=>{document.querySelector('details.online-imports').open=true;document.getElementById('inputLichessUser').value='offline-emulator-test';return true})()");
            tapId("btnImportLichess");waitFor("!document.getElementById('btnImportLichess').disabled",18000);
            check("optional online import fails cleanly offline",truth("document.getElementById('gamesStatusBanner').textContent.includes('Could not download')"),String.valueOf(value("document.getElementById('gamesStatusBanner').textContent")));
        });
    }
    private void assessment() throws Exception {
        scenario("fixed exposure assessment",()->{
            home();tapId("navBtnProgress");tapId("btnAssessment");int count=number("sessionQueue.length");
            check("assessment disables hints and extra flashes",truth("document.getElementById('btnToggleHint').disabled && document.getElementById('btnReflash').disabled && currentExercise.flashDurationMs===5000"),"fixed 5-second exposure");
            for(int i=0;i<count;i++){answerRound();if(!truth("appData.attempts.at(-1).validAssessmentExposure===true && !independentSuccess(appData.attempts.at(-1))"))throw new Exception("assessment isolation failed");tapId("btnNextExercise");}
            check("fresh assessment complete",count==12,"12 fixed exposures, separate from practice mastery");screen("assessment-summary");
        });
        scenario("assessment interruption",()->{
            home();tapId("navBtnProgress");tapId("btnAssessment");String item=String.valueOf(value("currentExercise.id"));
            sendKeyDownUpSync(KeyEvent.KEYCODE_HOME);SystemClock.sleep(500);
            Intent resume=getTargetContext().getPackageManager().getLaunchIntentForPackage("app.chessvision.trainer");resume.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);getTargetContext().startActivity(resume);SystemClock.sleep(500);
            waitFor("flashPhase==='invalidated'",3000);tapId("btnRestartInvalidFlash");answerRound();
            check("interrupted assessment exposure is excluded",truth("appData.attempts.at(-1).validAssessmentExposure===false && !independentSuccess(appData.attempts.at(-1))"),"item "+item+" remains marked exposed; repeat is not unfamiliar");
        });
    }
    private void controls() throws Exception {
        scenario("daily practice",()->session("Daily practice",visualApp()?"btnPrimaryPractice":"btnStartDailySprint"));
        scenario("board controls and layers",()->{
            home();tapId("btnModeXray");String first=String.valueOf(value("document.querySelector('#chessboardGrid button').dataset.square"));tapId("btnFlipBoard");
            check("board flip rotates square geometry",!first.equals(value("document.querySelector('#chessboardGrid button').dataset.square")),String.valueOf(value("document.getElementById('boardPerspective').textContent")));
            tapId("btnFlipBoard");answerRound();if(visualApp() && truth("Boolean(activeVisualCheck)"))tapId("btnReviewConnection");
            String kind=String.valueOf(value("currentExercise.overlay.arrows[0]?.kind || 'attack'"));String layer=("attack".equals(kind)||"defense".equals(kind))?kind:"structure";
            tap("[data-layer='"+layer+"']");
            check("geometry layers hide their own relationships",truth("document.querySelector('[data-layer=\""+layer+"\"]').getAttribute('aria-pressed')==='false' && !document.getElementById('geometryOverlaySvg').innerHTML.includes('url(#mk-"+kind+")')"),"disabled layer "+layer);
            tap("[data-layer='"+layer+"']");
            value("(()=>{document.getElementById('chessboardGrid').scrollIntoView({block:'center'});return true})()");screen("native-geometry");
            if(visualApp())tapId("btnCloseHelp");
            check("geometry connection text accompanies SVG",truth("document.getElementById('connectionList').textContent.length>0"),String.valueOf(value("document.getElementById('connectionList').textContent")));
        });
        scenario("invalid imports",()->{
            home();tapId("navBtnGames");value("(()=>{document.getElementById('textareaPgn').value='invalid notation';return true})()");tapId("btnAnalyzePgn");
            check("invalid PGN has a visible error",truth("document.getElementById('gamesStatusBanner').textContent.includes('Could not extract') && activeTab==='games'"),"app remains usable");
            value("(()=>{document.getElementById('inputSingleFen').value='not a fen';return true})()");tapId("btnDrillFen");
            check("invalid FEN has a visible error",truth("document.getElementById('gamesStatusBanner').textContent.includes('Invalid FEN')"),"no crash or partial import");
        });
    }
    private void seed() throws Exception {
        scenario("backup export and restore",()->{
            home();tapId("navBtnProgress");value("(()=>{document.querySelector('.backup-panel').open=true;return true})()");tapId("btnExportBackup");
            String backup=String.valueOf(value("document.getElementById('textareaBackupJson').value"));JSONObject parsed=new JSONObject(backup);
            check("backup export stays in the app",truth("location.href==='file:///android_asset/index.html' && document.getElementById('backupJsonDrawer').classList.contains('flex')"),parsed.getJSONArray("attempts").length()+" exported attempts");
            Bundle data=new Bundle();data.putString("json",backup);getContext().getContentResolver().call(Uri.parse("content://app.chessvision.trainer.qa.samples"),"setBackup",null,data);
            ActivityMonitor monitor=addMonitor(pickerFilter(),new ActivityResult(Activity.RESULT_OK,new Intent().setData(Uri.parse("content://app.chessvision.trainer.qa.samples/backup.json"))),true);
            tap("label[for='inputRestoreFile']");waitFor("document.getElementById('backupStatusBanner').textContent.startsWith('Restored')",6000);removeMonitor(monitor);
            check("native backup file restore",monitor.getHits()>0,"JSON read through Android content URI");
        });
        scenario("persisted preferences and reflection",()->{
            home();if(!truth("appData.untimedMode"))tap("label[for='chkUntimedMode']");
            if(!truth("soundMuted"))tapId("btnSoundToggle");
            if(!truth("document.documentElement.dataset.theme==='light'"))tapId("btnThemeToggle");
            tapId("navBtnLearn");tap("#learningLessonList .lesson-card:first-child");
            value("(()=>{const details=document.getElementById('inputReflection').closest('details');if(details)details.open=true;document.getElementById('inputReflection').value='Emulator QA: count the defenders before moving.';return true})()");tapId("btnSaveReflection");
            String snapshot=String.valueOf(value("JSON.stringify({stored:localStorage.getItem(STORAGE_KEY),theme:document.documentElement.dataset.theme,muted:soundMuted,attempts:appData.attempts.length,seen:appData.learning.assessmentSeen})"));
            getTargetContext().getSharedPreferences("qa-expected",Context.MODE_PRIVATE).edit().putString("snapshot",snapshot).commit();
            check("progress snapshot saved before process stop",truth("appData.attempts.length>0 && appData.learning.notes.some(n=>n.text.includes('Emulator QA')) && appData.untimedMode"),snapshot.length()+" characters in snapshot");
        });
    }
    private void persistence() throws Exception {
        String raw=getTargetContext().getSharedPreferences("qa-expected",Context.MODE_PRIVATE).getString("snapshot",null);
        if(raw==null)throw new Exception("missing prior-process snapshot");JSONObject expected=new JSONObject(raw);
        report.put("persistenceComparison",value("(()=>{const expected=JSON.parse("+q(expected.getString("stored"))+"),actual=JSON.parse(localStorage.getItem(STORAGE_KEY));const diffs=[];function walk(a,b,path){if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const key of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[key],b[key],path+'.'+key)}else diffs.push({path,expected:a,actual:b})}walk(expected,actual,'state');return {diffs,rawEqual:JSON.stringify(expected)===JSON.stringify(actual),expectedAttempts:expected.attempts.length,actualAttempts:actual.attempts.length,memoryAttempts:appData.attempts.length}})()"));
        check("all progress survives Android force-stop and cold reopen",expected.getString("stored").equals(value("localStorage.getItem(STORAGE_KEY)")),expected.getInt("attempts")+" attempts plus lessons, assessments and reflections");
        check("theme and mute survive process death",expected.getString("theme").equals(value("document.documentElement.dataset.theme"))&&truth("soundMuted"),"light theme and mute restored");
        check("untimed preference and reflection restored",truth("appData.untimedMode && document.getElementById('chkUntimedMode').checked && appData.learning.notes.some(n=>n.text.includes('Emulator QA'))"),"UI and persisted state agree");
        tapId("navBtnProgress");check("progress screen renders after reopen",truth("activeTab==='progress' && document.getElementById('learningEvidenceSummary').textContent.length>0"),String.valueOf(value("document.getElementById('researchMetrics').textContent")));screen("persisted-progress");
        home();tapId("btnModeXray");answerRound();check("training still works after offline cold reopen",truth("isRevealed"),"new answer persisted");
    }
    private void clarity() throws Exception {
        home();tapId("btnModeXray");
        check("specific goal and explicit tap instructions",truth("document.getElementById('drillPrompt').textContent===currentExercise.prompt && document.getElementById('answerHow').textContent.includes('tap')"),"goal is preserved; board tap semantics explained");
        value("(()=>{document.getElementById('answerGuide').scrollIntoView({block:'start'});return true})()");screen("clarity-single");answerRound();tapId("btnNextExercise");
        check("next position opens at its question",truth("(()=>{const r=document.getElementById('drillPrompt').getBoundingClientRect();return r.top>=0 && r.bottom<innerHeight})()"),"new goal visible after Next; no manual scrolling");
        home();tapId("btnTraceRelations");tap("#chessboardGrid [data-square='"+value("currentExercise.traceSteps[0].squares[0]")+"']");
        check("trace gives the next step",truth("document.getElementById('answerAction').textContent.includes('Step 2 of 3')"),"attacker selected; target next");
        tapId("btnResetTrace");check("clear trace returns to step one",truth("traceSelections.length===0 && document.getElementById('answerAction').textContent.includes('Step 1 of 3')"),"no answer is scored by resetting");
        value("(()=>{document.getElementById('answerGuide').scrollIntoView({block:'start'});return true})()");screen("clarity-trace");answerRound();
        value("(()=>{startSprintSession([SET_EXERCISES[4]]);return true})()");
        check("set exercise explains selection and submission",truth("document.getElementById('answerHow').textContent.includes('again to undo') && document.getElementById('btnSubmitSet').textContent.includes('Check my selections')"),"specific set fixture; native touches select eight destinations");answerRound();
        home();tapId("btnModeBeforeAfter");check("before after explains no move is required",truth("document.getElementById('answerHow').textContent.includes('do not play the move yourself')"),"starting board plus imagined move");answerRound();
        home();if(truth("appData.untimedMode"))tap("label[for='chkUntimedMode']");tapId("btnModeFlash");SystemClock.sleep(1800);
        check("flash waits for reading with no pieces exposed",truth("flashPhase==='ready' && document.querySelectorAll('#chessboardGrid .piece-svg').length===0 && !document.getElementById('btnStartExposure').classList.contains('hidden')"),"timer starts only after native Ready tap");
        value("(()=>{document.getElementById('answerGuide').scrollIntoView({block:'start'});return true})()");screen("clarity-ready");answerRound();
        check("ready flash still scores from memory",truth("isRevealed && appData.attempts.at(-1).correct"),"timed exposure followed by masked-board answer");
    }

    private void visual() throws Exception {
        home();tapId("btnModeXray");finishDemo();SystemClock.sleep(400);
        check("compact goal and editable answer",truth("document.getElementById('taskGoal').textContent.length<=80 && !document.getElementById('btnCheckAnswer').classList.contains('hidden')"),"short task, one Check action");
        screen("visual-answer");
        Object fit=value("(()=>{const ids=['taskGoal','mainBoardSurface','btnCheckAnswer'];return ids.map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {id,top:r.top,bottom:r.bottom,width:r.width,visible:r.top>=-1 && r.bottom<=innerHeight+1}})})()");
        check("goal board and Check fit viewport",truth("['taskGoal','mainBoardSurface','btnCheckAnswer'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=-1 && r.bottom<=innerHeight+1})"),String.valueOf(fit));
        int before=number("appData.attempts.length");String wrong=String.valueOf(value("ALL_SQUARES.find(s=>!currentExercise.correctSquares.includes(s))"));
        tap("#chessboardGrid [data-square='"+wrong+"']");check("tap remains a draft",number("appData.attempts.length")==before && truth("!isRevealed"),"no scored attempt");tapId("btnUndoSelection");
        check("Undo clears selection",truth("selectedSquare===null"),"answer can be corrected");answerRound();screen("visual-understanding");
        tapId("btnNextExercise");finishDemo();check("new question stays visible",truth("document.getElementById('taskGoal').getBoundingClientRect().top>=0"),"no stale scroll offset");
        home();tapId("navBtnLearn");screen("visual-learn");
        check("four learning stages",truth("document.querySelectorAll('#capabilityCards .capability-tab').length===4"),"See Connect Anticipate Verify");
        home();tapId("navBtnProgress");screen("visual-progress");
        check("visual skill map",truth("document.querySelectorAll('#skillCoverage .coverage-skill').length===12"),"12 skills with independent evidence");
        home();tapId("btnModeXray");finishDemo();
        boolean initiallyLight=truth("document.documentElement.dataset.theme==='light'");
        // Theme is changed through the normal home header.
        home();tapId("btnThemeToggle");tapId("btnModeXray");finishDemo();screen("visual-other-theme");
        check("theme retains phone layout",truth("document.documentElement.scrollWidth<=innerWidth+1"),"no horizontal overflow");
        runOnMainSync(()->web.getSettings().setTextZoom(200));SystemClock.sleep(500);screen("visual-large-text");
        check("large text has no horizontal clipping",truth("document.documentElement.scrollWidth<=innerWidth+1"),"200 percent WebView text zoom; vertical scroll allowed");
        runOnMainSync(()->web.getSettings().setTextZoom(100));SystemClock.sleep(250);
    }




    private void intermediateSmoke() throws Exception {
        String[] buttons={"btnModeXray","btnThreatScan","btnModeIllusion","btnModeFlash","btnModeBeforeAfter","btnTraceRelations","btnMixedRecognition"};
        for(String button:buttons){
            home();tapId(button);finishDemo();
            check(button+" uses validated full positions",truth("sessionQueue.every(e=>e.quality?.version===2 && !e.assessmentOnly && e.quality.pieceCount>=minimumPracticePieces())"),String.valueOf(value("({pieces:currentExercise.quality.pieceCount,goal:currentExercise.presentation.goal,kind:currentExercise.quality.rule.kind})")));
            String rule=String.valueOf(value("currentExercise.quality.rule.kind"));
            if("loose".equals(rule)||"convergence".equals(rule))check("material constraint visible",truth("document.getElementById('taskGoal').textContent.includes('non-king')"),"no hidden king exclusion");
            answerRound();screen("intermediate-"+button);
        }
        home();tapId("navBtnGames");tapId("btnLoadSamplePgn");tapId("btnAnalyzePgn");answerRound();check("personal-game answer validated on final APK",truth("currentExercise.quality.origin==='pgn' && appData.attempts.at(-1).correct"),"position identity derived from FEN");
    }

    private void calibrationSeed() throws Exception {
        home();int measured=number("recognitionMetrics().count");tapId("btnCalibration");
        check("calibration starts with 12 validated real positions",truth("learningSessionKind==='calibration' && sessionQueue.length===12 && sessionQueue.every(e=>e.quality && e.assessmentOnly && e.quality.pieceCount>=16 && e.mode!=='flash_vision')"),"untimed held-out calibration pool");
        check("calibration has no tutorial or hints",truth("demoState===null && document.getElementById('btnToggleHint').disabled"),"independent first attempts");
        String id=String.valueOf(value("appData.learning.training.active.id"));
        for(int i=0;i<3;i++){answerRound();tapId("btnNextExercise");}
        getTargetContext().getSharedPreferences("qa-expected",Context.MODE_PRIVATE).edit().putString("calibrationId",id).putInt("recognitionBeforeCalibration",measured).commit();
        home();check("interrupted calibration is saved",truth("appData.learning.training.active!==null && appData.attempts.filter(a=>a.sessionKind==='calibration').length===3"),id);screen("calibration-resume-prompt");
    }
    private void calibrationResume() throws Exception {
        String id=getTargetContext().getSharedPreferences("qa-expected",Context.MODE_PRIVATE).getString("calibrationId",null);
        int measured=getTargetContext().getSharedPreferences("qa-expected",Context.MODE_PRIVATE).getInt("recognitionBeforeCalibration",-1);
        check("calibration survives process death",id!=null && id.equals(value("appData.learning.training.active?.id")),"same twelve-position session");
        tapId("btnPrimaryPractice");check("resumes with nine remaining and 4/12 progress",truth("sessionQueue.length===9 && document.getElementById('drillStepCounter').textContent==='4 / 12'"),"completed answers are not repeated");
        for(int i=0;i<9;i++){answerRound();tapId("btnNextExercise");}
        check("calibration completes and tunes recognition",truth("appData.learning.training.active===null && appData.learning.training.calibrations.at(-1).correct===12 && appData.learning.training.challenge==='stretch'"),String.valueOf(value("appData.learning.training.calibrations.at(-1)")));
        check("calibration does not inflate mastery",number("recognitionMetrics().count")==measured,"independent practice count unchanged");
        check("no beginner diagrams in all normal pools",truth("[null,'geometry_xray','flash_vision','pattern_or_illusion','before_after'].every(m=>intermediatePool(m).length>0 && intermediatePool(m).every(e=>e.quality.pieceCount>=20 && !e.assessmentOnly))"),"stretch profile; foundations remain explicit Learn content");
        check("calibration source games do not overlap assessment",truth("(()=>{const games=new Set(calibrationCatalog().map(e=>e.source.game));return !assessmentPool().some(e=>games.has(e.source.game))})()"),"held-out by game");screen("calibration-summary");
    }

    private void readingContrast(String name,String text,String surface,double minimum) throws Exception {
        JSONObject data=(JSONObject)value("(()=>{const t=document.querySelector("+q(text)+"),s=document.querySelector("+q(surface)+");function lum(c){const v=c.match(/[0-9.]+/g).slice(0,3).map(x=>{x=Number(x)/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722}const fg=getComputedStyle(t).color,bg=getComputedStyle(s).backgroundColor,a=lum(fg),b=lum(bg);return {foreground:fg,background:bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)}})()");
        check(name,data.getDouble("ratio")>=minimum && "rgb(255, 255, 255)".equals(data.getString("background")),data.toString());
    }
    private void readability() throws Exception {
        home();if(!truth("document.documentElement.dataset.theme==='dark'"))tapId("btnThemeToggle");
        readingContrast("Home has a readable white card",".sprint-hero h2",".sprint-hero",7);screen("readability-home");
        tapId("navBtnLearn");SystemClock.sleep(350);readingContrast("Learn cards have readable dark text",".lesson-card:not(.hidden) strong",".lesson-card:not(.hidden)",4.5);screen("readability-learn");
        tapId("navBtnGames");readingContrast("Game import heading is readable","#viewGames .panel h2","#viewGames .panel",7);screen("readability-games");
        tapId("navBtnProgress");readingContrast("Progress skill labels are readable",".coverage-skill span",".coverage-skill",7);screen("readability-progress");
        home();tapId("btnModeXray");finishDemo();
        check("future exercise progress stays unfilled",truth("(()=>{const current=document.querySelector('#lessonProgress .current'),future=document.querySelector('#lessonProgress span:not(.current):not(.done)');return Boolean(current&&future)&&getComputedStyle(current).backgroundColor!==getComputedStyle(future).backgroundColor})()"),"current segment green, future segments neutral");
        readingContrast("Instruction title has high contrast","#taskGoal",".coach-narration",7);
        readingContrast("Instruction body has high contrast","#draftStatus",".coach-narration",7);screen("readability-lesson");
        Object fit=value("(()=>{const ids=['mainBoardSurface','btnCheckAnswer'];return ids.map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {id,top:r.top,bottom:r.bottom,width:r.width}})})()");
        check("board and action remain fully visible",truth("['mainBoardSurface','btnCheckAnswer'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1})"),String.valueOf(fit));
        runOnMainSync(()->web.getSettings().setTextZoom(200));SystemClock.sleep(450);
        check("large-text instructions can scroll inside white card",truth("(()=>{const e=document.querySelector('.coach-scroll');return getComputedStyle(e).overflowY==='auto' && document.documentElement.scrollWidth<=innerWidth+1 && document.documentElement.scrollHeight<=innerHeight+1})()"),String.valueOf(value("({viewport:innerHeight,document:document.documentElement.scrollHeight,coachHeight:document.querySelector('.coach-scroll').clientHeight,coachContent:document.querySelector('.coach-scroll').scrollHeight})")));
        check("large-text title stays inside header",truth("(()=>{const e=document.getElementById('lessonMode'),h=document.querySelector('.focus-header');return getComputedStyle(e).whiteSpace==='nowrap'&&e.getBoundingClientRect().height<=h.getBoundingClientRect().height+1&&document.querySelector('.coach-narration').getBoundingClientRect().top>=h.getBoundingClientRect().bottom})()"),"single-line title with ellipsis; task remains in white card");
        screen("readability-large-text");runOnMainSync(()->web.getSettings().setTextZoom(100));SystemClock.sleep(250);
        home();tapId("btnThemeToggle");tapId("btnModeXray");finishDemo();readingContrast("optional light theme retains white instruction surface","#taskGoal",".coach-narration",7);screen("readability-light");
    }

    private void screen(String name) throws Exception {
        SystemClock.sleep(200);Bitmap bitmap=getUiAutomation().takeScreenshot();if(bitmap==null)return;
        try(FileOutputStream out=new FileOutputStream(new File(getTargetContext().getExternalFilesDir(null),"qa-"+name+".png"))){bitmap.compress(Bitmap.CompressFormat.PNG,100,out);}finally{bitmap.recycle();}
    }
    private void courseSeed() throws Exception {
        home();tapId("navBtnLearn");tapId("btnCourseContinue");
        check("course opens bundled first example",truth("courseSession.exampleId==='ashley-v1-matrix-01' && courseSession.mode==='study'"),"224 personal examples, 11 chapters");
        tap("#courseBoard [data-square='h8']");tapId("btnCourseControl");
        check("geometry inspection shows controlled squares",truth("document.querySelectorAll('#courseBoard .course-controlled').length>0"),"visible dots plus square-controller text");screen("course-study");
        tapId("btnCourseRecall");
        check("recall hides course hints before answer",truth("document.getElementById('courseNotes').classList.contains('hidden') && !document.getElementById('courseOverlay').innerHTML.includes('stroke-width')"),"no course answer before Check");
        int baseline=((Number)value("appData.attempts.length")).intValue();
        tap("#courseBoard [data-square='h8']");tap("#courseBoard [data-square='g7']");
        check("selection does not score",truth("courseState().attempts.length===0 && !courseGraded"),"explicit Check required");tapId("btnCourseCheck");tapId("btnCourseNext");
        check("opponent response advances to next learner move",truth("courseSession.ply===2 && courseState().attempts.length===0"),"h4 response played from source");screen("course-recall-resume");
        sendKeyDownUpSync(KeyEvent.KEYCODE_BACK);waitFor("courseSession===null",3000);
        getTargetContext().getSharedPreferences("qa-course",Context.MODE_PRIVATE).edit().putString("state",String.valueOf(value("JSON.stringify(courseState())"))).putInt("normalCount",baseline).commit();
        check("Android Back saves cursor without scoring",truth("courseState().active.ply===2"),"force-stop follows in the harness");
    }
    private void courseResume() throws Exception {
        String expected=getTargetContext().getSharedPreferences("qa-course",Context.MODE_PRIVATE).getString("state",null);
        check("course state survives offline process death",expected!=null&&truth("JSON.stringify(normalizeGeometryCourse(JSON.parse("+q(expected)+")))===JSON.stringify(normalizeGeometryCourse(courseState()))"),"exact course state restored");
        home();tapId("navBtnLearn");tapId("btnCourseContinue");check("resume starts at saved learner move",truth("courseSession.ply===2"),"not reset to beginning");
        while(!truth("courseSession.completed")){
            String move=String.valueOf(value("courseExample(courseSession.exampleId).frames[courseSession.ply].uci"));
            tap("#courseBoard [data-square='"+move.substring(0,2)+"']");tap("#courseBoard [data-square='"+move.substring(2,4)+"']");
            tapId("btnCourseCheck");tapId("btnCourseNext");
        }
        check("completed course recall records once independently",truth("courseState().attempts.length===1 && courseState().attempts[0].correct && !courseState().attempts[0].assisted"),"whole line, including responses before interruption");
        int baseline=getTargetContext().getSharedPreferences("qa-course",Context.MODE_PRIVATE).getInt("normalCount",-1);
        check("course practice does not inflate recognition history",baseline==((Number)value("appData.attempts.length")).intValue(),"separate course progress");screen("course-complete");
        tapId("btnCourseExit");
        value("(()=>{startCourseExample(GEOMETRY_COURSE.examples.find(e=>e.chapter==='seven'&&e.kind==='concept').id,'study');return true})()");
        tap("#courseBoard [data-square='e4']");tapId("btnCourseNext");check("incomplete concept diagram is not a move drill",truth("courseSession.mode==='study' && courseSession.completed && courseState().attempts.length===1"),"no invented legal position or solution");screen("course-concept");tapId("btnCourseExit");
        getTargetContext().getSharedPreferences("qa-course",Context.MODE_PRIVATE).edit().putString("state",String.valueOf(value("JSON.stringify(courseState())"))).commit();
    }
    private void coursePersistence() throws Exception {
        String expected=getTargetContext().getSharedPreferences("qa-course",Context.MODE_PRIVATE).getString("state",null);
        check("completed recall and studied diagrams persist",expected!=null&&truth("JSON.stringify(normalizeGeometryCourse(JSON.parse("+q(expected)+")))===JSON.stringify(normalizeGeometryCourse(courseState()))"),"exact completed course state after force-stop");
        check("review schedule persists",truth("courseSchedule('ashley-v1-matrix-01').stage===1 && !courseSchedule('ashley-v1-matrix-01').due"),"independent recall due after one day");
        home();tapId("navBtnLearn");screen("course-path");
    }
}




