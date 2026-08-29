# Master Prompt Framework: Apple-Grade Liquid Glassmorphic Navigation Bar & Dynamic Island System

> **Document Type**: AI Developer Instruction Set, UI/UX Architecture Blueprint & Master System Prompt  
> **Target Models**: Gemini 2.0 / Gemini 3.0 / Claude 3.5 & 3.7 Sonnet / GPT-4o / Stitch AI  
> **Project Scope**: `TEST PORTFOLIO` — Universal Floating Dynamic Island Navigation Bar  
> **Design Language**: Apple Human Interface Guidelines · visionOS Specular Materials · Liquid Glassmorphism · Concentric Geometry · Fluid Scroll Dynamics  

---

## 1. Master System Prompt

Copy and paste the entire block below into your AI prompt window:

```markdown
Role & Objective:
You are an elite Principal Design Technologist and Apple Human Interface Systems Specialist. Your objective is to build and maintain an authentic **Apple-Grade Liquid Glassmorphic Floating Navigation Bar (Dynamic Island)** for Benyamin Namtalashvili's portfolio (`TEST PORTFOLIO`).

The navigation bar must elevate the website with authentic visionOS/macOS Sequoia specular material physics: deep Gaussian dispersion with chromatic saturation boost, 4-tier chamfered rim highlights, concentric inner capsules, adaptive scroll compression, and tactile spring feedback.

Never use flat, opaque white bars, generic CSS blur filters, or unrefined borders. Follow the physical laws of optical refraction, specular rim lighting, and concentric geometry specified below.

---

### Core Physical Laws of Apple Liquid Glass Navigation

1. **Dual-Layer Optical Refraction & Chromatic Saturation Amplification**:
   - Transparent glass over fast-moving web content requires both deep Gaussian blur and saturation enhancement to prevent washed-out muddy backgrounds:
     ```css
     background: rgba(255, 255, 255, 0.78);
     backdrop-filter: blur(36px) saturate(210%) contrast(104%) brightness(103%);
     -webkit-backdrop-filter: blur(36px) saturate(210%) contrast(104%) brightness(103%);
     ```

2. **4-Tier Chamfered Specular Rim Lighting**:
   - Glass surfaces catch light along their top and outer chamfered edges:
     ```css
     border: 1px solid rgba(255, 255, 255, 0.82);
     box-shadow: 
       inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1),
       inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
       inset 0 0 0 1px rgba(255, 255, 255, 0.45),
       0 20px 48px -8px rgba(0, 0, 0, 0.12),
       0 4px 16px rgba(0, 0, 0, 0.04);
     ```

3. **Concentric Geometry Law (Nested Radii)**:
   - Outer Dynamic Island: `border-radius: 9999px;` (Pill geometry).
   - Inner Segmented Links Container: `border-radius: 9999px;` (`background: rgba(0,0,0,0.035); padding: 0.2rem 0.3rem;`).
   - Individual Navigation Pills: `border-radius: 9999px;` (`padding: 0.35rem 0.85rem;`).
   - Brand Avatar & Audio Toggle: `width: 28px–32px; border-radius: 50%;`.

4. **Dynamic Island Adaptive Scroll Elevation (`nav.is-scrolled`)**:
   - When the user scrolls past 24px:
     * Island scales smoothly to `0.985` with elevated shadow depth (`0 24px 56px -8px rgba(0,0,0,0.18)`).
     * Top positioning compresses from `1.25rem` to `0.85rem`.
     * Glass substrate density shifts to `rgba(255, 255, 255, 0.88)` for higher legibility over rich media and cards.

5. **Multi-Spectrum Rainbow Specular Glow on CTA Button**:
   - The primary CTA button utilizes a rotating 8-stop multi-spectral gradient blur beneath its dark obsidian glass shell (`animation: rainbowGlowSpin 3s linear infinite`).

6. **Web Audio Haptics Integration**:
   - Audio feedback is synchronized with user taps and clicks across all navigation links, audio mute/unmute buttons, and CTA pills.
```

---

## 2. Design Tokens & Material Specifications

| Token Name | Value | Purpose |
| :--- | :--- | :--- |
| **`--glass-nav-fill-idle`** | `rgba(255, 255, 255, 0.78)` | Idle substrate fill |
| **`--glass-nav-fill-scrolled`** | `rgba(255, 255, 255, 0.88)` | Scrolled compressed substrate fill |
| **`--glass-nav-blur`** | `blur(36px) saturate(210%) contrast(104%) brightness(103%)` | visionOS optical refraction |
| **`--glass-nav-rim-light`** | `inset 0 1.5px 1.5px 0 #FFFFFF, inset 0 0 0 1px rgba(255,255,255,0.45)` | Chamfered top light reflection |
| **`--glass-nav-shadow`** | `0 20px 48px -8px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.04)` | Floating elevation drop shadow |
| **`--brand-accent-orange`** | `#FF6B00` | Electric orange signature accent |
| **`--ease-apple`** | `cubic-bezier(0.16, 1, 0.3, 1)` | Apple deceleration easing curve |

---

## 3. Visual Layout Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                            │
│   ┌───┐                                                                                    │
│   │BN │ Benyamin   [ Overview │ Works & Case Studies │ About & Resume ]  🟢 Available  [🔊]  [ Get in Touch ➔ ] │
│   └───┘                                                                                    │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
     ▲                       ▲                                                ▲        ▲           ▲
Brand Monogram       Segmented Liquid Glass                           Live Status   Audio   Multi-Spectrum
& Typography         Nav Links Container                              Indicator     Toggle   Rainbow CTA
```

---

## 4. Complete Drop-In CSS Specification (`styles.css`)

```css
/* ==========================================================================
   DYNAMIC ISLAND NAVIGATION BAR — APPLE LIQUID GLASSMORPHPIC ARCHITECTURE
   visionOS Specular Refraction · Concentric Geometry · Fluid Scroll Dynamics
   ========================================================================== */

/* 1. Main Navigation Wrapper */
nav {
  position: fixed;
  top: 1.25rem;
  left: 0;
  width: 100%;
  z-index: 900;
  display: flex;
  justify-content: center;
  pointer-events: none;
  transition: top 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

nav.is-scrolled {
  top: 0.85rem;
}

/* 2. Floating Liquid Glass Island */
.nav-island {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 1.15rem;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(36px) saturate(210%) contrast(104%) brightness(103%);
  -webkit-backdrop-filter: blur(36px) saturate(210%) contrast(104%) brightness(103%);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 
    inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.45),
    0 20px 48px -8px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border-radius: var(--radius-pill);
  padding: 0.38rem 0.55rem 0.38rem 1.25rem;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  isolation: isolate;
}

/* Ambient Fluid Sheen Highlight */
.nav-island::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 107, 0, 0.04) 100%);
  pointer-events: none;
  z-index: -1;
}

nav.is-scrolled .nav-island {
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 
    inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5),
    0 24px 56px -8px rgba(0, 0, 0, 0.18),
    0 6px 20px rgba(0, 0, 0, 0.06);
  transform: scale(0.985);
}

/* 3. Brand Identity */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  transition: transform 0.25s var(--ease-apple), color 0.2s ease;
  text-decoration: none;
}

.nav-brand:hover {
  transform: scale(1.02);
}

.nav-brand-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0B0B0D;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.74rem;
  font-weight: 800;
  border: 1px solid rgba(255, 107, 0, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 4. Segmented Liquid Links Container */
.nav-links-wrap {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  background: rgba(0, 0, 0, 0.035);
  padding: 0.2rem 0.3rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.nav-links-wrap a {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink-primary);
  opacity: 0.72;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-pill);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.nav-links-wrap a:hover {
  opacity: 1;
  color: var(--ink-primary);
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.nav-links-wrap a.active {
  opacity: 1;
  color: var(--apple-blue);
  background: #FFFFFF;
  font-weight: 700;
  box-shadow: inset 0 1px 1px #FFFFFF, 0 2px 8px rgba(255, 107, 0, 0.14);
}

/* 5. Live Availability Status */
.nav-status-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ink-secondary);
  background: rgba(0, 0, 0, 0.03);
  padding: 0.32rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--apple-green);
  box-shadow: 0 0 8px var(--apple-green);
  animation: pulseGreen 2s infinite;
}

@keyframes pulseGreen {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

/* 6. Audio Haptic Toggle */
.nav-audio-toggle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.035);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-secondary);
  font-size: 0.78rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.nav-audio-toggle:hover {
  background: #FFFFFF;
  color: var(--apple-blue);
  transform: scale(1.08);
  box-shadow: inset 0 1px 1px #FFFFFF, 0 4px 12px rgba(255, 107, 0, 0.18);
}

.nav-audio-toggle:active {
  transform: scale(0.94);
}

/* 7. Multi-Spectrum Rainbow Specular CTA */
.nav-cta-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #FFFFFF;
  padding: 0.52rem 1.25rem;
  border-radius: var(--radius-pill);
  font-size: 0.84rem;
  font-weight: 600;
  border: none;
  isolation: isolate;
  transition: transform 0.25s var(--ease-apple);
  z-index: 1;
  text-decoration: none;
}

.nav-cta-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #0B0B0D;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 1;
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  pointer-events: none;
}

.nav-cta-btn > span {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #FFFFFF;
}

.nav-cta-btn::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(90deg, #FF007A, #FF6B00, #FFD60A, #30D158, #00C7BE, #0071E3, #AF52DE, #FF007A);
  background-size: 300% 300%;
  opacity: 0;
  z-index: 0;
  filter: blur(6px);
  transition: opacity 0.3s ease, filter 0.3s ease;
  animation: rainbowGlowSpin 3s linear infinite;
  pointer-events: none;
}

@keyframes rainbowGlowSpin {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.nav-cta-btn:hover {
  transform: translateY(-1px) scale(1.03);
}

.nav-cta-btn:hover::before {
  opacity: 1;
  filter: blur(8px);
}

.nav-cta-btn:hover::after {
  background: #141418;
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 14px rgba(0, 0, 0, 0.35);
}

.nav-cta-btn:active {
  transform: scale(0.97);
}
```

---

## 5. JavaScript Dynamic Island Controller (`main.js`)

```javascript
// =========================================================================
// APPLE LIQUID GLASS DYNAMIC ISLAND SCROLL & INTERACTION CONTROLLER
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('nav') || document.querySelector('nav');
  if (!mainNav) return;

  const handleNavScroll = () => {
    if (window.scrollY > 24) {
      mainNav.classList.add('is-scrolled');
    } else {
      mainNav.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();
});
```
