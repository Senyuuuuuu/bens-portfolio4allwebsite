import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { UICardScene } from "./UICardScene";
import { OhmPrefix } from "./OhmPrefix";
import { NibusSuffix } from "./NibusSuffix";
import { Tagline } from "./Tagline";

export const MultiStageCameraZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  // ---------------------------------------------------------------------------
  // TIMING MARKS (30 FPS)
  // Phase 1: 0 - 45 frames (0.0s - 1.5s) Floating Cards Zoom-Out
  // Phase 2: 45 - 60 frames (1.5s - 2.0s) Macro Whip Zoom Transition
  // Phase 3: 60 - 150 frames (2.0s - 5.0s) Logo Zoom-Out & Settle
  // ---------------------------------------------------------------------------

  // Phase 1: Floating cards zoom-out scale (1.30 -> 1.00)
  const phase1Scale = interpolate(frame, [0, 45], [1.3, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  // Phase 2: Macro Whip Zoom Punch-In scale (1.00 -> 4.50) & opacity transition
  const phase2WhipZoom = interpolate(frame, [45, 60], [1.0, 4.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Phase 2 Lens Motion Blur (0px -> 14px -> 0px)
  const blurAmount = interpolate(
    frame,
    [45, 52, 60, 68],
    [0, 14, 12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Background Color Morphing (Light Canvas #F8FAFC -> Dark Obsidian #0B1021)
  const bgOpacityDark = interpolate(frame, [48, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 1 UI Card Scene Opacity Fade-Out during whip zoom
  const cardSceneOpacity = interpolate(frame, [46, 58], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3: Spring Physics for Logo Settle (250% -> 100%)
  const logoSpring = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: {
      stiffness: 120,
      damping: 14,
      mass: 0.9,
    },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [2.5, 1.0]);
  const logoOpacity = interpolate(frame, [52, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient Breathing Radial Glow (Sine Wave Pulse)
  const pulseFactor = Math.sin((frame / fps) * Math.PI * 2 * 0.5);
  const glowScale = 1.0 + 0.22 * pulseFactor;
  const glowOpacity = 0.4 + 0.25 * pulseFactor;
  const glowSize = (isVertical ? 320 : 420) * glowScale;

  // Tagline Opacity & Tracking Expansion
  const taglineOpacity = interpolate(frame, [72, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineTracking = interpolate(frame, [72, 110], [0.12, 0.30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Responsive font scaling for OHMnibus logo text
  const logoFontSize = isVertical ? 115 : 170;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 1. Light Canvas Background (Phase 1) */}
      <AbsoluteFill
        style={{
          backgroundColor: "#F8FAFC",
          backgroundImage:
            "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* 2. Dark Obsidian Background (Phase 2 -> Phase 3 Morphing) */}
      <AbsoluteFill
        style={{
          backgroundColor: "#0B1021",
          opacity: bgOpacityDark,
        }}
      />

      {/* 3. Ambient Breathing Radial Glow (Phase 3) */}
      {frame >= 50 && (
        <AbsoluteFill
          style={{
            opacity: bgOpacityDark,
            pointerEvents: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            }}
          />
        </AbsoluteFill>
      )}

      {/* 4. PHASE 1 & PHASE 2: UI Card Scene Container with Whip Zoom & Blur */}
      {frame < 65 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: cardSceneOpacity,
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${frame < 45 ? phase1Scale : phase2WhipZoom})`,
            transformOrigin: "center center",
          }}
        >
          <UICardScene isVertical={isVertical} />
        </AbsoluteFill>
      )}

      {/* 5. PHASE 3: OHMnibus Brand Logo & Tagline Scene */}
      {frame >= 50 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: logoOpacity,
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${logoScale})`,
            transformOrigin: "center center",
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

            {/* Tagline Component with Dynamic Tracking */}
            <div
              style={{
                opacity: taglineOpacity,
                marginTop: isVertical ? "20px" : "24px",
              }}
            >
              <Tagline tracking={taglineTracking} isVertical={isVertical} />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
