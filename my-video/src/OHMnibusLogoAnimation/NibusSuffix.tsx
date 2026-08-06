import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface NibusSuffixProps {
  fontSize?: number;
}

const CHARACTERS = ["n", "i", "b", "u", "s"];

export const NibusSuffix: React.FC<NibusSuffixProps> = ({ fontSize = 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 2: Delay 0.75s (Start at Frame ~23 @ 30 FPS)
  const START_FRAME = Math.round(0.75 * fps); // Frame 23
  const STAGGER_FRAMES = Math.max(1, Math.round(0.07 * fps)); // ~2 frames per char

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      {CHARACTERS.map((char, index) => {
        const charStartFrame = START_FRAME + index * STAGGER_FRAMES;

        // Spring physics per character (stiffness: 120, damping: 14)
        const charSpring = spring({
          frame: Math.max(0, frame - charStartFrame),
          fps,
          config: {
            stiffness: 120,
            damping: 14,
          },
        });

        const active = frame >= charStartFrame;
        const progress = active ? charSpring : 0;

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateX = interpolate(progress, [0, 1], [-20, 0]);
        const blur = interpolate(progress, [0, 1], [4, 0]);
        const scale = interpolate(progress, [0, 1], [0.9, 1.0]);

        return (
          <span
            key={`${char}-${index}`}
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 900,
              fontSize,
              color: "#06B6D4",
              letterSpacing: "-0.04em",
              filter: `drop-shadow(0px 0px 25px rgba(0, 229, 255, 0.45)) blur(${blur.toFixed(2)}px)`,
              opacity,
              transform: `translateX(${translateX.toFixed(2)}px) scale(${scale.toFixed(4)})`,
              display: "inline-block",
              willChange: "transform, opacity, filter",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
