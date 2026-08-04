import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { IsometricTablet } from "./IsometricTablet";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { FullProductLaunch } from "./FullProductLaunch";
import { WatermarkRemover } from "./WatermarkRemover";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🎬 MASTER SEQUENCE: Full 12-Second Keynote (Scene 1 + Scene 2 @ 60FPS) */}
      <Composition
        id="FullProductLaunch"
        component={FullProductLaunch}
        durationInFrames={720}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* Scene 2: Standalone Match-Cut & Analytics Walkthrough (6 Seconds @ 60FPS) */}
      <Composition
        id="Scene2_AnalyticsDashboard"
        component={AnalyticsDashboard}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* Scene 1: Standalone Isometric Tablet Reveal (6 Seconds @ 60FPS) */}
      <Composition
        id="IsometricTabletReveal"
        component={IsometricTablet}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* Watermark Remover Utility Composition */}
      <Composition
        id="CleanVideo"
        component={WatermarkRemover}
        durationInFrames={192}
        fps={24}
        width={1280}
        height={720}
      />
    </>
  );
};
