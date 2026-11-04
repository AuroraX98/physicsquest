# Release 0.1.0 verification — 2026-10-27

Scope: 8 Foundations lessons, 4 Mechanics lessons, 11 interactive analytic models plus a reasoning-flow summary. Full mechanics, mathematics, E&M, waves and quantum courses are not represented as complete.

Passed: JavaScript syntax checks; 20 built-in Node tests covering content schema, finite scope, correct-answer distribution, mathematical prerequisite notation, local assets, model cases, reductions/invariants, chart-domain bounds and runtime dependency absence. Independent reviewer read all 12 lessons and model implementation, then passed 38 analytic assertions. Corrected reviewer findings: all-first answer positions; previously undefined square and square-root notation. Reviewer rechecked both corrections and found no remaining blocker within that bounded science/model review.

Not run successfully: rendered desktop/mobile and keyboard/persistence interaction QA. Supported managed `sites-preview start` timed out after static server readiness output; `sites-preview status` reported stopped. No alternative server or browser route was substituted. This infrastructure limitation does not establish that the app is defect-free in a browser. Source has responsive layouts and native accessible controls, but full accessibility compliance is not claimed.

Progress export/import is implemented; actual browser download/import/reload flows remain unverified in this release. Browser-only progress is labelled explicitly and is off by default.
