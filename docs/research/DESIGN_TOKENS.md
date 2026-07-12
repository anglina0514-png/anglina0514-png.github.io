# NING Stage Design Tokens

## Typography

- Display/Chinese: system CJK sans, weight 600-700.
- Technical labels: `IBM Plex Mono`, `Google Sans Code`, monospace fallback.
- Body: system CJK sans, weight 400.
- Use zero letter-spacing for display copy; technical labels may use 0.04em.

## Palette

- Stage black: `#050608`.
- Deep blue: `#081529`.
- Foreground white: `#f5f7fb`.
- Muted white: `rgba(245,247,251,.58)`.
- Grid: `rgba(157,190,218,.16)`.
- Glass ice: `#bceeff`.
- AI cyan: `#58d8ff`.
- Content blue: `#6e86ff`.
- UE violet: `#9b72ff`.
- Product green: `#55d6a7`.
- Research silver: `#c6ced9`.

## Geometry

- Global desktop gutter: `clamp(28px, 4vw, 72px)`.
- Header height: 88-112 px desktop, 72-84 px mobile.
- Card radius: 0-6 px; no decorative pill cards.
- Product/card borders: 1 px translucent white.
- Main media width: 58-66vw desktop; 88-92vw mobile.

## Motion

- Primary easing: `cubic-bezier(.16,1,.3,1)`.
- Chapter interpolation: continuous, driven by scroll progress.
- Hover duration: 220-320 ms.
- No chromatic shake, hard glitch or full-screen flash.
- Reduced motion: disable pointer fluid, heavy parallax and continuous marquee acceleration.

