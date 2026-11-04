# Release 0.3.1 — mobile contents width

Read-only production browser QA confirmed the0.3.0 desktop course counts/navigation, planned labels, rounded sidebar, radians teaching and glossary toggles. At a390×844 mobile viewport, expanded Contents caused horizontal overflow: document client width375px but sidebar extended from x18 to x393. The old mobile width100% combined with the new18px side margins explained that exact overflow.

This narrow CSS patch uses automatic mobile sidebar width bounded by both18px gutters, permits two-column navigation tracks and long titles to shrink/wrap, and makes module labels span the navigation grid. It does not hide overflow globally or remove any content. The desktop sidebar geometry is unchanged. Extra bottom reading padding (including the device safe-area inset) lets final content/controls scroll above a floating platform toolbar; platform controls are untouched. This is an end-of-document clearance measure, not a claim that a floating toolbar can never overlap text at any intermediate scroll position.

Teaching, lesson IDs, progress data and storage behavior are unchanged. There remain112 available lessons and722 roadmap targets, with planned courses not playable.53 local tests and JavaScript syntax checks pass. The reported mobile fix awaits repeat measurement in the authorized read-only browser task; no local rendered pass is claimed.

Post-publication read-only browser recheck passed at 390×844: document client/scroll widths 375/375 px; sidebar left 18, right 357, width 339 px. Explore and Mark complete scrolled above the unchanged platform toolbar. No progress/data changed. This sampled UI evidence is distinct from native deployment provenance.
