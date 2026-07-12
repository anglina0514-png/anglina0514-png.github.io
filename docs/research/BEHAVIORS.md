# Alche to NING Behavior Study

## Reference sweep

- Reference: `https://alche.studio/`
- Desktop sample: 1440 x 900, document height about 22,780 px.
- Mobile sample: 390 x 844, document height about 18,060 px.
- Smooth scroll: Lenis is active (`html.lenis`).
- The page uses one sticky/fixed 900 px stage. Long flow sections feed progress into fixed WebGL and HTML layers.

## Global behavior

- Header is fixed and transparent. Desktop height is about 120.5 px; mobile height is about 85 px.
- Desktop navigation and technical panels sit at the edges. Mobile hides the full nav, right controls and section rail, leaving a logo and menu button.
- WebGL canvas always fills the viewport. The curved grid and brand mark remain spatial anchors while HTML content changes.
- Transitions are continuous scroll interpolation: camera, material, background light, opacity and 2D content move together.
- No section should use a color-jitter or full-screen glitch transition.

## State sequence

1. Hero: solid glass mark, oversized wordmark, dark curved grid, small news and technical UI at the edges.
2. Works: centered media card with neighboring cards in perspective; each work supplies the stage accent colors.
3. Profile: dark stage flattens toward a brighter line-art state; brand geometry becomes outline/background support.
4. Capabilities: typography becomes the primary motion, with compact repeated technical labels.
5. Products: media stays crisp and readable; the 3D mark retreats behind the product content.
6. Contact: visual system contracts into a sparse, dark closing frame.

## NING adaptation rules

- Keep the existing glass N, eight cases, product links and UE modal media.
- Use a single derived stage state for CSS, Three.js, nav, HUD and the Works carousel.
- Keep the HUD hero-only using an explicit first-screen threshold.
- Keep work cards opaque enough to inspect the real image/video.
- React Bits text effects are accents, not a page-wide default.
- Mobile uses one dominant object per viewport and removes desktop-only instrumentation.

## Interaction models

- Hero: scroll + pointer driven.
- Works: scroll driven, click/keyboard opens current case.
- Resume: scroll driven reveal, otherwise static.
- Skills: time driven marquee with scroll velocity bias.
- Products: scroll driven stage, click opens link or case modal.
- Modal: click/keyboard driven; Escape and backdrop close it.

