/**
 * BENYAMIN NAMTALASHVILI — INTERACTIVE FOOTER DOT GRID & CONSTELLATION CANVAS
 * Features:
 * - Interactive dot matrix responding to cursor physics
 * - Proximity glow + subtle elastic spring displacement
 * - Automatic IntersectionObserver performance optimization (0% CPU when off-screen)
 */

(function () {
  'use strict';

  function initFooterInteractiveCanvas() {
    const footers = document.querySelectorAll('.designer-footer');
    if (!footers || footers.length === 0) return;

    footers.forEach(footer => {
      // Create canvas if not present
      let canvas = footer.querySelector('.footer-grid-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'footer-grid-canvas';
        footer.insertBefore(canvas, footer.firstChild);
      }

      const ctx = canvas.getContext('2d');
      let animationFrameId = null;
      let isVisible = false;
      let width = 0;
      let height = 0;
      let dots = [];

      const GRID_SPACING = 28;
      const HOVER_RADIUS = 130;
      const MAX_DISPLACEMENT = 14;

      const mouse = {
        x: -9999,
        y: -9999,
        active: false
      };

      function resize() {
        const rect = footer.getBoundingClientRect();
        width = canvas.width = rect.width * (window.devicePixelRatio || 1);
        height = canvas.height = rect.height * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        initDots(rect.width, rect.height);
      }

      function initDots(w, h) {
        dots = [];
        const cols = Math.ceil(w / GRID_SPACING);
        const rows = Math.ceil(h / GRID_SPACING);

        for (let r = 0; r <= rows; r++) {
          for (let c = 0; c <= cols; c++) {
            const originX = c * GRID_SPACING;
            const originY = r * GRID_SPACING;
            dots.push({
              originX,
              originY,
              x: originX,
              y: originY,
              vx: 0,
              vy: 0,
              baseAlpha: 0.12,
              alpha: 0.12,
              radius: 1.1
            });
          }
        }
      }

      footer.addEventListener('mousemove', (e) => {
        const rect = footer.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });

      footer.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      });

      function render() {
        if (!isVisible) return;
        const rect = footer.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        const now = Date.now() * 0.002;

        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];

          // Distance to mouse
          const dx = mouse.x - d.originX;
          const dy = mouse.y - d.originY;
          const dist = Math.hypot(dx, dy);

          let targetX = d.originX;
          let targetY = d.originY;
          let targetAlpha = d.baseAlpha;
          let targetRadius = 1.1;
          let isHovered = false;

          if (mouse.active && dist < HOVER_RADIUS) {
            isHovered = true;
            const force = (1 - dist / HOVER_RADIUS);
            const angle = Math.atan2(dy, dx);

            // Subtle push repulsion
            targetX = d.originX - Math.cos(angle) * (force * MAX_DISPLACEMENT);
            targetY = d.originY - Math.sin(angle) * (force * MAX_DISPLACEMENT);

            // Bright amber glow
            targetAlpha = d.baseAlpha + force * 0.85;
            targetRadius = 1.1 + force * 1.8;
          }

          // Spring physics easing
          d.x += (targetX - d.x) * 0.15;
          d.y += (targetY - d.y) * 0.15;
          d.alpha += (targetAlpha - d.alpha) * 0.18;

          // Draw dot
          ctx.beginPath();
          ctx.arc(d.x, d.y, targetRadius, 0, Math.PI * 2);

          if (isHovered) {
            ctx.fillStyle = `rgba(255, 107, 0, ${d.alpha})`;
            ctx.shadowColor = "rgba(255, 107, 0, 0.6)";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }

        // Draw subtle connection lines between adjacent highlighted dots
        if (mouse.active) {
          for (let i = 0; i < dots.length; i++) {
            const d1 = dots[i];
            const dist1 = Math.hypot(mouse.x - d1.x, mouse.y - d1.y);
            if (dist1 < HOVER_RADIUS * 0.65) {
              for (let j = i + 1; j < dots.length; j++) {
                const d2 = dots[j];
                const dotDist = Math.hypot(d1.x - d2.x, d1.y - d2.y);
                if (dotDist <= GRID_SPACING * 1.5) {
                  ctx.beginPath();
                  ctx.moveTo(d1.x, d1.y);
                  ctx.lineTo(d2.x, d2.y);
                  const lineAlpha = (1 - dist1 / (HOVER_RADIUS * 0.65)) * 0.25;
                  ctx.strokeStyle = `rgba(255, 107, 0, ${lineAlpha})`;
                  ctx.lineWidth = 0.75;
                  ctx.stroke();
                }
              }
            }
          }
        }

        animationFrameId = requestAnimationFrame(render);
      }

      // Observer to only animate when in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            resize();
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
          } else {
            isVisible = false;
            cancelAnimationFrame(animationFrameId);
          }
        });
      }, { threshold: 0.05 });

      observer.observe(footer);
      window.addEventListener('resize', resize);
      resize();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterInteractiveCanvas);
  } else {
    initFooterInteractiveCanvas();
  }
})();
