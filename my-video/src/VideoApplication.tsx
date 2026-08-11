import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

// ═════════════════════════════════════════════════════════════════════════════
// GLOBAL DESIGN SYSTEM TOKENS & STYLES
// Premium Modern Aesthetic: Off-White Slate, Electric Blue, Emerald & Obsidian
// ═════════════════════════════════════════════════════════════════════════════

const T = {
  bgLight: "#f8f9fa",
  bgGridDot: "rgba(0, 0, 0, 0.05)",
  textDark: "#0f172a",
  textMuted: "#475569",
  textSecondary: "#64748b",
  primaryBlue: "#2563eb",
  primaryBlueGlow: "rgba(37, 99, 235, 0.15)",
  accentGreen: "#10b981",
  accentIndigo: "#6366f1",
  cardBg: "#ffffff",
  cardBorder: "1px solid rgba(226, 232, 240, 0.8)",
  shadowBase: "0 20px 45px -10px rgba(0, 0, 0, 0.07), 0 10px 20px -5px rgba(0, 0, 0, 0.04)",
  shadowElevated: "0 30px 60px -15px rgba(37, 99, 235, 0.18), 0 12px 24px -6px rgba(0, 0, 0, 0.06)",
};

const CONTAINER_STYLE: React.CSSProperties = {
  backgroundColor: T.bgLight,
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  color: T.textDark,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  overflow: "hidden",
  position: "relative",
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION: CONTINUOUS SEAMLESS MORPHING (5400 FRAMES / 90s @ 60FPS)
// ═════════════════════════════════════════════════════════════════════════════

export const VideoApplication: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------------------------
  // TIMELINE SEAMLESS TRANSITION SPRINGS & MORPH METRICS
  // Phase 1 Intro: 0 - 900 frames
  // Phase 2 Data Skills: 900 - 2100 frames
  // Phase 3 Technical: 2100 - 3300 frames
  // Phase 4 Automation: 3300 - 4500 frames
  // Phase 5 Outro: 4500 - 5400 frames
  // ---------------------------------------------------------------------------

  // Transition 1 -> 2 (around frame 840 - 900)
  const t1to2 = spring({
    frame: Math.max(0, frame - 840),
    fps,
    config: { stiffness: 120, damping: 14 },
  });

  // Transition 2 -> 3 (around frame 2040 - 2100)
  const t2to3 = spring({
    frame: Math.max(0, frame - 2040),
    fps,
    config: { stiffness: 120, damping: 14 },
  });

  // Transition 3 -> 4 (around frame 3240 - 3300)
  const t3to4 = spring({
    frame: Math.max(0, frame - 3240),
    fps,
    config: { stiffness: 120, damping: 14 },
  });

  // Transition 4 -> 5 (around frame 4440 - 4500)
  const t4to5 = spring({
    frame: Math.max(0, frame - 4440),
    fps,
    config: { stiffness: 120, damping: 14 },
  });

  // Ambient Dynamic Mesh Color Shift across timeline
  const bgAccentColor = interpolateColors(
    frame,
    [0, 1500, 3000, 4500, 5400],
    [
      "rgba(37, 99, 235, 0.06)",
      "rgba(16, 185, 129, 0.06)",
      "rgba(99, 102, 241, 0.06)",
      "rgba(37, 99, 235, 0.08)",
      "rgba(16, 185, 129, 0.06)",
    ]
  );

  return (
    <AbsoluteFill style={CONTAINER_STYLE}>
      {/* Background Animated Micro-Grid Dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${T.bgGridDot} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
          opacity: 0.8,
        }}
      />

      {/* Ambient Glowing Color Blob */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: bgAccentColor,
          filter: "blur(100px)",
          transform: `translate(${Math.sin(frame * 0.01) * 60}px, ${Math.cos(frame * 0.01) * 40}px)`,
          pointerEvents: "none",
        }}
      />

      {/* 🎬 MAIN MORPHING GRAPHICS ENGINE */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* SCENE 1: INTRO & IDENTITY (0 - 900) */}
        {frame < 960 && (
          <SceneIntroMorph
            tOut={t1to2}
          />
        )}

        {/* SCENE 2: DATA & ADMIN SKILLS (840 - 2160) */}
        {frame >= 840 && frame < 2160 && (
          <SceneDataSkillsMorph
            tIn={t1to2}
            tOut={t2to3}
          />
        )}

        {/* SCENE 3: TECHNICAL FOUNDATION (2040 - 3360) */}
        {frame >= 2040 && frame < 3360 && (
          <SceneTechnicalMorph
            tIn={t2to3}
            tOut={t3to4}
          />
        )}

        {/* SCENE 4: AUTOMATION & SYSTEMS (3240 - 4560) */}
        {frame >= 3240 && frame < 4560 && (
          <SceneAutomationMorph
            tIn={t3to4}
            tOut={t4to5}
          />
        )}

        {/* SCENE 5: OUTRO & COMMITMENT (4440 - 5400) */}
        {frame >= 4440 && (
          <SceneOutroMorph
            tIn={t4to5}
          />
        )}
      </AbsoluteFill>

      {/* Persistent Elegant Header Stamp */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [10, 40], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: T.primaryBlue,
            boxShadow: `0 0 12px ${T.primaryBlue}`,
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: T.textMuted, textTransform: "uppercase" }}>
          Benyamin Namtalashvili • Application Video
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SCENE 1: INTRO & IDENTITY WITH CONTINUOUS ORBIT & MORPH
// ═════════════════════════════════════════════════════════════════════════════

const SceneIntroMorph: React.FC<{ tOut: number }> = ({ tOut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { stiffness: 180, damping: 20 } });
  const subOpacity = interpolate(frame, [25, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbitRotation = frame * 0.6;

  // Seamless Morphing Out: Width, Height, Scale, Pos
  const morphScale = interpolate(tOut, [0, 1], [1, 0.85]);
  const morphY = interpolate(tOut, [0, 1], [0, -60]);
  const morphOpacity = interpolate(tOut, [0, 1], [1, 0]);

  const skills = [
    { label: "Data Management", color: T.primaryBlue },
    { label: "Web Architecture", color: T.accentIndigo },
    { label: "AI Automation", color: T.accentGreen },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        position: "relative",
        transform: `translateY(${morphY}px) scale(${titleScale * morphScale})`,
        opacity: morphOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Sleek Pill Badge above Name */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "rgba(37, 99, 235, 0.08)",
          border: `1px solid rgba(37, 99, 235, 0.2)`,
          padding: "8px 20px",
          borderRadius: 40,
          color: T.primaryBlue,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.04em",
          marginBottom: 24,
          opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp" }),
        }}
      >
        <span>👋 CANDIDATE PRESENTATION</span>
      </div>

      {/* Main Title Name */}
      <h1
        style={{
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: "-0.035em",
          color: T.textDark,
          margin: "0 0 16px 0",
          lineHeight: 1.05,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Benyamin Namtalashvili
      </h1>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          fontSize: 28,
          color: T.textMuted,
          fontWeight: 600,
          maxWidth: 600,
          letterSpacing: "-0.01em",
        }}
      >
        Excited to apply for this position
      </div>

      {/* Orbiting Skill Badges */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 540,
          height: 540,
          marginLeft: -270,
          marginTop: -270,
          borderRadius: "50%",
          transform: `rotate(${orbitRotation}deg)`,
          pointerEvents: "none",
          border: "1px dashed rgba(203, 213, 225, 0.6)",
        }}
      >
        {skills.map((skill, idx) => {
          const angle = (idx * 120 * Math.PI) / 180;
          const radius = 270;
          const x = radius + radius * Math.cos(angle) - 80;
          const y = radius + radius * Math.sin(angle) - 24;

          const badgeEntrance = spring({
            frame: Math.max(0, frame - 30 - idx * 10),
            fps,
            config: { stiffness: 200, damping: 18 },
          });

          return (
            <div
              key={skill.label}
              style={{
                position: "absolute",
                left: x,
                top: y,
                backgroundColor: T.cardBg,
                border: T.cardBorder,
                padding: "10px 22px",
                borderRadius: 24,
                boxShadow: T.shadowBase,
                fontSize: 15,
                fontWeight: 700,
                color: T.textDark,
                transform: `rotate(${-orbitRotation}deg) scale(${badgeEntrance})`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: skill.color,
                }}
              />
              {skill.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SCENE 2: ADMIN & DATA SKILLS WITH MATHEMATICAL SHAPE MORPHING
// ═════════════════════════════════════════════════════════════════════════════

const SceneDataSkillsMorph: React.FC<{ tIn: number; tOut: number }> = ({ tIn, tOut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame starting from scene enter (frame 900)
  const localFrame = Math.max(0, frame - 900);

  // Shape Morphing In (From Intro Card to 1100px Container)
  const containerWidth = interpolate(tIn, [0, 1], [600, 1100]);
  const containerPadding = interpolate(tIn, [0, 1], [24, 48]);
  const containerRadius = interpolate(tIn, [0, 1], [40, 24]);
  const containerY = interpolate(tIn, [0, 1], [80, 0]);
  const opacityIn = interpolate(tIn, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Morphing Out to Scene 3
  const morphOutY = interpolate(tOut, [0, 1], [0, -50]);
  const morphOutScale = interpolate(tOut, [0, 1], [1, 0.92]);
  const morphOutOpacity = interpolate(tOut, [0.4, 1], [1, 0]);

  const tasks = [
    { title: "Data Entry & CRM Updates", desc: "Precision records & contact database hygiene" },
    { title: "Reporting & Documentation", desc: "Structured summaries & executive insights" },
    { title: "File & Database Organization", desc: "Systematic tagging, storage & retrieval" },
    { title: "Microsoft Excel & Google Workspace", desc: "Advanced spreadsheets, formulas & docs" },
  ];

  return (
    <div
      style={{
        width: containerWidth,
        backgroundColor: T.cardBg,
        borderRadius: containerRadius,
        padding: containerPadding,
        boxShadow: T.shadowElevated,
        border: T.cardBorder,
        transform: `translateY(${containerY + morphOutY}px) scale(${morphOutScale})`,
        opacity: Math.min(opacityIn, morphOutOpacity),
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.primaryBlue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Core Capabilities
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: T.textDark, margin: 0, letterSpacing: "-0.025em" }}>
            Administrative & Data Management Capabilities
          </h2>
        </div>
        <div style={{ backgroundColor: T.primaryBlueGlow, color: T.primaryBlue, padding: "8px 16px", borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
          01 / ADMIN & DATA
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {tasks.map((task, i) => {
          const itemSpring = spring({
            frame: Math.max(0, localFrame - i * 10),
            fps,
            config: { stiffness: 220, damping: 20 },
          });

          return (
            <div
              key={task.title}
              style={{
                padding: "24px 28px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                transform: `scale(${Math.max(0, itemSpring)})`,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#dbeafe",
                  color: T.primaryBlue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.textDark, marginBottom: 4 }}>
                  {task.title}
                </div>
                <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.4 }}>
                  {task.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SCENE 3: TECHNICAL & DIGITAL ENGINEERING WITH CARD SEPARATION MORPH
// ═════════════════════════════════════════════════════════════════════════════

const SceneTechnicalMorph: React.FC<{ tIn: number; tOut: number }> = ({ tIn, tOut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - 2100);

  // Continuous Morphing In
  const sceneScaleIn = interpolate(tIn, [0, 1], [0.85, 1]);
  const sceneYIn = interpolate(tIn, [0, 1], [60, 0]);
  const sceneOpacityIn = interpolate(tIn, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Morphing Out
  const sceneYOut = interpolate(tOut, [0, 1], [0, -60]);
  const sceneScaleOut = interpolate(tOut, [0, 1], [1, 0.88]);
  const sceneOpacityOut = interpolate(tOut, [0.5, 1], [1, 0]);

  const nodes = [
    {
      title: "AI Automation Specialist",
      detail: "n8n • OpenAI Workflows",
      desc: "Custom LLM agents, API webhooks, automated data transformations & system connectors.",
      badge: "Automation",
      color: T.primaryBlue,
      icon: "⚡",
    },
    {
      title: "Full-Stack Web Developer",
      detail: "Modern Web Architecture",
      desc: "Responsive frontend engineering, modern React TSX codebases, scalable web applications.",
      badge: "Development",
      color: T.accentIndigo,
      icon: "💻",
    },
    {
      title: "Graphic Designer",
      detail: "Visual Systems & Assets",
      desc: "Brand identity design, sleek UI/UX components, digital media production & graphics.",
      badge: "Design",
      color: T.accentGreen,
      icon: "🎨",
    },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        transform: `translateY(${sceneYIn + sceneYOut}px) scale(${sceneScaleIn * sceneScaleOut})`,
        opacity: Math.min(sceneOpacityIn, sceneOpacityOut),
        maxWidth: 1160,
        width: "100%",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "inline-block", backgroundColor: "rgba(99, 102, 241, 0.1)", color: T.accentIndigo, padding: "8px 20px", borderRadius: 30, fontSize: 14, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 16 }}>
        02 / TECHNICAL FOUNDATION
      </div>
      <h2 style={{ fontSize: 44, fontWeight: 900, color: T.textDark, marginBottom: 48, letterSpacing: "-0.03em" }}>
        Technical Foundation & Specialized Engineering
      </h2>

      <div style={{ display: "flex", gap: 28, justifyContent: "center" }}>
        {nodes.map((node, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, localFrame - idx * 12),
            fps,
            config: { stiffness: 200, damping: 20 },
          });

          return (
            <div
              key={node.title}
              style={{
                flex: 1,
                padding: 36,
                backgroundColor: T.cardBg,
                borderRadius: 24,
                boxShadow: T.shadowBase,
                border: T.cardBorder,
                textAlign: "left",
                transform: `scale(${cardSpring})`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: `${node.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 20,
                }}
              >
                {node.icon}
              </div>
              <div style={{ display: "inline-block", fontSize: 12, fontWeight: 800, color: node.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                {node.badge}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.textDark, marginBottom: 6, lineHeight: 1.25 }}>
                {node.title}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.primaryBlue, marginBottom: 16 }}>
                {node.detail}
              </div>
              <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.5 }}>
                {node.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SCENE 4: AUTOMATION & SYSTEMS WITH DYNAMIC ODOMETER GAUGING
// ═════════════════════════════════════════════════════════════════════════════

const SceneAutomationMorph: React.FC<{ tIn: number; tOut: number }> = ({ tIn, tOut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - 3300);

  // Counter interpolator with smooth spring acceleration
  const rawProgress = interpolate(localFrame, [0, 180], [0, 100], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counter = Math.min(100, Math.floor(rawProgress));

  // Morphing In
  const containerWidth = interpolate(tIn, [0, 1], [700, 950]);
  const containerY = interpolate(tIn, [0, 1], [80, 0]);
  const opacityIn = interpolate(tIn, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Morphing Out
  const morphOutY = interpolate(tOut, [0, 1], [0, -50]);
  const morphOutScale = interpolate(tOut, [0, 1], [1, 0.9]);
  const morphOutOpacity = interpolate(tOut, [0.4, 1], [1, 0]);

  // Progress Bar width
  const barWidth = `${counter}%`;

  return (
    <div
      style={{
        width: containerWidth,
        backgroundColor: T.cardBg,
        borderRadius: 28,
        padding: 56,
        boxShadow: T.shadowElevated,
        border: T.cardBorder,
        textAlign: "center",
        transform: `translateY(${containerY + morphOutY}px) scale(${morphOutScale})`,
        opacity: Math.min(opacityIn, morphOutOpacity),
        position: "relative",
      }}
    >
      <div style={{ display: "inline-block", backgroundColor: "rgba(16, 185, 129, 0.1)", color: T.accentGreen, padding: "8px 20px", borderRadius: 30, fontSize: 14, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 20 }}>
        03 / PROCESS EFFICIENCY
      </div>

      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: T.primaryBlue,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 16,
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {counter}%
      </div>

      {/* Visual Animated Gauge Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 12,
          backgroundColor: "#e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: barWidth,
            height: "100%",
            background: "linear-gradient(90deg, #2563eb 0%, #10b981 100%)",
            borderRadius: 8,
          }}
        />
      </div>

      <div style={{ fontSize: 34, fontWeight: 800, color: T.textDark, marginBottom: 16, letterSpacing: "-0.02em" }}>
        Workflow Adaptability & Process Efficiency
      </div>

      <p style={{ fontSize: 22, color: T.textMuted, lineHeight: 1.6, margin: "0 auto", maxWidth: 760 }}>
        Comfortable adopting new software, processing documents, and automating repetitive business operations.
      </p>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SCENE 5: OUTRO & COMMITMENT WITH SEAL & FINAL SIGN-OFF
// ═════════════════════════════════════════════════════════════════════════════

const SceneOutroMorph: React.FC<{ tIn: number }> = ({ tIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - 4500);

  const pop = spring({
    frame: localFrame,
    fps,
    config: { stiffness: 220, damping: 18 },
  });

  const cardScaleIn = interpolate(tIn, [0, 1], [0.85, 1]);
  const cardYIn = interpolate(tIn, [0, 1], [60, 0]);
  const cardOpacity = interpolate(tIn, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: 880,
        width: "100%",
        transform: `translateY(${cardYIn}px) scale(${pop * cardScaleIn})`,
        opacity: cardOpacity,
        padding: "0 24px",
      }}
    >
      {/* Top Banner Attributes */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 40,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.02em",
          marginBottom: 32,
          boxShadow: "0 15px 30px rgba(15, 23, 42, 0.15)",
        }}
      >
        <span>Reliable</span>
        <span style={{ color: T.primaryBlue }}>•</span>
        <span>Hardworking</span>
        <span style={{ color: T.primaryBlue }}>•</span>
        <span>Dedicated</span>
      </div>

      {/* Main Card */}
      <div
        style={{
          backgroundColor: T.cardBg,
          padding: "48px 56px",
          borderRadius: 28,
          boxShadow: T.shadowElevated,
          border: T.cardBorder,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 900, color: T.textDark, marginBottom: 12, letterSpacing: "-0.02em" }}>
          Thank you for your time and consideration
        </div>
        <div style={{ fontSize: 22, color: T.textMuted, fontWeight: 600, lineHeight: 1.5 }}>
          Benyamin Namtalashvili — Ready to contribute and grow with your team.
        </div>

        {/* Verification / Callout Seal */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 28,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: T.primaryBlue,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✓
          </div>
          <span>Available for Immediate Onboarding & Remote Work</span>
        </div>
      </div>
    </div>
  );
};
