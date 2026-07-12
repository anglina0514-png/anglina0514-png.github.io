# NING Page Topology

## Page-level layers

1. Fixed WebGL stage: splash cursor, Three.js glass N, curved grid and restrained ambient light.
2. Fixed global chrome: brand, navigation, utility links and active section rail.
3. Flow spacers: sections provide scroll distance and local progress.
4. Fixed/sticky scene content: one active chapter at a time.
5. Modal layer: always above stage and global chrome.

## Proposed order

1. `#hero` - NING identity, 110-130vh desktop and 100-115vh mobile.
2. `#works` - eight selected works, one continuous scroll chapter.
3. `#news` - resume/profile evidence.
4. `#about` - full-screen capability ticker plus compact proof matrix.
5. `#products` - three usable products/visual systems.
6. `#final` - contact and copyright.

## Shared stage state

```js
{
  section: "hero" | "works" | "news" | "about" | "products" | "final",
  sectionIndex: 0,
  localProgress: 0,
  pageProgress: 0,
  worksProgress: 0
}
```

The state is derived once from scroll position, then rendered to CSS variables, `data-active-section`, Three.js, HUD and carousel. No subsystem calculates an independent active chapter.

## Layer contract

- Main media card: highest chapter content priority.
- Chapter heading: inside the same safe frame as its chapter media.
- Glass N: foreground only on Hero; background/midground in later chapters.
- Grid and depth words: background only.
- HUD: visible only while `scrollY < 0.62 * viewportHeight`.
- Modal: pointer-enabled and above every fixed stage layer.

## Responsive contract

- Desktop 1440: full nav, optional section rail, edge HUD on Hero, 3D neighboring work cards.
- Tablet 768: compact nav, no section rail, reduced HUD, shallower card perspective.
- Mobile 390: logo + menu/compact nav, no HUD/rail, one dominant work card, readable chapter labels in safe areas.

