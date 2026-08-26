/**
 * BENYAMIN NAMTALASHVILI — MATTER.JS ZERO-GRAVITY HERO PHYSICS ENGINE
 * Ultra-Responsive Direct Grab, Drag, and Fling Physics System
 */

(function () {
  'use strict';

  function initMatterHero() {
    if (typeof Matter === 'undefined') {
      console.warn('Matter.js not loaded');
      return;
    }

    // Skip heavy physics engine on mobile/touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmallScreen = window.innerWidth < 768;
    if (isTouchDevice || isSmallScreen) {
      // On mobile: just let the items sit statically in normal flow
      const stage = document.getElementById('heroAntigravityStage');
      if (stage) {
        stage.style.minHeight = '200px';
        stage.style.display = 'flex';
        stage.style.flexWrap = 'wrap';
        stage.style.gap = '10px';
        stage.style.padding = '1rem';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        // Remove absolute positioning from items so they flow naturally
        Array.from(stage.querySelectorAll('.antigravity-item')).forEach(el => {
          el.style.position = 'relative';
          el.style.left = 'auto';
          el.style.top = 'auto';
          el.style.transform = 'none';
          el.style.cursor = 'default';
        });
      }
      return;
    }

    const heroSection = document.getElementById('hero');
    const stageContainer = document.getElementById('heroAntigravityStage');
    if (!heroSection || !stageContainer) return;

    const items = Array.from(stageContainer.querySelectorAll('.antigravity-item'));
    if (items.length === 0) return;


    // Matter.js Module Aliases
    const {
      Engine,
      World,
      Bodies,
      Body,
      Runner,
      Events,
      Composite,
      Vector
    } = Matter;

    // 1. Create Engine with Zero Gravity
    const engine = Engine.create({
      enableSleeping: false,
      constraintIterations: 4,
      positionIterations: 8,
      velocityIterations: 8
    });

    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
    engine.world.gravity.scale = 0;

    let stageW = stageContainer.offsetWidth || heroSection.offsetWidth || window.innerWidth;
    let stageH = stageContainer.offsetHeight || heroSection.offsetHeight || window.innerHeight;

    // 2. Create Static Enclosure Boundary Walls
    const wallThickness = 120;
    let walls = createWalls(stageW, stageH);

    function createWalls(w, h) {
      const wallOpts = {
        isStatic: true,
        restitution: 0.98,
        friction: 0.001,
        render: { visible: false }
      };

      const top = Bodies.rectangle(w / 2, -wallThickness / 2, w * 3, wallThickness, wallOpts);
      const bottom = Bodies.rectangle(w / 2, h + wallThickness / 2, w * 3, wallThickness, wallOpts);
      const left = Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h * 3, wallOpts);
      const right = Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h * 3, wallOpts);

      World.add(engine.world, [top, bottom, left, right]);
      return { top, bottom, left, right };
    }

    // 3. Map HTML Pill & Squircle Elements to Rigid Physics Bodies
    const bodyItemPairs = [];

    items.forEach((el, index) => {
      // Ensure touch-action: none so dragging is smooth on all devices
      el.style.touchAction = 'none';

      const initXPercent = parseFloat(el.getAttribute('data-initial-x')) || (index % 2 === 0 ? 15 : 85);
      const initYPercent = parseFloat(el.getAttribute('data-initial-y')) || (15 + (index * 6) % 70);
      const initRotDeg = parseFloat(el.getAttribute('data-rot')) || 0;
      const initScale = parseFloat(el.getAttribute('data-scale')) || 1;

      const isMobile = window.innerWidth <= 768;
      const responsiveScale = isMobile ? Math.min(initScale, 0.72) : initScale;

      const elRect = el.getBoundingClientRect();
      const elW = elRect.width > 20 ? elRect.width : (el.offsetWidth || 140);
      const elH = elRect.height > 20 ? elRect.height : (el.offsetHeight || 52);

      // On mobile screens, bias coordinates toward outer borders so text remains clear
      let posX = (initXPercent / 100) * stageW;
      let posY = (initYPercent / 100) * stageH;
      if (isMobile) {
        if (initXPercent < 50) posX = Math.max(30, Math.min(posX, stageW * 0.35));
        else posX = Math.max(stageW * 0.65, Math.min(posX, stageW - 30));
      }

      const angleRad = (initRotDeg * Math.PI) / 180;

      const isSquircle = el.classList.contains('squircle-item');
      const chamferRadius = isSquircle ? 18 : elH / 2;

      // High Restitution (Bounciness) & Minimal Friction
      const body = Bodies.rectangle(posX, posY, elW * responsiveScale, elH * responsiveScale, {
        chamfer: { radius: chamferRadius * responsiveScale },
        angle: angleRad,
        restitution: 0.94,        // Bouncy collision
        friction: 0.002,          // Ultra-smooth gliding
        frictionAir: 0.008,       // Gentle air resistance for natural drift
        frictionStatic: 0.001,
        density: 0.001,
        render: { visible: false }
      });

      // Initial subtle zero-g ambient drift impulse
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.5;
      Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.008);

      World.add(engine.world, body);

      const pair = {
        el,
        body,
        baseScale: responsiveScale,
        currentScale: responsiveScale,
        targetScale: responsiveScale,
        width: elW,
        height: elH,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        recentPositions: []
      };

      bodyItemPairs.push(pair);

      // Direct, Zero-Latency Pointer Events for Instant Responsive Dragging
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          el.setPointerCapture(e.pointerId);
        } catch (err) {}

        const stageRect = stageContainer.getBoundingClientRect();
        const stagePointerX = e.clientX - stageRect.left;
        const stagePointerY = e.clientY - stageRect.top;

        pair.isDragging = true;
        pair.dragOffset = {
          x: stagePointerX - body.position.x,
          y: stagePointerY - body.position.y
        };
        pair.targetScale = pair.baseScale * 1.14;
        pair.recentPositions = [{ x: stagePointerX, y: stagePointerY, t: performance.now() }];

        el.classList.add('is-dragging');
        document.body.style.cursor = 'grabbing';

        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      });

      el.addEventListener('pointermove', (e) => {
        if (!pair.isDragging) return;
        e.preventDefault();

        const stageRect = stageContainer.getBoundingClientRect();
        const stagePointerX = e.clientX - stageRect.left;
        const stagePointerY = e.clientY - stageRect.top;
        const now = performance.now();

        const targetBodyX = stagePointerX - pair.dragOffset.x;
        const targetBodyY = stagePointerY - pair.dragOffset.y;

        // Instant kinematic update during drag
        Body.setPosition(body, { x: targetBodyX, y: targetBodyY });

        pair.recentPositions.push({ x: stagePointerX, y: stagePointerY, t: now });
        if (pair.recentPositions.length > 5) {
          pair.recentPositions.shift();
        }
      });

      function handlePointerRelease(e) {
        if (!pair.isDragging) return;
        pair.isDragging = false;
        pair.targetScale = pair.baseScale;
        el.classList.remove('is-dragging');
        document.body.style.cursor = '';

        try {
          el.releasePointerCapture(e.pointerId);
        } catch (err) {}

        // Calculate smooth fling velocity & rotation from trajectory
        if (pair.recentPositions.length >= 2) {
          const first = pair.recentPositions[0];
          const last = pair.recentPositions[pair.recentPositions.length - 1];
          const dt = Math.max(16, last.t - first.t);
          const vx = ((last.x - first.x) / dt) * 16;
          const vy = ((last.y - first.y) / dt) * 16;
          const maxSpeed = 24;
          const speed = Math.hypot(vx, vy);
          const factor = speed > maxSpeed ? maxSpeed / speed : 1;

          Body.setVelocity(body, { x: vx * factor, y: vy * factor });
          Body.setAngularVelocity(body, vx * 0.008);
        }
      }

      el.addEventListener('pointerup', handlePointerRelease);
      el.addEventListener('pointercancel', handlePointerRelease);
    });

    // 4. Ambient Micro-Drift (Perpetually keeps Zero-G alive)
    let frameCount = 0;
    Events.on(engine, 'beforeUpdate', () => {
      frameCount++;
      if (frameCount % 60 === 0) {
        bodyItemPairs.forEach(pair => {
          if (!pair.isDragging) {
            const speed = Vector.magnitude(pair.body.velocity);
            if (speed < 0.3) {
              const nudgeAngle = Math.random() * Math.PI * 2;
              Body.applyForce(pair.body, pair.body.position, {
                x: Math.cos(nudgeAngle) * 0.0002,
                y: Math.sin(nudgeAngle) * 0.0002
              });
            }
          }
        });
      }
    });

    // 5. 60 FPS Render Synchronization: Sync Matter Bodies to HTML Elements
    let isHeroVisible = true;
    Events.on(engine, 'afterUpdate', () => {
      if (!isHeroVisible) return;
      bodyItemPairs.forEach(pair => {
        const { el, body, width, height } = pair;

        // Smooth scale interpolation
        pair.currentScale += (pair.targetScale - pair.currentScale) * 0.22;

        const posX = body.position.x - width / 2;
        const posY = body.position.y - height / 2;
        const angle = body.angle;

        el.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${angle.toFixed(3)}rad) scale(${pair.currentScale.toFixed(3)})`;
      });
    });

    // 6. Start Matter Runner with Viewport Intersection Optimization
    const runner = Runner.create();
    Runner.run(runner, engine);

    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible) {
            Runner.run(runner, engine);
          } else {
            Runner.stop(runner);
          }
        });
      }, { threshold: 0.05 });

      heroObserver.observe(heroSection);
    }

    // 7. Responsive Window Resize Handling
    window.addEventListener('resize', () => {
      const newW = stageContainer.offsetWidth || heroSection.offsetWidth || window.innerWidth;
      const newH = stageContainer.offsetHeight || heroSection.offsetHeight || window.innerHeight;

      if (Math.abs(newW - stageW) > 10 || Math.abs(newH - stageH) > 10) {
        stageW = newW;
        stageH = newH;

        // Recreate boundary walls for new dimensions
        Composite.remove(engine.world, [walls.top, walls.bottom, walls.left, walls.right]);
        walls = createWalls(stageW, stageH);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatterHero);
  } else {
    // Slight delay to allow layout calculation & fonts
    setTimeout(initMatterHero, 80);
  }
})();
