# MASTER SPECIFICATION & PROMPT: SECTION-BY-SECTION GSAP SCROLL ANIMATION ENGINE

> **Architecture**: GSAP 3.12+ · ScrollTrigger · Lenis Smooth Scroll Integration · Apple Editorial Restraint  
> **Target Scope**: Benyamin Namtalashvili Portfolio (`index.html`, `contact.html`, `main.js`, `styles.css`)  
> **Motion Standard**: Bidirectional Viewport In/Out Focus · Staggered Typographic Cascades · Zero-Jank Hardware Acceleration

---

## 1. Executive Directive & Motion Philosophy

You are an Elite Creative Technologist and Motion Engineer specializing in Awwwards-tier, Apple-grade editorial web experiences. Your objective is to architect and implement a unified, bidirectional **section-by-section GSAP ScrollTrigger animation system** across the entire website.

### Core Visual Principles:
1. **Viewport Focus (Appear & Fade In / Out)**:
   - As each section enters the viewport from below, it surfaces with fluid, cinematic confidence (`y: 40px → 0`, `autoAlpha: 0 → 1`, `scale: 0.985 → 1.0`).
   - As a section is scrolled out of the active reading zone, it smoothly and subtly recedes (`autoAlpha: 1 → 0.15` or `0`, `y: 0 → -30px`), granting complete visual emphasis to the currently active section.
   - When the user scrolls backward/upward, the animation reverses seamlessly with natural continuity (`toggleActions: "play reverse play reverse"`).
2. **Harmonic Internal Cascades**:
   - The section container does not merely fade in as a flat block. Its internal hierarchy animates in musical sequence:
     - **Eyebrow Tag** (`.sec-tag`): Instant, crisp pop (`stagger: 0.08s`).
     - **Main Heading** (`.section-h2`, `.faq-main-title`): Masked or vertical slide up with tight letter-spacing.
     - **Description** (`.section-desc`, `.faq-subtitle`): Gentle secondary drift.
     - **Content Canvas / Grids / Cards**: Clustered stagger with micro-elevation.
3. **Zero Jitter & Performance Integrity**:
   - All animations run on compositor threads (`transform`, `opacity` via `autoAlpha`).
   - `will-change: transform, opacity` applied cleanly during scroll phases and cleared post-settle.
   - Fully synchronized with Lenis Smooth Scroll via `lenis.on('scroll', ScrollTrigger.update)`.
   - Full support for `prefers-reduced-motion`.

---

## 2. Motion Tokens & Physics Calibrations

```javascript
const MOTION_TOKENS = {
  // Easing Curves
  easeEntrance: "power3.out",       // Fluid deceleration for entrance
  easeExit:     "power2.inOut",     // Smooth exit without abrupt drops
  easeSnappy:   "power4.out",       // Immediate micro-interaction response
  
  // Durations
  sectionDuration: 0.85,           // Master section container tween
  headerStagger:   0.09,           // Tag -> Title -> Subtitle gap
  cardStagger:     0.08,           // Grid items staggered reveal
  
  // Viewport Triggers (Apple Sequoia Standards)
  triggerEnterStart: "top 88%",    // Triggers entrance as section approaches bottom
  triggerExitEnd:    "bottom 12%", // Triggers gentle exit as section clears top
  
  // Transforms
  yDistanceEnter: 36,              // px shift on entrance
  yDistanceExit: -28,              // px shift on exit
  scaleOrigin:    0.985            // Micro-scale for depth perception
};
```

---

## 3. Section-by-Section Animation Matrix

| Section Identifier | Target Elements | Enter Behavior | Exit Behavior | Toggle Actions |
| :--- | :--- | :--- | :--- | :--- |
| **`#hero`** (Hero Stage) | `.hero-title`, `.hero-lead`, `.hero-actions-row`, `.hero-stage-wrap` | Instant load sequence + 3D perspective unfold | Scrolls up with parallax drift & subtle fade out (`y: -50px`, `autoAlpha: 0.2`) | `play none none reverse` |
| **`#featured-projects`** (Selected Work) | `.featured-header-container`, `.portfolio-card-item` | Section header slides in + project cards cascade with 3D elevation | Smooth fade out as next section takes stage | `play reverse play reverse` |
| **`#capabilities`** (Core Capabilities Bento) | Bento header + 5 Bento cards (`.bento-card`) | Staggered geometric bloom (`scale: 0.97 → 1.0`, `autoAlpha: 0 → 1`) | Subtle dimming & top exit drift | `play reverse play reverse` |
| **`#testimonials`** (Client Stories Marquee) | `.testimonials-header`, `.testimonials-stage` | Header cascade + marquee track fades into active view | Gentle fade out on scroll beyond | `play reverse play reverse` |
| **`#faq`** (The Curious Section) | `.faq-header-wrap`, `.faq-group`, `.faq-item` | Header cascade + Figma-frame accordion groups reveal | Accordion smoothly recedes as footer arrives | `play reverse play reverse` |
| **`.floating-footer-wrapper`** (Dark Footer) | `.floating-dark-footer`, `.footer-frame-top`, `.designer-footer-main` | Elevates from `y: 80px` to `0`, card expands to full focus | Reverses smoothly on upward scroll | `play reverse play reverse` |

---

## 4. Architectural Implementation Blueprint

### Step 1: Master Scroll Controller in `main.js`
Replace disjointed, one-off triggers with a unified `initSectionScrollOrchestrator()` function:
- Register ScrollTrigger with GSAP.
- Bind all primary `<section>` and `.floating-footer-wrapper` containers into dynamic entrance & exit tweens.
- Implement bidirectional `toggleActions: "play reverse play reverse"`.
- Cleanly clear inline styles (`clearProps: "transform,opacity"`) when fully settled to prevent layout containment issues.

### Step 2: GPU Acceleration in `styles.css`
Add hardware-accelerated rendering rules:
```css
/* Optimized GPU Layers for ScrollTrigger Elements */
.hero-section,
.featured-projects-section,
.capabilities-bento-section,
.testimonials-section,
.faq-section,
.floating-footer-wrapper {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Step 3: Lenis Ticker Synchronization
Ensure the Lenis ticker and GSAP ScrollTrigger tick on the identical frame:
```javascript
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

---

## 5. Verification & Acceptance Checklist

- [ ] Every major section smoothly appears when scrolled into view (from top or bottom).
- [ ] Every major section gently dims/fades out as it scrolls out of the active reading viewport.
- [ ] Scrolling backwards/upwards reverses animations naturally without jumpiness or broken layouts.
- [ ] No flickering, zero cumulative layout shift (CLS), and 120fps fluid scrolling on ProMotion / high-refresh displays.
- [ ] Hero 3D video unfold, FAQ accordion expand/collapse, and Testimonials infinite marquee continue to function without collision.
- [ ] `prefers-reduced-motion` immediately disables all transitions for accessibility compliance.
