import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface OhmPrefixProps {
  fontSize?: number;
}

export const OhmPrefix: React.FC<OhmPrefixProps> = ({ fontSize = 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Start at Frame 6 (0.2s @ 30 FPS), Duration 21 frames (0.7s)
  const START_FRAME = Math.round(0.2 * fps); // Frame 6

  // Continuous spring physics (stiffness: 120, damping: 14)
  const ohmSpring = spring({
    frame: Math.max(0, frame - START_FRAME),
    fps,
    config: {
      stiffness: 120,
      damping: 14,
    },
  });

  // Combine spring & cubic-bezier for ultra-smooth high-end UI feel
  const progress = frame >= START_FRAME ? ohmSpring : 0;

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const blur = interpolate(progress, [0, 1], [6, 0]);
  const scale = interpolate(progress, [0, 1], [0.95, 1.0]);
  const translateY = interpolate(progress, [0, 1], [10, 0]);

  return (
    <span
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 900,
        fontSize,
        color: "#A855F7",
        letterSpacing: "-0.04em",
        filter: `drop-shadow(0px 0px 25px rgba(168, 85, 247, 0.45)) blur(${blur.toFixed(2)}px)`,
        opacity,
        transform: `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(2)}px)`,
        display: "inline-block",
        willChange: "transform, opacity, filter",
      }}
    >
      OHM
    </span>
  );
};
