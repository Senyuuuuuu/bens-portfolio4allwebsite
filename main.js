/**
 * BENYAMIN NAMTALASHVILI — MASTER INTERACTION & MOTION ENGINE
 * Lenis Smooth Scroll + GSAP 3 ScrollTrigger + Web Audio Haptics + Interactive Stage Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Register GSAP Plugins if loaded
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // =========================================================================
  // 1. TACTILE AUDIO FEEDBACK ENGINE (App Interface Click & Menu Tone)
  // =========================================================================
  let audioEnabled = true;
  let audioCtx = null;
  const audioBuffers = {
    click: null,
    tone: null
  };

  const AUDIO_URLS = {
    click: 'assets/ui-click.mp3',
    tone: 'assets/menu-tone.mp3'
  };

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  // Pre-load and decode audio buffers for zero-latency polyphonic playback
  async function preloadAudioBuffers() {
    initAudio();
    if (!audioCtx) return;

    for (const [key, url] of Object.entries(AUDIO_URLS)) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          audioBuffers[key] = await audioCtx.decodeAudioData(arrayBuffer);
        }
      } catch (err) {
        // Fallback handled seamlessly during playback
      }
    }
  }

  // Auto-preload on first user interaction if not already loaded
  const unlockAudio = () => {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!audioBuffers.click || !audioBuffers.tone) {
      preloadAudioBuffers();
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
  preloadAudioBuffers();

  function playSound(type = 'click', volume = 0.5) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (audioCtx && audioBuffers[type]) {
        const source = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();
        source.buffer = audioBuffers[type];
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.start(0);
        return;
      }

      // Fallback: HTML5 Audio instance
      const soundUrl = AUDIO_URLS[type] || AUDIO_URLS.click;
      const audioEl = new Audio(soundUrl);
      audioEl.volume = volume;
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    } catch (e) {
      // Graceful fallback
    }
  }

  function playButtonClick() {
    playSound('click', 0.55);
  }

  function playMenuTone() {
    playSound('tone', 0.45);
  }

  // Expose on window for global access
  window.playButtonClick = playButtonClick;
  window.playMenuTone = playMenuTone;
  window.playTactileClick = (freq, type, duration) => playButtonClick();

  // Audio Toggle Button in Navigation
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      audioToggleBtn.innerHTML = audioEnabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      audioToggleBtn.setAttribute('title', audioEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted');
      if (audioEnabled) playMenuTone();
    });
  }

  // Global delegated click handler for all interactive elements
  document.addEventListener('click', (e) => {
    const toneTarget = e.target.closest(
      '.stage-tab-btn, .stage-filter-chip, .portfolio-filter-btn, .portfolio-filter-chip, .filter-chip, .tab-btn, #audioToggleBtn'
    );
    if (toneTarget) {
      if (toneTarget !== audioToggleBtn) {
        playMenuTone();
      }
      return;
    }

    const clickTarget = e.target.closest(
      'button, .btn-apple-primary, .btn-apple-secondary, .btn, .nav-links-wrap a, .nav-link, .nav-cta, .stage-watch-demo-btn, .cta-banner-btn, .featured-card, .portfolio-card-item, .chip, .accordion-header, #backToTop, #footerBackToTop, input[type="submit"], input[type="button"]'
    );
    if (clickTarget) {
      playButtonClick();
    }
  });

  // =========================================================================
  // 1.5. GLOBAL VISIONOS MOBILE NAVIGATION DRAWER CONTROLLER
  // =========================================================================
  function initMobileNavigation() {
    const nav = document.getElementById('nav') || document.querySelector('nav');
    if (!nav) return;

    const navIsland = nav.querySelector('.nav-island');
    if (!navIsland) return;

    // Check or inject hamburger toggle inside .nav-island
    let mobileToggle = navIsland.querySelector('.nav-mobile-toggle');
    if (!mobileToggle) {
      mobileToggle = document.createElement('button');
      mobileToggle.className = 'nav-mobile-toggle';
      mobileToggle.id = 'navMobileToggle';
      mobileToggle.setAttribute('aria-label', 'Toggle Mobile Navigation Menu');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = `
        <div class="hamburger-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      navIsland.appendChild(mobileToggle);
    }

    // Determine active page
    const currentPath = window.location.pathname.toLowerCase();
    const isOverview = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    const isWorks = currentPath.includes('portfolio') || currentPath.includes('case-study');
    const isAbout = currentPath.includes('about');
    const isServices = currentPath.includes('services');
    const isContact = currentPath.includes('contact');

    // Create or find Mobile Navigation Drawer Sheet & Backdrop
    let backdrop = document.querySelector('.mobile-nav-backdrop');
    let sheet = document.querySelector('.mobile-nav-sheet');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      backdrop.id = 'mobileNavBackdrop';
      document.body.appendChild(backdrop);
    }

    if (!sheet) {
      sheet = document.createElement('div');
      sheet.className = 'mobile-nav-sheet';
      sheet.id = 'mobileNavSheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-label', 'Mobile Navigation');

      sheet.innerHTML = `
        <div class="mobile-nav-header">
          <div class="mobile-nav-brand">
            <span class="nav-brand-avatar" style="width:28px; height:28px; border-radius:50%; background:#0B0B0D; color:#FFF; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">BN</span>
            <span>Benyamin Namtalashvili</span>
          </div>
          <button class="mobile-nav-close-btn" id="mobileNavCloseBtn" aria-label="Close Navigation Menu">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul class="mobile-nav-links">
          <li>
            <a href="index.html" class="mobile-nav-link-item ${isOverview ? 'active' : ''}">
              <div class="mobile-nav-link-left">
                <span class="mobile-nav-link-icon"><i class="fa-solid fa-house"></i></span>
                <span>Overview</span>
              </div>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </a>
          </li>
          <li>
            <a href="portfolio.html" class="mobile-nav-link-item ${isWorks ? 'active' : ''}">
              <div class="mobile-nav-link-left">
                <span class="mobile-nav-link-icon"><i class="fa-solid fa-layer-group"></i></span>
                <span>Works &amp; Case Studies</span>
              </div>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </a>
          </li>
          <li>
            <a href="about.html" class="mobile-nav-link-item ${isAbout ? 'active' : ''}">
              <div class="mobile-nav-link-left">
                <span class="mobile-nav-link-icon"><i class="fa-solid fa-user-tie"></i></span>
                <span>About &amp; Resume</span>
              </div>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </a>
          </li>
          <li>
            <a href="contact.html" class="mobile-nav-link-item ${isContact ? 'active' : ''}">
              <div class="mobile-nav-link-left">
                <span class="mobile-nav-link-icon"><i class="fa-solid fa-envelope"></i></span>
                <span>Contact &amp; Inquiries</span>
              </div>
              <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
            </a>
          </li>
          <li>
            <a href="https://bensmodelingportfolio.netlify.app/" target="_blank" rel="noopener noreferrer" class="mobile-nav-modeling-pill">
              <div class="mobile-nav-link-left">
                <span class="mobile-nav-link-icon" style="background:rgba(255,107,0,0.15); color:var(--apple-blue);"><i class="fa-solid fa-camera"></i></span>
                <span>Modeling Portfolio</span>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem;"></i>
            </a>
          </li>
        </ul>

        <div class="mobile-nav-cta-row">
          <div class="mobile-nav-hire-badge">
            <span class="status-dot"></span>
            <span>Available for Hire</span>
          </div>

          <a href="contact.html" class="btn-apple-primary" style="width:100%; justify-content:center; padding:0.85rem;">
            <span>Get in Touch</span>
            <i class="fa-solid fa-arrow-right" style="font-size:0.85rem;"></i>
          </a>

          <div class="mobile-nav-quick-actions">
            <a href="mailto:benyaminnamtalashvili726@gmail.com" class="mobile-quick-btn" title="Send Email">
              <i class="fa-solid fa-envelope" style="color:var(--apple-blue);"></i>
              <span>Email</span>
            </a>
            <a href="https://wa.me/639454836568" target="_blank" rel="noopener noreferrer" class="mobile-quick-btn" title="WhatsApp Message">
              <i class="fa-brands fa-whatsapp" style="color:#25D366;"></i>
              <span>WhatsApp</span>
            </a>
            <a href="tel:+639454836568" class="mobile-quick-btn" title="Call Phone">
              <i class="fa-solid fa-phone" style="color:var(--apple-blue);"></i>
              <span>Call</span>
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(sheet);
    }

    let isOpen = false;

    function openMobileNav() {
      isOpen = true;
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('is-open');
      sheet.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      playMenuTone();
    }

    function closeMobileNav() {
      isOpen = false;
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('is-open');
      sheet.classList.remove('is-open');
      document.body.style.overflow = '';
      playButtonClick();
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    backdrop.addEventListener('click', closeMobileNav);

    const closeBtn = sheet.querySelector('#mobileNavCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileNav);
    }

    // Auto-close when clicking any navigation link
    sheet.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!link.getAttribute('target')) {
          closeMobileNav();
        }
      });
    });

    // ESC key closes drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMobileNav();
      }
    });
  }

  initMobileNavigation();

  // =========================================================================
  // 2. LENIS SMOOTH SCROLLING ENGINE (Synchronized with GSAP)
  // =========================================================================
  let lenis;
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(500, 33);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -70 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // =========================================================================
  // 3. HERO & SECTION SCROLL REVEAL ANIMATIONS (GSAP ScrollTrigger)
  // =========================================================================
  // =========================================================================
  // 3. HERO & SECTION SCROLL REVEAL ANIMATIONS (GSAP ScrollTrigger)
  // =========================================================================
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    // 3.1 Hero Text Entrance Animation (Instant on page load)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      gsap.fromTo(['.hero-rating-pill', '.hero-title', '.hero-lead', '.hero-actions-row'],
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,transform' }
      );
    }

    if (typeof ScrollTrigger === 'undefined') return;

    // 3.2 Video Presentation Stage Scroll-Appear & 3D Unfold Animation
    const stageWrap = document.querySelector('.hero-stage-wrap');
    const deviceStage = document.querySelector('.hero-device-stage');

    if (stageWrap && deviceStage) {
      // Set initial 3D transform, scale down, and subtle blur
      gsap.set(deviceStage, {
        transformPerspective: 1200,
        transformOrigin: "center top",
        rotateX: 18,
        scale: 0.88,
        y: 60,
        opacity: 0.25,
        filter: 'blur(8px)'
      });

      // ScrollTrigger to unfold and scale into full 4K view
      gsap.to(deviceStage, {
        scrollTrigger: {
          trigger: stageWrap,
          start: 'top 92%',
          end: 'top 45%',
          scrub: 1.2,
          toggleActions: 'play none none reverse'
        },
        rotateX: 0,
        scale: 1.0,
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out'
      });
    }

    // 3.3 Smooth Text Slide & Fade on All Sections
    const animSections = ['#featured-projects', '#selected-work', '#capabilities', '#reviews', '.reviews-section', '.clients-section', 'footer'];
    animSections.forEach(secSelector => {
      const sec = document.querySelector(secSelector);
      if (sec) {
        const textElements = sec.querySelectorAll('.sec-tag, .section-h2, .section-desc, .sec-title, .cta-banner-title, .cta-banner-desc');
        if (textElements.length > 0) {
          gsap.fromTo(textElements, 
            { y: 25, opacity: 0 },
            {
              scrollTrigger: {
                trigger: sec,
                start: 'top 95%',
                toggleActions: 'play none none none'
              },
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'opacity,transform'
            }
          );
        }
      }
    });

    // 3.4 Selected Works Cards Fade-In & Scale
    if (document.querySelector('.portfolio-grid')) {
      gsap.fromTo('.portfolio-card-item', 
        { y: 35, opacity: 0, scale: 0.98 },
        {
          scrollTrigger: {
            trigger: '.portfolio-grid',
            start: 'top 92%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        }
      );
    }

    // 3.5 Capabilities Cards Fade-In
    if (document.querySelector('.capabilities-grid') || document.querySelector('.capabilities-dark-grid')) {
      gsap.fromTo('.capability-card, .cap-dark-card', 
        { y: 35, opacity: 0, scale: 0.98 },
        {
          scrollTrigger: {
            trigger: '.capabilities-grid, .capabilities-dark-grid',
            start: 'top 92%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        }
      );
    }

    // 3.6 Past Client Reviews Fade-In
    if (document.querySelector('.reviews-grid')) {
      gsap.fromTo('.review-card', 
        { y: 25, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.reviews-grid',
            start: 'top 92%',
          },
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        }
      );
    }

    // 3.7 Masterpiece CTA Banner Reveal
    if (document.querySelector('.cta-masterpiece-banner')) {
      gsap.fromTo('.cta-masterpiece-banner', 
        { y: 35, opacity: 0, scale: 0.98 },
        {
          scrollTrigger: {
            trigger: '.cta-masterpiece-banner',
            start: 'top 92%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        }
      );
    }
  }

  initScrollAnimations();

  // =========================================================================
  // 4. HERO STAGE VIDEO PLAYER & INTERACTIVE TAB CONTROLLER
  // =========================================================================
  const prototypeCanvas = document.getElementById('prototypeCanvas');

  const tabContents = {
    spatial: `
      <video src="FIVER AD FINAL.mp4" autoplay loop muted playsinline class="hero-stage-video" id="heroVideoPlayer"></video>
      <div class="video-live-badge">
        <span class="live-dot"></span>
        <span>4K VIDEO PRESENTATION</span>
      </div>
      <div class="video-control-bar">
        <div class="video-btn-group">
          <button class="video-play-btn" id="videoPlayBtn" title="Play/Pause"><i class="fa-solid fa-pause"></i></button>
          <button class="video-mute-btn" id="videoMuteBtn" title="Mute/Unmute"><i class="fa-solid fa-volume-xmark"></i></button>
          <span>Showcase_Presentation.mp4</span>
        </div>
        <span class="tabular-nums" style="color:var(--apple-sky);">60 FPS · 4K Cinema Stage</span>
      </div>
    `,
    ai: `
      <div style="padding:2.5rem; height:100%; display:flex; flex-direction:column; justify-content:space-between; font-family:var(--font-mono); font-size:0.88rem; color:#A1A1A6; background:#0B0B0D; border-radius:var(--radius-md);">
        <div>
          <div style="color:var(--apple-green); margin-bottom:0.8rem; font-size:0.85rem;">// Modern High-Performance Web &amp; API Architecture</div>
          <div style="color:#FFF; font-weight:700; font-size:1.05rem;">POST /api/v1/automation/pipeline</div>
          <pre style="color:#86868B; margin-top:1rem; font-size:0.82rem; line-height:1.6; background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
{
  "project": "Graphic, Web &amp; AI Automation Suite",
  "status": "Production Ready",
  "web_tier": "Responsive Component Architecture &amp; Edge Routing",
  "automation_nodes": "n8n Webhook Pipeline + LLM Agent Orchestration",
  "latency": "22ms · 99.99% Uptime"
}</pre>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.1); padding-top:1rem;">
          <span style="color:#34C759;">● Web Core Online (Zero Latency)</span>
          <span style="color:var(--apple-sky);">Full-Stack Web &amp; API Integration</span>
        </div>
      </div>
    `,
    tokens: `
      <div style="padding:2.5rem; height:100%; display:flex; flex-direction:column; justify-content:space-between; font-family:var(--font-mono); font-size:0.85rem; background:#0B0B0D; border-radius:var(--radius-md);">
        <div>
          <div style="color:var(--apple-sky); margin-bottom:1rem; font-size:0.85rem;">// Graphic Design &amp; Visual Identity System</div>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem;">
            <div style="padding:1rem; background:#0071E3; color:#FFF; border-radius:10px; font-weight:700;">Brand Accent<br><span style="font-size:0.75rem; opacity:0.85;">#0071E3</span></div>
            <div style="padding:1rem; background:#161619; color:#FFF; border:1px solid rgba(255,255,255,0.25); border-radius:10px; font-weight:700;">Obsidian Glass<br><span style="font-size:0.75rem; opacity:0.85;">#161619</span></div>
            <div style="padding:1rem; background:#34C759; color:#000; border-radius:10px; font-weight:700;">Success Green<br><span style="font-size:0.75rem; opacity:0.85;">#34C759</span></div>
          </div>
        </div>
        <div style="color:var(--ink-dark-secondary); font-size:0.82rem; border-top:1px solid rgba(255,255,255,0.1); padding-top:1rem;">
          ✦ Precision Vector Layouts · Liquid Specular Glass · Human Interface Standards
        </div>
      </div>
    `
  };

  function bindVideoControls() {
    const heroVideo = document.getElementById('heroVideoPlayer');
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoMuteBtn = document.getElementById('videoMuteBtn');

    if (heroVideo && videoPlayBtn) {
      videoPlayBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          videoPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
          heroVideo.pause();
          videoPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
      });
    }

    if (heroVideo && videoMuteBtn) {
      videoMuteBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        videoMuteBtn.innerHTML = heroVideo.muted 
          ? '<i class="fa-solid fa-volume-xmark"></i>' 
          : '<i class="fa-solid fa-volume-high"></i>';
      });
    }
  }

  bindVideoControls();

  // Unified global switcher for both top tab pills and bottom filter chips
  window.switchStageTab = function(target) {
    if (!prototypeCanvas || !tabContents[target]) return;

    playTactileClick(700, 'sine', 0.03);

    // Update top tabs
    document.querySelectorAll('.stage-tab-btn').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === target);
    });

    // Update bottom chips
    const chipMap = {
      spatial: '.chip-ai',
      ai: '.chip-web',
      tokens: '.chip-graphic'
    };

    document.querySelectorAll('.stage-filter-chip').forEach(c => c.classList.remove('active'));
    if (chipMap[target]) {
      const activeChip = document.querySelector(chipMap[target]);
      if (activeChip) activeChip.classList.add('active');
    }

    // Replace canvas content
    prototypeCanvas.innerHTML = tabContents[target];

    if (target === 'spatial') {
      bindVideoControls();
    }
  };

  // Top tab buttons click handler
  document.querySelectorAll('.stage-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      window.switchStageTab(target);
    });
  });

  // =========================================================================
  // 5. INITIALIZE SCROLL ANIMATIONS & REFRESH SCROLLTRIGGER
  // =========================================================================
  initScrollAnimations();
  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }

  // =========================================================================
  // 7. BACK TO TOP & LIVE FOOTER STATS
  // =========================================================================
  const backToTop = document.getElementById('backToTop');
  const footerBackToTop = document.getElementById('footerBackToTop');

  function scrollToTop() {
    playTactileClick(700, 'sine', 0.04);
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', scrollToTop);
  }

  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', scrollToTop);
  }

  // Update Footer Clock Live
  function updateFooterClock() {
    const clockElements = document.querySelectorAll('#footerClockTime');
    if (clockElements.length > 0) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      clockElements.forEach(el => {
        el.textContent = `${hours}:${mins} PHT`;
      });
    }
  }
  updateFooterClock();
  setInterval(updateFooterClock, 10000);

  // =========================================================================
  // 8. 4K CINEMA SHOWCASE VIDEO CONTROLLER (Fiverr Ad Video Engine)
  // =========================================================================
  const heroVideo = document.getElementById('heroVideoPlayer');
  const videoSoundBtn = document.getElementById('videoSoundBtn');
  const videoSoundIcon = document.getElementById('videoSoundIcon');
  const videoSoundText = document.getElementById('videoSoundText');

  if (heroVideo) {
    heroVideo.muted = true;
    
    const playHeroVideo = () => {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: keep muted and retry on user interaction
        });
      }
    };

    playHeroVideo();
    document.addEventListener('touchstart', playHeroVideo, { once: true });
    document.addEventListener('click', playHeroVideo, { once: true });

    // Intersection observer for video playback state
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            playHeroVideo();
          } else {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.15 });

      videoObserver.observe(heroVideo);
    }

    if (videoSoundBtn) {
      videoSoundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playTactileClick(600, 'sine', 0.05);

        if (heroVideo.muted) {
          heroVideo.muted = false;
          if (videoSoundIcon) videoSoundIcon.className = 'fa-solid fa-volume-high';
          if (videoSoundText) videoSoundText.textContent = 'Mute Audio';
        } else {
          heroVideo.muted = true;
          if (videoSoundIcon) videoSoundIcon.className = 'fa-solid fa-volume-xmark';
          if (videoSoundText) videoSoundText.textContent = 'Unmute Audio';
        }
      });
    }
  }
});
