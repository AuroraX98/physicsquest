# Release 0.4.1 — course-aware lesson badge

Read-only live-browser E&M samples passed course/map navigation, signed two-source changes and reset, RC charging/discharging values and sign captions, the zero-charge no-orbit case, and 390 px mobile Contents width (375/375 px document client/scroll widths). The observed remaining presentation defect was the inherited “Motion & Forces” badge on E&M lessons.

The badge now uses the current course title through one shared metadata-based helper, including future paths. It is escaped before HTML insertion. A regression covers all catalog courses and a new future title. No lesson content, source models, progress storage, export format, course count, CSS or platform controls changed. There are still 168 available lessons, 130 numeric practice parts and 20 interactive model types. All 64 Node tests and syntax checks pass. The final label rendering itself awaits a post-deploy glance; prior scientific/interaction review remains applicable.
