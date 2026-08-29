# Master AI Prompt Framework: Hero Action Buttons Apple Liquid Glassmorphism & Burst Physics Preservation

> **Document Type**: Spatial UI/UX Specification & Master AI System Prompt  
> **Target Models**: Gemini 2.0 / Gemini 3.0 / Claude 3.5 & 3.7 Sonnet / GPT-4o / Stitch AI  
> **Scope**: `TEST PORTFOLIO` — Hero Section Action Buttons (`.btn-pill-outline` & `.modeling-burst-btn`)  
> **Aesthetic Standard**: Apple visionOS Specular Liquid Glass · Concentric Geometry · GSAP Particle Burst Preservation  

---

## 1. Master System Prompt

Copy and paste the prompt below into your AI prompt interface:

```markdown
Role & Objective:
You are an elite Spatial Interface Designer and Creative Motion Engineer. Your objective is to style the Hero Section secondary action buttons—**"View Full Resume"** (`.btn-pill-outline`) and **"Modeling Portfolio"** (`.modeling-burst-btn`)—with authentic **Apple Liquid Glassmorphism (visionOS / macOS Sequoia)** while strictly preserving all existing interactive GSAP physics burst animations, pop-out icons, and micro-hover kinetics.

---

### Core Engineering Directives

1. **Liquid Glass Optical Architecture**:
   - **View Full Resume (`.btn-pill-outline`)**:
     - Background: `rgba(255, 255, 255, 0.72) !important;`
     - Refraction: `backdrop-filter: blur(24px) saturate(200%) contrast(102%) brightness(104%);`
     - Specular Lighting: 4-tier chamfered rim reflection (`inset 0 1.5px 1.5px 0 #FFFFFF`, `inset 0 -1px 1px 0 rgba(0,0,0,0.03)`, `inset 0 0 0 1px rgba(255,255,255,0.45)`, `0 8px 24px -4px rgba(0,0,0,0.08)`).
     - Hover Glide: Spring elevation (`translateY(-2px) scale(1.02)`) with orange specular glow (`0 12px 32px -6px rgba(255, 107, 0, 0.16)`).

   - **Modeling Portfolio (`.modeling-burst-btn`)**:
     - Background: `rgba(255, 255, 255, 0.78) !important;`
     - Refraction: `backdrop-filter: blur(28px) saturate(200%) contrast(104%) brightness(103%);`
     - Specular Rim & Accent: `border: 1.5px solid rgba(255, 107, 0, 0.5) !important;` with dual inner specular rims (`inset 0 1.5px 1.5px 0 #FFFFFF`, `inset 0 0 0 1px rgba(255,255,255,0.6)`).
     - Hover State: Opacified liquid glass with electric orange rim and glowing ambient drop shadow (`0 14px 36px -6px rgba(255, 94, 0, 0.28)`).

2. **Strict Animation & Physics Preservation**:
   - **DO NOT MODIFY** any GSAP timeline logic in `main.js` (`initModelingBurstButton()`).
   - Keep all `.pop-out-icon` classes (`pop-icon-sunglasses`, `pop-icon-glasses`, `pop-icon-star`, `pop-icon-camera`) fully isolated with `pointer-events: none` and `z-index: -1`.
   - Maintain the arrow link transition (`.btn-link-icon` translate `2px, -2px` on hover).
```

---

## 2. CSS Code Blueprint (`styles.css`)

```css
/* ==========================================================================
   HERO BUTTONS — APPLE LIQUID GLASSMORPHISM SPECIFICATION
   ========================================================================== */

/* 1. View Full Resume Liquid Glass Button */
.btn-pill-outline {
  padding: 0.85rem 1.85rem;
  border-radius: var(--radius-pill, 9999px);
  background: rgba(255, 255, 255, 0.72) !important;
  backdrop-filter: blur(24px) saturate(200%) contrast(102%) brightness(104%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(200%) contrast(102%) brightness(104%) !important;
  color: #111111 !important;
  border: 1px solid rgba(255, 255, 255, 0.88) !important;
  box-shadow: 
    inset 0 1.5px 1.5px 0 #FFFFFF,
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.03),
    inset 0 0 0 1px rgba(255, 255, 255, 0.45),
    0 8px 24px -4px rgba(0, 0, 0, 0.08) !important;
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.25s ease,
              border-color 0.25s ease !important;
  pointer-events: auto !important;
  cursor: url('assets/custom-cursor.svg') 4 3, auto !important;
  position: relative;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-pill-outline:hover {
  background: rgba(255, 255, 255, 0.92) !important;
  border-color: rgba(255, 107, 0, 0.35) !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 
    inset 0 1.5px 1.5px 0 #FFFFFF,
    0 12px 32px -6px rgba(255, 107, 0, 0.16) !important;
}

.btn-pill-outline:active {
  transform: scale(0.96) translateY(1px) !important;
}

/* 2. Modeling Portfolio Liquid Glass Burst Button */
.modeling-burst-wrapper,
.modeling-btn-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 25;
  isolation: isolate;
  pointer-events: auto !important;
}

.modeling-burst-btn,
.modeling-btn-pill {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0.85rem 1.85rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.78) !important;
  backdrop-filter: blur(28px) saturate(200%) contrast(104%) brightness(103%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(200%) contrast(104%) brightness(103%) !important;
  border: 1.5px solid rgba(255, 107, 0, 0.5) !important;
  color: #111111 !important;
  text-decoration: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  box-shadow: 
    inset 0 1.5px 1.5px 0 #FFFFFF,
    inset 0 0 0 1px rgba(255, 255, 255, 0.6),
    0 8px 24px -4px rgba(255, 107, 0, 0.16) !important;
  cursor: url('assets/custom-cursor.svg') 4 3, auto !important;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform, box-shadow;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  pointer-events: auto !important;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.2s ease,
              border-color 0.2s ease,
              background 0.2s ease !important;
}

.modeling-burst-btn:hover,
.modeling-btn-pill:hover {
  background: rgba(255, 255, 255, 0.94) !important;
  border-color: #FF5E00 !important;
  box-shadow: 
    inset 0 1.5px 1.5px 0 #FFFFFF,
    0 14px 36px -6px rgba(255, 94, 0, 0.28) !important;
  transform: translateY(-2px);
}

.modeling-burst-btn:active,
.modeling-btn-pill:active {
  transform: translateY(0) scale(0.98);
}
```
