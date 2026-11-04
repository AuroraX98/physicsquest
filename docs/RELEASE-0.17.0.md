# PhysicsQuest 0.17.0: lesson visuals

Reviewed all 1,083 lessons in 23 courses. Added 208 pictures of the lessons' existing worked examples. Each picture stays inside the one-example section in Understand and is available in Explore where there is no existing interactive model.

## Teaching changes

- Added matching scales to General Relativity's coordinate-distance lesson: 3 coordinate metres represent 6 measured metres when the metric coefficient is 4. The caption explains that a scale change alone does not prove curvature.
- Added motion graphs, shaded-area graphs, probability bars, wave shapes, energy curves, circles, measurement plots, and other example-based diagrams.
- Reviewed all 43 existing interactive lesson attachments and the two existing static diagrams. Added a short plain-language reading guide for each model type. Existing model explorations explicitly identify their current inputs and can use starting values different from Understand.
- Replaced old concept-summary text at display time with the lesson's focused idea. Interactive models no longer append static lesson values that could be confused with live readings.
- Corrected the vector diagram to use equal metre scales, aligned several starting values with their examples, and removed the unrelated conjugate construction from the first complex-number visual.
- Used distinct solid, dashed, and dotted lines where three series are compared. Legends and text carry meaning alongside colour.
- Corrected the analytical-mechanics turning-point example from the erroneous energy unit “5 p_φ” to “5 J” in both copies. Historical preservation tests explicitly allow only this correction.
- Versioned changed module imports and content requests so returning browsers load the current visual and lesson files.

## Readability and access

Equations and their existing symbol keys remain labeled. Every new picture has a title, short explanation, labels and units, accessible description, and an expandable table of its values. Matching scales and bars reflow on phones. Detailed plots retain readable labels in a keyboard-scrollable region, with a visible phone hint and a text-table alternative. No new animation or autoplay was introduced.

## Coverage

| Course | Lessons reviewed | New example pictures |
| --- | ---: | ---: |
| foundations | 9 | 6 |
| math | 66 | 21 |
| mechanics | 61 | 22 |
| em | 56 | 10 |
| waves | 48 | 15 |
| thermodynamics | 56 | 8 |
| optics | 48 | 8 |
| relativity | 40 | 6 |
| atomic-nuclear | 56 | 8 |
| particles | 40 | 4 |
| materials | 56 | 7 |
| astrophysics | 56 | 8 |
| quantum1 | 72 | 12 |
| quantum2 | 70 | 7 |
| quantum3 | 84 | 7 |
| advanced-mechanics | 63 | 10 |
| fluid-dynamics | 38 | 6 |
| plasma | 31 | 7 |
| general-relativity | 30 | 7 |
| experimental-methods | 25 | 8 |
| quantum-information | 26 | 8 |
| many-body | 25 | 7 |
| quantum-field-theory | 27 | 6 |

The per-lesson review is recorded in docs/lesson-visual-audit.json. 856 lessons keep a short text explanation where another quantitative picture would add assumptions or repeat a straightforward calculation. The remaining 19 lessons without a new example picture retain 17 interactive attachments and two existing static diagrams; 26 other interactive lessons also gained a picture in Understand.

## Verification

- 283 automated tests passed; zero failures or skips. JavaScript syntax checks passed.
- Every course's diagram data was checked for valid IDs, finite values, axis bounds, accessible names, and preservation of one worked example.
- Independent checks cover area totals, probability normalization and shaded areas, Gaussian and hydrogen probabilities, metric-scale values, pipe-profile speed, and equal-radius geometry.
- Existing model renderers were exercised at default inputs and each individual control's limits, including charging/discharging and travelling/standing modes.
- Browser checks covered 227 unique lesson pages on desktop and at 320 px phone width, with no page overflow, missing visuals, invalid values, or clipped SVG number labels after fixes.
- All 43 interactive attachments responded to keyboard changes and reset correctly. At the Fermi curve's midpoint, the value correctly stays 0.5 while temperature changes the curve's shape.
- The values disclosure was opened using Enter; responsive matching scales and their full value table were inspected visually.

Browser evidence is from Chrome. Screen-reader speech, Safari, Firefox, and a study with learners were not tested. This is a source, content, rendering, and interaction check, not a measured claim about learning outcomes.

No lesson IDs, progress-storage keys, existing learner notes, answers, or completion data were changed. The current public audience is preserved.
