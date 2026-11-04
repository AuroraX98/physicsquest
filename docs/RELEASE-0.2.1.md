# Release0.2.1 — sidebar surface and bottom spacing

User screenshots inspected: the original full-height blended sidebar ended above a blank lower area, making the panel boundary unclear. The stale sidebar viewport limit continued subtracting the page header after that header had scrolled away.

Changes: sidebar is now a separate rounded card using the same cream surface, border, radius and lower-edge shadow as the Interactive model card. It has an18px outer gutter and a visible bottom boundary. Its maximum height is recalculated from its actual viewport top as the page scrolls, preserving an18px lower gutter rather than reserving a stale header-sized gap. Main reading content aligns to the top without vertical auto-margin centering. Mobile contents stays an in-flow rounded panel; Early edition is retained.

Verification:38 local tests and all JS syntax checks pass, including viewport-height calculation cases and retention of the edition label. No teaching, equations or model calculations changed. The two subject tracks and all60 available lessons remain. Actual desktop/mobile rendering remains unverified because supported static preview timed out; another project currently owns managed preview. No alternate preview was used.
