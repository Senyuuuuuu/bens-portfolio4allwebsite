import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { AudioLayer } from "./AudioLayer";

// ═════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS (Off-White, Crisp Dark Typography & n8n Orange Accents)
// ═════════════════════════════════════════════════════════════════════════════

const T = {
  bgLight: "#f8f9fa",
  bgPure: "#ffffff",
  cardBg: "#ffffff",
  borderLight: "#e5e7eb",
  borderOrange: "#fdba74",
  n8nOrange: "#ea580c",
  n8nOrangeGlow: "rgba(234, 88, 12, 0.4)",
  emeraldGreen: "#10b981",
  fiverrGreen: "#1dbf73",
  textDark: "#202124",
  textMuted: "#5f6368",
  shadowApple: "0 20px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04)",
  shadowLux: "0 30px 70px rgba(0, 0, 0, 0.12), 0 10px 25px rgba(0, 0, 0, 0.06)",
};

const INTEGRATION_ICONS = [
  { name: "Stripe", icon: "💳", color: "#635bff" },
  { name: "OpenAI", icon: "🤖", color: "#10a37f" },
  { name: "Slack", icon: "💬", color: "#e01e5a" },
  { name: "Webflow", icon: "🌐", color: "#4353ff" },
  { name: "HubSpot", icon: "🎯", color: "#ff7a59" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791" },
  { name: "Shopify", icon: "🛍️", color: "#95bf47" },
  { name: "Gmail", icon: "✉️", color: "#ea4335" },
];

export const CleanFlyThroughAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE MOTION & PHYSICS ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  // Snappy UI Spring (stiffness: 350, damping: 25)
  const spSnappy = (delay: number) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness: 350, damping: 25 },
    });

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: APP LAUNCH & DOCK RIPPLE (0s - 2.5s / Frames 0 - 150)
  // ═══════════════════════════════════════════════════════════════════════════

  const p1DockSp = spSnappy(10);

  // Black Cursor Sweep (Frames 30 - 80)
  const cursorProgress = interpolate(frame, [30, 75], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [1400, 1010]);
  const cursorY = interpolate(cursorProgress, [0, 1], [1000, 930]);

  // Icon Hover Bounce (Frame 70) & Click Event (Frame 85)
  const n8nIconHover = frame >= 65 && frame < 85;
  const isDockClicked = frame >= 85;
  const n8nIconScale = isDockClicked
    ? interpolate(frame, [85, 92, 105], [1.2, 0.9, 1.0], { extrapolateRight: "clamp" })
    : n8nIconHover
    ? 1.2
    : 1.0;

  // n8n Orange Circular Ripple Explosion (Frames 85 - 150)
  const rippleRadius = interpolate(frame, [85, 140], [0, 2400], {
    easing: Easing.bezier(0.1, 0.9, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: SPRAWLING CANVAS CAMERA PAN (2.5s - 9s / Frames 150 - 540)
  // ═══════════════════════════════════════════════════════════════════════════

  // Pan 1 (Frames 150 - 270): Top-Left Web Design UI (Pan X: -300, Y: -200)
  // Pan 2 (Frames 270 - 410): Sweeps Down-Right to Data Entry Spreadsheet (Pan X: -1600, Y: -1000)
  // Pan 3 (Frames 410 - 540): Sweeps Right to n8n Workflow Grid (Pan X: -2900, Y: -500)

  const canvasPanX = interpolate(
    frame,
    [150, 270, 410, 540],
    [-300, -300, -1600, -2900],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const canvasPanY = interpolate(
    frame,
    [150, 270, 410, 540],
    [-200, -200, -1000, -500],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Micro-interactions in Phase 2
  const checkmarkSp = (i: number) => spSnappy(320 + i * 15);
  const webUiSp = spSnappy(160);
  const dataUiSp = spSnappy(290);
  const n8nUiSp = spSnappy(430);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: GRAPHIC WIPE & DEEP ZOOM (9s - 13s / Frames 540 - 780)
  // ═══════════════════════════════════════════════════════════════════════════

  // Geometric 45-degree n8n-Orange Line Wipe across screen (Frames 540 - 600)
  const wipeX = interpolate(frame, [540, 600], [-1920, 2400], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Deep Camera Zoom IN right into connector wire (Frames 600 - 780: Scale 1.0 -> 3.0)
  const deepZoomScale = interpolate(frame, [600, 750], [1.0, 3.0], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const deepZoomX = interpolate(frame, [600, 750], [0, -150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Data Pulse along Connector Wire (Frames 630 - 720)
  const pulsePos = interpolate(frame, [630, 720], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const automatedBadgeSp = spSnappy(680);
  const textDropSp = spSnappy(640);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: OUTRO SNAP & RADIAL ORBIT (13s - 18s / Frames 780 - 1080)
  // ═══════════════════════════════════════════════════════════════════════════

  // Rapid Camera Z-Axis Pullback (Scale 3.0 -> 0.8 @ Frames 780 - 840)
  const outroPullbackScale = interpolate(frame, [780, 840], [3.0, 0.85], {
    easing: Easing.bezier(0.1, 0.9, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outroCenterLogoSp = spSnappy(810);
  const outroOrbitSp = spSnappy(840);
  const outroTextSp = spSnappy(880);
  const fiverrLogoSp = spSnappy(930);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bgLight,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <AudioLayer />

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 1: MINIMALIST MACOS DOCK & RIPPLE WIPE (0s - 2.5s / Frames 0 - 150)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame < 150 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30 }}>
          {/* Top Headline */}
          <div
            style={{
              position: "absolute",
              top: 240,
              textAlign: "center",
              transform: `translateY(${interpolate(p1DockSp, [0, 1], [30, 0])}px)`,
              opacity: interpolate(p1DockSp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: T.n8nOrange, letterSpacing: 2, marginBottom: 12 }}>
              THE AUTOMATION LAUNCHPAD
            </div>
            <h1 style={{ fontSize: 72, fontWeight: 900, color: T.textDark, letterSpacing: "-3px", margin: 0 }}>
              Launch Your Business Engine.
            </h1>
          </div>

          {/* Minimalist macOS Dock */}
          <div
            style={{
              position: "absolute",
              bottom: 100,
              padding: "16px 28px",
              borderRadius: 28,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid " + T.borderLight,
              boxShadow: T.shadowLux,
              display: "flex",
              alignItems: "center",
              gap: 24,
              transform: `translateY(${interpolate(p1DockSp, [0, 1], [60, 0])}px)`,
              opacity: interpolate(p1DockSp, [0, 1], [0, 1]),
            }}
          >
            {/* Dock Icon 1: Web */}
            <div style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff" }}>
              🌐
            </div>
            {/* Dock Icon 2: Data */}
            <div style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff" }}>
              📊
            </div>
            {/* Dock Icon 3: n8n (Target Icon) */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: T.n8nOrange,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "#fff",
                transform: `scale(${n8nIconScale})`,
                boxShadow: n8nIconHover ? "0 12px 28px rgba(234, 88, 12, 0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.1s ease",
              }}
            >
              ⚡
            </div>
          </div>

          {/* Black Mac Cursor */}
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 3L26 15L16 17L11 27L6 3Z" fill="#202124" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Circular Orange Ripple Explosion */}
          {frame >= 85 && (
            <div
              style={{
                position: "absolute",
                left: 1010,
                top: 930,
                width: rippleRadius * 2,
                height: rippleRadius * 2,
                borderRadius: "50%",
                backgroundColor: T.n8nOrange,
                transform: "translate(-50%, -50%)",
                zIndex: 40,
                pointerEvents: "none",
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 2: THE SPRAWLING CANVAS PAN (2.5s - 9s / Frames 150 - 540)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 140 && frame < 540 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 4000,
            height: 2400,
            transform: `translate(${canvasPanX}px, ${canvasPanY}px)`,
            backgroundColor: T.bgLight,
            zIndex: 10,
          }}
        >
          {/* Canvas Grid Lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* 📍 SECTION 1: WEB DESIGN MOCKUP (Top-Left @ X: 500, Y: 300) */}
          <div
            style={{
              position: "absolute",
              left: 500,
              top: 300,
              width: 900,
              height: 620,
              borderRadius: 24,
              backgroundColor: T.cardBg,
              border: "1px solid " + T.borderLight,
              boxShadow: T.shadowApple,
              padding: 36,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              transform: `scale(${interpolate(webUiSp, [0, 1], [0.9, 1.0])})`,
              opacity: interpolate(webUiSp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: T.n8nOrange, letterSpacing: 1.5 }}>
              1. HIGH-CONVERTING WEBSITES
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-1.5px" }}>
              Modern Agency Landing Page
            </h2>
            <div style={{ flex: 1, borderRadius: 16, backgroundColor: "#f1f5f9", padding: 24, display: "flex", gap: 20 }}>
              <div style={{ flex: 1, borderRadius: 12, backgroundColor: "#ffffff", padding: 20, border: "1px solid #e2e8f0" }}>
                <div style={{ width: 120, height: 16, borderRadius: 8, backgroundColor: "#cbd5e1", marginBottom: 12 }} />
                <div style={{ width: "80%", height: 12, borderRadius: 6, backgroundColor: "#e2e8f0" }} />
              </div>
              <div style={{ width: 220, borderRadius: 12, backgroundColor: T.n8nOrange, color: "#fff", padding: 20, fontWeight: 800 }}>
                Hero CTA Component
              </div>
            </div>
          </div>

          {/* 📍 SECTION 2: AUTOMATED DATA SPREADSHEET (Down-Right @ X: 1800, Y: 1100) */}
          <div
            style={{
              position: "absolute",
              left: 1800,
              top: 1100,
              width: 960,
              height: 640,
              borderRadius: 24,
              backgroundColor: T.cardBg,
              border: "1px solid " + T.borderLight,
              boxShadow: T.shadowApple,
              padding: 36,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              transform: `scale(${interpolate(dataUiSp, [0, 1], [0.9, 1.0])})`,
              opacity: interpolate(dataUiSp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: T.emeraldGreen, letterSpacing: 1.5 }}>
              2. AUTOMATED DATA ENTRY
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-1.5px" }}>
              Structured Lead Records
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Acme Corp", email: "contact@acme.com", status: "Validated" },
                { name: "Stripe LLC", email: "billing@stripe.com", status: "Synced" },
                { name: "Vercel Inc", email: "dev@vercel.com", status: "Processed" },
              ].map((row, i) => {
                const checkSp = checkmarkSp(i);
                return (
                  <div
                    key={i}
                    style={{
                      padding: "16px 24px",
                      borderRadius: 14,
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: T.textDark, fontSize: 18 }}>{row.name}</div>
                    <div style={{ color: T.textMuted, fontSize: 14 }}>{row.email}</div>
                    <div
                      style={{
                        padding: "6px 16px",
                        borderRadius: 999,
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        color: T.emeraldGreen,
                        fontWeight: 800,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transform: `scale(${interpolate(checkSp, [0, 1], [0.6, 1.0])})`,
                        opacity: interpolate(checkSp, [0, 1], [0, 1]),
                      }}
                    >
                      <span>✓</span>
                      <span>{row.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📍 SECTION 3: N8N WORKFLOW GRID (Right @ X: 3100, Y: 600) */}
          <div
            style={{
              position: "absolute",
              left: 3100,
              top: 600,
              width: 900,
              height: 620,
              borderRadius: 24,
              backgroundColor: T.cardBg,
              border: "1.5px solid " + T.borderOrange,
              boxShadow: T.shadowApple,
              padding: 36,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              transform: `scale(${interpolate(n8nUiSp, [0, 1], [0.9, 1.0])})`,
              opacity: interpolate(n8nUiSp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: T.n8nOrange, letterSpacing: 1.5 }}>
              3. N8N AUTOMATION ENGINE
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-1.5px" }}>
              Logic & Workflow Canvas
            </h2>
            <div style={{ flex: 1, borderRadius: 16, backgroundColor: "#fff7ed", border: "1px stroke " + T.borderOrange, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <div style={{ padding: 16, borderRadius: 14, backgroundColor: "#fff", border: "1px solid #fed7aa", fontWeight: 800 }}>Webhook</div>
              <div style={{ color: T.n8nOrange, fontSize: 24 }}>➔</div>
              <div style={{ padding: 16, borderRadius: 14, backgroundColor: "#fff", border: "1px solid #fed7aa", fontWeight: 800 }}>AI Parser</div>
              <div style={{ color: T.n8nOrange, fontSize: 24 }}>➔</div>
              <div style={{ padding: 16, borderRadius: 14, backgroundColor: "#fff", border: "1px solid #fed7aa", fontWeight: 800 }}>PostgreSQL</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 3: GRAPHIC WIPE & DEEP ZOOM (9s - 13s / Frames 540 - 780)
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* 45-Degree Angle Orange Graphic Line Wipe */}
      {frame >= 530 && frame < 610 && (
        <div
          style={{
            position: "absolute",
            top: -500,
            left: wipeX,
            width: 800,
            height: 2200,
            backgroundColor: T.n8nOrange,
            transform: "rotate(25deg)",
            zIndex: 60,
            boxShadow: "0 0 100px rgba(234, 88, 12, 0.6)",
          }}
        />
      )}

      {/* Deep Zoom Scene (Frames 590 - 780) */}
      {frame >= 590 && frame < 780 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${deepZoomScale}) translate(${deepZoomX}px, 0px)`,
            zIndex: 20,
          }}
        >
          {/* Floating Text Drop */}
          <div
            style={{
              position: "absolute",
              top: 180,
              textAlign: "center",
              transform: `translateY(${interpolate(textDropSp, [0, 1], [-60, 0])}px)`,
              opacity: interpolate(textDropSp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: T.n8nOrange, letterSpacing: 2, marginBottom: 8 }}>
              DIRECT INTEGRATION
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: T.textDark, margin: 0 }}>
              Zero Zapier Fees. 100% Owned.
            </h2>
          </div>

          {/* 3 Minimalist n8n Nodes & Connector Wire */}
          <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
            {/* Node 1: Web Form */}
            <div style={{ padding: "20px 32px", borderRadius: 20, backgroundColor: T.cardBg, border: "2px solid " + T.borderLight, boxShadow: T.shadowApple, textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>🌐</div>
              <div style={{ fontWeight: 800, color: T.textDark, marginTop: 8 }}>Web Form</div>
            </div>

            {/* Glowing Connector Wire */}
            <div style={{ position: "relative", width: 300, height: 6, backgroundColor: "#e2e8f0", borderRadius: 3 }}>
              {/* Pulse */}
              <div
                style={{
                  position: "absolute",
                  left: pulsePos,
                  top: -5,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: T.n8nOrange,
                  boxShadow: "0 0 20px #ea580c",
                }}
              />
            </div>

            {/* Node 2: AI Agent */}
            <div style={{ padding: "20px 32px", borderRadius: 20, backgroundColor: T.cardBg, border: "2px solid " + T.n8nOrange, boxShadow: T.shadowApple, textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>🤖</div>
              <div style={{ fontWeight: 800, color: T.textDark, marginTop: 8 }}>AI Agent</div>
            </div>
          </div>

          {/* Elastic Automated Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 220,
              padding: "14px 32px",
              borderRadius: 999,
              backgroundColor: T.emeraldGreen,
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 20,
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
              transform: `scale(${interpolate(automatedBadgeSp, [0, 1], [0.6, 1.0])})`,
              opacity: interpolate(automatedBadgeSp, [0, 1], [0, 1]),
            }}
          >
            ✓ 100% Automated System
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 4: OUTRO SNAP & RADIAL ORBIT (13s - 18s / Frames 780 - 1080)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame >= 770 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${outroPullbackScale})`,
            zIndex: 30,
          }}
        >
          {/* Central n8n Expert Logo Lock */}
          <div
            style={{
              position: "relative",
              width: 140,
              height: 140,
              borderRadius: 36,
              backgroundColor: T.n8nOrange,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              boxShadow: "0 25px 60px rgba(234, 88, 12, 0.4)",
              transform: `scale(${interpolate(outroCenterLogoSp, [0, 1], [0.6, 1.0])})`,
              opacity: interpolate(outroCenterLogoSp, [0, 1], [0, 1]),
            }}
          >
            ⚡
          </div>

          {/* 8 Radial Orbiting Integration Icons */}
          <div style={{ position: "absolute", width: 600, height: 600 }}>
            {INTEGRATION_ICONS.map((item, i) => {
              const angle = (i * 360) / 8 + frame * 0.2;
              const rad = (angle * Math.PI) / 180;
              const radius = 240;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              const s = outroOrbitSp;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 300 + x - 32,
                    top: 300 + y - 32,
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    backgroundColor: "#ffffff",
                    border: "1px solid " + T.borderLight,
                    boxShadow: T.shadowApple,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    transform: `scale(${interpolate(s, [0, 1], [0, 1.0])})`,
                    opacity: interpolate(s, [0, 1], [0, 1]),
                  }}
                >
                  {item.icon}
                </div>
              );
            })}
          </div>

          {/* Bottom Headline & Fiverr Lock */}
          <div
            style={{
              position: "absolute",
              bottom: 120,
              textAlign: "center",
              transform: `scale(${interpolate(outroTextSp, [0, 1], [0.8, 1.0])})`,
              opacity: interpolate(outroTextSp, [0, 1], [0, 1]),
            }}
          >
            <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-1.5px" }}>
              Hire an Automation Expert on <span style={{ color: T.fiverrGreen }}>Fiverr</span>
            </h2>

            {/* Fiverr Badge Drop */}
            {frame >= 930 && (
              <div
                style={{
                  marginTop: 20,
                  display: "inline-flex",
                  padding: "14px 36px",
                  borderRadius: 999,
                  backgroundColor: T.fiverrGreen,
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 900,
                  boxShadow: "0 12px 32px rgba(29, 191, 115, 0.4)",
                  transform: `scale(${interpolate(fiverrLogoSp, [0, 1], [0.8, 1.0])})`,
                  opacity: interpolate(fiverrLogoSp, [0, 1], [0, 1]),
                }}
              >
                <span>Hire Now on Fiverr</span>
                <span style={{ marginLeft: 8 }}>➔</span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
