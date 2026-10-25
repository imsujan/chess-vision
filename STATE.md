# 1.3.0 — Intermediate real-game training, 25 October 2026

Normal queues and due review now exclude beginner diagrams. Twelve-position resumable calibration selects Supported/Standard/Stretch; 259/211/160 validated real-game items use 16/18/20-piece floors. Calibration and assessment are held out and isolated from practice mastery. Labels, answer sets, tracing and real-game understanding checks derive from actual piece geometry; imported PGNs use the same validation and FEN identity. Existing lessons, rules, storage keys and signing identity remain.

Validation: 98 Node tests; independent python-chess recomputation of 539 variants across 468 source games; Gradle assemble/lint; 16 phone/desktop browser mode flows; all eight offline Android mode sessions, calibration interruption, in-place upgrade from 1.2.3, imports, assessment interruption, backup/restore and force-stop persistence. Final-APK smoke covers all eight modes after clearing stale understanding feedback. Fixed imported-record boolean validation that could discard history on cold reopen, with regression checks. No backend or runtime package added.

Delivery: outputs/chess-vision-1.3.0/ChessVision-1.3.0-debug.apk under the retained 2026-10-23 chat workspace. SHA256 21a5f158536a4f51a9a1cbd2638c5599f33a0642d20418a7dc21819ab13d98fb. See delivery validation.md for exact evidence and limitations. Calibration is not an Elo estimate; these are geometric questions, not engine-certified winning tactics. Physical-phone usability remains separate acceptance. No Git commit or LiStudy changes.

# 1.2.3 — Android acceptance, 25 October 2026

Tested the delivered 1.2.2 APK in an isolated offline Android 17/API 37 emulator (WebView 145.0.7632.218). Reproduced two visual bugs: all exercise-progress segments appeared filled at the first item, and the title overlapped the instruction card at 200 percent text zoom. Corrected future-segment styling and bounded the title/counter/Back/Help layout. Version 1.2.3 / code 8 retains app ID, signing key, rules, content, scoring, storage keys and native durability bridge.

Final 1.2.3 installed-APK matrix passes: native readability/contrast and 200 percent text; all eight complete modes; worked/guided/independent/focused/daily learning; wrong-answer/understanding repair; document PGN import and offline errors; flip/layers; assessment and interruption; Back/backgrounding; backup restore; exact force-stop/cold-reopen persistence. Exact 136-attempt state survived the main matrix; exact 138-attempt state survived a second comparison after 360x740 checks. Normal viewport 411x866, both themes tested. No active network, Wi-Fi disabled, airplane mode enabled. All 82 Node tests and Android build/lint pass (0 errors, 2 retained icon warnings). Native tests use touch events and real timers; document picker result is substituted with a synthetic content URI. Physical-phone, manual picker browsing, TalkBack and other Android/WebView versions remain separate acceptance.

Final APK: C:/magniProjects/archive/chat-workspaces/codex/2026-10-23/referenced-chatgpt-conversation-this-is-an/outputs/chess-vision-1.2.3/ChessVision-1.2.3-debug.apk
SHA-256: 5d4378ad214d445d05ae7afd548161efdc68d445f2f9e5b2e1d624d4f2924138 (241242 bytes). Signature verifies, all 19 assets match source, and a pulled emulator-installed APK exactly matches delivery. Validation/screenshots/raw JSON evidence in that folder. Working evidence/backups: C:/magniProjects/archive/chat-workspaces/codex/android-acceptance-20261025. Previous releases retained unchanged. Emulator closed after acceptance; no phone modified, Git commit or delegated agents.

---
# 1.2.2 — reference-based lesson readability

Applied the user's supplied mobile lesson example: neutral dark shell, white instruction bubble with dark text, original SVG coach portrait, cream/green edge-to-edge mobile board and simple progress/action footer. Desktop retains the split. White reading surfaces and larger text extend through Home, Learn, lesson details, Games, Progress, feedback and Help. reference.css contains these presentation overrides. visual-flow.js sizes the board using the actual visible perspective label rather than a fixed reservation. Rules, content, scoring, storage keys and imports are unchanged.

82 Node tests pass; 42 responsive mode/viewport checks; 16 browser response/understanding flows with reload persistence, themes and demo layouts; 10 reading-surface checks across phone/desktop and lesson action contrast. Coach title contrast 15.55:1, body 10.45:1. Android build/lint pass (zero errors, two retained icon warnings); Java unit task has no sources. All 19 bundled assets match source and existing-key signature verifies. This APK has NOT been rerun in an Android emulator or physical phone. Prior emulator acceptance remains historical only.

Version 1.2.2 / code 7; same app ID/key. Delivery: C:/magniProjects/archive/chat-workspaces/codex/2026-10-23/referenced-chatgpt-conversation-this-is-an/outputs/chess-vision-1.2.2/ChessVision-1.2.2-debug.apk
SHA-256: 353a13b4d3ff3425253121a8db084a4af39c40698a86815e9a33a6c553485a2a (241064 bytes). Validation, screenshots and evidence in that delivery folder. Working backups: C:/magniProjects/archive/chat-workspaces/codex/lesson-readability. Browser regression: tests/browser-workspace/readability-qa.cjs. No Git commit, delegated agent work or LiStudy changes.

---
# 1.2.1 — viewport-locked split workspace

Training now uses an independently sized board on the left and coach/context/action panel on the right. Portrait phones stack the panes without document scrolling; landscape keeps the split. workspace.css owns the responsive layout and charcoal/green tokens. The state-driven Vision Coach is local deterministic guidance, not a network AI feature. Independent narration/context scroll regions, accessible names, fixed primary actions and new-exercise scroll reset preserve a stable board. Other destinations use contained content scroll. No rules, scoring, content or storage schema changes.

82 Node tests pass. Real browser checks: 42 mode/viewport combinations across six sizes, independent narration scrolling, all destinations; 16 complete response/understanding flows at desktop/phone sizes; reload persistence; both themes; six demo layouts. Reusable tests: tests/browser-workspace. Android build/lint pass: 0 errors, 2 retained icon warnings. APK v1/v2 signature and all 18 source assets verified. This update has not been tested in the Android emulator or physical phone; do not apply earlier runtime acceptance to it.

Version 1.2.1 / code 6. Same app ID/signing key. Final APK: C:/magniProjects/archive/chat-workspaces/codex/2026-10-23/referenced-chatgpt-conversation-this-is-an/outputs/chess-vision-1.2.1/ChessVision-1.2.1-debug.apk
SHA-256: 571dda8e78c5462ca6b2708a536f55aec20b5e7379394dff056417e3f6355093 (246463 bytes). That folder includes validation.md, screenshots and evidence. Preview: http://127.0.0.1:4173/. Task backups/evidence: C:/magniProjects/archive/chat-workspaces/codex/split-workspace. Prior releases retained. No Git commit or delegated agents. LiStudy untouched.

---
# 1.2.0 — 24 October 2026

Implemented the approved visual, self-guiding redesign in the existing native Android/bundled JavaScript application. No frontend framework, runtime package or backend added. Explicit task metadata covers all 576 existing exercises. New shared visual presenters provide editable drafts, explicit Check, Undo/Reset, six separate interactive demonstrations, focus training, progressive feedback and 24 geometry-validated visual understanding checks across 12 lessons. Today/Learn/Games/Progress navigation and the four-capability learning path are implemented.

Existing chess rules, exercise content, imports, storage keys, native durability bridge, application ID and signing key retained. Additive learning.ui stores demonstration/worked-example history; visual understanding records retain understandingCorrect with kind/identifier. Recognition timing ends at the last selection change. Version 1.2.0 / code 5.

79 Node tests and Android assemble/lint/unit-task pass; Java unit task has no sources. Lint has zero errors and two retained icon warnings. Full offline emulator matrix passes: all eight modes; guided, independent, worked and focused learning; daily practice; document PGN and error states; assessment and interruption; native Back/backgrounding; backup restore; exact-state force-stop persistence (146-attempt full matrix and 77-attempt final packaged build). Actual 1.1.2 in-place upgrade retains state. Both 360x740 and 411x866 CSS layouts, both themes, 200 percent text zoom pass. Final package is pulled back from the emulator and hash-matched to delivery; all 17 assets match source. Final style-only touch target overrides received repeated layout/control/persistence acceptance.

Final APK: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.2.0\ChessVision-1.2.0-debug.apk
SHA-256: 85105aa3ff2acdbb32a2107a98822109359d8367bab617414404d77ceaa4f2b0 (232836 bytes).
Delivery folder includes validation.md, screenshots.md, screenshots and evidence. Source backups/test working evidence: C:\magniProjects\archive\chat-workspaces\codex\redesign-1.2.0. No Git metadata, commit or delegated agent work. Unrelated LiStudy workspace untouched.

Remaining acceptance: physical phone, manual system picker, TalkBack, older runtime versions and independent human usability without outside explanation. Retained artwork provenance is undocumented in supplied source; no new external artwork introduced. Emulator success is not human usability or rating-improvement evidence.

---
## 1.1.2 — 24 October 2026

Addressed reported exercise confusion: full goals retained, explicit piece/square/set/verdict instructions, live trace-step guidance with reset, Ready gate before timed exposure, and clear concept-check continuation. No moving or line drawing required. Existing content, chess rules and durable storage unchanged. 69 Node tests, Android build/lint and 39 native checks passed on offline Android 17; all eight modes, assessment and exact-state cold reopen covered. Physical-phone and human usability acceptance remain. APK SHA-256: 20833e415e660752c3ec37778b4fc4fa95e479785f4d49a6c37738489129c1b9. Delivery: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\ChessVision-1.1.2-debug.apk. Details: outputs/chess-vision-1.1.2-ui-validation.md. Backup: C:\magniProjects\archive\chat-workspaces\codex\clarity-20261024\before.

## 1.1.1 — 24 October 2026

Fixed a reproduced immediate-process-stop loss of the latest WebView storage writes. Android now commits the three existing storage keys with a restricted native SharedPreferences bridge; legacy v1 progress migrates automatically and browser localStorage remains supported. Preserved app ID, content, rules and signing key. Four regression tests added (64 total, all passing); Gradle build/lint pass (0 errors, 2 pre-existing icon warnings).

All eight modes plus daily/focused/guided/independent learning, fixed assessment and interruption, native file import, backup restore, backgrounding/Back and offline force-stop persistence passed in an isolated read-only Android 17/API 37 emulator. Exact 113-attempt state, reflection and preferences survived cold reopen. In-place 1.1.0 upgrade preserved data. Runtime runner in tests/android-runtime-qa. Phone/TalkBack/manual picker/older runtime acceptance remains.

Final APK: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\ChessVision-1.1.1-debug.apk (201811 bytes); SHA-256 95aeb76cd19a7ce93b714e8cca3a8dc7e2555855cda05c6f18d86be2d2ff2a19. Report: C:\magniProjects\archive\chat-workspaces\codex\2026-10-23\referenced-chatgpt-conversation-this-is-an\outputs\chess-vision-1.1.1-emulator-validation.md. Source backup: C:\Users\user\.codex\visualizations\2026\10\23\01a16999-fd8c-73c2-bf90-733484b568b3\android-qa-20261024\production-before-1.1.1. No Git metadata; no commit. The unrelated LiStudy workspace was untouched.

# Current state — 23 October 2026

Active project: C:/magniProjects/projects/chess-vision-android, explicitly selected by the user. No Git metadata supplied. Preserve history/storage and application ID. No agents delegated.

## 1.1.0

The supplied research report is mapped in docs/learning-framework.md. Added 12 lessons, concept checks, reflections, guided/independent distinctions, set answers, three-step tracing, a six-week guide and explicit review/latency policies. Pack: 576 exercises, including 480 CC0 real-game examples from distinct games; 96 are assessment-only, separated by source game. Fresh fixed exposures exclude interruption/repetition. No rating efficacy is claimed.

Original geometry detectors and 14 seed inputs remain. chess.js 1.4.0 (bundled, BSD-2-Clause) supplies full legal moves and PGN replay. A clone-based teaching correction layer fixes four misleading legacy explanations without rewriting history. Original geometry/seed block SHA-256: 631ebdfb2e33b9b371e17e57382277f9f625287604c01a5cc42e4de9e80f04ea.

V1 storage key remains chess_vision_local_state_v1; learning metadata is additive and backed up. Rules/content are local. Only explicit public-game imports need internet.

## Build setup

Project-local JDK 17: ignored .tooling/jdk-17. Checksum-pinned Gradle 8.2.1 wrapper; local cache under .tooling/gradle-home. SDK 34 and Build Tools 34.0.0 added to the existing SDK. Global PATH/Java unchanged. Build with Build.ps1. App ID unchanged; versionCode 2 / versionName 1.1.0.

## Evidence

- 60 Node tests: legal rules/PGN, dual-engine content checks, set/trace answers, retention, assistance, confidence and assessment isolation.
- Frozen pack rebuilds byte-identically from included source rows, offline.
- Final actual-project wrapper assembleDebug/lintDebug/testDebugUnitTest succeeded. APK signature verifies with v1/v2, and all 12 bundled assets match actual source hashes. No build blocker remains.
- Browser checks: lesson → example → independent response → principle check; real-game tracing. Additional checks and APK hash are in the delivery report.

## Boundaries

Phone acceptance remains. Existing launcher artwork has nonfatal lint warnings; piece provenance was absent from the supplied project. Public redistribution requires provenance review. Advanced strategic teaching is diagram-based, not a complete positional evaluation engine. Personal-game snapshots are review opportunities, not automatically established blunders.

Final APK: ChessVision-1.1.0-debug.apk, 210089 bytes. SHA-256: bf0946d423ea285f6f894d7468b3c5689dbd73c729bc9bc2023b8818a2618473. Full report: this chat outputs/chess-vision-1.1.0-validation.md. Phone acceptance pending user test.






