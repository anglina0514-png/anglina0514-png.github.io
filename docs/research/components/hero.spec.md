# Hero Specification

## Overview
- Target: `#hero`, WebGL stage, global header and hero-only HUD.
- Interaction model: scroll + pointer driven.

## Structure
- Fixed glass N centered in a curved grid.
- Small NING brand in top-left; nav centered; resume/contact on right.
- Copy contains only `沉浸式视觉作品集` and accessible `NING`.
- HUD remains at the outer edges and disappears before the second chapter.

## States
- Start: glass N is frontal, bright and solid; grid is dark blue-black.
- Exit: N rotates slightly, moves backward and reduces opacity while Works media enters.
- Transition uses camera/material interpolation only.

## Responsive
- Desktop: full HUD and nav.
- Mobile: no HUD/rail; glass N fills the central 62-72% of viewport width.

