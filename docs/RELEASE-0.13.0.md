# PhysicsQuest 0.13.0 — analytical mechanics expansion

Analytical mechanics now has 26 lessons in five modules. Twenty new lessons extend the six existing starters. Each new Understand screen presents one idea, a short explanation, one worked example and a clearly labeled equation code block. Definitions and deeper reasoning remain optional. Check and Apply present a changed case separately.

| Module | Lessons | Focus |
| --- | ---: | --- |
| Coordinates and action | 6 | Existing starter sequence, preserved |
| Build a pendulum model | 5 | Speed, kinetic energy, potential energy, partial derivatives and angular acceleration |
| Find quantities that stay constant | 5 | Generalized momentum, cyclic coordinates, conserved energy, angular momentum and effective potential |
| Use position and momentum together | 5 | Phase space, Hamiltonian, both Hamilton equations and a Poisson bracket |
| Study small motion near rest | 5 | Equilibrium, stability, small oscillations and two symmetric normal modes |

Course coverage now groups every lesson under its own module. The course map and preparation page show the actual available lesson/module counts. A wrapped preparation-to-coverage link now has one continuous clickable area instead of gaps between text lines. The stylesheet URL is versioned so returning browsers receive that fix.

The app has 872 lessons across 23 courses and 632 numerical practice parts. All 852 previous lessons, including the first six analytical lessons and the seven other advanced starters, are preserved. There remain 41 interactive model types: these new lessons use explicitly identified static summaries in Explore.

## Verification

- All 200 Node tests pass, including independent calculations for all 20 new numerical exercises, prerequisite order, module assignment validation, grouped course coverage, navigation boundaries and saved-state compatibility. JavaScript syntax checks pass.
- Previous advanced content is compared against immutable SHA-256 fingerprints taken from release 0.12.0. The original 818 earlier lessons are also checked for preservation.
- All 20 new Understand and 20 Explore screens were opened in Chrome at 320 pixels. Understand screens showed one example and a labeled code equation; none of the 40 screens overflowed the document or lost main focus on navigation.
- All 20 new Understand screens were also checked at a 250-pixel viewport (235-pixel document after the scrollbar), with no document overflow.
- Wrong/correct choice feedback and numerical answers submitted with Enter were exercised for every new lesson. All 20 returned the expected feedback.
- Previous/Next works in both directions across all four module boundaries. The final lesson returns to the Physics course map. A new lesson's exact Apply step, writing and numerical draft survived reload with browser saving enabled.
- Preparation and course coverage fit the narrow viewport. All five modules and all 26 lesson links appear. The repaired coverage link works by click at both 320 and 250 pixels; keyboard Enter also works. No app warnings/errors appeared in the inspected console log. Temporary viewport overrides were reset.

## Scope and remaining work

This is a substantial expansion, not a claim that analytical mechanics is complete. Later modules still need time-dependent constraints and multipliers, orbital stability, rigid-body dynamics, nonlinear motion, canonical transformations and Hamilton–Jacobi theory. Other advanced courses retain their previous starter modules for a later, separate pass.

The simple wording was reviewed editorially; there was no representative learner or retention study. Spoken screen-reader output, Safari, Firefox, physical-phone interaction and OS text-size combinations remain unverified. Native 200%/400% Chrome zoom was exercised in the previous release, not repeated for this content expansion. This is not a full WCAG conformance audit.

Public Sites access and existing learner-data behavior are preserved. No dependencies, analytics, backend, or transmission of learner work were added. The separate GitHub mirror is outside this update. Publication is recorded separately using the native deployment result, hosted asset comparison and hosted browser smoke check.

## Reference basis

Lessons and examples are independently authored. Standard relationships and scope were checked against primary teaching sources: Cambridge's [Lagrangian formalism](https://www.damtp.cam.ac.uk/user/tong/dynamics/dynhtml/S2.html) and [Hamiltonian formalism](https://www.damtp.cam.ac.uk/user/tong/dynamics/dynhtml/S4.html), Durham's [Mathematical Physics II lectures](https://www.maths.dur.ac.uk/users/inaki.garcia-etxebarria/MPII/Lectures.html), and MIT's [Classical Mechanics III lecture scope](https://ocw.mit.edu/courses/8-09-classical-mechanics-iii-fall-2014/pages/lecture-notes/). No source-specific prose, figures or problem sets are reproduced.
