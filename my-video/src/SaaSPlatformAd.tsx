import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { AudioLayer } from "./AudioLayer";

// ═════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM & DESIGN TOKENS (Linear / Vercel / Stripe Aesthetic)
// ═════════════════════════════════════════════════════════════════════════════

const T = {
  bgLight: "#fafafa",
  bgDark: "#090d16",
  panelLight: "#ffffff",
  panelDark: "#131b2e",
  borderLight: "rgba(0, 0, 0, 0.08)",
  borderDark: "rgba(255, 255, 255, 0.12)",
  textDark: "#0f172a",
  textLight: "#f8fafc",
  textMuted: "#64748b",
  textMutedDark: "#94a3b8",
  accentBlue: "#3b82f6",
  accentIndigo: "#6366f1",
  accentEmerald: "#10b981",
  accentPurple: "#8b5cf6",
  accentAmber: "#f59e0b",
  fiverrGreen: "#1dbf73",
  shadowLux: "0 40px 80px rgba(0, 0, 0, 0.08), 0 12px 28px rgba(0, 0, 0, 0.04)",
  shadowDarkLux: "0 40px 100px rgba(0, 0, 0, 0.6), 0 15px 35px rgba(0, 0, 0, 0.4)",
  shadowGlass: "0 20px 40px rgba(0, 0, 0, 0.06)",
};

const INTEGRATION_APPS = [
  { icon: "⚡", label: "n8n", col: "#ff6d5a" },
  { icon: "💳", label: "Stripe", col: "#635bff" },
  { icon: "💬", label: "Slack", col: "#4a154b" },
  { icon: "🤖", label: "OpenAI", col: "#10a37f" },
  { icon: "🛍️", label: "Shopify", col: "#95bf47" },
  { icon: "🗄️", label: "PostgreSQL", col: "#3b82f6" },
  { icon: "📧", label: "Gmail", col: "#ea4335" },
  { icon: "🎨", label: "Figma", col: "#f24e1e" },
  { icon: "📊", label: "Airtable", col: "#f87171" },
  { icon: "📝", label: "Notion", col: "#ffffff" },
  { icon: "🎯", label: "HubSpot", col: "#ff7a59" },
  { icon: "▲", label: "Vercel", col: "#000000" },
];

export const SaaSPlatformAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══════════════════════════════════════════════════════════════════════════
  // SILKY SPRINGS & CONTINUOUS CINEMATIC DRIFT ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  // Silky B2B SaaS Spring: soft, elegant UI settling
  const spSilky = (delay: number, stiffness = 90, damping = 20) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness, damping },
    });

  // Snappy sub-element spring
  const spPop = (delay: number) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness: 180, damping: 22 },
    });

  // Continuous micro-slow-zoom drift (1.0 -> 1.05 over 1440 frames)
  const globalDrift = interpolate(frame, [0, 1440], [1.0, 1.05], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TIMELINE & PHASE TRANSITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // --- PHASE 1: Atmospheric Problem & Reveal (0s - 5s / Frames 0 - 315) ---
  const p1FadeIn = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: "clamp" });
  const p1Title1Sp = spSilky(20, 60, 22);  // "Fragmented Tools & Manual Chaos?"
  const p1Title1ExitOp = interpolate(frame, [130, 155], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p1Title1ExitY  = interpolate(frame, [130, 155], [0, -35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const p1Title2Sp = spSilky(150, 60, 22); // "Unified AI Operations Platform."
  const p1BadgeSp  = spSilky(185, 70, 22);

  // Transition 1->2 (Frame 280 - 315): Smooth camera scale push & fade
  const p1To2Push = interpolate(frame, [280, 315], [1, 1.12], { easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const p1To2Op   = interpolate(frame, [295, 315], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- PHASE 2: Web Design & Linear SaaS Builder (5s - 9.5s / Frames 300 - 570) ---
  const p2ShellSp  = spSilky(300, 70, 22);
  const p2HeaderSp = spSilky(315, 80, 22);
  const p2SideSp   = spSilky(330, 70, 22);
  const p2Card1Sp  = spSilky(360, 90, 20);
  const p2Card2Sp  = spSilky(380, 90, 20);

  // Micro-interactions: Loading Bar (Frames 370 - 470) & Toggle Switch (Frame 440)
  const loadProgress = interpolate(frame, [370, 470], [0, 100], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isToggleOn = frame >= 440;
  const toggleThumbX = isToggleOn ? 24 : 2;

  // Sleek Cursor Bezier Path (Frames 420 - 500)
  const curProgress = interpolate(frame, [420, 500], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const curX = interpolate(curProgress, [0, 0.5, 1], [1400, 750, 430]);
  const curY = interpolate(curProgress, [0, 0.5, 1], [800, 560, 520]);
  const isDeployClicked = frame >= 500;
  const deployBtnScale = isDeployClicked
    ? interpolate(frame, [500, 508, 525], [1, 0.94, 1], { extrapolateRight: "clamp" })
    : 1;

  // --- PHASE 3: Data Extraction & Live Financial Analytics (9s - 14s / Frames 540 - 840) ---
  // Morph Frame 540: Dashboard panel resizes & rotates into 3D isometric view
  const p2To3Morph = interpolate(frame, [540, 580], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3DashW    = interpolate(p2To3Morph, [0, 1], [1560, 1440]);
  const p3DashH    = interpolate(p2To3Morph, [0, 1], [840, 740]);
  const p3TiltRotX = interpolate(p2To3Morph, [0, 1], [0, 14]);
  const p3TiltRotY = interpolate(p2To3Morph, [0, 1], [0, -8]);

  const p3HeaderSp = spSilky(555, 90, 20);
  const p3RawSp    = (i: number) => spSilky(570 + i * 18, 100, 20);
  const p3RowSp    = (i: number) => spSilky(610 + i * 20, 110, 18);
  const p3ChartGrow = interpolate(frame, [630, 740], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const roiValue   = Math.floor(interpolate(frame, [580, 720], [0, 840], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const p3RoiBadgeSp = spSilky(680, 100, 20);

  // --- PHASE 4: Dark Obsidian n8n Workflow Canvas (14s - 19s / Frames 840 - 1140) ---
  // Frame 840: Transition to Obsidian Dark Mode Canvas
  const p3To4PushScale = interpolate(frame, [840, 875], [1, 2.5], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3To4PushOp    = interpolate(frame, [855, 875], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const p4TitleSp  = spSilky(875, 90, 20);
  const p4Node1Sp  = spSilky(885, 100, 20);
  const p4Node2Sp  = spSilky(910, 100, 20);
  const p4Node3Sp  = spSilky(935, 100, 20);
  const p4Node4Sp  = spSilky(960, 100, 20);
  const p4BadgeSp  = spPop(1000);

  const cable1Draw = interpolate(frame, [895, 910], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cable2Draw = interpolate(frame, [920, 935], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cable3Draw = interpolate(frame, [945, 960], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- PHASE 5: Radial Singularity & Fiverr Outro (19s - 24s / Frames 1140 - 1440) ---
  const p4To5Collapse = interpolate(frame, [1140, 1175], [1, 0.05], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p5ExplodeSp = spSilky(1180, 80, 20);
  const p5TextSp    = spSilky(1200, 90, 20);
  const p5CtaSp     = spSilky(1260, 100, 20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bgLight,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        transform: `scale(${globalDrift})`,
      }}
    >
      <AudioLayer />

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 1: ATMOSPHERIC PROBLEM & REVEAL (0s - 5s / Frames 0 - 315)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame < 315 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: p1FadeIn * p1To2Op,
            transform: `scale(${p1To2Push})`,
            zIndex: 10,
          }}
        >
          {/* Subtle Background Radial Mesh */}
          <div
            style={{
              position: "absolute",
              width: 1200,
              height: 1200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ textAlign: "center", padding: "0 60px", maxWidth: 1200 }}>
            {/* Step 1 Problem Text */}
            {frame < 155 && (
              <div
                style={{
                  transform: `translateY(${interpolate(p1Title1Sp, [0, 1], [40, 0]) + p1Title1ExitY}px)`,
                  opacity: interpolate(p1Title1Sp, [0, 1], [0, 1]) * p1Title1ExitOp,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "8px 20px",
                    borderRadius: 999,
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 20,
                    letterSpacing: 0.5,
                  }}
                >
                  THE INEFFICIENCY BOTTLENECK
                </div>
                <h1 style={{ fontSize: 88, fontWeight: 900, color: T.textDark, letterSpacing: "-3.5px", margin: 0, lineHeight: 1.05 }}>
                  Fragmented Tools?
                  <br />
                  Manual Data Overhead?
                </h1>
              </div>
            )}

            {/* Step 2 Platform Reveal */}
            {frame >= 145 && (
              <div
                style={{
                  transform: `translateY(${interpolate(p1Title2Sp, [0, 1], [50, 0])}px)`,
                  opacity: interpolate(p1Title2Sp, [0, 1], [0, 1]),
                }}
              >
                <h1 style={{ fontSize: 96, fontWeight: 900, color: T.textDark, letterSpacing: "-4px", margin: 0, lineHeight: 1.05 }}>
                  One Unified
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    AI Operations Platform.
                  </span>
                </h1>

                {frame >= 175 && (
                  <div
                    style={{
                      marginTop: 36,
                      display: "inline-flex",
                      padding: "14px 36px",
                      borderRadius: 999,
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      boxShadow: T.shadowLux,
                      transform: `scale(${interpolate(p1BadgeSp, [0, 1], [0.8, 1.0])})`,
                      opacity: interpolate(p1BadgeSp, [0, 1], [0, 1]),
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 700, color: T.textMuted }}>
                      Web Engineering • Automated Data Parsing • Custom Workflows
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 2: HIGH-FIDELITY WEB AGENCY BUILDER (5s - 9.5s / Frames 285 - 570)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 285 && frame < 575 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: frame >= 540 ? 1 - p2To3Morph : 1,
            zIndex: 20,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 80,
              zIndex: 40,
              transform: `translateY(${interpolate(p2HeaderSp, [0, 1], [-40, 0])}px)`,
              opacity: interpolate(p2HeaderSp, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: T.shadowGlass,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 900, color: T.textDark, letterSpacing: -0.5 }}>
                1. High-Converting Web Engineering
              </span>
            </div>
          </div>

          {/* Primary Dashboard Container */}
          <div
            style={{
              width: 1560,
              height: 840,
              borderRadius: 24,
              backgroundColor: T.panelLight,
              boxShadow: T.shadowLux,
              border: "1px solid " + T.borderLight,
              overflow: "hidden",
              display: "flex",
              transform: `scale(${interpolate(p2ShellSp, [0, 1], [0.9, 1.0])}) translateY(${interpolate(p2ShellSp, [0, 1], [40, 0])}px)`,
              opacity: interpolate(p2ShellSp, [0, 1], [0, 1]),
              position: "relative",
            }}
          >
            {/* Sidebar Navigation */}
            <div
              style={{
                width: 260,
                backgroundColor: "#f8fafc",
                borderRight: "1px solid #e2e8f0",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transform: `translateX(${interpolate(p2SideSp, [0, 1], [-40, 0])}px)`,
                opacity: interpolate(p2SideSp, [0, 1], [0, 1]),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: T.accentBlue, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14 }}>
                  ▲
                </div>
                <span style={{ fontSize: 16, fontWeight: 900, color: T.textDark }}>Studio Core</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                {[
                  { label: "Overview", icon: "📊", active: true },
                  { label: "Analytics", icon: "📈", active: false },
                  { label: "Deployments", icon: "🚀", active: false },
                  { label: "Settings", icon: "⚙️", active: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      backgroundColor: item.active ? "#ffffff" : "transparent",
                      boxShadow: item.active ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                      border: item.active ? "1px solid #e2e8f0" : "1px solid transparent",
                      fontSize: 14,
                      fontWeight: 700,
                      color: item.active ? T.accentBlue : T.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar Micro-Interaction: Toggle Switch */}
              <div style={{ marginTop: "auto", padding: 14, borderRadius: 14, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, marginBottom: 8 }}>AUTOMATIC DEPLOY</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isToggleOn ? T.accentEmerald : T.textMuted }}>
                    {isToggleOn ? "Active" : "Disabled"}
                  </span>
                  <div
                    style={{
                      width: 48,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: isToggleOn ? T.accentEmerald : "#cbd5e1",
                      padding: 2,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        transform: `translateX(${toggleThumbX}px)`,
                        transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Canvas Viewport */}
            <div style={{ flex: 1, padding: 40, display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Top Banner & Progress Bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: T.accentBlue, letterSpacing: 1 }}>PROJECT ENGINE</span>
                    <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textDark, letterSpacing: "-1.5px", margin: "4px 0 0" }}>
                      Scale Your Enterprise Web App
                    </h2>
                  </div>

                  {/* Micro-Interaction: Loading Bar */}
                  <div style={{ width: 220, textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T.textMuted, marginBottom: 6 }}>
                      COMPILATION: {Math.floor(loadProgress)}%
                    </div>
                    <div style={{ width: "100%", height: 8, borderRadius: 4, backgroundColor: "#e2e8f0", overflow: "hidden" }}>
                      <div style={{ width: `${loadProgress}%`, height: "100%", backgroundColor: T.accentBlue, borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Overlapping Card Matrix */}
              <div style={{ flex: 1, display: "flex", gap: 24, perspective: 1000, transformStyle: "preserve-3d" }}>
                {/* Card 1: Revenue Metrics */}
                <div
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    padding: 28,
                    color: "#ffffff",
                    boxShadow: T.shadowLux,
                    transform: `translateZ(40px) rotateY(-6deg) scale(${interpolate(p2Card1Sp, [0, 1], [0.8, 1.0])})`,
                    opacity: interpolate(p2Card1Sp, [0, 1], [0, 1]),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5 }}>LIVE REVENUE</div>
                    <div style={{ fontSize: 36, fontWeight: 900, marginTop: 8 }}>+412% MRR Growth</div>
                  </div>
                  <div style={{ height: 100, display: "flex", alignItems: "flex-end", gap: 12 }}>
                    {[35, 55, 45, 75, 60, 95].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${h}%`,
                          borderRadius: 6,
                          backgroundColor: i === 5 ? T.accentEmerald : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Card 2: Interactive Deploy Trigger */}
                <div
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    backgroundColor: "#ffffff",
                    border: "1.5px solid #e2e8f0",
                    padding: 28,
                    boxShadow: T.shadowLux,
                    transform: `translateZ(70px) rotateY(-4deg) scale(${interpolate(p2Card2Sp, [0, 1], [0.8, 1.0])})`,
                    opacity: interpolate(p2Card2Sp, [0, 1], [0, 1]),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.accentIndigo, letterSpacing: 1.5 }}>CI/CD PIPELINE</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: T.textDark, marginTop: 8 }}>Automated Build</div>
                  </div>

                  <button
                    style={{
                      padding: "18px 32px",
                      borderRadius: 14,
                      backgroundColor: T.textDark,
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: 800,
                      border: "none",
                      boxShadow: "0 10px 25px rgba(15,23,42,0.25)",
                      transform: `scale(${deployBtnScale})`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <span>Deploy Studio</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bezier Pointer Cursor */}
            {frame >= 360 && frame < 480 && (
              <div
                style={{
                  position: "absolute",
                  left: curX,
                  top: curY,
                  pointerEvents: "none",
                  zIndex: 100,
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.3))",
                }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3L10.07 19.97L13.58 13.58L19.97 10.07L3 3Z" fill="#000000" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 3: DATA EXTRACTION & LIVE ANALYTICS (9s - 14s / Frames 540 - 840)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 540 && frame < 855 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1200,
            opacity: frame >= 840 ? p3To4PushOp : interpolate(frame, [540, 560], [0, 1]),
            transform: `scale(${frame >= 840 ? p3To4PushScale : 1.0})`,
            zIndex: 30,
          }}
        >
          {/* Header Overlay */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 80,
              zIndex: 40,
              transform: `translateY(${interpolate(p3HeaderSp, [0, 1], [-40, 0])}px)`,
              opacity: interpolate(p3HeaderSp, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: T.shadowGlass,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 900, color: T.textDark, letterSpacing: -0.5 }}>
                2. Automated Data Extraction
              </span>
            </div>
          </div>

          {/* Morphing 3D Dashboard */}
          <div
            style={{
              width: p3DashW,
              height: p3DashH,
              borderRadius: 24,
              backgroundColor: T.panelLight,
              boxShadow: T.shadowLux,
              border: "1px solid " + T.borderLight,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transformStyle: "preserve-3d",
              transform: `rotateX(${p3TiltRotX}deg) rotateY(${p3TiltRotY}deg)`,
              position: "relative",
            }}
          >
            {/* Header & ROI Counter */}
            <div style={{ padding: "32px 48px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 40, fontWeight: 900, color: T.textDark, letterSpacing: "-1.5px", margin: 0 }}>
                  Live Data Extraction Engine
                </h3>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.textMuted, marginTop: 6 }}>
                  Scrape • Parse • Validate • Export
                </div>
              </div>

              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: 18,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1.5px solid rgba(16, 185, 129, 0.3)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: T.accentEmerald, letterSpacing: -1 }}>${roiValue}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#047857" }}>Saved / month</div>
              </div>
            </div>

            {/* Extraction Data Viewport */}
            <div style={{ flex: 1, margin: "24px 48px 32px", borderRadius: 20, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", position: "relative", overflow: "hidden" }}>
              {/* Left Column: Raw Files */}
              <div style={{ width: 340, padding: 24, borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.textMuted, letterSpacing: 1.5 }}>UNSTRUCTURED INPUT</div>
                {["raw_lead_dump.csv", "webhook_x901.json", "acme_contacts.xlsx"].map((fileName, i) => {
                  const s = p3RawSp(i);
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 12,
                        backgroundColor: "#fef3c7",
                        border: "1px solid #fde68a",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.accentAmber,
                        fontFamily: "monospace",
                        transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`,
                        opacity: interpolate(s, [0, 1], [0, 1]),
                      }}
                    >
                      📁 {fileName}
                    </div>
                  );
                })}
              </div>

              {/* Middle Column: Y-Axis Animated Area Chart */}
              <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.textMuted, letterSpacing: 1.5 }}>LIVE PROCESSING THROUGHPUT</div>
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-end" }}>
                  <svg style={{ width: "100%", height: "100%", overflow: "visible" }}>
                    <path
                      d="M 0 160 Q 120 40, 240 100 T 480 30"
                      fill="none"
                      stroke={T.accentEmerald}
                      strokeWidth="4"
                      strokeDasharray="600"
                      strokeDashoffset={600 * (1 - p3ChartGrow)}
                    />
                  </svg>
                </div>
              </div>

              {/* Right Column: Structured Output */}
              <div style={{ width: 360, padding: 24, borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.textMuted, letterSpacing: 1.5 }}>STRUCTURED OUTPUT</div>
                {["✓ John Doe | Lead", "✓ $1,200 Payment", "✓ Acme Corp Synced"].map((rowText, i) => {
                  const s = p3RowSp(i);
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 12,
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.accentEmerald,
                        transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
                        opacity: interpolate(s, [0, 1], [0, 1]),
                      }}
                    >
                      {rowText}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROI Glassmorphic Badge */}
            {frame >= 680 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  right: 50,
                  padding: "16px 36px",
                  borderRadius: 999,
                  backgroundColor: T.accentEmerald,
                  color: "#ffffff",
                  boxShadow: T.shadowLux,
                  transform: `scale(${interpolate(p3RoiBadgeSp, [0, 1], [0.8, 1.0])}) translateZ(60px)`,
                  opacity: interpolate(p3RoiBadgeSp, [0, 1], [0, 1]),
                  zIndex: 50,
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 900 }}>💰 $840 Saved / Month</span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 4: DARK OBSIDIAN n8n WORKFLOW CANVAS (14s - 19s / Frames 840 - 1140)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 850 && frame < 1155 && (
        <AbsoluteFill
          style={{
            backgroundColor: T.bgDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: frame >= 1140 ? p4To5Collapse : interpolate(frame, [850, 870], [0, 1]),
            transform: `scale(${frame >= 1140 ? p4To5Collapse : 1.0})`,
            zIndex: 40,
          }}
        >
          {/* Subtle Obsidian Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
              backgroundSize: "36px 36px",
              opacity: 0.4,
            }}
          />

          {/* Header Overlay */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 80,
              zIndex: 50,
              transform: `translateY(${interpolate(p4TitleSp, [0, 1], [-40, 0])}px)`,
              opacity: interpolate(p4TitleSp, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(19, 27, 46, 0.9)",
                border: "1px solid " + T.borderDark,
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 900, color: T.textLight, letterSpacing: -0.5 }}>
                3. Custom n8n Workflows
              </span>
            </div>
          </div>

          {/* SVG Cable Lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
            <path d="M 380 540 L 700 540" stroke="#ff6d5a" strokeWidth="4" strokeDasharray="320" strokeDashoffset={320 * (1 - cable1Draw)} />
            <path d="M 700 540 L 1020 540" stroke="#635bff" strokeWidth="4" strokeDasharray="320" strokeDashoffset={320 * (1 - cable2Draw)} />
            <path d="M 1020 540 L 1340 540" stroke="#10b981" strokeWidth="4" strokeDasharray="320" strokeDashoffset={320 * (1 - cable3Draw)} />
          </svg>

          {/* 4 Nodes */}
          <div style={{ display: "flex", gap: 140, position: "relative", zIndex: 20 }}>
            {[
              { label: "Webhook Trigger", icon: "⚡", col: "#ff6d5a", spVal: p4Node1Sp },
              { label: "AI Lead Extract", icon: "🤖", col: "#635bff", spVal: p4Node2Sp },
              { label: "PostgreSQL DB", icon: "🗄️", col: "#3b82f6", spVal: p4Node3Sp },
              { label: "Slack & Notify", icon: "📬", col: "#10b981", spVal: p4Node4Sp },
            ].map((node, i) => (
              <div
                key={i}
                style={{
                  width: 200,
                  height: 180,
                  borderRadius: 24,
                  backgroundColor: T.panelDark,
                  border: `2px solid ${node.col}`,
                  boxShadow: T.shadowDarkLux,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transform: `translateY(${interpolate(node.spVal, [0, 1], [40, 0])}px)`,
                  opacity: interpolate(node.spVal, [0, 1], [0, 1]),
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: node.col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff" }}>
                  {node.icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: T.textLight }}>{node.label}</div>
              </div>
            ))}
          </div>

          {/* Badge */}
          {frame >= 1000 && (
            <div
              style={{
                position: "absolute",
                bottom: 120,
                padding: "14px 36px",
                borderRadius: 999,
                backgroundColor: T.accentEmerald,
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 900,
                boxShadow: T.shadowDarkLux,
                transform: `scale(${interpolate(p4BadgeSp, [0, 1], [0.8, 1.0])})`,
                opacity: interpolate(p4BadgeSp, [0, 1], [0, 1]),
              }}
            >
              ✓ 100% Automated System
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 5: RADIAL ORBIT & FIVERR OUTRO (19s - 24s / Frames 1140 - 1440)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 1140 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [1140, 1165], [0, 1]),
            zIndex: 50,
          }}
        >
          {/* Radial App Orbit Ring */}
          <div
            style={{
              position: "relative",
              width: 720,
              height: 720,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${frame * 0.3}deg) scale(${interpolate(p5ExplodeSp, [0, 1], [0.3, 1.0])})`,
              opacity: interpolate(p5ExplodeSp, [0, 1], [0, 1]),
            }}
          >
            {INTEGRATION_APPS.map((app, i) => {
              const angle = (i / INTEGRATION_APPS.length) * Math.PI * 2;
              const radius = 340;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 360 + x - 36,
                    top: 360 + y - 36,
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    backgroundColor: "#ffffff",
                    border: `2px solid ${app.col}`,
                    boxShadow: T.shadowLux,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    transform: `rotate(-${frame * 0.3}deg)`,
                  }}
                >
                  {app.icon}
                </div>
              );
            })}
          </div>

          {/* Central Hero Typography */}
          <div
            style={{
              position: "absolute",
              textAlign: "center",
              transform: `scale(${interpolate(p5TextSp, [0, 1], [0.8, 1.0])})`,
              opacity: interpolate(p5TextSp, [0, 1], [0, 1]),
              zIndex: 60,
            }}
          >
            <h1 style={{ fontSize: 72, fontWeight: 900, color: T.textDark, letterSpacing: "-3px", margin: 0, lineHeight: 1.1 }}>
              Complete Digital
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Engineering.
              </span>
            </h1>
          </div>

          {/* Final Fiverr CTA Card */}
          {frame >= 1260 && (
            <div
              style={{
                position: "absolute",
                bottom: 120,
                zIndex: 100,
                transform: `scale(${interpolate(p5CtaSp, [0, 1], [0.85, 1.0])})`,
                opacity: interpolate(p5CtaSp, [0, 1], [0, 1]),
              }}
            >
              <div
                style={{
                  padding: "24px 54px",
                  borderRadius: 999,
                  backgroundColor: T.textDark,
                  boxShadow: "0 35px 70px rgba(0, 0, 0, 0.25)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.textMutedDark, letterSpacing: 1.5 }}>
                    READY TO SCALE?
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff" }}>
                    Hire an Expert on <span style={{ color: T.fiverrGreen }}>Fiverr</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 28px",
                    borderRadius: 999,
                    backgroundColor: T.fiverrGreen,
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 10px 25px rgba(29, 191, 115, 0.4)",
                  }}
                >
                  <span>Order Now</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
