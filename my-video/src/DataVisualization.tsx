import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { ChartLines, CHART_PATH_DATA } from "./ChartLines";

// ─── Floating Card Component ───────────────────────────────────────────────────
const FloatingCardV2: React.FC<{
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
            fontFamily: "Inter, sans-serif",
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

// ─── Main Export: <DataVisualization/> ─────────────────────────────────────────
export const DataVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cameraPan = interpolate(frame, [0, 659], [-20, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const gridArrangeStart = 150;

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", opacity: sceneOpacity }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 55% 40%, #8ECAFF 0%, #1E58F4 100%)",
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

      {/* World with camera pan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${cameraPan}px)`,
        }}
      >
        {/* MAIN CHART CARD */}
        <FloatingCardV2
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
          width={interpolate(frame, [20, 80, gridArrangeStart + 30], [660, 780, 860], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
          rotateX={8}
          rotateY={-12}
        >
          {/* Exact ChartLines component */}
          <ChartLines currentFrame={frame} fps={fps} />

          {/* Platform Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            {CHART_PATH_DATA.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 3, borderRadius: 2, background: item.color }} />
                <div style={{ fontSize: 10, fontWeight: 500, color: "rgba(71,85,105,0.8)", fontFamily: "Inter, sans-serif" }}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </FloatingCardV2>

        {/* OVERVIEW CARD */}
        <FloatingCardV2
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
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 34, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "#1e293b" }}>$6.5M</div>
              <div style={{ fontSize: 11, color: "rgba(100,116,139,0.7)", fontFamily: "Inter, sans-serif" }}>Total Revenue</div>
              <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>↑ +132% YoY</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 34, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "#1e293b" }}>$34</div>
              <div style={{ fontSize: 11, color: "rgba(100,116,139,0.7)", fontFamily: "Inter, sans-serif" }}>Blended CAC</div>
              <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>↓ −58% Efficiency</div>
            </div>
          </div>
        </FloatingCardV2>

        {/* CHANNEL PERFORMANCE CARD */}
        <FloatingCardV2
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CHART_PATH_DATA.map((item, i) => {
              const barProgress = interpolate(frame, [gridArrangeStart + 20 + i * 5, gridArrangeStart + 50 + i * 5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              });
              const pct = [82, 65, 51, 44, 28][i];
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 80, fontSize: 10, color: "rgba(71,85,105,0.8)", fontFamily: "Inter, sans-serif", flexShrink: 0, fontWeight: 500 }}>
                    {item.name}
                  </div>
                  <div style={{ flex: 1, height: 6, background: "rgba(226,232,240,0.6)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct * barProgress}%`, height: "100%", background: item.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 28, fontSize: 10, fontWeight: 700, color: item.color, fontFamily: "Inter, sans-serif", textAlign: "right" }}>
                    {Math.round(pct * barProgress)}%
                  </div>
                </div>
              );
            })}
          </div>
        </FloatingCardV2>

        {/* ATTRIBUTION MODEL CARD */}
        <FloatingCardV2
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
        </FloatingCardV2>

        {/* BOTTOM BRAND */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            opacity: interpolate(frame, [gridArrangeStart + 60, gridArrangeStart + 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: "-0.04em", color: "white", lineHeight: 1 }}>
            BlueAlpha
          </div>
          <div style={{ fontSize: 16, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", marginTop: 8 }}>
            Marketing Intelligence Platform
          </div>
        </div>

        {/* CTA PILL */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            opacity: interpolate(frame, [gridArrangeStart + 80, gridArrangeStart + 110], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
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
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 30px rgba(30,88,244,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Start Free Trial →
          </div>
        </div>
      </div>
    </div>
  );
};
