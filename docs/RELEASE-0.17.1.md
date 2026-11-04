# PhysicsQuest 0.17.1 — pictures beside explanations

Lessons with an example picture now use the available space on wide screens. The explanation, equation key and worked steps stay on the left, and a clearly labeled picture of that same example appears on the right.

- All 208 authored example pictures use the shared layout. No lesson text, equations, examples, learner storage or course order changed.
- At widths of 1200 CSS pixels and above, both columns have room for readable text and a picture at least 400 pixels wide inside its card.
- Smaller screens keep the explanation, worked example, picture and optional detail in that reading order. Lessons without pictures retain a comfortable text width.
- Existing Explore models already use a right-hand column on wide screens. Removed the extra top margin and divider for an example picture shown by itself in an Explore card.
- The picture has an accessible region name and repeats the worked example title so the relationship stays clear. Its values table remains keyboard accessible.

Validation: 283 tests passed; syntax checks passed. Chrome browser checks passed on all 208 picture lessons at 1366, 1200 and 320 CSS pixels (624 cases), plus 20 representative checks at the layout boundary, tablet and smaller desktop widths. All 45 existing model/static Explore attachments passed wide-screen alignment and overflow checks. Verified keyboard opening/closing of the values table and the next focus target, and checked a lesson without a picture. Visual inspections covered the coordinate-distance lesson on desktop and phone. No browser page overflow found. Browser coverage is Chrome; screen-reader speech and other browser engines were not exercised.
