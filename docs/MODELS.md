# Model contract and tests

The models use exact analytic expressions, not a numerical time integrator. Tests compare independent analytic special cases, reduction identities, a finite-difference derivative, projectile energy invariance, and plotted-domain bounds.

Units: lengths m (unless ruler example explicitly cm/mm); time s; velocity m/s; acceleration m/s²; mass kg; force N. Plots label axes. Signed displacement is distinguished from nonnegative distance. All controls are native keyboard-operable range inputs with visible labels, output values, units and aria-valuetext. SVGs have descriptive role/labels generated from the current state.

- Constant velocity: fixed inertial 1D frame; x = x0 + vt.
- Constant acceleration: a fixed over the interval; x = x0 + v0t + at²/2; v = v0 + at. Initial x0 = 0 in the acceleration graph.
- Projectile: vx/vy controls (no undeclared trigonometry), g = 9.81 m/s², no drag/lift, same launch/landing height, flat local ground. Equal-time dots are explanatory samples, not measurements. Exact ballistic endpoints and mechanical-energy conservation tested.
- Force: constant mass > 0, net horizontal force right minus left, inertial frame, vertical forces balance. Force is not velocity.
- Uncertainty: estimate ± stated uncertainty only. No distribution/confidence level or guaranteed bound asserted.

The UI has no automatic animation and respects reduced-motion preference. Mathematical diagrams are models, not literal quantum particle trajectories. Full accessibility conformance and all physical contexts are not claimed.

- Radian circle (0.2.2): positive radius in centimetres, nonnegative turn size in radians, arc = radius × angle; centimetres match across both lengths. The SVG is an original schematic, not a physically sized ruler. The control endpoint 6.28 is approximate; full-turn analytic tests use exactly 2π. Arc is curved rim distance about a fixed centre, not chord distance or rolling distance across the ground.

## Quantum II additions (0.7.0)

- Pure spin-one-half preparation/analyzer comparison: complex spinor overlap equals (1+r·n)/2. Degree controls convert to radians; chart is probability, not a literal orientation/path.
- Constant two-level H=(Δ/2)σz+gσx: Δ and g are energies; reference state starts at |0⟩. Exact matrix exponential, spectral probabilities and energy expectation; scaled τ=gt/ℏ. No RWA or decay. This model is attached to the energy-parameterized capstone, not the earlier angular-rate detuning lesson.
- Real-plane density disk: r≤1 guarantees nonnegative eigenvalues; equal mathematical x/z scales, ry=0. Purity and measurement probability do not uniquely identify how a mixture was prepared.
- Pure distinguishable pair cosθ|00⟩+exp(iφ)sinθ|11⟩: phase-sensitive x correlations and phase-independent local reductions. Controls select a preparation, not a remote measurement result.

Five new runtime tests plus independent complex-matrix/limit and renderer-domain checks supplement, not replace, pending rendered interaction QA.

## Quantum III additions (0.8.0)

- Weak two-level energy: stable exact root of [[0,g],[g,Δ]], compared with −g²/Δ. Energy-ratio axes; relative shift error is explicitly undefined when the shift is zero. Large ratios intentionally expose approximation failure rather than being labelled accurate.
- Quartic Gaussian trial family: V=Eₛ(x/a)⁴, Eₛ=ℏ²/(ma²), β=b/a. Kinetic ratio 1/(4β²), potential ratio 3β⁴/4 and a family minimum at 6^(−1/6). The optimized energy is an upper bound, not an exact quartic eigenvalue.
- Central elastic distinguishable s+p scattering: complex amplitude addition before magnitude square, full-sphere angular area and forward optical-theorem equality. k in nm⁻¹ gives f in nm and areas in nm². Real phase sliders are stipulated parameter data, not automatic energy changes of one fixed potential. The plot is not the identical-pair event formula.

Numerical evidence includes eigenvalue residuals, variational moment quadratures and derivative refinement, angular integration/current identities, zero cases and invalid-input checks. Actual browser samples remain pending.

## 0.9.0 field models

Seven original bounded analytic types extend the retained 34 types to 41. All controls have finite validated ranges. The curves are teaching models, not experimental or safety design tools.

| Type | Prediction | Key limits |
|---|---|---|
| `gas-isotherm` | nRT/V, with litres→kPa conversion | Dilute equilibrium ideal gas; positive amount, temperature and volume. Axis rescaling is disclosed. |
| `thin-lens-image` | Signed thin-lens image distance and transverse magnification | Converging 10 cm paraxial lens, positive real-object distance. Exact focal position has no finite image. Off-canvas images are reported numerically. |
| `moving-clock` | Lorentz factor and lab interval for the same moving-clock ticks | Inertial motion below light speed, positive proper interval; equality at rest. Not arbitrary separated events. |
| `decay-expectation` | Expected survivors after elapsed half-lives | Independent identical unstable nuclei, fixed half-life. Expected count may be fractional; observed counts fluctuate. |
| `signal-yield` | Exposure×cross section×branching×selection | Compatible inverse-femtobarn/femtobarn inputs, factors 0…1; mean signal only, no background/significance claim. |
| `fermi-occupation` | Stable Fermi–Dirac mean occupation of one specified state | Positive kelvin temperature and signed energy-minus-chemical-potential in eV; not total band carrier density. |
| `relative-starlight` | Relative luminosity divided by squared relative distance | Positive distance, isotropic nearby source, transparent Euclidean space; no extinction, lensing or cosmological distance substitution. |

`band-occupancy-diagram` is an original static signed-energy diagram with a 2 eV gap. `hr-diagram-summary` is an original qualitative temperature/luminosity family map with the traditional reversed temperature direction. Neither has controls nor increases the interactive-type count. Both include descriptive alternative text and explicit interpretation limits.

The pure calculations, all slider endpoint combinations, sign/domain cases and zero/limit cases have automated tests in `tests/field-models.test.mjs`. Actual preview observations and their limits are recorded in `review/field-models.md` and the release note.
