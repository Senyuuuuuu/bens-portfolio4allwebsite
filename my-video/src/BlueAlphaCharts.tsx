import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { evolvePath } from "@remotion/paths";

// ─── Chart path definitions (organic Bezier curves) ──────────────────────────
// Viewbox: 0 0 560 200. All 5 lines run left to right.
const CHART_PATHS: { id: string; color: string; label: string; path: string }[] = [
  {
    id: "green",
    color: "#10B981",
    label: "Search",
    path: "M 0 160 C 56 130, 112 70, 168 55 C 224 40, 280 48, 336 40 C 392 32, 448 28, 560 24",
  },
  {
    id: "blue",
    color: "#3B82F6",
    label: "Social",
    path: "M 0 170 C 60 150, 120 120, 180 100 C 240 80, 300 72, 360 64 C 420 56, 480 52, 560 45",
  },
  {
    id: "purple",
    color: "#A855F7",
    label: "Email",
    path: "M 0 175 C 70 165, 140 148, 210 132 C 280 116, 350 108, 420 100 C 470 95, 520 90, 560 86",
  },
  {
    id: "orange",
    color: "#F59E0B",
    label: "Referral",
    path: "M 0 180 C 80 175, 160 168, 240 158 C 320 148, 400 142, 480 138 C 510 136, 540 134, 560 132",
  },
  {
    id: "red",
    color: "#EF4444",
    label: "Direct",
    path: "M 0 185 C 100 182, 200 178, 300 172 C 400 166, 480 162, 560 158",
  },
];

// ─── Animated SVG Chart ───────────────────────────────────────────────────────
const ResponseCurvesChart: React.FC<{
  frame: number;
  drawStart: number;
  drawEnd: number;
}> = ({ frame, drawStart, drawEnd }) => {
  const drawProgress = interpolate(frame, [drawStart, drawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Y-axis labels
  const yLabels = ["High", "", "Mid", "", "Low"];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Card header */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(100,116,139,0.8)",
          fontFamily: "'Inter', 'Roboto', sans-serif",
          marginBottom: 14,
        }}
      >
        Response Curves & Saturation
      </div>

      {/* Chart area */}
      <div style={{ position: "relative" }}>
        {/* Y-axis labels */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 24,
            width: 36,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 0,
          }}
        >
          {yLabels.map((label, i) => (
            <div
              key={i}
              style={{
                fontSize: 9,
                color: "rgba(148,163,184,0.7)",
                fontFamily: "'Inter', 'Roboto', sans-serif",
                textAlign: "right",
                paddingRight: 8,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* SVG Chart */}
        <div style={{ marginLeft: 40, position: "relative" }}>
          <svg width={560} height={200} viewBox="0 0 560 200" style={{ overflow: "visible" }}>
            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={560}
                y2={y}
                stroke="rgba(226,232,240,0.5)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
            {[0, 112, 224, 336, 448, 560].map((x) => (
              <line
                key={x}
                x1={x}
                y1={0}
                x2={x}
                y2={200}
                stroke="rgba(226,232,240,0.3)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}

            {/* Animated chart lines */}
            {CHART_PATHS.map((chart, idx) => {
              // Stagger each line by 8 frames
              const lineProgress = interpolate(
                frame,
                [drawStart + idx * 8, drawEnd + idx * 5],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
              );

              let dotX = 0;
              let dotY = 0;

              // Get approximate coordinates at the current progress endpoint
              const t = lineProgress;
              const pathPoints: [number, number][] = [
                [0, 160], [560, chart.id === "green" ? 24 : chart.id === "blue" ? 45 :
                  chart.id === "purple" ? 86 : chart.id === "orange" ? 132 : 158]
              ];
              dotX = pathPoints[0][0] + (pathPoints[1][0] - pathPoints[0][0]) * t;
              dotY = pathPoints[0][1] + (pathPoints[1][1] - pathPoints[0][1]) * t;

              // Use evolvePath for dash animation
              const { strokeDasharray, strokeDashoffset } = evolvePath(lineProgress, chart.path);

              return (
                <g key={chart.id}>
                  {/* Chart line with evolve animation */}
                  <path
                    d={chart.path}
                    stroke={chart.color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />

                  {/* Area fill (subtle) */}
                  <path
                    d={`${chart.path} L 560 200 L 0 200 Z`}
                    fill={chart.color}
                    opacity={lineProgress * 0.06}
                  />

                  {/* Moving dot at end of line */}
                  {lineProgress > 0.02 && (
                    <circle
                      cx={dotX}
                      cy={dotY}
                      r={5}
                      fill={chart.color}
                      opacity={lineProgress}
                      style={{ filter: `drop-shadow(0 0 4px ${chart.color})` }}
                    />
                  )}
                </g>
              );
            })}

            {/* Saturation threshold line */}
            {drawProgress > 0.6 && (
              <g opacity={interpolate(frame, [drawStart + 54, drawStart + 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                <line
                  x1={380}
                  y1={0}
                  x2={380}
                  y2={200}
                  stroke="rgba(239,68,68,0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="6,3"
                />
                <text x={384} y={14} fontSize="9" fill="rgba(239,68,68,0.7)" fontFamily="Inter, sans-serif" fontWeight="600">
                  Saturation Point
                </text>
              </g>
            )}
          </svg>

          {/* X-axis time labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              paddingRight: 0,
            }}
          >
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <div
                key={m}
                style={{
                  fontSize: 9,
                  color: "rgba(148,163,184,0.7)",
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
        {CHART_PATHS.map((chart) => {
          const legendOpacity = interpolate(
            frame,
            [drawStart + 60, drawStart + 80],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={chart.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                opacity: legendOpacity,
              }}
            >
              <div style={{ width: 16, height: 3, borderRadius: 2, background: chart.color }} />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "rgba(71,85,105,0.8)",
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                }}
              >
                {chart.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Floating UI Card ──────────────────────────────────────────────────────────
const FloatingCard: React.FC<{
  frame: number;
  fps: number;
  entryFrame: number;
  title: string;
  children: React.ReactNode;
  x: number;
  y: number;
  z: number;
  width: number;
  height?: number;
  rotateX?: number;
  rotateY?: number;
}> = ({ frame, fps, entryFrame, title, children, x, y, z, width, height, rotateX = 0, rotateY = 0 }) => {
  const cardSpring = spring({
    frame: Math.max(0, frame - entryFrame),
    fps,
    config: { stiffness: 90, damping: 18, mass: 1 },
  });

  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = interpolate(cardSpring, [0, 1], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle float animation
  const floatY = Math.sin(frame * 0.025 + entryFrame * 0.1) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + cardY + floatY,
        width,
        height,
        opacity: cardOpacity,
        scale: String(cardScale),
        transformOrigin: "50% 50%",
        zIndex: Math.round(z / 10),
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          padding: "20px 22px",
          boxShadow: `0px ${20 + z * 0.1}px ${40 + z * 0.2}px rgba(0,0,0,0.08), 0px 1px 0px rgba(255,255,255,0.8) inset`,
          border: "1px solid rgba(255,255,255,0.65)",
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(100,116,139,0.7)",
            fontFamily: "'Inter', 'Roboto', sans-serif",
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Mini metric widget ────────────────────────────────────────────────────────
const MetricWidget: React.FC<{
  value: string;
  label: string;
  change: string;
  color: string;
  frame: number;
}> = ({ value, label, change, color, frame }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <div
      style={{
        fontSize: 34,
        fontWeight: 700,
        fontFamily: "'Inter', 'Roboto', sans-serif",
        letterSpacing: "-0.03em",
        color: "#1e293b",
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 11, color: "rgba(100,116,139,0.7)", fontFamily: "'Inter', 'Roboto', sans-serif", fontWeight: 500 }}>
      {label}
    </div>
    <div style={{ fontSize: 11, color, fontWeight: 600, fontFamily: "'Inter', 'Roboto', sans-serif" }}>
      {change}
    </div>
  </div>
);

// ─── Mini bar chart ────────────────────────────────────────────────────────────
const MiniBarChart: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const bars = [0.4, 0.65, 0.5, 0.8, 0.6, 0.9, 0.75, 0.85, 0.7, 0.95, 0.88, 1.0];
  
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 60 }}>
      {bars.map((h, i) => {
        const barDelay = interpolate(frame, [startFrame + i * 3, startFrame + i * 3 + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h * 60 * barDelay,
              background: i === bars.length - 1
                ? "linear-gradient(180deg, #1E58F4, #A855F7)"
                : `rgba(30,88,244,${0.2 + h * 0.4})`,
              borderRadius: "3px 3px 0 0",
              alignSelf: "flex-end",
              minWidth: 0,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Main Export ───────────────────────────────────────────────────────────────
export const BlueAlphaCharts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Camera pan: slight left pan over time
  const cameraPan = interpolate(frame, [0, 659], [-20, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Chart draw: starts at frame 30 (absolute ~451), runs 90 frames
  const chartDrawStart = 30;
  const chartDrawEnd = 120;

  // Cards fly out at frame 150, settle into grid
  const gridArrangeStart = 150;

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", opacity: sceneOpacity }}>
      {/* Background: vibrant blue */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 55% 40%, #8ECAFF 0%, #1E58F4 100%)",
        }}
      />

      {/* Dot grid */}
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

      {/* Scene world with camera pan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${cameraPan}px)`,
        }}
      >

        {/* ── MAIN CHART CARD (center, zooms in) ────────────────────── */}
        <FloatingCard
          frame={frame}
          fps={fps}
          entryFrame={0}
          title="Response Curves & Saturation"
          x={interpolate(frame, [0, 150, gridArrangeStart + 30], [200, 200, 60], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
          y={interpolate(frame, [0, 150, gridArrangeStart + 30], [120, 120, 80], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
          z={30}
          width={interpolate(frame, [20, 80, gridArrangeStart + 30], [600, 740, 860], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
          rotateX={8}
          rotateY={-12}
        >
          <ResponseCurvesChart
            frame={frame}
            drawStart={chartDrawStart}
            drawEnd={chartDrawEnd}
          />
        </FloatingCard>

        {/* ── OVERVIEW CARD (top right) ─────────────────────────────── */}
        <FloatingCard
          frame={frame}
          fps={fps}
          entryFrame={gridArrangeStart}
          title="Overview"
          x={1000}
          y={72}
          z={10}
          width={380}
          height={220}
          rotateX={6}
          rotateY={10}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <MetricWidget value="$6.5M" label="Total Revenue" change="↑ +132% YoY" color="#10B981" frame={frame} />
            <MetricWidget value="$34" label="Blended CAC" change="↓ −58% Efficiency" color="#10B981" frame={frame} />
          </div>
        </FloatingCard>

        {/* ── CHANNEL PERFORMANCE CARD (mid right) ─────────────────── */}
        <FloatingCard
          frame={frame}
          fps={fps}
          entryFrame={gridArrangeStart + 15}
          title="Channel Performance"
          x={1000}
          y={330}
          z={20}
          width={380}
          height={240}
          rotateX={4}
          rotateY={10}
        >
          <MiniBarChart frame={frame} startFrame={gridArrangeStart + 20} />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Search", color: "#3B82F6" },
              { label: "Social", color: "#8B5CF6" },
              { label: "Email", color: "#10B981" },
              { label: "Organic", color: "#F59E0B" },
            ].map((ch) => (
              <div
                key={ch.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 2, background: ch.color }} />
                <div style={{ fontSize: 10, color: "rgba(71,85,105,0.7)", fontFamily: "Inter, sans-serif" }}>
                  {ch.label}
                </div>
              </div>
            ))}
          </div>
        </FloatingCard>

        {/* ── ATTRIBUTION CARD (bottom right) ────────────────────────── */}
        <FloatingCard
          frame={frame}
          fps={fps}
          entryFrame={gridArrangeStart + 30}
          title="Attribution Model"
          x={1000}
          y={618}
          z={5}
          width={380}
          height={200}
          rotateX={-2}
          rotateY={8}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Data-driven (ML)", pct: 94, color: "#1E58F4" },
              { label: "Last-click (Legacy)", pct: 43, color: "#94A3B8" },
              { label: "Linear (Baseline)", pct: 61, color: "#94A3B8" },
            ].map((model, i) => {
              const barProgress = interpolate(frame, [gridArrangeStart + 35 + i * 8, gridArrangeStart + 70 + i * 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              });
              return (
                <div key={model.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 90, fontSize: 10, color: "rgba(71,85,105,0.8)", fontFamily: "Inter, sans-serif", flexShrink: 0, fontWeight: 500 }}>
                    {model.label}
                  </div>
                  <div style={{ flex: 1, height: 6, background: "rgba(226,232,240,0.6)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${model.pct * barProgress}%`, height: "100%", background: model.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 28, fontSize: 10, fontWeight: 700, color: model.color, fontFamily: "Inter, sans-serif", textAlign: "right" }}>
                    {Math.round(model.pct * barProgress)}%
                  </div>
                </div>
              );
            })}
          </div>
        </FloatingCard>

        {/* ── BOTTOM LABEL ──────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            opacity: interpolate(frame, [gridArrangeStart + 60, gridArrangeStart + 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            transform: `translateY(${interpolate(frame, [gridArrangeStart + 60, gridArrangeStart + 90], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              fontFamily: "'Inter', 'Roboto', sans-serif",
              letterSpacing: "-0.04em",
              color: "white",
              lineHeight: 1,
              textShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            BlueAlpha
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Inter', 'Roboto', sans-serif",
              marginTop: 8,
            }}
          >
            Marketing Intelligence Platform
          </div>
        </div>

        {/* ── CTA Pill (bottom right) ─────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            opacity: interpolate(frame, [gridArrangeStart + 80, gridArrangeStart + 110], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [gridArrangeStart + 80, gridArrangeStart + 110], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 50,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 700,
              color: "#1E58F4",
              fontFamily: "'Inter', 'Roboto', sans-serif",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 30px rgba(30,88,244,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Start Free Trial
            <span
              style={{
                background: "linear-gradient(135deg, #1E58F4, #A855F7)",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 13,
              }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
