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

// ═════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS & COLOR PALETTE
// Pristine Off-White, Obsidian Dark, Neon Accent Gradients
// ═════════════════════════════════════════════════════════════════════════════

const T = {
  bgLight: "#f8f9fa",
  bgGridDot: "rgba(0, 0, 0, 0.08)",
  textDark: "#202124",
  textMuted: "#5f6368",
  badgeBg: "#202124",
  badgeText: "#ffffff",
  magenta: "#ec4899",
  cyan: "#06b6d4",
  cardBg: "#ffffff",
  shadowCard: "0 20px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04)",
  shadowActive: "0 30px 70px rgba(236, 72, 153, 0.25), 0 10px 25px rgba(6, 182, 212, 0.2)",
};

// ═════════════════════════════════════════════════════════════════════════════
// PHASE 1: THE ARCHITECT REVEAL (Frames 0 - 180 / 0s - 3s)
// ═════════════════════════════════════════════════════════════════════════════

const ArchitectReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mac Cursor Drop & Click Trajectory (Frames 15 - 55)
  const cursorProgress = interpolate(frame, [15, 50], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [1500, 960]);
  const cursorY = interpolate(cursorProgress, [0, 1], [200, 540]);

  // Click Physics at Frame 50
  const isClicked = frame >= 50;
  const clickSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { stiffness: 350, damping: 25 },
  });
  const cursorScale = isClicked
    ? interpolate(clickSpring, [0, 0.5, 1], [1, 0.75, 1.0])
    : 1.0;

  // Click Ripple Effect
  const rippleRadius = isClicked
    ? interpolate(clickSpring, [0, 1], [0, 600])
    : 0;
  const rippleOpacity = isClicked
    ? interpolate(clickSpring, [0, 1], [0.6, 0])
    : 0;

  // Name Slam Entry at Frame 50
  const nameSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { stiffness: 350, damping: 25 },
  });
  const nameScale = isClicked ? interpolate(nameSpring, [0, 1], [0.6, 1.0]) : 0;
  const nameOpacity = isClicked ? interpolate(nameSpring, [0, 1], [0, 1]) : 0;

  // Pill Badge Entry at Frame 70
  const badgeSpring = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { stiffness: 350, damping: 25 },
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [40, 0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  // Phase 1 Text Wipe at Frame 150 (Exponential Scale 1.0 -> 25.0)
  const wipeProgress = interpolate(frame, [150, 180], [0, 1], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeScale = interpolate(wipeProgress, [0, 1], [1.0, 25.0]);
  const wipeOpacity = interpolate(wipeProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: wipeOpacity,
        transform: `scale(${wipeScale})`,
        transformOrigin: "50% 50%",
      }}
    >
      {/* Ripple Effect Container */}
      {isClicked && (
        <div
          style={{
            position: "absolute",
            width: rippleRadius * 2,
            height: rippleRadius * 2,
            borderRadius: "50%",
            border: "2px solid " + T.textDark,
            opacity: rippleOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Hero Name & Badge Lockup */}
      {isClicked && (
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: T.textDark,
              letterSpacing: "-3.5px",
              margin: 0,
              transform: `scale(${nameScale})`,
              opacity: nameOpacity,
            }}
          >
            Benyamin Namtalashvili
          </h1>

          {frame >= 70 && (
            <div
              style={{
                marginTop: 24,
                display: "inline-flex",
                padding: "12px 32px",
                borderRadius: 999,
                backgroundColor: T.badgeBg,
                color: T.badgeText,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1.5,
                transform: `translateY(${badgeY}px)`,
                opacity: badgeOpacity,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              }}
            >
              Graphic • Web • Automation
            </div>
          )}
        </div>
      )}

      {/* Mac-Style Cursor */}
      {frame < 150 && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            transform: `scale(${cursorScale}) translate(-50%, -50%)`,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
            <path d="M6 3L26 15L16 17L11 27L6 3Z" fill="#202124" stroke="#ffffff" strokeWidth="2.5" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PHASE 2 & 3: THE CORE PILLARS & MOTION CATALYST (Frames 180 - 540)
// ═════════════════════════════════════════════════════════════════════════════

const CorePillarsAndCatalyst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 2 Drifting Camera (Pan X: 0 -> -150px)
  const panX = interpolate(frame, [180, 540], [0, -150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Staggered Spring Entrances for Cards (Frames 180, 184, 188)
  const card1Sp = spring({ frame: Math.max(0, frame - 180), fps, config: { stiffness: 350, damping: 25 } });
  const card2Sp = spring({ frame: Math.max(0, frame - 184), fps, config: { stiffness: 350, damping: 25 } });
  const card3Sp = spring({ frame: Math.max(0, frame - 188), fps, config: { stiffness: 350, damping: 25 } });

  // Phase 2 Overlay Typography ("I engineer digital ecosystems.")
  const title2Sp = spring({ frame: Math.max(0, frame - 200), fps, config: { stiffness: 350, damping: 25 } });

  // Phase 3 Motion Catalyst Shift (Frame 360)
  // Kinetic Text Block drops in violently ("But static pixels aren't enough.")
  const text3Sp = spring({ frame: Math.max(0, frame - 360), fps, config: { stiffness: 400, damping: 22 } });

  // Phase 3 Bezier Line Path Drawing (Frames 380 - 460)
  const lineProgress = interpolate(frame, [380, 460], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3D Physical Tilt & Vivid Color Reaction when touched by glowing path (Frames 400+)
  const isCatalystActive = frame >= 400;
  const tiltSpring = spring({ frame: Math.max(0, frame - 400), fps, config: { stiffness: 180, damping: 18 } });
  const rotX = interpolate(tiltSpring, [0, 1], [0, 16]);
  const rotY = interpolate(tiltSpring, [0, 1], [0, -12]);
  const cardMorphVal = interpolate(tiltSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${panX}px)`,
        perspective: 1200,
      }}
    >
      {/* Background Dot Grid Canvas */}
      <div
        style={{
          position: "absolute",
          inset: -200,
          backgroundImage: `radial-gradient(${T.bgGridDot} 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Kinetic Typography Overlays */}
      <div style={{ position: "absolute", top: 100, left: 160, zIndex: 30 }}>
        {/* Phase 2 Title */}
        {frame < 360 && (
          <div
            style={{
              transform: `translateY(${interpolate(title2Sp, [0, 1], [40, 0])}px)`,
              opacity: interpolate(title2Sp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: T.cyan, letterSpacing: 2, marginBottom: 8 }}>
              DIGITAL ENGINEERING
            </div>
            <h2 style={{ fontSize: 56, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-2px" }}>
              I engineer digital ecosystems.
            </h2>
          </div>
        )}

        {/* Phase 3 Shift Title */}
        {frame >= 360 && (
          <div
            style={{
              transform: `translateY(${interpolate(text3Sp, [0, 1], [-80, 0])}px)`,
              opacity: interpolate(text3Sp, [0, 1], [0, 1]),
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: T.magenta, letterSpacing: 2, marginBottom: 8 }}>
              THE MOTION PARADIGM
            </div>
            <h2 style={{ fontSize: 60, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-2.5px" }}>
              But static pixels aren't enough.
            </h2>
          </div>
        )}
      </div>

      {/* Phase 3 Glowing Bezier Path Threading Through Cards */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 25,
        }}
      >
        <path
          d="M 300 700 C 500 500, 800 800, 1050 550 C 1300 300, 1500 650, 1750 450"
          stroke="url(#catalystGrad)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="1800"
          strokeDashoffset={1800 * (1 - lineProgress)}
          strokeLinecap="round"
          filter="drop-shadow(0 0 16px #ec4899)"
        />
        <defs>
          <linearGradient id="catalystGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={T.magenta} />
            <stop offset="100%" stopColor={T.cyan} />
          </linearGradient>
        </defs>
      </svg>

      {/* 3 High-Fidelity Cards in Diagonal Cascade (Bottom-Left to Top-Right) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
        {/* CARD 1: Web Layout Wireframe -> Vivid Web Platform */}
        <div
          style={{
            position: "absolute",
            left: 280,
            bottom: 160,
            width: 480,
            height: 320,
            borderRadius: 24,
            backgroundColor: T.cardBg,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: isCatalystActive ? T.shadowActive : T.shadowCard,
            padding: 28,
            transform: `translateY(${interpolate(card1Sp, [0, 1], [100, 0])}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            opacity: interpolate(card1Sp, [0, 1], [0, 1]),
            transformStyle: "preserve-3d",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: isCatalystActive ? T.cyan : T.textMuted, letterSpacing: 1.5 }}>
            PILLAR 01 • WEB ARCHITECTURE
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: T.textDark, marginTop: 6 }}>SaaS Web Platform</div>
          <div
            style={{
              marginTop: 20,
              height: 160,
              borderRadius: 16,
              backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#f1f5f9", "#0f172a"]),
              border: "1px solid rgba(0,0,0,0.05)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ width: 140, height: 14, borderRadius: 7, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#cbd5e1", "#38bdf8"]) }} />
            <div style={{ width: "80%", height: 10, borderRadius: 5, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#e2e8f0", "#334155"]) }} />
            <div
              style={{
                marginTop: "auto",
                padding: "8px 16px",
                borderRadius: 8,
                backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#e2e8f0", "#06b6d4"]),
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 800,
                alignSelf: "flex-start",
              }}
            >
              Interactive Component
            </div>
          </div>
        </div>

        {/* CARD 2: Graphic Design Vector Palette -> Vivid Palette */}
        <div
          style={{
            position: "absolute",
            left: 820,
            bottom: 300,
            width: 480,
            height: 320,
            borderRadius: 24,
            backgroundColor: T.cardBg,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: isCatalystActive ? T.shadowActive : T.shadowCard,
            padding: 28,
            transform: `translateY(${interpolate(card2Sp, [0, 1], [100, 0])}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            opacity: interpolate(card2Sp, [0, 1], [0, 1]),
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: isCatalystActive ? T.magenta : T.textMuted, letterSpacing: 1.5 }}>
            PILLAR 02 • GRAPHIC SYSTEM
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: T.textDark, marginTop: 6 }}>Vector Design Tokens</div>
          <div style={{ marginTop: 20, display: "flex", gap: 14 }}>
            {[T.magenta, T.cyan, "#8b5cf6", "#f59e0b"].map((col, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 140,
                  borderRadius: 14,
                  backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#e2e8f0", col]),
                  boxShadow: isCatalystActive ? `0 10px 20px ${col}40` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* CARD 3: n8n Automation Grid -> Vivid Node Matrix */}
        <div
          style={{
            position: "absolute",
            left: 1360,
            bottom: 440,
            width: 480,
            height: 320,
            borderRadius: 24,
            backgroundColor: T.cardBg,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: isCatalystActive ? T.shadowActive : T.shadowCard,
            padding: 28,
            transform: `translateY(${interpolate(card3Sp, [0, 1], [100, 0])}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            opacity: interpolate(card3Sp, [0, 1], [0, 1]),
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: isCatalystActive ? "#10b981" : T.textMuted, letterSpacing: 1.5 }}>
            PILLAR 03 • AUTOMATION ENGINE
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: T.textDark, marginTop: 6 }}>n8n Workflow Nodes</div>
          <div
            style={{
              marginTop: 20,
              height: 160,
              borderRadius: 16,
              backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#f8fafc", "#022c22"]),
              border: "1px solid rgba(0,0,0,0.05)",
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {["Webhook", "AI Agent", "Sync DB"].map((nodeText, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#ffffff", "#064e3b"]),
                  color: interpolateColors(cardMorphVal, [0, 1], ["#64748b", "#34d399"]),
                  fontWeight: 800,
                  fontSize: 12,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                {nodeText}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PHASE 4: THE NEW FRONTIER & OUTRO (Frames 540 - 720 / 9s - 12s)
// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION ROOT: DIGITAL ARCHITECT INTRO (9s @ 60 FPS = 540 frames)
// ═════════════════════════════════════════════════════════════════════════════

export const DigitalArchitectIntro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: T.bgLight, overflow: "hidden" }}>
      {/* PHASE 1: 0 to 3 seconds (Frames 0 - 180) */}
      {frame < 180 && <ArchitectReveal />}

      {/* PHASE 2 & 3: 3 to 9 seconds (Frames 180 - 540) */}
      {frame >= 170 && frame <= 540 && <CorePillarsAndCatalyst />}
    </AbsoluteFill>
  );
};
