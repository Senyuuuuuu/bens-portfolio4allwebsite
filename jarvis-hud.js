/* ═══════════════════════════════════════════════════════════════════════
   JARVIS HUD — Cinematic AI Interface Engine v2.0
   State Machine | Arc Reactor Orb | Sound Engine | Boot Sequence
   ═══════════════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────────────────────────────
// 1.  JARVIS STATE MACHINE
//     States: BOOT | IDLE | LISTENING | PROCESSING | SPEAKING | ERROR
// ─────────────────────────────────────────────────────────────────────────
const JarvisHUD = (() => {
    let _state    = 'BOOT';
    let _prev     = 'BOOT';
    const _cbs    = [];

    const STATE_CONFIG = {
        BOOT:       { label: 'BOOTING',        badgeClass: 'state-boot',       orbClass: 'orb-boot'       },
        IDLE:       { label: 'JARVIS ONLINE',   badgeClass: 'state-idle',       orbClass: 'orb-idle'       },
        LISTENING:  { label: 'LISTENING',       badgeClass: 'state-listening',  orbClass: 'orb-listening'  },
        PROCESSING: { label: 'ANALYZING',       badgeClass: 'state-processing', orbClass: 'orb-processing' },
        SPEAKING:   { label: 'RESPONDING',      badgeClass: 'state-speaking',   orbClass: 'orb-speaking'   },
        ERROR:      { label: 'SYS ERROR',       badgeClass: 'state-error',      orbClass: 'orb-error'      },
        STANDBY:    { label: 'STANDBY',         badgeClass: 'state-idle',       orbClass: 'orb-idle'       },
    };

    function setState(s) {
        if (_state === s) return;
        _prev  = _state;
        _state = s;

        console.log(`%c[JARVIS HUD] ${_prev} → ${_state}`, 'color:#00E5FF;font-weight:bold;font-family:monospace');

        _cbs.forEach(fn => { try { fn(s, _prev); } catch(e){} });
        _applyUI(s);
        _applySound(s, _prev);
        if (window.JarvisOrb) JarvisOrb.setState(s);
    }

    function _applyUI(s) {
        const cfg = STATE_CONFIG[s] || STATE_CONFIG.IDLE;

        // State badge
        const badge = document.getElementById('jarvis-state-badge');
        if (badge) {
            badge.textContent = cfg.label;
            badge.className   = 'jarvis-state-badge ' + cfg.badgeClass;
        }

        // Right-panel status
        const rpStatus = document.getElementById('jarvis-status');
        if (rpStatus) rpStatus.textContent = cfg.label;

        // Hero sphere CSS class (drives CSS ring/glow effects)
        const sphere = document.getElementById('hero-sphere');
        if (sphere) sphere.className = 'hero-sphere ' + cfg.orbClass;

        // Hero rings class
        const rings = document.querySelector('.hero-rings');
        if (rings) rings.dataset.state = s.toLowerCase();

        // Live voice banner
        const banner = document.getElementById('live-voice-banner');
        if (banner) banner.className = 'live-voice-banner ' + s.toLowerCase();

        // HUD comm panel visibility
        const commPanel = document.getElementById('hud-comm-panel');
        if (commPanel) {
            const active = ['LISTENING','PROCESSING','SPEAKING'].includes(s);
            commPanel.classList.toggle('hud-comm-active', active);
        }

        // Telemetry flicker on PROCESSING
        _flickerTelemetry(s === 'PROCESSING');
    }

    let _flickerInterval = null;
    function _flickerTelemetry(active) {
        clearInterval(_flickerInterval);
        if (!active) return;
        const vals = ['cpu-val','mem-val','gpu-val'];
        const bars = ['cpu-bar','mem-bar','gpu-bar'];
        _flickerInterval = setInterval(() => {
            if (document.hidden) return;
            vals.forEach((id, i) => {
                const v = Math.round(40 + Math.random() * 55);
                const el = document.getElementById(id);
                const bar = document.getElementById(bars[i]);
                if (el)  el.textContent = v + '%';
                if (bar) bar.style.width = v + '%';
            });
        }, 200);
    }

    function _applySound(ns, ps) {
        if (!window.JarvisSounds) return;
        const T = {
            'BOOT→IDLE':           () => JarvisSounds.playConfirmTone(),
            'IDLE→LISTENING':      () => JarvisSounds.playCommStart(),
            'STANDBY→LISTENING':   () => JarvisSounds.playCommStart(),
            'LISTENING→PROCESSING':() => JarvisSounds.playScanTone(),
            'PROCESSING→SPEAKING': () => JarvisSounds.playCommStart(),
            'SPEAKING→IDLE':       () => JarvisSounds.playCommEnd(),
            'SPEAKING→STANDBY':    () => JarvisSounds.playCommEnd(),
            'LISTENING→IDLE':      () => JarvisSounds.playCommEnd(),
            'LISTENING→STANDBY':   () => JarvisSounds.playCommEnd(),
        };
        const k = `${ps}→${ns}`;
        if (T[k]) T[k]();
    }

    function getState()   { return _state; }
    function getPrev()    { return _prev;  }
    function onChange(fn) { _cbs.push(fn); }

    return { setState, getState, getPrev, onChange };
})();


// ─────────────────────────────────────────────────────────────────────────
// 2.  FUTURISTIC SOUND ENGINE — 100% Web Audio API, original sounds
// ─────────────────────────────────────────────────────────────────────────
const JarvisSounds = (() => {
    let ctx = null;
    let humOsc = null, humGain = null;
    let _enabled = true;
    let _unlocked = false;

    function _ensure() {
        if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return !!ctx; }
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        try { ctx = new AC(); return true; } catch(e) { return false; }
    }

    // Unlock on first user gesture
    function unlock() {
        if (_unlocked) return;
        _unlocked = true;
        _ensure();
    }

    // ── Shared oscillator helper ──────────────────────────────────────────
    function _tone(type, freq, startT, dur, vol, dest) {
        if (!ctx) return;
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        const t    = startT ?? ctx.currentTime;
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(dest || ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
        return { osc, gain };
    }

    // ── 1. Boot Chime — ascending metallic triad ──────────────────────────
    function playBootChime() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.value = 0.15;
        master.connect(ctx.destination);

        [330, 495, 660, 880, 1100, 1320].forEach((f, i) => {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            const rev  = ctx.createDelay(0.3);
            rev.delayTime.value = 0.18;
            const revGain = ctx.createGain();
            revGain.gain.value = 0.25;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t + i * 0.16);
            gain.gain.setValueAtTime(0, t + i * 0.16);
            gain.gain.linearRampToValueAtTime(0.18, t + i * 0.16 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.16 + 0.7);
            osc.connect(gain);
            gain.connect(master);
            gain.connect(rev);
            rev.connect(revGain);
            revGain.connect(master);
            osc.start(t + i * 0.16);
            osc.stop(t + i * 0.16 + 0.8);
        });

        // Sub-harmonic body
        const sub = ctx.createOscillator();
        const subG = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(110, t);
        subG.gain.setValueAtTime(0.06, t);
        subG.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
        sub.connect(subG); subG.connect(master);
        sub.start(t); sub.stop(t + 2.1);
    }

    // ── 2. UI Activation — holographic panel sweep ────────────────────────
    function playUIActivation() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        const osc    = ctx.createOscillator();
        const filt   = ctx.createBiquadFilter();
        const gain   = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(2400, t + 0.35);

        filt.type = 'bandpass';
        filt.frequency.setValueAtTime(600, t);
        filt.frequency.exponentialRampToValueAtTime(2000, t + 0.35);
        filt.Q.value = 5;

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

        osc.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.45);
    }

    // ── 3. Scan Tone — brief digital ping ────────────────────────────────
    function playScanTone() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.14);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.2);
    }

    // ── 4. Interface Click — mechanical precision ─────────────────────────
    function playClick() {
        if (!_enabled || !_ensure()) return;
        const t  = ctx.currentTime;
        const sr = ctx.sampleRate;
        const N  = Math.floor(sr * 0.025);
        const buf = ctx.createBuffer(1, N, sr);
        const data = buf.getChannelData(0);
        for (let i = 0; i < N; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / N, 3);

        const src  = ctx.createBufferSource();
        const filt = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filt.type = 'highpass'; filt.frequency.value = 3000;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        src.buffer = buf;
        src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
        src.start(t);

        // Tiny resonance tail
        const res = ctx.createOscillator();
        const rg  = ctx.createGain();
        res.type = 'sine'; res.frequency.value = 900;
        rg.gain.setValueAtTime(0.03, t); rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        res.connect(rg); rg.connect(ctx.destination);
        res.start(t); res.stop(t + 0.08);
    }

    // ── 5. System Hum — low spatial ambience ─────────────────────────────
    function startSystemHum() {
        if (!_enabled || !_ensure() || humOsc) return;
        humOsc  = ctx.createOscillator();
        humGain = ctx.createGain();
        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass'; filt.frequency.value = 180;
        humOsc.type = 'sine'; humOsc.frequency.value = 58;
        humGain.gain.value = 0.012;

        // Subtle LFO modulation
        const lfo = ctx.createOscillator();
        const lfog = ctx.createGain();
        lfo.frequency.value = 0.25; lfog.gain.value = 2;
        lfo.connect(lfog); lfog.connect(humOsc.frequency);
        lfo.start();

        humOsc.connect(filt); filt.connect(humGain); humGain.connect(ctx.destination);
        humOsc.start();
    }

    function stopSystemHum() {
        if (humOsc) { try { humOsc.stop(); } catch(e){} humOsc = null; }
    }

    // ── 6. Confirm Tone — mission accomplished ────────────────────────────
    function playConfirmTone() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        [[660, 0], [990, 0.13], [1320, 0.24]].forEach(([f, d]) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0.1, t + d);
            g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.22);
            o.connect(g); g.connect(ctx.destination);
            o.start(t + d); o.stop(t + d + 0.25);
        });
    }

    // ── 7. Processing Beep — data analysis pulse ──────────────────────────
    function playProcessingBeep() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        [0, 0.07, 0.14].forEach((delay, i) => {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 500 + i * 120;
            gain.gain.setValueAtTime(0.04, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.05);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t + delay); osc.stop(t + delay + 0.06);
        });
    }

    // ── 8. Orb Power-Up — arc reactor energizing ─────────────────────────
    function playOrbPowerUp() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.001, t);
        master.gain.linearRampToValueAtTime(0.18, t + 0.9);
        master.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        master.connect(ctx.destination);

        // Sweeping fundamental
        const o1 = ctx.createOscillator();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(80, t);
        o1.frequency.exponentialRampToValueAtTime(2200, t + 1.3);
        o1.connect(master); o1.start(t); o1.stop(t + 1.4);

        // Harmonic layer
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain(); g2.gain.value = 0.3;
        o2.type = 'sawtooth';
        o2.frequency.setValueAtTime(160, t);
        o2.frequency.exponentialRampToValueAtTime(4400, t + 1.3);
        o2.connect(g2); g2.connect(master); o2.start(t); o2.stop(t + 1.4);

        // Crackle layer
        const o3 = ctx.createOscillator();
        const g3 = ctx.createGain(); g3.gain.value = 0.12;
        const f3 = ctx.createBiquadFilter();
        f3.type = 'bandpass'; f3.Q.value = 3;
        f3.frequency.setValueAtTime(800, t);
        f3.frequency.exponentialRampToValueAtTime(3000, t + 1.0);
        o3.type = 'sawtooth'; o3.frequency.value = 440;
        o3.connect(f3); f3.connect(g3); g3.connect(master);
        o3.start(t); o3.stop(t + 1.1);
    }

    // ── 9. Comm Start — communication link established ───────────────────
    function playCommStart() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(880, t);
        o.frequency.linearRampToValueAtTime(1320, t + 0.1);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.25);
    }

    // ── 10. Comm End — communication link closed ─────────────────────────
    function playCommEnd() {
        if (!_enabled || !_ensure()) return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(660, t);
        o.frequency.exponentialRampToValueAtTime(330, t + 0.28);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.38);
    }

    function setEnabled(v) { _enabled = v; }

    return {
        unlock,
        playBootChime, playUIActivation, playScanTone, playClick,
        startSystemHum, stopSystemHum,
        playConfirmTone, playProcessingBeep, playOrbPowerUp,
        playCommStart, playCommEnd, setEnabled,
    };
})();


// ─────────────────────────────────────────────────────────────────────────
// 3.  ORB CANVAS ENGINE — Cinematic Arc Reactor (Ultra 4K Multi-Layer HUD Core)
// ─────────────────────────────────────────────────────────────────────────
const JarvisOrb = (() => {
    const SIZE = 240;
    let canvas, ctx;
    let _state        = 'BOOT';
    let _t            = 0;
    let _amp          = 0;
    let _targetAmp    = 0;
    let _bootProgress = 0;
    let _bootStage    = 1; // 1 to 9
    let _animId       = null;

    // 7 Concentric Ring definitions
    const RING_DEFS = [
        { r: 24, spd:  0.009, segs: 3,  w: 2.5, phase: 0 },   // Core Arc
        { r: 42, spd: -0.012, segs: 6,  w: 2.0, phase: 1 },   // Inner Segmented Ring
        { r: 62, spd:  0.006, segs: 12, w: 1.5, phase: 2 },   // Calibration Ring
        { r: 78, spd: -0.004, segs: 24, w: 1.2, phase: 3 },   // Outer Gear Matrix
        { r: 94, spd:  0.003, segs: 36, w: 1.0, phase: 4 },   // Telemetry Ticks
        { r: 106, spd:-0.002, segs: 4,  w: 2.0, phase: 5 },   // Radar Crosshair Ring
        { r: 115, spd: 0.001, segs: 60, w: 0.8, phase: 6 },   // Outer Perimeter Ring
    ];
    let rings = RING_DEFS.map(d => ({ ...d, angle: Math.random() * Math.PI * 2 }));

    let particles  = [];
    let pulseWaves = [];
    let lastPulse  = 0;
    let arcs       = [];

    function mkParticle() {
        return {
            angle:   Math.random() * Math.PI * 2,
            r:       40 + Math.random() * 70,
            spd:     (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.015),
            size:    0.6 + Math.random() * 2.2,
            op:      Math.random() * 0.5 + 0.1,
            opTgt:   Math.random() * 0.7 + 0.1,
            opSpd:   0.008 + Math.random() * 0.02,
        };
    }

    function init(el) {
        if (!el) return;
        canvas = el;
        ctx    = canvas.getContext('2d');
        canvas.width  = SIZE;
        canvas.height = SIZE;
        particles = Array.from({ length: 60 }, mkParticle);
        _loop();
    }

    function _loop() {
        if (_animId) cancelAnimationFrame(_animId);
        function tick() { _animId = requestAnimationFrame(tick); _update(); _draw(); }
        tick();
    }

    function setState(s)         { _state = s; }
    function setBootProgress(p)  { _bootProgress = p; }
    function setBootStage(st)    { _bootStage = st; }
    function setAmplitude(a)     { _targetAmp = Math.max(0, Math.min(1, a)); }

    function _update() {
        _t += 0.016;

        const sm = { BOOT: 0.3 + _bootProgress * 0.7, IDLE: 1, LISTENING: 2.2, PROCESSING: 4.5, SPEAKING: 2.8, ERROR: 2 }[_state] || 1;
        rings.forEach(rg => { rg.angle += rg.spd * sm; });

        const AF = {
            BOOT:       () => _bootProgress * 0.95,
            IDLE:       () => 0.14 + Math.sin(_t * 0.65) * 0.06 + Math.sin(_t * 1.4) * 0.03,
            LISTENING:  () => 0.35 + Math.sin(_t * 4.5) * 0.18 + Math.sin(_t * 9) * 0.08,
            PROCESSING: () => 0.65 + Math.sin(_t * 9)  * 0.25 + Math.sin(_t * 17) * 0.12,
            SPEAKING:   () => 0.55 + Math.sin(_t * 2.8) * 0.28 + Math.sin(_t * 6.3) * 0.15,
            ERROR:      () => 0.4  + Math.sin(_t * 14) * 0.3,
            STANDBY:    () => 0.14 + Math.sin(_t * 0.65) * 0.06,
        };
        const fn = AF[_state] || AF.IDLE;
        _targetAmp = Math.max(0, Math.min(1, fn()));
        _amp += (_targetAmp - _amp) * 0.04;

        particles.forEach(p => {
            p.angle += p.spd;
            if (Math.abs(p.op - p.opTgt) < 0.01) p.opTgt = Math.random() * 0.7 + 0.05;
            p.op += (p.opTgt - p.op) * p.opSpd;
        });

        const pInterval = _state === 'PROCESSING' ? 0.22 : 0.65 + Math.random() * 0.3;
        if ((_state === 'SPEAKING' || _state === 'PROCESSING' || _state === 'LISTENING') && _t - lastPulse > pInterval) {
            pulseWaves.push({ r: 24, op: 0.8, spd: _state === 'PROCESSING' ? 2.6 : 1.6 });
            lastPulse = _t;
        }
        pulseWaves = pulseWaves.filter(w => { w.r += w.spd; w.op -= 0.016; return w.op > 0 && w.r < 118; });

        if ((_state === 'PROCESSING' || _state === 'BOOT') && Math.random() < 0.1) {
            arcs.push({
                ri:    1 + Math.floor(Math.random() * 5),
                angle: Math.random() * Math.PI * 2,
                span:  0.4 + Math.random() * 1.6,
                life:  1,
                dec:   0.04 + Math.random() * 0.05,
            });
        }
        arcs = arcs.filter(a => { a.life -= a.dec; return a.life > 0; });
    }

    function _colors() {
        return {
            BOOT:       { p: '#00E5FF', g: 'rgba(0,229,255,'   },
            IDLE:       { p: '#00E5FF', g: 'rgba(0,229,255,'   },
            LISTENING:  { p: '#38BDF8', g: 'rgba(56,189,248,'  },
            PROCESSING: { p: '#8B5CF6', g: 'rgba(139,92,246,'  },
            SPEAKING:   { p: '#00E5FF', g: 'rgba(0,229,255,'   },
            ERROR:      { p: '#EF4444', g: 'rgba(239,68,68,'   },
            STANDBY:    { p: '#00E5FF', g: 'rgba(0,229,255,'   },
        }[_state] || { p: '#00E5FF', g: 'rgba(0,229,255,' };
    }

    function _draw() {
        if (!ctx) return;
        const cx = SIZE / 2, cy = SIZE / 2;
        const c  = _colors();
        const I  = 0.35 + _amp * 0.65;

        ctx.clearRect(0, 0, SIZE, SIZE);

        // ── BOOT STAGE SPECIFIC DRAWING ─────────────────────────────────────
        if (_state === 'BOOT') {
            if (_bootStage === 1) {
                // Stage 1: Dormant — tiny pinpoint of cyan energy
                ctx.beginPath();
                ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#00E5FF';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00E5FF';
                ctx.fill();
                ctx.shadowBlur = 0;
                return;
            }
            if (_bootStage === 2) {
                // Stage 2: Ignition — expanding glowing core + shockwave pulse
                const pulseR = (_bootProgress * 100) % 40 + 5;
                ctx.beginPath();
                ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0,229,255, ${0.8 - pulseR/50})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // 1. Pulse shockwaves
        pulseWaves.forEach(w => {
            ctx.beginPath();
            ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
            ctx.strokeStyle = `${c.g}${(w.op * I).toFixed(3)})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();
        });

        // 2. Orbiting Particles
        particles.forEach(p => {
            const boost = _state === 'PROCESSING' ? 1.5 : _state === 'SPEAKING' ? 1.2 : 1;
            const x = cx + Math.cos(p.angle) * p.r;
            const y = cy + Math.sin(p.angle) * p.r;
            ctx.beginPath();
            ctx.arc(x, y, p.size * boost, 0, Math.PI * 2);
            ctx.fillStyle = `${c.g}${(p.op * I * boost).toFixed(3)})`;
            ctx.fill();
        });

        // 3. Multi-layer Concentric Rings
        rings.forEach((rg, idx) => {
            if (_state === 'BOOT' && _bootStage < 4 && idx > 1) return; // materialize sequentially
            _drawRing(cx, cy, rg, c, I, idx);
        });

        // 4. Scanning Energy Arcs
        arcs.forEach(a => {
            const rg = rings[a.ri] || rings[2];
            ctx.beginPath();
            ctx.arc(cx, cy, rg.r, a.angle, a.angle + a.span);
            ctx.strokeStyle = `${c.g}${(a.life * I * 0.95).toFixed(3)})`;
            ctx.lineWidth = 2.8;
            ctx.shadowBlur  = 16;
            ctx.shadowColor = c.p;
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // 5. Radial Core Glow
        const gR   = 28 + _amp * 28;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gR);
        grad.addColorStop(0,   `${c.g}${(0.95 * I).toFixed(3)})`);
        grad.addColorStop(0.5, `${c.g}${(0.35 * I).toFixed(3)})`);
        grad.addColorStop(1,   `${c.g}0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, gR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // 6. Triangular Reactor Core Matrix
        if (_state !== 'BOOT' || _bootStage >= 3) {
            _drawReactor(cx, cy, c, I);
        }

        // 7. Center Singularity
        const dR = 4 + _amp * 3.5;
        const dG = ctx.createRadialGradient(cx, cy, 0, cx, cy, dR * 2.8);
        dG.addColorStop(0,   '#ffffff');
        dG.addColorStop(0.4, c.p);
        dG.addColorStop(1,   `${c.g}0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, dR, 0, Math.PI * 2);
        ctx.fillStyle  = dG;
        ctx.shadowBlur  = 26;
        ctx.shadowColor = c.p;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 8. Percentage readouts around outer ring
        if (_state !== 'BOOT' || _bootStage >= 5) {
            ctx.save();
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = `${c.g}0.65)`;
            ctx.fillText(`${Math.round(85 + Math.sin(_t*2)*14)}%`, cx + 80, cy - 80);
            ctx.fillText('CORE: ACTIVE', cx - 110, cy + 95);
            ctx.restore();
        }
    }

    function _drawRing(cx, cy, rg, c, I, idx) {
        const gap    = 0.12;
        const segArc = (Math.PI * 2 / rg.segs) - gap;
        const active = ['PROCESSING','SPEAKING','LISTENING'].includes(_state);

        for (let i = 0; i < rg.segs; i++) {
            const sa = rg.angle + (Math.PI * 2 / rg.segs) * i;
            const ea = sa + segArc;
            const wave = 0.2 + 0.35 * (Math.sin(sa * 2.2 + _t * (1.8 + idx * 0.5) + rg.phase) + 1) / 2;
            const op = (wave * I * (active ? 1 : 0.6)).toFixed(3);

            ctx.beginPath();
            ctx.arc(cx, cy, rg.r, sa, ea);
            ctx.strokeStyle = `${c.g}${op})`;
            ctx.lineWidth   = rg.w;
            if (active) { ctx.shadowBlur = 8; ctx.shadowColor = c.p; }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    function _drawReactor(cx, cy, c, I) {
        _tri(cx, cy, 24 + _amp * 8, _t * 0.24,  c.p, 2.2, I,      true);
        _tri(cx, cy, 14 + _amp * 4, -_t * 0.6 + Math.PI / 3, c.p, 1.2, I * 0.7, false);

        if (_state === 'PROCESSING' || _state === 'SPEAKING' || _state === 'LISTENING') {
            _hex(cx, cy, 32 + _amp * 8, c, I);
        }
    }

    function _tri(cx, cy, r, angle, color, lw, op, fill) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const a = (Math.PI * 2 / 3) * i - Math.PI / 2;
            i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
                    : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath();
        ctx.globalAlpha  = op;
        ctx.strokeStyle  = color;
        ctx.lineWidth    = lw;
        ctx.shadowBlur   = 18;
        ctx.shadowColor  = color;
        ctx.stroke();
        if (fill) {
            ctx.globalAlpha = op * 0.2;
            ctx.fillStyle   = color;
            ctx.fill();
        }
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function _hex(cx, cy, r, c, I) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(_t * 0.85);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI * 2 / 6) * i;
            i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
                    : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath();
        ctx.globalAlpha = 0.3 * I;
        ctx.strokeStyle = c.p;
        ctx.lineWidth   = 0.9;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    return { init, setState, setBootProgress, setBootStage, setAmplitude };
})();


// ─────────────────────────────────────────────────────────────────────────
// 4.  CINEMATIC 9-STAGE AI ACTIVATION SEQUENCE
// ─────────────────────────────────────────────────────────────────────────
async function runBootSequence() {
    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    const overlay     = document.getElementById('jarvis-boot-overlay');
    const log         = document.getElementById('boot-log');
    const fillEl      = document.getElementById('boot-progress-fill');
    const statusEl    = document.getElementById('boot-status');

    JarvisOrb.setState('BOOT');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.className = 'boot-active';
    }
    if (log) log.innerHTML = '';

    function addLog(text, cls = 'log-cyan') {
        if (!log) return;
        const line = document.createElement('div');
        line.className = 'boot-log-line ' + cls;
        line.textContent = text;
        log.appendChild(line);
        if (log.children.length > 16) log.firstChild.remove();
        log.scrollTop = log.scrollHeight;
    }

    function setProgress(pct, stage) {
        if (fillEl) fillEl.style.width = pct + '%';
        JarvisOrb.setBootProgress(pct / 100);
        if (stage) JarvisOrb.setBootStage(stage);
    }

    function setStatus(txt) { if (statusEl) statusEl.textContent = txt; }

    JarvisSounds.unlock();

    // ── Stage 1 — Dormant ───────────────────────────────────────────────
    setProgress(0, 1);
    setStatus('STAGE 1: DORMANT');
    addLog('[ CORE   ] Energy point locked at origin (0,0)', 'log-muted');
    await delay(600);

    // ── Stage 2 — Ignition ──────────────────────────────────────────────
    setProgress(12, 2);
    setStatus('STAGE 2: IGNITION');
    JarvisSounds.playBootChime();
    addLog('[ IGNITE ] Rapid expansion pulse initiated...', 'log-cyan');
    await delay(700);

    // ── Stage 3 — Core Assembly ─────────────────────────────────────────
    setProgress(28, 3);
    setStatus('STAGE 3: CORE ASSEMBLY');
    overlay.classList.add('boot-phase-core');
    JarvisSounds.playUIActivation();
    addLog('[ STRUCT ] Assembling geometric triangular matrix', 'log-purple');
    await delay(750);

    // ── Stage 4 — Ring Formation ────────────────────────────────────────
    setProgress(45, 4);
    setStatus('STAGE 4: RING FORMATION');
    overlay.classList.add('boot-phase-rings');
    JarvisSounds.playScanTone();
    addLog('[ HOLO   ] Concentric magnetic rings materializing', 'log-cyan');
    await delay(700);

    // ── Stage 5 — Calibration ───────────────────────────────────────────
    setProgress(62, 5);
    setStatus('STAGE 5: CALIBRATION');
    addLog('[ CALIB  ] Radial tick marks & percentage meters ready', 'log-cyan');
    JarvisSounds.playProcessingBeep();
    await delay(650);

    // ── Stage 6 — HUD Initialization ────────────────────────────────────
    setProgress(78, 6);
    setStatus('STAGE 6: HUD INITIALIZATION');
    overlay.classList.add('boot-phase-surge');
    addLog('[ TELEM  ] Activating surrounding info telemetry grids', 'log-yellow');
    await delay(700);

    // ── Stage 7 — System Boot Text Sequence ─────────────────────────────
    setProgress(88, 7);
    setStatus('STAGE 7: SYSTEM BOOT');
    const bootLogs = [
        'INITIALIZING AI CORE',
        'NEURAL ENGINE ONLINE',
        'VOICE INTERFACE ONLINE',
        'SYSTEM CALIBRATION',
        'AUDIO PROCESSOR READY',
        'COGNITIVE ENGINE READY',
        'ALL SYSTEMS NOMINAL'
    ];
    for (const msg of bootLogs) {
        addLog(`[ BOOT   ] ${msg}`, 'log-online');
        await delay(160);
    }

    // ── Stage 8 — Final Energy Pulse ────────────────────────────────────
    setProgress(96, 8);
    setStatus('STAGE 8: FINAL ENERGY PULSE');
    overlay.classList.add('boot-phase-flash');
    JarvisSounds.playOrbPowerUp();
    await delay(800);
    overlay.classList.remove('boot-phase-flash');

    // ── Stage 9 — AI Online ─────────────────────────────────────────────
    setProgress(100, 9);
    setStatus('STAGE 9: JARVIS AI ONLINE');
    addLog('[ ONLINE ] VOICE INTERFACE READY', 'log-online');
    JarvisSounds.playConfirmTone();
    await delay(800);

    // Fade out overlay to normal interactive HUD
    overlay.classList.add('boot-phase-complete');
    await delay(900);
    overlay.style.display = 'none';

    JarvisHUD.setState('IDLE');
    JarvisSounds.startSystemHum();
}


// ─────────────────────────────────────────────────────────────────────────
// 5.  PROGRESSIVE TEXT RENDERER
// ─────────────────────────────────────────────────────────────────────────
function typeText(element, text, speedMs, onComplete) {
    if (!element) { if (onComplete) onComplete(); return; }
    speedMs = speedMs ?? 18;
    element.textContent = '';
    let i = 0;
    let cursor = document.createElement('span');
    cursor.className = 'text-cursor';
    cursor.textContent = '▋';
    element.appendChild(cursor);

    function next() {
        if (i >= text.length) {
            cursor.remove();
            if (onComplete) onComplete();
            return;
        }
        const ch = text[i++];
        cursor.insertAdjacentText('beforebegin', ch);
        const pause = ch === '.' || ch === '!' || ch === '?' ? speedMs * 6
                    : ch === ',' || ch === ';'               ? speedMs * 3
                    : speedMs;
        setTimeout(next, pause);
    }
    next();
}


// ─────────────────────────────────────────────────────────────────────────
// 6.  UTILITY HELPERS  (exposed globally for app.js to call)
// ─────────────────────────────────────────────────────────────────────────

function hudShowUserMessage(text) {
    const el = document.getElementById('hud-comm-user');
    if (el) {
        el.textContent = `[USER]: "${text}"`;
        el.classList.add('hud-msg-in');
        setTimeout(() => el.classList.remove('hud-msg-in'), 600);
    }
}

function hudShowResponse(text, onDone) {
    const el = document.getElementById('hud-comm-response');
    if (!el) { if (onDone) onDone(); return; }
    el.textContent = '';
    typeText(el, text, 16, onDone);
}

function hudClearComm() {
    const u = document.getElementById('hud-comm-user');
    const r = document.getElementById('hud-comm-response');
    if (u) u.textContent = '';
    if (r) r.textContent = '';
}


// ─────────────────────────────────────────────────────────────────────────
// 7.  BOOT ON DOM READY
// ─────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const sphereCanvas = document.getElementById('sphere-canvas');
    JarvisOrb.init(sphereCanvas);

    ['click','keydown','touchstart'].forEach(ev =>
        document.addEventListener(ev, () => JarvisSounds.unlock(), { once: true })
    );

    // Global listener to trigger re-boot
    window.rebootJarvis = runBootSequence;

    runBootSequence();
});

