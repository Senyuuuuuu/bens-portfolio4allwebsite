import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Brand Color Palette Tokens for OHMnibus
const PURPLE_DEEP = "#4C1D95";
const PURPLE_PRIMARY = "#7E22CE";
const PURPLE_GLOW = "#A855F7";
const PURPLE_LIGHT = "#C084FC";
const TEAL_PRIMARY = "#0D9488";
const TEAL_LIGHT = "#14B8A6";
const CYAN_ACCENT = "#06B6D4";
const DARK_OBSIDIAN = "#030712";

export interface OHMnibusOutroProps {
  titlePrefix?: string;
  titleSuffix?: string;
  tagline?: string;
  ctaText?: string;
  websiteUrl?: string;
}

export const OHMnibusOutroZoomOut: React.FC<OHMnibusOutroProps> = ({
  titlePrefix = "OHM",
  titleSuffix = "nibus",
  tagline = "ONE HEALTHY MIND FOR ALL",
  ctaText = "RESERVE YOUR SPOT • RESET 2026",
  websiteUrl = "www.ohmnibus.com",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  // Primary Macro Zoom Out Spring (Frame 0 -> 140)
  const zoomSpring = spring({
    frame,
    fps,
    config: {
      stiffness: 120,
      damping: 14,
      mass: 0.9,
    },
  });

  const revealSpring = spring({
    frame: Math.max(0, frame - 110),
    fps,
    config: {
      stiffness: 110,
      damping: 14,
    },
  });

  // Extreme Close-Up Macro Scale (8.5x -> 1.0x) smooth zoom out
  const macroScale = interpolate(zoomSpring, [0, 1], [8.5, 1.0], {
    extrapolateRight: "clamp",
  });

  const pulseWave = Math.sin((frame / fps) * Math.PI * 2 * 0.4);
  const breathingScale = 1.0 + 0.025 * pulseWave;
  const finalScale = macroScale * (frame > 120 ? breathingScale : 1.0);

  const blurAmount = interpolate(frame, [0, 90], [28, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const rotateX = interpolate(zoomSpring, [0, 1], [18, 0]);
  const rotateY = interpolate(zoomSpring, [0, 1], [-22, 0]);
  const tiltZ = Math.sin((frame / fps) * 0.5) * 1.5;

  const targetCardW = isVertical ? 940 : 1380;
  const targetCardH = isVertical ? 1520 : 860;

  const cardWidth = interpolate(
    zoomSpring,
    [0, 1],
    [width * 1.4, targetCardW],
    { extrapolateRight: "clamp" }
  );

  const cardHeight = interpolate(
    zoomSpring,
    [0, 1],
    [height * 1.4, targetCardH],
    { extrapolateRight: "clamp" }
  );

  const cardBorderRadius = interpolate(zoomSpring, [0, 1], [0, 52], {
    extrapolateRight: "clamp",
  });

  const borderColor = interpolateColors(
    revealSpring,
    [0, 1],
    ["rgba(255, 255, 255, 0.08)", "rgba(168, 85, 247, 0.45)"]
  );

  const taglineTracking = interpolate(
    revealSpring,
    [0, 1],
    [0.02, isVertical ? 0.22 : 0.38],
    { extrapolateRight: "clamp" }
  );

  const taglineOpacity = interpolate(revealSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(revealSpring, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  const ctaScale = interpolate(revealSpring, [0, 1], [0.8, 1.0], {
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(revealSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const heroFontSize = isVertical ? 120 : 180;
  const taglineFontSize = isVertical ? 22 : 28;
  const ctaFontSize = isVertical ? 20 : 24;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_OBSIDIAN,
        fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1400px",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: isVertical ? "700px" : "1000px",
          height: isVertical ? "700px" : "1000px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${PURPLE_PRIMARY}50 0%, ${PURPLE_DEEP}20 50%, rgba(0,0,0,0) 75%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: isVertical ? "600px" : "900px",
          height: isVertical ? "600px" : "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN_ACCENT}40 0%, ${TEAL_PRIMARY}15 50%, rgba(0,0,0,0) 70%)`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          borderRadius: `${cardBorderRadius}px`,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(3, 7, 18, 0.85) 100%)",
          backdropFilter: `blur(40px)`,
          WebkitBackdropFilter: `blur(40px)`,
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 35px 80px -15px rgba(0, 0, 0, 0.8), 0 0 50px -10px ${PURPLE_PRIMARY}30, inset 0 1.5px 0 rgba(255, 255, 255, 0.25)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isVertical ? "60px 36px" : "60px 80px",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `scale(${finalScale.toFixed(4)}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${tiltZ.toFixed(2)}deg)`,
          filter: `blur(${blurAmount.toFixed(2)}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            lineHeight: 1,
            position: "relative",
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: `${heroFontSize}px`,
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, #FFFFFF 0%, ${PURPLE_LIGHT} 50%, ${PURPLE_GLOW} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 12px 30px ${PURPLE_GLOW}60)`,
              display: "inline-block",
            }}
          >
            {titlePrefix}
          </span>

          <span
            style={{
              fontWeight: 900,
              fontSize: `${heroFontSize}px`,
              letterSpacing: "-0.04em",
              background: `linear-gradient(135deg, ${TEAL_LIGHT} 0%, ${CYAN_ACCENT} 50%, #FFFFFF 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 12px 30px ${CYAN_ACCENT}60)`,
              display: "inline-block",
            }}
          >
            {titleSuffix}
          </span>
        </div>

        <div
          style={{
            marginTop: isVertical ? "28px" : "36px",
            fontSize: `${taglineFontSize}px`,
            fontWeight: 800,
            letterSpacing: `${taglineTracking.toFixed(4)}em`,
            color: "#E2E8F0",
            textTransform: "uppercase",
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: "center",
            width: "100%",
            zIndex: 20,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            marginTop: isVertical ? "48px" : "56px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            opacity: ctaOpacity,
            transform: `scale(${ctaScale}) translateY(${interpolate(revealSpring, [0, 1], [40, 0])}px)`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${PURPLE_PRIMARY} 0%, ${TEAL_PRIMARY} 100%)`,
              padding: isVertical ? "18px 36px" : "20px 48px",
              borderRadius: "40px",
              fontWeight: 900,
              fontSize: `${ctaFontSize}px`,
              letterSpacing: "0.08em",
              color: "#FFFFFF",
              boxShadow: `0 20px 50px -10px ${TEAL_PRIMARY}60, inset 0 1.5px 0 rgba(255, 255, 255, 0.4)`,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <span>{ctaText}</span>
            <span style={{ fontSize: "26px" }}>➔</span>
          </div>

          <div
            style={{
              fontSize: isVertical ? "16px" : "18px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: CYAN_ACCENT,
              textTransform: "lowercase",
              opacity: 0.9,
              marginTop: "6px",
            }}
          >
            {websiteUrl}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
