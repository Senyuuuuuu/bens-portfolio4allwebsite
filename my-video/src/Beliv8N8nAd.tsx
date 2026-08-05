import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

/* ═══════════════════════════════════════════════════════════════════════════
   BELIV8 STYLE GREEN NEON n8n AD — 25s / 1500 Frames @ 60 FPS
   ═══════════════════════════════════════════════════════════════════════════ */

const COINS = [
  { name: "Sheets", icon: "📊" },
  { name: "Gmail", icon: "📧" },
  { name: "Slack", icon: "💬" },
  { name: "Hooks", icon: "🔗" },
];

const TAGS = ["Extract", "Clean", "Route", "Sync"];

const NODES = [
  { label: "Trigger", icon: "⚡", color: "#22c55e" },
  { label: "Parse CSV", icon: "📄", color: "#06b6d4" },
  { label: "AI Process", icon: "🧠", color: "#a855f7" },
  { label: "DB Write", icon: "💾", color: "#f59e0b" },
];

// Clamp helper
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export const Beliv8N8nAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── helpers ──────────────────────────────────────────────────────────────
  const sp = (delay: number, stiff = 120, damp = 14) =>
    spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: stiff, damping: damp } });

  const lerp = (
    f0: number, f1: number, v0: number, v1: number, ease?: (t: number) => number,
  ) =>
    interpolate(frame, [f0, f1], [v0, v1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      ...(ease ? { easing: ease } : {}),
    });

  const life = (speed: number, amp: number, offset = 0) =>
    Math.sin((frame + offset) * speed) * amp;

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 1  — Floating Data Orbit & Kinetic Hook  (0–300)
  // ═══════════════════════════════════════════════════════════════════════
  const s1Vis = lerp(0, 8, 0, 1) * lerp(270, 300, 1, 0);
  const s1Zoom = lerp(275, 300, 1, 18, Easing.in(Easing.exp));

  // kinetic text
  let s1Text = "Your Data";
  let s1TextKey = 0;
  if (frame >= 120) { s1Text = "Automatically.\nZero Manual Entry."; s1TextKey = 120; }
  else if (frame >= 60) { s1Text = "Data flows in"; s1TextKey = 60; }
  const s1TextSp = sp(s1TextKey, 280, 22);
  const s1FontSize = frame < 60 ? 72 : frame < 120 ? 64 : 48;

  // coin positions (spread)
  const coinSlots = [
    { x: -360, y: -130 },
    { x: 350, y: -140 },
    { x: -330, y: 150 },
    { x: 370, y: 130 },
  ];

  // coin fly-in progress toward center
  const coinFly = lerp(60, 120, 0, 1, Easing.inOut(Easing.quad));
  const coinFade = lerp(115, 145, 1, 0);

  // AI Core pill (frame 200+)
  const aiCoreSp = sp(200, 160, 14);
  const shockScale = lerp(200, 245, 0.2, 8);
  const shockOp = lerp(200, 245, 0.7, 0);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 2  — Structured Data Dial & Text Tags  (300–600)
  // ═══════════════════════════════════════════════════════════════════════
  const s2Vis = lerp(298, 315, 0, 1) * lerp(570, 600, 1, 0);
  const s2Scale = lerp(300, 340, 0.05, 1, Easing.out(Easing.exp));
  const s2ExitRot = lerp(570, 600, 0, 35, Easing.in(Easing.quad));

  // active dial tag (cycles every 60 frames starting at 340)
  const dialActive = clamp(Math.floor((frame - 340) / 60), 0, 3);
  const s2HeadSp = sp(350, 180, 18);
  const s2SubSp = sp(375, 160, 20);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 3  — Glassmorphic Dashboard Tilt  (600–1020)
  // ═══════════════════════════════════════════════════════════════════════
  const s3Vis = lerp(598, 618, 0, 1) * lerp(990, 1020, 1, 0);
  const s3TiltX = frame < 990
    ? interpolate(sp(600, 80, 20), [0, 1], [35, 15])
    : lerp(990, 1020, 15, 0);
  const s3DashSp = sp(620, 120, 16);
  const s3TextSp = sp(660, 200, 20);

  // wire drawing progress
  const w1 = lerp(690, 725, 0, 1);
  const w2 = lerp(720, 755, 0, 1);
  const w3 = lerp(750, 785, 0, 1);

  // packet position (cycling)
  const pkt = (start: number) => {
    if (frame < start) return -1;
    const cyc = (frame - start) % 90;
    return interpolate(cyc, [0, 72], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const p1 = pkt(700);
  const p2 = pkt(730);
  const p3 = pkt(760);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 4  — 3D Toggle Switch  (1020–1260)
  // ═══════════════════════════════════════════════════════════════════════
  const s4Vis = lerp(1018, 1038, 0, 1) * lerp(1230, 1260, 1, 0);
  const s4Scale = interpolate(sp(1020, 140, 16), [0, 1], [0.6, 1]);
  const s4ExitScale = lerp(1230, 1260, 1, 0.02, Easing.in(Easing.quad));

  // toggle
  const toggled = frame >= 1140;
  const toggleSp = sp(1140, 180, 14);
  const knobX = interpolate(toggleSp, [0, 1], [6, 250]);
  const toggleR = Math.round(interpolate(toggleSp, [0, 1], [75, 34]));
  const toggleG = Math.round(interpolate(toggleSp, [0, 1], [85, 197]));
  const toggleB = Math.round(interpolate(toggleSp, [0, 1], [99, 94]));
  const toggleGlow = toggled ? interpolate(toggleSp, [0, 1], [0, 40]) : 0;
  const checkSp = sp(1150, 350, 14);
  const pulseSc = lerp(1140, 1170, 0.5, 6);
  const pulseOp = lerp(1140, 1170, 0.6, 0);

  const s4TextSp = sp(1080, 200, 18);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 5  — Outro Singularity & Fiverr CTA  (1260–1500)
  // ═══════════════════════════════════════════════════════════════════════
  const s5Vis = lerp(1258, 1280, 0, 1);
  const starSc = lerp(1260, 1320, 0.1, 1, Easing.out(Easing.exp));
  const starFade = lerp(1340, 1380, 1, 0);
  const starGlow = lerp(1260, 1320, 0, 60);
  const headSp = sp(1330, 180, 18);
  const subSp = sp(1350, 160, 20);
  const ctaSp = sp(1380, 180, 16);
  const orbX = Math.cos(frame / 15) * 180;
  const orbY = life(1 / 15, 12);

  // ═══════════════════════════════════════════════════════════════════════
  //  R E N D E R
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 60%, #011713 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── GLOBAL BOKEH ── */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const bx = [300, 1600, 960, 200, 1700, 960][i];
        const by = [200, 300, 800, 700, 750, 150][i];
        const sz = [180, 220, 160, 140, 200, 260][i];
        const sp2 = [0.025, 0.03, 0.02, 0.035, 0.028, 0.018][i];
        const ph = i * 1.2;
        const op = [0.04, 0.035, 0.05, 0.03, 0.045, 0.03][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: bx + Math.sin((frame * sp2 + ph) * 1.2) * 60 - sz / 2,
              top: by + Math.cos((frame * sp2 + ph) * 0.8) * 40 - sz / 2,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(34,197,94,${op}) 0%, transparent 70%)`,
              transform: `scale(${1 + Math.sin((frame * sp2 + ph) * 0.6) * 0.2})`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 1: Floating Data Orbit & Kinetic Hook  (0–300)
          ════════════════════════════════════════════════════════════════════ */}
      {frame < 310 && (
        <AbsoluteFill
          style={{
            opacity: s1Vis,
            transform: `scale(${s1Zoom})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1200,
          }}
        >
          {/* 3D App Coins */}
          {COINS.map((coin, i) => {
            const entrySp = sp(20 + i * 18, 120, 14);
            const cx = interpolate(coinFly, [0, 1], [coinSlots[i].x, 0]);
            const cy = interpolate(coinFly, [0, 1], [coinSlots[i].y, 0]);
            return (
              <div
                key={coin.name}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${cx + life(0.035, 10, i * 70)}px)`,
                  top: `calc(50% + ${cy + life(0.04, 14, i * 50)}px)`,
                  transform: `translate(-50%,-50%) scale(${interpolate(entrySp, [0, 1], [0.3, 1])}) rotateY(20deg) rotate(${life(0.03, 5, i * 30)}deg)`,
                  transformStyle: "preserve-3d",
                  opacity: interpolate(entrySp, [0, 1], [0, 1]) * coinFade,
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 24,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <span style={{ fontSize: 32 }}>{coin.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#a7f3d0", letterSpacing: 0.5 }}>
                    {coin.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Kinetic Typography */}
          <div style={{ overflow: "hidden", padding: "10px 0", zIndex: 10 }}>
            <h1
              style={{
                fontSize: s1FontSize,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -2,
                margin: 0,
                textAlign: "center",
                whiteSpace: "pre-line",
                transform: `translateY(${interpolate(s1TextSp, [0, 1], [110, 0])}px) scale(${interpolate(s1TextSp, [0, 1], [0.85, 1])})`,
                opacity: interpolate(s1TextSp, [0, 1], [0, 1]),
                textShadow: "0 0 40px rgba(34,197,94,0.3)",
              }}
            >
              {s1Text}
            </h1>
          </div>

          {/* AI Core Pill */}
          {frame >= 195 && (
            <div
              style={{
                position: "absolute",
                bottom: 280,
                left: "50%",
                transform: `translateX(-50%) translateY(${interpolate(aiCoreSp, [0, 1], [200, 0]) + life(0.06, 6)}px) scale(${interpolate(aiCoreSp, [0, 1], [0.5, 1])})`,
                opacity: interpolate(aiCoreSp, [0, 1], [0, 1]),
                zIndex: 15,
              }}
            >
              <div
                style={{
                  padding: "16px 40px",
                  borderRadius: 999,
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 800,
                  boxShadow: "0 0 30px rgba(34,197,94,0.6), 0 0 60px rgba(34,197,94,0.3), 0 8px 30px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                🧠 AI Core Active
              </div>
            </div>
          )}

          {/* Shockwave */}
          {frame >= 200 && frame < 250 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%,-50%) scale(${shockScale})`,
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid rgba(34,197,94,0.6)",
                opacity: shockOp,
                pointerEvents: "none",
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 2: Structured Data Dial & Text Tags  (300–600)
          ════════════════════════════════════════════════════════════════════ */}
      {frame >= 295 && frame < 610 && (
        <AbsoluteFill
          style={{
            opacity: s2Vis,
            transform: `scale(${s2Scale}) rotateX(${s2ExitRot}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1000,
          }}
        >
          {/* LEFT: Dial */}
          <div
            style={{
              width: 260,
              height: 380,
              borderRadius: 30,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(34,197,94,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginRight: 100,
            }}
          >
            {TAGS.map((tag, i) => {
              const isActive = i === dialActive && frame >= 340 && frame < 570;
              const tagSp = sp(340 + i * 15, 200, 18);
              return (
                <div
                  key={tag}
                  style={{
                    padding: "14px 36px",
                    borderRadius: 999,
                    backgroundColor: isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${isActive ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
                    color: isActive ? "#22c55e" : "#a7f3d0",
                    fontSize: 22,
                    fontWeight: 700,
                    transform: `scale(${interpolate(tagSp, [0, 1], [0.6, isActive ? 1.1 : 1])})`,
                    opacity: interpolate(tagSp, [0, 1], [0, 1]),
                    boxShadow: isActive
                      ? "0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.2)"
                      : "none",
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Text */}
          <div style={{ maxWidth: 600 }}>
            <div style={{ overflow: "hidden", padding: "6px 0" }}>
              <h2
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: -2.5,
                  margin: 0,
                  lineHeight: 1.1,
                  transform: `translateX(${interpolate(s2HeadSp, [0, 1], [200, 0])}px)`,
                  opacity: interpolate(s2HeadSp, [0, 1], [0, 1]),
                  textShadow: "0 0 30px rgba(34,197,94,0.2)",
                }}
              >
                Instantly Structured.
              </h2>
            </div>
            <div style={{ overflow: "hidden", padding: "4px 0", marginTop: 24 }}>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#a7f3d0",
                  margin: 0,
                  lineHeight: 1.5,
                  transform: `translateX(${interpolate(s2SubSp, [0, 1], [160, 0])}px)`,
                  opacity: interpolate(s2SubSp, [0, 1], [0, 1]),
                }}
              >
                So every Lead, Invoice, and CRM{"\n"}entry is instantly updated.
              </p>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 3: Glassmorphic n8n Dashboard  (600–1020)
          ════════════════════════════════════════════════════════════════════ */}
      {frame >= 595 && frame < 1030 && (
        <AbsoluteFill
          style={{
            opacity: s3Vis,
            transform: `rotateX(${s3TiltX}deg) rotateY(-10deg) scale(${interpolate(s3DashSp, [0, 1], [0.7, 1])})`,
            transformStyle: "preserve-3d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1200,
          }}
        >
          {/* Top-Left Overlay */}
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 100,
              zIndex: 20,
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: -1.5,
                margin: 0,
                transform: `translateY(${interpolate(s3TextSp, [0, 1], [80, 0])}px)`,
                opacity: interpolate(s3TextSp, [0, 1], [0, 1]),
                textShadow: "0 0 30px rgba(34,197,94,0.3)",
              }}
            >
              Tailored to your business.
            </h2>
          </div>

          {/* Dashboard Card */}
          <div
            style={{
              width: 1400,
              height: 600,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.95)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.3)",
              transform: `translateY(${life(0.03, 5)}px)`,
              opacity: interpolate(s3DashSp, [0, 1], [0, 1]),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                margin: 12,
                borderRadius: 16,
                backgroundColor: "#022c22",
                height: "calc(100% - 24px)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* SVG Wires & Packets */}
              <svg width="1200" height="400" viewBox="0 0 1200 400" style={{ position: "absolute" }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Wires */}
                <line x1={180} y1={200} x2={380} y2={200} stroke="rgba(34,197,94,0.4)" strokeWidth={3} strokeDasharray={200} strokeDashoffset={200 * (1 - w1)} strokeLinecap="round" />
                <line x1={500} y1={200} x2={700} y2={200} stroke="rgba(6,182,212,0.4)" strokeWidth={3} strokeDasharray={200} strokeDashoffset={200 * (1 - w2)} strokeLinecap="round" />
                <line x1={820} y1={200} x2={1020} y2={200} stroke="rgba(168,85,247,0.4)" strokeWidth={3} strokeDasharray={200} strokeDashoffset={200 * (1 - w3)} strokeLinecap="round" />
                {/* Packets */}
                {p1 >= 0 && p1 < 1 && <circle cx={180 + p1 * 200} cy={200} r={6} fill="#22c55e" filter="url(#glow)" />}
                {p2 >= 0 && p2 < 1 && <circle cx={500 + p2 * 200} cy={200} r={6} fill="#06b6d4" filter="url(#glow)" />}
                {p3 >= 0 && p3 < 1 && <circle cx={820 + p3 * 200} cy={200} r={6} fill="#a855f7" filter="url(#glow)" />}
              </svg>

              {/* Workflow Nodes */}
              {NODES.map((nd, i) => {
                const nSp = sp(660 + i * 25, 300, 24);
                const nLife = life(0.05, 4, i * 80);
                return (
                  <div
                    key={nd.label}
                    style={{
                      position: "absolute",
                      left: 60 + i * 320,
                      top: "50%",
                      transform: `translateY(calc(-50% + ${interpolate(nSp, [0, 1], [40, 0]) + nLife}px)) scale(${interpolate(nSp, [0, 1], [0.5, 1])})`,
                      opacity: interpolate(nSp, [0, 1], [0, 1]),
                    }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 20,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: `2px solid ${nd.color}40`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: `0 0 20px ${nd.color}20, 0 8px 24px rgba(0,0,0,0.3)`,
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{nd.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: nd.color }}>{nd.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 4: 3D Toggle Switch  (1020–1260)
          ════════════════════════════════════════════════════════════════════ */}
      {frame >= 1015 && frame < 1270 && (
        <AbsoluteFill
          style={{
            opacity: s4Vis,
            transform: `scale(${s4Scale * s4ExitScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1000,
          }}
        >
          {/* Typography */}
          <div style={{ overflow: "hidden", marginBottom: 60 }}>
            <h2
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -2,
                margin: 0,
                textAlign: "center",
                transform: `translateY(${interpolate(s4TextSp, [0, 1], [100, 0])}px)`,
                opacity: interpolate(s4TextSp, [0, 1], [0, 1]),
                textShadow: "0 0 30px rgba(34,197,94,0.25)",
              }}
            >
              Execution is just one workflow away.
            </h2>
          </div>

          {/* Toggle */}
          <div
            style={{
              position: "relative",
              transform: `translateY(${life(0.04, 4)}px) rotateX(${life(0.03, 1.5)}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                width: 400,
                height: 80,
                borderRadius: 40,
                backgroundColor: `rgb(${toggleR},${toggleG},${toggleB})`,
                position: "relative",
                boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 ${toggleGlow}px rgba(34,197,94,0.5), inset 0 2px 4px rgba(0,0,0,0.2)`,
              }}
            >
              {/* Knob */}
              <div
                style={{
                  position: "absolute",
                  left: knobX,
                  top: 6,
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              />
              {/* Label */}
              <span
                style={{
                  position: "absolute",
                  width: "100%",
                  textAlign: "center",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: toggled ? "#fff" : "rgba(255,255,255,0.7)",
                  pointerEvents: "none",
                }}
              >
                {toggled ? "⚡ 100% Automated" : "🔴 Manual Entry"}
              </span>
            </div>

            {/* Pulse Ring */}
            {toggled && frame < 1175 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%,-50%) scale(${pulseSc})`,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: "2px solid rgba(34,197,94,0.5)",
                  opacity: pulseOp,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Checkmark */}
            {toggled && (
              <div
                style={{
                  position: "absolute",
                  right: -80,
                  top: "50%",
                  transform: `translateY(calc(-50% + ${life(0.08, 3)}px)) scale(${interpolate(checkSp, [0, 1], [0, 1.2])})`,
                  opacity: interpolate(checkSp, [0, 1], [0, 1]),
                  fontSize: 48,
                  color: "#22c55e",
                  textShadow: "0 0 20px rgba(34,197,94,0.6)",
                }}
              >
                ✓
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 5: Outro Singularity & Fiverr CTA  (1260–1500)
          ════════════════════════════════════════════════════════════════════ */}
      {frame >= 1255 && (
        <AbsoluteFill
          style={{
            opacity: s5Vis,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Neon Star */}
          {starFade > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%,-50%) scale(${starSc + (frame >= 1320 ? life(0.1, 0.05) : 0)})`,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "radial-gradient(circle, #22c55e 0%, #064e3b 60%, transparent 100%)",
                boxShadow: `0 0 ${starGlow}px rgba(34,197,94,0.7), 0 0 ${starGlow * 2}px rgba(34,197,94,0.3)`,
                opacity: starFade,
              }}
            />
          )}

          {/* Headline */}
          <div style={{ overflow: "hidden", padding: "8px 0" }}>
            <h1
              style={{
                fontSize: 60,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -2.5,
                margin: 0,
                textAlign: "center",
                lineHeight: 1.15,
                transform: `translateY(${interpolate(headSp, [0, 1], [80, 0])}px)`,
                opacity: interpolate(headSp, [0, 1], [0, 1]),
                textShadow: "0 0 40px rgba(34,197,94,0.25)",
              }}
            >
              Custom n8n Workflows{"\n"}& Data Entry Design
            </h1>
          </div>

          {/* Subheadline */}
          <div style={{ overflow: "hidden", marginTop: 16 }}>
            <p
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: "#a7f3d0",
                margin: 0,
                textAlign: "center",
                transform: `translateY(${interpolate(subSp, [0, 1], [60, 0])}px)`,
                opacity: interpolate(subSp, [0, 1], [0, 1]),
              }}
            >
              Stop paying human hours for robot work.
            </p>
          </div>

          {/* CTA Button + Orbiting Orb */}
          <div
            style={{
              marginTop: 48,
              transform: `translateY(${interpolate(ctaSp, [0, 1], [-80, 0]) + life(0.045, 3)}px) scale(${interpolate(ctaSp, [0, 1], [0.7, 1])})`,
              opacity: interpolate(ctaSp, [0, 1], [0, 1]),
              position: "relative",
            }}
          >
            {frame >= 1380 && (
              <div
                style={{
                  position: "absolute",
                  left: `calc(50% + ${orbX}px)`,
                  top: `calc(50% + ${orbY}px)`,
                  transform: "translate(-50%,-50%)",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  boxShadow: `0 0 ${20 + life(0.12, 10)}px rgba(34,197,94,0.7)`,
                  pointerEvents: "none",
                }}
              />
            )}
            <div
              style={{
                padding: "22px 56px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                color: "#fff",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: -0.5,
                boxShadow: "0 0 40px rgba(34,197,94,0.5), 0 12px 40px rgba(0,0,0,0.3), 0 0 80px rgba(34,197,94,0.2)",
                textAlign: "center",
              }}
            >
              Order Your n8n Workflow on Fiverr →
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
