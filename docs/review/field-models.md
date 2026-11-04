# Expanded-field models: source and browser review

2026-10-28. Seven original bounded analytic models. Added by integration owner; independently source-reviewed by parent agent. Parent independently ran all nine model tests and found no blocking formula, unit, sign or bounded-domain defect. This is not an exhaustive proof for all floating-point inputs.

## Automated evidence
- Positive ideal-gas amount/temperature/volume; J/L = kPa; inverse-volume scaling.
- Signed thin lens with positive real object and converging focal length; exact focal singularity represented as no finite image, never NaN/Infinity coordinates.
- Moving-clock Lorentz gamma; timelike interval invariant; |beta| < 1.
- Exponential survival expectation; nonnegative time and initial count, positive half-life.
- Event yield with nonnegative luminosity and cross section and branching/selection fractions in [0,1].
- Stable positive-temperature Fermi logistic, midpoint, complements, extreme tails and broadening.
- Relative flux inverse-square dependence; positive distance.
- All 46 minimum/maximum slider combinations and the focal case render finite SVG markup with accessible descriptions.

## Actual supported preview samples
Supported `sites-preview` at its returned localhost URL, dedicated cloud browser tab. Temporary QA harness exercised production mountModel and renderer modules; harness is not a shipped page.
- Gas: 20→40 L at 1 mol/300 K: 124.7→62.36 kPa.
- Lens: 20 cm object yields 20 cm real inverted image; 10 cm yields no finite image; 5 cm yields −10 cm virtual upright image with magnification 2.
- Clock: beta .6→0 with proper time 4 s: laboratory elapsed time 5→4 s.
- Decay: 800 initial, half-life 4 s, time 8→0 s: expected survivors 200→800.
- Yield: initial selected expectation 40; zero selection efficiency yields 0; reset restores 40.
- Fermi: E−mu 0→0.2 eV at 300 K: occupation .5→.0004365.
- Flux: relative distance 1→4 at fixed reference luminosity: relative flux 1→.0625.

Screenshots of gas, lens and event-flow diagrams inspected at a 390 px constrained page/card width (not a phone viewport). SVG label font increased to 14 viewBox units, lens position scale tightened to ±40 cm. Integrated course navigation, attachments and full application flow must be sampled after authoring.

## Integrated preview corrections
Independent three-course lesson-flow QA confirmed gas/lens/clock behavior. The moving-clock SVG alternative description now explicitly includes equality at rest (regression test). Long metric cards now have padding and wrapping room. An original static band/occupancy SVG shows −3…−1eV filled and +1…+3eV empty bands and a 2 eV gap; source and actual preview screenshot/Explore instruction were checked. It has no controls and does not increase the interactive-model count.
