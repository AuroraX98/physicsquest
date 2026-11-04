# PhysicsQuest 0.12.0 — browser checks and advanced starters

The preparation flow now has one progress count, the current preparation lesson is highlighted in Contents, and long headings, status labels and course cards fit narrow reading widths. The first modules of all eight advanced subjects are now available, with one idea, one example and a labeled equation code block per lesson.

## Available additions

| Course | Starter lessons | First module |
| --- | ---: | --- |
| Advanced analytical mechanics | 6 | Coordinates, constraints, Lagrangian, action, stationarity and a spring equation |
| Fluid dynamics | 4 | Velocity fields, volume flow, mass flow and viscous shear |
| Plasma physics | 4 | Charge balance, shielding scale, plasma oscillation and gyrofrequency |
| General relativity | 4 | Metric distance, clock time, local free fall and tidal differences |
| Advanced experimental methods | 4 | Offset correction, mean, uncertainty of the mean and independent uncertainty combination |
| Quantum information | 4 | Qubit amplitudes, X, Z and Hadamard operations |
| Advanced many-body physics | 4 | Occupation lists, fermion exclusion, boson creation and on-site pair energy |
| Quantum field theory | 4 | Field values, modes, quantized mode energy and energy above the vacuum |

There are 852 available lessons across 23 courses and 612 numerical practice parts. The 15 prior courses contain 818 lessons; all are preserved. The eight new courses are explicitly starter modules, not finished advanced courses. Later topics remain in the course coverage plans. There are still 41 interactive model types; the new starters use clearly identified static summaries in Explore.

The new course loader, metadata and teaching content are separate from the original catalog and course files. Preparation links open the actual new lessons, and the quantum subjects appear on the Quantum Physics track. Existing progress IDs, browser storage key and version-1 backups are preserved. No new dependencies, analytics, backend or learner-data transmission were added.

## Verification

- JavaScript syntax checks and 195 Node tests pass. Tests independently calculate all 34 new numerical answers, resolve prerequisites, preserve existing course data, check old/new progress merging, and verify honest available-versus-planned labels.
- All 23 preparation overviews were opened in Chrome at a 320 CSS-pixel viewport. Thermodynamics had a small heading overflow, now fixed. Preparation Previous/Next, Back, reload, saved notes, numeric drafts and separate preparation/normal-course resume locations were exercised.
- Native Chrome zoom was exercised at 200% and 400%. At 400%, the lesson steps, feedback, numeric input and review controls worked at a 234 CSS-pixel reading viewport without document overflow. Zoom was restored to 100%.
- All 34 new Understand screens were opened at a 320-pixel viewport, with one example, a labeled code equation, closed optional detail, main focus and no document overflow.
- All 34 new Explore screens and all eight coverage pages were checked at a 250-pixel viewport (235-pixel document after the scrollbar). The long status pill and course-map grid overflow found during this work were fixed; both maps were rechecked at this width.
- For each new course, wrong/correct choice feedback, a numerical answer submitted with Enter, and the final course-map action were exercised. All returned the expected feedback and track. Preparation-to-course links were checked for all eight subjects.
- An advanced review entry revealed one example and the equation, accepted a three-day date and survived reload. Prior preparation notes and numeric drafts still appeared after the new modules loaded.
- Keyboard checks covered the skip link, visible focus, mobile Contents open/close, Escape focus return and normal controls. Chrome's native accessibility tree exposed landmarks, headings, labels, equation/example regions and status messages. No app warning/error appeared in the inspected console log.

## Remaining evidence limits

Narrator launched, but its UI could not be reliably inspected; spoken reading order and equation pronunciation remain unverified. Narrator was closed afterward. Physical phone keyboard/hand reach, Safari, Firefox and OS-level text-size combinations were not tested. The browser work is not a full WCAG conformance audit.

There was no representative learner session, reading-age measurement or learning-retention study. The simple wording is an editorial review, not proof that every ten-year-old can independently learn the advanced subjects. Preparation links and optional definitions support the next steps; the advanced courses remain unfinished by design.

The public Sites audience is preserved. The separate GitHub mirror is outside this update. Browser checks used the local release candidate; publication is verified separately by the Sites deployment result and a hosted smoke check.

## Reference basis

Accessibility checks use W3C's [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) and [visible focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) guidance.

New lessons and numerical examples are independently authored. Primary relationship references include [Cambridge classical dynamics](https://www.damtp.cam.ac.uk/user/tong/dynamics/dynhtml/S2.html), [OpenStax fluids](https://openstax.org/books/university-physics-volume-1/pages/14-key-equations), [MIT plasma notes](https://ocw.mit.edu/courses/16-55-ionized-gases-fall-2014/pages/lecture-notes/), [Cambridge spacetime measurements](https://www.damtp.cam.ac.uk/user/tong/gr/grhtml/S1.html), [NIST uncertainty](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-5-combined-standard-uncertainty), [IBM single-qubit operations](https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems), and [Cambridge free fields](https://www.damtp.cam.ac.uk/user/tong/qft/qfthtml/S2.html). Reference courses are not replaced by these starter modules.
