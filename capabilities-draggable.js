/**
 * BENYAMIN NAMTALASHVILI — DRAGGABLE BENTO CARDS & CAPABILITY PILLS
 * Powered by GSAP & GSAP Draggable
 * - Free 2D dragging for all Bento Grid cards & capability pills
 * - Elastic spring-back physics to original anchor position on release
 * - Maintains custom orange vector cursor throughout
 * - DISABLED on mobile/touch devices (< 900px or any touch device)
 */

(function () {
  'use strict';

  function initDraggableCapabilities() {
    if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;

    // Strictly disable ALL dragging on mobile / touch devices or screens <= 900px
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia('(pointer: coarse)').matches);
    const isSmallScreen = window.innerWidth <= 900;
    if (isTouchDevice || isSmallScreen) {
      // Ensure cards are non-draggable and smooth scrolling is completely uninhibited
      document.querySelectorAll('.bento-card, .bento-pill-item, .stack-mini-pill').forEach(el => {
        el.style.touchAction = 'auto';
        el.style.cursor = 'default';
        el.style.userSelect = 'auto';
      });
      return;
    }

    gsap.registerPlugin(Draggable);

    // 1. Draggable Inner Pills (UI/UX, Full-Stack, etc.)
    const pills = document.querySelectorAll('.bento-pill-item, .stack-mini-pill');
    pills.forEach(pill => {
      pill.addEventListener('pointerdown', (e) => { e.stopPropagation(); });

      Draggable.create(pill, {
        type: "x,y",
        edgeResistance: 0.2,
        zIndexBoost: true,
        onPress: function () {
          pill.classList.add('is-dragging');
          gsap.killTweensOf(pill);
          gsap.to(pill, {
            scale: 1.1,
            boxShadow: "0 16px 36px rgba(255, 94, 0, 0.35)",
            borderColor: "#FF5E00",
            duration: 0.15,
            ease: "power2.out"
          });
        },
        onDragEnd: function () {
          pill.classList.remove('is-dragging');
          gsap.to(pill, {
            x: 0, y: 0, scale: 1,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            borderColor: "",
            duration: 0.75,
            ease: "elastic.out(1, 0.4)",
            clearProps: "scale,boxShadow,borderColor,zIndex"
          });
        }
      });
    });

    // 2. Draggable Bento Grid Cards (Whole Cards)
    const bentoCards = document.querySelectorAll('.capabilities-bento-grid .bento-card');
    bentoCards.forEach(card => {
      Draggable.create(card, {
        type: "x,y",
        edgeResistance: 0.25,
        zIndexBoost: true,
        onPress: function () {
          card.classList.add('is-dragging');
          gsap.killTweensOf(card);
          gsap.to(card, {
            scale: 1.025,
            boxShadow: "0 28px 60px rgba(0, 40, 80, 0.18), 0 8px 24px rgba(255, 94, 0, 0.25)",
            duration: 0.15,
            ease: "power2.out"
          });
        },
        onDragEnd: function () {
          card.classList.remove('is-dragging');
          gsap.to(card, {
            x: 0, y: 0, scale: 1,
            boxShadow: "0 12px 32px rgba(0, 40, 80, 0.06)",
            duration: 0.85,
            ease: "elastic.out(1, 0.45)",
            clearProps: "scale,boxShadow,zIndex"
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDraggableCapabilities);
  } else {
    initDraggableCapabilities();
  }
})();
