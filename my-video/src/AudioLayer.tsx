import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { mouseClick, ding } from "@remotion/sfx";

/* ═══════════════════════════════════════════════════════════════════════════
   AUDIO LAYER — KineticMorphingAd 25-Second Edition (.wav edition)
   ─────────────────────────────────────────────────────────────────────────
   Active frame-synced sound effects:
   1. sub_impact.wav     (Frame 150 lockup)
   2. glass_click.wav    (Frame 410 cursor click)
   3. mobile_pop.wav     (Frame 444 mobile preview)
   4. data_ticks.wav     (Frames 600–780 data stream)
   5. node_pops.wav      (Frames 920–944 n8n node sequence)
   6. success_chime.wav  (Frame 1020 checkmark success)
   7. review_ping.wav    (Frames 1180 & 1220 review cards)
   8. orbit_flutter.wav  (Frame 1332 radial orbit)
   9. final_chime.wav    (Frame 1400 Fiverr CTA outro)
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Volume helpers ──────────────────────────────────────────────────────────

/** Fade out in final `fadeFrames` of a `total`-frame clip */
const rampOut = (
  f: number,
  total: number,
  fadeFrames: number,
  vol = 1,
): number =>
  f >= total - fadeFrames ? Math.max(0, (vol * (total - f)) / fadeFrames) : vol;

/** Ramp in then ramp out */
const rampBoth = (
  f: number,
  total: number,
  inF: number,
  outF: number,
  vol: number,
): number => {
  const inVal = Math.min(1, f / inF);
  const outVal = f >= total - outF ? Math.max(0, (total - f) / outF) : 1;
  return vol * inVal * outVal;
};

export const AudioLayer: React.FC = () => {
  return (
    <>
      {/* Background music removed per prompt instructions */}
      {/* ══════════════════════════════════════════════════════════════
          SCENE 1: Kinetic Hook (0.0s – 4.0s / Frames 0–240)
          ══════════════════════════════════════════════════════════════ */}
      {/* Typing ticks — mouseClick at staggered intervals */}
      {[8, 26, 44, 62, 80, 98, 116, 134].map((f) => (
        <Sequence key={`tick-${f}`} from={f} durationInFrames={72}>
          <Audio src={mouseClick} volume={0.22} />
        </Sequence>
      ))}
      {/* 2. SUB-BASS IMPACT (sub_impact.wav) — Frame 150 lockup */}
      <Sequence from={150} durationInFrames={24}>
        <Audio
          src={staticFile("sub_impact.wav")}
          volume={(f) => rampOut(f, 24, 10, 0.65)}
        />
      </Sequence>
      {/* ══════════════════════════════════════════════════════════════
          SCENE 2: Web Design & Responsive Build (4.0s – 9.0s / Frames 240–540)
          ══════════════════════════════════════════════════════════════ */}
      {/* 3. GLASS CLICK (glass_click.wav) — Frame 410 Mac cursor click */}
      <Sequence from={410} durationInFrames={18}>
        <Audio
          src={staticFile("glass_click.wav")}
          volume={(f) => rampOut(f, 18, 8, 0.72)}
        />
      </Sequence>
      {/* 4. MOBILE POP (mobile_pop.wav) — Frame 444 mobile card slide-out */}
      <Sequence from={444} durationInFrames={18}>
        <Audio
          src={staticFile("mobile_pop.wav")}
          volume={(f) => rampOut(f, 18, 8, 0.55)}
        />
      </Sequence>
      {/* ══════════════════════════════════════════════════════════════
          SCENE 3: Data Entry & CSV Parsing (9.0s – 14.0s / Frames 540–840)
          ══════════════════════════════════════════════════════════════ */}
      {/* 5. DATA TICKS (data_ticks.wav) — Frames 600–780 CSV parsing stream */}
      <Sequence from={600} durationInFrames={180}>
        <Audio
          src={staticFile("data_ticks.wav")}
          volume={(f) => {
            if (f < 14) return (f / 14) * 0.55;
            if (f > 156) return Math.max(0, (0.55 * (180 - f)) / 24);
            return 0.55;
          }}
        />
      </Sequence>
      {/* ══════════════════════════════════════════════════════════════
          SCENE 4: n8n Node Ecosystem (14.0s – 19.0s / Frames 840–1140)
          ══════════════════════════════════════════════════════════════ */}
      {/* 6. NODE POPS (node_pops.wav) — Frames 920–944 4 bubble pops */}
      {[920, 928, 936, 944].map((startFrame, i) => (
        <Sequence key={`node-${i}`} from={startFrame} durationInFrames={16}>
          <Audio
            src={staticFile("node_pops.wav")}
            volume={(f) => rampOut(f, 16, 6, 0.6)}
          />
        </Sequence>
      ))}
      {/* 7. SUCCESS CHIME (success_chime.wav) — Frame 1020 checkmark success */}
      <Sequence from={1020} durationInFrames={70}>
        <Audio
          src={staticFile("success_chime.wav")}
          volume={(f) => rampBoth(f, 70, 8, 16, 0.85)}
        />
      </Sequence>
      {/* ══════════════════════════════════════════════════════════════
          SCENE 5: Proof & Fiverr Review Cards (19.0s – 22.0s / Frames 1140–1320)
          ══════════════════════════════════════════════════════════════ */}
      {/* 8. REVIEW PING (review_ping.wav) — Frame 1180 review card #1 */}
      <Sequence from={1180} durationInFrames={24}>
        <Audio
          src={staticFile("review_ping.wav")}
          volume={(f) => rampOut(f, 24, 10, 0.6)}
        />
      </Sequence>
      {/* REVIEW PING (review_ping.wav) — Frame 1220 review card #2 */}
      <Sequence from={1220} durationInFrames={24}>
        <Audio
          src={staticFile("review_ping.wav")}
          volume={(f) => rampOut(f, 24, 10, 0.52)}
        />
      </Sequence>
      {/* ══════════════════════════════════════════════════════════════
          SCENE 6: Radial Orbit Outro & Fiverr CTA (22.0s – 25.0s / Frames 1320–1500)
          ══════════════════════════════════════════════════════════════ */}
      {/* 9. ORBIT FLUTTER (orbit_flutter.wav) — Frame 1332 radial 10-pop burst */}
      <Sequence from={1332} durationInFrames={32}>
        <Audio
          src={staticFile("orbit_flutter.wav")}
          volume={(f) => rampBoth(f, 32, 4, 10, 0.55)}
        />
      </Sequence>
      {/* 10. FINAL CHIME (final_chime.wav) — Frame 1400 Fiverr logo CTA chime */}
      <Sequence from={1400} durationInFrames={90}>
        <Audio
          src={staticFile("final_chime.wav")}
          volume={(f) => rampBoth(f, 90, 8, 22, 0.85)}
        />
      </Sequence>
      {/* Outro accents */}
      {[1400, 1412, 1424, 1438].map((f, i) => (
        <Sequence key={`outro-${i}`} from={f} durationInFrames={24}>
          <Audio src={ding} volume={0.45 + i * 0.05} />
        </Sequence>
      ))}
    </>
  );
};
