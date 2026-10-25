# Learning design and research coverage

This release implements the user's **Chess Vision — Research-Based Learning Framework & Product Design Report v1.0 (23 October 2026)**. It applies the report as a product specification; it does not claim that the product has established efficacy or produces a particular rating gain.

## See → Connect → Anticipate → Verify

The Learn screen exposes four capability profiles, twelve lessons and an adaptive six-week guide. The early lessons emphasize P0 attack/defense, knight geometry, lines and blockers. P1 and P2 relationships remain available without artificial locks.

| Report requirement | Implementation |
|---|---|
| Minimal explanations and geometry | Twelve original lessons; reusable SVG board; concise principles, steps and worked examples |
| Active identification | Unassisted square, complete-set and three-stage relationship responses |
| Contrasting examples | Fourteen paired families / 28 exercises, plus real-game defended/undefended verdict questions |
| Realistic complexity | 480 legal real-game examples from 480 distinct Lichess source games |
| Accuracy before speed | Flash starts at 6 seconds; at least 10 distinct examples across 2 local days and 85% independent accuracy allow 4 seconds; 20 examples / 3 days / 90% allow 2.5 seconds |
| Transfer assessment | 96 held-out examples, separated by source game; never used by a normal practice queue |
| Fixed exposure and first attempts | Fresh assessment: twelve 5-second exposures, no hints or extra flashes; interrupted/repeated exposures excluded |
| Eight training experiences | Geometry X-Ray, Threat Scan, Pattern or Illusion, Flash Recognition, Before / After, Relationship Tracing, Personal Game Vision, Mixed Recognition |
| Five- and twenty-minute routines | Eight-item daily mix; sixteen-item focused sequence with guided concept, contrast, real-game and flash phases; durations are approximate |
| Explain and reflect | A principle question follows each answer; local reflection notebook and worked-example return path |
| Weakness and review | Approximate 50/30/20 weak/review/new allocation with fallbacks; error repair; 1/3/7/14/30-day review defaults |
| Independent evidence | Recognition accuracy and median correct latency; separate principle checks, confidence calibration and delayed retrieval |
| False positives and hint dependence | False positives use absent-pattern verdict trials as their denominator; guided/hinted/extra-flash attempts are excluded from recognition scores |
| Practical transfer | Local full-rules PGN replay, FEN drills, personal-position counts and reflection; no automated claim that a historical move was a blunder |
| Backup and offline use | Existing v1 attempts/storage key preserved; additive learning metadata is included in JSON backups; all essential content and rules are bundled |

## What the evidence means

- **Introduced:** the lesson was opened; this is not evidence of understanding.
- **Learning:** the learner has attempted at least one item.
- **Practiced:** correct, unassisted square and principle responses on at least two distinct items.
- **Retention evidence:** at least three distinct independent successes and at least two items with another independent success separated by 24 hours. This is limited evidence, not completion of every item in the topic.
- An immediate repeat cannot advance a spacing stage. A wrong, assisted, or failed-principle answer schedules short repair. The intervals are product heuristics, not chess-specific established constants.
- Previous v1 history is retained but cannot establish hint-free/principle evidence that was not recorded at the time.
- Recognition accuracy is not blended with assisted-learning or assessment results. Assessment never changes practice mastery or review schedules.
- Confidence is an optional self-report. Automatically assigned error categories are review cues, not a verified diagnosis of the learner's cognition.
- Flash latency subtracts the controlled exposure duration; untimed task response latency includes inspection. Compare like task conditions rather than interpreting a global median as a chess rating.

## Content quality and boundaries

The pack has **576 exercises**: 14 retained starter inputs, 48 new teaching drills, 28 contrasting drills, 6 complete-set drills and 480 real-game examples. Some lessons use the same diagram with a different question; this is not a claim of 576 unique source games. The source-game examples comprise 384 practice and 96 assessment items. Source PGNs/FENs and the full supplied puzzle continuation are replayed with python-chess; runtime target attackers/defenders and before/after moves are independently checked with chess.js.

Lichess theme tags do not determine the answer. The first listed move is applied to the stored FEN before selecting the solving-position geometry. Source labels and validation facts are retained. Selection uses a suitable streamed prefix, not a random or statistically representative sample. These are relationship-recognition exercises, not assertions of a Stockfish-certified best move or complete exchange evaluation. Advanced positional lessons illustrate concrete geometry; the app is not a comprehensive strategic evaluation engine.

The original geometry detectors and 14 source seeds remain unchanged. A presentation correction layer fixes four legacy explanations, including one pawn that is defended and one knight that is undefended but not attacked. Original history is not rewritten.

The assessment pool is finite. Previously exposed items, including abandoned exposures, cannot be offered again as unfamiliar. The eligible single-response subset supports baseline and the week-2, week-4 and week-6 checks; exhaustion is explicitly reported. Long-term efficacy, practical-game transfer and rating effects still require observation with the user.

## References

- User-supplied research report, v1.0, 23 October 2026.
- [Chase & Simon, Perception in Chess](https://doi.org/10.1016/0010-0285(73)90004-2).
- [Charness et al., perceptual aspects of skilled chess performance](https://doi.org/10.3758/BF03206384).
- [McGregor & Howes, attack/defense semantics](https://doi.org/10.3758/BF03196427).
- [Bilalić et al., Einstellung effect](https://doi.org/10.1016/j.cogpsych.2007.02.001).
- [Dunlosky et al., learning techniques](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html).
- [Karpicke & Blunt, retrieval practice](https://learninglab.psych.purdue.edu/downloads/2011/2011_Karpicke_Blunt_Science.pdf).
- [Lichess open database, CC0 and puzzle format](https://database.lichess.org/).

The first four references come from the supplied report. Retrieval/distributed-practice sources inform the learning design; the app's exact thresholds and schedules remain engineering choices.
