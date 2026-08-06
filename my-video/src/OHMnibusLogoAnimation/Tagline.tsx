import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TaglineProps {
  tracking?: number;
  isVertical?: boolean;
}

export const Tagline: React.FC<TaglineProps> = ({ tracking, isVertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 3: Start Frame 36 (1.2s @ 30 FPS)
  const START_FRAME = Math.round(1.2 * fps);

  const taglineSpring = spring({
    frame: Math.max(0, frame - START_FRAME),
    fps,
    config: {
      stiffness: 120,
      damping: 14,
    },
  });

  const active = frame >= START_FRAME;
  const progress = active ? taglineSpring : 0;

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [8, 0]);
  const defaultSpacing = interpolate(progress, [0, 1], [0.45, 0.3]);
  const blur = interpolate(progress, [0, 1], [4, 0]);

  const currentLetterSpacing = tracking !== undefined ? tracking : defaultSpacing;
  const fontSize = isVertical ? 16 : 22;

  return (
    <div
      style={{
        marginTop: isVertical ? 8 : 12,
        fontFamily: "'SF Mono', 'Roboto Mono', 'Inter', sans-serif",
        fontWeight: 600,
        fontSize,
        color: "#94A3B8",
        letterSpacing: `${currentLetterSpacing.toFixed(3)}em`,
        textTransform: "uppercase",
        opacity,
        transform: `translateY(${translateY.toFixed(2)}px)`,
        filter: `drop-shadow(0px 0px 14px rgba(255, 255, 255, 0.3)) blur(${blur.toFixed(2)}px)`,
        textAlign: "center",
        willChange: "transform, opacity, filter, letter-spacing",
        whiteSpace: "nowrap",
      }}
    >
      ONE HEALTHY MIND FOR ALL
    </div>
  );
};
