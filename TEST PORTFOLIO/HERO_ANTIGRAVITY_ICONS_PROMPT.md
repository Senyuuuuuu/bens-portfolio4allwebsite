# Production Prompt Spec: Interactive Matter.js Zero-Gravity Hero Section & Editorial Showcase

## 🎯 Role & Objective
You are **Stitch / JARVIS**, an elite creative front-end developer and creative motion designer. Your task is to build and maintain a state-of-the-art, interactive **Zero-Gravity Hero Section** and **Fluid Featured Projects Showcase** for Benyamin Namtalashvili's multidisciplinary portfolio.

The aesthetic combines the minimalist, high-contrast typography of editorial design with playful, tactile, 60fps gesture-driven **Matter.js 2D rigid body physics**.

---

## 🏛️ Phase 1: Layout & Visual Architecture

### 1. Canvas & Atmosphere
- **Canvas Base**: Warm minimalist off-white / light cream (`#FCFBF8` to `#F5F5F7`) with a subtle radial gradient focal point (`radial-gradient(circle at 50% 35%, rgba(242, 235, 227, 0.65) 0%, rgba(252, 251, 248, 0) 70%)`).
- **Typography Tone**: Soft charcoal / deep obsidian (`#111111`) for maximum contrast and readability.
- **Section Structure**: Full-viewport centered hero (`min-height: 100vh`, `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`).

### 2. Social Proof & Overline Pill
- **Placement**: Centered above the main headline.
- **Content**: `★★★★★ 5/5 Rated by 30+ Venture CEOs & Brands`.
- **Styling**: Rounded pill (`padding: 0.5rem 1.25rem`, `border-radius: 9999px`, `background: #F2EBE3`, `border: 1px solid rgba(17, 17, 17, 0.08)`), amber stars (`#F59E0B`), font size `0.84rem`.

### 3. Display Typography (Maintained Copy)
- **Primary H1**:
  ```html
  <h1 class="hero-title">
    Architecting <span class="serif-italic">visual branding, web platforms</span> &amp; AI workflows.
  </h1>
  ```
  - **Sans-Serif Font**: `Plus Jakarta Sans` / `SF Pro Display`, `font-weight: 800`, `letter-spacing: -0.04em`, `line-height: 1.04`.
  - **Serif Italic Emphasis**: `Instrument Serif`, `font-style: italic`, `font-weight: 400`, `color: #0071E3`.
- **Subheading Lead**:
  ```html
  <p class="hero-lead">
    I engineer high-impact graphic design systems, scalable full-stack web applications, and autonomous n8n automation pipelines that drive revenue, eliminate manual friction, and scale businesses effortlessly.
  </p>
  ```
  - `font-size: clamp(1.05rem, 1.6vw, 1.28rem)`, `max-width: 720px`, `color: #555555`, `line-height: 1.65`.

### 4. Dual Pill Action Buttons
- **Primary Pill**: `#111111` solid black background, `#FFFFFF` text, `Explore Featured Works →` with arrow icon, pill radius `9999px`, elevation shadow.
- **Secondary Pill**: Frosted outline pill `View Full Resume`, `border: 1.5px solid rgba(17, 17, 17, 0.2)`.
- **Tertiary Pill**: `Modeling Portfolio ↗` with subtle blue tint.

---

## 🛸 Phase 2: Matter.js Zero-Gravity Physics Engine

### 1. Zero-Gravity & Boundary Collision Configuration
- **Zero Gravity**: `engine.world.gravity.x = 0; engine.world.gravity.y = 0; engine.world.gravity.scale = 0;`
- **4 Static Collision Walls**: Invisible static boundary bodies enclose the top, bottom, left, and right perimeter of the hero section with `restitution: 0.98` and `friction: 0.001`.
- **Z-Index Layering**:
  - Static UI elements (`.hero-content-container`): `position: relative; z-index: 25; pointer-events: none;`
  - Action buttons (`.btn-pill-primary`, `.btn-pill-outline`): `pointer-events: auto;`
  - Physics Stage & Bodies (`#heroAntigravityStage`, `.antigravity-item`): `position: absolute; z-index: 10; pointer-events: auto;`
  - This allows the physics bodies to float smoothly behind and around text while remaining fully interactive.

### 2. Rigid Body Mapping Tokens
- **Pill Capsules (`.capsule-item`)**:
  - `Bodies.rectangle(x, y, w, h, { chamfer: { radius: h / 2 }, restitution: 0.92, friction: 0.002, frictionAir: 0.008 })`
  - `padding: 0.95rem 2.4rem`, `font-size: 1.18rem`, `font-weight: 800`
- **Software Squircles (`.squircle-item`)**:
  - `Bodies.rectangle(x, y, w, h, { chamfer: { radius: 22 }, restitution: 0.92, friction: 0.002, frictionAir: 0.008 })`
  - `width: 76px; height: 76px; font-size: 1.45rem; font-weight: 800;`

### 3. MouseConstraint Drag & Fling Throwing
- `MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.28, damping: 0.08 } })`
- On drag: Scale up active body to `1.15x`, apply elevated drop shadow, switch cursor to `grabbing`.
- On release: Physics momentum projects the body through the zero-g stage, bouncing off walls and other floating capsules with high elasticity.

---

## 🎬 Phase 3: Pure 4K Cinema Video Showcase (Below Hero)

- **Pure Video Showcase**: All overlay top bars and badge clutter removed.
- **Rounded Corner Geometry**: `border-radius: 28px` with `overflow: hidden` and specular glass rim lighting.
- **Scroll Unfolding Animation**: Preserved GSAP 3D perspective unfold on scroll (`transformPerspective: 1200`, `rotateX: 14` to `0`, `scale: 0.90` to `1.0`).

---

## 🎞️ Phase 4: Featured Projects Infinite Carousel

- **11 Curated Original Works**:
  1. `bacon-burger-poster.jpg` (`764/1024` ~ `3:4`)
  2. `estilo-salon-web.png` (`1024/484` ~ `21:10`)
  3. `downy-freshness-poster.jpg` (`764/1024` ~ `3:4`)
  4. `crystal-white-claw-bag.jpg` (`1024/683` ~ `3:2`)
  5. `ace-galera-web.png` (`1024/509` ~ `2:1`)
  6. `kyani-restore-supplement.jpg` (`764/1024` ~ `3:4`)
  7. `brayne-digital-mug.jpg` (`1024/571` ~ `16:9`)
  8. `amare-peach-hl5.jpg` (`764/1024` ~ `3:4`)
  9. `brayne-services-banner.png` (`1024/768` ~ `4:3`)
  10. `amare-energy-dragonfruit.jpg` (`1024/571` ~ `16:9`)
  11. `amare-basket.jpg` (`827/1024` ~ `4:5`)
- **Apple Fluid Momentum**: 60fps infinite horizontal wrapping with exponential velocity projection and unclickable inert containers preventing accidental navigation.
