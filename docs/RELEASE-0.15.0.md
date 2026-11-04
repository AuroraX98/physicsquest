# PhysicsQuest 0.15.0 — fluid dynamics expansion

Fluid dynamics now has 38 lessons in six modules. This release preserves its four starter lessons and adds the five remaining planned modules in order. Each new module passed its content, calculation and browser checks before work moved to the next.

| Module | Lessons | Focus |
| --- | ---: | --- |
| Describing a flowing fluid | 4 | Existing velocity field, volume flow, mass flow and shear lessons, preserved |
| Follow a moving piece of fluid | 6 | Parcel paths, local change, advection, the material derivative, streamlines and vorticity |
| Keep track of fluid mass | 5 | Storage, outward flux, local continuity, parcel density and incompressibility |
| Describe flow near walls and through pipes | 7 | No slip, shear gradients, kinematic viscosity, diffusion time, Couette and Poiseuille flow |
| Use forces to predict fluid motion | 7 | Pressure forces, Euler balance, hydrostatics, Bernoulli, viscous curvature, Navier–Stokes and momentum transport |
| Compare flow scales, wall effects and turbulence | 9 | Reynolds and Mach numbers, scale models, boundary layers, reversal, drag, fluctuations, rms and Reynolds shear stress |

Every new Understand screen shows one idea, a short explanation, one two- or three-step example and a labeled equation in a code block. Words and symbols are optional. Each optional deeper note adds reasoning instead of repeating the opening explanation. Check and Apply offer a separate changed case. Explore explicitly describes its static visual summary; it is not a new live flow simulation.

The map, preparation page and course coverage use the existing completed-course support to show the defined fluid course as available. Its scope note and further-study list state the limits. Analytical mechanics and every other course are preserved. The app now has 943 lessons, 703 numerical practice parts and 41 interactive model types across 23 courses.

## Verification

- All 218 Node tests pass, with zero failures or skips. JavaScript syntax checks pass.
- Independent calculations check all 34 new numerical answers. Tests check earlier prerequisites, stable IDs, module order, focused lesson formatting, useful deeper notes and essential model conditions.
- Immutable SHA-256 fingerprints from release 0.14.0 preserve the four original fluid lessons and every other advanced course, including all 63 analytical lessons. Existing tests also preserve the 818 earlier lessons.
- All 34 new Understand screens and 34 Explore screens were checked in Chrome at a 320-pixel viewport. Every Understand screen had one example and a labeled code equation; none lost main focus or caused document overflow.
- Wrong and correct concept feedback, plus numerical answers submitted with Enter, were exercised for every new lesson. All 34 returned the expected results.
- All 34 new Understand screens and their expanded deeper notes also fit a 250-pixel viewport, with no document overflow. Expanded notes displayed the intended additional reasoning.
- Previous/Next works in both directions across all five new module boundaries. The final lesson returns to the Physics map. Its Apply route, writing and numerical draft survived reload with browser saving enabled.
- The narrow preparation-to-coverage link works by click. Coverage shows six modules and all 38 distinct lesson links. The narrow course map has no document overflow. No warnings or errors appeared in the inspected local app console log. Temporary viewport overrides were reset.

Hosted publication, exact source commit, asset comparison and the hosted browser smoke check are recorded separately with the release evidence. Existing public Sites access is preserved. There are no new dependencies, analytics, accounts, backend services or transmission of learner work. The separate GitHub mirror is outside this update.

## Scope and verification limits

This is a focused first course in selected fluid models and short calculations. It is not a university qualification or a claim to cover every fluid topic. Potential flow, circulation and lift, surface waves and tension, rotating and stratified flows, instability theory, shocks, heat transfer, non-Newtonian fluids and numerical flow simulation need further study. Turbulence lessons introduce scales, fluctuations and averaged momentum transport; they do not provide a turbulence solver.

The wording was reviewed editorially, without a representative learner or retention study. Spoken screen-reader output, Safari, Firefox and physical-phone interaction remain unverified. Native 200%/400% Chrome zoom was exercised in an earlier release, not repeated for this content expansion. This is not a full WCAG conformance audit. The other six advanced subjects retain their starter modules for later work.

## Reference basis

Teaching text and examples are independently authored. Scope and standard relationships were checked using primary teaching and technical sources: [Cambridge fluid mechanics](https://www.damtp.cam.ac.uk/user/tong/fluids/fluids1.pdf), [OpenStax viscosity and Poiseuille flow](https://openstax.org/books/college-physics/pages/12-4-viscosity-and-laminar-flow-poiseuilles-law), [MIT boundary-layer equations and scaling](https://web.mit.edu/fluids-modules/www/highspeed_flows/ver2/bl_Chap2/node2.html), and [Idaho National Laboratory Reynolds averaging](https://malamute.inl.gov/modules/navier_stokes/rans_theory.html). Some Cambridge direct PDF retrievals failed; official indexed material and accessible primary sources supplied the reference checks. No source prose, figures, worked examples or problem sets are reproduced.
