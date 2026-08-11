import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

// ─── Animated counter ──────────────────────────────────────────────────────────
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        opacity: valueOpacity,
      }}
    >
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

// ─── Kinetic word swap component ──────────────────────────────────────────────
const KINETIC_WORDS = ["Measures", "Analyzes", "Executes"];

const KineticTypography: React.FC<{ frame: number; totalFrames: number }> = ({ frame, totalFrames }) => {
  const wordDuration = Math.floor(totalFrames / KINETIC_WORDS.length);

  return (
    <div
      style={{
        position: "relative",
        height: 100,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {KINETIC_WORDS.map((word, i) => {
        const wordStart = i * wordDuration;
        const wordEnd = wordStart + wordDuration;

        const wordOpacity = interpolate(
          frame,
          [wordStart, wordStart + 12, wordEnd - 12, wordEnd],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const wordY = interpolate(
          frame,
          [wordStart, wordStart + 14],
          [30, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }
        );

        return (
          <div
            key={word}
            style={{
              position: "absolute",
              opacity: wordOpacity,
              transform: `translateY(${wordY}px)`,
              fontSize: 72,
              fontWeight: 700,
              fontFamily: "'Inter', 'Roboto', sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
            }}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

// ─── Mini chart sparkline ─────────────────────────────────────────────────────
const SparkLine: React.FC<{ color: string; progress: number; width: number; height: number }> = ({
  color,
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
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {visiblePoints.length > 0 && (
        <circle
          cx={visiblePoints[visiblePoints.length - 1][0] * width}
          cy={visiblePoints[visiblePoints.length - 1][1] * height}
          r="4"
          fill={color}
        />
      )}
    </svg>
  );
};


// ─── Main Export ───────────────────────────────────────────────────────────────
export const BlueAlphaDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalSceneFrames = 210; // 421 - 211

  // Dashboard slides in from left
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

  // Scene fade out
  const sceneOut = interpolate(frame, [190, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Sparkline progress
  const sparkProgress = interpolate(frame, [40, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Channel bars progress
  const barProgress = interpolate(frame, [50, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const channels = [
    { name: "Paid Search", value: 0.82, color: "#3B82F6" },
    { name: "Social Media", value: 0.65, color: "#8B5CF6" },
    { name: "Email", value: 0.51, color: "#10B981" },
    { name: "Organic", value: 0.44, color: "#F59E0B" },
    { name: "Referral", value: 0.28, color: "#EF4444" },
  ];

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", opacity: sceneOut }}>
      {/* Background: vibrant blue radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, #8ECAFF 0%, #1E58F4 100%)",
        }}
      />

      {/* White dot grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />

      {/* ── LEFT: Isometric Dashboard ─────────────────────────────────── */}
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
          {/* Main dashboard shell */}
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
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(100,116,139,0.8)",
                    fontFamily: "'Inter', 'Roboto', sans-serif",
                    marginBottom: 4,
                  }}
                >
                  Analytics Overview
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#1e293b",
                    fontFamily: "'Inter', 'Roboto', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Marketing Dashboard
                </div>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg, #1E58F4 0%, #A855F7 100%)",
                  borderRadius: 10,
                  padding: "6px 14px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "white",
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                LIVE
              </div>
            </div>

            {/* Metric counters row */}
            <div style={{ display: "flex", gap: 24 }}>
              <div
                style={{
                  flex: 1,
                  background: "rgba(248,250,252,0.8)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid rgba(226,232,240,0.6)",
                }}
              >
                <AnimatedCounter
                  startVal={14}
                  endVal={34}
                  prefix="$"
                  frame={frame}
                  startFrame={20}
                  endFrame={160}
                  label="Blended CAC"
                  sublabel="+143% efficiency"
                  trend="down"
                />
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(248,250,252,0.8)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid rgba(226,232,240,0.6)",
                }}
              >
                <AnimatedCounter
                  startVal={2.8}
                  endVal={6.5}
                  prefix="$"
                  suffix="M"
                  decimals={1}
                  frame={frame}
                  startFrame={25}
                  endFrame={170}
                  label="Total Revenue"
                  sublabel="+132% YoY"
                  trend="up"
                />
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(248,250,252,0.8)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid rgba(226,232,240,0.6)",
                }}
              >
                <AnimatedCounter
                  startVal={0}
                  endVal={94}
                  suffix="%"
                  frame={frame}
                  startFrame={30}
                  endFrame={175}
                  label="Attribution Rate"
                  sublabel="+18pts accuracy"
                  trend="up"
                />
              </div>
            </div>

            {/* Mini sparkline area */}
            <div
              style={{
                background: "rgba(248,250,252,0.8)",
                borderRadius: 14,
                padding: "16px 20px",
                border: "1px solid rgba(226,232,240,0.6)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(100,116,139,0.7)",
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                  marginBottom: 10,
                }}
              >
                Revenue Trend
              </div>
              <SparkLine color="#1E58F4" progress={sparkProgress} width={780} height={56} />
            </div>

            {/* Channel performance bars */}
            <div
              style={{
                background: "rgba(248,250,252,0.8)",
                borderRadius: 14,
                padding: "16px 20px",
                border: "1px solid rgba(226,232,240,0.6)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(100,116,139,0.7)",
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                  marginBottom: 4,
                }}
              >
                Channel Performance
              </div>
              {channels.map((ch) => (
                <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 88,
                      fontSize: 11,
                      fontWeight: 500,
                      color: "rgba(51,65,85,0.8)",
                      fontFamily: "'Inter', 'Roboto', sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {ch.name}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: "rgba(226,232,240,0.6)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${ch.value * barProgress * 100}%`,
                        height: "100%",
                        background: ch.color,
                        borderRadius: 3,
                        transition: "none",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 36,
                      fontSize: 11,
                      fontWeight: 600,
                      color: ch.color,
                      fontFamily: "'Inter', 'Roboto', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    {Math.round(ch.value * barProgress * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Kinetic Typography ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 0,
          bottom: 0,
          width: 680,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [10, 30], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Inter', 'Roboto', sans-serif",
          }}
        >
          BlueAlpha Platform
        </div>

        {/* Kinetic words */}
        <KineticTypography frame={frame} totalFrames={totalSceneFrames} />

        {/* Static tagline below */}
        <div
          style={{
            opacity: interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [25, 50], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.75)",
            fontFamily: "'Inter', 'Roboto', sans-serif",
            maxWidth: 520,
          }}
        >
          Full-stack attribution intelligence that transforms your marketing data into decisive action.
        </div>

        {/* CTA pill */}
        <div
          style={{
            opacity: interpolate(frame, [45, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [45, 70], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 50,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              fontFamily: "'Inter', 'Roboto', sans-serif",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 8px #10B981",
              }}
            />
            View Live Dashboard
            <span style={{ opacity: 0.6 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
