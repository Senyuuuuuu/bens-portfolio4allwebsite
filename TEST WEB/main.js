/**
 * REELIN TALENT AGENCY — MOTION & INTERACTION ENGINE
 * Engine: Lenis Virtual Scroll + GSAP 3 + ScrollTrigger + Draggable + Inertia
 */

(function () {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    initLenisScroll();
    initStickyNavbar();
    initHeroParallaxAndFloatingIcons();
    initScrollTriggerReveals();
    initAcademyParallaxCollage();
    initDraggablePhotoCanvas();
    initLiveClock();
  });

  // =========================================================================
  // 1. LENIS SMOOTH VIRTUAL SCROLLING
  // =========================================================================
  function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // =========================================================================
  // 2. STICKY FLOATING PILL NAVBAR
  // =========================================================================
  function initStickyNavbar() {
    const navbar = document.getElementById('stickyNavbar');
    const hero = document.getElementById('hero');

    if (!navbar || !hero || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 40%',
      onEnter: () => navbar.classList.add('is-visible'),
      onLeaveBack: () => navbar.classList.remove('is-visible'),
    });
  }

  // =========================================================================
  // 3. HERO FLOATING SOFTWARE BADGES & PARALLAX
  // =========================================================================
  function initHeroParallaxAndFloatingIcons() {
    if (typeof gsap === 'undefined') return;

    const badges = document.querySelectorAll('.floating-badge');
    
    // Animation 1: Continuous gentle floating oscillation
    badges.forEach((badge, index) => {
      const duration = 3.2 + (index * 0.45) % 2.5;
      const yDelta = 14 + (index * 4) % 10;
      const rotDelta = -4 + (index * 3) % 8;

      gsap.to(badge, {
        y: `-=${yDelta}`,
        rotation: rotDelta,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2,
      });

      // Animation 2: Parallax scroll upwards on page scroll
      if (typeof ScrollTrigger !== 'undefined') {
        const speed = parseFloat(badge.getAttribute('data-speed')) || 0.4;
        gsap.to(badge, {
          yPercent: -(speed * 70),
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    });

    // Hero content entrance reveal
    const heroElements = document.querySelectorAll('.gsap-hero-reveal');
    if (heroElements.length > 0) {
      gsap.from(heroElements, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.15,
      });
    }
  }

  // =========================================================================
  // 4. GLOBAL SCROLL REVEALS (15% Viewport Threshold)
  // =========================================================================
  function initScrollTriggerReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const revealItems = document.querySelectorAll('.gsap-reveal');

    revealItems.forEach((item) => {
      gsap.from(item, {
        y: 45,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }

  // =========================================================================
  // 5. CREATIVE ACADEMY MOUSE-MOVE PARALLAX COLLAGE
  // =========================================================================
  function initAcademyParallaxCollage() {
    const stage = document.getElementById('academyCollageStage');
    if (!stage || typeof gsap === 'undefined') return;

    const cards = stage.querySelectorAll('.collage-photo-card');

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card) => {
        const factor = parseFloat(card.getAttribute('data-parallax')) || 15;
        gsap.to(card, {
          x: relX * factor,
          y: relY * factor,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });

    stage.addEventListener('mouseleave', () => {
      cards.forEach((card) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      });
    });
  }

  // =========================================================================
  // 6. 2D INTERACTIVE DRAGGABLE PHOTO GRID ("A REAL TEAM...")
  // =========================================================================
  function initDraggablePhotoCanvas() {
    const viewport = document.getElementById('draggableCanvasViewport');
    const grid = document.getElementById('draggableCanvasGrid');

    if (!viewport || !grid || typeof Draggable === 'undefined') return;

    // Register Draggable & Inertia
    gsap.registerPlugin(Draggable);
    if (typeof InertiaPlugin !== 'undefined') {
      gsap.registerPlugin(InertiaPlugin);
    }

    let draggableInstance = null;

    function calculateBounds() {
      const vWidth = viewport.offsetWidth;
      const vHeight = viewport.offsetHeight;
      const gWidth = grid.offsetWidth;
      const gHeight = grid.offsetHeight;

      const minX = Math.min(0, vWidth - gWidth);
      const minY = Math.min(0, vHeight - gHeight);

      return {
        minX: minX,
        maxX: 0,
        minY: minY,
        maxY: 0
      };
    }

    const bounds = calculateBounds();

    // Center grid initially inside viewport
    const initialX = Math.max(bounds.minX, (viewport.offsetWidth - grid.offsetWidth) / 2);
    const initialY = Math.max(bounds.minY, (viewport.offsetHeight - grid.offsetHeight) / 2);
    gsap.set(grid, { x: initialX, y: initialY });

    const hasInertia = typeof InertiaPlugin !== 'undefined';

    draggableInstance = Draggable.create(grid, {
      type: 'x,y',
      bounds: viewport,
      inertia: hasInertia,
      edgeResistance: 0.75,
      dragResistance: 0.05,
      allowNativeTouchScrolling: false,
      onPressInit: function () {
        viewport.style.cursor = 'grabbing';
      },
      onRelease: function () {
        viewport.style.cursor = 'grab';
      }
    })[0];

    window.addEventListener('resize', () => {
      if (draggableInstance) {
        draggableInstance.applyBounds(viewport);
      }
    });
  }

  // =========================================================================
  // 7. LIVE MANILA (PHT) CLOCK
  // =========================================================================
  function initLiveClock() {
    const clockEl = document.getElementById('manilaClock');
    if (!clockEl) return;

    function updateClock() {
      const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockEl.textContent = `${formatter.format(new Date())} PHT (GMT+8)`;
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

})();
