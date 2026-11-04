# PhysicsQuest 0.16.0

All eight planned advanced courses now have their defined first-course scope available. The app has 1,083 lessons across 23 courses, 843 numerical practice parts and the existing 41 interactive model types.

| Advanced course | Lessons | Modules |
| --- | ---: | ---: |
| Analytical mechanics | 63 | 10 |
| Fluid dynamics | 38 | 6 |
| Plasma physics | 31 | 6 |
| General relativity | 30 | 6 |
| Experimental methods | 25 | 6 |
| Quantum information | 26 | 6 |
| Many-body physics | 25 | 6 |
| Quantum field theory | 27 | 6 |

This release adds 140 lessons in 30 modules. Each module was authored and checked before moving to the next. The original 943 lessons, their stable IDs and existing progress format are preserved. Course pages separate the available scope from further study; these are bounded introductions, not university or research qualifications.

The focused view keeps one idea, a short explanation and one worked example. The final wording pass replaces dense phrases with direct explanations while retaining physical assumptions in the deeper notes. For example, the curvature lesson says that changing the order of two steps can change the result. New Explore panels are explicitly labeled static summaries, rather than interactive simulations.

## Equation meanings

All 1,083 lessons have companion keys for their focused and deeper equation boxes: 1,842 distinct formula strings within lessons. Each key appears directly below its equation, with meanings of the quantities and help reading the mathematical marks. The keys also appear in Explore and in the revealed Review lesson. No glossary click is needed to see them.

Meanings are specific to the lesson. Examples include e as electric charge versus the exponential constant, m as mass versus metres, π as field momentum versus the circle constant, and raised tensor labels versus powers. Equations and definitions remain selectable text, with semantic headings and definition lists. The key files load one course at a time.

The primary equation key is the lesson's reference for symbols reused in prose, examples and practice. This release does not duplicate the complete key beside every inline occurrence of the same formula. Additional subject terms and detailed validity conditions remain in the optional glossary and deeper explanation.

The companion data is reproducible with `python tools/build-equation-keys.py`. Its lesson definitions and reviewed overrides are in `tools/equation-definitions.json`. Adding a new notation or changing a symbol's meaning needs an authored definition and a semantic review; the compiler is not a scientific proofreader.

## Verification

- 255 automated tests pass, with zero failures or skips. These include independent numerical answers for all new modules, preservation of published lessons, stable prerequisites, coverage maps, progress backups, equation-key rendering, HTML escaping and ambiguous-symbol regression checks.
- JavaScript syntax checks pass.
- Local Chrome checks cover all 140 new lessons: 280 Understand/Explore screens, wrong and correct check answers, numerical answers entered with the keyboard, and narrow layouts at 320 and 250 pixels. All 30 module boundaries and six new course endings were checked.
- Notes and numerical drafts survive reload in the six new course endings on the isolated localhost preview.
- After adding equation keys, representative focused and expanded lessons in all 23 courses were checked at 320 pixels. A relativity tensor key also passed at 250 pixels. Keyboard step navigation, focus return, and the corrected field-momentum meaning were checked. No console errors or warnings were observed.
- The publication check compares every deployed non-HTML asset byte for byte with the checked source and verifies the release markers in hosted HTML. Its results are recorded in the accompanying publication report.

Browser evidence is from Chrome on Windows. Spoken screen-reader behavior, physical-phone use, and Safari/Firefox were not verified. The main advanced equations still require the preparation linked from their courses, even when their explanations use simple language.

The existing Sites audience and local progress storage are unchanged. No learner data was used in QA or sent to a server. Test notes were confined to localhost. The separate historical GitHub mirror was not updated by this release.
