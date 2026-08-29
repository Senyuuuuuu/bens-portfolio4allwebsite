# 📱 WORK & CASE STUDIES (PORTFOLIO.HTML) MOBILE & TABLET OPTIMIZATION MASTER PROMPT

> **Role & Directive**: You are an elite Apple Design Engineer and Senior Frontend Performance Architect specializing in mobile-first responsive design, Apple visionOS Liquid Glassmorphism, and high-density viewport optimization.

---

## 🎯 Objective
Optimize the **Selected Works & Case Studies** page (`portfolio.html`) and individual case study screens for mobile ($< 600\text{px}$) and tablet ($601\text{px} - 900\text{px}$) viewports. 
The goal is to:
1. Make the **Hero Section** compact and 100% visible above the fold without content clipping or excessive vertical spacing.
2. Reduce **Case Study Cards** from cumbersome desktop dimensions ($> 550\text{px}$ height) into sleek, compact preview modules ($~320\text{px}$ total height) allowing users to scan 2–3 projects per scroll flick.
3. Ensure Apple Liquid Glass specular highlights, active filter chips, and interactive Figma frames adapt seamlessly across all mobile screen sizes.

---

## 📐 1. Hero Section Optimization Blueprint (Mobile & Tablet)

### A. Viewport Sizing & Spacing Architecture
- **Desktop**: `padding: 8rem 0 3.5rem;`
- **Tablet ($\le 900\text{px}$)**: `padding: clamp(5.5rem, 9vh, 7rem) 0 2rem;`
- **Mobile ($\le 600\text{px}$)**: `padding: 4.8rem 0 1.5rem;`

### B. Typography & Overline Rating Pill
- **Rating / Status Pill**:
  - `font-size: 0.66rem;`
  - `padding: 0.22rem 0.65rem;`
  - `margin-bottom: 0.75rem;`
- **Headline (`.hero-title`)**:
  - `font-size: clamp(1.65rem, 6.4vw, 2.05rem);`
  - `line-height: 1.18;`
  - `letter-spacing: -0.035em;`
  - `margin-bottom: 0.65rem;`
- **Interactive Figma Lead Box**:
  - `padding: 0.75rem 0.85rem;`
  - `font-size: 0.84rem;`
  - `line-height: 1.48;`
  - Maintain draggable bounding box handle dots with non-intrusive scaling.

### C. Bento Stats Matrix Row
- Convert 4-item flex/grid into a compact $2\times 2$ grid:
  ```css
  .portfolio-stats-matrix {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 0.55rem !important;
    margin-top: 1.15rem !important;
  }
  .portfolio-stat-card {
    padding: 0.75rem 0.85rem !important;
    border-radius: 14px !important;
  }
  .portfolio-stat-val {
    font-size: 1.35rem !important;
    font-weight: 800 !important;
  }
  .portfolio-stat-label {
    font-size: 0.66rem !important;
    font-weight: 700 !important;
  }
  .portfolio-stat-sub {
    font-size: 0.58rem !important;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  ```

---

## 🃏 2. Case Study Cards Compactness Matrix

### Problem Solved
Desktop cards with `300px` media height and `2rem` (`32px`) padding create an oversized card of nearly `600px`, taking up the entire mobile viewport and fatiguing the user.

### Mobile & Tablet Solution
```css
/* Card Container */
.portfolio-card-item {
  border-radius: 18px !important;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow: 
    inset 0 1.5px 1.5px 0 #FFFFFF,
    0 14px 36px -8px rgba(0, 0, 0, 0.08);
}

/* Media Box */
.portfolio-card-media-wrap {
  height: 175px !important; /* Reduced from 300px */
  border-radius: 17px 17px 0 0 !important;
  aspect-ratio: 16 / 10;
}

/* Floating Status Tag */
.portfolio-floating-tag {
  top: 10px !important;
  right: 10px !important;
  padding: 0.2rem 0.55rem !important;
  font-size: 0.62rem !important;
  backdrop-filter: blur(14px) !important;
}

/* Content Padding */
.portfolio-card-content {
  padding: 1.1rem 0.95rem !important; /* Reduced from 2rem */
}

/* Client Title */
.portfolio-client-title {
  font-size: 1.02rem !important; /* Reduced from 1.3rem */
  line-height: 1.25 !important;
  margin-bottom: 0.35rem !important;
}

/* Card Summary Text */
.portfolio-card-summary {
  font-size: 0.8rem !important; /* Reduced from 0.9rem */
  line-height: 1.45 !important;
  margin-bottom: 0.75rem !important;
}

/* Tags & Specifications Row */
.portfolio-specs-row {
  gap: 0.35rem !important;
  padding-top: 0.65rem !important;
}

.portfolio-chip {
  font-size: 0.65rem !important;
  padding: 0.16rem 0.46rem !important;
  border-radius: 5px !important;
}
```

---

## 🔮 3. Liquid Glass Dynamic Island Navigation Blur

Ensure the navigation bar maintains high-definition Apple visionOS glass blur and optical depth across all pages:
```css
.nav-island {
  background: rgba(255, 255, 255, 0.70) !important;
  backdrop-filter: blur(48px) saturate(220%) contrast(104%) brightness(102%) !important;
  -webkit-backdrop-filter: blur(48px) saturate(220%) contrast(104%) brightness(102%) !important;
  border: 1px solid rgba(255, 255, 255, 0.88) !important;
  box-shadow: 
    inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.55),
    0 20px 48px -8px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.04) !important;
}

nav.is-scrolled .nav-island {
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(52px) saturate(230%) contrast(106%) brightness(103%) !important;
  -webkit-backdrop-filter: blur(52px) saturate(230%) contrast(106%) brightness(103%) !important;
}
```

---

## ⚡ 4. Verification Checklist
- [x] Hero headline and rating pill fully fit mobile viewports with no text overlap or horizontal scrollbars.
- [x] Bento stats matrix displays in a clean $2\times 2$ grid on mobile without truncating metrics.
- [x] Case study card image heights reduced from $300\text{px}$ to $175\text{px}$, enabling $2\text{--}3$ cards visible per scroll flick.
- [x] All card typography, padding, and specs chips scaled proportionally to mobile screen density.
- [x] Navigation bar renders with authentic $48\text{px}-52\text{px}$ optical blur and specular refraction over scrolling content.
