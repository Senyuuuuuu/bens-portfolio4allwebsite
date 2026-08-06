import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OhmPrefix } from "./OhmPrefix";
import { NibusSuffix } from "./NibusSuffix";
import { Tagline } from "./Tagline";

export const LogoAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  // Ultra-Smooth Spring Physics for Zoom Out (Scale 2.4 -> 1.0)
  const zoomSpring = spring({
    frame,
    fps,
    config: {
      stiffness: 120,
      damping: 14,
      mass: 0.9,
    },
  });

  // Smooth mathematical zoom out interpolation
  const scale = interpolate(zoomSpring, [0, 1], [2.4, 1.0]);

  // Lens blur clearing smoothly as logo zooms out (12px -> 0px)
  const blur = interpolate(zoomSpring, [0, 1], [12, 0]);

  // Ambient breathing radial pulse based on sine wave
  const pulseFactor = Math.sin((frame / fps) * Math.PI * 2 * 0.5);
  const glowScale = 1.0 + 0.22 * pulseFactor;
  const glowOpacity = 0.5 + 0.25 * pulseFactor;
  const glowSize = (isVertical ? 260 : 360) * glowScale;

  const logoFontSize = isVertical ? 115 : 170;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 1. Transparent Ambient Background Radial Glow Overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(168, 85, 247, 0.25) 0%, rgba(0, 0, 0, 0) 65%), radial-gradient(circle at 70% 60%, rgba(6, 182, 212, 0.20) 0%, rgba(0, 0, 0, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 2. Central Breathing Glow Sphere */}
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

      {/* 3. Main Smooth Zoom Out Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          transform: `scale(${scale.toFixed(4)})`,
          filter: `blur(${blur.toFixed(2)}px)`,
          willChange: "transform, filter",
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
  );
};
