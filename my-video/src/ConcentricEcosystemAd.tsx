import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

// ═════════════════════════════════════════════════════════════════════════════
// GLOBAL PROJECT SETUP & DESIGN TOKENS (1920x1080 @ 60 FPS)
// ═════════════════════════════════════════════════════════════════════════════
const T = {
  bgLight: "#f8f9fa",
  bgGradient: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
  bgGridDot: "rgba(32, 33, 36, 0.05)",
  textDark: "#202124",
  textMuted: "#5f6368",
  textLight: "#80868b",
  
  // Brand & Accent Colors
  bluePrimary: "#0284c7",
  blueGlow: "rgba(2, 132, 199, 0.25)",
  cyanAccent: "#06b6d4",
  purpleAccent: "#8b5cf6",
  amberAccent: "#f59e0b",
  emeraldAccent: "#10b981",
  fiverrGreen: "#1dbf73",
  
  // Glassmorphic & Card Tokens
  glassBg: "rgba(255, 255, 255, 0.85)",
  glassBorder: "rgba(32, 33, 36, 0.08)",
  glassShadow: "0 24px 60px rgba(32, 33, 36, 0.08), 0 6px 16px rgba(32, 33, 36, 0.04)",
  cardShadow: "0 12px 30px rgba(32, 33, 36, 0.05), 0 2px 8px rgba(32, 33, 36, 0.03)",
  glowShadow: "0 0 30px rgba(2, 132, 199, 0.25)",
};

// 8 App Badges for Orbit Ring (Figma, Google Sheets, Stripe, OpenAI, Webflow, LinkedIn, Slack, Gmail)
const APP_BADGES = [
  { name: "Figma", color: "#f24e1e", bg: "#fef2f2", label: "FIG" },
  { name: "Sheets", color: "#10b981", bg: "#ecfdf5", label: "XLS" },
  { name: "Stripe", color: "#6366f1", bg: "#eef2ff", label: "STR" },
  { name: "OpenAI", color: "#0f766e", bg: "#f0fdfa", label: "AI" },
  { name: "Webflow", color: "#146ef5", bg: "#eff6ff", label: "WEB" },
  { name: "LinkedIn", color: "#0284c7", bg: "#f0f9ff", label: "IN" },
  { name: "Slack", color: "#ec4899", bg: "#fdf2f8", label: "SLK" },
  { name: "Gmail", color: "#ef4444", bg: "#fef2f2", label: "MSG" },
];

// SVG Icon Helper
const AppBadgeIcon: React.FC<{ name: string; color: string; label: string }> = ({ name, color, label }) => {
  if (name === "Figma") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2H8.5C6.567 2 5 3.567 5 5.5C5 7.433 6.567 9 8.5 9H12V2Z" fill="#F24E1E"/>
        <path d="M12 9H8.5C6.567 9 5 10.567 5 12.5C5 14.433 6.567 16 8.5 16H12V9Z" fill="#A259FF"/>
        <path d="M5 19.5C5 17.567 6.567 16 8.5 16H12V19.5C12 21.433 10.433 23 8.5 23C6.567 23 5 21.433 5 19.5Z" fill="#0ACF83"/>
        <circle cx="15.5" cy="5.5" r="3.5" fill="#FF7262"/>
        <circle cx="15.5" cy="12.5" r="3.5" fill="#1ABCFE"/>
      </svg>
    );
  }
  if (name === "Sheets") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="3" fill="#10B981"/>
        <path d="M7 8H17M7 12H17M7 16H13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "Stripe") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#6366F1"/>
        <path d="M13.5 8.5C13.5 8 13 7.5 12 7.5C10.5 7.5 9.5 8.5 9.5 9.8C9.5 12.5 14.5 11.5 14.5 14.2C14.5 15.8 13 16.5 11.5 16.5C10 16.5 8.5 15.5 8.5 14.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "OpenAI") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#0F766E"/>
        <path d="M12 6V18M6 12H18M7.75 7.75L16.25 16.25M16.25 7.75L7.75 16.25" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "Slack") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 15A2 2 0 0 1 4 13A2 2 0 0 1 6 11H9V15H6Z" fill="#E01E5A"/>
        <path d="M9 6A2 2 0 0 1 11 4A2 2 0 0 1 13 6V9H9V6Z" fill="#36C5F0"/>
        <path d="M18 9A2 2 0 0 1 20 11A2 2 0 0 1 18 13H15V9H18Z" fill="#2EB67D"/>
        <path d="M15 18A2 2 0 0 1 13 20A2 2 0 0 1 11 18V15H15V18Z" fill="#ECB22E"/>
      </svg>
    );
  }
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: color,
        color: "#fff",
        fontSize: 10,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION: CONCENTRIC ECOSYSTEM AGENCY AD (24s @ 60FPS = 1440 Frames)
// ═════════════════════════════════════════════════════════════════════════════
export const ConcentricEcosystemAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ───────────────────────────────────────────────────────────────────────────
  // MASTER TIMELINE MORPH MATHEMATICS (Continuous Springs & Transitions)
  // ───────────────────────────────────────────────────────────────────────────
  
  // Overall Camera Scale & 3D Tilt for Phase 5 Outro (Frames 1100 - 1180)
  const outroSpring = spring({
    frame: Math.max(0, frame - 1100),
    fps,
    config: { stiffness: 120, damping: 18 },
  });
  const cameraScale = interpolate(outroSpring, [0, 1], [1.0, 0.82]);
  const cameraRotX = interpolate(outroSpring, [0, 1], [0, 10]);
  const cameraRotY = interpolate(outroSpring, [0, 1], [0, -6]);

  // Central Anchor Drop-in (Frame 0 - 30)
  const anchorDropSpring = spring({
    frame,
    fps,
    config: { stiffness: 220, damping: 22 },
  });
  const anchorDropScale = interpolate(anchorDropSpring, [0, 1], [0, 1]);
  const anchorDropYOffset = interpolate(anchorDropSpring, [0, 1], [-80, 0]);

  // Central Anchor X Position Morphing across Phases (Using Easing.bezier(0.2, 0.8, 0.2, 1) for panning):
  // Phase 1 (0-200): Center (960)
  // Phase 2 (240-500): Left (320)
  // Phase 3 (540-800): Center Node (960)
  // Phase 4 (840-1100): Left-Center Workflow Router (700)
  // Phase 5 (1140-1440): Center Nexus (960)
  const anchorMove1 = interpolate(frame, [200, 240], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const anchorMove2 = interpolate(frame, [500, 540], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const anchorMove3 = interpolate(frame, [800, 840], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const anchorMove4 = interpolate(frame, [1100, 1140], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const anchorX = frame < 200
    ? 960
    : frame < 500
    ? interpolate(anchorMove1, [0, 1], [960, 320])
    : frame < 800
    ? interpolate(anchorMove2, [0, 1], [320, 960])
    : frame < 1100
    ? interpolate(anchorMove3, [0, 1], [960, 700])
    : interpolate(anchorMove4, [0, 1], [700, 960]);

  // Central Anchor Y Position (Subtle Micro-float)
  const anchorY = 540 + anchorDropYOffset + Math.sin(frame * 0.04) * 4;

  // Orbiting Badges Physics (Frame 30 Explosion -> Continuous Orbit -> Frame 200 Compression)
  const orbitExplodeSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { stiffness: 220, damping: 22 },
  });
  const orbitContractSpring = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: { stiffness: 220, damping: 22 },
  });
  const orbitBaseRadius = frame >= 30 ? interpolate(orbitExplodeSpring, [0, 1], [0, 240]) : 0;
  const orbitRadius = frame < 200
    ? orbitBaseRadius
    : interpolate(orbitContractSpring, [0, 1], [240, 0]);

  // Frame 60 Title Entrance Physics
  const titleSpring = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { stiffness: 220, damping: 22 },
  });
  const titleScale = frame >= 60 ? interpolate(titleSpring, [0, 1], [0.7, 1]) : 0;
  const titleOpacity = frame >= 60 ? interpolate(titleSpring, [0, 1], [0, 1]) : 0;

  // Frame 90 Subtitle Typing Progress
  const subtitleText = "I engineer digital ecosystems.";
  const typeProgress = interpolate(frame, [90, 170], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typedLength = frame >= 90 ? Math.floor(typeProgress * subtitleText.length) : 0;

  // Phase 2 Web Architecture Entrance (Frames 240 - 540)
  const webPanelSpring = spring({
    frame: Math.max(0, frame - 240),
    fps,
    config: { stiffness: 220, damping: 22 },
  });
  
  // Phase 2 Cursor Bezier Trajectory to "Live Site" Button
  const cursorProgress = interpolate(frame, [290, 340], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [1500, 1420]);
  const cursorY = interpolate(cursorProgress, [0, 1], [800, 310]);
  const isLiveSiteClicked = frame >= 340;
  
  const liveSiteClickSpring = spring({
    frame: Math.max(0, frame - 340),
    fps,
    config: { stiffness: 350, damping: 18 },
  });
  const liveSiteScale = isLiveSiteClicked
    ? interpolate(liveSiteClickSpring, [0, 0.4, 1], [1, 0.88, 1])
    : 1;

  // Staggered Layout Cards in Web Mockup (Phase 2)
  const layoutCard1Sp = spring({ frame: Math.max(0, frame - 350), fps, config: { stiffness: 220, damping: 22 } });
  const layoutCard2Sp = spring({ frame: Math.max(0, frame - 362), fps, config: { stiffness: 220, damping: 22 } });
  const layoutCard3Sp = spring({ frame: Math.max(0, frame - 374), fps, config: { stiffness: 220, damping: 22 } });

  // Phase 3 Split-Pane Data Dashboard Morph (Frames 540 - 840)
  const dataPanelSpring = spring({
    frame: Math.max(0, frame - 540),
    fps,
    config: { stiffness: 220, damping: 22 },
  });

  // Phase 3 ROI Counter ($0 -> $840 Saved/mo)
  const roiProgress = interpolate(frame, [600, 780], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentRoi = Math.floor(roiProgress * 840);

  // Phase 4 n8n Integration Matrix Entrance (Frames 840 - 1140)
  const n8nPanelSpring = spring({
    frame: Math.max(0, frame - 840),
    fps,
    config: { stiffness: 220, damping: 22 },
  });

  // SVG Line Path Drawing Progress for Phase 2, 3, 4
  const lineDrawP2 = interpolate(frame, [240, 310], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineDrawP3 = interpolate(frame, [540, 610], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineDrawP4 = interpolate(frame, [840, 910], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5 Fiverr CTA Button Entrance (Frames 1140+)
  const ctaSpring = spring({
    frame: Math.max(0, frame - 1150),
    fps,
    config: { stiffness: 260, damping: 18 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [-120, 0]);
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: T.bgGradient,
        overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Audio src={staticFile("bg_music.wav")} volume={0.6} />
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* DYNAMIC BACKGROUND DOT GRID */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: -300,
          backgroundImage: `radial-gradient(${T.bgGridDot} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
          transform: `scale(${cameraScale}) rotateX(${cameraRotX}deg) rotateY(${cameraRotY}deg)`,
          transformOrigin: "50% 50%",
        }}
      />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* CAMERA SCENE WRAPPER (FOR SEAMLESS MORPHING & 3D TILT OUTRO) */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale}) rotateX(${cameraRotX}deg) rotateY(${cameraRotY}deg)`,
          transformOrigin: "50% 50%",
          perspective: 1200,
        }}
      >
        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* FLUID VECTOR LINES & CONVERGENCE PATHS (SVG INTERPOLATION) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <defs>
            <linearGradient id="gradCyanBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={T.cyanAccent} />
              <stop offset="100%" stopColor={T.bluePrimary} />
            </linearGradient>
            <linearGradient id="gradPurpleCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={T.purpleAccent} />
              <stop offset="100%" stopColor={T.cyanAccent} />
            </linearGradient>
            <linearGradient id="gradAmberGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={T.amberAccent} />
              <stop offset="100%" stopColor={T.emeraldAccent} />
            </linearGradient>
            <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Phase 2 Vector Paths: Anchor (320, 540) to Web Panel (750+) */}
          {frame >= 200 && frame < 540 && (
            <>
              <path
                d={`M ${anchorX} ${anchorY - 30} C ${anchorX + 220} ${anchorY - 200}, 700 240, 800 240`}
                stroke="url(#gradCyanBlue)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="900"
                strokeDashoffset={900 * (1 - lineDrawP2)}
                strokeLinecap="round"
                filter="url(#glowLine)"
              />
              <path
                d={`M ${anchorX} ${anchorY} C ${anchorX + 260} ${anchorY}, 700 540, 800 540`}
                stroke="url(#gradPurpleCyan)"
                strokeWidth="5"
                fill="none"
                strokeDasharray="900"
                strokeDashoffset={900 * (1 - lineDrawP2)}
                strokeLinecap="round"
                filter="url(#glowLine)"
              />
              <path
                d={`M ${anchorX} ${anchorY + 30} C ${anchorX + 220} ${anchorY + 200}, 700 840, 800 840`}
                stroke="url(#gradAmberGreen)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="900"
                strokeDashoffset={900 * (1 - lineDrawP2)}
                strokeLinecap="round"
                filter="url(#glowLine)"
              />
            </>
          )}

          {/* Phase 3 Vector Paths: Raw Badges (Left) -> AI Processing Node (960) -> Spreadsheet (Right) */}
          {frame >= 500 && frame < 840 && (
            <>
              {/* Convergence from Left Badges */}
              <path
                d="M 280 340 C 450 340, 700 480, 880 540"
                stroke="url(#gradAmberGreen)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="800"
                strokeDashoffset={800 * (1 - lineDrawP3)}
                strokeLinecap="round"
              />
              <path
                d="M 280 540 C 450 540, 700 540, 880 540"
                stroke="url(#gradPurpleCyan)"
                strokeWidth="5"
                fill="none"
                strokeDasharray="800"
                strokeDashoffset={800 * (1 - lineDrawP3)}
                strokeLinecap="round"
              />
              <path
                d="M 280 740 C 450 740, 700 600, 880 540"
                stroke="url(#gradCyanBlue)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="800"
                strokeDashoffset={800 * (1 - lineDrawP3)}
                strokeLinecap="round"
              />

              {/* Fan out to Right Spreadsheet Pane */}
              <path
                d="M 1040 540 C 1150 480, 1250 360, 1340 360"
                stroke="url(#gradCyanBlue)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="800"
                strokeDashoffset={800 * (1 - lineDrawP3)}
                strokeLinecap="round"
              />
              <path
                d="M 1040 540 C 1150 540, 1250 540, 1340 540"
                stroke="url(#gradAmberGreen)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="800"
                strokeDashoffset={800 * (1 - lineDrawP3)}
                strokeLinecap="round"
              />
              <path
                d="M 1040 540 C 1150 600, 1250 720, 1340 720"
                stroke="url(#gradPurpleCyan)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="800"
                strokeDashoffset={800 * (1 - lineDrawP3)}
                strokeLinecap="round"
              />
            </>
          )}

          {/* Phase 4 n8n Workflow Connecting Vector Lines */}
          {frame >= 800 && (
            <>
              {/* Line 1: Webhook (340) -> AI Engine (680) */}
              <path
                d="M 390 540 C 470 460, 570 460, 630 540"
                stroke="url(#gradCyanBlue)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="600"
                strokeDashoffset={600 * (1 - lineDrawP4)}
                strokeLinecap="round"
              />
              {/* Line 2: AI Engine (680) -> DB (1020) */}
              <path
                d="M 730 540 C 810 620, 910 620, 970 540"
                stroke="url(#gradPurpleCyan)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="600"
                strokeDashoffset={600 * (1 - lineDrawP4)}
                strokeLinecap="round"
              />
              {/* Line 3: DB (1020) -> Slack Notification Panel (1380) */}
              <path
                d="M 1070 540 C 1170 540, 1260 540, 1320 540"
                stroke="url(#gradAmberGreen)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="600"
                strokeDashoffset={600 * (1 - lineDrawP4)}
                strokeLinecap="round"
              />

              {/* Glowing Pulse Riding along Connection Paths */}
              {frame >= 860 && (
                <>
                  <circle
                    cx={390 + ((frame * 6) % 240)}
                    cy={540 + Math.sin(((frame * 6) % 240) * 0.026) * -60}
                    r="6"
                    fill={T.cyanAccent}
                    filter="url(#glowLine)"
                  />
                  <circle
                    cx={730 + (((frame + 40) * 6) % 240)}
                    cy={540 + Math.sin((((frame + 40) * 6) % 240) * 0.026) * 60}
                    r="6"
                    fill={T.purpleAccent}
                    filter="url(#glowLine)"
                  />
                </>
              )}
            </>
          )}
        </svg>

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* THE CONCENTRIC ANCHOR (PROFILE CIRCLE -> AI NODE -> NEXUS) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: anchorX,
            top: anchorY,
            transform: "translate(-50%, -50%)",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer Pulsing Glow Ring */}
          <div
            style={{
              position: "absolute",
              width: 170 + Math.sin(frame * 0.08) * 10,
              height: 170 + Math.sin(frame * 0.08) * 10,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Core Concentric Circle */}
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
              border: `3px solid ${T.bluePrimary}`,
              boxShadow: T.glassShadow,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Phase 1 & Outro Avatar / Initials */}
            {(frame < 540 || frame >= 1100) && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: T.textDark,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  BN
                </div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: T.bluePrimary,
                    letterSpacing: 1.5,
                    marginTop: 4,
                  }}
                >
                  ARCHITECT
                </div>
              </div>
            )}

            {/* Phase 3 & 4 AI Processing Core Node (Iris Spark / Gear) */}
            {frame >= 540 && frame < 1100 && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    transform: `rotate(${frame * 2}deg)`,
                    margin: "0 auto",
                    boxShadow: "0 0 16px rgba(6, 182, 212, 0.6)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: T.textDark,
                    letterSpacing: 1,
                    marginTop: 6,
                  }}
                >
                  AI CORE
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* RADIAL APP ORBIT RING (PHASE 1) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {frame < 240 &&
            APP_BADGES.map((badge, idx) => {
              const count = APP_BADGES.length;
              const angle = (idx / count) * Math.PI * 2 + frame * 0.015;
              const badgeX = Math.cos(angle) * orbitRadius;
              const badgeY = Math.sin(angle) * orbitRadius;
              const badgeScale = interpolate(orbitRadius, [0, 240], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: badgeX,
                    top: badgeY,
                    transform: `translate(-50%, -50%) scale(${badgeScale})`,
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: badge.bg,
                    border: `1.5px solid ${badge.color}30`,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppBadgeIcon name={badge.name} color={badge.color} label={badge.label} />
                </div>
              );
            })}
        </div>

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* PHASE 1 TYPOGRAPHY & HERO BRANDING (Frame 60 Header, Frame 90 Subtitle) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        {frame < 240 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 720,
              transform: `translateX(-50%) scale(${titleScale})`,
              textAlign: "center",
              opacity: titleOpacity * interpolate(frame, [200, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <h1
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: T.textDark,
                letterSpacing: "-2px",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Benyamin Namtalashvili
            </h1>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: T.bluePrimary,
                letterSpacing: 2.5,
                marginTop: 6,
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              The Digital Architect
            </div>

            {/* Subtitle Typed Text (Frame 90 - 170) */}
            {frame >= 90 && (
              <div
                style={{
                  marginTop: 18,
                  display: "inline-block",
                  padding: "8px 24px",
                  borderRadius: 999,
                  backgroundColor: T.glassBg,
                  border: `1px solid ${T.glassBorder}`,
                  boxShadow: T.cardShadow,
                  fontSize: 16,
                  fontWeight: 500,
                  color: T.textDark,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {subtitleText.substring(0, typedLength)}
                <span style={{ color: T.bluePrimary, opacity: frame % 30 < 15 ? 1 : 0 }}>|</span>
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* PHASE 2: WEB DESIGN ARCHITECTURE (FRAMES 240 - 540) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        {(frame >= 200 && frame < 560) || frame >= 1100 ? (
          <div
            style={{
              position: "absolute",
              right: frame >= 1100 ? 80 : 120,
              top: frame >= 1100 ? 120 : 190,
              width: frame >= 1100 ? 700 : 940,
              height: frame >= 1100 ? 440 : 700,
              borderRadius: 24,
              backgroundColor: T.glassBg,
              border: `1.5px solid ${T.glassBorder}`,
              boxShadow: T.glassShadow,
              backdropFilter: "blur(16px)",
              padding: 24,
              opacity: frame >= 1100 ? 0.95 : interpolate(webPanelSpring, [0, 1], [0, 1]),
              transform: frame >= 1100 ? "none" : `translateX(${interpolate(webPanelSpring, [0, 1], [80, 0])}px)`,
              zIndex: 20,
              overflow: "hidden",
            }}
          >
            {/* Floating Header Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: T.blueGlow,
                color: T.bluePrimary,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 1,
                marginBottom: 16,
              }}
            >
              <span>01</span>
              <span>HIGH-CONVERTING WEB DESIGN</span>
            </div>

            {/* Glassmorphic Web Browser Window */}
            <div
              style={{
                width: "100%",
                height: frame >= 1100 ? 340 : 580,
                borderRadius: 16,
                backgroundColor: "#ffffff",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: T.cardShadow,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Browser Bar */}
              <div
                style={{
                  height: 44,
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981" }} />
                </div>

                <div
                  style={{
                    flex: 1,
                    height: 26,
                    borderRadius: 6,
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.textMuted,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                  }}
                >
                  🔒 https://benyamin.design/web-system
                </div>

                {/* "Live Site" Toggle Button */}
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    backgroundColor: isLiveSiteClicked ? T.bluePrimary : "#e2e8f0",
                    color: isLiveSiteClicked ? "#ffffff" : T.textMuted,
                    fontSize: 11,
                    fontWeight: 800,
                    transform: `scale(${liveSiteScale})`,
                    boxShadow: isLiveSiteClicked ? T.glowShadow : "none",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {isLiveSiteClicked ? "● LIVE SITE ACTIVE" : "PREVIEW MODE"}
                </div>
              </div>

              {/* Web Content & Vertical Layout Cascade */}
              <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
                {/* Responsive Layout Card 1: Hero Banner */}
                <div
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    backgroundColor: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    transform: `translateY(${interpolate(layoutCard1Sp, [0, 1], [40, 0])}px)`,
                    opacity: interpolate(layoutCard1Sp, [0, 1], [0, 1]),
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 900, color: T.textDark }}>
                    SaaS Conversion Ecosystem
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>
                    Custom high-performance web applications built for extreme retention.
                  </div>
                </div>

                {/* Responsive Layout Card 2: Feature Matrix */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    transform: `translateY(${interpolate(layoutCard2Sp, [0, 1], [40, 0])}px)`,
                    opacity: interpolate(layoutCard2Sp, [0, 1], [0, 1]),
                  }}
                >
                  {["Lightning Speed", "Fluid Motion", "SEO Engineered"].map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        padding: 14,
                        borderRadius: 10,
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(15, 23, 42, 0.08)",
                        fontSize: 12,
                        fontWeight: 800,
                        color: T.textDark,
                        textAlign: "center",
                      }}
                    >
                      ⚡ {feat}
                    </div>
                  ))}
                </div>

                {/* Responsive Layout Card 3: Analytics Preview */}
                <div
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: "#f8fafc",
                    border: "1px solid rgba(15, 23, 42, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `translateY(${interpolate(layoutCard3Sp, [0, 1], [40, 0])}px)`,
                    opacity: interpolate(layoutCard3Sp, [0, 1], [0, 1]),
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textMuted }}>CONVERSION RATE</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: T.emeraldAccent }}>+340% Boost</div>
                  </div>
                  <div style={{ width: 120, height: 36, borderRadius: 8, backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: T.emeraldAccent, fontWeight: 900, fontSize: 13 }}>
                    📈 OPTIMIZED
                  </div>
                </div>
              </div>
            </div>

            {/* Sleek Cursor Gliding on Bezier Path */}
            {frame >= 280 && frame < 380 && frame < 1100 && (
              <div
                style={{
                  position: "absolute",
                  left: cursorX,
                  top: cursorY,
                  transform: "translate(-50%, -50%)",
                  zIndex: 50,
                  pointerEvents: "none",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 3L26 15L16 17L11 27L6 3Z" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
              </div>
            )}
          </div>
        ) : null}

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* PHASE 3: AUTOMATED DATA PIPELINES (FRAMES 540 - 840) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        {(frame >= 500 && frame < 860) || frame >= 1100 ? (
          <div
            style={{
              position: "absolute",
              left: frame >= 1100 ? 80 : 80,
              top: frame >= 1100 ? 600 : 190,
              width: frame >= 1100 ? 820 : 1760,
              height: frame >= 1100 ? 400 : 700,
              borderRadius: 24,
              backgroundColor: T.glassBg,
              border: `1.5px solid ${T.glassBorder}`,
              boxShadow: T.glassShadow,
              backdropFilter: "blur(16px)",
              padding: 24,
              opacity: frame >= 1100 ? 0.95 : interpolate(dataPanelSpring, [0, 1], [0, 1]),
              transform: frame >= 1100 ? "none" : `scale(${interpolate(dataPanelSpring, [0, 1], [0.92, 1])})`,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header & ROI Counter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: T.amberAccent,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                <span>02</span>
                <span>RUTHLESS DATA AUTOMATION</span>
              </div>

              {/* Ticking ROI Badge */}
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  backgroundColor: "#ecfdf5",
                  border: "1.5px solid #a7f3d0",
                  color: T.emeraldAccent,
                  fontSize: 15,
                  fontWeight: 900,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                }}
              >
                💰 ROI IMPACT: <span style={{ fontSize: 18 }}>${currentRoi}</span> Saved/mo
              </div>
            </div>

            {/* Split Pane: Left Raw Files | Right Structured Spreadsheet */}
            <div style={{ flex: 1, display: "flex", gap: 24 }}>
              {/* Left Pane: Raw Unstructured Data */}
              <div
                style={{
                  width: 320,
                  borderRadius: 16,
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fed7aa",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 900, color: T.amberAccent, letterSpacing: 1 }}>
                  📁 RAW UNSTRUCTURED INPUTS
                </div>
                {[
                  { name: "Raw_Leads_Q3.csv", size: "4.2 MB", tag: "CSV" },
                  { name: "Unstructured_Forms.json", size: "1.8 MB", tag: "JSON" },
                  { name: "Webhook_Payloads.xml", size: "850 KB", tag: "XML" },
                ].map((file, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      backgroundColor: "#ffffff",
                      border: "1px solid #ffedd5",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow: T.cardShadow,
                      transform: `translateY(${Math.sin((frame + i * 20) * 0.05) * 4}px)`,
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        backgroundColor: "#f97316",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {file.tag}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: T.textDark }}>{file.name}</div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>{file.size}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Pane: Clean Pale-Green Spreadsheet */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 16,
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 14px",
                    borderRadius: 8,
                    backgroundColor: "#f0fdf4",
                    fontSize: 11,
                    fontWeight: 900,
                    color: T.emeraldAccent,
                    letterSpacing: 1,
                  }}
                >
                  <span style={{ flex: 2 }}>LEAD NAME & COMPANY</span>
                  <span style={{ flex: 1.5 }}>ENRICHMENT STATUS</span>
                  <span style={{ flex: 1, textAlign: "right" }}>VERIFIED</span>
                </div>

                {/* Rows Populating Sequentially with Pop Elastic Checks */}
                {[
                  { name: "Ava Health • Founder", status: "Enriched via OpenAI", frameTrigger: 580 },
                  { name: "Guy Hawkins • VP Sales", status: "Verified on LinkedIn", frameTrigger: 620 },
                  { name: "Leslie Alexander • CEO", status: "Synced to CRM", frameTrigger: 660 },
                  { name: "Michael Scott • Regional Mgr", status: "Score: 98/100", frameTrigger: 700 },
                ].map((row, idx) => {
                  const isVisible = frame >= row.frameTrigger || frame >= 1100;
                  const rowCheckSpring = spring({
                    frame: Math.max(0, frame - row.frameTrigger),
                    fps,
                    config: { stiffness: 350, damping: 14 },
                  });
                  const checkScale = isVisible ? interpolate(rowCheckSpring, [0, 1], [0, 1]) : 0;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 10,
                        backgroundColor: idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                        border: "1px solid rgba(15, 23, 42, 0.04)",
                        opacity: isVisible ? 1 : 0.2,
                        transform: isVisible ? "none" : "translateY(10px)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ flex: 2, fontSize: 13, fontWeight: 800, color: T.textDark }}>
                        {row.name}
                      </div>
                      <div
                        style={{
                          flex: 1.5,
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.emeraldAccent,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: T.emeraldAccent,
                          }}
                        />
                        {row.status}
                      </div>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: "#10b981",
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: 900,
                            transform: `scale(${checkScale})`,
                            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          ✓
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* PHASE 4: N8N WORKFLOW INTEGRATION MATRIX (FRAMES 840 - 1140) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        {(frame >= 800 && frame < 1160) || frame >= 1100 ? (
          <div
            style={{
              position: "absolute",
              left: frame >= 1100 ? 940 : 120,
              top: frame >= 1100 ? 600 : 190,
              width: frame >= 1100 ? 900 : 1680,
              height: frame >= 1100 ? 400 : 700,
              borderRadius: 24,
              backgroundColor: T.glassBg,
              border: `1.5px solid ${T.glassBorder}`,
              boxShadow: T.glassShadow,
              backdropFilter: "blur(16px)",
              padding: 24,
              opacity: frame >= 1100 ? 0.95 : interpolate(n8nPanelSpring, [0, 1], [0, 1]),
              transform: frame >= 1100 ? "none" : `translateY(${interpolate(n8nPanelSpring, [0, 1], [80, 0])}px)`,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: "rgba(139, 92, 246, 0.15)",
                color: T.purpleAccent,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 1,
                marginBottom: 16,
                alignSelf: "flex-start",
              }}
            >
              <span>03</span>
              <span>CUSTOM N8N ECOSYSTEMS</span>
            </div>

            {/* Workflow Canvas + Cascading Notification Stack */}
            <div style={{ flex: 1, display: "flex", gap: 24, alignItems: "center" }}>
              {/* 4 Spaced n8n Nodes */}
              <div style={{ flex: 1.8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {[
                  { name: "Webhook", desc: "Form Trigger", color: "#f97316", bg: "#fff7ed" },
                  { name: "AI Engine", desc: "GPT-4o Parse", color: "#8b5cf6", bg: "#f5f3ff" },
                  { name: "Database", desc: "Postgres Sync", color: "#06b6d4", bg: "#ecfeff" },
                  { name: "Slack", desc: "Instant Alert", color: "#10b981", bg: "#ecfdf5" },
                ].map((node, i) => {
                  const nodeSpring = spring({
                    frame: Math.max(0, frame - (860 + i * 15)),
                    fps,
                    config: { stiffness: 220, damping: 20 },
                  });
                  const nScale = interpolate(nodeSpring, [0, 1], [0, 1]);

                  return (
                    <div
                      key={i}
                      style={{
                        width: 140,
                        padding: 16,
                        borderRadius: 16,
                        backgroundColor: node.bg,
                        border: `2px solid ${node.color}40`,
                        boxShadow: T.cardShadow,
                        textAlign: "center",
                        transform: `scale(${nScale})`,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          backgroundColor: node.color,
                          color: "#ffffff",
                          fontSize: 14,
                          fontWeight: 900,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 10px auto",
                          boxShadow: `0 8px 16px ${node.color}40`,
                        }}
                      >
                        ⚡
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: T.textDark }}>{node.name}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, marginTop: 2 }}>{node.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Right Side Cascading Stack of Completed Notification Panels */}
              <div
                style={{
                  width: frame >= 1100 ? 280 : 380,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 900, color: T.purpleAccent, letterSpacing: 1 }}>
                  🔔 LIVE ECOSYSTEM FEED
                </div>

                {[
                  { text: "Lead Enriched via OpenAI GPT-4o", time: "Just now", icon: "🤖" },
                  { text: "Postgres Row Created: #98402", time: "2s ago", icon: "💾" },
                  { text: "Slack Alert Sent: New $5,000 Deal!", time: "5s ago", icon: "🚀" },
                ].map((notif, idx) => {
                  const notifSpring = spring({
                    frame: Math.max(0, frame - (920 + idx * 25)),
                    fps,
                    config: { stiffness: 220, damping: 22 },
                  });
                  const notifY = interpolate(notifSpring, [0, 1], [30, 0]);
                  const notifOp = interpolate(notifSpring, [0, 1], [0, 1]);

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(15, 23, 42, 0.08)",
                        boxShadow: T.cardShadow,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transform: `translateY(${notifY}px)`,
                        opacity: notifOp,
                      }}
                    >
                      <div style={{ fontSize: 20 }}>{notif.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textDark }}>{notif.text}</div>
                        <div style={{ fontSize: 10, color: T.textMuted }}>{notif.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* PHASE 5: FULL PLATFORM OUTRO & FIVERR CTA (FRAMES 1140 - 1440) */}
        {/* ───────────────────────────────────────────────────────────────────── */}
        {frame >= 1100 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 40,
              transform: "translateX(-50%)",
              textAlign: "center",
              zIndex: 50,
            }}
          >
            {/* Master Headline */}
            <h1
              style={{
                fontSize: 54,
                fontWeight: 900,
                color: T.textDark,
                letterSpacing: "-2.5px",
                margin: 0,
                textShadow: "0 10px 30px rgba(255,255,255,0.8)",
              }}
            >
              Complete Digital Engineering.
            </h1>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: T.bluePrimary,
                letterSpacing: 2,
                marginTop: 6,
                textTransform: "uppercase",
              }}
            >
              Web • Automation • AI Ecosystems
            </div>

            {/* High-Contrast Fiverr CTA Button */}
            <div
              style={{
                marginTop: 20,
                transform: `translateY(${ctaY}px)`,
                opacity: ctaOpacity,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 40px",
                  borderRadius: 999,
                  backgroundColor: T.textDark,
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.3), 0 0 20px rgba(29, 191, 115, 0.4)",
                  border: `2px solid ${T.fiverrGreen}`,
                  cursor: "pointer",
                }}
              >
                <span>Order Your System Now</span>
                <span style={{ color: T.fiverrGreen, fontSize: 24 }}>→</span>
              </div>

              {/* Trust Subtext */}
              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  color: T.textMuted,
                  letterSpacing: 0.5,
                }}
              >
                ⚡ Fast Delivery • 100% Satisfaction Guarantee
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
