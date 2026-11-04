# PhysicsQuest 0.9.0 — completed planned introductory paths

## Scope

The seven planned fields add 352 original micro-lessons: Thermodynamics 56, Optics 48, Relativity 40, Atomic/Nuclear 56, Particles 40, Materials 56 and Astrophysics 56. The app now has 794 lessons across 15 courses. Thermodynamics preserves the original 48 objectives and adds 8 explicitly approved prerequisite/domain bridges. This is the complete bounded plan, not every physics research topic or a university qualification. Advanced specializations remain identified as further study.

The 442 existing lessons are preserved byte-for-byte from verified source commit 75921f73ab28411a8f1810cdff57998fd7acb944. Physics and Quantum Physics tabs, lesson identifiers, optional browser-local saving and JSON progress import/export remain intact.

## Teaching and review

All new lessons have original plain explanations, contextual equation meanings/symbols/units, worked examples, changed-case checks with question-specific feedback, transfer prompts, explicit model limits, prerequisite links and glossaries. Authors and separate reviewers checked scientific content and all numeric practice answers. Initial defective generic feedback and content gaps were rejected and repaired before release. See `review/content-batches.md` and `CURRICULUM-2.4.md` for the finite map and review evidence.

Seven bounded interactive model types bring the total to 41. New original static band/occupancy and H–R diagrams are explicitly qualitative/static where appropriate and are not counted as interactive models. Static Explore instructions no longer promise nonexistent controls. Units, singular limits and fixed-vs-live summaries are visible.

## Validation

Syntax checks pass. All 157 Node tests pass with zero failures and zero skips. The final curriculum contains 554 numerical practice parts; every added numerical answer was independently recomputed. Tests preserve the original 442 lesson-file hashes and old/new progress semantics.

Final independent desktop preview sampling passed across all seven new courses: Understand/Explore/Check/Apply, question-specific feedback, numeric answers, glossary, all seven new live models and two static diagrams. Maps showed 568 Physics plus 226 Quantum lessons. Boundary samples included zero-time decay, zero-efficiency yield, Fermi occupation, inverse-square flux, clock equality at rest and the lens focal limit. This is representative browser QA, not exhaustive certification of all 794 lessons or a phone-viewport test. The final band-gap equation uses compact, consistently defined symbols Ec,min and Ev,max; its desktop screenshot confirmed an unbroken equation without overflow.

Browser QA is sampled rather than a visit to every lesson. No actual phone-width viewport validation is claimed in this release; earlier constrained-card render checks are labelled as such. Model tests include invalid/nonfinite inputs, unit conversions, sign conventions, endpoint combinations and limiting cases.

## Privacy and provenance

The existing owner-private Sites audience is preserved. No GitHub publication, public license grant, analytics, account-based progress sync, new runtime dependency or third-party visual asset was added. Standard factual/scope references are linked separately; protected course prose, problem sets and figures were not imported. Existing notices are retained.
