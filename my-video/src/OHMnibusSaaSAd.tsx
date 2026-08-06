import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Brand Color Tokens
const PURPLE_DEEP = "#581C87";
const PURPLE_PRIMARY = "#7E22CE";
const PURPLE_GLOW = "#A855F7";
const TEAL_PRIMARY = "#0D9488";
const TEAL_LIGHT = "#14B8A6";
const CYAN_ACCENT = "#06B6D4";
const DARK_BG = "#030712";
const LIGHT_BG_GRADIENT = "radial-gradient(ellipse at 50% 0%, #FFFFFF 0%, #F1F5F9 50%, #E2E8F0 100%)";

// Captions Breakdown with Precise Frame Timings (@ 60 FPS)
const CAPTIONS = [
  // Scene 1: 0 - 360 (0 - 6s)
  { text: "In a world that moves relentlessly fast...", start: 20, end: 160 },
  { text: "how often do we stop to check in on our mind, body, and spirit?", start: 170, end: 340 },
  // Scene 2: 360 - 720 (6 - 12s)
  { text: "True well-being isn't just about getting through the day!", start: 380, end: 530 },
  { text: "It's about discovering deep mind-body synergy... and the power to reset!", start: 540, end: 700 },
  // Scene 3: 720 - 1140 (12 - 19s)
  { text: "At OHMnibus, our vision is One Healthy Mind for All!", start: 740, end: 920 },
  { text: "Lifting each other up... because true growth happens TOGETHER!", start: 930, end: 1110 },
  // Scene 4: 1140 - 1500 (19 - 25s)
  { text: "Join us for breakthroughs in mental wellness, health & empowerment!", start: 1160, end: 1340 },
  { text: "Connect with growth-minded people and discover new opportunities!", start: 1350, end: 1480 },
  // Scene 5: 1500 - 1920 (25 - 32s)
  { text: "FREE ADMISSION! RESET: A Holistic Wellness Forum", start: 1520, end: 1680 },
  { text: "2:00 PM • Emerald Grains Hotel, Baguio City", start: 1690, end: 1820 },
  { text: "Reserve your spot today!", start: 1830, end: 1910 },
];

export const OHMnibusSaaSAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------------------------
  // SEAMLESS MORPHING PHYSICS ENGINE (stiffness: 120, damping: 14)
  // ---------------------------------------------------------------------------
  const springMorph = spring({ frame, fps, config: { stiffness: 120, damping: 14 } });
  const springFast = spring({ frame, fps, config: { stiffness: 150, damping: 12 } });

  // Key Scene Morphing Triggers
  const morphS1toS2 = spring({ frame: frame - 340, fps, config: { stiffness: 120, damping: 14 } });
  const morphS2toS3 = spring({ frame: frame - 700, fps, config: { stiffness: 120, damping: 14 } });
  const morphS3toS4 = spring({ frame: frame - 1110, fps, config: { stiffness: 110, damping: 15 } });
  const morphS4toS5 = spring({ frame: frame - 1480, fps, config: { stiffness: 120, damping: 14 } });

  // Camera Push-In Depth-of-Field Blur (Scene 1 Transition)
  const cameraZ = interpolate(frame, [250, 360], [0, 800], { extrapolateRight: "clamp" });
  const dofBlur = interpolate(frame, [280, 360], [0, 24], { extrapolateRight: "clamp" });

  // Morphing Container Dimensions across Scenes
  const panelW = interpolate(
    frame,
    [0, 240, 360, 520, 720, 880, 1140, 1280, 1500, 1680],
    [700, 760, 380, 420, 820, 860, 920, 960, 980, 980],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const panelH = interpolate(
    frame,
    [0, 240, 360, 520, 720, 880, 1140, 1280, 1500, 1680],
    [820, 880, 380, 420, 520, 560, 1120, 1220, 1420, 1480],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const panelRadius = interpolate(
    frame,
    [0, 340, 400, 700, 760, 1140, 1200],
    [36, 36, 190, 190, 48, 48, 40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background Color Morphing
  const bgStyle = morphS3toS4 > 0.5 ? DARK_BG : LIGHT_BG_GRADIENT;

  return (
    <AbsoluteFill
      style={{
        background: bgStyle,
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        color: morphS3toS4 > 0.5 ? "#FFFFFF" : "#0F172A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
      }}
    >
      {/* --------------------------------------------------------------------- */}
      {/* REALISTIC BOKEH DEPTH-OF-FIELD BLOBS (Shallow Depth 3D Environment)  */}
      {/* --------------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${PURPLE_GLOW}40 0%, rgba(255,255,255,0) 70%)`,
          filter: "blur(70px)",
          transform: `translate3d(${Math.sin(frame * 0.03) * 120}px, ${Math.cos(frame * 0.02) * 80 - 200}px, -300px)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN_ACCENT}35 0%, rgba(255,255,255,0) 70%)`,
          filter: "blur(80px)",
          transform: `translate3d(${Math.cos(frame * 0.025) * 140}px, ${Math.sin(frame * 0.03) * 100 + 250}px, -400px)`,
          pointerEvents: "none",
        }}
      />

      {/* --------------------------------------------------------------------- */}
      {/* MAIN FROSTED GLASS HERO PANEL (Specular Highlights & Natural Lighting) */}
      {/* --------------------------------------------------------------------- */}
      <div
        style={{
          width: `${panelW}px`,
          height: `${panelH}px`,
          borderRadius: `${panelRadius}px`,
          background:
            morphS3toS4 > 0.4
              ? "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.35) 100%)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: `1.5px solid ${
            morphS3toS4 > 0.4
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(255, 255, 255, 0.85)"
          }`,
          boxShadow:
            morphS3toS4 > 0.4
              ? "0 35px 70px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.5)"
              : "0 30px 60px -12px rgba(126, 34, 206, 0.15), 0 12px 30px -8px rgba(13, 148, 136, 0.12), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `translateZ(${cameraZ}px) rotateX(${Math.sin(frame * 0.02) * 2}deg) rotateY(${Math.cos(frame * 0.02) * 2}deg)`,
          filter: `blur(${dofBlur}px)`,
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        {/* =================================================================== */}
        {/* SCENE 1: Glassy Chat Bubbles & Rapid Notifications (0 - 360)        */}
        {/* =================================================================== */}
        {frame < 360 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "44px 36px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              opacity: interpolate(frame, [300, 360], [1, 0]),
            }}
          >
            {/* Header Status Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                paddingBottom: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontWeight: 800, fontSize: "20px", color: PURPLE_PRIMARY }}>
                  LIVE INBOX
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  background: "rgba(126, 34, 206, 0.1)",
                  color: PURPLE_PRIMARY,
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(126, 34, 206, 0.2)",
                }}
              >
                ⚡ 18 UNREAD
              </div>
            </div>

            {/* Glassy Pop-Up Notifications Stack */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transform: `translateY(${-((frame * 2.5) % 280)}px)`,
              }}
            >
              {[
                { title: "Team Sync: Q3 Mindset", time: "2m ago", text: "Are we hitting holistic goals?", color: PURPLE_PRIMARY },
                { title: "Wellness Assessment", time: "5m ago", text: "High stress detected. Take a break!", color: TEAL_PRIMARY },
                { title: "Financial Freedom Call", time: "12m ago", text: "New growth strategy available.", color: CYAN_ACCENT },
                { title: "Daily Habit Check-in", time: "18m ago", text: "Mind & Spirit score updated.", color: PURPLE_GLOW },
              ].map((item, idx) => {
                const itemPop = spring({
                  frame: frame - idx * 12,
                  fps,
                  config: { stiffness: 140, damping: 12 },
                });

                return (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(16px)",
                      borderRadius: "20px",
                      padding: "20px 24px",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      transform: `scale(${itemPop}) translateY(${interpolate(itemPop, [0, 1], [30, 0])}px)`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 800, fontSize: "16px", color: "#1E293B" }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                        {item.time}
                      </span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#64748B", fontWeight: 500 }}>
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stylized 3D Glass Cursor Swiping Notifications */}
            <div
              style={{
                position: "absolute",
                left: `${interpolate(frame, [20, 120, 220], [180, 520, 320], { extrapolateRight: "clamp" })}px`,
                top: `${interpolate(frame, [20, 120, 220], [220, 380, 540], { extrapolateRight: "clamp" })}px`,
                width: "36px",
                height: "36px",
                pointerEvents: "none",
                filter: "drop-shadow(0 8px 16px rgba(126, 34, 206, 0.3))",
                transform: `rotate(-15deg) scale(${1 + Math.sin(frame * 0.2) * 0.08})`,
              }}
            >
              <svg viewBox="0 0 32 32" fill="none">
                <path
                  d="M4 4L14 28L18 18L28 14L4 4Z"
                  fill="url(#cursorGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={PURPLE_GLOW} />
                    <stop offset="100%" stopColor={TEAL_LIGHT} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SCENE 2: Glowing 3D Glass Sphere & Synergy Rings (360 - 720)         */}
        {/* =================================================================== */}
        {frame >= 340 && frame < 740 && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 3D Interlocking Glass Synergy Rings */}
            <div
              style={{
                position: "relative",
                width: "240px",
                height: "240px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Ring 1: Mind */}
              <div
                style={{
                  position: "absolute",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  border: `6px solid ${PURPLE_GLOW}`,
                  boxShadow: `0 0 40px ${PURPLE_GLOW}80, inset 0 0 20px ${PURPLE_GLOW}40`,
                  transform: `rotateX(${frame * 2.2}deg) rotateY(${frame * 1.1}deg)`,
                }}
              />
              {/* Ring 2: Body */}
              <div
                style={{
                  position: "absolute",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  border: `6px solid ${TEAL_LIGHT}`,
                  boxShadow: `0 0 40px ${TEAL_LIGHT}80, inset 0 0 20px ${TEAL_LIGHT}40`,
                  transform: `rotateX(${frame * -1.5}deg) rotateZ(${frame * 1.8}deg)`,
                }}
              />
              {/* Ring 3: Spirit */}
              <div
                style={{
                  position: "absolute",
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  border: `6px solid ${CYAN_ACCENT}`,
                  boxShadow: `0 0 40px ${CYAN_ACCENT}80, inset 0 0 20px ${CYAN_ACCENT}40`,
                  transform: `rotateY(${frame * 1.8}deg) rotateZ(${frame * -1.1}deg)`,
                }}
              />

              {/* Glowing Glass Core Orb */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${PURPLE_GLOW} 55%, ${TEAL_PRIMARY} 100%)`,
                  boxShadow: `0 0 60px ${TEAL_LIGHT}, inset 0 4px 12px rgba(255,255,255,0.9)`,
                  transform: `scale(${1 + Math.sin(frame * 0.1) * 0.1})`,
                }}
              />
            </div>

            {/* Interactive Mind-Body Slider Simulation */}
            {frame >= 540 && (
              <div
                style={{
                  marginTop: "36px",
                  width: "80%",
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(12px)",
                  padding: "16px 24px",
                  borderRadius: "24px",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <span style={{ fontWeight: 800, fontSize: "14px", color: PURPLE_PRIMARY }}>
                  RESET SCORE
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "#E2E8F0",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${interpolate(frame, [540, 680], [20, 100], { extrapolateRight: "clamp" })}%`,
                      height: "100%",
                      background: `linear-gradient(to right, ${PURPLE_GLOW}, ${TEAL_LIGHT})`,
                    }}
                  />
                </div>
                <span style={{ fontWeight: 900, fontSize: "16px", color: TEAL_PRIMARY }}>
                  100%
                </span>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* SCENE 3: OHMnibus Brand Mark & Interactive Data Cards (720 - 1140)   */}
        {/* =================================================================== */}
        {frame >= 700 && frame < 1160 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "44px",
              textAlign: "center",
            }}
          >
            {/* OHMnibus Glass Typography Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "72px",
                letterSpacing: "-2px",
                lineHeight: 1,
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.08))",
              }}
            >
              <span style={{ color: PURPLE_PRIMARY }}>OHM</span>
              <span style={{ color: TEAL_PRIMARY }}>nibus</span>
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#64748B",
                letterSpacing: "4px",
                marginTop: "16px",
                textTransform: "uppercase",
              }}
            >
              One Healthy Mind For All
            </div>

            {/* Interactive Pillar Cards */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "48px",
                transform: `translateY(${Math.sin(frame * 0.06) * 12}px)`,
              }}
            >
              {[
                { title: "Mental", val: "Mind Sync", icon: "🧠", color: PURPLE_PRIMARY },
                { title: "Physical", val: "Body Health", icon: "💚", color: TEAL_PRIMARY },
                { title: "Financial", val: "Empower", icon: "⚡", color: CYAN_ACCENT },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "20px",
                    padding: "18px 22px",
                    border: `1.5px solid ${card.color}35`,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>{card.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: "14px", color: card.color }}>
                    {card.title}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "12px", color: "#64748B" }}>
                    {card.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SCENE 4 & 5: Dark Obsidian Glass Forum Panel & CTA (1140 - 1920)    */}
        {/* =================================================================== */}
        {frame >= 1140 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "52px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {/* Top Brand Header Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                padding: "10px 24px",
                borderRadius: "30px",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              }}
            >
              <span style={{ fontWeight: 900, fontSize: "26px", color: PURPLE_GLOW }}>
                OHM
              </span>
              <span style={{ fontWeight: 900, fontSize: "26px", color: TEAL_LIGHT }}>
                nibus
              </span>
              <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 700, letterSpacing: "1px" }}>
                PRESENTS
              </span>
            </div>

            {/* Main Forum Title Card */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                style={{
                  fontSize: "46px",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  background: `linear-gradient(135deg, #FFFFFF 0%, ${TEAL_LIGHT} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
                }}
              >
                RESET: A Holistic Wellness Forum
              </div>

              {/* Event Details Glass List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
                {[
                  { label: "TIME", val: "2:00 PM", highlight: true, color: TEAL_LIGHT },
                  { label: "LOCATION", val: "Emerald Grains Hotel, Baguio City", highlight: false, color: "#FFFFFF" },
                  { label: "ADMISSION", val: "FREE (STRICTLY LIMITED SEATS)", highlight: true, color: "#10B981" },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(16px)",
                      padding: "18px 26px",
                      borderRadius: "18px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#94A3B8", fontWeight: 700, fontSize: "13px", letterSpacing: "1px" }}>
                      {row.label}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "17px", color: row.color }}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing CTA Button with Interactive Ripple Physics */}
            <div
              style={{
                width: "100%",
                padding: "24px 36px",
                borderRadius: "26px",
                background: `linear-gradient(135deg, ${PURPLE_PRIMARY} 0%, ${TEAL_PRIMARY} 100%)`,
                boxShadow: `0 20px 45px rgba(13, 148, 136, 0.45), inset 0 1px 0 rgba(255,255,255,0.4)`,
                fontWeight: 900,
                fontSize: "22px",
                letterSpacing: "1px",
                color: "#FFFFFF",
                cursor: "pointer",
                transform: `scale(${1 + Math.sin(frame * 0.1) * 0.03})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span>RESERVE YOUR SPOT TODAY</span>
              <span style={{ fontSize: "24px" }}>➔</span>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* FROSTED GLASS VOICEOVER CAPTIONS OVERLAY (Synchronized Subtitles)    */}
      {/* --------------------------------------------------------------------- */}
      {CAPTIONS.map((cap, i) => {
        if (frame >= cap.start && frame <= cap.end) {
          const capSpring = spring({
            frame: frame - cap.start,
            fps,
            config: { stiffness: 150, damping: 14 },
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: "64px",
                width: "86%",
                background:
                  morphS3toS4 > 0.4
                    ? "rgba(15, 23, 42, 0.85)"
                    : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: `1.5px solid ${
                  morphS3toS4 > 0.4
                    ? "rgba(255, 255, 255, 0.18)"
                    : "rgba(255, 255, 255, 0.95)"
                }`,
                borderRadius: "26px",
                padding: "20px 30px",
                textAlign: "center",
                fontSize: "21px",
                fontWeight: 800,
                color: morphS3toS4 > 0.4 ? "#FFFFFF" : "#0F172A",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                transform: `translateY(${interpolate(capSpring, [0, 1], [40, 0])}px) scale(${interpolate(
                  capSpring,
                  [0, 1],
                  [0.92, 1]
                )})`,
                opacity: interpolate(capSpring, [0, 1], [0, 1]),
                zIndex: 100,
              }}
            >
              {cap.text}
            </div>
          );
        }
        return null;
      })}
    </AbsoluteFill>
  );
};
