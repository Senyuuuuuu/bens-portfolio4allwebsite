/**
 * BENYAMIN NAMTALASHVILI — DRAGGABLE BENTO CARDS & CAPABILITY PILLS
 * Powered by GSAP & GSAP Draggable
 * - Free 2D dragging for all Bento Grid cards & capability pills
 * - Zero-lag, 60fps tracking with elastic spring-back physics to origin
 * - Nested drag isolation: Inner pills & interactive elements do not conflict with card drag
 * - Touch-safe: Disabled on mobile/touch screens to ensure 100% smooth page scrolling
 */

(function () {
  'use strict';

  let draggableInstances = [];

  function killDraggables() {
    draggableInstances.forEach(instance => {
      if (instance && instance.kill) instance.kill();
    });
    draggableInstances = [];
  }

  function initDraggableCapabilities() {
    if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;

    killDraggables();

    // Check device type: only enable tactile physics on desktop non-touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia('(pointer: coarse)').matches);
    const isSmallScreen = window.innerWidth < 992;

    if (isTouchDevice || isSmallScreen) {
      document.querySelectorAll('.bento-card, .bento-pill-item, .stack-mini-pill').forEach(el => {
        el.style.touchAction = 'pan-y';
        el.style.cursor = 'default';
        el.style.userSelect = 'auto';
        gsap.set(el, { clearProps: "all" });
      });
      return;
    }

    gsap.registerPlugin(Draggable);

    // 1. Draggable Inner Pills (UI/UX, Full-Stack, n8n, AI Agents, etc.)
    const pills = document.querySelectorAll('.bento-pill-item, .stack-mini-pill');
    pills.forEach(pill => {
      // Prevent parent card drag from hijacking pill clicks
      pill.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });

      const pillDraggable = Draggable.create(pill, {
        type: "x,y",
        edgeResistance: 0.3,
        zIndexBoost: true,
        allowEventDefault: false,
        onPress: function () {
          pill.classList.add('is-dragging');
          gsap.killTweensOf(pill);
          gsap.to(pill, {
            scale: 1.1,
            boxShadow: "0 16px 36px rgba(255, 94, 0, 0.38)",
            borderColor: "#FF5E00",
            duration: 0.15,
            ease: "power2.out"
          });
        },
        onDragEnd: function () {
          const self = this;
          gsap.to(pill, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            borderColor: "",
            duration: 0.65,
            ease: "elastic.out(1, 0.4)",
            onUpdate: function () {
              self.update();
            },
            onComplete: function () {
              pill.classList.remove('is-dragging');
              gsap.set(pill, { clearProps: "scale,boxShadow,borderColor,zIndex" });
              self.update();
            }
          });
        }
      })[0];

      if (pillDraggable) draggableInstances.push(pillDraggable);
    });

    // 2. Draggable Bento Grid Cards (Whole Bento Boxes)
    const bentoCards = document.querySelectorAll('.capabilities-bento-grid .bento-card');
    bentoCards.forEach(card => {
      // Ignore drags that originate on interactive elements inside the card
      const cardDraggable = Draggable.create(card, {
        type: "x,y",
        edgeResistance: 0.35,
        zIndexBoost: true,
        dragClickables: false,
        cancel: ".bento-pill-item, .stack-mini-pill, a, button, input, textarea, .bento-live-stage, .bento-author-avatar, .live-interactive",
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
          const self = this;
          gsap.to(card, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "0 12px 32px rgba(0, 40, 80, 0.06)",
            duration: 0.7,
            ease: "elastic.out(1, 0.45)",
            onUpdate: function () {
              self.update();
            },
            onComplete: function () {
              card.classList.remove('is-dragging');
              gsap.set(card, { clearProps: "zIndex" });
              self.update();
            }
          });
        }
      })[0];

      if (cardDraggable) draggableInstances.push(cardDraggable);

      // Subtle desktop hover lift via GSAP (so CSS transform never fights GSAP Draggable)
      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('is-dragging')) {
          gsap.to(card, { y: -4, duration: 0.25, ease: "power2.out" });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('is-dragging')) {
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        }
      });
    });
  }

  // Handle window resize dynamically
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initDraggableCapabilities, 250);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDraggableCapabilities);
  } else {
    initDraggableCapabilities();
  }
})();
