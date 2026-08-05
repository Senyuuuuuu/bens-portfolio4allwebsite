/**
 * generate-all-audio.js
 * ─────────────────────────────────────────────────────────────────────────
 * Synthesizes ALL 12 audio files for KineticMorphingAd directly to WAV.
 * Pure Node.js — zero npm installs required.
 *
 * Run: node generate-all-audio.js
 * Output: all files written to ./public/
 * ─────────────────────────────────────────────────────────────────────────
 */
const fs = require("fs");
const path = require("path");

const PUBLIC = path.join(__dirname, "public");
const SAMPLE_RATE = 44100;
const CHANNELS = 2;

// ── WAV Encoding ──────────────────────────────────────────────────────────

/**
 * Encode a Float32Array (stereo interleaved, -1..1) to a WAV Buffer.
 */
function encodeWAV(samples) {
  const bytesPerSample = 2; // 16-bit
  const dataLen = samples.length * bytesPerSample;
  const buf = Buffer.alloc(44 + dataLen);

  // RIFF header
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);           // chunk size
  buf.writeUInt16LE(1, 20);            // PCM
  buf.writeUInt16LE(CHANNELS, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * CHANNELS * bytesPerSample, 28);
  buf.writeUInt16LE(CHANNELS * bytesPerSample, 32);
  buf.writeUInt16LE(16, 34);           // bits per sample
  buf.write("data", 36);
  buf.writeUInt32LE(dataLen, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * bytesPerSample);
  }
  return buf;
}

/** Write stereo WAV — monoSamples will be duplicated to both channels */
function writeWAV(filename, monoSamples) {
  const stereo = new Float32Array(monoSamples.length * 2);
  for (let i = 0; i < monoSamples.length; i++) {
    stereo[i * 2]     = monoSamples[i];
    stereo[i * 2 + 1] = monoSamples[i];
  }
  const wavPath = path.join(PUBLIC, filename);
  fs.writeFileSync(wavPath, encodeWAV(stereo));
  const kb = (fs.statSync(wavPath).size / 1024).toFixed(0);
  console.log(`  ✓ ${filename.padEnd(26)} ${kb}KB`);
}

// ── Synthesis Primitives ──────────────────────────────────────────────────

const TWO_PI = Math.PI * 2;

const osc = {
  sine:     (t, f) => Math.sin(TWO_PI * f * t),
  square:   (t, f) => Math.sign(Math.sin(TWO_PI * f * t)),
  sawtooth: (t, f) => 2 * ((f * t) % 1) - 1,
  triangle: (t, f) => Math.abs(2 * ((f * t) % 1) - 1) * 2 - 1,
};

/** ADSR envelope (all in seconds) */
function adsr(t, dur, a = 0.01, d = 0.05, s = 0.7, r = 0.1) {
  if (t < a)             return t / a;
  if (t < a + d)         return 1 - (1 - s) * ((t - a) / d);
  if (t < dur - r)       return s;
  const rStart = dur - r;
  return Math.max(0, s * (1 - (t - rStart) / r));
}

/** Simple one-pole low-pass filter */
function lowpass(samples, cutoff) {
  const rc = 1 / (TWO_PI * cutoff);
  const dt = 1 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    prev = prev + alpha * (samples[i] - prev);
    samples[i] = prev;
  }
}

/** Simple reverb via comb + allpass */
function reverb(samples, wet = 0.25, delay = 0.06) {
  const d = Math.floor(delay * SAMPLE_RATE);
  const buf = new Float32Array(d);
  let idx = 0;
  for (let i = 0; i < samples.length; i++) {
    const echo = buf[idx];
    buf[idx] = samples[i] + echo * 0.4;
    idx = (idx + 1) % d;
    samples[i] = samples[i] * (1 - wet) + echo * wet;
  }
}

/** Generate silence */
const silence = (dur) => new Float32Array(Math.floor(dur * SAMPLE_RATE));

/** Mix multiple sample arrays together (must be same length) */
function mix(...tracks) {
  const len = Math.max(...tracks.map((t) => t.length));
  const out = new Float32Array(len);
  for (const t of tracks) {
    for (let i = 0; i < t.length; i++) out[i] += t[i];
  }
  return out;
}

/** Apply gain with soft clip */
function gain(samples, g) {
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i] * g;
    samples[i] = Math.tanh(v);  // soft clip
  }
  return samples;
}

/** Fade in/out */
function fade(samples, inS = 0.02, outS = 0.05) {
  const inN  = Math.floor(inS  * SAMPLE_RATE);
  const outN = Math.floor(outS * SAMPLE_RATE);
  for (let i = 0; i < inN; i++)  samples[i] *= i / inN;
  for (let i = 0; i < outN; i++) samples[samples.length - 1 - i] *= i / outN;
  return samples;
}

/** Generate tone samples */
function tone(freq, dur, vol = 0.6, wave = "sine", a = 0.01, d = 0.05, s = 0.7, r = 0.08) {
  const n = Math.floor(dur * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    out[i] = vol * osc[wave](t, freq) * adsr(t, dur, a, d, s, r);
  }
  return out;
}

/** Frequency sweep */
function sweep(f0, f1, dur, vol = 0.5, wave = "sine") {
  const n = Math.floor(dur * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f = f0 + (f1 - f0) * (t / dur);
    const env = adsr(t, dur, 0.001, 0.01, 0.6, 0.15);
    out[i] = vol * osc[wave](t, f) * env;
  }
  return out;
}

/** Chord (multiple freqs simultaneously) */
function chord(freqs, dur, vol = 0.4, wave = "sine") {
  const n = Math.floor(dur * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (const f of freqs) {
    for (let i = 0; i < n; i++) {
      const t = i / SAMPLE_RATE;
      out[i] += (vol / freqs.length) * osc[wave](t, f) * adsr(t, dur, 0.02, 0.1, 0.65, 0.2);
    }
  }
  return out;
}

/** Concat sample arrays */
function concat(...parts) {
  const len = parts.reduce((a, b) => a + b.length, 0);
  const out = new Float32Array(len);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

/** Noise burst */
function noise(dur, vol = 0.3, cutoffHz = 2000) {
  const n = Math.floor(dur * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = (Math.random() * 2 - 1) * vol;
  lowpass(out, cutoffHz);
  fade(out, 0.002, 0.03);
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════
//  GENERATE EACH FILE
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n🎵 Synthesizing audio for KineticMorphingAd...\n");

// ── 1. bg_music.mp3 → bg_music.wav ────────────────────────────────────────
// 25-second corporate tech underscore
// Pulsing arpeggio in C major pentatonic over sustained pad
{
  const BPM = 120;
  const BEAT = 60 / BPM;
  const DUR  = 25.5;

  // Sustained pad — Cmaj7 voicing
  const PAD_FREQS = [130.81, 164.81, 196.00, 246.94, 293.66]; // C3 E3 G3 B3 D4
  const padLen    = Math.floor(DUR * SAMPLE_RATE);
  const pad       = new Float32Array(padLen);
  for (const f of PAD_FREQS) {
    for (let i = 0; i < padLen; i++) {
      const t = i / SAMPLE_RATE;
      // Slow vibrato
      const vib = 1 + 0.002 * Math.sin(TWO_PI * 5.5 * t);
      const env = Math.min(1, t / 1.5) * Math.max(0, 1 - Math.max(0, t - 23) / 2.5);
      pad[i] += 0.07 * osc.sine(t, f * vib) * env;
    }
  }

  // Arpeggio pattern: C E G B D (pentatonic up then down)
  const ARP = [261.63, 329.63, 392.00, 493.88, 587.33, 392.00, 329.63, 261.63];
  const arpOut = new Float32Array(padLen);
  let step = 0;
  let nextBeat = BEAT * 0.25;
  for (let i = 0; i < padLen; i++) {
    const t = i / SAMPLE_RATE;
    if (t >= nextBeat) {
      step++;
      nextBeat += BEAT * 0.25;
    }
    const f = ARP[step % ARP.length];
    const tInBeat = t - (nextBeat - BEAT * 0.25);
    const env = Math.exp(-tInBeat * 12) * Math.min(1, t / 0.3) * Math.max(0, 1 - Math.max(0, t - 23) / 2.5);
    arpOut[i] = 0.18 * osc.triangle(t, f) * env;
  }

  // Kick: every beat
  const kick = new Float32Array(padLen);
  for (let b = 0; b < DUR / BEAT; b++) {
    const start = Math.floor(b * BEAT * SAMPLE_RATE);
    for (let s = 0; s < Math.floor(0.12 * SAMPLE_RATE) && start + s < padLen; s++) {
      const t = s / SAMPLE_RATE;
      const f = 80 * Math.exp(-t * 40);
      kick[start + s] = 0.28 * Math.sin(TWO_PI * f * t) * Math.exp(-t * 18);
    }
  }

  // Hi-hat: every 8th note
  const hat = new Float32Array(padLen);
  for (let b = 0; b < DUR / (BEAT * 0.5); b++) {
    const start = Math.floor(b * BEAT * 0.5 * SAMPLE_RATE);
    for (let s = 0; s < Math.floor(0.03 * SAMPLE_RATE) && start + s < padLen; s++) {
      const t = s / SAMPLE_RATE;
      hat[start + s] = 0.06 * (Math.random() * 2 - 1) * Math.exp(-t * 80);
    }
  }

  // Bass line: root notes C2 G2 alternating every 2 beats
  const bass = new Float32Array(padLen);
  const BASS_NOTES = [65.41, 98.00, 65.41, 73.42, 65.41, 98.00, 87.31, 65.41];
  for (let b = 0; b < BASS_NOTES.length; b++) {
    const start = Math.floor(b * BEAT * 2 * SAMPLE_RATE);
    const dur   = BEAT * 1.8;
    for (let s = 0; s < Math.floor(dur * SAMPLE_RATE) && start + s < padLen; s++) {
      const t = s / SAMPLE_RATE;
      const env = Math.min(1, t / 0.02) * Math.exp(-t * 2.5);
      bass[start + s] = 0.22 * osc.sine(t, BASS_NOTES[b]) * env;
    }
  }
  lowpass(bass, 280);

  const bgMix = mix(pad, arpOut, kick, hat, bass);
  gain(bgMix, 0.88);
  reverb(bgMix, 0.18, 0.07);
  fade(bgMix, 0.5, 1.2);
  writeWAV("bg_music.wav", bgMix);
}

// ── 2. sub_impact.wav ─────────────────────────────────────────────────────
{
  const DUR = 0.6;
  const n   = Math.floor(DUR * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t   = i / SAMPLE_RATE;
    const fq  = 55 * Math.exp(-t * 28);     // pitch drop
    const env = Math.exp(-t * 9);
    out[i]    = 0.85 * Math.sin(TWO_PI * fq * t) * env;
    out[i]   += 0.12 * (Math.random() * 2 - 1) * Math.exp(-t * 40); // click transient
  }
  lowpass(out, 180);
  gain(out, 0.92);
  writeWAV("sub_impact.wav", out);
}

// ── 3. card_whoosh.wav ────────────────────────────────────────────────────
{
  const DUR = 0.5;
  const n   = Math.floor(DUR * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t   = i / SAMPLE_RATE;
    const env = Math.pow(Math.sin(Math.PI * t / DUR), 0.6);
    out[i]    = (Math.random() * 2 - 1) * 0.5 * env;
  }
  // Bandpass-style: combine HPF and LPF
  lowpass(out, 3200);
  // Simple HPF approximation via difference
  const hp = new Float32Array(n);
  let prev = 0;
  const a  = 0.92;
  for (let i = 0; i < n; i++) {
    hp[i] = a * (hp[i > 0 ? i - 1 : 0] + out[i] - prev);
    prev  = out[i];
  }
  // Add subtle pitch sweep
  const sw = sweep(800, 180, DUR, 0.12, "sine");
  const wh = mix(hp, sw);
  gain(wh, 0.78);
  writeWAV("card_whoosh.wav", wh);
}

// ── 4. glass_click.wav ────────────────────────────────────────────────────
{
  // Sharp transient + high-freq ring-down
  const DUR = 0.3;
  const n   = Math.floor(DUR * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    // Click transient
    out[i]  = 0.6 * Math.exp(-t * 120) * (Math.random() * 2 - 1);
    // Glass ring (high freq sine)
    out[i] += 0.35 * Math.sin(TWO_PI * 3200 * t) * Math.exp(-t * 28);
    out[i] += 0.18 * Math.sin(TWO_PI * 5400 * t) * Math.exp(-t * 45);
    out[i] += 0.10 * Math.sin(TWO_PI * 7800 * t) * Math.exp(-t * 62);
  }
  gain(out, 0.82);
  writeWAV("glass_click.wav", out);
}

// ── 5. mobile_pop.wav ─────────────────────────────────────────────────────
{
  const DUR = 0.18;
  const n   = Math.floor(DUR * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    // Pitch pop: quick rise then decay
    const f = 1400 + 800 * Math.exp(-t * 60);
    const e = adsr(t, DUR, 0.003, 0.02, 0.0, 0.12);
    out[i]  = 0.55 * Math.sin(TWO_PI * f * t) * e;
    out[i] += 0.15 * osc.triangle(t, f * 2) * e;
  }
  gain(out, 0.85);
  writeWAV("mobile_pop.wav", out);
}

// ── 6. data_ticks.wav ─────────────────────────────────────────────────────
{
  // 2.7 seconds of rapid ticking — mechanical data-stream sound
  const DUR      = 2.7;
  const TICK_DUR = 0.028;
  const TICK_INT = 0.048;
  const n        = Math.floor(DUR * SAMPLE_RATE);
  const out      = new Float32Array(n);
  let   tickAt   = 0.01;
  const FREQS    = [1100, 1240, 980, 1380];
  let   fi       = 0;
  while (tickAt < DUR - TICK_DUR) {
    const start = Math.floor(tickAt * SAMPLE_RATE);
    const f     = FREQS[fi % FREQS.length];
    fi++;
    const tn  = Math.floor(TICK_DUR * SAMPLE_RATE);
    for (let s = 0; s < tn && start + s < n; s++) {
      const t  = s / SAMPLE_RATE;
      const e  = adsr(t, TICK_DUR, 0.001, 0.005, 0.0, TICK_DUR * 0.8);
      out[start + s] += 0.28 * osc.square(t, f) * e;
      out[start + s] += 0.14 * osc.sine(t, f * 1.5) * e;
    }
    tickAt += TICK_INT * (0.85 + Math.random() * 0.3);
  }
  lowpass(out, 5000);
  gain(out, 0.72);
  reverb(out, 0.08, 0.02);
  writeWAV("data_ticks.wav", out);
}

// ── 7. node_pops.wav ──────────────────────────────────────────────────────
{
  // 4 consecutive bubble pops, 0.13s apart
  const POP_DUR = 0.22;
  const POP_GAP = 0.13;
  const TOTAL   = POP_GAP * 4 + POP_DUR;
  const PFREQS  = [700, 840, 980, 1120];
  const parts   = [];
  for (let i = 0; i < 4; i++) {
    const pop = new Float32Array(Math.floor(POP_DUR * SAMPLE_RATE));
    const f0  = PFREQS[i];
    for (let s = 0; s < pop.length; s++) {
      const t  = s / SAMPLE_RATE;
      const f  = f0 + f0 * 0.4 * Math.exp(-t * 30);
      const e  = adsr(t, POP_DUR, 0.003, 0.04, 0.0, 0.15);
      pop[s]   = 0.5 * Math.sin(TWO_PI * f * t) * e;
      pop[s]  += 0.12 * osc.triangle(t, f * 2) * e;
    }
    gain(pop, 0.88);
    const gap = new Float32Array(Math.floor(POP_GAP * SAMPLE_RATE));
    parts.push(gap, pop);
  }
  const out = concat(...parts);
  reverb(out, 0.12, 0.04);
  writeWAV("node_pops.wav", out);
}

// ── 8. success_chime.wav ──────────────────────────────────────────────────
{
  // Bright ascending 3-note chime (C5 E5 G5) with shimmer
  const NOTES   = [523.25, 659.25, 783.99];
  const NOTE_DUR = 0.38;
  const parts   = [];
  for (let i = 0; i < NOTES.length; i++) {
    const f  = NOTES[i];
    const n  = Math.floor(NOTE_DUR * SAMPLE_RATE);
    const s  = new Float32Array(n);
    for (let j = 0; j < n; j++) {
      const t  = j / SAMPLE_RATE;
      const e  = adsr(t, NOTE_DUR, 0.004, 0.08, 0.45, 0.18);
      s[j]     = 0.5 * Math.sin(TWO_PI * f * t) * e;          // fundamental
      s[j]    += 0.18 * Math.sin(TWO_PI * f * 2 * t) * e;    // 2nd harmonic
      s[j]    += 0.08 * Math.sin(TWO_PI * f * 3 * t) * e;    // 3rd harmonic
      s[j]    += 0.04 * Math.sin(TWO_PI * f * 4.02 * t) * e; // inharmonic shimmer
    }
    gain(s, 0.9);
    // Stagger by 0.22s
    const gapLen = Math.floor(0.22 * SAMPLE_RATE * i);
    const padded = concat(new Float32Array(gapLen), s);
    parts.push(padded);
  }
  const maxLen = Math.max(...parts.map((p) => p.length));
  const out    = new Float32Array(maxLen);
  for (const p of parts) {
    for (let i = 0; i < p.length; i++) out[i] += p[i];
  }
  reverb(out, 0.28, 0.09);
  gain(out, 0.82);
  writeWAV("success_chime.wav", out);
}

// ── 9. zoom_swoosh.wav ────────────────────────────────────────────────────
{
  // Fast descending sweep + noise burst — camera-push energy
  const DUR = 0.38;
  const sw  = sweep(2400, 90, DUR, 0.55, "sawtooth");
  const no  = noise(DUR, 0.22, 1200);
  const out = mix(sw, no);
  gain(out, 0.85);
  writeWAV("zoom_swoosh.wav", out);
}

// ── 10. review_ping.wav ───────────────────────────────────────────────────
{
  // Apple-style notification: two-tone glass ping A5 + C#6
  const NOTES   = [880, 1108.73];
  const NOTE_DUR = 0.55;
  const maxLen  = Math.floor((NOTE_DUR + 0.12) * SAMPLE_RATE);
  const out     = new Float32Array(maxLen);
  const offsets = [0, 0.12];
  for (let ni = 0; ni < NOTES.length; ni++) {
    const f     = NOTES[ni];
    const start = Math.floor(offsets[ni] * SAMPLE_RATE);
    for (let s = 0; s < Math.floor(NOTE_DUR * SAMPLE_RATE) && start + s < maxLen; s++) {
      const t = s / SAMPLE_RATE;
      const e = adsr(t, NOTE_DUR, 0.002, 0.06, 0.3, 0.28);
      out[start + s] += 0.45 * Math.sin(TWO_PI * f * t) * e;
      out[start + s] += 0.15 * Math.sin(TWO_PI * f * 2 * t) * e;
      out[start + s] += 0.06 * Math.sin(TWO_PI * f * 3 * t) * e;
    }
  }
  reverb(out, 0.22, 0.06);
  gain(out, 0.85);
  writeWAV("review_ping.wav", out);
}

// ── 11. orbit_flutter.wav ─────────────────────────────────────────────────
{
  // 10 icon pops in radial sequence, ascending pitch ramp
  const POP_DUR = 0.12;
  const TOTAL   = 10 * 0.04 + POP_DUR + 0.1;
  const n       = Math.floor(TOTAL * SAMPLE_RATE);
  const out     = new Float32Array(n);
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(i * 0.04 * SAMPLE_RATE);
    const f     = 500 + i * 80;
    for (let s = 0; s < Math.floor(POP_DUR * SAMPLE_RATE) && start + s < n; s++) {
      const t = s / SAMPLE_RATE;
      const fv = f + f * 0.5 * Math.exp(-t * 40);
      const e  = adsr(t, POP_DUR, 0.002, 0.02, 0.0, 0.08);
      out[start + s] += 0.38 * Math.sin(TWO_PI * fv * t) * e;
      out[start + s] += 0.10 * osc.triangle(t, fv * 1.5) * e;
    }
  }
  reverb(out, 0.15, 0.05);
  gain(out, 0.82);
  writeWAV("orbit_flutter.wav", out);
}

// ── 12. final_chime.wav ───────────────────────────────────────────────────
{
  // Warm corporate logo chime — C major chord ascending, rich harmonics
  // C4 E4 G4 C5 — staggered 0.18s
  const NOTES    = [261.63, 329.63, 392.00, 523.25];
  const NOTE_DUR = 1.4;
  const STAGGER  = 0.18;
  const maxLen   = Math.floor((NOTE_DUR + STAGGER * (NOTES.length - 1) + 0.5) * SAMPLE_RATE);
  const out      = new Float32Array(maxLen);

  for (let ni = 0; ni < NOTES.length; ni++) {
    const f     = NOTES[ni];
    const start = Math.floor(STAGGER * ni * SAMPLE_RATE);
    for (let s = 0; s < Math.floor(NOTE_DUR * SAMPLE_RATE) && start + s < maxLen; s++) {
      const t = s / SAMPLE_RATE;
      const e = adsr(t, NOTE_DUR, 0.006, 0.12, 0.4, 0.55);
      out[start + s] += 0.38 * Math.sin(TWO_PI * f * t) * e;           // fundamental
      out[start + s] += 0.14 * Math.sin(TWO_PI * f * 2 * t) * e;      // 2nd
      out[start + s] += 0.07 * Math.sin(TWO_PI * f * 3 * t) * e;      // 3rd
      out[start + s] += 0.03 * Math.sin(TWO_PI * f * 4.01 * t) * e;   // shimmer
      // Marimba-style attack
      out[start + s] += 0.22 * Math.sin(TWO_PI * f * t) * Math.exp(-t * 25) * (s < 3 ? 1 : 0);
    }
  }
  reverb(out, 0.32, 0.11);
  gain(out, 0.85);
  fade(out, 0.05, 0.6);
  writeWAV("final_chime.wav", out);
}

console.log("\n✅ All 12 audio files generated in /public/");
console.log("   These are .wav files — AudioLayer.tsx uses staticFile() which accepts WAV.");
console.log("   Update AudioLayer.tsx file extensions: .mp3 → .wav (or rename the files).\n");
