# PhysicsQuest 0.11.0 — review and preparation

The remaining app improvements now include related-word and typo-tolerant course search, a learner-controlled review list, and guided preparation. The first explanation still presents one idea and one example, with a labeled Equation code block when an equation is used.

## Changes

- Search prioritizes literal matches, then related terms, then a single spelling edit for longer words. Related and closest matches are labeled. Short scientific symbols are not guessed.
- Review asks the learner to recall one saved idea before revealing its explanation and example. The learner chooses tomorrow, three days or seven days. Remove has Undo. The app sends no alerts; saving remains optional and local.
- Sixteen independently authored basic maths lessons add fractions, decimals, signed numbers, percent, brackets, powers, square roots, reciprocals, substitution, functions, proportion, exponential growth, logarithms, subscripts, sums and signed changes.
- All 15 current courses have preparation entry points and selected lesson paths. Stable deep links, Previous/Next, a path overview and separate saved places allow a learner to return to the intended course. Earlier courses are linked explicitly. A short refresher does not replace full prerequisite courses and practice.
- Eight future subjects now have preparation paths, missing-tool lists and proposed learning orders: analytical mechanics, full fluid dynamics, plasma physics, general relativity, experimental methods, quantum information, many-body physics and quantum field theory. The new advanced courses themselves remain clearly marked planned.
- Mobile form text uses 16-pixel text and common standalone controls use a minimum 44-pixel height. Review messages wrap and remain visible. These later CSS changes still require a physical-device check.
- Fixed a search-cache initialization error during development, a course-template integration error caught in source review, stale completion counts after clearing marks on preparation pages, and misleading new-feature save status after a storage failure.

The app now has 818 available lessons across 15 courses and 578 numerical practice parts. The 794 original lessons, their plain layers, and the prior eight supplemental lessons are unchanged. Existing progress keys, completion IDs and version-1 backups remain compatible. Imported data fills gaps without replacing current writing, chosen review dates or preparation places.

## Verification

- JavaScript syntax checks and 183 Node tests passed, with zero failures or skips.
- All 23 preparation paths resolve their lesson and course links. Every step and phase, previous/next boundary and backup round trip is checked. Invalid or out-of-path routes are rejected.
- All 16 new numerical answers independently recompute. Each new lesson renders one example and labeled equation code. New basic prerequisites point to earlier basic lessons.
- Browser search walkthrough: `bouyancy` found buoyancy; `floating` found related lessons; empty results and Clear recovered correctly.
- Browser review walkthrough: add, reveal one example, choose three days, reload, remove and Undo all worked using local test data.
- Browser inspection of 45 model routes found labeled controls, range value text and SVG names where SVGs were present. Default SVG text samples had no detected contrast ratio below 4.5:1 against the model-card background. This did not verify every line/fill/overlap or slider state.
- Full original-content preservation and local asset/import checks pass. No new third-party runtime dependencies, backend, analytics or cloud learner storage were introduced.

## Verification limits

The computer-use runtime stopped the native Chrome check because it could not confidently determine the browser URL on Windows. No further browser automation was used. Actual browser zoom, screen-reader behavior, phone keyboard, OS scaling, Safari and Firefox remain unverified. Preparation pages and the later mobile CSS have source, data and template tests but no completed browser walkthrough in this release.

No representative learner session, measured reading age or retention study was conducted. The user's experience so far stops at the first lesson. Advanced original Check/Apply tasks still require their stated preparation. Completion marks and a completed preparation path do not certify readiness or mastery. The five earlier navigation checks awaiting actual devices or representative users remain unverified.

## Reference basis

The recall/revisit approach is consistent with the [IES learning practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/1). The 1/3/7-day choices are learner controls, not claimed optimal intervals. Accessibility checks use the W3C explanations of [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html); this release is not a full WCAG conformance claim.

Each future path includes primary subject-scope references. The path selection and proposed sequence are editorial planning decisions, not copied teaching content or a claim of equivalence to those courses. The existing public Sites audience is preserved. The separate GitHub mirror is outside this update.
