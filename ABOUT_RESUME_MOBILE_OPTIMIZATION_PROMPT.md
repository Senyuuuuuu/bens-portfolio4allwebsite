# 📱 ABOUT & RESUME (ABOUT.HTML) MOBILE & TABLET OPTIMIZATION MASTER PROMPT

> **Role & Directive**: You are an elite Apple Frontend Engineer and UX Architect specializing in responsive typography, liquid glassmorphism, and high-density mobile layout optimization.

---

## 🎯 Objective
Transform the **About & Resume** page (`about.html`) into a responsive, compact, and scannable interface on **mobile devices ($< 640\text{px}$)** and **tablets ($641\text{px} - 1024\text{px}$)**.

---

## 📐 1. Responsive Architecture & Grid Refactoring

### A. Two-Column to Single-Column Fluid Switch
- **Desktop**: Split-screen grid `grid-template-columns: 1fr 1.35fr; gap: 3.5rem;` with a sticky left profile sidebar (`position: sticky; top: 6.5rem;`).
- **Tablet ($\le 992\text{px}$)**: Fluid $1$-column stack `grid-template-columns: 1fr; gap: 2.2rem;` with static sidebar positioning (`position: static; width: 100%;`).
- **Mobile ($\le 640\text{px}$)**: Tightened $1$-column flow `gap: 1.5rem;` for immediate accessibility.

### B. Profile & Bio Card Compactness
- **Avatar**: Scaled down to $58\text{px}\times 58\text{px}$ on mobile ($76\text{px}$ on desktop).
- **Typography**: Bio title scaled to $1.25\text{rem}$ with reduced vertical margins.
- **Details List**: Spacing compressed to `gap: 0.65rem;` with `0.80rem` typography.
- **Modeling Button**: Full-width liquid glass action button with camera icon and external link badge.

---

## 🛠️ 2. Technical Competencies Figma Cards
- **Card Substrate**: Translucent pearl glass (`rgba(255, 255, 255, 0.78)` with `backdrop-filter: blur(32px)`).
- **Mobile Padding**: Reduced from `2.4rem` to `1.25rem 1.1rem` with $18\text{px}$ rounded corners.
- **Card Header**: Responsive flex wrap with subtitle tags (`99.4% Reliability`, `Sub-100ms API`, `TESDA NC III Standard`).
- **Skills Chips Grid**: Micro-pill chips (`font-size: 0.68rem; padding: 0.2rem 0.52rem;`) ensuring all technologies wrap cleanly without horizontal overflow.

---

## 💼 3. Career Timeline 3-Column to 1-Column Responsive Shift
- **Desktop**: $3$-column horizontal timeline `grid-template-columns: repeat(3, 1fr); gap: 2.2rem;`.
- **Tablet & Mobile**: Single-column vertical timeline `grid-template-columns: 1fr; gap: 1.4rem;`.
- **Experience Cards (`.career-card`)**:
  - Distinct $2\text{px}$ Apple Blue top border indicator.
  - Scaled dates (`1.2rem` tabular numerals).
  - Scaled role titles (`0.98rem`) and condensed bullet list padding.

---

## ⚡ 4. Verification Checklist
- [x] Hero headline and rating pill fully fit mobile viewports with zero text clipping.
- [x] Bento stats matrix adapts to a compact $2\times 2$ grid on mobile.
- [x] Profile sidebar transforms from sticky desktop card to static full-width mobile card.
- [x] Technical competencies cards and skill chips wrap without overflowing bounds.
- [x] 3-column career timeline collapses into a vertical sequential timeline on mobile and tablet.
