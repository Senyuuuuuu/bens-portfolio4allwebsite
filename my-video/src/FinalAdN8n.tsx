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
// DESIGN TOKENS & PALETTE (NO SOUND SFX)
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
  n8nOrange: "#ea580c",
  emerald: "#10b981",
  fiverrGreen: "#1dbf73",
  cardBg: "#ffffff",
  shadowCard: "0 20px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04)",
  shadowActive: "0 30px 70px rgba(236, 72, 153, 0.25), 0 10px 25px rgba(6, 182, 212, 0.2)",
};

const APPS = [
  { name: "Gmail", color: "#ea4335", icon: "M" },
  { name: "Slack", color: "#4a154b", icon: "#" },
  { name: "Drive", color: "#4285f4", icon: "▲" },
  { name: "Sheets", color: "#0f9d58", icon: "⊞" },
  { name: "Discord", color: "#5865f2", icon: "🎮" },
  { name: "Notion", color: "#000000", icon: "N" },
  { name: "Webhook", color: "#0284c7", icon: "⚡" },
  { name: "Postgres", color: "#336791", icon: "🐘" },
  { name: "Airtable", color: "#f59e0b", icon: "⎈" },
  { name: "OpenAI", color: "#10a37f", icon: "⚛" },
];

export const FinalAdN8n: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 1: DIGITAL ARCHITECT INTRO (Frames 0 - 540 / 0s - 9s)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- PHASE 1: Architect Reveal (Frames 0 - 180) ---
  const cursorProgress = interpolate(frame, [15, 50], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [1500, 960]);
  const cursorY = interpolate(cursorProgress, [0, 1], [200, 540]);

  const isClicked = frame >= 50;
  const clickSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { stiffness: 350, damping: 25 },
  });
  const cursorScale = isClicked ? interpolate(clickSpring, [0, 0.5, 1], [1, 0.75, 1.0]) : 1.0;
  const rippleRadius = isClicked ? interpolate(clickSpring, [0, 1], [0, 600]) : 0;
  const rippleOpacity = isClicked ? interpolate(clickSpring, [0, 1], [0.6, 0]) : 0;

  const nameSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { stiffness: 350, damping: 25 },
  });
  const nameScale = isClicked ? interpolate(nameSpring, [0, 1], [0.6, 1.0]) : 0;
  const nameOpacity = isClicked ? interpolate(nameSpring, [0, 1], [0, 1]) : 0;

  const badgeSpring = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { stiffness: 350, damping: 25 },
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [40, 0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  const wipeProgress = interpolate(frame, [150, 180], [0, 1], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeScale = interpolate(wipeProgress, [0, 1], [1.0, 25.0]);
  const wipeOpacity = interpolate(wipeProgress, [0, 0.8, 1], [1, 1, 0]);

  // --- PHASE 2 & 3: Core Pillars & Motion Catalyst (Frames 180 - 540) ---
  const panX = interpolate(frame, [180, 540], [0, -150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card1Sp = spring({ frame: Math.max(0, frame - 180), fps, config: { stiffness: 350, damping: 25 } });
  const card2Sp = spring({ frame: Math.max(0, frame - 184), fps, config: { stiffness: 350, damping: 25 } });
  const card3Sp = spring({ frame: Math.max(0, frame - 188), fps, config: { stiffness: 350, damping: 25 } });

  const title2Sp = spring({ frame: Math.max(0, frame - 200), fps, config: { stiffness: 350, damping: 25 } });
  const text3Sp  = spring({ frame: Math.max(0, frame - 360), fps, config: { stiffness: 400, damping: 22 } });

  const lineProgress = interpolate(frame, [380, 460], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isCatalystActive = frame >= 400;
  const tiltSpring = spring({ frame: Math.max(0, frame - 400), fps, config: { stiffness: 180, damping: 18 } });
  const rotX = interpolate(tiltSpring, [0, 1], [0, 16]);
  const rotY = interpolate(tiltSpring, [0, 1], [0, -12]);
  const cardMorphVal = interpolate(tiltSpring, [0, 1], [0, 1]);

  // Deep Z-Axis Camera Zoom Transition (Frames 500 - 540) into CleanKineticN8n
  const deepZoomScale = interpolate(frame, [500, 540], [1.0, 7.0], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deepZoomOp = interpolate(frame, [520, 540], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 2: FULL CLEAN KINETIC N8N AD (Frames 540 - 2040 / 9s - 34s)
  // ═══════════════════════════════════════════════════════════════════════════
  const kFrame = frame - 540; // Local frame starting at 0 for CleanKineticN8n

  // Global Background Shift
  const bgShift = interpolate(kFrame, [0, 750, 1500], [0, 0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgRed = Math.round(interpolate(bgShift, [0, 1], [248, 255]));
  const bgGreen = Math.round(interpolate(bgShift, [0, 1], [249, 255]));
  const bgBlue = Math.round(interpolate(bgShift, [0, 1], [250, 255]));
  const bgColor = `rgb(${bgRed}, ${bgGreen}, ${bgBlue})`;

  // --- PHASE 1: Kinetic Hook (Frames 540 - 725 / kFrame 0 - 185) ---
  let kineticText = "Automate leads.";
  let textIndex = 0;
  if (kFrame >= 120) {
    kineticText = "Effortless automation";
    textIndex = 3;
  } else if (kFrame >= 80) {
    kineticText = "Automate workflows.";
    textIndex = 2;
  } else if (kFrame >= 40) {
    kineticText = "Automate emails.";
    textIndex = 1;
  }

  const textLocalFrame = kFrame % 40;
  const textSpring = spring({
    frame: textIndex === 3 ? Math.max(0, kFrame - 120) : textLocalFrame,
    fps,
    config: { stiffness: 280, damping: 22 },
  });

  const textY = interpolate(textSpring, [0, 1], [110, 0]);
  const textScale = interpolate(textSpring, [0, 1], [0.92, 1.0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  const float1Y = Math.sin(kFrame * 0.045) * 18;
  const float1X = Math.cos(kFrame * 0.035) * 12;
  const float1Rot = Math.sin(kFrame * 0.03) * 4;

  const float2Y = Math.sin(kFrame * 0.05 + 1.5) * 20;
  const float2X = Math.cos(kFrame * 0.04 + 1.5) * 14;
  const float2Rot = Math.cos(kFrame * 0.035) * -5;

  const floatCardOpacity = interpolate(kFrame, [0, 20, 155, 175], [0, 0.65, 0.65, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene1Push = interpolate(kFrame, [155, 185], [1.0, 12.0], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene1Op = interpolate(kFrame, [165, 185], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- PHASE 2: Command Box (Frames 720 - 900 / kFrame 180 - 360) ---
  const isPhase2 = kFrame >= 175 && kFrame < 365;
  const cmdBoxSpring = spring({
    frame: Math.max(0, kFrame - 180),
    fps,
    config: { stiffness: 150, damping: 14 },
  });

  const boxRestY = Math.sin(kFrame * 0.04) * 6;
  const boxRestRotX = Math.cos(kFrame * 0.035) * 1.5;
  const cmdBoxOpacity = interpolate(kFrame, [175, 190, 345, 365], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cmdBoxScale = interpolate(cmdBoxSpring, [0, 1], [0.82, 1.0]);

  const fullTypeString = "When a new Stripe payment succeeds...";
  const typingProgress = interpolate(kFrame, [192, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typedCharCount = Math.floor(typingProgress * fullTypeString.length);
  const currentTypedText = fullTypeString.slice(0, typedCharCount);

  const cmdCursorProgress = interpolate(kFrame, [245, 292], [0, 1], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cmdCursorX = interpolate(cmdCursorProgress, [0, 1], [400, 248]);
  const cmdCursorY = interpolate(cmdCursorProgress, [0, 1], [230, 0]);

  const clickBounce = spring({
    frame: Math.max(0, kFrame - 298),
    fps,
    config: { stiffness: 350, damping: 12 },
  });
  const cmdCursorScale = interpolate(clickBounce, [0, 0.5, 1], [1, 0.76, 1]);
  const btnScale = interpolate(clickBounce, [0, 0.5, 1], [1, 0.91, 1]);
  const cmdCursorOpacity = interpolate(kFrame, [240, 250, 340, 355], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isFlashingVerbs = kFrame >= 302 && kFrame < 360;
  let flashVerb = "Extract";
  let verbIndex = 0;
  if (kFrame >= 344) {
    flashVerb = "Sync";
    verbIndex = 3;
  } else if (kFrame >= 330) {
    flashVerb = "Route";
    verbIndex = 2;
  } else if (kFrame >= 316) {
    flashVerb = "Analyze";
    verbIndex = 1;
  }

  const verbSpring = spring({
    frame: Math.max(0, kFrame - (302 + verbIndex * 14)),
    fps,
    config: { stiffness: 300, damping: 16 },
  });
  const verbScale = interpolate(verbSpring, [0, 1], [0.82, 1.0]);
  const verbY = interpolate(verbSpring, [0, 1], [20, 0]);

  // --- PHASE 3: Automated Pipeline Grid (Frames 900 - 1260 / kFrame 360 - 720) ---
  const isPhase3 = kFrame >= 355 && kFrame < 725;
  const browserSpring = spring({
    frame: Math.max(0, kFrame - 360),
    fps,
    config: { stiffness: 160, damping: 16 },
  });
  const browserY = interpolate(browserSpring, [0, 1], [80, 0]);
  const browserOpacity = interpolate(kFrame, [355, 375, 700, 725], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leadCounterProgress = interpolate(kFrame, [400, 680], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leadCount = Math.floor(interpolate(leadCounterProgress, [0, 1], [1420, 8940]));

  const line1Progress = interpolate(kFrame, [410, 470], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Progress = interpolate(kFrame, [470, 530], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- PHASE 4: Directly Integrated & Verified Review (Frames 1260 - 1620 / kFrame 720 - 1080) ---
  const isPhase4 = kFrame >= 710 && kFrame < 1085;
  const phase4HeaderSpring = spring({
    frame: Math.max(0, kFrame - 720),
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const phase4HeaderY = interpolate(phase4HeaderSpring, [0, 1], [40, 0]);

  const phase4SubtextSpring = spring({
    frame: Math.max(0, kFrame - 735),
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const phase4SubtextY = interpolate(phase4SubtextSpring, [0, 1], [30, 0]);

  const reviewSpring = spring({
    frame: Math.max(0, kFrame - 750),
    fps,
    config: { stiffness: 150, damping: 16 },
  });
  const reviewX = interpolate(reviewSpring, [0, 1], [60, 0]);
  const reviewOpacity = interpolate(kFrame, [750, 770, 1060, 1085], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reviewLifeY = Math.sin(kFrame * 0.04) * 5;
  const reviewLifeRot = Math.cos(kFrame * 0.035) * 1.2;

  // --- PHASE 5: 3D Radial App Outro & Fiverr CTA (Frames 1620 - 2040 / kFrame 1080 - 1500) ---
  const isPhase5 = kFrame >= 1075;
  const outroLogoSpring = spring({
    frame: Math.max(0, kFrame - 1080),
    fps,
    config: { stiffness: 180, damping: 16 },
  });
  const logoCenterScale = interpolate(outroLogoSpring, [0, 1], [0.3, 1.0]);
  const logoCenterOpacity = interpolate(outroLogoSpring, [0, 1], [0, 1]);
  const logoCenterLifeY = Math.sin(kFrame * 0.05) * 6;

  const baseOrbitAngle = (kFrame - 1100) * 0.28;

  const ctaSpring = spring({
    frame: Math.max(0, kFrame - 1145),
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [60, 0]);

  const fiverrLogoSpring = spring({
    frame: Math.max(0, kFrame - 1165),
    fps,
    config: { stiffness: 240, damping: 18 },
  });
  const fiverrLogoY = interpolate(fiverrLogoSpring, [0, 1], [50, 0]);
  const fiverrLogoScale = interpolate(fiverrLogoSpring, [0, 1], [0.7, 1.0]);
  const fiverrLogoOpacity = interpolate(fiverrLogoSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: T.bgLight, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflow: "hidden" }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          PART 1: DIGITAL ARCHITECT INTRO (0s - 9s / Frames 0 - 540)
          ═══════════════════════════════════════════════════════════════════════ */}
      {frame < 180 && (
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
      )}

      {/* PHASE 2 & 3: CORE PILLARS & MOTION CATALYST (Frames 180 - 540) */}
      {frame >= 170 && frame < 540 && (
        <AbsoluteFill
          style={{
            transform: `translateX(${panX}px) scale(${deepZoomScale})`,
            opacity: deepZoomOp,
            perspective: 1200,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -200,
              backgroundImage: `radial-gradient(${T.bgGridDot} 1.5px, transparent 1.5px)`,
              backgroundSize: "36px 36px",
            }}
          />

          <div style={{ position: "absolute", top: 100, left: 160, zIndex: 30 }}>
            {frame < 360 && (
              <div style={{ transform: `translateY(${interpolate(title2Sp, [0, 1], [40, 0])}px)`, opacity: interpolate(title2Sp, [0, 1], [0, 1]) }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.cyan, letterSpacing: 2, marginBottom: 8 }}>DIGITAL ENGINEERING</div>
                <h2 style={{ fontSize: 56, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-2px" }}>I engineer digital ecosystems.</h2>
              </div>
            )}

            {frame >= 360 && (
              <div style={{ transform: `translateY(${interpolate(text3Sp, [0, 1], [-80, 0])}px)`, opacity: interpolate(text3Sp, [0, 1], [0, 1]) }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.magenta, letterSpacing: 2, marginBottom: 8 }}>THE MOTION PARADIGM</div>
                <h2 style={{ fontSize: 60, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-2.5px" }}>But static pixels aren't enough.</h2>
              </div>
            )}
          </div>

          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 25 }}>
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

          <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
            {/* Card 1 */}
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
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: isCatalystActive ? T.cyan : T.textMuted, letterSpacing: 1.5 }}>PILLAR 01 • WEB ARCHITECTURE</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.textDark, marginTop: 6 }}>SaaS Web Platform</div>
              <div style={{ marginTop: 20, height: 160, borderRadius: 16, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#f1f5f9", "#0f172a"]), padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ width: 140, height: 14, borderRadius: 7, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#cbd5e1", "#38bdf8"]) }} />
                <div style={{ width: "80%", height: 10, borderRadius: 5, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#e2e8f0", "#334155"]) }} />
              </div>
            </div>

            {/* Card 2 */}
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
              <div style={{ fontSize: 12, fontWeight: 800, color: isCatalystActive ? T.magenta : T.textMuted, letterSpacing: 1.5 }}>PILLAR 02 • GRAPHIC SYSTEM</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.textDark, marginTop: 6 }}>Vector Design Tokens</div>
              <div style={{ marginTop: 20, display: "flex", gap: 14 }}>
                {[T.magenta, T.cyan, "#8b5cf6", "#f59e0b"].map((col, i) => (
                  <div key={i} style={{ flex: 1, height: 140, borderRadius: 14, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#e2e8f0", col]) }} />
                ))}
              </div>
            </div>

            {/* Card 3 */}
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
              <div style={{ fontSize: 12, fontWeight: 800, color: isCatalystActive ? "#10b981" : T.textMuted, letterSpacing: 1.5 }}>PILLAR 03 • AUTOMATION ENGINE</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.textDark, marginTop: 6 }}>n8n Workflow Nodes</div>
              <div style={{ marginTop: 20, height: 160, borderRadius: 16, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#f8fafc", "#022c22"]), padding: 20, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                {["Webhook", "AI Agent", "Sync DB"].map((nodeText, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: interpolateColors(cardMorphVal, [0, 1], ["#ffffff", "#064e3b"]), color: interpolateColors(cardMorphVal, [0, 1], ["#64748b", "#34d399"]), fontWeight: 800, fontSize: 12 }}>
                    {nodeText}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PART 2: FULL CLEAN KINETIC N8N AD (9s - 34s / Frames 540 - 2040)
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* PHASE 1: KINETIC HOOK (Frames 540 - 725) */}
      {kFrame >= 0 && kFrame < 185 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: scene1Op, transform: `scale(${scene1Push})`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", top: 180 + float1Y, left: 220 + float1X, transform: `rotateZ(${float1Rot}deg) translateZ(40px)`, width: 240, height: 160, backgroundColor: "#ffffff", borderRadius: 18, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), 0 20px 60px rgba(0, 0, 0, 0.08)", filter: "blur(4px)", opacity: floatCardOpacity, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af" }}>LEAD CONVERSION</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 80, marginTop: 12 }}>
              <div style={{ width: 28, height: "40%", backgroundColor: "#e5e7eb", borderRadius: 4 }} />
              <div style={{ width: 28, height: "70%", backgroundColor: T.n8nOrange, borderRadius: 4 }} />
              <div style={{ width: 28, height: "95%", backgroundColor: T.n8nOrange, borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ position: "absolute", top: 220 + float2Y, right: 240 + float2X, transform: `rotateZ(${float2Rot}deg) translateZ(60px)`, width: 260, height: 180, backgroundColor: "#ffffff", borderRadius: 18, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), 0 20px 60px rgba(0, 0, 0, 0.08)", filter: "blur(4px)", opacity: floatCardOpacity, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af" }}>AUTOMATION TASKS</div>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: i === 2 ? "#e5e7eb" : "#22c55e", color: "#fff", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i !== 2 ? "✓" : ""}
                </div>
                <div style={{ height: 10, width: i === 1 ? 140 : 100, backgroundColor: "#f3f4f6", borderRadius: 5 }} />
              </div>
            ))}
          </div>

          <div style={{ overflow: "hidden", padding: "10px 40px" }}>
            <h1 style={{ fontSize: 88, fontWeight: 900, color: T.textDark, letterSpacing: "-2.5px", margin: 0, lineHeight: 1.1, transform: `translateY(${textY}px) scale(${textScale})`, opacity: textOpacity }}>
              {kineticText}
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 2: COMMAND BOX (Frames 720 - 900) */}
      {isPhase2 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
          <div style={{ width: 820, height: 130, borderRadius: 20, backgroundColor: "#ffffff", boxShadow: "0 6px 16px rgba(0, 0, 0, 0.04), 0 24px 64px rgba(0, 0, 0, 0.08)", border: "1px solid rgba(0, 0, 0, 0.06)", opacity: cmdBoxOpacity, transform: `translateY(${boxRestY}px) rotateX(${boxRestRotX}deg) scale(${cmdBoxScale})`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: T.n8nOrange }} />
              <div style={{ fontSize: 26, fontWeight: 600, color: T.textDark, display: "flex", alignItems: "center" }}>
                <span>{currentTypedText}</span>
                {kFrame < 285 && (
                  <span style={{ display: "inline-block", width: 2, height: 28, backgroundColor: T.n8nOrange, marginLeft: 4, opacity: Math.floor(kFrame / 15) % 2 === 0 ? 1 : 0 }} />
                )}
              </div>
            </div>

            <div style={{ position: "relative" }}>
              {!isFlashingVerbs ? (
                <div style={{ padding: "14px 28px", borderRadius: 12, backgroundColor: T.n8nOrange, color: "#ffffff", fontWeight: 800, fontSize: 16, boxShadow: "0 8px 24px rgba(234, 88, 12, 0.35)", transform: `scale(${btnScale})` }}>
                  + Create Workflow
                </div>
              ) : (
                <div style={{ padding: "14px 28px", borderRadius: 12, backgroundColor: T.emerald, color: "#ffffff", fontWeight: 900, fontSize: 18, boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)", transform: `scale(${verbScale}) translateY(${verbY}px)` }}>
                  ✓ {flashVerb}...
                </div>
              )}
            </div>

            {kFrame >= 240 && kFrame < 340 && (
              <div style={{ position: "absolute", left: cmdCursorX, top: cmdCursorY, transform: `scale(${cmdCursorScale})`, opacity: cmdCursorOpacity, pointerEvents: "none", zIndex: 50 }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 3L26 15L16 17L11 27L6 3Z" fill="#202124" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 3: AUTOMATED PIPELINE GRID (Frames 900 - 1260) */}
      {isPhase3 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", perspective: 1200 }}>
          <div style={{ width: 1100, height: 620, backgroundColor: "#ffffff", borderRadius: 24, boxShadow: "0 12px 32px rgba(0, 0, 0, 0.04), 0 32px 80px rgba(0, 0, 0, 0.08)", border: "1px solid #f1f3f4", padding: 36, display: "flex", flexDirection: "column", transform: `translateY(${browserY}px)`, opacity: browserOpacity }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f3f4", paddingBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f56" }} />
                <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ffbd2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#27c93f" }} />
              </div>
              <div style={{ backgroundColor: "#f8f9fa", borderRadius: 8, padding: "6px 16px", fontSize: 13, color: "#5f6368", fontWeight: 600 }}>n8n-automation-engine.internal</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.n8nOrange }}>● LIVE</div>
            </div>

            <div style={{ flex: 1, position: "relative", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <path d="M 220 230 C 340 230, 380 230, 500 230" stroke="#ea580c" strokeWidth="4" fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - line1Progress)} strokeLinecap="round" />
                <path d="M 580 230 C 700 230, 740 230, 860 230" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - line2Progress)} strokeLinecap="round" />
              </svg>

              <div style={{ width: 160, height: 150, borderRadius: 20, backgroundColor: "#ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>⚡</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Webhook</div>
              </div>

              <div style={{ width: 180, height: 170, borderRadius: 22, backgroundColor: "#ffffff", boxShadow: "0 12px 32px rgba(234, 88, 12, 0.15)", border: "2px solid #ea580c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 10 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: T.n8nOrange, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900 }}>n8n</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>AI Extract</div>
              </div>

              <div style={{ width: 160, height: 150, borderRadius: 20, backgroundColor: "#ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#336791", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>🐘</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>PostgreSQL</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f1f3f4", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#6b7280" }}>Automated Pipeline Metric</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.n8nOrange }}>{leadCount.toLocaleString()} Leads Processed / Day</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 4: DIRECTLY INTEGRATED & REVIEWS (Frames 1260 - 1620) */}
      {isPhase4 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 80, maxWidth: 1200 }}>
            <div>
              <div style={{ overflow: "hidden", padding: "6px 0" }}>
                <h2 style={{ fontSize: 68, fontWeight: 900, color: "#202124", letterSpacing: "-2px", margin: 0, transform: `translateY(${phase4HeaderY}px)`, lineHeight: 1.1 }}>
                  Directly integrated.
                </h2>
              </div>
              <div style={{ overflow: "hidden", padding: "6px 0", marginTop: 12 }}>
                <p style={{ fontSize: 34, fontWeight: 600, color: "#5f6368", margin: 0, transform: `translateY(${phase4SubtextY}px)` }}>
                  Zero Zapier fees. Infinite scale.
                </p>
              </div>
            </div>

            <div style={{ width: 480, backgroundColor: "#ffffff", borderRadius: 24, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04), 0 24px 64px rgba(0, 0, 0, 0.08)", border: "1px solid #f1f3f4", padding: 32, transform: `translateX(${reviewX}px) translateY(${reviewLifeY}px) rotateZ(${reviewLifeRot}deg)`, opacity: reviewOpacity, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: T.fiverrGreen, color: "#ffffff", fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>JD</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>Verified Client</div>
                  <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>SaaS Founder</div>
                </div>
              </div>
              <div style={{ color: "#fbbf24", fontSize: 22, letterSpacing: 3 }}>★★★★★</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#1f2937", lineHeight: 1.4 }}>
                "Exceptional workflow setup! Fast, reliable, and saved us thousands in automation costs."
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 5: 3D RADIAL APP OUTRO & FIVERR CTA (Frames 1620 - 2040) */}
      {isPhase5 && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 600, height: 480, display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ width: 140, height: 140, borderRadius: 36, backgroundColor: T.n8nOrange, boxShadow: "0 10px 25px rgba(234, 88, 12, 0.25), 0 30px 90px rgba(234, 88, 12, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: 48, fontWeight: 900, transform: `scale(${logoCenterScale}) translateY(${logoCenterLifeY}px)`, opacity: logoCenterOpacity, zIndex: 20 }}>
              n8n
            </div>

            {APPS.map((app, index) => {
              const iconPopSpring = spring({ frame: Math.max(0, kFrame - (1106 + index * 2.5)), fps, config: { stiffness: 220, damping: 16 } });
              const currentRadius = interpolate(iconPopSpring, [0, 1], [0, 240]);
              const popOpacity = interpolate(iconPopSpring, [0, 1], [0, 1]);
              const angleDeg = index * (360 / APPS.length) + baseOrbitAngle;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.cos(angleRad) * currentRadius;
              const y = Math.sin(angleRad) * currentRadius;
              const iconLifeY = Math.sin((kFrame + index * 40) * 0.06) * 4;

              return (
                <div key={app.name} style={{ position: "absolute", transform: `translate(${x}px, ${y + iconLifeY}px) rotate(${-baseOrbitAngle}deg)`, opacity: popOpacity, zIndex: 10 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04), 0 16px 36px rgba(0, 0, 0, 0.08)", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: app.color }}>
                    {app.icon}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 40, overflow: "hidden", padding: "6px 0" }}>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#202124", letterSpacing: "-1.5px", margin: 0, transform: `translateY(${ctaY}px)` }}>
              Hire Benyamin today.
            </h2>
          </div>

          <div style={{ marginTop: 20, transform: `translateY(${fiverrLogoY}px) scale(${fiverrLogoScale})`, opacity: fiverrLogoOpacity }}>
            <div style={{ backgroundColor: T.fiverrGreen, color: "#ffffff", fontWeight: 900, fontSize: 22, padding: "12px 32px", borderRadius: 30, letterSpacing: "-0.5px", boxShadow: "0 6px 18px rgba(29, 191, 115, 0.25), 0 16px 40px rgba(29, 191, 115, 0.35)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>fiverr.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
