package app.chessvision.trainer;

import android.app.Activity;
import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.content.SharedPreferences;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Local WebView host. Training and storage remain inside the bundled app. */
public class MainActivity extends Activity {
    private static final int CHOOSE_FILE = 41;
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;

    @Override
    @SuppressLint("SetJavaScriptEnabled") // Required for bundled trainer; navigation stays within local assets.
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xff101817);
        getWindow().setNavigationBarColor(0xff101817);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Optional public imports use fetch, not page navigation.
                return !url.startsWith("file:///android_asset/");
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                // Document picker grants access only to the selected PGN/backup file.
                Intent picker = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                picker.addCategory(Intent.CATEGORY_OPENABLE);
                picker.setType("*/*");
                try {
                    startActivityForResult(picker, CHOOSE_FILE);
                } catch (ActivityNotFoundException error) {
                    fileCallback.onReceiveValue(null);
                    fileCallback = null;
                }
                return true;
            }
        });
        webView.addJavascriptInterface(new DurableStorage(), "ChessVisionStorage");
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    /** Only the three local preference keys are exposed to our bundled assets.
     * commit(), unlike WebView localStorage, completes its disk write before returning. */
    public final class DurableStorage {
        private final SharedPreferences preferences = getSharedPreferences("vision-storage-v1", MODE_PRIVATE);
        private boolean allowed(String key) {
            return "chess_vision_local_state_v1".equals(key) || "chess_vision_theme".equals(key)
                || "chess_vision_muted".equals(key);
        }
        @JavascriptInterface
        public String getItem(String key) {
            return allowed(key) ? preferences.getString(key, null) : null;
        }
        @JavascriptInterface
        public boolean setItem(String key, String value) {
            return allowed(key) && value != null && preferences.edit().putString(key, value).commit();
        }
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == CHOOSE_FILE && fileCallback != null) {
            Uri uri = resultCode == RESULT_OK && data != null ? data.getData() : null;
            fileCallback.onReceiveValue(uri == null ? null : new Uri[] { uri });
            fileCallback = null;
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.evaluateJavascript("if(typeof invalidateFlash==='function')invalidateFlash();", null);
            webView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    public void onBackPressed() {
        if (webView == null) { super.onBackPressed(); return; }
        webView.evaluateJavascript("typeof handleNativeBack==='function' && handleNativeBack()",
            handled -> { if (!"true".equals(handled)) MainActivity.super.onBackPressed(); });
    }

    @Override
    protected void onDestroy() {
        if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
