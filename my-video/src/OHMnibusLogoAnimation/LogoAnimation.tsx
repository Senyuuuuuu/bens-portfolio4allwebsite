import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { OhmPrefix } from "./OhmPrefix";
import { NibusSuffix } from "./NibusSuffix";
import { Tagline } from "./Tagline";

export const LogoAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  // ---------------------------------------------------------------------------
  // 1. INTRO & MAIN SCENE: Original Logo Zoom-Out & Focus Physics (Frames 0 - 90)
  // ---------------------------------------------------------------------------
  const zoomSpring = spring({
    frame,
    fps,
    config: {
      mass: 1,
      damping: 12,
      stiffness: 100,
    },
  });

  // Intro scale down smoothly from 2.5 (macro close up) to 1.0 (settled logo)
  const scale = interpolate(zoomSpring, [0, 1], [2.5, 1.0]);

  // Focus Pull (Blur Clearing): blur(12px) down to blur(0px) over first 20 frames
  const blur = interpolate(frame, [0, 20], [12, 0], {
    extrapolateRight: "clamp",
  });

  // Ambient breathing pulse based on sine wave (0.5 Hz frequency) for background
  const pulseFactor = Math.sin((frame / fps) * Math.PI * 2 * 0.5);
  const glowScale = 1.0 + 0.22 * pulseFactor;
  const glowOpacity = 0.5 + 0.25 * pulseFactor;
  const glowSize = (isVertical ? 260 : 360) * glowScale;

  const logoFontSize = isVertical ? 115 : 170;

  // ---------------------------------------------------------------------------
  // 2. FINAL SCENE OUTRO: Aggressive "Zoom-Through" Sticked Exclusively to Text
  // Background Blur Orbs Remain Separate / Uncombined in Background Layer
  // ---------------------------------------------------------------------------
  const OUTRO_START_FRAME = 90; // Frame 90 @ 30 FPS (3.0s mark)
  const OUTRO_END_FRAME = 148;

  const zoomThroughProgress = interpolate(
    frame,
    [OUTRO_START_FRAME, OUTRO_END_FRAME],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.9, 0, 1, 0.15), // Extreme exponential Ease In
    }
  );

  // Rapidly scales forward directly toward and through camera lens (1.0x -> 45.0x)
  const unifiedZoomScale = interpolate(
    zoomThroughProgress,
    [0, 1],
    [1.0, 45.0]
  );

  // Opacity Pass-Through Fade Out sticked to text plane
  const planeOpacity = interpolate(zoomThroughProgress, [0.75, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combine intro scale & zoom-through scale exclusively for the text plane
  const totalTextScale = scale * unifiedZoomScale;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        perspective: "1400px",
      }}
    >
      {/* ===================================================================== */}
      {/* 1. SEPARATE BACKGROUND LAYER (Blur glows remain uncombined in bg)     */}
      {/* ===================================================================== */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(168, 85, 247, 0.25) 0%, rgba(0, 0, 0, 0) 65%), radial-gradient(circle at 70% 60%, rgba(6, 182, 212, 0.20) 0%, rgba(0, 0, 0, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Central Breathing Glow Sphere (Static Background Placement) */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(6, 182, 212, 0.35) 50%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(60px)",
          opacity: glowOpacity,
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
          pointerEvents: "none",
        }}
      />

      {/* ===================================================================== */}
      {/* 2. TEXT PLANE CONTAINER (Zoom-Through Motion Sticked to Text)          */}
      {/* ===================================================================== */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${totalTextScale.toFixed(4)})`,
          filter: blur > 0 ? `blur(${blur.toFixed(2)}px)` : undefined,
          opacity: planeOpacity,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Logo Text Group: OHM + nibus */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
            }}
          >
            <OhmPrefix fontSize={logoFontSize} />
            <NibusSuffix fontSize={logoFontSize} />
          </div>

          {/* Tagline Component */}
          <Tagline isVertical={isVertical} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
