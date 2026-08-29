# Master Prompt Framework: Zero-Gravity Hero Physics & Universal Responsive Layout System

> **Document Type**: AI Developer Instruction Set, Physics Architecture Blueprint & Master System Prompt  
> **Target Models**: Gemini 2.0 / Gemini 3.0 / Claude 3.5 & 3.7 Sonnet / GPT-4o / Stitch AI  
> **Project Scope**: `TEST PORTFOLIO` — Matter.js Hero Zero-G Stage & Full-Viewport Responsive Framework  
> **Ecosystems**: iOS (Safari) · Android (Chrome) · iPadOS · macOS · Windows · Touch & Pointer Systems  

---

## 1. Master System Prompt

Copy and paste the entire block below into your AI prompt window:

```markdown
Role & Objective:
You are an elite Creative Technologist, Web Physics Engineer, and Responsive Systems Architect. Your objective is to design, implement, and maintain the **Matter.js Zero-Gravity Interactive Capsule Stage** and ensure 100% flawless responsive adaptation across every screen width and height (Mobile 320px–480px, Tablet 768px–1024px, Desktop 1280px–1920px, and Ultra-wide 4K) for Benyamin Namtalashvili's portfolio (`TEST PORTFOLIO`).

The hero physics capsules must be fully interactive on ALL devices—allowing users to directly grab, drag, fling, and bounce capsules in real-time with Apple-grade fluid momentum, while maintaining clean typographic legibility and zero interference with primary CTA buttons.

---

### Core Physical Laws & Architecture

1. **Zero-Gravity Kinematic Engine (Matter.js)**:
   - Gravity vector must be precisely zeroed:
     `engine.world.gravity.x = 0; engine.world.gravity.y = 0; engine.world.gravity.scale = 0;`
   - Dynamic parameters:
     * `restitution: 0.94` (Bouncy, elastic collisions)
     * `friction: 0.002` (Ultra-smooth surface gliding)
     * `frictionAir: 0.007` (Gentle atmospheric drift)
     * Ambient micro-nudge force: `applyForce(body, position, { x: cos(θ)*0.00025, y: sin(θ)*0.00025 })` every 60 frames.

2. **Cross-Device Scale & Boundary Law**:
   - Body radii and bounding boxes MUST dynamically scale to match the device screen size without overflowing:
     * Desktop (> 1024px): `scale: 1.0`
     * Tablet (768px – 1024px): `scale: 0.86`
     * Mobile (481px – 768px): `scale: 0.74`
     * Narrow Mobile (<= 480px): `scale: 0.64`
   - On mobile/portrait viewports, left-flank items anchor to the outer 30% width and right-flank items anchor to the outer 70% width to keep the center clear for hero copy.

3. **Pointer-Events & Z-Index Non-Blocking Architecture**:
   - The stage container must NEVER block underlying page clicks:
     `.hero-antigravity-container { position: absolute; inset: 0; pointer-events: none; z-index: 12; }`
   - Individual capsules capture pointer events with custom Figma cursor:
     `.antigravity-item { position: absolute; pointer-events: auto !important; cursor: grab !important; z-index: 15; touch-action: none; }`
   - Active dragged items elevate above all layers:
     `.antigravity-item.is-dragging { cursor: grabbing !important; z-index: 1000 !important; }`
   - Hero content container:
     `.hero-content-container { pointer-events: none; z-index: 20; }`
     `.hero-content-container a, button, input { pointer-events: auto; }`

4. **Multi-Touch & Fling Trajectory Calculation**:
   - Direct pointer capture (`setPointerCapture(pointerId)`) on `pointerdown`.
   - Trajectory buffer records recent positions `(x, y, timestamp)`.
   - On release (`pointerup`), velocity is calculated via finite difference ($v = \Delta p / \Delta t$) with a velocity clamp (`maxSpeed = 22`) and natural angular spin impulse.
   - Tactile auditory click triggered upon grab.

5. **Fluid Responsive Viewport System (Width & Height)**:
   - Full-bleed containers use `min-height: 100dvh;` (Dynamic Viewport Height) to prevent mobile browser toolbar layout shifts.
   - Container padding accounts for iOS safe areas: `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
   - Root page protection: `html, body { max-width: 100%; overflow-x: hidden; }` prevents horizontal scroll jitter.
```

---

## 2. Responsive Breakpoint & Scaling Matrix

| Viewport Category | Screen Width Range | Capsule Scale | Initial Coordinates Strategy | Headline Clamp |
| :--- | :--- | :--- | :--- | :--- |
| **Ultra-Wide / 4K** | $\ge 1920\text{px}$ | `1.15` | Wide peripheral flank distribution ($X: 8\%-25\%$, $X: 75\%-92\%$) | `clamp(3.5rem, 5vw, 4.5rem)` |
| **Desktop / Laptop** | $1025\text{px} - 1919\text{px}$ | `1.00` | Balanced peripheral flank distribution ($X: 12\%-30\%$, $X: 70\%-88\%$) | `clamp(2.8rem, 4.5vw, 3.8rem)` |
| **iPad Pro / Tablet** | $769\text{px} - 1024\text{px}$ | `0.86` | Mid-flank distribution with adaptive top/bottom bounds | `clamp(2.4rem, 4vw, 3.2rem)` |
| **Mobile (Portrait)** | $481\text{px} - 768\text{px}$ | `0.74` | Edge clearance mode ($X < 32\%$ or $X > 68\%$) | `clamp(2.0rem, 6.8vw, 2.6rem)` |
| **Small Mobile** | $\le 480\text{px}$ | `0.64` | Edge clearance mode ($X < 30\%$ or $X > 70\%$) | `clamp(1.85rem, 6.5vw, 2.2rem)` |

---

## 3. Complete Drop-In CSS Specification (`styles.css`)

```css
/* ==========================================================================
   MATTER.JS ZERO-GRAVITY FLOATING HERO STAGE & RESPONSIVE ARCHITECTURE
   ========================================================================== */

/* 1. Base Stage & Non-Blocking Layout */
.hero-section {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 7.5rem 1.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow-x: clip;
  overflow-y: visible;
  border: none !important;
}

.hero-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 960px;
  width: 100%;
  position: relative;
  z-index: 20;
  pointer-events: none;
}

.hero-content-container a,
.hero-content-container button,
.hero-content-container input,
.hero-content-container .hero-rating-pill,
.hero-content-container .hero-actions {
  pointer-events: auto;
}

/* 2. Zero-Gravity Physics Stage */
.hero-antigravity-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 12;
  overflow: hidden;
  touch-action: none;
}

.antigravity-item {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto !important;
  cursor: url('assets/custom-cursor.svg') 4 3, grab !important;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  will-change: transform;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  transition: box-shadow 0.25s ease, scale 0.2s ease;
  z-index: 15;
}

.antigravity-item:hover {
  z-index: 50;
}

.antigravity-item.is-dragging {
  cursor: url('assets/custom-cursor.svg') 4 3, grabbing !important;
  z-index: 1000 !important;
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.32) !important;
}

/* 3. Capsule Sizing & Typographic Geometry */
.capsule-item {
  padding: 0.72rem 1.7rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.45);
  white-space: nowrap;
}

.squircle-item {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.45);
}

/* 4. Capsule Chromatic Palettes */
.capsule-animations { background: #0071E3; color: #FFFFFF; }
.capsule-branding   { background: #FFD60A; color: #111111; }
.capsule-workflows  { background: #FF5E00; color: #FFFFFF; }
.capsule-3ddesign   { background: #AF52DE; color: #FFFFFF; }
.capsule-apps       { background: #FF2D55; color: #FFFFFF; }
.capsule-websites   { background: #00C7BE; color: #111111; }
.capsule-metaverse  { background: #5856D6; color: #FFFFFF; }
.capsule-marketing  { background: #34C759; color: #FFFFFF; }
.capsule-hireme     { background: #111113; color: #FFFFFF; border: 1.5px solid rgba(255, 107, 0, 0.6); }

.icon-ps   { background: #001E36; color: #31A8FF; border: 1.5px solid rgba(49, 168, 255, 0.4); }
.icon-ae   { background: #00005B; color: #9999FF; border: 1.5px solid rgba(153, 153, 255, 0.4); }
.icon-n8n  { background: #FF5C35; color: #FFFFFF; }
.icon-ai   { background: #330000; color: #FF9A00; border: 1.5px solid rgba(255, 154, 0, 0.4); }
.icon-bolt { background: #FF9500; color: #FFFFFF; }

/* 5. Mobile & Tablet Responsive Media Queries */
@media (max-width: 1024px) {
  .capsule-item {
    padding: 0.58rem 1.35rem;
    font-size: 0.92rem;
  }

  .squircle-item {
    width: 50px;
    height: 50px;
    font-size: 1rem;
    border-radius: 15px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 1rem 2.5rem;
    min-height: auto;
  }

  .hero-antigravity-container {
    min-height: 100%;
    pointer-events: none;
    z-index: 12;
  }

  .antigravity-item {
    pointer-events: auto !important;
    cursor: grab !important;
    z-index: 15;
  }

  .capsule-item {
    padding: 0.45rem 1.05rem !important;
    font-size: 0.82rem !important;
  }

  .squircle-item {
    width: 44px !important;
    height: 44px !important;
    font-size: 0.88rem !important;
    border-radius: 12px !important;
  }

  .hero-title {
    font-size: clamp(2rem, 6.8vw, 2.6rem);
    line-height: 1.15;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .capsule-item {
    padding: 0.38rem 0.85rem !important;
    font-size: 0.74rem !important;
  }

  .squircle-item {
    width: 38px !important;
    height: 38px !important;
    font-size: 0.8rem !important;
    border-radius: 10px !important;
  }

  .hero-title {
    font-size: clamp(1.85rem, 6.5vw, 2.2rem);
  }
}
```

---

## 4. Master JavaScript Engine (`hero-antigravity.js`)

```javascript
/**
 * MASTER MATTER.JS ZERO-GRAVITY HERO PHYSICS ENGINE
 * Cross-Device Touch & Pointer Support · Direct Kinematic Drag · Momentum Flinging
 */
(function () {
  'use strict';

  function ensureMatterLoaded(callback) {
    if (typeof Matter !== 'undefined') {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = 'matter.min.js';
    script.onload = () => { if (typeof Matter !== 'undefined') callback(); };
    script.onerror = () => {
      const cdn = document.createElement('script');
      cdn.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
      cdn.onload = () => { if (typeof Matter !== 'undefined') callback(); };
      document.head.appendChild(cdn);
    };
    document.head.appendChild(script);
  }

  function initMatterHero() {
    if (typeof Matter === 'undefined') {
      ensureMatterLoaded(initMatterHero);
      return;
    }

    const heroSection = document.getElementById('hero') || document.querySelector('.hero-section');
    const stageContainer = document.getElementById('heroAntigravityStage') || document.querySelector('.hero-antigravity-container');
    if (!heroSection || !stageContainer) return;

    const items = Array.from(stageContainer.querySelectorAll('.antigravity-item'));
    if (items.length === 0) return;

    // Reset previous engine if already attached
    if (stageContainer._matterEngine) {
      Matter.Engine.clear(stageContainer._matterEngine);
      if (stageContainer._matterRunner) Matter.Runner.stop(stageContainer._matterRunner);
    }

    const { Engine, World, Bodies, Body, Runner, Events, Composite, Vector } = Matter;

    // 1. Initialize Engine
    const engine = Engine.create({
      enableSleeping: false,
      constraintIterations: 4,
      positionIterations: 8,
      velocityIterations: 8
    });

    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
    engine.world.gravity.scale = 0;
    stageContainer._matterEngine = engine;

    function getDimensions() {
      const w = stageContainer.offsetWidth || heroSection.offsetWidth || window.innerWidth;
      const h = stageContainer.offsetHeight || heroSection.offsetHeight || window.innerHeight || 750;
      return { width: Math.max(300, w), height: Math.max(400, h) };
    }

    let { width: stageW, height: stageH } = getDimensions();

    function getViewportScale() {
      const screenW = window.innerWidth;
      if (screenW <= 480) return 0.64;
      if (screenW <= 768) return 0.74;
      if (screenW <= 1024) return 0.86;
      return 1.0;
    }

    // 2. Boundary Walls
    const wallThickness = 140;
    let walls = createWalls(stageW, stageH);

    function createWalls(w, h) {
      const opts = { isStatic: true, restitution: 0.98, friction: 0.001, render: { visible: false } };
      const top = Bodies.rectangle(w / 2, -wallThickness / 2, w * 3, wallThickness, opts);
      const bottom = Bodies.rectangle(w / 2, h + wallThickness / 2, w * 3, wallThickness, opts);
      const left = Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h * 3, opts);
      const right = Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h * 3, opts);
      World.add(engine.world, [top, bottom, left, right]);
      return { top, bottom, left, right };
    }

    // 3. Map DOM Elements to Bodies
    const bodyItemPairs = [];
    const globalScale = getViewportScale();

    items.forEach((el, index) => {
      el.style.touchAction = 'none';
      el.style.pointerEvents = 'auto';

      const initXPercent = parseFloat(el.getAttribute('data-initial-x')) || (index % 2 === 0 ? 12 : 88);
      const initYPercent = parseFloat(el.getAttribute('data-initial-y')) || (12 + (index * 7) % 75);
      const initRotDeg = parseFloat(el.getAttribute('data-rot')) || 0;
      const customScale = parseFloat(el.getAttribute('data-scale')) || 1;
      const responsiveScale = customScale * globalScale;

      const elRect = el.getBoundingClientRect();
      const elW = elRect.width > 20 ? elRect.width : (el.offsetWidth || 135);
      const elH = elRect.height > 20 ? elRect.height : (el.offsetHeight || 48);

      let posX = (initXPercent / 100) * stageW;
      let posY = (initYPercent / 100) * stageH;

      if (window.innerWidth <= 768) {
        posX = initXPercent < 50 ? Math.max(30, Math.min(posX, stageW * 0.32)) : Math.max(stageW * 0.68, Math.min(posX, stageW - 30));
      }

      posX = Math.max(40, Math.min(posX, stageW - 40));
      posY = Math.max(40, Math.min(posY, stageH - 40));

      const angleRad = (initRotDeg * Math.PI) / 180;
      const isSquircle = el.classList.contains('squircle-item');
      const chamferRadius = isSquircle ? 16 : elH / 2;

      const body = Bodies.rectangle(posX, posY, elW * responsiveScale, elH * responsiveScale, {
        chamfer: { radius: chamferRadius * responsiveScale },
        angle: angleRad,
        restitution: 0.94,
        friction: 0.002,
        frictionAir: 0.007,
        density: 0.001,
        render: { visible: false }
      });

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.35 + Math.random() * 0.45;
      Body.setVelocity(body, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.006);

      World.add(engine.world, body);

      const pair = {
        el, body,
        baseScale: responsiveScale,
        currentScale: responsiveScale,
        targetScale: responsiveScale,
        width: elW, height: elH,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        recentPositions: []
      };

      bodyItemPairs.push(pair);

      // 4. Pointer Events
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { el.setPointerCapture(e.pointerId); } catch (err) {}

        const rect = stageContainer.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        pair.isDragging = true;
        pair.dragOffset = { x: px - body.position.x, y: py - body.position.y };
        pair.targetScale = pair.baseScale * 1.15;
        pair.recentPositions = [{ x: px, y: py, t: performance.now() }];

        el.classList.add('is-dragging');
        document.body.classList.add('is-dragging-active');
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);

        if (typeof window.playButtonClick === 'function') window.playButtonClick();
      });

      el.addEventListener('pointermove', (e) => {
        if (!pair.isDragging) return;
        e.preventDefault();

        const rect = stageContainer.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        Body.setPosition(body, { x: px - pair.dragOffset.x, y: py - pair.dragOffset.y });
        pair.recentPositions.push({ x: px, y: py, t: performance.now() });
        if (pair.recentPositions.length > 5) pair.recentPositions.shift();
      });

      function handleRelease(e) {
        if (!pair.isDragging) return;
        pair.isDragging = false;
        pair.targetScale = pair.baseScale;
        el.classList.remove('is-dragging');
        document.body.classList.remove('is-dragging-active');
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}

        if (pair.recentPositions.length >= 2) {
          const first = pair.recentPositions[0];
          const last = pair.recentPositions[pair.recentPositions.length - 1];
          const dt = Math.max(16, last.t - first.t);
          const vx = ((last.x - first.x) / dt) * 16;
          const vy = ((last.y - first.y) / dt) * 16;
          const maxSpeed = 22;
          const speed = Math.hypot(vx, vy);
          const factor = speed > maxSpeed ? maxSpeed / speed : 1;

          Body.setVelocity(body, { x: vx * factor, y: vy * factor });
          Body.setAngularVelocity(body, vx * 0.007);
        }
      }

      el.addEventListener('pointerup', handleRelease);
      el.addEventListener('pointercancel', handleRelease);
    });

    // 5. Zero-G Ambient Micro-Drift
    let frame = 0;
    Events.on(engine, 'beforeUpdate', () => {
      frame++;
      if (frame % 60 === 0) {
        bodyItemPairs.forEach(pair => {
          if (!pair.isDragging && Vector.magnitude(pair.body.velocity) < 0.25) {
            const θ = Math.random() * Math.PI * 2;
            Body.applyForce(pair.body, pair.body.position, { x: Math.cos(θ) * 0.00025, y: Math.sin(θ) * 0.00025 });
          }
        });
      }
    });

    // 6. Synchronize Physics to DOM
    let isVisible = true;
    Events.on(engine, 'afterUpdate', () => {
      if (!isVisible) return;
      bodyItemPairs.forEach(pair => {
        pair.currentScale += (pair.targetScale - pair.currentScale) * 0.22;
        const posX = pair.body.position.x - pair.width / 2;
        const posY = pair.body.position.y - pair.height / 2;
        pair.el.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${pair.body.angle.toFixed(3)}rad) scale(${pair.currentScale.toFixed(3)})`;
      });
    });

    // 7. Runner & Intersection Observer
    const runner = Runner.create();
    Runner.run(runner, engine);
    stageContainer._matterRunner = runner;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          isVisible = e.isIntersecting;
          isVisible ? Runner.run(runner, engine) : Runner.stop(runner);
        });
      }, { threshold: 0.05 }).observe(heroSection);
    }

    // 8. Resize & Orientation Observer
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const dims = getDimensions();
        const scale = getViewportScale();
        if (Math.abs(dims.width - stageW) > 10 || Math.abs(dims.height - stageH) > 10) {
          stageW = dims.width;
          stageH = dims.height;
          Composite.remove(engine.world, [walls.top, walls.bottom, walls.left, walls.right]);
          walls = createWalls(stageW, stageH);

          bodyItemPairs.forEach(pair => {
            pair.baseScale = (parseFloat(pair.el.getAttribute('data-scale')) || 1) * scale;
            if (!pair.isDragging) pair.targetScale = pair.baseScale;
            Body.setPosition(pair.body, {
              x: Math.max(30, Math.min(pair.body.position.x, stageW - 30)),
              y: Math.max(30, Math.min(pair.body.position.y, stageH - 30))
            });
          });
        }
      }, 100);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initMatterHero, 60));
  } else {
    setTimeout(initMatterHero, 60);
  }
})();
```
