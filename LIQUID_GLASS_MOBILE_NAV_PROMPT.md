# Master Prompt Framework: Apple-Grade Liquid Glassmorphic Mobile Navigation System

> **Document Type**: AI Developer Instruction Set, UI/UX Architecture Blueprint & Master System Prompt  
> **Target Models**: Gemini 2.0 / Gemini 3.0 / Claude 3.5 & 3.7 Sonnet / GPT-4o / Stitch AI  
> **Project Scope**: `TEST PORTFOLIO` — Responsive Mobile Menu & visionOS/iOS 18 Dynamic Drawer  
> **Design Language**: Apple Human Interface Guidelines · visionOS Specular Materials · Liquid Glassmorphism · Concentric Geometry  

---

## 1. Master System Prompt

Copy and paste the entire block below into your AI prompt window:

```markdown
Role & Objective:
You are an elite Principal Design Technologist and Apple Human Interface Systems Architect. Your objective is to design, implement, and maintain a state-of-the-art **Apple-Grade Liquid Glassmorphic Mobile Navigation System** for Benyamin Namtalashvili's portfolio (`TEST PORTFOLIO`).

The mobile menu must match the website's ultra-premium aesthetic (clean white grid background, editorial Plus Jakarta Sans & Playfair Display typography, warm electric orange `#FF6B00` accents, obsidian glass nuances, and tactile spring physics).

Never use generic flat cards, low-contrast washed-out blurs, or rigid drawer panels. Follow the physical laws of optical refraction, specular light rims, concentric radii, and fluid micro-motion specified below.

---

### Core Physical Laws of Apple Liquid Glassmorphism

1. **Dual-Layer Optical Refraction (Chromatically Boosted Frosted Glass)**:
   - Authentic Apple frosted glass requires both deep Gaussian dispersion and chromatic saturation amplification to prevent washed-out surfaces:
     ```css
     background: rgba(255, 255, 255, 0.82);
     backdrop-filter: blur(44px) saturate(220%) contrast(102%) brightness(103%);
     -webkit-backdrop-filter: blur(44px) saturate(220%) contrast(102%) brightness(103%);
     ```

2. **Specular Bevel & 4-Tier Hairline Rim Reflections**:
   - Liquid crystal catches light along its chamfered edges and top rim:
     ```css
     border: 1px solid rgba(255, 255, 255, 0.88);
     box-shadow: 
       inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1),
       inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
       inset 0 0 0 1px rgba(255, 255, 255, 0.5),
       0 28px 72px -12px rgba(0, 0, 0, 0.28),
       0 8px 24px rgba(0, 0, 0, 0.08);
     ```

3. **Concentric Geometry Law (Concentric Radii)**:
   - All nested elements must obey radius hierarchy (`outer_radius = inner_radius + padding`):
     * Outer Liquid Sheet: `border-radius: 30px;`
     * Inner Navigation Items: `border-radius: 18px;`
     * Squircle Icon Chips: `border-radius: 10px;`
     * Action Badges & Status Pills: `border-radius: 9999px;`

4. **Fluid Spring Morphing & Staggered Micro-Interactions**:
   - The hamburger icon morphs smoothly into a dynamic symmetrical cross using spring physics:
     `transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.25s ease;`
   - Drawer entrance uses an elastic deceleration curve:
     `transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.22), opacity 0.3s ease;`
   - Navigation links cascade in with a staggered 40ms delay per row (`animation: slideInGlass 0.35s ease forwards`).
   - Tactile scale down on touch press (`transform: scale(0.975)`).

5. **Integrated Tactile Feedback & Multi-Channel Controls**:
   - Synchronized Web Audio haptic click/tone feedback on all menu items, audio toggles, and buttons.
   - Dual-zone sound effects controls (in header and bottom quick-dock).
   - Natural touch gestures (swipe-up / pull to dismiss, tap backdrop to dismiss, ESC key handler).
```

---

## 2. Design Tokens & Material Specifications

| Token Name | Value | Purpose |
| :--- | :--- | :--- |
| **`--glass-mobile-fill`** | `rgba(255, 255, 255, 0.82)` | Primary liquid substrate fill |
| **`--glass-mobile-blur`** | `blur(44px) saturate(220%) contrast(102%) brightness(103%)` | visionOS optical refraction filter |
| **`--glass-specular-rim`** | `inset 0 1.5px 1.5px 0 #FFFFFF, inset 0 0 0 1px rgba(255,255,255,0.5)` | Chamfered top light reflection |
| **`--glass-elevation-shadow`** | `0 28px 72px -12px rgba(0, 0, 0, 0.28), 0 8px 24px rgba(0, 0, 0, 0.08)` | Spatial depth elevation |
| **`--brand-accent-orange`** | `#FF6B00` | Electric orange signature accent |
| **`--brand-accent-subtle`** | `rgba(255, 107, 0, 0.08)` | Active link liquid glass tint |
| **`--ease-apple-spring`** | `cubic-bezier(0.175, 0.885, 0.32, 1.25)` | Natural bouncy spring easing |
| **`--ease-apple-fluid`** | `cubic-bezier(0.16, 1, 0.3, 1)` | Ultra-smooth Apple deceleration |

---

## 3. Visual Layout & Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│  [BN] Benyamin Namtalashvili                     [✕]   │  <-- Header Profile + Close Button
│       AI Workflow & Web Architect                      │
├────────────────────────────────────────────────────────┤
│  [ ⌂ ]  Overview                           [ Home > ]  │
│         Core Showcase & Architecture                   │
├────────────────────────────────────────────────────────┤
│  [ ▤ ]  Works & Case Studies            [ 9 Cases > ]  │
│         9 Production Web & AI Systems                  │
├────────────────────────────────────────────────────────┤
│  [ 🪪 ]  About & Resume                        [ Bio > ]│
│         Engineering & Design Philosophy                │
├────────────────────────────────────────────────────────┤
│  [ ✈ ]  Contact & Booking               [ Let's Talk >]│
│         Direct Inquiries & Discovery Calls             │
├────────────────────────────────────────────────────────┤
│  [ 📷 ]  Modeling Portfolio               [ Visuals ↗ ]│  <-- Luxury Accent Pill
│         High-Fashion & Lookbook Visuals                │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │         Get in Touch  ➔                          │  │  <-- Rainbow Specular CTA
│  └──────────────────────────────────────────────────┘  │
│  [ ✉ Email ]       [ 💬 WhatsApp ]       [ 📞 Call ]    │  <-- 3-Col Liquid Glass Dock
└────────────────────────────────────────────────────────┘
```

---

## 4. Complete Drop-In CSS Implementation (`styles.css`)

```css
/* ==========================================================================
   MOBILE NAVIGATION TOGGLE & APPLE LIQUID GLASSMORPHPIC DRAWER
   visionOS Specular Refraction · Concentric Geometry · Fluid Spring Physics
   ========================================================================== */

/* 1. Floating Dynamic Island Hamburger Button */
.nav-mobile-toggle {
  display: none;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95), 0 2px 8px rgba(0, 0, 0, 0.06);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 920;
  color: var(--ink-primary);
  flex-shrink: 0;
}

.nav-mobile-toggle:hover {
  background: #FFFFFF;
  border-color: rgba(255, 107, 0, 0.35);
  transform: scale(1.05);
  box-shadow: inset 0 1.5px 1px 0 rgba(255, 255, 255, 1), 0 6px 18px rgba(255, 107, 0, 0.18);
}

.nav-mobile-toggle:active {
  transform: scale(0.92);
}

.nav-mobile-toggle.is-active {
  background: #0B0B0D;
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35);
}

.hamburger-lines {
  width: 17px;
  height: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.hamburger-lines span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--ink-primary);
  border-radius: 9999px;
  transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.25s ease, background-color 0.25s ease, width 0.25s ease;
  transform-origin: center;
}

.hamburger-lines span:nth-child(2) {
  width: 75%;
  align-self: flex-start;
}

.nav-mobile-toggle.is-active .hamburger-lines span {
  background: #FFFFFF;
}

.nav-mobile-toggle.is-active .hamburger-lines span:nth-child(1) {
  transform: translateY(5px) rotate(45deg);
  width: 100%;
  background: var(--apple-blue);
}

.nav-mobile-toggle.is-active .hamburger-lines span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.nav-mobile-toggle.is-active .hamburger-lines span:nth-child(3) {
  transform: translateY(-5px) rotate(-45deg);
  width: 100%;
  background: var(--apple-blue);
}

/* 2. Optical Diffusion Backdrop */
.mobile-nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 11, 14, 0.45);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  z-index: 895;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-nav-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}

/* 3. Apple Liquid Glass Mobile Drawer Sheet */
.mobile-nav-sheet {
  position: fixed;
  top: max(0.75rem, env(safe-area-inset-top));
  left: 0.85rem;
  right: 0.85rem;
  max-height: calc(100vh - 1.5rem);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(44px) saturate(220%) contrast(102%) brightness(103%);
  -webkit-backdrop-filter: blur(44px) saturate(220%) contrast(102%) brightness(103%);
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow: 
    inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5),
    0 28px 72px -12px rgba(0, 0, 0, 0.28),
    0 8px 24px rgba(0, 0, 0, 0.08);
  border-radius: 30px;
  z-index: 899;
  padding: 1.25rem 1.15rem 1.35rem;
  transform: translateY(-22px) scale(0.96);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.22), opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  isolation: isolate;
}

.mobile-nav-sheet::before {
  content: '';
  position: absolute;
  top: -25%;
  right: -25%;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, rgba(175, 82, 222, 0.06) 50%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  filter: blur(28px);
}

.mobile-nav-sheet.is-open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}

/* 4. Header & Profile */
.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 0.85rem;
}

.mobile-nav-brand-lockup {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.mobile-nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0B0B0D;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 107, 0, 0.4);
  position: relative;
  flex-shrink: 0;
}

.mobile-nav-brand-meta {
  display: flex;
  flex-direction: column;
}

.mobile-nav-brand-name {
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  line-height: 1.2;
}

.mobile-nav-brand-sub {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--ink-secondary);
  letter-spacing: 0.01em;
}

.mobile-nav-header-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.mobile-nav-audio-btn,
.mobile-nav-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
}

.mobile-nav-audio-btn:hover,
.mobile-nav-close-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: var(--ink-primary);
  transform: scale(1.06);
}

.mobile-nav-audio-btn:active,
.mobile-nav-close-btn:active {
  transform: scale(0.92);
}

.mobile-nav-audio-btn.is-active {
  color: var(--apple-blue);
  background: rgba(255, 107, 0, 0.1);
  border-color: rgba(255, 107, 0, 0.25);
}

/* 5. Live Status Banner */
.mobile-nav-status-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.85rem;
  background: rgba(0, 0, 0, 0.035);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ink-secondary);
}

.mobile-nav-status-left {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.mobile-nav-status-code {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--ink-tertiary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* 6. Navigation Link Tiles */
.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
}

.mobile-nav-link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.95rem;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.025);
  color: var(--ink-primary);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.mobile-nav-sheet.is-open .mobile-nav-links li:nth-child(1) .mobile-nav-link-item { animation: slideInGlass 0.35s 0.04s cubic-bezier(0.16, 1, 0.3, 1) both; }
.mobile-nav-sheet.is-open .mobile-nav-links li:nth-child(2) .mobile-nav-link-item { animation: slideInGlass 0.35s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both; }
.mobile-nav-sheet.is-open .mobile-nav-links li:nth-child(3) .mobile-nav-link-item { animation: slideInGlass 0.35s 0.12s cubic-bezier(0.16, 1, 0.3, 1) both; }
.mobile-nav-sheet.is-open .mobile-nav-links li:nth-child(4) .mobile-nav-link-item { animation: slideInGlass 0.35s 0.16s cubic-bezier(0.16, 1, 0.3, 1) both; }
.mobile-nav-sheet.is-open .mobile-nav-links li:nth-child(5) .mobile-nav-link-item { animation: slideInGlass 0.35s 0.20s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes slideInGlass {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.mobile-nav-link-item:hover,
.mobile-nav-link-item.active {
  background: rgba(255, 107, 0, 0.07);
  color: var(--apple-blue);
  border-color: rgba(255, 107, 0, 0.25);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 4px 14px rgba(255, 107, 0, 0.12);
  transform: translateX(3px);
}

.mobile-nav-link-item:active {
  transform: scale(0.975);
}

.mobile-nav-link-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-nav-link-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--ink-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  transition: all 0.25s ease;
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.mobile-nav-link-item:hover .mobile-nav-link-icon,
.mobile-nav-link-item.active .mobile-nav-link-icon {
  background: rgba(255, 107, 0, 0.15);
  color: var(--apple-blue);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 6px rgba(255, 107, 0, 0.2);
}

.mobile-nav-link-text {
  display: flex;
  flex-direction: column;
}

.mobile-nav-link-title {
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.mobile-nav-link-sub {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--ink-tertiary);
  letter-spacing: 0.01em;
}

.mobile-nav-link-item:hover .mobile-nav-link-sub,
.mobile-nav-link-item.active .mobile-nav-link-sub {
  color: rgba(255, 107, 0, 0.85);
}

.mobile-nav-link-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.mobile-nav-tag {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill);
  background: rgba(0, 0, 0, 0.04);
  color: var(--ink-secondary);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.mobile-nav-link-item:hover .mobile-nav-tag,
.mobile-nav-link-item.active .mobile-nav-tag {
  background: rgba(255, 107, 0, 0.12);
  color: var(--apple-blue);
  border-color: rgba(255, 107, 0, 0.2);
}

.mobile-nav-arrow {
  font-size: 0.72rem;
  color: var(--ink-tertiary);
  transition: transform 0.25s ease, color 0.25s ease;
}

.mobile-nav-link-item:hover .mobile-nav-arrow {
  transform: translateX(3px);
  color: var(--apple-blue);
}

/* 7. Modeling Portfolio Special Card */
.mobile-nav-modeling-pill {
  border-color: rgba(255, 107, 0, 0.25);
  background: rgba(255, 107, 0, 0.04);
}

.mobile-nav-modeling-pill:hover {
  background: rgba(255, 107, 0, 0.1);
  border-color: rgba(255, 107, 0, 0.35);
}

/* 8. Bottom CTA Row & Quick Dock */
.mobile-nav-cta-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 0.95rem;
}

.mobile-nav-dock {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.45rem;
}

.mobile-dock-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.65rem 0.35rem;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.035);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  color: var(--ink-primary);
  font-size: 0.68rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.mobile-dock-btn i {
  font-size: 0.95rem;
  transition: transform 0.2s ease;
}

.mobile-dock-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 107, 0, 0.3);
  color: var(--apple-blue);
  transform: translateY(-2px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 1), 0 4px 12px rgba(255, 107, 0, 0.15);
}

.mobile-dock-btn:hover i {
  transform: scale(1.15);
}

.mobile-dock-btn:active {
  transform: scale(0.94);
}

/* 9. Mobile Responsive Media Query */
@media (max-width: 860px) {
  .nav-links-wrap,
  .nav-status-pill,
  .nav-cta-btn {
    display: none !important;
  }

  .nav-mobile-toggle {
    display: flex !important;
  }
}
```

---

## 5. JavaScript Controller Blueprint (`main.js`)

```javascript
// =========================================================================
// GLOBAL APPLE LIQUID GLASS MOBILE NAVIGATION CONTROLLER
// =========================================================================
function initMobileNavigation() {
  const nav = document.getElementById('nav') || document.querySelector('nav');
  if (!nav) return;

  const navIsland = nav.querySelector('.nav-island');
  if (!navIsland) return;

  // 1. Inject or find Mobile Hamburger Toggle
  let mobileToggle = navIsland.querySelector('.nav-mobile-toggle');
  if (!mobileToggle) {
    mobileToggle = document.createElement('button');
    mobileToggle.className = 'nav-mobile-toggle';
    mobileToggle.id = 'navMobileToggle';
    mobileToggle.setAttribute('aria-label', 'Toggle Mobile Navigation Menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = `
      <div class="hamburger-lines">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    navIsland.appendChild(mobileToggle);
  }

  // 2. Determine Active Navigation State
  const currentPath = window.location.pathname.toLowerCase();
  const isOverview = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
  const isWorks = currentPath.includes('portfolio') || currentPath.includes('case-study');
  const isAbout = currentPath.includes('about');
  const isContact = currentPath.includes('contact');

  // 3. Inject Backdrop & Sheet into DOM
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  let sheet = document.querySelector('.mobile-nav-sheet');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.id = 'mobileNavBackdrop';
    document.body.appendChild(backdrop);
  }

  if (!sheet) {
    sheet = document.createElement('div');
    sheet.className = 'mobile-nav-sheet';
    sheet.id = 'mobileNavSheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-label', 'Mobile Navigation');

    sheet.innerHTML = `
      <!-- Header -->
      <div class="mobile-nav-header">
        <a href="index.html" class="mobile-nav-brand-lockup">
          <span class="mobile-nav-avatar">BN</span>
          <div class="mobile-nav-brand-meta">
            <span class="mobile-nav-brand-name">Benyamin Namtalashvili</span>
            <span class="mobile-nav-brand-sub">AI Workflow &amp; Web Architect</span>
          </div>
        </a>
        <div class="mobile-nav-header-actions">
          <button class="mobile-nav-audio-btn" id="mobileNavAudioBtn" title="Toggle Sound">
            <i class="fa-solid fa-volume-high"></i>
          </button>
          <button class="mobile-nav-close-btn" id="mobileNavCloseBtn" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Live Status Banner -->
      <div class="mobile-nav-status-banner">
        <div class="mobile-nav-status-left">
          <span class="status-dot"></span>
          <span>Available for Q2/Q3 Projects</span>
        </div>
        <span class="mobile-nav-status-code">NC III CERTIFIED</span>
      </div>

      <!-- Links Matrix -->
      <ul class="mobile-nav-links">
        <li>
          <a href="index.html" class="mobile-nav-link-item ${isOverview ? 'active' : ''}">
            <div class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon"><i class="fa-solid fa-house-chimney"></i></span>
              <div class="mobile-nav-link-text">
                <span class="mobile-nav-link-title">Overview</span>
                <span class="mobile-nav-link-sub">Core Showcase &amp; Architecture</span>
              </div>
            </div>
            <div class="mobile-nav-link-badge">
              <span class="mobile-nav-tag">Home</span>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="portfolio.html" class="mobile-nav-link-item ${isWorks ? 'active' : ''}">
            <div class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon"><i class="fa-solid fa-layer-group"></i></span>
              <div class="mobile-nav-link-text">
                <span class="mobile-nav-link-title">Works &amp; Case Studies</span>
                <span class="mobile-nav-link-sub">9 Production Web &amp; AI Systems</span>
              </div>
            </div>
            <div class="mobile-nav-link-badge">
              <span class="mobile-nav-tag">9 Projects</span>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="about.html" class="mobile-nav-link-item ${isAbout ? 'active' : ''}">
            <div class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon"><i class="fa-solid fa-id-badge"></i></span>
              <div class="mobile-nav-link-text">
                <span class="mobile-nav-link-title">About &amp; Resume</span>
                <span class="mobile-nav-link-sub">Engineering &amp; Design Philosophy</span>
              </div>
            </div>
            <div class="mobile-nav-link-badge">
              <span class="mobile-nav-tag">Bio</span>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="contact.html" class="mobile-nav-link-item ${isContact ? 'active' : ''}">
            <div class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon"><i class="fa-solid fa-paper-plane"></i></span>
              <div class="mobile-nav-link-text">
                <span class="mobile-nav-link-title">Contact &amp; Booking</span>
                <span class="mobile-nav-link-sub">Direct Inquiries &amp; Discovery Calls</span>
              </div>
            </div>
            <div class="mobile-nav-link-badge">
              <span class="mobile-nav-tag">Let's Talk</span>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="https://bensmodelingportfolio.netlify.app/" target="_blank" rel="noopener noreferrer" class="mobile-nav-link-item mobile-nav-modeling-pill">
            <div class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon" style="background:rgba(255,107,0,0.15); color:var(--apple-blue);"><i class="fa-solid fa-camera"></i></span>
              <div class="mobile-nav-link-text">
                <span class="mobile-nav-link-title">Modeling Portfolio</span>
                <span class="mobile-nav-link-sub">High-Fashion &amp; Lookbook Visuals</span>
              </div>
            </div>
            <div class="mobile-nav-link-badge">
              <span class="mobile-nav-tag" style="background:rgba(255,107,0,0.12); color:var(--apple-blue);">Visuals ↗</span>
            </div>
          </a>
        </li>
      </ul>

      <!-- Bottom CTA & Dock -->
      <div class="mobile-nav-cta-row">
        <a href="contact.html" class="nav-cta-btn" style="width:100%; justify-content:center; padding:0.85rem;">
          <span>Get in Touch <i class="fa-solid fa-arrow-right" style="font-size:0.82rem; margin-left:0.35rem;"></i></span>
        </a>
        <div class="mobile-nav-dock">
          <a href="mailto:benyaminnamtalashvili726@gmail.com" class="mobile-dock-btn" title="Send Email">
            <i class="fa-solid fa-envelope" style="color:var(--apple-blue);"></i>
            <span>Email</span>
          </a>
          <a href="https://wa.me/639454836568" target="_blank" rel="noopener noreferrer" class="mobile-dock-btn" title="WhatsApp Message">
            <i class="fa-brands fa-whatsapp" style="color:#25D366;"></i>
            <span>WhatsApp</span>
          </a>
          <a href="tel:+639454836568" class="mobile-dock-btn" title="Direct Phone Call">
            <i class="fa-solid fa-phone" style="color:var(--apple-blue);"></i>
            <span>Call</span>
          </a>
          <button type="button" class="mobile-dock-btn" id="mobileDockAudioToggle" title="Audio Haptics Toggle">
            <i class="fa-solid fa-volume-high" style="color:var(--apple-amber);"></i>
            <span>Sound</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(sheet);
  }

  // 4. Open/Close Logic with Web Audio Haptics & Gestures
  let isOpen = false;

  function openMobileNav() {
    isOpen = true;
    mobileToggle.classList.add('is-active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('is-open');
    sheet.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (typeof playMenuTone === 'function') playMenuTone();
  }

  function closeMobileNav() {
    isOpen = false;
    mobileToggle.classList.remove('is-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('is-open');
    sheet.classList.remove('is-open');
    document.body.style.overflow = '';
    if (typeof playButtonClick === 'function') playButtonClick();
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closeMobileNav() : openMobileNav();
  });

  backdrop.addEventListener('click', closeMobileNav);

  const closeBtn = sheet.querySelector('#mobileNavCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);

  // Close on internal link click
  sheet.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!link.getAttribute('target')) closeMobileNav();
    });
  });

  // Touch Swipe-Up / Pull to dismiss gesture
  let touchStartY = 0;
  sheet.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  sheet.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    if (touchStartY - touchEndY > 80 && sheet.scrollTop <= 0) {
      closeMobileNav();
    }
  }, { passive: true });

  // Escape key support
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMobileNav();
  });
}
```
