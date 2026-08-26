/**
 * BENYAMIN NAMTALASHVILI — APPLE FLUID INFINITE CAROUSEL ENGINE
 * Principles: Apple Fluid Interfaces (WWDC), 3D Perspective Tilt, Zero-Latency Momentum
 * Features: Native aspect-ratio support, Infinite Wrap, Interruptible Velocity Handoff
 */

(function () {
  'use strict';

  function initAppleFluidCarousel() {
    const viewport = document.getElementById('featuredCarouselViewport');
    const track = document.getElementById('featuredCarouselTrack');
    const cursorBadge = document.getElementById('dragCursorBadge');

    if (!viewport || !track) return;

    const cards = Array.from(track.querySelectorAll('.featured-card'));
    if (cards.length === 0) return;

    // Clone cards once to guarantee seamless infinite wrapping buffer
    const cardCount = cards.length;
    for (let i = 0; i < cardCount; i++) {
      const clone = cards[i].cloneNode(true);
      clone.setAttribute('data-clone', 'true');
      track.appendChild(clone);
    }

    const allCards = Array.from(track.querySelectorAll('.featured-card'));
    let totalTrackWidth = 0;
    let singleSetWidth = 0;

    function calculateDimensions() {
      const gap = parseFloat(window.getComputedStyle(track).gap) || 32;
      let setW = 0;
      for (let i = 0; i < cardCount; i++) {
        setW += cards[i].offsetWidth + gap;
      }
      singleSetWidth = setW;
      totalTrackWidth = setW * 2;
    }

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);

    // =========================================================================
    // STATE & PHYSICS CONSTANTS
    // =========================================================================
    let currentX = 0;
    let targetX = 0;
    let isDragging = false;
    let pointerStartX = 0;
    let dragStartX = 0;
    let velocity = 0;
    let lastPointerX = 0;
    let lastTimestamp = 0;
    let isHovered = false;
    let autoGlideSpeed = -0.45; // Subtle auto-drift when idle

    // History buffer for velocity smoothing
    const historyLength = 5;
    const posHistory = [];
    const timeHistory = [];

    // =========================================================================
    // CUSTOM CURSOR TRACKING (APPLE GLASS BADGE)
    // =========================================================================
    if (cursorBadge) {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;

      if (!isTouch && typeof gsap !== 'undefined') {
        const xTo = gsap.quickTo(cursorBadge, "x", { duration: 0.12, ease: "power3.out" });
        const yTo = gsap.quickTo(cursorBadge, "y", { duration: 0.12, ease: "power3.out" });

        viewport.addEventListener('mouseenter', () => {
          isHovered = true;
          cursorBadge.classList.add('is-active');
        });

        viewport.addEventListener('mouseleave', () => {
          if (!isDragging) {
            isHovered = false;
            cursorBadge.classList.remove('is-active', 'is-pressed');
          }
        });

        window.addEventListener('mousemove', (e) => {
          xTo(e.clientX);
          yTo(e.clientY);
        });

        viewport.addEventListener('mousedown', () => {
          cursorBadge.classList.add('is-pressed');
        });

        window.addEventListener('mouseup', () => {
          cursorBadge.classList.remove('is-pressed');
          if (!isHovered) {
            cursorBadge.classList.remove('is-active');
          }
        });
      }
    }

    // =========================================================================
    // POINTER EVENTS (ZERO LATENCY & FULL INTERRUPTIBILITY)
    // =========================================================================
    viewport.addEventListener('pointerdown', (e) => {
      // Respect right clicks
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      isDragging = true;
      isHovered = true;
      pointerStartX = e.clientX;
      dragStartX = targetX;
      lastPointerX = e.clientX;
      lastTimestamp = performance.now();
      velocity = 0;

      posHistory.length = 0;
      timeHistory.length = 0;
      posHistory.push(e.clientX);
      timeHistory.push(lastTimestamp);

      // Kill active momentum instantly on grab (interruptibility)
      targetX = currentX;

      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const now = performance.now();
      const deltaX = e.clientX - pointerStartX;
      targetX = dragStartX + deltaX;

      // Track rolling history for velocity projection
      posHistory.push(e.clientX);
      timeHistory.push(now);
      if (posHistory.length > historyLength) {
        posHistory.shift();
        timeHistory.shift();
      }

      lastPointerX = e.clientX;
      lastTimestamp = now;
    });

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;

      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // Calculate release velocity using weighted history
      if (posHistory.length >= 2) {
        const firstPos = posHistory[0];
        const lastPos = posHistory[posHistory.length - 1];
        const firstTime = timeHistory[0];
        const lastTime = timeHistory[timeHistory.length - 1];
        const dt = (lastTime - firstTime) || 16;
        velocity = (lastPos - firstPos) / dt; // px per millisecond
      } else {
        velocity = 0;
      }

      // Apple momentum projection (WWDC Designing Fluid Interfaces exponential decay)
      // project(v) = (v / 1000) * (decel / (1 - decel))
      if (Math.abs(velocity) > 0.08) {
        const momentumThrow = velocity * 420;
        targetX += momentumThrow;
      }
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // Prevent any drag gestures from triggering unintended clicks
    track.addEventListener('click', (e) => {
      if (Math.abs(currentX - dragStartX) > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // =========================================================================
    // 60FPS FLUID TICKER WITH 3D TACTILE PERSPECTIVE (VIEWPORT OPTIMIZED)
    // =========================================================================
    let lastFrameTime = performance.now();
    let isCarouselVisible = false;
    let carouselRafId = null;
    let lastTiltAngle = 0;

    function renderLoop(now) {
      const dt = Math.min(32, now - lastFrameTime);
      lastFrameTime = now;

      if (!isDragging && !isHovered) {
        // Auto-glide drift when idle
        targetX += autoGlideSpeed * (dt / 16.67);
      }

      // Smooth Spring Lerp Interpolation
      const lerpFactor = isDragging ? 0.22 : 0.085;
      currentX += (targetX - currentX) * lerpFactor;

      // Infinite Wrap Math (Modulo without seam)
      if (singleSetWidth > 0) {
        while (currentX <= -singleSetWidth) {
          currentX += singleSetWidth;
          targetX += singleSetWidth;
        }
        while (currentX > 0) {
          currentX -= singleSetWidth;
          targetX -= singleSetWidth;
        }
      }

      // Apply transform to track
      track.style.transform = `translate3d(${currentX.toFixed(1)}px, 0, 0)`;

      // Calculate dynamic speed for 3D tilt & card skew (only when moving)
      const frameSpeed = (targetX - currentX);
      const tiltAngle = Math.max(-3.5, Math.min(3.5, frameSpeed * 0.045));
      const scaleDown = Math.max(0.985, 1 - Math.abs(frameSpeed) * 0.00035);

      if (isDragging || Math.abs(tiltAngle - lastTiltAngle) > 0.05 || Math.abs(frameSpeed) > 0.1) {
        lastTiltAngle = tiltAngle;
        for (let i = 0; i < allCards.length; i++) {
          allCards[i].style.transform = `perspective(1000px) rotateY(${tiltAngle.toFixed(2)}deg) scale(${scaleDown.toFixed(3)})`;
        }
      }

      if (isCarouselVisible) {
        carouselRafId = requestAnimationFrame(renderLoop);
      } else {
        carouselRafId = null;
      }
    }

    if ('IntersectionObserver' in window) {
      const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isCarouselVisible = entry.isIntersecting;
          if (isCarouselVisible) {
            lastFrameTime = performance.now();
            if (!carouselRafId) carouselRafId = requestAnimationFrame(renderLoop);
          } else {
            if (carouselRafId) {
              cancelAnimationFrame(carouselRafId);
              carouselRafId = null;
            }
          }
        });
      }, { threshold: 0.05 });

      carouselObserver.observe(viewport);
    } else {
      isCarouselVisible = true;
      carouselRafId = requestAnimationFrame(renderLoop);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppleFluidCarousel);
  } else {
    initAppleFluidCarousel();
  }
})();
