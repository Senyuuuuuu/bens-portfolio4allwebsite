import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BlueAlphaEcosystem } from "./BlueAlphaEcosystem";
import { BlueAlphaLogoReveal } from "./BlueAlphaLogoReveal";
import { BlueAlphaDashboard } from "./BlueAlphaDashboard";
import { BlueAlphaCharts } from "./BlueAlphaCharts";

// ─── Scene timing constants ───────────────────────────────────────────────────
const SCENE_1_START = 0;
const SCENE_1_DURATION = 151; // Frames 0–150

const SCENE_2_START = 151;
const SCENE_2_DURATION = 60; // Frames 151–210

const SCENE_3_START = 211;
const SCENE_3_DURATION = 210; // Frames 211–420

const SCENE_4_START = 421;
const SCENE_4_DURATION = 659; // Frames 421–1079

// ─── Main Composition ─────────────────────────────────────────────────────────
export const BlueAlphaSaaSFlow: React.FC = () => {

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a14",
        fontFamily: "'Inter', 'Roboto', -apple-system, sans-serif",
      }}
    >
      {/* ── SCENE 1: App Ecosystem 3D Orbit (Frames 0–150) ──────────────── */}
      <Sequence from={SCENE_1_START} durationInFrames={SCENE_1_DURATION + 20}>
        <AbsoluteFill>
          <BlueAlphaEcosystem />
        </AbsoluteFill>
      </Sequence>

      {/* ── SCENE 2: Logo Reveal (Frames 151–210) ────────────────────────── */}
      <Sequence from={SCENE_2_START} durationInFrames={SCENE_2_DURATION + 20}>
        <AbsoluteFill>
          <BlueAlphaLogoReveal />
        </AbsoluteFill>
      </Sequence>

      {/* ── SCENE 3: Isometric Dashboard (Frames 211–420) ────────────────── */}
      <Sequence from={SCENE_3_START} durationInFrames={SCENE_3_DURATION + 20}>
        <AbsoluteFill>
          <BlueAlphaDashboard />
        </AbsoluteFill>
      </Sequence>

      {/* ── SCENE 4: Chart Animation & Disassembly (Frames 421–1079) ─────── */}
      <Sequence from={SCENE_4_START} durationInFrames={SCENE_4_DURATION}>
        <AbsoluteFill>
          <BlueAlphaCharts />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
