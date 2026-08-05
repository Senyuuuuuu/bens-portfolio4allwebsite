import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";

export interface TitleSequenceProps {
  title?: string;
  subtitle?: string;
}

export const TitleSequence: React.FC<TitleSequenceProps> = ({
  title = "STUDIO",
  subtitle = "NEXT-GEN AUTOMATION PLATFORM",
}) => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Total duration: 4 seconds = 240 frames @ 60fps
  // Phase 1: 0 to 180 frames (Reveal & Hold with Micro-Tracking & Shimmer)
  // Phase 2: 180 to 240 frames (Fluid Morph into Compressed Glowing Capsule for Scene 1 Handoff)

  // --- PHASE 1: ETHEREAL TYPOGRAPHY REVEAL & FOCUS PULL (0 to 120 frames) ---
  const blurAmount = interpolate(frame, [0, 60], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const initialOpacity = interpolate(frame, [0, 60], [0, 0.95], {
    extrapolateRight: "clamp",
  });

  // Micro-Tracking: Expansion from 4px to 14px (0 to 180), then rapid compression into capsule (180 to 240)
  const baseLetterSpacing = interpolate(frame, [0, 180], [4, 14], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const morphCompressProgress = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.85, 0, 0.15, 1),
  });

  const letterSpacing = interpolate(morphCompressProgress, [0, 1], [baseLetterSpacing, -6]);

  // Shimmer Sweep
  const shimmerPos = interpolate(frame, [20, 160], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [40, 120, 180, 210], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- PHASE 2: SHAPE MORPHING INTO GLOWING CAPSULE (180 to 240 frames) ---
  // Morph spring physics
  const morphSpring = spring({
    frame: frame - 180,
    fps,
    config: { mass: 1, damping: 14, stiffness: 120 },
  });

  // Morph capsule bounds: text container contracts into a 360px x 80px capsule with 40px borderRadius
  const containerWidth = interpolate(morphCompressProgress, [0, 1], [1200, 360]);
  const containerHeight = interpolate(morphCompressProgress, [0, 1], [180, 80]);
  const borderRadius = interpolate(morphCompressProgress, [0, 1], [0, 40]);

  // Border & Glow transition: White text glow -> Warning amber/red border glow
  const borderGlowColor = interpolate(
    morphCompressProgress,
    [0, 1],
    [0, 1]
  );

  const glowR = Math.round(interpolate(borderGlowColor, [0, 1], [255, 239]));
  const glowG = Math.round(interpolate(borderGlowColor, [0, 1], [255, 68]));
  const glowB = Math.round(interpolate(borderGlowColor, [0, 1], [255, 68]));

  const bgAlpha = interpolate(morphCompressProgress, [0, 1], [0, 0.9]);

  // Text scale & opacity reduction as shape compresses
  const textScale = interpolate(morphCompressProgress, [0, 0.8, 1], [1, 0.5, 0.2]);
  const textOpacity = interpolate(morphCompressProgress, [0, 0.85, 1], [1, 0.3, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      {/* Background Soft Central Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "1200px",
          height: "1200px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(${glowR}, ${glowG}, ${glowB}, 0.15) 0%, rgba(13, 13, 15, 0) 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Morphing Bounding Box Container */}
      <div
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          borderRadius: `${borderRadius}px`,
          backgroundColor: `rgba(18, 22, 30, ${bgAlpha})`,
          border: `${morphCompressProgress * 2}px solid rgba(${glowR}, ${glowG}, ${glowB}, ${morphCompressProgress * 0.8})`,
          boxShadow: `0 0 ${morphCompressProgress * 40}px rgba(${glowR}, ${glowG}, ${glowB}, ${morphCompressProgress * 0.6})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: initialOpacity,
          filter: `blur(${blurAmount}px)`,
          WebkitFilter: `blur(${blurAmount}px)`,
          transition: "box-shadow 0.1s ease",
          position: "relative",
        }}
      >
        {/* Title Typography */}
        <h1
          style={{
            margin: 0,
            fontSize: "108px",
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: `${letterSpacing}px`,
            textAlign: "center",
            transform: `scale(${textScale})`,
            opacity: textOpacity,
            background: `linear-gradient(115deg, rgba(255,255,255,0.7) ${shimmerPos - 40}%, rgba(255,255,255,1) ${shimmerPos}%, rgba(180,185,210,0.85) ${shimmerPos + 40}%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </h1>

        {/* Subtitle Badge */}
        {subtitle && (
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: `${letterSpacing * 0.6}px`,
              color: "rgba(255, 255, 255, 0.7)",
              textTransform: "uppercase",
              opacity: subtitleOpacity,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
