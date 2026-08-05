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
   HIGH-CONVERTING 3-IN-1 AGENCY AD
   24s / 1440 Frames @ 60 FPS
   Services: Website Design · Data Entry Automation · n8n Workflows
   Aesthetic: Deep Obsidian Green + Neon Lime (#22c55e) glassmorphic
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: "radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 60%, #011713 100%)",
  neonGreen: "#22c55e",
  mint: "#a7f3d0",
  white: "#ffffff",
  glass: "rgba(255,255,255,0.05)",
  obsidian: "#021a12",
  cyan: "#06b6d4",
};

// ── Static Data ─────────────────────────────────────────────────────────────
const COINS = [
  { name: "Sheets", icon: "📊", x: -420, y: -160 },
  { name: "Webhooks", icon: "🔗", x: 420, y: -140 },
  { name: "Figma", icon: "🎨", x: -400, y: 170 },
  { name: "Webflow", icon: "🌐", x: 400, y: 150 },
];

const DATA_TAGS = [
  { label: "Raw CSV", color: "#94a3b8" },
  { label: "AI Parse", color: "#06b6d4" },
  { label: "Instant Sync", color: "#22c55e" },
];

const WF_NODES = [
  { label: "Stripe Trigger", icon: "⚡", color: "#22c55e", x: 60 },
  { label: "AI Router", icon: "🧠", color: "#a855f7", x: 380 },
  { label: "Slack + CRM", icon: "💬", color: "#06b6d4", x: 700 },
];

const SERVICE_ICONS = [
  { icon: "🗄️", label: "Data", color: "#22c55e" },
  { icon: "⚙️", label: "Workflow", color: "#a855f7" },
  { icon: "🌐", label: "Web", color: "#06b6d4" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export const HighConvertingSalesAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring factory — delay in frames
  const sp = (delay: number, stiff = 120, damp = 14) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { stiffness: stiff, damping: damp },
    });

  // Clamped interpolate shortcut
  const lerp = (
    f0: number,
    f1: number,
    v0: number,
    v1: number,
    ease?: (t: number) => number
  ) =>
    interpolate(frame, [f0, f1], [v0, v1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      ...(ease ? { easing: ease } : {}),
    });

  // Sinusoidal life
  const life = (speed: number, amp: number, offset = 0) =>
    Math.sin((frame + offset) * speed) * amp;

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 1 — Multi-Service Hook  (0–300)
  // ═══════════════════════════════════════════════════════════════════════
  const s1Vis = lerp(0, 10, 0, 1) * lerp(280, 300, 1, 0);

  // Coins fly in from slots, float, then hold
  const coinEntrySp = (i: number) => sp(i * 15, 110, 14);
  const coinFloat = (i: number) => life(0.035, 10, i * 80);

  // Kinetic text stagger
  const head1Sp = sp(0, 280, 22);
  const head2Sp = sp(70, 240, 20);
  const head3Sp = sp(140, 200, 18);

  const head1Y = interpolate(head1Sp, [0, 1], [80, 0]);
  const head1Op = interpolate(head1Sp, [0, 1], [0, 1]);
  const head2Y = interpolate(head2Sp, [0, 1], [60, 0]);
  const head2Op = interpolate(head2Sp, [0, 1], [0, 1]);
  const head3Y = interpolate(head3Sp, [0, 1], [60, 0]);
  const head3Op = interpolate(head3Sp, [0, 1], [0, 1]);

  // Pill CTA button (appears at frame 230)
  const pillSp = sp(230, 180, 16);
  const pillY = interpolate(pillSp, [0, 1], [120, 0]);
  const pillOp = interpolate(pillSp, [0, 1], [0, 1]);

  // Pulse ring (wipe into scene 2)
  const pulseS1Scale = lerp(265, 300, 0.5, 40);
  const pulseS1Op = lerp(265, 300, 0.8, 0);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 2 — Automated Data Entry  (300–600)
  // ═══════════════════════════════════════════════════════════════════════
  const s2Vis = lerp(298, 318, 0, 1) * lerp(578, 600, 1, 0);
  const s2Scale = lerp(300, 345, 0.05, 1, Easing.out(Easing.exp));

  // Carousel tag cycling — one tag per ~80 frames starting at 340
  const carouselActive = clamp(Math.floor((frame - 340) / 80), 0, 2);

  const s2HeadSp = sp(320, 180, 18);
  const s2HeadX = interpolate(s2HeadSp, [0, 1], [220, 0]);

  const bullet1Sp = sp(360, 160, 20);
  const bullet2Sp = sp(390, 160, 20);
  const bullet3Sp = sp(420, 160, 20);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 3 — Custom n8n Workflows  (600–900)
  // ═══════════════════════════════════════════════════════════════════════
  const s3Vis = lerp(598, 618, 0, 1) * lerp(878, 900, 1, 0);

  // Camera tilt: steep → flat over 60 frames
  const s3TiltX = frame < 878
    ? interpolate(sp(600, 80, 20), [0, 1], [30, 12])
    : lerp(878, 900, 12, 0);

  const s3DashSp = sp(620, 120, 16);
  const s3HeadSp = sp(650, 200, 20);

  // Wire drawing progress
  const w1 = lerp(680, 720, 0, 1);
  const w2 = lerp(715, 755, 0, 1);

  // Packet cycling along wires
  const pkt = (start: number): number => {
    if (frame < start) return -1;
    const cyc = (frame - start) % 90;
    return interpolate(cyc, [0, 75], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const p1 = pkt(700);
  const p2 = pkt(730);

  const s3SubSp = sp(680, 160, 20);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 4 — High-Converting Web Design  (900–1140)
  // ═══════════════════════════════════════════════════════════════════════
  const s4Vis = lerp(898, 918, 0, 1) * lerp(1118, 1140, 1, 0);
  const s4Scale = lerp(900, 950, 0.05, 1, Easing.out(Easing.exp));

  const s4HeadSp = sp(920, 180, 18);
  const s4HeadX = interpolate(s4HeadSp, [0, 1], [200, 0]);
  const s4SubSp = sp(945, 160, 20);

  // Mockup browser float
  const mockFloat = life(0.03, 6);
  const mockSp = sp(910, 120, 16);

  // 4-point SVG star shimmer position (sweeps across CTA button)
  const shimmerX = lerp(950, 1100, -200, 900);
  const shimmerOp = lerp(950, 960, 0, 1) * lerp(1090, 1110, 1, 0);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE 5 — Final Value Singularity & Fiverr CTA  (1140–1440)
  // ═══════════════════════════════════════════════════════════════════════
  const s5Vis = lerp(1138, 1160, 0, 1);

  // Icons converge to center
  const converge = lerp(1140, 1220, 0, 1, Easing.inOut(Easing.quad));

  // Star expand
  const starScale = lerp(1215, 1265, 0.2, 1, Easing.out(Easing.exp));
  const starGlow = lerp(1215, 1265, 0, 70);
  const starFade = lerp(1265, 1295, 1, 0);

  // Final sales card
  const cardSp = sp(1280, 140, 16);
  const cardY = interpolate(cardSp, [0, 1], [60, 0]);
  const cardOp = interpolate(cardSp, [0, 1], [0, 1]);

  const titleSp = sp(1295, 200, 18);
  const titleY = interpolate(titleSp, [0, 1], [80, 0]);

  const subSp2 = sp(1315, 180, 20);
  const subY2 = interpolate(subSp2, [0, 1], [60, 0]);

  const ctaSp = sp(1340, 180, 16);
  const ctaY = interpolate(ctaSp, [0, 1], [-70, 0]);
  const ctaScale = interpolate(ctaSp, [0, 1], [0.7, 1]);

  const trustSp = sp(1365, 160, 20);
  const trustOp = interpolate(trustSp, [0, 1], [0, 1]);

  // Orbiting AI orb around CTA
  const orbX = Math.cos(frame / 20) * 200;
  const orbY = life(1 / 20, 12);
  const orbGlow = 20 + life(0.12, 10);

  // ═══════════════════════════════════════════════════════════════════════
  //  R E N D E R
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── GLOBAL VOLUMETRIC BOKEH ── */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const bx = [280, 1640, 960, 180, 1720, 960][i];
        const by = [180, 280, 820, 720, 780, 120][i];
        const sz = [200, 240, 180, 160, 220, 280][i];
        const spd = [0.025, 0.03, 0.02, 0.035, 0.028, 0.018][i];
        const ph = i * 1.3;
        const op = [0.045, 0.04, 0.055, 0.035, 0.05, 0.035][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: bx + Math.sin((frame * spd + ph) * 1.2) * 70 - sz / 2,
              top: by + Math.cos((frame * spd + ph) * 0.8) * 45 - sz / 2,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(34,197,94,${op}) 0%, transparent 70%)`,
              transform: `scale(${1 + Math.sin((frame * spd + ph) * 0.6) * 0.2})`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ════════════════════════════════════════════════════════════════
          SCENE 1: Multi-Service Hook  (Frames 0–300)
          ════════════════════════════════════════════════════════════════ */}
      {frame < 310 && (
        <AbsoluteFill
          style={{
            opacity: s1Vis,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1200,
          }}
        >
          {/* 3D Floating App Coins */}
          {COINS.map((coin, i) => {
            const entrySp = coinEntrySp(i);
            const floatY = coinFloat(i);
            return (
              <div
                key={coin.name}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${coin.x + life(0.03, 8, i * 60)}px)`,
                  top: `calc(50% + ${coin.y + floatY}px)`,
                  transform: `translate(-50%,-50%) scale(${interpolate(
                    entrySp,
                    [0, 1],
                    [0.2, 1]
                  )}) rotateY(${life(0.025, 8, i * 40)}deg) rotateX(${life(
                    0.02,
                    5,
                    i * 55
                  )}deg)`,
                  transformStyle: "preserve-3d",
                  opacity: interpolate(entrySp, [0, 1], [0, 1]),
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 28,
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(34,197,94,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 20px rgba(34,197,94,0.1)",
                  }}
                >
                  <span style={{ fontSize: 36 }}>{coin.icon}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.mint,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {coin.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Kinetic Typography Stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              zIndex: 10,
              textAlign: "center",
            }}
          >
            {/* Line 1: 0–70 frames */}
            <div style={{ overflow: "hidden", padding: "8px 0" }}>
              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 600,
                  color: C.white,
                  letterSpacing: -2.5,
                  margin: 0,
                  lineHeight: 1.1,
                  transform: `translateY(${head1Y}px)`,
                  opacity: head1Op,
                  textShadow: "0 0 50px rgba(34,197,94,0.25)",
                }}
              >
                Scale Your Business.
              </h1>
            </div>

            {/* Line 2: 70–140 frames */}
            {frame >= 68 && (
              <div style={{ overflow: "hidden", padding: "4px 0" }}>
                <p
                  style={{
                    fontSize: 40,
                    fontWeight: 400,
                    color: C.mint,
                    margin: 0,
                    transform: `translateY(${head2Y}px)`,
                    opacity: head2Op,
                  }}
                >
                  Without Hiring More Staff.
                </p>
              </div>
            )}

            {/* Line 3: 140–300 frames */}
            {frame >= 138 && (
              <div
                style={{
                  overflow: "hidden",
                  padding: "4px 0",
                  maxWidth: 900,
                }}
              >
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 400,
                    color: "rgba(167,243,208,0.85)",
                    margin: 0,
                    transform: `translateY(${head3Y}px)`,
                    opacity: head3Op,
                    lineHeight: 1.5,
                  }}
                >
                  Manual Data Entry & Messy Systems Are Costing You Time.
                </p>
              </div>
            )}
          </div>

          {/* Emerald Pill CTA (appears at frame ~230) */}
          {frame >= 228 && (
            <div
              style={{
                position: "absolute",
                bottom: 220,
                left: "50%",
                transform: `translateX(-50%) translateY(${pillY}px)`,
                opacity: pillOp,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  padding: "18px 48px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                  color: C.white,
                  fontSize: 22,
                  fontWeight: 800,
                  boxShadow:
                    "0 0 40px rgba(34,197,94,0.65), 0 0 80px rgba(34,197,94,0.25), 0 8px 30px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  letterSpacing: -0.3,
                }}
              >
                ⚡ Automate Now
              </div>
            </div>
          )}

          {/* Pulse wipe ring */}
          {frame >= 263 && frame < 305 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 220 + 26,
                transform: `translate(-50%, 50%) scale(${pulseS1Scale})`,
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "2px solid rgba(34,197,94,0.7)",
                opacity: pulseS1Op,
                pointerEvents: "none",
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCENE 2: Automated Data Entry  (Frames 300–600)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 295 && frame < 610 && (
        <AbsoluteFill
          style={{
            opacity: s2Vis,
            transform: `scale(${s2Scale})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* LEFT: Vertical Carousel Tags */}
          <div
            style={{
              width: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              marginRight: 120,
            }}
          >
            {/* Carousel label */}
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(167,243,208,0.5)",
                letterSpacing: 2,
                textTransform: "uppercase",
                margin: "0 0 8px 0",
              }}
            >
              Data Pipeline
            </p>
            {DATA_TAGS.map((tag, i) => {
              const tagSp = sp(320 + i * 30, 180, 18);
              const isActive =
                i === carouselActive && frame >= 340 && frame < 575;
              return (
                <div
                  key={tag.label}
                  style={{
                    padding: "16px 40px",
                    borderRadius: 999,
                    backgroundColor: isActive
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(255,255,255,0.04)",
                    border: `2px solid ${
                      isActive ? C.neonGreen : "rgba(255,255,255,0.1)"
                    }`,
                    color: isActive ? C.neonGreen : C.mint,
                    fontSize: 22,
                    fontWeight: 700,
                    transform: `scale(${interpolate(
                      tagSp,
                      [0, 1],
                      [0.5, isActive ? 1.08 : 1]
                    )}) translateY(${interpolate(tagSp, [0, 1], [30, 0])}px)`,
                    opacity: interpolate(tagSp, [0, 1], [0, 1]),
                    boxShadow: isActive
                      ? `0 0 24px rgba(34,197,94,0.45), 0 0 50px rgba(34,197,94,0.18)`
                      : "none",
                    transition: "box-shadow 0.1s",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {tag.label}
                </div>
              );
            })}

            {/* Connector dots */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: -140,
                marginLeft: 148,
                position: "absolute",
              }}
            >
              {[0, 1].map((dot) => (
                <div
                  key={dot}
                  style={{
                    width: 6,
                    height: 40,
                    borderRadius: 3,
                    backgroundColor: "rgba(34,197,94,0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Text Callouts */}
          <div style={{ maxWidth: 700 }}>
            {/* Main Header */}
            <div style={{ overflow: "hidden", padding: "8px 0" }}>
              <h2
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: C.white,
                  letterSpacing: -2,
                  margin: 0,
                  lineHeight: 1.1,
                  transform: `translateX(${s2HeadX}px)`,
                  opacity: interpolate(s2HeadSp, [0, 1], [0, 1]),
                  textShadow: "0 0 30px rgba(34,197,94,0.2)",
                }}
              >
                1. Automated Data Entry
              </h2>
            </div>

            {/* Bullet 1 */}
            {frame >= 358 && (
              <div style={{ overflow: "hidden", padding: "4px 0", marginTop: 28 }}>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: C.mint,
                    margin: 0,
                    transform: `translateX(${interpolate(
                      bullet1Sp,
                      [0, 1],
                      [180, 0]
                    )}px)`,
                    opacity: interpolate(bullet1Sp, [0, 1], [0, 1]),
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      color: C.neonGreen,
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </span>
                  100% Error-Free Lead Extraction
                </p>
              </div>
            )}

            {/* Bullet 2 */}
            {frame >= 388 && (
              <div style={{ overflow: "hidden", padding: "4px 0" }}>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: C.mint,
                    margin: 0,
                    transform: `translateX(${interpolate(
                      bullet2Sp,
                      [0, 1],
                      [180, 0]
                    )}px)`,
                    opacity: interpolate(bullet2Sp, [0, 1], [0, 1]),
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      color: C.neonGreen,
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </span>
                  Real-Time Google Sheets & Database Sync
                </p>
              </div>
            )}

            {/* Bullet 3 */}
            {frame >= 418 && (
              <div style={{ overflow: "hidden", padding: "4px 0" }}>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: C.mint,
                    margin: 0,
                    transform: `translateX(${interpolate(
                      bullet3Sp,
                      [0, 1],
                      [180, 0]
                    )}px)`,
                    opacity: interpolate(bullet3Sp, [0, 1], [0, 1]),
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      color: C.neonGreen,
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </span>
                  Zero Manual Copy-Pasting
                </p>
              </div>
            )}

            {/* Service badge */}
            {frame >= 450 && (
              <div
                style={{
                  marginTop: 36,
                  opacity: interpolate(sp(450, 180, 18), [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(
                    sp(450, 180, 18),
                    [0, 1],
                    [30, 0]
                  )}px)`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 24px",
                  borderRadius: 999,
                  border: "1px solid rgba(34,197,94,0.3)",
                  backgroundColor: "rgba(34,197,94,0.08)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: C.neonGreen,
                    boxShadow: "0 0 10px rgba(34,197,94,0.8)",
                  }}
                />
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: C.neonGreen,
                  }}
                >
                  Service 1 of 3
                </span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCENE 3: Custom n8n Workflows  (Frames 600–900)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 595 && frame < 910 && (
        <AbsoluteFill
          style={{
            opacity: s3Vis,
            transform: `rotateX(${s3TiltX}deg) rotateY(-8deg) scale(${interpolate(
              s3DashSp,
              [0, 1],
              [0.7, 1]
            )})`,
            transformStyle: "preserve-3d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1400,
          }}
        >
          {/* Top Left Text Overlay */}
          <div
            style={{
              position: "absolute",
              top: 70,
              left: 90,
              zIndex: 20,
            }}
          >
            <div style={{ overflow: "hidden", padding: "6px 0" }}>
              <h2
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: C.white,
                  letterSpacing: -1.8,
                  margin: 0,
                  transform: `translateY(${interpolate(
                    s3HeadSp,
                    [0, 1],
                    [70, 0]
                  )}px)`,
                  opacity: interpolate(s3HeadSp, [0, 1], [0, 1]),
                  textShadow: "0 0 40px rgba(34,197,94,0.3)",
                }}
              >
                2. Custom n8n Workflows
              </h2>
            </div>
            <div style={{ overflow: "hidden", padding: "4px 0", marginTop: 10 }}>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 400,
                  color: C.mint,
                  margin: 0,
                  transform: `translateY(${interpolate(
                    s3SubSp,
                    [0, 1],
                    [50, 0]
                  )}px)`,
                  opacity: interpolate(s3SubSp, [0, 1], [0, 1]),
                  maxWidth: 700,
                }}
              >
                Connect 1,000+ apps with zero monthly Zapier fees.
              </p>
            </div>
          </div>

          {/* Glassmorphic n8n Workflow Canvas */}
          <div
            style={{
              width: 1400,
              height: 540,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.97)",
              boxShadow:
                "0 30px 90px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.2)",
              transform: `translateY(${60 + life(0.03, 5)}px)`,
              opacity: interpolate(s3DashSp, [0, 1], [0, 1]),
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Dark inner canvas */}
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
                overflow: "hidden",
              }}
            >
              {/* Grid dots background */}
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
              >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="#22c55e" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* SVG wires & light packets */}
              <svg
                width="1040"
                height="300"
                viewBox="0 0 1040 300"
                style={{ position: "absolute" }}
              >
                <defs>
                  <filter id="glow3">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Wire 1: Stripe → AI */}
                <line
                  x1={220}
                  y1={150}
                  x2={400}
                  y2={150}
                  stroke="rgba(34,197,94,0.5)"
                  strokeWidth={3}
                  strokeDasharray={180}
                  strokeDashoffset={180 * (1 - w1)}
                  strokeLinecap="round"
                />
                {/* Wire 2: AI → Slack+CRM */}
                <line
                  x1={540}
                  y1={150}
                  x2={720}
                  y2={150}
                  stroke="rgba(168,85,247,0.5)"
                  strokeWidth={3}
                  strokeDasharray={180}
                  strokeDashoffset={180 * (1 - w2)}
                  strokeLinecap="round"
                />
                {/* Packet 1 */}
                {p1 >= 0 && p1 < 1 && (
                  <circle
                    cx={220 + p1 * 180}
                    cy={150}
                    r={7}
                    fill={C.neonGreen}
                    filter="url(#glow3)"
                  />
                )}
                {/* Packet 2 */}
                {p2 >= 0 && p2 < 1 && (
                  <circle
                    cx={540 + p2 * 180}
                    cy={150}
                    r={7}
                    fill="#a855f7"
                    filter="url(#glow3)"
                  />
                )}
              </svg>

              {/* Workflow Node Cards */}
              {WF_NODES.map((nd, i) => {
                const nSp = sp(660 + i * 28, 280, 22);
                const nFloat = life(0.045, 4, i * 70);
                return (
                  <div
                    key={nd.label}
                    style={{
                      position: "absolute",
                      left: 100 + nd.x,
                      top: "50%",
                      transform: `translateY(calc(-50% + ${
                        interpolate(nSp, [0, 1], [40, 0]) + nFloat
                      }px)) scale(${interpolate(nSp, [0, 1], [0.4, 1])})`,
                      opacity: interpolate(nSp, [0, 1], [0, 1]),
                    }}
                  >
                    <div
                      style={{
                        width: 140,
                        height: 130,
                        borderRadius: 22,
                        backgroundColor: "rgba(255,255,255,0.07)",
                        border: `2px solid ${nd.color}50`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: `0 0 24px ${nd.color}25, 0 10px 30px rgba(0,0,0,0.35)`,
                      }}
                    >
                      <span style={{ fontSize: 36 }}>{nd.icon}</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: nd.color,
                          textAlign: "center",
                          lineHeight: 1.3,
                          padding: "0 8px",
                        }}
                      >
                        {nd.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCENE 4: High-Converting Web Design  (Frames 900–1140)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 895 && frame < 1150 && (
        <AbsoluteFill
          style={{
            opacity: s4Vis,
            transform: `scale(${s4Scale})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Left: Text Callout */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 580,
              marginRight: 80,
            }}
          >
            <div style={{ overflow: "hidden", padding: "8px 0" }}>
              <h2
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: C.white,
                  letterSpacing: -2,
                  margin: 0,
                  lineHeight: 1.15,
                  transform: `translateX(${s4HeadX}px)`,
                  opacity: interpolate(s4HeadSp, [0, 1], [0, 1]),
                  textShadow: "0 0 30px rgba(34,197,94,0.2)",
                }}
              >
                3. Modern Web Design
              </h2>
            </div>
            <div style={{ overflow: "hidden", padding: "4px 0", marginTop: 16 }}>
              <p
                style={{
                  fontSize: 30,
                  fontWeight: 400,
                  color: C.mint,
                  margin: 0,
                  lineHeight: 1.5,
                  transform: `translateX(${interpolate(
                    s4SubSp,
                    [0, 1],
                    [160, 0]
                  )}px)`,
                  opacity: interpolate(s4SubSp, [0, 1], [0, 1]),
                }}
              >
                Sleek, fast, and built directly to capture leads.
              </p>
            </div>

            {/* Feature pills */}
            {frame >= 960 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 32,
                  opacity: interpolate(sp(960, 160, 20), [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(
                    sp(960, 160, 20),
                    [0, 1],
                    [30, 0]
                  )}px)`,
                }}
              >
                {["Mobile-First", "Fast Loading", "Lead-Capture Ready"].map(
                  (feat) => (
                    <span
                      key={feat}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 999,
                        border: "1px solid rgba(34,197,94,0.3)",
                        color: C.mint,
                        fontSize: 16,
                        fontWeight: 600,
                        backgroundColor: "rgba(34,197,94,0.07)",
                      }}
                    >
                      {feat}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right: Browser Mockup */}
          <div
            style={{
              width: 700,
              height: 460,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.95)",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.3)",
              transform: `translateY(${mockFloat}px) scale(${interpolate(
                mockSp,
                [0, 1],
                [0.85, 1]
              )})`,
              opacity: interpolate(mockSp, [0, 1], [0, 1]),
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                height: 44,
                backgroundColor: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 26,
                  borderRadius: 6,
                  backgroundColor: "#e2e8f0",
                  marginLeft: 12,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 12,
                }}
              >
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  yoursite.com
                </span>
              </div>
            </div>

            {/* Website content */}
            <div
              style={{
                padding: 24,
                backgroundColor: "#0f172a",
                height: "calc(100% - 44px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Hero area */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
                  borderRadius: 14,
                  padding: 28,
                  marginBottom: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    width: "50%",
                    height: 10,
                    borderRadius: 6,
                    backgroundColor: "rgba(167,243,208,0.5)",
                    marginBottom: 20,
                  }}
                />

                {/* CTA Button inside mockup */}
                <div
                  style={{
                    display: "inline-flex",
                    padding: "10px 24px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Get Started Free →
                  </span>

                  {/* 4-Point Star shimmer */}
                  {frame >= 948 && frame < 1115 && (
                    <div
                      style={{
                        position: "absolute",
                        left: shimmerX - 580, // offset relative to button
                        top: "50%",
                        transform: "translateY(-50%)",
                        opacity: shimmerOp,
                        fontSize: 20,
                        color: "#fff",
                        textShadow:
                          "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)",
                      }}
                    >
                      ✦
                    </div>
                  )}
                </div>

                {/* Gradient orb inside mockup hero */}
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    top: -20,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)",
                  }}
                />
              </div>

              {/* Content rows */}
              {[80, 60, 70].map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: "rgba(34,197,94,0.15)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "rgba(255,255,255,0.12)",
                      width: `${w}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCENE 5: Final Value Singularity & Fiverr CTA  (Frames 1140–1440)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 1135 && (
        <AbsoluteFill
          style={{
            opacity: s5Vis,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 3 Service Icons converging to center */}
          {frame < 1270 &&
            SERVICE_ICONS.map((svc, i) => {
              const angle = (i / SERVICE_ICONS.length) * Math.PI * 2 - Math.PI / 2;
              const radius = interpolate(converge, [0, 1], [340, 0]);
              const iconX = Math.cos(angle) * radius;
              const iconY = Math.sin(angle) * radius;
              const iconOp = lerp(1255, 1270, 1, 0);

              return (
                <div
                  key={svc.label}
                  style={{
                    position: "absolute",
                    left: `calc(50% + ${iconX}px)`,
                    top: `calc(50% + ${iconY}px)`,
                    transform: "translate(-50%,-50%)",
                    opacity: iconOp,
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 999,
                      backgroundColor: `${svc.color}18`,
                      border: `2px solid ${svc.color}50`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      boxShadow: `0 0 30px ${svc.color}30`,
                    }}
                  >
                    <span style={{ fontSize: 32 }}>{svc.icon}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: svc.color,
                        letterSpacing: 0.5,
                      }}
                    >
                      {svc.label}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Merged Glowing Emerald Star */}
          {frame >= 1210 && starFade > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%,-50%) scale(${starScale})`,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #22c55e 0%, #064e3b 65%, transparent 100%)",
                boxShadow: `0 0 ${starGlow}px rgba(34,197,94,0.75), 0 0 ${
                  starGlow * 2
                }px rgba(34,197,94,0.3)`,
                opacity: starFade,
              }}
            />
          )}

          {/* Final Sales Card */}
          {frame >= 1278 && (
            <div
              style={{
                transform: `translateY(${cardY}px)`,
                opacity: cardOp,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              {/* Primary Title */}
              <div style={{ overflow: "hidden", padding: "10px 0" }}>
                <h1
                  style={{
                    fontSize: 68,
                    fontWeight: 900,
                    color: C.white,
                    letterSpacing: -2.5,
                    margin: 0,
                    textAlign: "center",
                    lineHeight: 1.1,
                    transform: `translateY(${titleY}px)`,
                    opacity: interpolate(titleSp, [0, 1], [0, 1]),
                    textShadow: "0 0 50px rgba(34,197,94,0.3)",
                  }}
                >
                  All-In-One Digital Engineering
                </h1>
              </div>

              {/* Gradient Subtitle */}
              <div style={{ overflow: "hidden", padding: "6px 0", marginTop: 6 }}>
                <p
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    margin: 0,
                    textAlign: "center",
                    transform: `translateY(${subY2}px)`,
                    opacity: interpolate(subSp2, [0, 1], [0, 1]),
                    background:
                      "linear-gradient(90deg, #22c55e 0%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: -0.5,
                  }}
                >
                  Websites • Data Entry • n8n Automation
                </p>
              </div>

              {/* Fiverr CTA Button + Orbiting Orb */}
              <div
                style={{
                  marginTop: 44,
                  position: "relative",
                  transform: `translateY(${ctaY}px) scale(${ctaScale})`,
                  opacity: interpolate(ctaSp, [0, 1], [0, 1]),
                }}
              >
                {/* Orbiting AI Orb */}
                {frame >= 1350 && (
                  <div
                    style={{
                      position: "absolute",
                      left: `calc(50% + ${orbX}px)`,
                      top: `calc(50% + ${orbY}px)`,
                      transform: "translate(-50%,-50%)",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: C.neonGreen,
                      boxShadow: `0 0 ${orbGlow}px rgba(34,197,94,0.8), 0 0 ${
                        orbGlow * 2
                      }px rgba(34,197,94,0.35)`,
                      pointerEvents: "none",
                      zIndex: 40,
                    }}
                  />
                )}

                {/* CTA Button */}
                <div
                  style={{
                    padding: "22px 60px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                    color: C.white,
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: -0.5,
                    boxShadow:
                      "0 0 45px rgba(34,197,94,0.5), 0 0 90px rgba(34,197,94,0.2), 0 14px 50px rgba(0,0,0,0.35)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Order Your Service on Fiverr →
                </div>
              </div>

              {/* Trust Badge */}
              <div
                style={{
                  marginTop: 24,
                  opacity: trustOp,
                  transform: `translateY(${interpolate(
                    trustSp,
                    [0, 1],
                    [20, 0]
                  )}px)`,
                }}
              >
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: C.mint,
                    margin: 0,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  }}
                >
                  ⚡ Fast Delivery • 100% Satisfaction Guarantee
                </p>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
