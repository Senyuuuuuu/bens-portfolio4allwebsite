import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AppOrbit } from "./AppOrbit";
import { LogoReveal } from "./LogoReveal";
import { DashboardIntro } from "./DashboardIntro";
import { DataVisualization } from "./DataVisualization";

// ─── Blueprint Scene Timing ───────────────────────────────────────────────────
// Total Duration: 1080 frames (18s @ 60 FPS)
// Scene 1: App Orbit           -> Frames 0 – 150 (151 frames)
// Scene 2: Logo Reveal         -> Frames 151 – 210 (60 frames)
// Scene 3: Dashboard Intro     -> Frames 211 – 420 (210 frames)
// Scene 4: Data Visualization  -> Frames 421 – 1080 (660 frames)

export const MainComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a14" }}>
      {/* Scene 1: <AppOrbit/> */}
      <Sequence from={0} durationInFrames={151}>
        <AbsoluteFill>
          <AppOrbit />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: <LogoReveal/> */}
      <Sequence from={151} durationInFrames={60}>
        <AbsoluteFill>
          <LogoReveal />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: <DashboardIntro/> */}
      <Sequence from={211} durationInFrames={210}>
        <AbsoluteFill>
          <DashboardIntro />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: <DataVisualization/> */}
      <Sequence from={421} durationInFrames={660}>
        <AbsoluteFill>
          <DataVisualization />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
