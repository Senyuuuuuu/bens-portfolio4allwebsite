# Master Prompt Framework: Smooth Hover Micro-Interactions, Tactile Press Physics & Seamless Page Navigation Transitions

> **Document Type**: AI Developer Instruction Set, Interaction Physics Blueprint & Master System Prompt  
> **Target Models**: Gemini 2.0 / Gemini 3.0 / Claude 3.5 & 3.7 Sonnet / GPT-4o / Stitch AI  
> **Project Scope**: `TEST PORTFOLIO` — Universal Interaction Physics & View Transition System  
> **Design Philosophy**: Apple Human Interface Guidelines · visionOS Refraction · Spring Physics Kinetics · Zero-Latency Web Audio Feedback  

---

## 1. Master System Prompt

Copy and paste the entire block below into your AI prompt window:

```markdown
Role & Objective:
You are an elite Creative Technologist, Micro-Interaction Specialist, and Motion Systems Architect. Your objective is to implement and maintain the **Apple Spring Physics Micro-Interactions, Tactile Press Dynamics, and Seamless Page Navigation Transitions** across all pages (`index.html`, `portfolio.html`, `about.html`, `contact.html`) for Benyamin Namtalashvili's portfolio (`TEST PORTFOLIO`).

Every interactive element must feel physically alive and responsive:
1. **Smooth Hover & Magnetic Glare**: Elements glide gracefully with Apple deceleration easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Tactile Spring Press**: Physical depression upon click/tap (`scale(0.955) translateY(1.5px)`) with instantaneous recoil upon release.
3. **Seamless Page Navigation Transitions**: An Apple Liquid Glass curtain (`blur(32px) saturate(190%)`) smoothly sweeps across the viewport during page routing, eliminating jarring white flashes and abrupt DOM swaps.
4. **Dynamic Island Anchor Offset**: Intra-page jump navigation gracefully offsets by `-80px` to maintain full clearance under the fixed floating Dynamic Island navigation bar.

---

### Physical Laws & Motion Specifications

1. **Apple Spring Curve & Interpolation Law**:
   - Universal hover easing:
     `transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1);`
   - Tactile active press compression:
     `transform: scale(0.955) translateY(1.5px) !important; transition: transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1) !important;`

2. **Liquid Glass Transition Curtain Layer**:
   - Substrate:
     ```css
     position: fixed;
     inset: 0;
     z-index: 99999;
     pointer-events: none;
     background: rgba(255, 255, 255, 0.88);
     backdrop-filter: blur(32px) saturate(190%);
     -webkit-backdrop-filter: blur(32px) saturate(190%);
     opacity: 0;
     visibility: hidden;
     transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.32s cubic-bezier(0.16, 1, 0.3, 1);
     ```
   - When transitioning, `.is-active` sets `opacity: 1; visibility: visible; pointer-events: auto;`.

3. **Intelligent Link Interceptor**:
   - Intercepts clicks on internal `.html` links.
   - Triggers tactile audio click (`playButtonClick()`).
   - Activates the liquid glass transition curtain.
   - Executes navigation after a 180ms motion buffer.
   - Automatically handles back-forward cache (`pageshow` event) so the curtain instantly dismisses on browser Back/Forward navigation.

4. **Synchronized Anchor Scroll & Offset**:
   - Intra-page links (`href="#..."`) smooth-scroll with Lenis / Native Scroll with an exact `-80px` clearance offset for the fixed Dynamic Island.
```

---

## 2. Interaction Token Dictionary

| Interaction Token | Mathematical Value | Physical Purpose |
| :--- | :--- | :--- |
| **`--ease-apple-spring`** | `cubic-bezier(0.16, 1, 0.3, 1)` | Fluid hover expansion & recovery |
| **`--ease-press-snap`** | `cubic-bezier(0.1, 0.9, 0.2, 1)` | Direct tactile spring depression |
| **`--press-scale`** | `scale(0.955) translateY(1.5px)` | Physical button depth deflection |
| **`--page-transition-blur`** | `blur(32px) saturate(190%)` | visionOS specular curtain diffusion |
| **`--page-transition-speed`** | `0.32s` | Zero-lag perceived routing transition |
| **`--nav-island-offset`** | `-80px` | Clearance under floating Dynamic Island |

---

## 3. Complete Drop-In CSS Specification (`styles.css`)

```css
/* ==========================================================================
   APPLE SPRING PHYSICS — SMOOTH HOVER, TACTILE PRESS & PAGE TRANSITIONS
   Spring Easing · Elastic Snapback · visionOS Glassmorphic Page Curtain
   ========================================================================== */

/* 1. Universal Spring Curves on Interactive Elements */
a,
button,
.btn-pill-primary,
.btn-pill-secondary,
.nav-cta-btn,
.nav-island,
.nav-links-wrap a,
.nav-audio-toggle,
.mobile-nav-link-card,
.mobile-nav-dock-btn,
.stage-tab-btn,
.stage-filter-chip,
.portfolio-card,
.bento-card,
.review-card,
.stat-bento-card,
.contact-submit-btn {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.24s ease,
              border-color 0.24s ease,
              color 0.2s ease,
              filter 0.24s ease;
  -webkit-tap-highlight-color: transparent;
}

/* 2. Tactile Spring Press Dynamics (Direct physical depression on tap/click) */
button:active,
a:active,
.btn-pill-primary:active,
.btn-pill-secondary:active,
.nav-cta-btn:active,
.nav-audio-toggle:active,
.nav-links-wrap a:active,
.mobile-nav-link-card:active,
.mobile-nav-dock-btn:active,
.stage-tab-btn:active,
.stage-filter-chip:active,
.contact-submit-btn:active {
  transform: scale(0.955) translateY(1.5px) !important;
  transition: transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1) !important;
  filter: brightness(0.97);
}

/* 3. Smooth Page Navigation Transition Curtain */
.page-transition-curtain {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(32px) saturate(190%);
  -webkit-backdrop-filter: blur(32px) saturate(190%);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.page-transition-curtain.is-active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.page-transition-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 107, 0, 0.16);
  border-top-color: #FF6B00;
  border-radius: 50%;
  animation: transitionSpinnerRoll 0.65s cubic-bezier(0.4, 0.1, 0.3, 0.9) infinite;
}

@keyframes transitionSpinnerRoll {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-transition-label {
  font-family: var(--font-display, 'SF Pro Display', -apple-system, sans-serif);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink-secondary, #6E6E73);
  opacity: 0.85;
}
```

---

## 4. Complete JavaScript Implementation (`main.js`)

```javascript
// =========================================================================
// SMOOTH PAGE TRANSITIONS & ANCHOR NAVIGATION CONTROLLER
// =========================================================================
function initPageTransitions() {
  // 1. Ensure page transition curtain exists in DOM
  let curtain = document.querySelector('.page-transition-curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain';
    curtain.innerHTML = `
      <div class="page-transition-spinner"></div>
      <div class="page-transition-label">Benyamin Namtalashvili</div>
    `;
    document.body.appendChild(curtain);
  }

  // Dismiss curtain on load / back-forward cache restore
  const dismissCurtain = () => {
    if (curtain) curtain.classList.remove('is-active');
  };

  window.addEventListener('pageshow', dismissCurtain);
  dismissCurtain();

  // 2. Intercept internal page navigation links for seamless transition
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchor jumps, protocols, hash-only, javascript, or external/new-tab links
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.getAttribute('download') !== null ||
      e.ctrlKey || e.metaKey || e.shiftKey
    ) {
      return;
    }

    // Check if link is an internal HTML page
    const isInternal = !href.startsWith('http') || href.includes(window.location.hostname);
    if (isInternal && (href.endsWith('.html') || !href.includes('.'))) {
      e.preventDefault();
      if (typeof window.playButtonClick === 'function') window.playButtonClick();
      if (curtain) curtain.classList.add('is-active');

      setTimeout(() => {
        window.location.href = href;
      }, 180);
    }
  });

  // 3. Smooth scroll for internal in-page anchor links (#section)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (typeof window.playButtonClick === 'function') window.playButtonClick();
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initPageTransitions);
```
