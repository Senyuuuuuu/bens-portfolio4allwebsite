import React from "react";
import { Series } from "remotion";
import { IsometricTablet } from "./IsometricTablet";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export const FullProductLaunch: React.FC = () => {
  return (
    <Series>
      {/* Scene 1: Isometric 3D Tablet Reveal (6 Seconds = 360 Frames @ 60FPS) */}
      <Series.Sequence durationInFrames={360}>
        <IsometricTablet />
      </Series.Sequence>

      {/* Scene 2: Match-Cut Zoom & Analytics Dashboard Walkthrough (6 Seconds = 360 Frames @ 60FPS) */}
      <Series.Sequence durationInFrames={360}>
        <AnalyticsDashboard />
      </Series.Sequence>
    </Series>
  );
};
