# Responsive workspace browser checks

Run with Node and a development installation of Playwright (Edge channel). No browser package is shipped with the app. Set PLAYWRIGHT_MODULE to an absolute installed module path if it is not on Node's module search path. From an output directory, run the absolute path to layout-qa.cjs and then interaction-qa.cjs. Each script owns an isolated localhost:4174 server and a fresh headless browser, writes screenshots/JSON into the current directory, then exits. Do not run them concurrently on the same port. No personal browser profile is used.

Layout checks cover six viewports (1440x900, 1024x768, 768x1024, 360x740, 411x866, 667x375), each mode entry point, board/action fit, locked document scroll, long narration scroll isolation and all four destinations. Interaction checks exercise eight kinds of answer at desktop and phone sizes, explicit draft/Check behavior, visual understanding, local reload persistence, both themes and the six first-use demo layouts. Native emulator acceptance is a separate workflow under android-runtime-qa.

readability-qa.cjs checks the 1.2.2 white reading surfaces across all destinations and the coach at two viewport sizes. It measures foreground/background contrast, resolves transparent lesson buttons against their parent surface, checks header position and captures settled screenshots. Run separately on the same isolated test port after the other scripts.


1.3.0: intermediate-qa.cjs checks calibration resume, isolated mastery, real-game interactions in all eight modes at 360x740 and 1440x900, plus profile/history reload. Set PLAYWRIGHT_MODULE to an installed Playwright module; use isolated browser contexts.

course-qa.cjs: isolated Edge browser checks at 360x740, 411x866 and 1440x900 in both themes; eleven chapters, recall touches, concept inspection and fresh-page course recovery. Writes screenshots and course-browser-results.json in the current directory.
