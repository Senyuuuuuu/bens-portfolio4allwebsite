---
name: remotion-seamless-morphing
description: Strict standard for creating seamless, continuous shape-morphing motion graphics in Remotion without hard cuts or crossfades.
metadata:
  tags: remotion, motion-graphics, morphing, animation, physics, transitions
---

# 🧬 Remotion Seamless Morphing Rule & Architecture

When creating any motion graphics video in Remotion, ALWAYS follow continuous shape-morphing motion design principles. Never use hard cuts, crossfades, or basic wipes between scenes.

## Core Directives

1. **Continuous State Interpolation**:
   - The exit bounding box (`width`, `height`, `x`, `y`, `borderRadius`, `color`) of element(s) in Scene N must mathematically match the entry bounding box of element(s) in Scene N+1.
   - The viewer's eye must follow a single, continuously evolving visual object.

2. **No Lazy Opacity Fades**:
   - Do not rely on simple opacity crossfades to hide transitions between scenes.
   - Use Remotion's `interpolate()` and `spring()` physics to physically shrink, expand, shatter, or collapse elements.

3. **Physics Parameters**:
   - Primary morph spring: `spring({ fps: 60, config: { stiffness: 120, damping: 14, mass: 1.0 } })`.
   - Use custom cubic bezier curves `Easing.bezier(0.16, 1, 0.3, 1)` for high-speed camera momentum and focus pulls.

4. **Color & Shader Gradients**:
   - Interpolate RGB color components (`rgb(r, g, b)`) or SVG gradient positions when transitioning between emotional states (e.g. warning red `#ef4444` -> neon cyan/indigo `#38bdf8` -> dark space gray `#08080a`).

5. **3D Depth & Parallax**:
   - Maintain `transformStyle: "preserve-3d"` and `perspective: "1200px"` across morphing containers.
