# Master Prompt: Ultra-Premium Animation & Interaction Architecture (Apple-Grade Portfolio)

**Target AI / Developer:** Antigravity / Stitch / Creative Front-End Engineer  
**Project:** Benyamin Namtalashvili — Graphic Design, Web Development & AI Automation Portfolio  
**Ecosystem:** GSAP 3, ScrollTrigger, Web Audio API, Apple Glassmorphism & Liquid Specular Materials  

---

```markdown
# Role & Mission
You are an elite creative technologist and front-end motion engineer specializing in award-winning web experiences (Awwwards SOTD / Apple Human Interface Design standards). Your objective is to inject the "TEST PORTFOLIO" with a buttery-smooth, hardware-accelerated animation ecosystem featuring staggered scroll reveals, tactile hover micro-interactions, liquid specular cards, and Web Audio API click synthesis.

---

## 1. Phase 1: Theatrical Preloader & Hero Reveal Sequence

### 1.1 The Geometric Curtain Preloader
- **Initial State**: A solid obsidian (`#0B0B0D`) screen overlay (`z-index: 9999`) displaying a centered geometric SVG monogram rotating continuously with a pulsing ambient status dot.
- **The Lift**: Once assets are ready, the curtain must slide upward (`yPercent: -100`, duration: `0.95s`, ease: `expo.inOut`), seamlessly transitioning pointer-events to `none`.

### 1.2 Staggered Hero Typography & Stage Choreography
- **Hero Title Split-Reveal**: Animate the main headline words (`y: 40px` to `0px`, `opacity: 0` to `1`, duration: `0.85s`, `stagger: 0.08s`, ease: `power4.out`).
- **Titanium Bezel Device Stage Entrance**:
  - The hero stage container scales up from `0.94` with a subtle 3D tilt (`rotateX: 4deg` to `0deg`, duration: `1.0s`, ease: `power3.out`).
  - Floating specification badges bounce in with elastic recoil (`scale: 0.6` to `1.0`, ease: `back.out(1.7)`, `stagger: 0.15s`).

---

## 2. Phase 2: Staggered Scroll-Triggered Section Entrances (GSAP)

### 2.1 Section Reveal Orchestration
- Bind every major section (`#selected-work`, `#lab`, `.manifesto-section`, `.roi-calc-section`, `footer`) to GSAP `ScrollTrigger` with trigger at `top 80%`.
- Inner elements (section tags, headline headers, descriptions) must slide up (`y: 35px` to `0px`, `opacity: 0` to `1`, `duration: 0.75s`, `stagger: 0.12s`, ease: `power3.out`).

### 2.2 Dynamic Image Clip-Path Editorial Masks
- When project thumbnails and team portraits scroll into view, reveal the media using CSS `clip-path` interpolation:
  ```css
  /* Initial */ clip-path: inset(100% 0% 0% 0%);
  /* Revealed */ clip-path: inset(0% 0% 0% 0%);
  ```
  Animate with `duration: 1.1s, ease: 'power3.inOut'`.

### 2.3 Numbers & Telemetry Counters
- Metric numbers (e.g. `100%`, `4K 60FPS`, `99.98%`, `Sub-50ms`) must dynamically count up from zero using GSAP integer interpolation when scrolling into the viewport.

---

## 3. Phase 3: Tactile Hover Micro-Interactions & Physics

### 3.1 Magnetic 3D Buttons & Pills
- Apply magnetic pull physics to all CTA buttons (`.btn-apple-primary`, `.btn-apple-secondary`, `.nav-cta-btn`):
  - On `mousemove`: Pull button center toward cursor (`x * 0.25`, `y * 0.25`, duration: `0.25s`, ease: `power2.out`).
  - On `mouseleave`: Spring back to origin (`x: 0, y: 0`, duration: `0.6s`, ease: `elastic.out(1.2, 0.4)`).
  - On `mousedown` (Active Press): Compress scale to `scale(0.96)` for tactile click feedback.

### 3.2 Dynamic Specular 3D Mouse Parallax (Specular Tilt Cards)
- On hover over interactive cards, calculate normalized mouse coordinates `(x, y)` relative to card center:
  - Apply 3D perspective rotation: `perspective(600px) rotateX(deg) rotateY(deg) scale(1.02)`.
  - Shift sub-surface specular glare gradient: `radial-gradient(circle at X% Y%, rgba(255,255,255,0.7) 0%, transparent 60%)`.

### 3.3 Luggage Tag / Process Card Lift
- On card hover, elevate the surface (`y: -8px`, `scale: 1.02`), increase drop shadow depth (`box-shadow: 0 20px 48px rgba(0,0,0,0.14)`), and highlight the border with a crisp 1px specular rim light.

### 3.4 Dark Mode Obsidian Card Inner Glow
- When hovering over dark obsidian tiles, trigger an internal specular edge glow:
  ```css
  box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.06), 0 20px 50px rgba(0, 0, 0, 0.7);
  ```
  And trigger a playful icon scale pulse (`scale: 1.15`).

---

## 4. Phase 4: Web Audio API Synthesizer & Cursor Pill Follower

### 4.1 Synthetic Audio Haptics
- Implement a lightweight, zero-asset Web Audio API click synthesizer:
  ```javascript
  function playTactileClick(freq = 750, type = 'sine', duration = 0.04) {
    if (!audioEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }
  ```
- Trigger on all interactive tabs, state toggles, and CTA button clicks. Provide a mute toggle in the navigation.

### 4.2 Dynamic Ambient Glow & Contextual Cursor Pill
- Render `#ambientGlow` softly tracking mouse movements with smooth linear interpolation (lerp factor `0.15`).
- Render `.view-photo-pill` with contextual hover labels (`"Watch Demo"`, `"View Case Study"`, `"Interact"`, `"Calculate ROI"`).

---

## 5. Phase 5: Technical Constraints & Hardware Acceleration

1. **Hardware Acceleration**:
   - Apply `will-change: transform, opacity, clip-path;` and `transform: translateZ(0);` to all animated surfaces to guarantee 60fps across desktop browsers.
2. **Mobile Guard Rails (`max-width: 768px`)**:
   - Automatically disable heavy cursor-following pills, 3D tilt perspective, and magnetic pull on touch devices. Maintain smooth scroll reveals and tap active feedback.
3. **Concentric Geometry Law**:
   - Outer radius must mathematically match: `outer_radius = inner_radius + padding_offset`.
```
