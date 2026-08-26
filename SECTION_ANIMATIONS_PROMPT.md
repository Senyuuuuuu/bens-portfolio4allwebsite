# Master Prompt Framework: Section-by-Section Smooth Animations & Video Showcase

> **Document Type**: AI Developer Instruction Set & Animation System Prompt  
> **Target Models**: Gemini 2.0 / Claude 3.5 Sonnet / Stitch AI / GPT-4o  
> **Frameworks**: GSAP 3 · ScrollTrigger · Apple Spring Physics · Native HTML5 Video  

---

## 1. Master Animation & Video System Prompt

Copy and paste the prompt below to generate or maintain buttery-smooth animations across all sections:

```markdown
Role & Objective:
You are an expert Creative Motion Designer and Senior Frontend Technologist. Your directive is to implement high-end, Apple-grade 120fps GSAP 3 & ScrollTrigger animations across every section of Benyamin Namtalashvili's portfolio, and embed a responsive video showcase inside the Hero Titanium Bezel stage.

---

### Core Section Animation Blueprint

1. **Seamless Geometric Curtain Preloader**:
   - Initial State: Full-screen pure black (#000000) overlay covering viewport.
   - Reveal Animation: Curtain lifts upward (gsap.to('#pageCurtain', { yPercent: -100, duration: 1.05, ease: 'expo.inOut' })).
   - Page Exit Animation: Clicking any internal navigation link triggers the curtain to slide back down (yPercent: 0) before navigating.

2. **Hero Section Choreography**:
   - Headline: SplitText word masking with bottom clipping (y: '120%' -> '0%', stagger: 0.06s, ease: 'power4.out').
   - Subhead pill, lead paragraph, and CTA pills cascade in with spring physics (stagger: 0.1s).
   - Device Bezel Stage: Scales in (scale: 0.92 -> 1.0, duration: 1.0s, ease: 'power3.out').
   - Floating Badges: Continuous subtle sine floating motion (y: '+=6px', yoyo: true, repeat: -1).

3. **Hero Video Stage Integration (`FIVER AD FINAL.mp4`)**:
   - Embed high-resolution native video player inside the titanium bezel stage with:
     * `autoplay loop muted playsinline`
     * `border-radius: 16px` matching outer bezel inner radius
     * Frosted glass Live Badge overlay (`✦ AI AUTOMATION DEMO // Live 60 FPS`) with pulsing red status dot.
     * Tab switcher for interactive mode toggling (`01. n8n Automation`, `02. Full-Stack Stack`, `03. Graphic Design`).

4. **Tech Stack Marquee Section**:
   - Infinite horizontal continuous ticker roll with smooth linear acceleration.

5. **Featured Case Studies (Museum Tiles)**:
   - Scroll-triggered card cascade: `y: 55px`, `opacity: 0` -> `y: 0`, `opacity: 1` as each card hits 85% of the viewport (`power3.out`, duration: 0.8s).
   - 3D Magnetic Card Hover: Cards lift (`y: -8px`) with expanded product shadow and inner media zoom (`scale: 1.05`).

6. **Interactive Skills Lab**:
   - Staggered card entrance (`stagger: 0.14s`).
   - Dynamic Island state machine with smooth pill resizing spring transitions.
   - Live Apple Spring Physics Calibrator with elastic bounce trigger (`elastic.out(1.2, 0.4)`).
   - Specular Glass illumination dynamically calculating cursor X/Y coordinates.

7. **Engineering & Design Ethos (Manifesto)**:
   - Dark section reveal on 85% viewport scroll.
   - Pillar items slide in from left (`x: -30px -> 0px`, `stagger: 0.16s`, `ease: power3.out`).

8. **Subpages (`about.html`, `portfolio.html`, `services.html`, `contact.html`)**:
   - All timelines, pricing tiers, and contact form cards trigger subtle, unified ScrollTrigger reveals.
   - Scale on Press: All buttons provide tactile `scale(0.96)` feedback on active click.
```
