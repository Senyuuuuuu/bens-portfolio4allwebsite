/**
 * Anti-Gravity Modular Physics Engine for Meditation & Yoga Multi-Page Site
 * Powered by Matter.js & Web Audio API
 */

(function () {
  // Web Audio API Synthesizer
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  function playSynthSound(freq, duration, type = 'sine') {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Engine state variables
  let engine, runner, mouseConstraint;
  let physicsBodies = [];
  let originalElementStates = [];
  let isAntiGravityActive = false;
  let isZeroG = false;
  let isRepulsorActive = false;
  let mousePos = { x: -1000, y: -1000 };

  // DOM Elements
  let triggerBtn, hud, repulsorCanvas, ctx;

  function initUI() {
    // 1. Create Repulsor Canvas if missing
    if (!document.getElementById('repulsor-canvas')) {
      repulsorCanvas = document.createElement('canvas');
      repulsorCanvas.id = 'repulsor-canvas';
      repulsorCanvas.style.cssText = 'pointer-events:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9998;';
      document.body.appendChild(repulsorCanvas);
    } else {
      repulsorCanvas = document.getElementById('repulsor-canvas');
    }
    ctx = repulsorCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 2. Floating Trigger Button removed per user request
    if (document.getElementById('antigravity-trigger')) {
      document.getElementById('antigravity-trigger').remove();
    }

    // 3. Create HUD Bar if missing
    if (!document.getElementById('antigravity-hud')) {
      hud = document.createElement('div');
      hud.id = 'antigravity-hud';
      hud.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[10000] hidden bg-gray-900/90 backdrop-blur-xl border border-gray-700/60 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 transition-all duration-300';
      hud.innerHTML = `
        <div class="flex items-center gap-2 pr-4 border-r border-gray-700">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="font-bold text-xs tracking-wider uppercase text-emerald-400">Anti-Gravity Active</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="skill-throw-btn" class="skill-btn active bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-emerald-500 transition">
            🖐️ <span>Kinetic Grab</span>
          </button>
          <button id="skill-zerog-btn" class="skill-btn bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-gray-700 transition">
            🌌 <span>Zero-G (Z)</span>
          </button>
          <button id="skill-repulsor-btn" class="skill-btn bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-gray-700 transition">
            ⚡ <span>Repulsor (Hold R)</span>
          </button>
          <button id="skill-blast-btn" class="bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-rose-600 hover:text-white transition">
            💥 <span>Shockwave</span>
          </button>
        </div>
        <div class="pl-4 border-l border-gray-700 flex items-center gap-3">
          <button id="rebuild-btn" class="bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-emerald-400 hover:text-white transition shadow-md">
            🔄 Rebuild Page
          </button>
        </div>
      `;
      document.body.appendChild(hud);
    } else {
      hud = document.getElementById('antigravity-hud');
    }

    // Event Listeners for Trigger & Controls
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        if (!isAntiGravityActive) initiateAntiGravity();
      });
    }

    document.getElementById('rebuild-btn').addEventListener('click', rebuildPage);
    document.getElementById('skill-zerog-btn').addEventListener('click', toggleZeroG);

    const repulsorBtn = document.getElementById('skill-repulsor-btn');
    repulsorBtn.addEventListener('mousedown', () => setRepulsorState(true));
    repulsorBtn.addEventListener('mouseup', () => setRepulsorState(false));

    document.getElementById('skill-blast-btn').addEventListener('click', () => triggerBlastWave());
  }

  function resizeCanvas() {
    if (repulsorCanvas) {
      repulsorCanvas.width = window.innerWidth;
      repulsorCanvas.height = window.innerHeight;
    }
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!isAntiGravityActive) return;
    if (e.key.toLowerCase() === 'z') toggleZeroG();
    if (e.key.toLowerCase() === 'r') setRepulsorState(true);
  });

  window.addEventListener('keyup', (e) => {
    if (!isAntiGravityActive) return;
    if (e.key.toLowerCase() === 'r') setRepulsorState(false);
  });

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  window.addEventListener('click', (e) => {
    if (!isAntiGravityActive) return;
    if (e.target === document.body || e.target === repulsorCanvas) {
      triggerBlastWave(e.clientX, e.clientY);
    }
  });

  function toggleZeroG() {
    isZeroG = !isZeroG;
    if (engine) engine.gravity.y = isZeroG ? 0 : 1;
    const btn = document.getElementById('skill-zerog-btn');
    if (isZeroG) {
      btn.classList.replace('bg-gray-800', 'bg-purple-600');
      btn.classList.replace('text-gray-300', 'text-white');
      playSynthSound(520, 0.4, 'triangle');
    } else {
      btn.classList.replace('bg-purple-600', 'bg-gray-800');
      btn.classList.replace('text-white', 'text-gray-300');
      playSynthSound(300, 0.3, 'sine');
    }
  }

  function setRepulsorState(active) {
    isRepulsorActive = active;
    const btn = document.getElementById('skill-repulsor-btn');
    if (active) {
      btn.classList.replace('bg-gray-800', 'bg-cyan-600');
      btn.classList.replace('text-gray-300', 'text-white');
      playSynthSound(800, 0.2, 'sawtooth');
    } else {
      btn.classList.replace('bg-cyan-600', 'bg-gray-800');
      btn.classList.replace('text-white', 'text-gray-300');
    }
  }

  function triggerBlastWave(centerX = window.innerWidth / 2, centerY = window.innerHeight / 2) {
    playSynthSound(150, 0.5, 'square');
    physicsBodies.forEach(({ body }) => {
      const dx = body.position.x - centerX;
      const dy = body.position.y - centerY;
      const dist = Math.hypot(dx, dy) || 1;
      const forceMagnitude = Math.min(0.15, 800 / (dist * dist + 100));
      Matter.Body.applyForce(body, body.position, {
        x: (dx / dist) * forceMagnitude,
        y: (dy / dist) * forceMagnitude
      });
    });
  }

  // Initiate Anti-Gravity Collapse on Current Page
  function initiateAntiGravity() {
    isAntiGravityActive = true;
    playSynthSound(220, 0.6, 'sawtooth');

    if (triggerBtn) triggerBtn.classList.add('hidden');
    hud.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          World = Matter.World,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    engine = Engine.create({ gravity: { x: 0, y: 1 } });

    // Viewport Boundaries
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const wallThickness = 100;

    const floor = Bodies.rectangle(viewportW / 2, viewportH + wallThickness / 2 - 10, viewportW * 3, wallThickness, { isStatic: true, friction: 0.8 });
    const ceiling = Bodies.rectangle(viewportW / 2, -wallThickness / 2, viewportW * 3, wallThickness, { isStatic: true });
    const leftWall = Bodies.rectangle(-wallThickness / 2, viewportH / 2, wallThickness, viewportH * 3, { isStatic: true });
    const rightWall = Bodies.rectangle(viewportW + wallThickness / 2, viewportH / 2, wallThickness, viewportH * 3, { isStatic: true });

    World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Parse elements with class .physics-element on current active page
    const elements = Array.from(document.querySelectorAll('.physics-element'));
    originalElementStates = [];
    physicsBodies = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      originalElementStates.push({
        element: el,
        style: el.getAttribute('style') || '',
        className: el.className
      });

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.6,
        friction: 0.2,
        frictionAir: 0.015,
        chamfer: { radius: 12 }
      });

      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
      World.add(engine.world, body);

      el.classList.add('physics-body-active');
      el.style.position = 'fixed';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = rect.width + 'px';
      el.style.height = rect.height + 'px';
      el.style.margin = '0px';
      el.style.zIndex = '9000';
      el.style.transformOrigin = 'center center';
      el.style.pointerEvents = 'auto';

      physicsBodies.push({ el, body, w: rect.width, h: rect.height });
    });

    // Mouse constraint for Kinetic Grab & Throw
    const mouse = Mouse.create(document.body);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(engine.world, mouseConstraint);

    runner = Runner.create();
    Runner.run(runner, engine);

    // Collision sound
    Matter.Events.on(engine, 'collisionStart', (e) => {
      if (!isAntiGravityActive) return;
      e.pairs.forEach(pair => {
        const speed = Math.hypot(pair.collision.supports[0]?.x || 0, pair.collision.supports[0]?.y || 0);
        if (speed > 5) playSynthSound(180 + Math.random() * 200, 0.1, 'sine');
      });
    });

    requestAnimationFrame(physicsRenderLoop);
  }

  function physicsRenderLoop() {
    if (!isAntiGravityActive) return;

    physicsBodies.forEach(({ el, body, w, h }) => {
      const x = body.position.x - w / 2;
      const y = body.position.y - h / 2;
      const angle = body.angle;
      el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}rad)`;

      if (isZeroG) {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.0002,
          y: (Math.random() - 0.5) * 0.0002
        });
      }

      if (isRepulsorActive) {
        const dx = body.position.x - mousePos.x;
        const dy = body.position.y - mousePos.y;
        const dist = Math.hypot(dx, dy) || 1;
        const repulsorRadius = 300;

        if (dist < repulsorRadius) {
          const force = (1 - dist / repulsorRadius) * 0.05;
          Matter.Body.applyForce(body, body.position, {
            x: (dx / dist) * force,
            y: (dy / dist) * force
          });
        }
      }
    });

    ctx.clearRect(0, 0, repulsorCanvas.width, repulsorCanvas.height);
    if (isRepulsorActive) {
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 120, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(mousePos.x, mousePos.y, 10, mousePos.x, mousePos.y, 120);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    requestAnimationFrame(physicsRenderLoop);
  }

  // Restore page layout
  function rebuildPage() {
    if (!isAntiGravityActive) return;
    isAntiGravityActive = false;
    playSynthSound(600, 0.4, 'sine');

    if (runner) Matter.Runner.stop(runner);
    if (engine) Matter.World.clear(engine.world, false);

    ctx.clearRect(0, 0, repulsorCanvas.width, repulsorCanvas.height);

    originalElementStates.forEach(({ element, style, className }) => {
      element.setAttribute('style', style);
      element.className = className;
      element.classList.remove('physics-body-active');
    });

    physicsBodies = [];
    originalElementStates = [];

    document.body.style.overflow = '';
    hud.classList.add('hidden');
    if (triggerBtn) triggerBtn.classList.remove('hidden');
  }

  // Init UI on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
})();
