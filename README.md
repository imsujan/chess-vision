# Chess Vision 1.4.0

An Android-first, offline learning app for SEE → CONNECT → ANTICIPATE → VERIFY. Training, legal chess rules, exercises and history live on the device. No account, backend, paid AI service, remote font or runtime content download is required. Public-game imports are optional network actions.

## Personal geometry course (1.4.0)

Open Learn → Maurice Ashley · Chess Geometry. The private pack uses the supplied PGN (its introduction identifies Chessable). Eleven chapters contain 224 examples: 218 playable annotated lines plus six inspect-only concept diagrams. Study the line and inspect square control, then Recall from the start with piece → destination → Check. Source replies play automatically. Show course move marks the recall assisted. Legal alternatives are described as differing from the course, not as proven bad chess.

Course progress, interrupted-line cursor and due review are saved additively under learning.geometry in the existing v1 storage and backup. Completion records one whole-line recall; studying alone never counts as an independent recall. Reviews use 1/3/7/14-day defaults, with ten-minute retry for missed/assisted lines. Immediate repeats do not advance spacing. Course material remains separate from normal 1200–1800 practice, calibration and assessment. The four intentionally king-incomplete concept positions are never passed off as legal move exercises.

The course pack includes original user-supplied annotations, attributed to GM Maurice Ashley, for personal offline study. It is not a public redistribution pack. Rebuild with build-only python-chess: `python scripts/build-geometry-course.py <personal-source.pgn> app/src/main/assets/geometry-course-data.js`. The source audit records the SHA-256, counts and excluded intro/outro/two bonus-video records. All 2,275 numbered-chapter mainline plies are checked by python-chess during generation and by chess.js in the controller suite. All 218 lines are also completed through the recall controller in tests. No new runtime dependency or service is added.

## Intermediate training (1.3.0)

Normal practice now uses validated real-game positions for the 1200–1800 range. Beginner diagrams remain in explicit Learn sessions and gesture demonstrations. Start the twelve-position untimed calibration on Today; it resumes after closing and chooses Supported, Standard or Stretch from first-attempt accuracy. You can change the challenge manually. These are recognition difficulty bands, not Elo estimates. The bundled pool allows two fresh calibrations; exhausted material is never labelled fresh.

Supported/Standard/Stretch contain 259/211/160 qualifying exercises with at least 16/18/20 pieces. Questions ask about geometric control, not engine-certified winning moves. Names and accepted answers come from actual board pieces. Calibration and timed assessment remain separate from normal mastery. Imports and existing history are preserved.

For the stricter release gate, install python-chess in a build-only Python environment, set CHESS_VALIDATOR_PYTHON to that Python executable (and PYTHONPATH if using an isolated target directory), then run `./Build.ps1 -VerifyContent`. It checks approved catalog counts and independently recomputes 539 generated variants across 468 source games. Python is not included in the APK. Fourteen ambiguous transformation conversions are excluded; the original content library remains available for lessons.

## Learning system

- Twelve lessons: board fluency; attacks/defense; pins/skewers; forks; transformations; defender duties; king safety; memory; pawn structures; positional geometry; king/pawn endings; thinking routine.
- Explain → worked example → guided practice → unassisted identification → contrast → retrieval → game application → fresh assessment.
- 576 exercises: 14 retained starter inputs, 48 teaching drills, 28 contrasting drills, 6 complete-set drills and 480 legal real-game examples from distinct source games. Some diagrams support multiple questions.
- Eight experiences: Geometry X-Ray, Threat Scan, Pattern or Illusion, Flash Recognition, Before / After, Relationship Tracing, Personal Game Vision and Mixed Recognition.
- Approximate five-minute daily sets and twenty-minute focused sequences; adaptive six-week guide.
- Separate assisted learning, recognition, principle checks, confidence and assessment results. Review intervals use 1/3/7/14/30-day defaults; immediate repeats cannot advance retention.
- Varied accurate recognition precedes shorter exposures. Correct-response medians, false positives, hint dependence, review cues and reflection notes are tracked separately.
- Ninety-six real-game items are held out by source game. Assessments use twelve fresh five-second exposures, no hints/extra flashes, and exclude interrupted exposures. They never alter practice mastery.

The original geometry detectors and 14 seed inputs are retained. A correction layer fixes four misleading legacy explanations. chess.js 1.4.0 replaces the incomplete legal-move layer and supports castling, en passant, promotion and standard PGN parsing. Geometric pressure is distinguished from legal moves and complete exchange evaluation.

## Build and test

Android Gradle Plugin 8.2.2; checksum-pinned Gradle 8.2.1 wrapper; JDK 17; compile/target SDK 34; Build Tools 34.0.0; minSdk 21. No frontend package installation is needed.

On this machine, SDK 34 and Build Tools 34.0.0 are in the existing Android SDK. JDK 17 is in the ignored project .tooling/jdk-17 directory. Global PATH/Java settings are unchanged. The SDK path is in ignored local.properties.

Run from PowerShell:

    .\Build.ps1

This runs the Node tests when Node is available, then assembleDebug, lintDebug and testDebugUnitTest. The Java unit-test task has no test source; the substantive training tests run in Node.

APK: app/build/outputs/apk/debug/app-debug.apk. Application ID: app.chessvision.trainer. VersionCode 10 / versionName 1.4.0. The debug signing key is development-only; preserve it for compatible updates.

On another computer, install JDK 17 and SDK 34, configure the SDK path, then use gradlew / gradlew.bat. The wrapper verifies its distribution checksum. Training tests can run independently:

    node --test tests/trainer.test.cjs

## Content provenance and repeatability

Selected CC0 source rows are in evidence/lichess-source-rows.json; evidence/content-provenance.json records selection and validation. The first move in each puzzle row is applied before selecting its solving-position relationships. The complete supplied continuation is legally replayed with python-chess; runtime target attack/defense facts and transformations are independently checked with chess.js tests.

Rebuild the frozen pack without internet:

    python -m pip install -r scripts/content-requirements.txt
    python scripts/rebuild-content-pack.py

These Python tools are build-only and are not shipped in the APK. Ordinary app use never runs Python or downloads the database. The pack is a suitable streamed-prefix selection, not a random population sample or engine-certified best-move collection.

## History, accessibility and backups

Existing v1 attempts remain under chess_vision_local_state_v1. Android 1.1.1 commits progress and preferences through a key-restricted native bridge before returning, preventing the process-stop loss reproduced in 1.1.0. Legacy WebView data migrates automatically, and browser-only use keeps localStorage. New learning metadata is additive and included in JSON backups. Older records remain available in activity/history, but cannot establish hint-free or principle-check evidence that was never recorded. Storage failures are visible, with an in-memory session and backup fallback.

Light/dark themes, SVG pieces, distinct line styles, keyboard square navigation, screen-reader names, live feedback, reduced motion and zoom are supported. Android includes a document picker, app-aware Back and flash pause integration. Stock WebView blob downloads vary; the backup JSON drawer and manual copy/restore remain available.

## Research scope and acceptance

See docs/learning-framework.md for the research-report mapping and measurement boundaries. The design is research-informed; chess-strength/rating effects are not established. Automatic error categories are review cues, not cognitive diagnoses. Personal-game snapshots identify relationships worth reviewing, not proven historical mistakes.

See THIRD_PARTY_NOTICES.md for chess.js BSD-2-Clause, Lichess CC0 and the retained artwork's undocumented provenance. No Python, SDK, JDK or Gradle runtime is included in the APK.

Physical-phone acceptance remains: install/open offline, document picker, TalkBack, system Back, flash backgrounding, backup restore and persistence after process death. Browser checks and APK verification do not establish those device behaviors.


## Android emulator acceptance — 24 October 2026

All eight modes, guided/independent learning, daily/focused sessions, native document import, backup restore, fixed-exposure assessment, native Back/backgrounding and exact-state force-stop persistence passed on Android 17/API 37 with no active network. Upgrade from 1.1.0 also preserved history. 64 Node tests and Android build/lint pass. Reusable native tests: tests/android-runtime-qa. Full evidence: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.1.1-emulator-validation.md. Physical-phone/TalkBack/manual picker and older runtime acceptance remain.



## Visual interaction in 1.2.0

Every answer is a draft until Check. Tap the piece or its square; no dragging or line drawing is required. First-use interactive demonstrations use separate, unscored positions and can be skipped or replayed from Help. Selection outlines and check marks, trace steps, Undo and Reset make the current answer visible. Flash waits for Start, exposes the board, then masks it. Before/After asks for a prediction before revealing the move.

Training hides navigation and uses one compact task, board and action dock. Today recommends review or practice; Explore contains eight modes. Learn follows See, Connect, Anticipate and Verify. Twenty-four separate visual checks cover the twelve lessons. Progress separates independent recognition, understanding, assistance and held-out assessment.

Explicit presentation metadata covers all 576 bundled exercises; full original questions remain in Help. Recognition time ends at the last selection change. Existing storage keys, native durability bridge, rules, content, imports and signing key are retained. Demonstration history and visual-check identifiers are additive metadata in the existing backup.


## 1.2.0 acceptance — 24 October 2026

79 Node tests, Android build and lint pass (zero errors; two retained icon warnings). All eight modes and the guided/independent/focused/daily learning, native document import, assessment/interruption, backup restore and exact-state force-stop persistence checks pass offline on Android 17/API 37. Actual upgrade from 1.1.2 preserves progress. Both 360x740 and 411x866 CSS viewports, both themes and 200 percent text zoom pass. Final installed APK matches delivery SHA-256 85105aa3ff2acdbb32a2107a98822109359d8367bab617414404d77ceaa4f2b0. Validation, screenshots and evidence: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.2.0. Physical-phone, TalkBack and independent human usability acceptance remain.



## Split workspace in 1.2.1

The document is locked to the viewport. Desktop/landscape training uses a large board beside a fixed coach and independently scrolling context pane; phone portrait stacks the panes. Start/Check/Next remain fixed. The local Vision Coach explains the current interaction without any AI service. Charcoal defaults and green controls follow the requested tournament theme; saved light-theme choices remain available. Browser regressions are in tests/browser-workspace. 82 Node tests, 42 responsive browser checks, 16 complete browser flows and Android build/lint pass. This update has not been rerun in the emulator or on a physical phone. Delivery: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.2.1.



## 1.2.2 readable lessons

The supplied lesson screenshot guides the new mixed theme: dark neutral chrome with white reading surfaces and dark text. Mobile lessons use a compact speech bubble, original SVG coach portrait, full-width cream/green board and simple footer. White reading cards and larger text extend to Home, Learn, Games, Progress, feedback and Help. Desktop retains the split workspace. 82 Node tests, 42 responsive checks, 16 browser interaction flows and 10 reading-surface/contrast checks pass; Android build/lint pass. No emulator run is claimed for this update. Deliverables: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.2.2.



## 1.2.3 Android acceptance — 25 October 2026

Fixed the all-green exercise progress segments and enlarged-text header overlap reproduced in the emulator. All eight training modes, learning, imports, assessments, backup restore and exact offline force-stop/cold-reopen persistence pass on Android 17/API 37. Both 411x866 and 360x740 CSS layouts, both themes and 200 percent text zoom pass. 82 Node tests and Android build/lint pass. Delivery APK is hash-matched to the installed emulator APK; reports and native screenshots: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.2.3. Physical-phone, TalkBack, manual picker browsing and older runtime acceptance remain.



