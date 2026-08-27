/**
 * BENYAMIN NAMTALASHVILI — MATTER.JS FALLING PILLS FOOTER ENGINE
 * Pure White Engineering Grid Canvas with Downward Falling UI Pills & Figma Bounding Box
 */

(function () {
  'use strict';

  function initFooterPhysics() {
    /* ========================================================================
       PHASE 2: FIGMA BOUNDING BOX CLICK-TO-COPY INTERACTION
       ======================================================================== */
    const emailBox = document.getElementById('emailBoundingBox');
    const copyBadge = document.getElementById('emailCopyBadge');
    const emailString = 'benyaminnamtalashvili726@gmail.com';

    if (emailBox && copyBadge) {
      emailBox.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(emailString);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = emailString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          }
          copyBadge.textContent = 'copied!';
          copyBadge.classList.add('is-copied');

          if (typeof gsap !== 'undefined') {
            gsap.fromTo(copyBadge, 
              { scale: 0.85 }, 
              { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }
            );
          }

          setTimeout(() => {
            copyBadge.textContent = 'copy email';
            copyBadge.classList.remove('is-copied');
          }, 2200);
        } catch (err) {
          console.error('Clipboard copy error:', err);
        }
      });

      if (typeof gsap !== 'undefined') {
        emailBox.addEventListener('mouseenter', () => {
          gsap.to(emailBox, { scale: 1.02, duration: 0.25, ease: 'power2.out' });
        });
        emailBox.addEventListener('mouseleave', () => {
          gsap.to(emailBox, { scale: 1.0, duration: 0.25, ease: 'power2.inOut' });
        });
      }
    }

    /* ========================================================================
       PHASE 3 & 5: MATTER.JS FALLING PILLS PHYSICS ENGINE
       ======================================================================== */
    const stage = document.getElementById('footerPhysicsStage');
    const footer = document.getElementById('engineeringFooter');
    const anchorTitle = document.getElementById('footerAnchorFloor');

    if (!stage || !footer || typeof Matter === 'undefined') return;

    // Phase 5: Disable physics on screens <= 768px to preserve touch-scroll & battery
    if (window.innerWidth <= 768) {
      return;
    }

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 0.92, scale: 0.001 } // Downward gravity: pills fall and settle
    });
    const world = engine.world;

    let bounds = stage.getBoundingClientRect();
    let width = bounds.width;
    let height = bounds.height;

    // Calculate baseline floor on top of gargantuan Benyamin typography
    const anchorRect = anchorTitle ? anchorTitle.getBoundingClientRect() : null;
    const footerRect = footer.getBoundingClientRect();
    let floorY = height - 75;
    if (anchorRect && footerRect) {
      floorY = (anchorRect.top - footerRect.top) + 20;
    }

    const wallThickness = 120;
    const floor = Bodies.rectangle(width / 2, floorY + wallThickness / 2, width * 2, wallThickness, {
      isStatic: true,
      restitution: 0.65,
      friction: 0.3
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true
    });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true
    });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, {
      isStatic: true
    });

    Composite.add(world, [floor, leftWall, rightWall, ceiling]);

    const pillElements = Array.from(stage.querySelectorAll('.physics-pill-body'));
    const pillBodies = [];

    pillElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || 140;
      const h = rect.height || 42;

      const spawnX = (width * 0.15) + (index * ((width * 0.7) / pillElements.length)) + (Math.random() * 40 - 20);
      const spawnY = -40 - (index * 65);
      const randomAngle = (Math.random() - 0.5) * 0.5;

      const body = Bodies.rectangle(spawnX, spawnY, w, h, {
        chamfer: { radius: h / 2 },
        restitution: 0.68,
        friction: 0.15,
        frictionAir: 0.012,
        density: 0.002,
        angle: randomAngle
      });

      body.element = el;
      body.pillWidth = w;
      body.pillHeight = h;

      pillBodies.push(body);
    });

    Composite.add(world, pillBodies);

    // Matter.js Mouse Constraint
    const mouse = Mouse.create(stage);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.25,
        damping: 0.1,
        render: { visible: false }
      }
    });

    // Prevent canvas from stealing wheel scroll
    if (mouseConstraint.mouse.element) {
      mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
      mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
    }

    Composite.add(world, mouseConstraint);

    let isDragging = false;
    Events.on(mouseConstraint, 'startdrag', () => {
      isDragging = true;
    });
    Events.on(mouseConstraint, 'enddrag', () => {
      setTimeout(() => { isDragging = false; }, 80);
    });

    pillElements.forEach(el => {
      el.addEventListener('click', (e) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    // Synchronize physical bodies with DOM
    Events.on(engine, 'afterUpdate', () => {
      pillBodies.forEach(body => {
        if (body.element) {
          const x = body.position.x - body.pillWidth / 2;
          const y = body.position.y - body.pillHeight / 2;
          body.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
        }
      });
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Window resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        Runner.stop(runner);
        Engine.clear(engine);
        return;
      }
      bounds = stage.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;

      const newAnchorRect = anchorTitle ? anchorTitle.getBoundingClientRect() : null;
      const newFooterRect = footer.getBoundingClientRect();
      let newFloorY = height - 75;
      if (newAnchorRect && newFooterRect) {
        newFloorY = (newAnchorRect.top - newFooterRect.top) + 20;
      }

      Body.setPosition(floor, { x: width / 2, y: newFloorY + wallThickness / 2 });
      Body.setPosition(leftWall, { x: -wallThickness / 2, y: height / 2 });
      Body.setPosition(rightWall, { x: width + wallThickness / 2, y: height / 2 });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterPhysics);
  } else {
    initFooterPhysics();
  }
})();
