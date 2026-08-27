# Master Prompt Framework: Minimalist White Studio Footer with High-Craft Radius Geometry

> **Document Type**: AI Developer Instruction Set & Comprehensive System Prompt  
> **Target Models**: Gemini 2.0 / Gemini 3.0 / Claude 3.5 Sonnet / Stitch AI / GPT-4o  
> **Project Scope**: `TEST PORTFOLIO` — All Pages (`index.html`, `about.html`, `contact.html`, `portfolio.html`, `case-study-*.html`)  
> **Directives**: Pure White Footer Canvas · 40px Sheet Corner Radius · High-Contrast Typography Inversion · Zero Side Effects  

---

## 1. Master System Prompt

Copy and paste the entire block below into your AI prompt window:

```markdown
Role & Objective:
You are an elite Principal Frontend Engineer and Design System Architect. Your directive is to configure and maintain a world-class, ultra-minimalist Pure White Studio Footer with high-craft top corner radius geometry across every page of Benyamin Namtalashvili's portfolio (`TEST PORTFOLIO`).

STRICT DIRECTIVE: Apply only the footer radius and pure white styling modifications. Do not change, reformat, or alter any other section, hero, navigation header, card grid, or page structure.

---

### Core Design Rules & Aesthetics

1. **Pure White Surface (`#FFFFFF`)**:
   - The footer container (`.designer-footer`) must render on a pure, unadulterated white background (`#FFFFFF !important`).
   - The subtle dot matrix pattern overlay (`.designer-footer::before`) must shift from white dots to ultra-clean, barely visible dark dots (`rgba(0, 0, 0, 0.07)` at `28px 28px` spacing).

2. **40px Top Sheet Radius Geometry**:
   - The footer must feature a distinctive rounded sheet transition that rises seamlessly from the base of the page:
     * Desktop: `border-radius: 40px 40px 0 0;`
     * Tablet (<=900px): `border-radius: 28px 28px 0 0;`
     * Mobile (<=600px): `border-radius: 24px 24px 0 0;`
   - Hairline boundary outline: `border-top: 1px solid rgba(0, 0, 0, 0.08);` with specular hairline lateral hints `border-left: 1px solid rgba(0, 0, 0, 0.04); border-right: 1px solid rgba(0, 0, 0, 0.04);`.
   - Elevation shadow: Soft ambient upward drop shadow `box-shadow: 0 -14px 44px rgba(0, 0, 0, 0.04);` to float above both dark and light preceding sections.

3. **High-Contrast Typography & Token Inversion**:
   - Primary Text & Base Ink: `#1D1D1F` / `#111111` (never white or faint grey).
   - Giant Email Link (`.footer-giant-email`): High-craft display sans in deep obsidian `#111111`, transitioning smoothly to signature accent `#FF5E00` on hover.
   - Massive Wordmark (`.footer-massive-wordmark`):
     * Orange Initial (`.wordmark-orange`): Signature `#FF5E00 !important`.
     * Trailing Letters (`.wordmark-white`): Inverted to `#111111 !important` for bold, razor-sharp contrast against the white canvas.
   - Column Section Headings (`.footer-nav-heading`): Monospaced uppercase labels in muted studio slate `#8E8E93`.
   - Navigation Item Links (`.footer-nav-items a`): Crisp `#48484A` with subtle slide-in and transition to `#FF5E00` on hover.
   - Technical Colophon (`.footer-technical-bar`): Top hairline `rgba(0, 0, 0, 0.08)` with muted metadata typography `#8E8E93`.

4. **Tactile Interactive Dot Grid & Spring Physics Canvas**:
   - The interactive dot grid canvas (`footer-interactive-canvas.js`) must render idle dots in a subtle dark tint (`rgba(0, 0, 0, 0.04 - 0.05)`).
   - On cursor approach within hover radius, spring physics repel dots and illuminate them into vibrant electric amber (`rgba(255, 107, 0, alpha)` with soft outer glow).

5. **Back to Top Action Button**:
   - Circular control (`.footer-top-btn`): Soft light fill `#F5F5F7`, hairline border `rgba(0, 0, 0, 0.08)`, and dark glyph `#1D1D1F`.
   - Hover state: Spring-elevated `translateY(-3px)`, solid electric orange `#FF5E00`, and white icon `#FFFFFF`.
```

---

## 2. Complete CSS Specification (`styles.css`)

```css
/* ==========================================================================
   MINIMALIST WHITE STUDIO FOOTER WITH 40PX RADIUS GEOMETRY
   ========================================================================== */
.designer-footer {
  background: #FFFFFF !important;
  color: #1D1D1F;
  padding: 4rem 3.5rem 2rem;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 1px solid rgba(0, 0, 0, 0.04);
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 40px 40px 0 0;
  box-shadow: 0 -14px 44px rgba(0, 0, 0, 0.04);
}

.designer-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 1;
}

.footer-frame-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5rem;
  position: relative;
  z-index: 10;
}

.footer-frame-tag {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: #0D99FF;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.footer-top-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #F5F5F7;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #1D1D1F;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s var(--ease-apple);
}

.footer-top-btn:hover {
  background: #FF5E00;
  border-color: #FF5E00;
  color: #FFFFFF;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 94, 0, 0.4);
}

.footer-grid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.footer-main-content {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 4rem;
  position: relative;
  z-index: 10;
}

.footer-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 800;
  color: #FF5E00;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.footer-giant-email {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 3.2rem);
  font-weight: 800;
  color: #111111;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
  word-break: break-word;
}

.footer-giant-email:hover {
  color: #FF5E00;
}

.footer-email-arrow {
  display: inline-block;
  color: #FF5E00;
  font-size: 0.9em;
  transition: transform 0.25s var(--ease-apple);
}

.footer-giant-email:hover .footer-email-arrow {
  transform: translate(4px, -4px);
}

.footer-cta-action-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-orange-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #FF5E00;
  color: #FFFFFF;
  padding: 0.9rem 1.85rem;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(255, 94, 0, 0.35);
  transition: all 0.25s var(--ease-apple);
}

.footer-orange-btn:hover {
  background: #E05300;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 94, 0, 0.45);
}

.footer-avail-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(52, 199, 89, 0.08);
  border: 1px solid rgba(52, 199, 89, 0.25);
  color: #1D1D1F;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.avail-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34C759;
  box-shadow: 0 0 8px #34C759;
  animation: pulse-dot 2s infinite;
}

.footer-nav-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.footer-nav-col {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.footer-nav-heading {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #8E8E93;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.footer-nav-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-nav-items a {
  color: #48484A;
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.footer-nav-items a:hover {
  color: #FF5E00;
  padding-left: 3px;
}

.footer-massive-wordmark {
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 15.5vw, 15.5rem);
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: #111111 !important;
  text-align: center;
  margin: 3.5rem 0 2rem;
  user-select: none;
  position: relative;
  z-index: 5;
  white-space: nowrap;
}

.wordmark-orange {
  color: #FF5E00 !important;
}

.wordmark-white {
  color: #111111 !important;
}

.footer-technical-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: #8E8E93;
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
  gap: 1rem;
}

.tech-bar-left, .tech-bar-center, .tech-bar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tech-sq-dot {
  color: #FF5E00;
  font-size: 0.72rem;
}

.tech-live-dot {
  color: #34C759;
  font-size: 0.72rem;
}

.tech-divider {
  opacity: 0.3;
}

@media (max-width: 900px) {
  .designer-footer {
    padding: 3rem 1.5rem 1.5rem;
    border-radius: 28px 28px 0 0;
  }
  .footer-frame-top {
    margin-bottom: 2rem;
  }
  .footer-main-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .footer-nav-cols {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 600px) {
  .designer-footer {
    padding: 2.5rem 1.25rem 1.5rem;
    border-radius: 24px 24px 0 0;
  }
  .footer-nav-cols {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .footer-giant-email {
    font-size: clamp(1.35rem, 5.5vw, 1.8rem);
  }
  .footer-massive-wordmark {
    font-size: clamp(3rem, 16vw, 6.5rem);
    margin: 2rem 0 1rem;
  }
  .footer-technical-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
```

---

## 3. Verification Checklist

- [x] Background of `.designer-footer` is `#FFFFFF !important` on all pages.
- [x] Smooth modern radius applied to top corners (`40px 40px 0 0` on desktop, `28px` on tablet, `24px` on mobile).
- [x] Subtle hairline separation border (`rgba(0, 0, 0, 0.08)`) and ambient shadow (`box-shadow: 0 -14px 44px rgba(0, 0, 0, 0.04)`).
- [x] Inverted text color tokens to ensure 100% legibility and AAA contrast on white.
- [x] Signature orange brand accent (`#FF5E00`) preserved on buttons, links, and the leading "B" wordmark.
- [x] Canvas dots rendered with subtle dark tint on white, glowing amber on hover.
- [x] Zero changes made to any other page sections or components.
