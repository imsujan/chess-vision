package app.chessvision.trainer.qa;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.OutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/** Disposable emulator fixture: exposes only synthetic PGN and test backup data. */
public class SampleProvider extends ContentProvider {
    static final String PGN="[Event \"Emulator QA\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. O-O Bc5 5. d3 d6 6. Nc3 O-O *";
    static String backup="{}";
    public boolean onCreate(){return true;}
    public String getType(Uri uri){return uri.toString().endsWith(".json")?"application/json":"application/x-chess-pgn";}
    public Cursor query(Uri uri,String[] columns,String selection,String[] args,String sort){
        MatrixCursor cursor=new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE});
        String text=uri.toString().endsWith(".json")?backup:PGN;
        cursor.addRow(new Object[]{uri.getLastPathSegment(),text.getBytes(StandardCharsets.UTF_8).length});return cursor;
    }
    public Bundle call(String method,String arg,Bundle extras){if("setBackup".equals(method)){backup=extras.getString("json","{}");new java.io.File(getContext().getCacheDir(),"backup.json").delete();}return Bundle.EMPTY;}
    public ParcelFileDescriptor openFile(Uri uri,String mode) throws java.io.FileNotFoundException {
        try {String text=uri.toString().endsWith(".json")?backup:PGN;
            java.io.File file=new java.io.File(getContext().getCacheDir(),uri.getLastPathSegment());
            if(!file.exists())try(java.io.FileOutputStream out=new java.io.FileOutputStream(file)){out.write(text.getBytes(StandardCharsets.UTF_8));}
            return ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);        }catch(IOException error){throw new java.io.FileNotFoundException(error.toString());}
    }
    public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
    public int delete(Uri uri,String selection,String[] args){return 0;}
    public int update(Uri uri,ContentValues values,String selection,String[] args){return 0;}
}
