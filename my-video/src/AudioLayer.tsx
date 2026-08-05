import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import {
  mouseClick,
  ding,
  uiSwitch,
  whoosh,
  pageTurn,
  snapchatNotification,
} from "@remotion/sfx";

/* ═══════════════════════════════════════════════════════════════════════════
   AUDIO LAYER — KineticMorphingAd 25-Second Edition
   ─────────────────────────────────────────────────────────────────────────
   Architecture:
   • Real SFX files in /public are loaded via <Audio> + <Sequence>
   • @remotion/sfx built-in sounds fire as procedural cues for key events
   • All delays expressed as <Sequence from={N}> — no CSS, no promises
   • Volume envelopes via callback (f => ...) for smooth fades

   DROP-IN AUDIO FILE GUIDE (place in /public):
   ┌─────────────────────┬────────────────────────────────────────────────┐
   │ Filename            │ Scene & Sound Design Brief                     │
   ├─────────────────────┼────────────────────────────────────────────────┤
   │ bg_music.mp3        │ 25s corporate tech underscore, looped @ 0.22   │
   │ sub_impact.mp3      │ Frame 150 — sub-bass thump on final lockup     │
   │ card_whoosh.mp3     │ Frame 200 — smooth air whoosh, pill morph      │
   │ glass_click.mp3     │ Frame 410 — glass haptic button click          │
   │ mobile_pop.mp3      │ Frame 444 — soft app card pop                  │
   │ data_ticks.mp3      │ Frame 620 — rapid mechanical counter ticks     │
   │ node_pops.mp3       │ Frame 920 — 4 consecutive soft bubble pops     │
   │ success_chime.mp3   │ Frame 1020 — bright 3-note ascending chime     │
   │ zoom_swoosh.mp3     │ Frame 1120 — fast camera zoom swoosh           │
   │ review_ping.mp3     │ Frame 1180 — Apple-style glass notification    │
   │ orbit_flutter.mp3   │ Frame 1332 — radial 10-pop flutter             │
   │ final_chime.mp3     │ Frame 1400 — warm corporate logo chime         │
   └─────────────────────┴────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Volume helpers ──────────────────────────────────────────────────────────

/** Fade in over `fadeFrames`, hold at vol until end */
const rampIn = (f: number, fadeFrames: number, vol: number): number =>
  Math.min(vol, (f / fadeFrames) * vol);

/** Fade out in final `fadeFrames` of a `total`-frame clip */
const rampOut = (f: number, total: number, fadeFrames: number, vol = 1): number =>
  f >= total - fadeFrames ? Math.max(0, vol * (total - f) / fadeFrames) : vol;

/** Ramp in then ramp out */
const rampBoth = (f: number, total: number, inF: number, outF: number, vol: number): number => {
  const inVal  = Math.min(1, f / inF);
  const outVal = f >= total - outF ? Math.max(0, (total - f) / outF) : 1;
  return vol * inVal * outVal;
};

export const AudioLayer: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          BACKGROUND MUSIC — loops for full 25s
          ══════════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <Audio
          src={staticFile("bg_music.mp3")}
          volume={(f) => {
            const fadeStart = durationInFrames - 90;
            if (f < 30) return (f / 30) * 0.22;
            if (f >= fadeStart) return Math.max(0, 0.22 * (durationInFrames - f) / 90);
            return 0.22;
          }}
          loop
        />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════
          SCENE 1: Kinetic Hook (0–240)
          Keyboard ticks every 18f + sub-bass impact at frame 150
          ══════════════════════════════════════════════════════════════ */}

      {/* Procedural typing ticks — mouseClick at staggered intervals */}
      {[8, 26, 44, 62, 80, 98, 116, 134].map((f) => (
        <Sequence key={`tick-${f}`} from={f} durationInFrames={6}>
          <Audio src={mouseClick} volume={0.22} />
        </Sequence>
      ))}

      {/* Sub-bass thump: heavy page turn sound pitched down */}
      <Sequence from={150} durationInFrames={24}>
        <Audio
          src={staticFile("sub_impact.mp3")}
          volume={(f) => rampOut(f, 24, 10, 0.62)}
        />
      </Sequence>

      {/* @remotion/sfx accent on lockup */}
      <Sequence from={152} durationInFrames={8}>
        <Audio src={uiSwitch} volume={0.35} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════
          SCENE 2: Web Design & Cursor (240–540)
          Air whoosh on morph + haptic glass click + mobile pop
          ══════════════════════════════════════════════════════════════ */}

      {/* Pill morph air whoosh */}
      <Sequence from={200} durationInFrames={40}>
        <Audio
          src={staticFile("card_whoosh.mp3")}
          volume={(f) => rampBoth(f, 40, 5, 12, 0.45)}
        />
      </Sequence>
      {/* Procedural whoosh accent */}
      <Sequence from={202} durationInFrames={12}>
        <Audio src={whoosh} volume={0.38} />
      </Sequence>

      {/* Card-to-card morph whoosh frame 530 */}
      <Sequence from={530} durationInFrames={30}>
        <Audio
          src={staticFile("card_whoosh.mp3")}
          volume={(f) => rampBoth(f, 30, 4, 10, 0.35)}
        />
      </Sequence>

      {/* Glass haptic button click — frame 410 */}
      <Sequence from={410} durationInFrames={18}>
        <Audio
          src={staticFile("glass_click.mp3")}
          volume={(f) => rampOut(f, 18, 8, 0.68)}
        />
      </Sequence>
      {/* Procedural mouseClick accent */}
      <Sequence from={411} durationInFrames={6}>
        <Audio src={mouseClick} volume={0.55} />
      </Sequence>

      {/* Mobile preview pop — frame 444 */}
      <Sequence from={444} durationInFrames={18}>
        <Audio
          src={staticFile("mobile_pop.mp3")}
          volume={(f) => rampOut(f, 18, 8, 0.42)}
        />
      </Sequence>
      <Sequence from={445} durationInFrames={8}>
        <Audio src={uiSwitch} volume={0.3} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════
          SCENE 3: Data Entry (540–840)
          Canvas expand whoosh + rapid data stream ticks
          ══════════════════════════════════════════════════════════════ */}

      {/* Canvas expand slide */}
      <Sequence from={540} durationInFrames={30}>
        <Audio
          src={staticFile("card_whoosh.mp3")}
          volume={(f) => rampBoth(f, 30, 4, 10, 0.32)}
        />
      </Sequence>
      <Sequence from={542} durationInFrames={10}>
        <Audio src={pageTurn} volume={0.28} />
      </Sequence>

      {/* Data stream ticks (frames 600–780) */}
      <Sequence from={600} durationInFrames={180}>
        <Audio
          src={staticFile("data_ticks.mp3")}
          volume={(f) => {
            if (f < 14) return (f / 14) * 0.5;
            if (f > 156) return Math.max(0, 0.5 * (180 - f) / 24);
            return 0.5;
          }}
        />
      </Sequence>
      {/* Procedural ticks — rapid page-turn accents during CSV parse */}
      {[600, 625, 650, 675, 700, 725, 750, 775].map((f) => (
        <Sequence key={`data-${f}`} from={f} durationInFrames={5}>
          <Audio src={mouseClick} volume={0.18} />
        </Sequence>
      ))}

      {/* ══════════════════════════════════════════════════════════════
          SCENE 4: n8n Workflows (840–1140)
          Canvas expansion + 4 node pops + success chime
          ══════════════════════════════════════════════════════════════ */}

      {/* Canvas expansion swoosh */}
      <Sequence from={840} durationInFrames={35}>
        <Audio
          src={staticFile("card_whoosh.mp3")}
          volume={(f) => rampBoth(f, 35, 5, 12, 0.44)}
        />
      </Sequence>
      <Sequence from={842} durationInFrames={14}>
        <Audio src={whoosh} volume={0.36} />
      </Sequence>

      {/* 4 node bubble pops — staggered 8f */}
      {[920, 928, 936, 944].map((startFrame, i) => (
        <Sequence key={`node-${i}`} from={startFrame} durationInFrames={16}>
          <Audio
            src={staticFile("node_pops.mp3")}
            volume={(f) => rampOut(f, 16, 6, 0.55)}
          />
        </Sequence>
      ))}
      {/* Procedural ding accents on each node */}
      {[920, 928, 936, 944].map((f, i) => (
        <Sequence key={`ding-${i}`} from={f} durationInFrames={8}>
          <Audio src={uiSwitch} volume={0.32} />
        </Sequence>
      ))}

      {/* Success chime on checkmark */}
      <Sequence from={1020} durationInFrames={70}>
        <Audio
          src={staticFile("success_chime.mp3")}
          volume={(f) => rampBoth(f, 70, 8, 16, 0.82)}
        />
      </Sequence>
      {/* Procedural ding triple accent */}
      {[1040, 1054, 1068].map((f, i) => (
        <Sequence key={`chime-${i}`} from={f} durationInFrames={14}>
          <Audio src={ding} volume={0.58 + i * 0.06} />
        </Sequence>
      ))}

      {/* ══════════════════════════════════════════════════════════════
          SCENE 5: Proof & Reviews (1140–1320)
          Snap zoom swoosh + 2 Apple-style notification pings
          ══════════════════════════════════════════════════════════════ */}

      {/* Snap zoom swoosh */}
      <Sequence from={1120} durationInFrames={28}>
        <Audio
          src={staticFile("zoom_swoosh.mp3")}
          volume={(f) => rampBoth(f, 28, 3, 10, 0.65)}
        />
      </Sequence>
      <Sequence from={1121} durationInFrames={12}>
        <Audio src={whoosh} volume={0.5} />
      </Sequence>

      {/* Review ping 1 */}
      <Sequence from={1180} durationInFrames={24}>
        <Audio
          src={staticFile("review_ping.mp3")}
          volume={(f) => rampOut(f, 24, 10, 0.55)}
        />
      </Sequence>
      <Sequence from={1181} durationInFrames={10}>
        <Audio src={snapchatNotification} volume={0.38} />
      </Sequence>

      {/* Review ping 2 */}
      <Sequence from={1220} durationInFrames={24}>
        <Audio
          src={staticFile("review_ping.mp3")}
          volume={(f) => rampOut(f, 24, 10, 0.48)}
        />
      </Sequence>
      <Sequence from={1221} durationInFrames={10}>
        <Audio src={snapchatNotification} volume={0.32} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════
          SCENE 6: Radial Orbit & CTA (1320–1500)
          10-icon radial flutter + warm corporate chime
          ══════════════════════════════════════════════════════════════ */}

      {/* Radial flutter burst */}
      <Sequence from={1332} durationInFrames={32}>
        <Audio
          src={staticFile("orbit_flutter.mp3")}
          volume={(f) => rampBoth(f, 32, 4, 10, 0.5)}
        />
      </Sequence>
      {/* 10 procedural icon pops staggered 2f */}
      {Array.from({ length: 10 }, (_, i) => (
        <Sequence key={`orbit-${i}`} from={1332 + i * 2} durationInFrames={8}>
          <Audio src={uiSwitch} volume={0.28} />
        </Sequence>
      ))}

      {/* Warm corporate outro chime */}
      <Sequence from={1400} durationInFrames={90}>
        <Audio
          src={staticFile("final_chime.mp3")}
          volume={(f) => rampBoth(f, 90, 8, 22, 0.82)}
        />
      </Sequence>
      {/* Procedural ding cascade — C major chord spread */}
      {[1400, 1412, 1424, 1438].map((f, i) => (
        <Sequence key={`outro-${i}`} from={f} durationInFrames={24}>
          <Audio src={ding} volume={0.55 + i * 0.04} />
        </Sequence>
      ))}
    </>
  );
};
