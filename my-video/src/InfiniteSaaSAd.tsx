import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { AudioLayer } from "./AudioLayer";

// ═════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS & COLOR SYSTEM (Obsidian Dark Mode x Neon Cyan/Emerald)
// ═════════════════════════════════════════════════════════════════════════════

const T = {
  bgObsidian: "#070a11",
  panelDark: "#0d1322",
  panelGlass: "rgba(13, 19, 34, 0.75)",
  borderDark: "rgba(255, 255, 255, 0.1)",
  borderGlow: "rgba(6, 182, 212, 0.4)",
  cyan: "#06b6d4",
  cyanGlow: "rgba(6, 182, 212, 0.5)",
  emerald: "#10b981",
  emeraldGlow: "rgba(16, 185, 129, 0.5)",
  purple: "#8b5cf6",
  roseRed: "#f43f5e",
  textWhite: "#ffffff",
  textMuted: "#94a3b8",
  fiverrGreen: "#1dbf73",
  shadowGlass: "0 30px 70px rgba(0, 0, 0, 0.6), 0 10px 25px rgba(0, 0, 0, 0.4)",
};

const WORKFLOW_NODES = [
  { icon: "💳", label: "Stripe API", sub: "Payment Trigger", col: "#635bff", x: 3300, y: 360 },
  { icon: "🤖", label: "AI Agent", sub: "LLM Processing", col: "#10b981", x: 3300, y: 540 },
  { icon: "🎯", label: "CRM Sync", sub: "HubSpot DB", col: "#ff7a59", x: 3300, y: 720 },
];

export const InfiniteSaaSAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══════════════════════════════════════════════════════════════════════════
  // THE INFINITE PAN & CAMERA ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  // Silky B2B Spring
  const spSilky = (delay: number, stiffness = 80, damping = 20) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness, damping },
    });

  // Infinite Pan X: Smoothly glides camera from 0px to -3000px (Frames 0 -> 1140)
  const panX = interpolate(frame, [0, 1140], [0, -3000], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  // Phase 5 Pullback: Camera stops panning and pulls back scale 1.0 -> 0.56 (Frames 1140 -> 1440)
  const cameraScale = interpolate(frame, [1140, 1380], [1.0, 0.56], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pullback Offset centering adjustment when scaled back
  const pullbackPanX = interpolate(frame, [1140, 1380], [-3000, -1450], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const activePanX = frame >= 1140 ? pullbackPanX : panX;

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTED DATA THREAD & LIGHT PACKETS
  // ═══════════════════════════════════════════════════════════════════════════

  // Red tangled lines morph into glowing cyan thread (Frames 30 - 90)
  const threadGlow = interpolate(frame, [30, 90], [0.2, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packet1Pos = interpolate(frame, [100, 360], [200, 1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packet2Pos = interpolate(frame, [420, 680], [1400, 2400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packet3Pos = interpolate(frame, [720, 980], [2400, 3300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE TIMELINE SPRINGS & KEYFRAMES
  // ═══════════════════════════════════════════════════════════════════════════

  // --- PHASE 1 (0s - 4s / Frames 0 - 240) ---
  const p1Text1Sp  = spSilky(15);
  const p1Text1Op  = interpolate(frame, [110, 135], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p1Text2Sp  = spSilky(135);

  // --- PHASE 2 (4s - 9s / Frames 240 - 540) ---
  const p2UiSp     = spSilky(220); // Web UI slides up Z-axis
  const p2BadgeSp  = spSilky(260); // Floating Foreground Badge 1
  const p2Wirefill = interpolate(frame, [280, 420], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.2, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isFormSubmitted = frame >= 400;
  const formPulseScale  = isFormSubmitted
    ? interpolate(frame, [400, 410, 430], [1, 0.92, 1], { extrapolateRight: "clamp" })
    : 1;

  // --- PHASE 3 (9s - 14s / Frames 540 - 840) ---
  const p3DashSp   = spSilky(520); // Data Dashboard slide up
  const p3BadgeSp  = spSilky(560); // Floating Badge 2
  const p3ChartGrow = interpolate(frame, [600, 760], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3RowsSp   = (i: number) => spSilky(620 + i * 20);

  // --- PHASE 4 (14s - 19s / Frames 840 - 1140) ---
  const p4CanvasSp = spSilky(820);
  const p4BadgeSp  = spSilky(860); // Floating Badge 3
  const p4NodeSp   = (i: number) => spSilky(880 + i * 25);
  const nodeProgressRing = interpolate(frame, [900, 1100], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- PHASE 5 (19s - 24s / Frames 1140 - 1440) ---
  const p5HeroTextSp = spSilky(1180);
  const p5CtaSp      = spSilky(1240);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bgObsidian,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <AudioLayer />

      {/* Deep Background Glowing Blurred Orbs (Following Camera) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          transform: `translateX(${activePanX * 0.3}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 600,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 2200,
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE INFINITE CANVAS STAGE (PANNING CAMERA CONTAINER)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 4800,
          height: 1080,
          transformOrigin: "50% 50%",
          transform: `scale(${cameraScale}) translateX(${activePanX}px)`,
          transition: "transform 0.05s linear",
        }}
      >
        {/* Continuous Dot Grid Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
            opacity: 0.5,
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            THE CONNECTED GLOWING DATA THREAD (SPANNING SCENE 1 TO 4)
            ═══════════════════════════════════════════════════════════════════ */}
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
          {/* Phase 1 Disorganized Red Tangled Lines (Fading Out) */}
          {frame < 90 && (
            <g opacity={1 - threadGlow}>
              <path d="M 100 540 C 200 420, 300 660, 400 480 C 500 600, 600 450, 700 540" stroke={T.roseRed} strokeWidth="3" fill="none" strokeDasharray="8 6" opacity="0.7" />
              <path d="M 120 500 C 220 620, 340 400, 460 580 C 560 420, 640 580, 700 540" stroke={T.roseRed} strokeWidth="2" fill="none" opacity="0.5" />
            </g>
          )}

          {/* Main Glowing Cyan & Emerald Continuous Data Thread */}
          <path
            d="M 100 540 L 1400 540 L 2400 540 C 2700 540, 2900 360, 3300 360 M 2400 540 L 3300 540 M 2400 540 C 2700 540, 2900 720, 3300 720"
            stroke="url(#threadGrad)"
            strokeWidth="4"
            fill="none"
            opacity={threadGlow}
            filter="drop-shadow(0 0 12px #06b6d4)"
          />

          <defs>
            <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#635bff" />
            </linearGradient>
          </defs>

          {/* Animated Light Packets Travelling Along Thread */}
          {frame >= 100 && frame <= 360 && (
            <circle cx={packet1Pos} cy={540} r="7" fill="#06b6d4" filter="drop-shadow(0 0 14px #06b6d4)" />
          )}
          {frame >= 420 && frame <= 680 && (
            <circle cx={packet2Pos} cy={540} r="7" fill="#10b981" filter="drop-shadow(0 0 14px #10b981)" />
          )}
          {frame >= 720 && frame <= 980 && (
            <circle cx={packet3Pos} cy={540} r="7" fill="#635bff" filter="drop-shadow(0 0 14px #635bff)" />
          )}
        </svg>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 1: THE HOOK — CHAOS TO STRUCTURE (X: 100 - 800)
            ═══════════════════════════════════════════════════════════════════ */}
        <div style={{ position: "absolute", left: 180, top: 380, width: 700, zIndex: 20 }}>
          {/* Text 1: "Stop building in silos." */}
          {frame < 140 && (
            <div
              style={{
                transform: `translateY(${interpolate(p1Text1Sp, [0, 1], [40, 0])}px)`,
                opacity: interpolate(p1Text1Sp, [0, 1], [0, 1]) * p1Text1Op,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: T.roseRed, letterSpacing: 2, marginBottom: 12 }}>
                DISORGANIZED WORKFLOWS
              </div>
              <h1 style={{ fontSize: 80, fontWeight: 900, color: T.textWhite, letterSpacing: "-3px", margin: 0, lineHeight: 1.05 }}>
                Stop building
                <br />
                in silos.
              </h1>
            </div>
          )}

          {/* Text 2: "Build an ecosystem." */}
          {frame >= 135 && (
            <div
              style={{
                transform: `translateY(${interpolate(p1Text2Sp, [0, 1], [40, 0])}px)`,
                opacity: interpolate(p1Text2Sp, [0, 1], [0, 1]),
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: T.cyan, letterSpacing: 2, marginBottom: 12 }}>
                UNIFIED INFRASTRUCTURE
              </div>
              <h1 style={{ fontSize: 84, fontWeight: 900, color: T.textWhite, letterSpacing: "-3.5px", margin: 0, lineHeight: 1.05 }}>
                Build an
                <br />
                <span style={{ background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ecosystem.
                </span>
              </h1>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 2: WEB DESIGN — THE CAPTURE POINT (X: 1100 - 1900)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: 1100,
            top: 140,
            width: 820,
            height: 800,
            borderRadius: 24,
            backgroundColor: T.panelGlass,
            backdropFilter: "blur(16px)",
            border: "1.5px solid " + T.borderGlow,
            boxShadow: T.shadowGlass,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            transform: `translateZ(${interpolate(p2UiSp, [0, 1], [-100, 0])}px) translateY(${interpolate(p2UiSp, [0, 1], [60, 0])}px)`,
            opacity: interpolate(p2UiSp, [0, 1], [0, 1]),
            zIndex: 20,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.cyan }}>agency-web-portal.app</span>
          </div>

          {/* Wireframe to High-Res Component Morph */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.cyan, letterSpacing: 1.5 }}>FRONT-END ARCHITECTURE</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textWhite, letterSpacing: "-1.5px", margin: 0 }}>
              High-Converting Portal
            </h2>

            {/* Skeleton vs Real components morph */}
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1, height: 120, borderRadius: 16, backgroundColor: interpolateColors(p2Wirefill, [0, 1], ["rgba(255,255,255,0.05)", "rgba(6, 182, 212, 0.15)"]), border: "1px solid " + T.cyan, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted }}>SaaS Dashboard Component</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.textWhite, marginTop: 8 }}>+284% Conversion</div>
              </div>
              <div style={{ flex: 1, height: 120, borderRadius: 16, backgroundColor: interpolateColors(p2Wirefill, [0, 1], ["rgba(255,255,255,0.05)", "rgba(16, 185, 129, 0.15)"]), border: "1px solid " + T.emerald, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted }}>Fast Lead Form</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.textWhite, marginTop: 8 }}>0.4s Load Time</div>
              </div>
            </div>

            {/* Form Submit Button (Plugs into Data Thread) */}
            <button
              style={{
                marginTop: 20,
                padding: "20px 36px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 900,
                border: "none",
                boxShadow: "0 10px 30px rgba(6, 182, 212, 0.4)",
                transform: `scale(${formPulseScale})`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <span>Submit & Sync Lead</span>
              <span>⚡</span>
            </button>
          </div>
        </div>

        {/* Floating Foreground Out-of-Focus Badge 1 */}
        <div
          style={{
            position: "absolute",
            left: 1450,
            top: 60,
            zIndex: 50,
            transform: `translateY(${interpolate(p2BadgeSp, [0, 1], [40, 0])}px)`,
            opacity: interpolate(p2BadgeSp, [0, 1], [0, 1]),
            filter: "blur(3px)",
          }}
        >
          <div style={{ padding: "10px 24px", borderRadius: 999, backgroundColor: "rgba(6, 182, 212, 0.2)", border: "1px solid #06b6d4", color: T.textWhite, fontSize: 20, fontWeight: 900 }}>
            1. Front-End Architecture
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 3: DATA ENTRY — THE PROCESSING ENGINE (X: 2100 - 2900)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: 2100,
            top: 140,
            width: 860,
            height: 800,
            borderRadius: 24,
            backgroundColor: T.panelGlass,
            backdropFilter: "blur(16px)",
            border: "1.5px solid " + T.borderGlow,
            boxShadow: T.shadowGlass,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            transform: `translateY(${interpolate(p3DashSp, [0, 1], [60, 0])}px)`,
            opacity: interpolate(p3DashSp, [0, 1], [0, 1]),
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: T.emerald, letterSpacing: 1.5 }}>AUTOMATED PIPELINES</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textWhite, letterSpacing: "-1.5px", margin: 0 }}>
            Data Parsing & Extraction Core
          </h2>

          {/* Eye-Candy Animated Y-Axis Bar Chart */}
          <div style={{ height: 200, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid " + T.borderDark, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted }}>REAL-TIME PARSING THROUGHPUT</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 120 }}>
              {[40, 65, 50, 85, 70, 100].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * p3ChartGrow}%`,
                    borderRadius: 8,
                    background: i === 5 ? "linear-gradient(180deg, #10b981 0%, #059669 100%)" : "rgba(255,255,255,0.15)",
                    boxShadow: i === 5 ? "0 0 20px rgba(16, 185, 129, 0.5)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* JSON Strings Decrypting into Clean Table Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["✓ Lead #3841 | John Doe | Validated", "✓ $1,200 Payment Synced | Stripe", "✓ 100% Extracted | Zero Errors"].map((rowText, i) => {
              const s = p3RowsSp(i);
              return (
                <div
                  key={i}
                  style={{
                    padding: "14px 20px",
                    borderRadius: 12,
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.emerald,
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

        {/* Floating Badge 2 */}
        <div
          style={{
            position: "absolute",
            left: 2450,
            top: 60,
            zIndex: 50,
            transform: `translateY(${interpolate(p3BadgeSp, [0, 1], [40, 0])}px)`,
            opacity: interpolate(p3BadgeSp, [0, 1], [0, 1]),
            filter: "blur(2px)",
          }}
        >
          <div style={{ padding: "10px 24px", borderRadius: 999, backgroundColor: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", color: T.textWhite, fontSize: 20, fontWeight: 900 }}>
            2. Automated Pipelines
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 4: n8n WORKFLOWS — THE BRAIN (X: 3100 - 3900)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            left: 3100,
            top: 140,
            width: 820,
            height: 800,
            zIndex: 20,
            transform: `translateY(${interpolate(p4CanvasSp, [0, 1], [40, 0])}px)`,
            opacity: interpolate(p4CanvasSp, [0, 1], [0, 1]),
          }}
        >
          {/* 3 Floating 3D n8n Nodes */}
          {WORKFLOW_NODES.map((node, i) => {
            const s = p4NodeSp(i);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 100,
                  top: i * 220 + 80,
                  width: 380,
                  height: 150,
                  borderRadius: 20,
                  backgroundColor: T.panelGlass,
                  backdropFilter: "blur(16px)",
                  border: `2px solid ${node.col}`,
                  boxShadow: T.shadowGlass,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  transform: `translateX(${interpolate(s, [0, 1], [80, 0])}px)`,
                  opacity: interpolate(s, [0, 1], [0, 1]),
                }}
              >
                <div style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: node.col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff" }}>
                  {node.icon}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: T.textWhite }}>{node.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.textMuted, marginTop: 4 }}>{node.sub}</div>

                  {/* Circular progress ring */}
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 120, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                      <div style={{ width: `${nodeProgressRing}%`, height: "100%", backgroundColor: node.col }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: node.col }}>{Math.floor(nodeProgressRing)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Badge 3 */}
        <div
          style={{
            position: "absolute",
            left: 3350,
            top: 60,
            zIndex: 50,
            transform: `translateY(${interpolate(p4BadgeSp, [0, 1], [40, 0])}px)`,
            opacity: interpolate(p4BadgeSp, [0, 1], [0, 1]),
          }}
        >
          <div style={{ padding: "10px 24px", borderRadius: 999, backgroundColor: "rgba(139, 92, 246, 0.2)", border: "1px solid #8b5cf6", color: T.textWhite, fontSize: 20, fontWeight: 900 }}>
            3. Logic & Automation
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 5: THE MACRO VIEW & FIVERR CTA (19s - 24s / Frames 1140 - 1440)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 1140 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          {/* Center Hero Typography */}
          <div
            style={{
              textAlign: "center",
              transform: `scale(${interpolate(p5HeroTextSp, [0, 1], [0.6, 1.0])})`,
              opacity: interpolate(p5HeroTextSp, [0, 1], [0, 1]),
            }}
          >
            <h1
              style={{
                fontSize: 84,
                fontWeight: 900,
                color: T.textWhite,
                letterSpacing: "-3.5px",
                margin: 0,
                lineHeight: 1.05,
                textShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            >
              One Seamless
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Infrastructure.
              </span>
            </h1>
          </div>

          {/* Premium Fiverr CTA Card */}
          {frame >= 1240 && (
            <div
              style={{
                position: "absolute",
                bottom: 100,
                transform: `scale(${interpolate(p5CtaSp, [0, 1], [0.8, 1.0])}) translateY(${interpolate(p5CtaSp, [0, 1], [40, 0])}px)`,
                opacity: interpolate(p5CtaSp, [0, 1], [0, 1]),
                pointerEvents: "auto",
              }}
            >
              <div
                style={{
                  padding: "24px 56px",
                  borderRadius: 999,
                  backgroundColor: T.panelDark,
                  border: "2px solid rgba(6, 182, 212, 0.4)",
                  boxShadow: "0 35px 80px rgba(0, 0, 0, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.cyan, letterSpacing: 1.5 }}>
                    READY TO DEPLOY YOUR SYSTEM?
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: T.textWhite }}>
                    Hire an Expert on <span style={{ color: T.fiverrGreen }}>Fiverr</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px 32px",
                    borderRadius: 999,
                    backgroundColor: T.fiverrGreen,
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 10px 30px rgba(29, 191, 115, 0.4)",
                  }}
                >
                  <span>Deploy System</span>
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
