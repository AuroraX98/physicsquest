# PhysicsQuest 0.14.0 — remaining analytical mechanics modules

Analytical mechanics now has 63 lessons in ten modules. This release adds the five remaining planned modules sequentially, preserving the earlier 26 lessons. Each new Understand screen presents one idea, a short explanation, one worked example and a clearly labeled equation code block. Definitions and deeper reasoning remain optional. Check and Apply offer a separate changed case.

| New module | Lessons | Focus |
| --- | ---: | --- |
| Follow moving constraints and their forces | 7 | Moving supports and coordinates, constraint multipliers, forces and power |
| Find orbit shapes and test their stability | 7 | Radial energy, turning points, circular orbits, stability and Kepler orbit shapes |
| Describe rotation of a rigid body | 7 | Point velocity, inertia, principal axes, rotational energy, Euler's equation and the intermediate axis |
| Read nonlinear motion and the onset of chaos | 8 | Nonlinear forces, phase flow, pendulum energy, separatrices, driving, Poincaré sampling and sensitive dependence |
| Change canonical variables and use Hamilton–Jacobi | 8 | Canonical pairs, Hamiltonian changes, generating functions, action and recovering a free-cart path |

The course map, preparation page and course coverage now distinguish the completed defined analytical course from the seven advanced courses still in development. Completion means the selected ten-module sequence is available. The scope note and further-study list describe its limits.

The app has 909 lessons across 23 courses and 669 numerical practice parts. All 872 previous lessons are preserved. There remain 41 interactive model types; the new Explore screens explicitly identify their static summaries. No new dependencies, analytics, backend or transmission of learner work were added. Existing optional browser saving, backups and public Sites access are preserved.

## Verification

- All 209 Node tests pass, with zero failures or skips. JavaScript syntax checks pass.
- Independent calculations verify every new numerical answer. Tests check prerequisites, module assignment, the one-example equation format, safe scope rendering and atomic rejection of invalid completion metadata.
- SHA-256 fingerprints from release 0.13.0 preserve the first 26 analytical lessons and all seven other advanced starters. Existing tests preserve the 818 earlier lessons.
- All 37 new Understand and 37 Explore screens were opened in Chrome at 320 pixels. Understand showed one example and a labeled equation. None of these 74 screens overflowed the document or lost main focus on navigation.
- All 37 new Understand screens also fit a 250-pixel viewport (235-pixel document after the scrollbar).
- Wrong/correct concept feedback and numerical answers submitted with Enter were exercised for all 37 new lessons; all returned the expected results.
- Previous/Next works in both directions across all five new module boundaries. The final lesson returns to the Physics map. Its exact Apply step, writing and numerical draft survived reload with saving enabled.
- Course coverage shows ten modules and all 63 lesson links. Preparation and map labels reflect the completed defined course, while the fluids starter still shows its unfinished status. The narrow preparation-to-coverage link works. No app warnings or errors appeared in the inspected console log. Temporary viewport overrides were reset.

Hosted publication, source commit, asset comparison and the final browser smoke check are recorded separately in the release evidence supplied with this update. The separate GitHub mirror is outside this update.

## Scope and remaining work

These modules teach selected ideal models and short calculations. They do not replace a university course, extended derivations or sustained problem-solving practice. Nonholonomic constraints, detailed rigid-top motion, general orbit quadratures, action-angle variables, perturbation theory and advanced Hamilton–Jacobi boundary problems remain further study. The chaos module explains diagnostic limits; it does not supply a numerical chaos simulator or claim that a brief growth in separation proves chaos.

The simple wording was reviewed editorially; no representative learner or retention study was performed. Spoken screen-reader output, Safari, Firefox, physical-phone interaction and OS text-size combinations remain unverified. Native 200%/400% Chrome zoom was checked in an earlier release, not repeated for this content expansion. This is not a full WCAG conformance audit. Other advanced courses retain their starter modules for separate work.

## Reference basis

Lessons and examples are independently authored. Standard relationships and scope were checked against Cambridge's [Lagrangian formalism](https://www.damtp.cam.ac.uk/user/tong/dynamics/dynhtml/S2.html), [Hamiltonian formalism](https://www.damtp.cam.ac.uk/user/tong/dynamics/dynhtml/S4.html), [rigid-body dynamics](https://www.damtp.cam.ac.uk/user/tong/dynamics/dynhtml/S3.html), and [central-force motion](https://www.damtp.cam.ac.uk/user/tong/relativity/four.pdf), plus MIT Press's [phase-space structure](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/9579/sicm_edition_2.zip/chapter004.html). No source-specific prose, figures or problem sets are reproduced.
