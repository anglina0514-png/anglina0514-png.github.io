# Works Specification

## Overview
- Target: `#works`, `.works-sticky`, `.work-track` and eight `.work-card` items.
- Interaction model: scroll driven; click/Enter/Space opens case.

## Structure
- `作品 / 作品介绍` belongs to the same stage as the main card.
- Center card is fully readable, with previous/next cards at the viewport edges.
- Glass N stays behind the cards as a spatial anchor.
- Counter, title and open hint use the technical type system.

## States
- Progress maps continuously across eight case IDs: dragon, qwen, haoshi, quanyun, marxism, ue5, zhitou, loan.
- Focus changes stage accent colors using each card's `data-accent` values.
- Work media remains visible from the first 10% of the chapter.

## Responsive
- Desktop: center card 58-64vw, shallow curved perspective.
- Mobile: center card 88-92vw, neighbors appear only as narrow edge previews.

