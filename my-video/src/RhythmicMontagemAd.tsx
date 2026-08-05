import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { AudioLayer } from "./AudioLayer";

// ═════════════════════════════════════════════════════════════════════════════
// HELPER UTILITIES & DESIGN SYSTEM (Google Workspace / Gemini Theme)
// ═════════════════════════════════════════════════════════════════════════════

const T = {
  bg: "#fcfcfd",
  ink: "#0f172a",
  slate: "#475569",
  subtle: "#94a3b8",
  blue: "#2563eb",
  blueGlow: "rgba(37, 99, 235, 0.25)",
  green: "#16a34a",
  greenTint: "#f0fdf4",
  emerald: "#22c55e",
  fiverrGreen: "#1dbf73",
  amber: "#d97706",
  amberTint: "#fef3c7",
  cardBg: "#ffffff",
  shadowHeavy: "0 30px 60px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.05)",
  shadowDeep: "0 40px 80px rgba(0, 0, 0, 0.18), 0 12px 28px rgba(0, 0, 0, 0.08)",
  shadowGlass: "0 20px 40px rgba(0, 0, 0, 0.08)",
};

const APP_ICONS = [
  { icon: "⚡", label: "n8n", col: "#ff6d5a" },
  { icon: "💳", label: "Stripe", col: "#635bff" },
  { icon: "💬", label: "Slack", col: "#4a154b" },
  { icon: "🤖", label: "OpenAI", col: "#10a37f" },
  { icon: "🛍️", label: "Shopify", col: "#95bf47" },
  { icon: "🗄️", label: "PostgreSQL", col: "#3b82f6" },
  { icon: "📧", label: "Gmail", col: "#ea4335" },
  { icon: "🎨", label: "Figma", col: "#f24e1e" },
  { icon: "📊", label: "Airtable", col: "#f87171" },
  { icon: "📝", label: "Notion", col: "#000000" },
  { icon: "🎯", label: "HubSpot", col: "#ff7a59" },
  { icon: "🐙", label: "GitHub", col: "#24292e" },
];

export const RhythmicMontagemAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══════════════════════════════════════════════════════════════════════════
  // AGGRESSIVE SPRING & RHYTHMIC ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  const sp = (delay: number, stiffness = 400, damping = 24) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness, damping },
    });

  // Smooth continuous camera scale (No beating/pumping effect)
  const globalScale = 1.0 + (frame / 1440) * 0.03;

  // ═══════════════════════════════════════════════════════════════════════════
  // TIMELINE KEYFRAMES & SPRINGS (Slower, Smooth Intro)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- PHASE 1: Gentle Kinetic Hook (0s - 4.5s / Frames 0 - 270) ---
  const p1Text1Sp = sp(15, 180, 22);  // "Slow Data Entry?"
  const p1CardSp  = sp(60, 180, 20);  // Overlapping Warning Card
  const p1Text2Sp = sp(105, 180, 22); // "Lost Leads?"
  const p1DropSp  = sp(160, 220, 24); // "3 Services. 1 Complete System."
  const p1SubSp   = sp(195, 180, 22); // Subtitle pill

  // --- PHASE 2: Web Design (Frames 260 - 520) ---
  // Frame 260 Text Wipe: 3 Services text scales 1x -> 22x
  const p1To2Wipe = interpolate(frame, [260, 295], [1, 22], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p1To2Op   = interpolate(frame, [275, 295], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const p2ShellSp = sp(280, 260, 24); // Browser shell expand
  const p2TitleSp = sp(290, 280, 22); // "1. High-Converting Web Design"
  const p2HeroSp  = sp(305, 300, 24); // Left hero column
  const p2Card1Sp = sp(320, 280, 20); // Portfolio Card 1
  const p2Card2Sp = sp(335, 280, 20); // Portfolio Card 2
  const p2Card3Sp = sp(350, 280, 20); // Portfolio Card 3

  // Bezier Cursor glide (Frames 320 - 420)
  const curProgress = interpolate(frame, [320, 400], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const curX = interpolate(curProgress, [0, 0.5, 1], [1300, 600, 380]);
  const curY = interpolate(curProgress, [0, 0.5, 1], [750, 500, 480]);
  const isBtnClicked = frame >= 400;
  const btnClickScale = isBtnClicked
    ? interpolate(frame, [400, 410, 430], [1, 0.92, 1], { extrapolateRight: "clamp" })
    : 1;
  const rippleOp = interpolate(frame, [400, 440], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleScale = interpolate(frame, [400, 440], [0.8, 3.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- PHASE 3 (8s - 13s / Frames 480 - 780) ---
  // Frame 480 Morph: Browser shell morphs into 3D Data Dashboard
  const p2To3Morph = interpolate(frame, [480, 520], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3DashW    = interpolate(p2To3Morph, [0, 1], [1560, 1420]);
  const p3DashH    = interpolate(p2To3Morph, [0, 1], [840, 720]);
  const p3TiltRotX = interpolate(p2To3Morph, [0, 1], [0, 16]);
  const p3TiltRotY = interpolate(p2To3Morph, [0, 1], [0, -10]);

  const p3TitleSp  = sp(500, 380, 22); // "2. Automated Data Entry"
  const p3Pill1Sp  = sp(515, 360, 20);
  const p3Pill2Sp  = sp(525, 360, 20);
  const p3Pill3Sp  = sp(535, 360, 20);

  // Live ROI counter ($0 -> $840 Saved/mo)
  const roiValue   = Math.floor(interpolate(frame, [510, 640], [0, 840], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const p3RoiSp    = sp(620, 450, 20); // Heavy ROI badge drop

  // Raw file springs & Structured row drop springs
  const p3RawSp    = (i: number) => sp(530 + i * 18, 380, 22);
  const p3RowSp    = (i: number) => sp(570 + i * 22, 420, 18);

  // --- PHASE 4 (13s - 18s / Frames 780 - 1080) ---
  // Frame 780: Camera pushes *through* canvas to n8n grid
  const p3To4PushScale = interpolate(frame, [780, 810], [1, 2.8], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3To4PushOp    = interpolate(frame, [795, 810], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const p4TitleSp  = sp(810, 380, 22); // "3. Custom n8n Workflows"
  // 4 Nodes slam in on Bass Kicks
  const p4Node1Sp  = sp(815, 500, 22); // Kick 1 @ Frame 815
  const p4Node2Sp  = sp(840, 500, 22); // Kick 2 @ Frame 840
  const p4Node3Sp  = sp(865, 500, 22); // Kick 3 @ Frame 865
  const p4Node4Sp  = sp(890, 500, 22); // Kick 4 @ Frame 890
  const p4BadgeSp  = sp(930, 450, 18); // "✓ 100% Automated" elastic badge

  // SVG Connector Line Draw Progress
  const line1Progress = interpolate(frame, [825, 840], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Progress = interpolate(frame, [850, 865], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Progress = interpolate(frame, [875, 890], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- PHASE 5 (18s - 24s / Frames 1080 - 1440) ---
  // Frame 1080: n8n canvas collapses into black singularity orb
  const p4To5Collapse = interpolate(frame, [1080, 1115], [1, 0.05], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const p5ExplodeSp = sp(1120, 350, 22); // Orbit explosion
  const p5TextSp    = sp(1140, 420, 24); // "Complete Digital Engineering."
  const p5CtaSp     = sp(1220, 550, 22); // Fiverr CTA slam @ Frame 1220

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bg,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        transform: `scale(${globalScale})`,
      }}
    >
      <AudioLayer />
      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 1: KINETIC BEAT-SYNC HOOK (0s - 3s / Frames 0 - 180)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame < 215 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: p1To2Op,
            transform: `scale(${p1To2Wipe})`,
            zIndex: 10,
          }}
        >
          {/* Beat 1 & 2 & 3 Text + Overlapping Cards */}
          {frame < 160 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Beat 1: "Slow Data Entry?" */}
              {frame >= 15 && (
                <div
                  style={{
                    overflow: "hidden",
                    transform: `scale(${interpolate(p1Text1Sp, [0, 1], [0.5, 1.0])}) translateY(${interpolate(p1Text1Sp, [0, 1], [60, frame >= 60 ? -30 : 0])}px)`,
                    opacity: interpolate(p1Text1Sp, [0, 1], [0, 1]),
                    transition: "transform 0.2s ease",
                  }}
                >
                  <h1
                    style={{
                      fontSize: 104,
                      fontWeight: 900,
                      color: T.ink,
                      letterSpacing: "-4px",
                      margin: 0,
                      textShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    }}
                  >
                    Slow Data Entry?
                  </h1>
                </div>
              )}

              {/* Beat 2: Overlapping Warning Badge (Frame 60) */}
              {frame >= 60 && (
                <div
                  style={{
                    marginTop: -16,
                    padding: "16px 36px",
                    borderRadius: 999,
                    backgroundColor: "#fef2f2",
                    border: "2px solid #fca5a5",
                    boxShadow: T.shadowHeavy,
                    transform: `scale(${interpolate(p1CardSp, [0, 1], [0.6, 1.0])}) translateY(${interpolate(p1CardSp, [0, 1], [100, 0])}px)`,
                    opacity: interpolate(p1CardSp, [0, 1], [0, 1]),
                    zIndex: 2,
                  }}
                >
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#dc2626", letterSpacing: -0.5 }}>
                    ⚠️ 14.2 Hours Wasted Every Week
                  </span>
                </div>
              )}

              {/* Beat 3: "Lost Leads?" (Frame 105) */}
              {frame >= 105 && (
                <div
                  style={{
                    marginTop: 12,
                    transform: `translateX(${interpolate(p1Text2Sp, [0, 1], [-600, 0])}px) rotate(${interpolate(p1Text2Sp, [0, 1], [-4, 0])}deg)`,
                    opacity: interpolate(p1Text2Sp, [0, 1], [0, 1]),
                    zIndex: 3,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 110,
                      fontWeight: 900,
                      color: "#dc2626",
                      letterSpacing: "-4px",
                      margin: 0,
                      textShadow: "0 15px 40px rgba(220,38,38,0.2)",
                    }}
                  >
                    Lost Leads?
                  </h2>
                </div>
              )}
            </div>
          )}

          {/* Frame 160 SMOOTH LANDING: "3 Services. 1 Complete System." */}
          {frame >= 160 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "0 40px",
              }}
            >
              <div
                style={{
                  transform: `scale(${interpolate(p1DropSp, [0, 1], [1.6, 1.0])})`,
                  opacity: interpolate(p1DropSp, [0, 1], [0, 1]),
                }}
              >
                <h1
                  style={{
                    fontSize: 108,
                    fontWeight: 900,
                    color: T.ink,
                    letterSpacing: "-4.5px",
                    lineHeight: 1.05,
                    margin: 0,
                  }}
                >
                  3 Services.
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #16a34a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    1 Complete System.
                  </span>
                </h1>
              </div>

              {/* Subtitle Pill (Frame 195) */}
              {frame >= 195 && (
                <div
                  style={{
                    marginTop: 36,
                    padding: "14px 38px",
                    borderRadius: 999,
                    backgroundColor: "#f1f5f9",
                    border: "1.5px solid #cbd5e1",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    transform: `translateY(${interpolate(p1SubSp, [0, 1], [40, 0])}px)`,
                    opacity: interpolate(p1SubSp, [0, 1], [0, 1]),
                  }}
                >
                  <span style={{ fontSize: 22, fontWeight: 800, color: T.slate, letterSpacing: 0.5 }}>
                    Web Design • Data Entry • Automation Workflows
                  </span>
                </div>
              )}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 2: WEB DESIGN — THE OVERLAP BUILD (3s - 8s / Frames 180 - 480)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 195 && frame < 495 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: frame >= 480 ? 1 - p2To3Morph : 1,
            zIndex: 20,
          }}
        >
          {/* Top Title Overlay */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 100,
              zIndex: 30,
              transform: `translateY(${interpolate(p2TitleSp, [0, 1], [-60, 0])}px)`,
              opacity: interpolate(p2TitleSp, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1.5px solid rgba(15, 23, 42, 0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: T.shadowGlass,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 900, color: T.ink, letterSpacing: -0.5 }}>
                1. High-Converting Web Design
              </span>
            </div>
          </div>

          {/* Browser Shell Container */}
          <div
            style={{
              width: 1560,
              height: 840,
              borderRadius: 20,
              backgroundColor: T.cardBg,
              boxShadow: T.shadowHeavy,
              border: "1.5px solid rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transform: `scale(${interpolate(p2ShellSp, [0, 1], [0.85, 1.0])}) translateY(${interpolate(p2ShellSp, [0, 1], [60, 0])}px)`,
              opacity: interpolate(p2ShellSp, [0, 1], [0, 1]),
              position: "relative",
            }}
          >
            {/* macOS Safari Browser Header */}
            <div
              style={{
                height: 48,
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  maxWidth: 540,
                  margin: "0 auto",
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: T.slate }}>https://your-high-converting-agency.com</span>
              </div>
            </div>

            {/* Browser Viewport 60/40 Layout */}
            <div style={{ flex: 1, display: "flex", padding: 48, gap: 48, position: "relative" }}>
              {/* Left Column: Typography & Compressed CTA */}
              <div
                style={{
                  flex: "0 0 52%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transform: `translateX(${interpolate(p2HeroSp, [0, 1], [-80, 0])}px)`,
                  opacity: interpolate(p2HeroSp, [0, 1], [0, 1]),
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    padding: "6px 14px",
                    borderRadius: 20,
                    backgroundColor: "#eff6ff",
                    color: T.blue,
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 16,
                  }}
                >
                  🚀 NEXT-GEN DIGITAL AGENCY
                </div>
                <h2 style={{ fontSize: 64, fontWeight: 900, color: T.ink, letterSpacing: "-2.5px", lineHeight: 1.08, margin: 0 }}>
                  Scale Your Brand.
                  <br />
                  Convert More Visitors.
                </h2>
                <p style={{ fontSize: 20, fontWeight: 500, color: T.slate, marginTop: 16, lineHeight: 1.5, maxWidth: 520 }}>
                  Bespoke, high-performance marketing web applications engineered for maximum ROI and speed.
                </p>

                {/* Interactive Clickable CTA Button */}
                <div style={{ marginTop: 32, position: "relative", alignSelf: "flex-start" }}>
                  <button
                    style={{
                      padding: "20px 42px",
                      borderRadius: 999,
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "#ffffff",
                      fontSize: 20,
                      fontWeight: 800,
                      border: "none",
                      boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                      transform: `scale(${btnClickScale})`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span>Launch Campaign</span>
                    <span style={{ fontSize: 22 }}>→</span>
                  </button>

                  {/* Colorful Click Ripple Effect */}
                  {isBtnClicked && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "40%",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #2563eb",
                        transform: `translate(-50%, -50%) scale(${rippleScale})`,
                        opacity: rippleOp,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Cascading 3D Floating Cards */}
              <div style={{ flex: 1, position: "relative", perspective: 1000, transformStyle: "preserve-3d" }}>
                {/* Card 1: AI SaaS Dashboard */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 40,
                    width: 420,
                    height: 220,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
                    padding: 24,
                    boxShadow: T.shadowHeavy,
                    transform: `translateZ(60px) rotateY(-10deg) rotateX(6deg) scale(${interpolate(p2Card1Sp, [0, 1], [0.6, 1.0])})`,
                    opacity: interpolate(p2Card1Sp, [0, 1], [0, 1]),
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#a5b4fc", letterSpacing: 1.5 }}>AI DASHBOARD</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>+348% Conversion</div>
                  <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.8)" }} />
                    <div style={{ width: "40%", height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.4)" }} />
                  </div>
                </div>

                {/* Card 2: FinTech Analytics */}
                <div
                  style={{
                    position: "absolute",
                    top: 180,
                    right: 120,
                    width: 400,
                    height: 210,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                    padding: 24,
                    boxShadow: T.shadowHeavy,
                    transform: `translateZ(90px) rotateY(-8deg) rotateX(4deg) scale(${interpolate(p2Card2Sp, [0, 1], [0.6, 1.0])})`,
                    opacity: interpolate(p2Card2Sp, [0, 1], [0, 1]),
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#6ee7b7", letterSpacing: 1.5 }}>FINTECH ENGINE</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>$1.4M Processed</div>
                  <div style={{ marginTop: 20, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)" }} />
                </div>

                {/* Card 3: E-Commerce Storefront */}
                <div
                  style={{
                    position: "absolute",
                    top: 340,
                    right: 20,
                    width: 440,
                    height: 200,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
                    padding: 24,
                    boxShadow: T.shadowHeavy,
                    transform: `translateZ(120px) rotateY(-12deg) rotateX(8deg) scale(${interpolate(p2Card3Sp, [0, 1], [0.6, 1.0])})`,
                    opacity: interpolate(p2Card3Sp, [0, 1], [0, 1]),
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fdba74", letterSpacing: 1.5 }}>E-COMMERCE STORE</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>Ultra-Fast Checkout</div>
                </div>
              </div>
            </div>

            {/* Bezier High-Res Mac Cursor */}
            {frame >= 320 && frame < 450 && (
              <div
                style={{
                  position: "absolute",
                  left: curX,
                  top: curY,
                  pointerEvents: "none",
                  zIndex: 100,
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))",
                }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3L10.07 19.97L13.58 13.58L19.97 10.07L3 3Z"
                    fill="#000000"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 3: DATA ENTRY — THE FLUID MORPH (8s - 13s / Frames 480 - 780)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 480 && frame < 795 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1200,
            opacity: frame >= 780 ? p3To4PushOp : interpolate(frame, [480, 500], [0, 1]),
            transform: `scale(${frame >= 780 ? p3To4PushScale : 1.0})`,
            zIndex: 30,
          }}
        >
          {/* Top Title Overlay */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 100,
              zIndex: 40,
              transform: `translateY(${interpolate(p3TitleSp, [0, 1], [-60, 0])}px)`,
              opacity: interpolate(p3TitleSp, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1.5px solid rgba(15, 23, 42, 0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: T.shadowGlass,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 900, color: T.ink, letterSpacing: -0.5 }}>
                2. Automated Data Entry
              </span>
            </div>
          </div>

          {/* Morphing 3D Dashboard Board */}
          <div
            style={{
              width: p3DashW,
              height: p3DashH,
              borderRadius: 24,
              backgroundColor: T.cardBg,
              boxShadow: T.shadowDeep,
              border: "1.5px solid rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transformStyle: "preserve-3d",
              transform: `rotateX(${p3TiltRotX}deg) rotateY(${p3TiltRotY}deg)`,
              position: "relative",
            }}
          >
            {/* Header & Subtext Pills */}
            <div style={{ padding: "32px 48px 0", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: 44, fontWeight: 900, color: T.ink, letterSpacing: "-1.5px", margin: 0 }}>
                  Automated Extraction Engine
                </h3>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  {[
                    { label: "Web Scraping", spVal: p3Pill1Sp },
                    { label: "PDF & CSV Parsing", spVal: p3Pill2Sp },
                    { label: "Database Sync", spVal: p3Pill3Sp },
                  ].map((pill, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 18px",
                        borderRadius: 20,
                        backgroundColor: T.greenTint,
                        border: "1px solid rgba(22, 163, 74, 0.25)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.green,
                        transform: `scale(${interpolate(pill.spVal, [0, 1], [0.6, 1.0])})`,
                        opacity: interpolate(pill.spVal, [0, 1], [0, 1]),
                      }}
                    >
                      {pill.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rhythmic ROI Counter Badge */}
              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: 18,
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                  border: "1.5px solid rgba(34, 197, 94, 0.35)",
                  backdropFilter: "blur(12px)",
                  textAlign: "center",
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.15)",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: T.green, letterSpacing: -1 }}>
                  ${roiValue}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#15803d", opacity: 0.85 }}>Saved / month</div>
              </div>
            </div>

            {/* Dashboard Viewport Flow */}
            <div style={{ flex: 1, margin: "24px 48px 32px", borderRadius: 20, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", position: "relative", overflow: "hidden" }}>
              {/* Column 1: Messy Raw Files (Fly in from Left) */}
              <div style={{ width: 340, padding: 24, borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.subtle, letterSpacing: 1.5 }}>RAW UNSTRUCTURED INPUT</div>
                {[
                  "raw_leads_dump_2026.csv",
                  "webhook_payload_x901.json",
                  "acme_contacts_dirty.xlsx",
                  "scraped_web_elements.html",
                ].map((fileName, i) => {
                  const s = p3RawSp(i);
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 12,
                        backgroundColor: T.amberTint,
                        border: "1px solid #fde68a",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.amber,
                        fontFamily: "monospace",
                        transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)`,
                        opacity: interpolate(s, [0, 1], [0, 1]),
                      }}
                    >
                      📁 {fileName}
                    </div>
                  );
                })}
              </div>

              {/* Center Column: Spinning AI Node */}
              <div style={{ width: 120, backgroundColor: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, borderRight: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: T.emerald,
                    color: "#ffffff",
                    fontSize: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `rotate(${frame * 4}deg) scale(${1.0 + Math.sin(frame * 0.15) * 0.08})`,
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)",
                  }}
                >
                  ⚡
                </div>
                <span style={{ fontSize: 12, fontWeight: 900, color: T.green, letterSpacing: 1 }}>AI CORE</span>
              </div>

              {/* Column 3: Structured Output (Z-Axis Drop Rows) */}
              <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 12, transformStyle: "preserve-3d" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.subtle, letterSpacing: 1.5 }}>CLEAN STRUCTURED OUTPUT</div>
                {[
                  "✓ John Doe  |  Qualified Lead  |  Q3 2026",
                  "✓ $1,200 Payment Processed  |  Stripe",
                  "✓ Acme Corp  |  14 Contacts Synced",
                  "✓ Sarah Chen  |  Hot Lead  |  NYC",
                ].map((rowText, i) => {
                  const s = p3RowSp(i);
                  const zDrop = interpolate(s, [0, 1], [50, 0]);
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "14px 20px",
                        borderRadius: 14,
                        backgroundColor: T.greenTint,
                        border: "1px solid #bbf7d0",
                        fontSize: 15,
                        fontWeight: 700,
                        color: T.green,
                        transform: `translateZ(${zDrop}px) translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                        opacity: interpolate(s, [0, 1], [0, 1]),
                        boxShadow: "0 4px 14px rgba(34, 197, 94, 0.12)",
                      }}
                    >
                      {rowText}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TO THE BEAT: Massive "$840 Saved/mo" Badge Drop */}
            {frame >= 620 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  right: 50,
                  padding: "18px 38px",
                  borderRadius: 999,
                  backgroundColor: T.green,
                  color: "#ffffff",
                  boxShadow: T.shadowDeep,
                  transform: `scale(${interpolate(p3RoiSp, [0, 1], [1.8, 1.0])}) translateZ(80px)`,
                  opacity: interpolate(p3RoiSp, [0, 1], [0, 1]),
                  zIndex: 50,
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>
                  💰 $840 Saved / Month Guaranteed
                </span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 4: n8n WORKFLOWS — THE NODE SNAP (13s - 18s / Frames 780 - 1080)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 795 && frame < 1095 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: frame >= 1080 ? p4To5Collapse : interpolate(frame, [795, 810], [0, 1]),
            transform: `scale(${frame >= 1080 ? p4To5Collapse : 1.0})`,
            zIndex: 40,
          }}
        >
          {/* Subtle n8n Dot Grid Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
              opacity: 0.6,
            }}
          />

          {/* Top Title Overlay */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 100,
              zIndex: 50,
              transform: `translateY(${interpolate(p4TitleSp, [0, 1], [-60, 0])}px)`,
              opacity: interpolate(p4TitleSp, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1.5px solid rgba(15, 23, 42, 0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: T.shadowGlass,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 900, color: T.ink, letterSpacing: -0.5 }}>
                3. Custom n8n Workflows
              </span>
            </div>
          </div>

          {/* SVG Connector Lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
            {/* Line 1 -> 2 */}
            <path
              d="M 380 540 L 700 540"
              stroke="#ff6d5a"
              strokeWidth="5"
              fill="none"
              strokeDasharray="320"
              strokeDashoffset={320 * (1 - line1Progress)}
            />
            {/* Line 2 -> 3 */}
            <path
              d="M 700 540 L 1020 540"
              stroke="#635bff"
              strokeWidth="5"
              fill="none"
              strokeDasharray="320"
              strokeDashoffset={320 * (1 - line2Progress)}
            />
            {/* Line 3 -> 4 */}
            <path
              d="M 1020 540 L 1340 540"
              stroke="#10b981"
              strokeWidth="5"
              fill="none"
              strokeDasharray="320"
              strokeDashoffset={320 * (1 - line3Progress)}
            />
          </svg>

          {/* 4 n8n Nodes Slamming in on Bass Kicks */}
          <div style={{ display: "flex", gap: 140, position: "relative", zIndex: 20 }}>
            {/* Node 1: Webhook Trigger (Frame 815) */}
            <div
              style={{
                width: 200,
                height: 180,
                borderRadius: 24,
                backgroundColor: T.cardBg,
                boxShadow: T.shadowHeavy,
                border: "2px solid #ff6d5a",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transform: `translateY(${interpolate(p4Node1Sp, [0, 1], [-400, 0])}px)`,
                opacity: interpolate(p4Node1Sp, [0, 1], [0, 1]),
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#ff6d5a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}>
                ⚡
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.ink }}>Webhook Trigger</div>
            </div>

            {/* Node 2: AI Parsing (Frame 840) */}
            <div
              style={{
                width: 200,
                height: 180,
                borderRadius: 24,
                backgroundColor: T.cardBg,
                boxShadow: T.shadowHeavy,
                border: "2px solid #635bff",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transform: `translateX(${interpolate(p4Node2Sp, [0, 1], [-400, 0])}px)`,
                opacity: interpolate(p4Node2Sp, [0, 1], [0, 1]),
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#635bff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}>
                🤖
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.ink }}>AI Lead Extract</div>
            </div>

            {/* Node 3: PostgreSQL (Frame 865) */}
            <div
              style={{
                width: 200,
                height: 180,
                borderRadius: 24,
                backgroundColor: T.cardBg,
                boxShadow: T.shadowHeavy,
                border: "2px solid #3b82f6",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transform: `translateY(${interpolate(p4Node3Sp, [0, 1], [400, 0])}px)`,
                opacity: interpolate(p4Node3Sp, [0, 1], [0, 1]),
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}>
                🗄️
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.ink }}>PostgreSQL DB</div>
            </div>

            {/* Node 4: Slack & Email (Frame 890) */}
            <div
              style={{
                width: 200,
                height: 180,
                borderRadius: 24,
                backgroundColor: T.cardBg,
                boxShadow: T.shadowHeavy,
                border: "2px solid #10b981",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transform: `translateX(${interpolate(p4Node4Sp, [0, 1], [400, 0])}px)`,
                opacity: interpolate(p4Node4Sp, [0, 1], [0, 1]),
                position: "relative",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}>
                📬
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.ink }}>Slack & Notify</div>

              {/* Elastic Badge: "✓ 100% Automated" */}
              {frame >= 930 && (
                <div
                  style={{
                    position: "absolute",
                    top: -24,
                    right: -30,
                    padding: "8px 18px",
                    borderRadius: 999,
                    backgroundColor: T.green,
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 900,
                    boxShadow: T.shadowHeavy,
                    transform: `scale(${interpolate(p4BadgeSp, [0, 1], [0, 1.0])})`,
                    opacity: interpolate(p4BadgeSp, [0, 1], [0, 1]),
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ 100% Automated
                </div>
              )}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 5: THE GOOGLE / GEMINI RADIAL OUTRO (18s - 24s / Frames 1080 - 1440)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 1080 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [1080, 1110], [0, 1]),
            zIndex: 50,
          }}
        >
          {/* Radial App Icon Orbit Ring */}
          <div
            style={{
              position: "relative",
              width: 720,
              height: 720,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${frame * 0.4}deg) scale(${interpolate(p5ExplodeSp, [0, 1], [0.1, 1.0])})`,
              opacity: interpolate(p5ExplodeSp, [0, 1], [0, 1]),
            }}
          >
            {APP_ICONS.map((app, i) => {
              const angle = (i / APP_ICONS.length) * Math.PI * 2;
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
                    backgroundColor: T.cardBg,
                    border: `2px solid ${app.col}`,
                    boxShadow: T.shadowHeavy,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    transform: `rotate(-${frame * 0.4}deg)`, // Keep icons counter-rotated
                  }}
                >
                  {app.icon}
                </div>
              );
            })}
          </div>

          {/* Central Typography: "Complete Digital Engineering." */}
          <div
            style={{
              position: "absolute",
              textAlign: "center",
              transform: `scale(${interpolate(p5TextSp, [0, 1], [0.5, 1.0])})`,
              opacity: interpolate(p5TextSp, [0, 1], [0, 1]),
              zIndex: 60,
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: T.ink,
                letterSpacing: "-3px",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Complete Digital
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #16a34a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Engineering.
              </span>
            </h1>
          </div>

          {/* Frame 1220 FINAL BEAT DROP: Bold Fiverr CTA Card Slam */}
          {frame >= 1220 && (
            <div
              style={{
                position: "absolute",
                bottom: 120,
                zIndex: 100,
                transform: `scale(${interpolate(p5CtaSp, [0, 1], [2.2, 1.0])})`,
                opacity: interpolate(p5CtaSp, [0, 1], [0, 1]),
              }}
            >
              <div
                style={{
                  padding: "24px 54px",
                  borderRadius: 999,
                  backgroundColor: T.ink,
                  boxShadow: "0 35px 70px rgba(0, 0, 0, 0.35)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.subtle, letterSpacing: 1.5 }}>
                    READY TO AUTOMATE?
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
                  <span style={{ fontSize: 24 }}>→</span>
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
