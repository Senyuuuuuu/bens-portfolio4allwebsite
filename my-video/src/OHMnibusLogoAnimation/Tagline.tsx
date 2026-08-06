import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 3: Start Frame 36 (1.2s @ 30 FPS), Duration 0.8s
  const START_FRAME = Math.round(1.2 * fps); // Frame 36

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
  const letterSpacing = interpolate(progress, [0, 1], [0.45, 0.3]);
  const blur = interpolate(progress, [0, 1], [4, 0]);

  return (
    <div
      style={{
        marginTop: 12, // Reduced margin to bring secondary text closer to the main logo
        fontFamily: "'SF Mono', 'Roboto Mono', 'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 22,
        color: "#94A3B8",
        letterSpacing: `${letterSpacing.toFixed(3)}em`,
        textTransform: "uppercase",
        opacity,
        transform: `translateY(${translateY.toFixed(2)}px)`,
        filter: `drop-shadow(0px 0px 14px rgba(255, 255, 255, 0.3)) blur(${blur.toFixed(2)}px)`,
        textAlign: "center",
        willChange: "transform, opacity, filter, letter-spacing",
      }}
    >
      ONE HEALTHY MIND FOR ALL
    </div>
  );
};
