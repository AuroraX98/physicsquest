# PhysicsQuest 0.17.2 — remove repetition that adds no teaching

Audited all 1,083 lessons across 23 courses. The audit compared the explanation, optional detail, equations, worked examples, practice text and visual presentation. Every Understand page was also rendered in Chrome and checked for duplicate paragraph and equation blocks. A separate review checked 55 similar paraphrases and the reading guides for the existing models.

## Changes

- Removed redundant Explore steps from 1,038 lessons. These steps showed either the same main sentence or the same static picture already available in Understand. They now go from Understand to Check to Apply. The 45 Explore pages that add a model or a distinct diagram remain.
- Removed 324 repeated equation blocks from optional detail. Equations and their visible symbol keys stay in the main explanation.
- Removed or shortened 169 repeated detail paragraphs, including 55 reviewed paraphrases. A section containing only a model limit is now labeled “When this applies.” New conditions, scientific distinctions and extra mathematical detail remain.
- Removed 773 optional word-definition entries already explained by the visible equation key. Explore glossaries also omit identical definitions already visible there, while keeping glossary examples.
- Show each of the 289 duplicated practice prompts once. Removed the matching second copy of its worked reasoning; the main response reveal and numerical feedback remain.
- Removed ten model-card titles that merely repeated the page heading, and shortened repeated model captions.
- Added one picture to “Correct a steady offset”: 52 squares represent the displayed 52 g; two pale squares show the known 2 g offset, leaving a corrected estimate of 50 g. This is the lesson’s existing example, not a new problem. The caption states that remaining uncertainty is not pictured.
- Kept review pictures within the review card on wide and narrow screens.

Useful repetition remains when it serves a different purpose: values on a graph, equation keys beside a model, accessible image descriptions and practice of the same idea. This is a whole-catalogue structural and similarity audit with targeted wording review, not a guarantee that no possible paraphrase remains anywhere.

## Verification

- 288 automated tests passed; syntax checks passed.
- 1,083 desktop Understand pages: correct step sequence, one worked example, no repeated paragraph or equation blocks, no missing content, no page overflow.
- 209 picture lessons at 320 CSS pixels: passed.
- Forward/back navigation and old Explore links: passed in all 23 courses. Stable phase IDs are retained for saved routes.
- Preparation navigation: all 23 paths passed.
- All 45 distinct Explore pages loaded; all 43 interactive models passed keyboard change and reset checks.
- All 289 affected Apply pages retain numerical practice and show their prompt once.
- Review layout checked with an isolated, temporary fixture at 1366 and 320 CSS pixels. Optional-detail keyboard toggle passed.

Browser checks used Chrome. Other browser engines and screen-reader speech were not exercised. The source lesson catalogue, answer keys, learner storage format, completion marks and saved writing were not rewritten. Browser navigation checks ran against the local preview; only the final representative lesson was checked on the published site.

## Course coverage

| Course | Lessons checked | Redundant Explore steps removed | Repeated equation blocks removed |
| --- | ---: | ---: | ---: |
| foundations | 9 | 2 | 1 |
| math | 66 | 60 | 20 |
| mechanics | 61 | 57 | 5 |
| em | 56 | 52 | 0 |
| waves | 48 | 44 | 0 |
| thermodynamics | 56 | 55 | 26 |
| optics | 48 | 47 | 9 |
| relativity | 40 | 39 | 0 |
| atomic-nuclear | 56 | 55 | 2 |
| particles | 40 | 39 | 3 |
| materials | 56 | 54 | 0 |
| astrophysics | 56 | 54 | 0 |
| quantum1 | 72 | 68 | 0 |
| quantum2 | 70 | 66 | 0 |
| quantum3 | 84 | 81 | 0 |
| advanced-mechanics | 63 | 63 | 59 |
| fluid-dynamics | 38 | 38 | 38 |
| plasma | 31 | 31 | 29 |
| general-relativity | 30 | 30 | 29 |
| experimental-methods | 25 | 25 | 25 |
| quantum-information | 26 | 26 | 26 |
| many-body | 25 | 25 | 25 |
| quantum-field-theory | 27 | 27 | 27 |
