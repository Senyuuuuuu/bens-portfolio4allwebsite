import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

// ─── Animated Counter ──────────────────────────────────────────────────────────
const AnimatedCounter: React.FC<{
  startVal: number;
  endVal: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  frame: number;
  startFrame: number;
  endFrame: number;
  label: string;
  sublabel?: string;
  trend?: "up" | "down";
}> = ({
  startVal,
  endVal,
  prefix = "",
  suffix = "",
  decimals = 0,
  frame,
  startFrame,
  endFrame,
  label,
  sublabel,
  trend = "up",
}) => {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const currentVal = startVal + (endVal - startVal) * progress;
  const displayVal = decimals > 0
    ? currentVal.toFixed(decimals)
    : Math.floor(currentVal).toString();

  const valueOpacity = interpolate(frame, [startFrame - 10, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: valueOpacity }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(100, 116, 139, 0.8)",
          fontFamily: "'Inter', 'Roboto', sans-serif",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          fontFamily: "'Inter', 'Roboto', sans-serif",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #1E58F4 0%, #A855F7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {prefix}{displayVal}{suffix}
      </div>
      {sublabel && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 400,
            color: trend === "up" ? "#10B981" : "#EF4444",
            fontFamily: "'Inter', 'Roboto', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {trend === "up" ? "↑" : "↓"} {sublabel}
        </div>
      )}
    </div>
  );
};

// ─── Kinetic Word Animation (Synced to absolute frames 280, 330, 380) ─────────
// Relative frames in Scene 3 (starts frame 211):
// "Measures": Frame 69 (280 - 211)
// "Analyzes": Frame 119 (330 - 211)
// "Executes": Frame 169 (380 - 211)
const KINETIC_STEPS = [
  { word: "Measures", relStart: 69, relEnd: 118 },
  { word: "Analyzes", relStart: 119, relEnd: 168 },
  { word: "Executes", relStart: 169, relEnd: 210 },
];

const KineticTypographyV2: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ position: "relative", height: 90, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {KINETIC_STEPS.map((step) => {
        const wordOpacity = interpolate(
          frame,
          [step.relStart, step.relStart + 10, step.relEnd - 10, step.relEnd],
          [0, 1, 1, step.word === "Executes" ? 1 : 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const wordY = interpolate(
          frame,
          [step.relStart, step.relStart + 12],
          [30, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }
        );

        return (
          <div
            key={step.word}
            style={{
              position: "absolute",
              opacity: wordOpacity,
              transform: `translateY(${wordY}px)`,
              fontSize: 72,
              fontWeight: 700,
              fontFamily: "'Inter', 'Roboto', sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              background: "linear-gradient(135deg, #1E58F4 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
            }}
          >
            {step.word}
          </div>
        );
      })}
    </div>
  );
};

// ─── Sparkline Component ──────────────────────────────────────────────────────
const SparkLineV2: React.FC<{ progress: number; width: number; height: number }> = ({
  progress,
  width,
  height,
}) => {
  const points = [
    [0, 0.6], [0.1, 0.5], [0.2, 0.7], [0.3, 0.4], [0.4, 0.55],
    [0.5, 0.3], [0.6, 0.45], [0.7, 0.25], [0.85, 0.15], [1.0, 0.05],
  ];
  const visiblePoints = points.filter(([x]) => x <= progress);

  if (visiblePoints.length < 2) return <svg width={width} height={height} />;

  const pathD = visiblePoints
    .map(([x, y], idx) => {
      const px = x * width;
      const py = y * height;
      return idx === 0 ? `M ${px} ${py}` : `L ${px} ${py}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path d={pathD} stroke="#1E58F4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {visiblePoints.length > 0 && (
        <circle
          cx={visiblePoints[visiblePoints.length - 1][0] * width}
          cy={visiblePoints[visiblePoints.length - 1][1] * height}
          r="4.5"
          fill="#1E58F4"
        />
      )}
    </svg>
  );
};

// ─── Main Export: <DashboardIntro/> ────────────────────────────────────────────
export const DashboardIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dashboard spring slide entry from left
  const dashboardSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { stiffness: 100, damping: 20, mass: 1 },
  });
  const dashboardX = interpolate(dashboardSpring, [0, 1], [-140, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashboardOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sceneOut = interpolate(frame, [190, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Ticker start delayed until absolute frame 260 (relative frame 49)
  const tickerStartRel = 49;
  const tickerEndRel = 180;

  // Channel bars animation
  const barProgress = interpolate(frame, [tickerStartRel + 10, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const channels = [
    { name: "Paid Search", value: 0.82, color: "#00B578" },
    { name: "Social Media", value: 0.65, color: "#2F80ED" },
    { name: "TikTok", value: 0.51, color: "#8B5CF6" },
    { name: "Bing", value: 0.44, color: "#F2994A" },
    { name: "Reddit", value: 0.28, color: "#EB5757" },
  ];

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", opacity: sceneOut }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, #8ECAFF 0%, #1E58F4 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />

      {/* LEFT: Isometric Dashboard */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 0,
          bottom: 0,
          width: 1060,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: dashboardOpacity,
          transform: `translateX(${dashboardX}px)`,
        }}
      >
        <div
          style={{
            transform: "perspective(1200px) rotateX(15deg) rotateY(-25deg)",
            transformOrigin: "50% 50%",
            filter: "drop-shadow(0px 30px 60px rgba(0,0,0,0.15))",
            width: 860,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(30px)",
              borderRadius: 24,
              padding: 28,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.05), 0px 1px 0px rgba(255,255,255,0.9) inset",
              border: "1px solid rgba(255,255,255,0.7)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(100,116,139,0.8)", fontFamily: "Inter, sans-serif" }}>
                  Analytics Overview
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#1e293b", fontFamily: "Inter, sans-serif" }}>
                  Marketing Dashboard
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #1E58F4 0%, #A855F7 100%)", borderRadius: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "white", fontFamily: "Inter, sans-serif" }}>
                LIVE
              </div>
            </div>

            {/* Staggered Metric Counters (Starts frame 260 / rel 49) */}
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1, background: "rgba(248,250,252,0.8)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(226,232,240,0.6)" }}>
                <AnimatedCounter
                  startVal={14}
                  endVal={34}
                  prefix="$"
                  frame={frame}
                  startFrame={tickerStartRel}
                  endFrame={tickerEndRel}
                  label="Blended CAC"
                  sublabel="+143% efficiency"
                  trend="down"
                />
              </div>
              <div style={{ flex: 1, background: "rgba(248,250,252,0.8)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(226,232,240,0.6)" }}>
                <AnimatedCounter
                  startVal={2.8}
                  endVal={6.5}
                  prefix="$"
                  suffix="M"
                  decimals={1}
                  frame={frame}
                  startFrame={tickerStartRel + 5}
                  endFrame={tickerEndRel + 5}
                  label="Total Revenue"
                  sublabel="+132% YoY"
                  trend="up"
                />
              </div>
              <div style={{ flex: 1, background: "rgba(248,250,252,0.8)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(226,232,240,0.6)" }}>
                <AnimatedCounter
                  startVal={0}
                  endVal={94}
                  suffix="%"
                  frame={frame}
                  startFrame={tickerStartRel + 10}
                  endFrame={tickerEndRel + 10}
                  label="Attribution Rate"
                  sublabel="+18pts accuracy"
                  trend="up"
                />
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ background: "rgba(248,250,252,0.8)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(226,232,240,0.6)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(100,116,139,0.7)", fontFamily: "Inter, sans-serif", marginBottom: 10 }}>
                Revenue Trend
              </div>
              <SparkLineV2 progress={interpolate(frame, [tickerStartRel, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} width={780} height={56} />
            </div>

            {/* Channels */}
            <div style={{ background: "rgba(248,250,252,0.8)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(226,232,240,0.6)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(100,116,139,0.7)", fontFamily: "Inter, sans-serif" }}>
                Channel Performance
              </div>
              {channels.map((ch) => (
                <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 88, fontSize: 11, fontWeight: 500, color: "rgba(51,65,85,0.8)", fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
                    {ch.name}
                  </div>
                  <div style={{ flex: 1, height: 6, background: "rgba(226,232,240,0.6)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${ch.value * barProgress * 100}%`, height: "100%", background: ch.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 36, fontSize: 11, fontWeight: 600, color: ch.color, fontFamily: "Inter, sans-serif", textAlign: "right" }}>
                    {Math.round(ch.value * barProgress * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Kinetic Typography ("Measures" frame 280, "Analyzes" frame 330, "Executes" frame 380) */}
      <div style={{ position: "absolute", right: 80, top: 0, bottom: 0, width: 680, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        <div style={{ opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
          BlueAlpha Platform
        </div>
        <KineticTypographyV2 frame={frame} />
        <div style={{ opacity: interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 22, fontWeight: 400, lineHeight: 1.5, color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif", maxWidth: 520 }}>
          Full-stack attribution intelligence that transforms your marketing data into decisive action.
        </div>
      </div>
    </div>
  );
};
