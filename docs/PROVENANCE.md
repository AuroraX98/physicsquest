# Authorship and provenance ledger

Reviewed 2026-10-27. Lesson prose, numeric examples, answer feedback, application prompts, UI code, CSS and SVG diagrams were independently authored for this project. No CodeQuest implementation, runtime state, identity or configuration was copied. No OCW lecture prose, problem sets, solutions, diagrams, photos, videos or other course assets were imported or adapted.

`dist/content/catalog.json` records topic/prerequisite validation URLs and a BIPM SI reference. These are factual scope references, not provenance claims that source teaching content was reused. `sourceIds` associate lessons with applicable factual reference domains. No per-lesson source narration is inserted in the teaching flow. Copyright protects expression, not a blanket ownership of standard scientific facts, but originality is not a promise that all possible legal obligations are absent. The original app code is licensed under the scoped MIT license in `../LICENSE`. Lesson text, exercises, worked examples, curriculum data, and other teaching content are outside that grant. No additional reuse license is granted for them.

MIT OCW's general license is CC BY-NC-SA 4.0; specific excluded third-party assets can have other terms. It is not the MIT software license. Rewording copied or adapted materials would not itself establish independence or remove license obligations. MIT has no affiliation with or endorsement of this project. No academic credit or equivalent qualification is offered.

## Files

- `dist/content/foundations.json`: eight original introductory lessons, examples and changed-case checks.
- `dist/content/mechanics.json`: 56 original mechanics micro-lessons in a defined introductory map. A full university mechanics sequence or graduate mastery is not claimed.
- `dist/content/catalog.json`: original finite curriculum organization; links used only to check standard scope and prerequisites.
- `dist/physics.js`: standard analytic equations, independently implemented, SI units.
- `dist/models.js`: original SVG/chart/range-control implementation; descriptions and model assumptions provided in accessible HTML/SVG.
- `dist/app.js`, `styles.css`, `index.html`: original app implementation, system fonts and native browser APIs.

## Dependencies and assets

No third-party runtime library, external font, photograph, copied figure or teaching asset is bundled. Node built-ins are used for local tests. Required third-party notices must be retained if the dependency list changes.

