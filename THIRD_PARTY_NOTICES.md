# Third-party notices

## chess.js 1.4.0

Copyright (c) 2025 Jeff Hlywa. BSD-2-Clause. Full notice is retained in `app/src/main/assets/vendor/LICENSE-chess.js.txt`, inside the wrapped local distribution and in the app's About section. The npm archive's SHA-512 integrity was verified before bundling. The library is packaged locally and makes no network request.

## Lichess example data

Source: https://database.lichess.org/lichess_db_puzzle.csv.zst . License: CC0-1.0, as stated at https://database.lichess.org/ . Selected source rows, game/puzzle identifiers and validation provenance are under `evidence/`. Only generated local data is needed by the APK. No source images or licensed puzzle commentary were copied.

## Existing piece artwork

The SVG piece set and launcher bitmap were already present in the supplied project. Their original provenance was not documented. They are retained for the user's personal local build; verify provenance before public redistribution. New interface icons and teaching prose are original.

## Build-only tools

python-chess/chess and zstandard support content generation/validation only and are not included in the Android application. Gradle, the Android SDK and JDK are development tools; their distributions and licenses remain in their installation folders. No Python, Gradle or JDK runtime is bundled in the APK.
