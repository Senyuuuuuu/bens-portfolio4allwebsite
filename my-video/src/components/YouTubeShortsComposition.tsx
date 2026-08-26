/**
 * YouTubeShortsComposition.tsx
 *
 * Root 9:16 (1080×1920) composition for the YouTube Shorts Clipping Automation
 * Studio. Assembles the three main rendering layers:
 *
 *  1. ComponentRegistry — <Series>-stacked scenes with FaceTracker + B-roll
 *  2. Global DynamicSubtitles — used when no per-scene captions exist
 *  3. Header badge — animated channel branding / hook title
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { YouTubeShortsProps } from "../types/clipping";
import { ComponentRegistry } from "./ComponentRegistry";

// ---------------------------------------------------------------------------
// Animated header badge
// ---------------------------------------------------------------------------
const HeaderBadge: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven entrance — no CSS animation
  const spr = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { stiffness: 160, damping: 18 },
    durationInFrames: Math.round(fps * 0.5),
  });

  const slideY = interpolate(spr, [0, 1], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 80,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          opacity: spr,
          translate: `0px ${slideY}px`,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "16px 36px",
          borderRadius: 40,
          border: "2px solid rgba(255, 230, 0, 0.85)",
          color: "#FFFFFF",
          fontFamily: "'Outfit', 'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: "1px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          textTransform: "uppercase",
          maxWidth: "88%",
          textAlign: "center",
          // ⚠️ NO CSS transition
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------
export const YouTubeShortsComposition: React.FC<YouTubeShortsProps> = ({
  title,
  vodSourceUrl,
  scenes,
  globalCaptions,
}) => {
  // Map schema scenes to ClipScene shape, injecting fallback VOD URL
  const resolvedScenes = scenes.map((sc) => ({
    ...sc,
    vodSourceUrl: sc.vodSourceUrl || vodSourceUrl,
    // Default single centred keyframe if none provided
    faceTrackingKeyframes: sc.faceTrackingKeyframes ?? [
      { timeInSeconds: 0, xPercentage: 50, yPercentage: 50, zoomScale: 2.0 },
    ],
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Layer 1: Face-tracked scene stack with B-roll + per-scene subtitles */}
      <ComponentRegistry
        scenes={resolvedScenes}
        fallbackVodUrl={vodSourceUrl}
        globalCaptions={globalCaptions}
      />

      {/* Layer 2: Header badge (always on top) */}
      <HeaderBadge title={title} />
    </AbsoluteFill>
  );
};

