import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { AudioLayer } from "./AudioLayer";

/* ═══════════════════════════════════════════════════════════════════════════
   KINETIC MORPHING TECH AD — Extended 25-Second Edition
   Apple / Google Workspace Product-Ad Aesthetic
   1920×1080 · 60 FPS · 1500 Frames (25 Seconds)
   Zero Hard Cuts — All transitions via continuous shape-morphing & Z-pushes
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Design System ────────────────────────────────────────────────────────────
const T = {
  canvas:    "#f8f9fa",
  white:     "#ffffff",
  ink:       "#202124",
  slate:     "#5f6368",
  subtle:    "#bdc1c6",
  border:    "rgba(255,255,255,0.8)",
  blue:      "#1a73e8",
  blueTint:  "#e8f0fe",
  green:     "#137333",
  greenVivid:"#1dbf73",
  greenTint: "#e6f4ea",
  amber:     "#b06000",
  amberTint: "#fef7e0",
  shadow:    "0 4px 12px rgba(0,0,0,0.02), 0 24px 60px rgba(0,0,0,0.07)",
  rim:       "1px solid rgba(255,255,255,0.8)",
};

// ── Static Data ──────────────────────────────────────────────────────────────
const PHASE1_LABELS = ["Messy Systems?", "Slow Data Entry?", "Lost Leads?", "3 Services. 1 Complete System."];

const BG_CARDS = [
  { x: 160,  y: 180, w: 360, h: 220, r: 22, spd: 0.022, ph: 0   },
  { x: 1380, y: 220, w: 280, h: 180, r: 18, spd: 0.018, ph: 1.4 },
  { x: 760,  y: 820, w: 320, h: 190, r: 20, spd: 0.026, ph: 2.8 },
];

const WF_NODES = [
  { label: "Webhook",    sub: "Stripe Trigger",       icon: "⚡", col: "#1a73e8" },
  { label: "OpenAI",     sub: "Data Processing Agent", icon: "🤖", col: "#10a37f" },
  { label: "PostgreSQL", sub: "Database Write",         icon: "🗄️", col: "#3b82f6" },
  { label: "Slack & Email", sub: "Sync & Notify",       icon: "📬", col: "#137333" },
];

const DATA_FILES = [
  "Raw_Leads_Dump_2026.csv",
  "webhook_payload_3841.json",
  "acme_contacts_dirty.xlsx",
  "scraped_data_page1.json",
];

const DATA_ROWS_CLEAN = [
  "John Doe  |  Lead  |  Q3 2026",
  "Acme Corp  |  14 Contacts  |  $4,200",
  "Order #3841  |  Paid  |  $249.00",
  "Sarah Chen  |  Hot Lead  |  NYC",
  "TechStart Inc  |  Demo Req  |  London",
  "webhook_payload_3842  |  Synced",
  "Marcus Williams  |  Lead  |  Chicago",
  "Obi Digital  |  Invoice  |  £1,800",
];

const ORBIT_ICONS = [
  { icon: "🎨", label: "Figma",    col: "#f24e1e" },
  { icon: "📊", label: "Sheets",   col: "#34a853" },
  { icon: "💳", label: "Stripe",   col: "#635bff" },
  { icon: "🤖", label: "OpenAI",   col: "#10a37f" },
  { icon: "🌐", label: "Webflow",  col: "#146ef5" },
  { icon: "💬", label: "Slack",    col: "#4a154b" },
  { icon: "📧", label: "Gmail",    col: "#ea4335" },
  { icon: "🗂️", label: "Airtable", col: "#f82b60" },
  { icon: "🔶", label: "HubSpot",  col: "#ff7a59" },
  { icon: "📝", label: "Notion",   col: "#000000" },
];

const REVIEWS = [
  {
    text: "Exceptional Web Design & n8n Workflows! Delivered in record time.",
    stars: 5,
    author: "TechStart CEO",
    delay: 1180,
  },
  {
    text: "Automated our entire data entry pipeline in 48 hours. Absolutely elite work.",
    stars: 5,
    author: "E-Commerce Founder",
    delay: 1220,
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export const KineticMorphingAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** Spring factory */
  const sp = (delay: number, stiff = 280, damp = 22) =>
    spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: stiff, damping: damp } });

  /** Clamped lerp */
  const lerp = (f0: number, f1: number, v0: number, v1: number, ease?: (t: number) => number) =>
    interpolate(frame, [f0, f1], [v0, v1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      ...(ease ? { easing: ease } : {}),
    });

  /** Sinusoidal breathing */
  const breath = (speed = 25, amp = 6, offset = 0) =>
    Math.sin((frame + offset) * (1 / speed)) * amp;

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 1 — Problem Agitation Hook  (0–240)
  // ═══════════════════════════════════════════════════════════════════════
  const txtIdx  = frame < 50 ? 0 : frame < 100 ? 1 : frame < 150 ? 2 : 3;
  const txtKey  = [0, 50, 100, 150][txtIdx];
  const txtSp   = sp(txtKey, 420, 26);
  const txtY    = interpolate(txtSp, [0, 1], [36, 0]);
  const txtOp   = interpolate(txtSp, [0, 1], [0, 1]);
  const txtSize = txtIdx < 3 ? 88 : 64;

  // Pill morph: frame 200–240
  const morphP  = lerp(200, 242, 0, 1, Easing.inOut(Easing.quad));
  const morphW  = interpolate(morphP, [0, 1], [220, 1600]);
  const morphH  = interpolate(morphP, [0, 1], [60, 820]);
  const morphR  = interpolate(morphP, [0, 1], [30, 24]);
  const morphOp = lerp(198, 204, 0, 1);
  const p1TextOp = lerp(192, 205, 1, 0);

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 2 — Web Design  (240–540)
  // ═══════════════════════════════════════════════════════════════════════
  const p2InSp      = sp(242, 300, 24);
  const p2HeadSp    = sp(256, 320, 24);
  const p2BadgeSp   = sp(272, 300, 24);

  // Wireframe → colour: 0=wireframe, 1=full colour
  const wireToColor = lerp(260, 350, 0, 1, Easing.inOut(Easing.quad));

  // Cursor Bezier path (frames 340–440)
  const curT   = lerp(340, 440, 0, 1, Easing.inOut(Easing.quad));
  // Cubic Bézier: P0(300,280), P1(700,180), P2(900,380), P3(1100,360)
  const bx = (t: number) => Math.pow(1-t,3)*300 + 3*Math.pow(1-t,2)*t*700 + 3*(1-t)*t*t*900 + t*t*t*1100;
  const by = (t: number) => Math.pow(1-t,3)*280 + 3*Math.pow(1-t,2)*t*180 + 3*(1-t)*t*t*380 + t*t*t*360;
  const curX    = bx(curT) - 40; // card-relative
  const curY    = by(curT) - 100;

  // CTA button hover + click
  const ctaHover  = lerp(390, 415, 1, 1.05);
  const ctaClick  = lerp(410, 428, 1.05, 0.95);
  const ctaScale  = frame < 410 ? ctaHover : frame < 428 ? ctaClick : lerp(428, 440, 0.95, 1.0);
  const rippleOp  = lerp(413, 440, 0.55, 0);
  const rippleS   = lerp(413, 440, 0.8, 3.5);

  // Mobile preview slides in (frames 440–540)
  const mobSp   = sp(444, 280, 22);
  const mobX    = interpolate(mobSp, [0, 1], [260, 0]);

  // Phase 2→3 card morph: 1600×820 → 1280×680
  const m23P   = lerp(530, 548, 0, 1, Easing.inOut(Easing.quad));
  const c23W   = interpolate(m23P, [0, 1], [1600, 1280]);
  const c23H   = interpolate(m23P, [0, 1], [820, 680]);

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 3 — Data Entry  (540–840)
  // ═══════════════════════════════════════════════════════════════════════
  const p3InOp    = lerp(540, 555, 0, 1) * lerp(828, 840, 1, 0);
  const p3HeadSp  = sp(552, 320, 24);
  const p3BadgeSp = sp(568, 300, 24);

  // Row counter: 0→8 rows populate between frames 600–780
  const rowCount  = Math.floor(lerp(600, 780, 0, DATA_ROWS_CLEAN.length));
  const rowSp     = (i: number) => sp(600 + i * 22, 350, 24);

  // Live counter: $0 → $1400 saved/mo
  const savedAmt  = Math.floor(lerp(600, 800, 0, 1400));
  const savedSp   = sp(598, 300, 24);

  // Status badges
  const b1Sp = sp(788, 400, 20);
  const b2Sp = sp(810, 400, 20);

  // Phase 3→4 card morph: 1280×680 → 1690×950 (88% viewport)
  const m34P  = lerp(830, 848, 0, 1, Easing.inOut(Easing.quad));
  const c34W  = interpolate(m34P, [0, 1], [1280, 1690]);
  const c34H  = interpolate(m34P, [0, 1], [680, 950]);

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 4 — n8n Workflows  (840–1140)
  // ═══════════════════════════════════════════════════════════════════════
  const p4InOp   = lerp(840, 855, 0, 1) * lerp(1125, 1140, 1, 0);
  const p4HeadSp = sp(858, 320, 24);

  // 4 nodes staggered 8f each
  const nodeSp   = (i: number) => sp(875 + i * 8, 320, 22);

  // Wire drawing progress (3 wires: 0→1, 1→2, 2→3)
  const wire = (i: number) => lerp(910 + i * 28, 950 + i * 28, 0, 1);

  // Light packet cycling per wire
  const pkt = (wireStart: number, px1: number, px2: number): { visible: boolean; x: number } => {
    if (frame < wireStart) return { visible: false, x: px1 };
    const cyc = (frame - wireStart) % 80;
    const t = interpolate(cyc, [0, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { visible: t >= 0 && t <= 1, x: px1 + t * (px2 - px1) };
  };
  const pkt1 = pkt(920, 80,  340);
  const pkt2 = pkt(948, 410, 670);
  const pkt3 = pkt(976, 740, 1000);

  // Success checkmark on node 4
  const checkSp    = sp(1040, 500, 16); // elastic bounce: over-shoots then settles
  const checkScale = interpolate(checkSp, [0, 1], [0, 1]);
  const checkPulse = lerp(1043, 1070, 0.6, 0);
  const checkRing  = lerp(1043, 1070, 0.8, 4.5);

  // Snap zoom exit (frames 1120–1140)
  const zoomS  = lerp(1120, 1140, 1, 22, Easing.in(Easing.exp));
  const zoomOp = lerp(1128, 1140, 1, 0);

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 5 — Proof & Reviews  (1140–1320)
  // ═══════════════════════════════════════════════════════════════════════
  const p5BgOp   = lerp(1140, 1158, 0, 1);
  const p5HeadSp = sp(1150, 340, 24);
  const p5SubSp  = sp(1166, 320, 24);

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 6 — Radial Orbit & CTA  (1320–1500)
  // ═══════════════════════════════════════════════════════════════════════
  const p6BgOp    = lerp(1318, 1334, 0, 1);
  const centerSp  = sp(1325, 380, 22);
  const orbitDeg  = frame >= 1320 ? (frame - 1320) * 0.4 : 0;
  const iconSp    = (i: number) => sp(1332 + i * 2, 360, 22);
  const iconR     = (i: number) => interpolate(iconSp(i), [0, 1], [0, 224]);
  const ctaHeadSp = sp(1384, 320, 24);
  const ctaBtnSp  = sp(1408, 300, 22);
  const trustSp   = sp(1432, 280, 24);

  // ═══════════════════════════════════════════════════════════════════════
  //  R E N D E R
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <AbsoluteFill style={{ backgroundColor: T.canvas, fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif", overflow: "hidden" }}>

      {/* ── AUDIO LAYER — frame-synced SFX + background music ── */}
      <AudioLayer />

      {/* ── Dotted grid canvas ── */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.035) 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      {/* ════════════════════════════════════════════════════════════════
          PHASE 1: Problem Agitation Hook  (0–240)
          ════════════════════════════════════════════════════════════════ */}
      {frame < 248 && (
        <>
          {/* Background floating 3D perspective cards */}
          {BG_CARDS.map((c, i) => (
            <div key={i} style={{
              position: "absolute",
              left: c.x + breath(28, 14, i * 60),
              top:  c.y + breath(22, 8,  i * 45),
              width: c.w, height: c.h, borderRadius: c.r,
              backgroundColor: T.white,
              boxShadow: T.shadow,
              border: T.rim,
              filter: "blur(8px)",
              opacity: 0.35,
              transform: `perspective(1200px) rotateX(15deg) rotateY(-10deg)`,
            }}/>
          ))}

          {/* Kinetic Text */}
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: p1TextOp }}>
            <div style={{ overflow: "hidden", padding: "14px 0", textAlign: "center" }}>
              <h1 key={txtIdx} style={{
                fontSize: txtSize,
                fontWeight: 800,
                color: txtIdx < 3 ? T.ink : T.ink,
                letterSpacing: txtIdx < 3 ? -3 : -2.5,
                margin: 0,
                lineHeight: 1.1,
                transform: `translateY(${txtY}px)`,
                opacity: txtOp,
                maxWidth: 1100,
              }}>
                {PHASE1_LABELS[txtIdx]}
              </h1>
              {/* Problem agitation accent line */}
              {txtIdx < 3 && (
                <div style={{
                  width: interpolate(txtSp, [0, 1], [0, 120]),
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: T.blue,
                  margin: "14px auto 0",
                  opacity: interpolate(txtSp, [0, 1], [0, 1]),
                }}/>
              )}
            </div>
          </AbsoluteFill>

          {/* Morphing pill overlay */}
          {frame >= 198 && (
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
              width: morphW, height: morphH, borderRadius: morphR,
              backgroundColor: T.white,
              boxShadow: T.shadow,
              opacity: morphOp,
            }}/>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 2: Web Design  (240–540)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 238 && frame < 545 && (
        <AbsoluteFill style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: lerp(238, 246, 0, 1) * lerp(534, 545, 1, 0),
        }}>
          <div style={{
            width: frame >= 530 ? c23W : 1600,
            height: frame >= 530 ? c23H : 820,
            borderRadius: 24,
            backgroundColor: T.white,
            boxShadow: T.shadow,
            border: T.rim,
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            transform: `scale(${interpolate(p2InSp, [0,1], [0.94, 1])}) translateY(${breath(32, 5)})`,
          }}>

            {/* Browser chrome */}
            <div style={{
              height: 52, backgroundColor: "#f1f3f4",
              borderBottom: "1px solid #e8eaed",
              display: "flex", alignItems: "center", padding: "0 20px", gap: 10, flexShrink: 0,
            }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: c }}/>
              ))}
              <div style={{
                flex: 1, height: 30, borderRadius: 8, backgroundColor: "#e8eaed",
                marginLeft: 18, display: "flex", alignItems: "center", paddingLeft: 14, gap: 8,
              }}>
                <span style={{ fontSize: 14, color: "#80868b" }}>🔒</span>
                <span style={{ fontSize: 14, color: "#5f6368", fontWeight: 500 }}>https://yourbrand.com</span>
              </div>
            </div>

            {/* Header */}
            <div style={{ padding: "24px 40px 0", flexShrink: 0 }}>
              <div style={{ overflow: "hidden", padding: "4px 0" }}>
                <h2 style={{
                  fontSize: 42, fontWeight: 800, color: T.ink,
                  letterSpacing: -1.5, margin: 0,
                  transform: `translateY(${interpolate(p2HeadSp, [0,1], [42,0])}px)`,
                  opacity: interpolate(p2HeadSp, [0,1], [0,1]),
                }}>
                  1. High-Converting Web Design
                </h2>
              </div>
              {frame >= 270 && (
                <div style={{
                  display: "inline-flex", marginTop: 14, padding: "8px 18px",
                  borderRadius: 20, backgroundColor: T.blueTint,
                  transform: `translateY(${interpolate(p2BadgeSp,[0,1],[18,0])}px)`,
                  opacity: interpolate(p2BadgeSp,[0,1],[0,1]),
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: T.blue }}>
                    Figma → Webflow / Framer • 100% Responsive
                  </span>
                </div>
              )}
            </div>

            {/* Content row */}
            <div style={{
              flex: 1, display: "flex", gap: 20,
              margin: "20px 40px 28px", overflow: "hidden",
            }}>
              {/* Browser hero viewport */}
              <div style={{
                flex: 1, borderRadius: 16, overflow: "hidden", position: "relative",
                background: `linear-gradient(135deg,
                  rgba(26,115,232,${interpolate(wireToColor,[0,1],[0.05,0.95])}) 0%,
                  rgba(66,133,244,${interpolate(wireToColor,[0,1],[0.03,0.88])}) 100%)`,
                border: `1.5px solid rgba(26,115,232,${interpolate(wireToColor,[0,1],[0.2,0.12])})`,
              }}>
                {/* SVG Wireframe (fades as colour arrives) */}
                <svg width="100%" height="100%" style={{
                  position: "absolute", top: 0, left: 0,
                  opacity: interpolate(wireToColor, [0, 0.55, 1], [1, 0.25, 0]),
                }}>
                  <rect x="5%" y="6%"  width="90%" height="35%" fill="none" stroke={T.blue} strokeWidth="1.5" strokeDasharray="7 4" rx="10" opacity="0.4"/>
                  <rect x="8%" y="11%" width="42%" height="14" fill={T.blue} opacity="0.18" rx="4"/>
                  <rect x="8%" y="29%" width="30%" height="9" fill={T.blue} opacity="0.13" rx="4"/>
                  <rect x="8%" y="41%" width="18%" height="26" fill={T.blue} opacity="0.22" rx="13"/>
                  {[0,1,2,3].map(n => (
                    <rect key={n} x={`${56+n*10}%`} y="8%" width="7%" height="11" fill={T.blue} opacity="0.14" rx="4"/>
                  ))}
                  {/* Feature grid stubs */}
                  {[0,1,2].map(n => (
                    <rect key={n} x={`${8+n*31}%`} y="65%" width="27%" height="22%" fill="none" stroke={T.blue} strokeWidth="1" opacity="0.18" rx="8"/>
                  ))}
                </svg>

                {/* Coloured hero content */}
                <div style={{
                  position: "absolute", inset: 0, padding: 32,
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  opacity: wireToColor,
                }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    {["Design","Dev","Launch"].map(tag => (
                      <span key={tag} style={{
                        padding: "5px 14px", borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,0.22)",
                        fontSize: 13, fontWeight: 700, color: T.white,
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ width:"62%", height: 22, borderRadius: 11, backgroundColor:"rgba(255,255,255,0.92)", marginBottom: 12 }}/>
                  <div style={{ width:"42%", height: 14, borderRadius: 7,  backgroundColor:"rgba(255,255,255,0.6)",  marginBottom: 28 }}/>

                  {/* CTA Button */}
                  <div style={{
                    display: "inline-flex", width: 200, height: 50, borderRadius: 999,
                    backgroundColor: T.white, alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                    transform: `scale(${ctaScale})`,
                    boxShadow: `0 0 0 ${interpolate(wireToColor,[0,1],[0,5])}px rgba(255,255,255,0.3)`,
                  }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: T.blue }}>Get Started</span>
                    {/* Click ripple */}
                    {frame >= 413 && frame < 442 && (
                      <div style={{
                        position: "absolute", left: "50%", top: "50%",
                        transform: `translate(-50%,-50%) scale(${rippleS})`,
                        width: 200, height: 50, borderRadius: 999,
                        border: `2px solid rgba(26,115,232,0.5)`,
                        opacity: rippleOp,
                      }}/>
                    )}
                  </div>

                  {/* Feature pills below */}
                  {wireToColor > 0.7 && (
                    <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                      {["Fast","SEO-Ready","Conversion-Focused"].map(f => (
                        <span key={f} style={{
                          padding: "6px 14px", borderRadius: 999,
                          backgroundColor: "rgba(255,255,255,0.18)",
                          fontSize: 13, fontWeight: 600, color: T.white,
                        }}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mac cursor */}
                {frame >= 340 && frame < 542 && (
                  <div style={{
                    position: "absolute",
                    left: curX,
                    top: curY,
                    fontSize: 26,
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
                    transform: `rotate(-12deg)`,
                    pointerEvents: "none",
                    zIndex: 20,
                  }}>🖱️</div>
                )}
              </div>

              {/* Mobile preview — slides in from right frame 444–540 */}
              {frame >= 442 && (
                <div style={{
                  width: 200,
                  transform: `translateX(${mobX}px)`,
                  opacity: interpolate(mobSp, [0,1],[0,1]),
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 200, height: "100%", borderRadius: 20,
                    backgroundColor: T.white,
                    boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                    border: "2px solid #e8eaed",
                    overflow: "hidden", display: "flex", flexDirection: "column",
                  }}>
                    {/* Phone notch */}
                    <div style={{
                      height: 28, backgroundColor: T.ink,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: 60, height: 8, borderRadius: 4, backgroundColor: "#333" }}/>
                    </div>
                    {/* Mobile content */}
                    <div style={{
                      flex: 1, background: "linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",
                      padding: 14, display: "flex", flexDirection: "column", gap: 10,
                    }}>
                      <div style={{ width: "80%", height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.9)" }}/>
                      <div style={{ width: "60%", height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.6)" }}/>
                      <div style={{ width: "100%", height: 36, borderRadius: 999, backgroundColor: T.white, display:"flex",alignItems:"center",justifyContent:"center",marginTop:8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.blue }}>Get Started</span>
                      </div>
                      {[70,55,80].map((w,i) => (
                        <div key={i} style={{ width:`${w}%`, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.3)" }}/>
                      ))}
                    </div>
                    <div style={{ height: 20, backgroundColor: "#f1f3f4" }}/>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: T.slate, textAlign: "center", marginTop: 8, letterSpacing: 0.5 }}>
                    MOBILE VIEW
                  </p>
                </div>
              )}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 3: Data Entry  (540–840)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 538 && frame < 845 && (
        <AbsoluteFill style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: lerp(538, 550, 0, 1) * lerp(832, 845, 1, 0),
        }}>
          <div style={{
            width:  frame >= 830 ? c34W : 1280,
            height: frame >= 830 ? c34H : 680,
            borderRadius: 24,
            backgroundColor: T.white,
            boxShadow: T.shadow,
            border: T.rim,
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            transform: `translateY(${breath(34, 4)})`,
          }}>
            {/* Header row */}
            <div style={{ padding: "24px 40px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ overflow: "hidden", padding: "4px 0" }}>
                    <h2 style={{
                      fontSize: 42, fontWeight: 800, color: T.ink,
                      letterSpacing: -1.5, margin: 0,
                      transform: `translateY(${interpolate(p3HeadSp,[0,1],[42,0])}px)`,
                      opacity: interpolate(p3HeadSp,[0,1],[0,1]),
                    }}>
                      2. Automated Data Entry
                    </h2>
                  </div>
                  {frame >= 568 && (
                    <div style={{
                      display: "inline-flex", marginTop: 14, padding: "8px 18px",
                      borderRadius: 20, backgroundColor: T.greenTint,
                      transform: `translateY(${interpolate(p3BadgeSp,[0,1],[18,0])}px)`,
                      opacity: interpolate(p3BadgeSp,[0,1],[0,1]),
                    }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: T.green }}>
                        Web Scraping • Lead Parsing • Database Cleanup
                      </span>
                    </div>
                  )}
                </div>

                {/* Live counter badge */}
                {frame >= 596 && (
                  <div style={{
                    padding: "12px 22px", borderRadius: 16,
                    backgroundColor: T.greenTint,
                    border: "1.5px solid rgba(19,115,51,0.25)",
                    transform: `translateY(${interpolate(savedSp,[0,1],[20,0])}px)`,
                    opacity: interpolate(savedSp,[0,1],[0,1]),
                    textAlign: "center",
                  }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: T.green, margin: 0 }}>
                      ${savedAmt.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: T.green, margin: 0, opacity: 0.7 }}>
                      Saved / month
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Data stream */}
            <div style={{
              flex: 1, margin: "18px 40px 20px",
              borderRadius: 16, backgroundColor: "#f8f9fa",
              border: "1px solid #e8eaed",
              display: "flex", overflow: "hidden",
            }}>
              {/* Left: raw files */}
              <div style={{
                width: 300, padding: "18px 20px",
                borderRight: "1px solid #e8eaed",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.subtle, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px" }}>
                  Raw Input
                </p>
                {DATA_FILES.map((file, i) => {
                  const fileSp = sp(600 + i * 20, 350, 24);
                  return (
                    <div key={i} style={{
                      padding: "10px 14px", borderRadius: 10,
                      backgroundColor: "#fff8e1",
                      border: "1px solid #ffc107",
                      fontSize: 13, fontWeight: 600, color: "#856404",
                      fontFamily: "monospace",
                      transform: `translateX(${interpolate(fileSp,[0,1],[-50,0])}px)`,
                      opacity: interpolate(fileSp,[0,1],[0,1]),
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      📁 {file}
                    </div>
                  );
                })}
              </div>

              {/* Center: processing node */}
              <div style={{
                width: 88, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                backgroundColor: "#f1f3f4",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 999,
                  backgroundColor: T.greenVivid,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${1 + breath(20, 0.08, 12)})`,
                  boxShadow: `0 0 ${8 + breath(20,6,12)}px rgba(29,191,115,0.5)`,
                }}>
                  <span style={{ fontSize: 22 }}>⚡</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{
                      width: 4, height: 4, borderRadius: "50%",
                      backgroundColor: T.greenVivid,
                      opacity: frame % 20 > d * 6 ? 1 : 0.25,
                    }}/>
                  ))}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.green, letterSpacing: 0.3 }}>AI</span>
              </div>

              {/* Right: structured output */}
              <div style={{
                flex: 1, padding: "18px 20px",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.subtle, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px" }}>
                  Structured Output
                </p>
                {DATA_ROWS_CLEAN.slice(0, rowCount).map((row, i) => (
                  <div key={i} style={{
                    padding: "10px 14px", borderRadius: 10,
                    backgroundColor: T.greenTint,
                    border: "1px solid rgba(19,115,51,0.2)",
                    fontSize: 14, fontWeight: 600, color: T.green,
                    transform: `translateX(${interpolate(rowSp(i),[0,1],[50,0])}px)`,
                    opacity: interpolate(rowSp(i),[0,1],[0,1]),
                  }}>
                    ✓ {row}
                  </div>
                ))}
              </div>
            </div>

            {/* Status badges */}
            <div style={{ display: "flex", gap: 14, padding: "0 40px 22px" }}>
              {frame >= 786 && (
                <div style={{
                  padding: "10px 22px", borderRadius: 999,
                  backgroundColor: T.greenTint,
                  border: "1.5px solid rgba(19,115,51,0.3)",
                  display: "flex", alignItems: "center", gap: 8,
                  transform: `scale(${interpolate(b1Sp,[0,1],[0.5,1])}) translateY(${interpolate(b1Sp,[0,1],[16,0])}px)`,
                  opacity: interpolate(b1Sp,[0,1],[0,1]),
                }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: T.green }}>✓</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: T.green }}>100% Extracted</span>
                </div>
              )}
              {frame >= 808 && (
                <div style={{
                  padding: "10px 22px", borderRadius: 999,
                  backgroundColor: T.greenTint,
                  border: "1.5px solid rgba(19,115,51,0.3)",
                  display: "flex", alignItems: "center", gap: 8,
                  transform: `scale(${interpolate(b2Sp,[0,1],[0.5,1])}) translateY(${interpolate(b2Sp,[0,1],[16,0])}px)`,
                  opacity: interpolate(b2Sp,[0,1],[0,1]),
                }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: T.green }}>✓</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: T.green }}>Zero Manual Errors</span>
                </div>
              )}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 4: n8n Workflows Canvas  (840–1140)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 838 && frame < 1145 && (
        <AbsoluteFill style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: lerp(838, 852, 0, 1),
          transform: frame >= 1120 ? `scale(${zoomS})` : "scale(1)",
          ...(frame >= 1120 ? { opacity: zoomOp } : {}),
        }}>
          <div style={{
            width: 1690, height: 950,
            borderRadius: 24,
            backgroundColor: T.white,
            boxShadow: T.shadow,
            border: T.rim,
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}>
            {/* Header */}
            <div style={{ padding: "24px 48px 0", flexShrink: 0 }}>
              <div style={{ overflow: "hidden", padding: "4px 0" }}>
                <h2 style={{
                  fontSize: 42, fontWeight: 800, color: T.ink,
                  letterSpacing: -1.5, margin: 0,
                  transform: `translateY(${interpolate(p4HeadSp,[0,1],[42,0])}px)`,
                  opacity: interpolate(p4HeadSp,[0,1],[0,1]),
                }}>
                  3. Custom n8n Workflows
                </h2>
              </div>
              {frame >= 875 && (
                <div style={{
                  display: "inline-flex", marginTop: 14, padding: "8px 18px",
                  borderRadius: 20, backgroundColor: T.amberTint,
                  opacity: interpolate(sp(875, 300, 24),[0,1],[0,1]),
                  transform: `translateY(${interpolate(sp(875,300,24),[0,1],[18,0])}px)`,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: T.amber }}>
                    1,000+ App Integrations • Zero Zapier Monthly Fees
                  </span>
                </div>
              )}
            </div>

            {/* n8n Canvas */}
            <div style={{
              flex: 1, margin: "20px 48px 32px",
              borderRadius: 18, backgroundColor: "#f1f3f4",
              position: "relative", overflow: "hidden",
            }}>
              {/* Grid dots */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.065) 1.5px, transparent 1.5px)",
                backgroundSize: "28px 28px",
              }}/>

              {/* SVG wires + packets */}
              <svg width="100%" height="100%" style={{ position: "absolute" }}>
                <defs>
                  <filter id="pkt">
                    <feGaussianBlur stdDeviation="4" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Wire 0→1 */}
                <line x1={170} y1="50%" x2={380} y2="50%" stroke={T.subtle} strokeWidth={3}
                  strokeDasharray={210} strokeDashoffset={210*(1-wire(0))} strokeLinecap="round"/>
                {/* Wire 1→2 */}
                <line x1={500} y1="50%" x2={710} y2="50%" stroke={T.subtle} strokeWidth={3}
                  strokeDasharray={210} strokeDashoffset={210*(1-wire(1))} strokeLinecap="round"/>
                {/* Wire 2→3 */}
                <line x1={830} y1="50%" x2={1040} y2="50%" stroke={T.subtle} strokeWidth={3}
                  strokeDasharray={210} strokeDashoffset={210*(1-wire(2))} strokeLinecap="round"/>

                {/* Data packets */}
                {pkt1.visible && <circle cx={pkt1.x} cy="50%" r={7} fill={T.blue}    filter="url(#pkt)"/>}
                {pkt2.visible && <circle cx={pkt2.x} cy="50%" r={7} fill="#10a37f"   filter="url(#pkt)"/>}
                {pkt3.visible && <circle cx={pkt3.x} cy="50%" r={7} fill={T.greenVivid} filter="url(#pkt)"/>}
              </svg>

              {/* 4 Workflow Nodes */}
              {WF_NODES.map((nd, i) => {
                const nSp   = nodeSp(i);
                const nFloat = breath(30, 4, i * 55);
                return (
                  <div key={nd.label} style={{
                    position: "absolute",
                    left: 60 + i * 330,
                    top: "50%",
                    transform: `translate(0, calc(-50% + ${interpolate(nSp,[0,1],[60,0]) + nFloat}px)) scale(${interpolate(nSp,[0,1],[0.3,1])})`,
                    opacity: interpolate(nSp,[0,1],[0,1]),
                  }}>
                    <div style={{
                      width: 150, height: 145,
                      borderRadius: 20,
                      backgroundColor: T.white,
                      border: `2px solid ${nd.col}28`,
                      boxShadow: `0 8px 28px rgba(0,0,0,0.07), 0 0 0 1px ${nd.col}16`,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 8,
                      position: "relative",
                    }}>
                      <span style={{ fontSize: 38 }}>{nd.icon}</span>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: T.ink, margin: 0 }}>{nd.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 500, color: T.slate, margin: 0, lineHeight: 1.3 }}>{nd.sub}</p>
                      </div>

                      {/* Checkmark badge on node 4 */}
                      {i === 3 && frame >= 1038 && (
                        <>
                          {/* Pulse ring */}
                          {frame < 1075 && (
                            <div style={{
                              position: "absolute", top: -22, right: -22,
                              width: 48, height: 48,
                              borderRadius: "50%",
                              border: `2px solid rgba(29,191,115,0.5)`,
                              transform: `scale(${checkRing})`,
                              opacity: checkPulse,
                            }}/>
                          )}
                          {/* Badge */}
                          <div style={{
                            position: "absolute", top: -18, right: -18,
                            width: 46, height: 46, borderRadius: "50%",
                            backgroundColor: T.greenVivid,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transform: `scale(${checkScale})`,
                            opacity: interpolate(checkSp,[0,1],[0,1]),
                            boxShadow: "0 4px 18px rgba(29,191,115,0.55)",
                          }}>
                            <span style={{ fontSize: 22, color: T.white, fontWeight: 800 }}>✓</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 5: Value Prop & Reviews  (1140–1320)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 1138 && frame < 1325 && (
        <AbsoluteFill style={{
          backgroundColor: T.white,
          opacity: p5BgOp * lerp(1312, 1325, 1, 0),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          {/* Headline */}
          <div style={{ overflow: "hidden", padding: "12px 0" }}>
            <h1 style={{
              fontSize: 72, fontWeight: 900, color: T.ink,
              letterSpacing: -3, margin: 0, textAlign: "center",
              transform: `translateY(${interpolate(p5HeadSp,[0,1],[-50,0])}px)`,
              opacity: interpolate(p5HeadSp,[0,1],[0,1]),
            }}>
              Complete Digital Engineering.
            </h1>
          </div>
          <div style={{ overflow: "hidden", padding: "6px 0", marginTop: 4 }}>
            <p style={{
              fontSize: 30, fontWeight: 500, color: T.slate,
              margin: 0, textAlign: "center",
              transform: `translateY(${interpolate(p5SubSp,[0,1],[-36,0])}px)`,
              opacity: interpolate(p5SubSp,[0,1],[0,1]),
              maxWidth: 860,
            }}>
              Save hundreds of hours and thousands in software fees.
            </p>
          </div>

          {/* Review cards — slide in from right, staggered */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48, width: 820 }}>
            {REVIEWS.map((rev, i) => {
              const revSp = sp(rev.delay, 280, 22);
              return (
                <div key={i} style={{
                  padding: "22px 30px",
                  borderRadius: 20,
                  backgroundColor: T.white,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                  transform: `translateX(${interpolate(revSp,[0,1],[200,0])}px)`,
                  opacity: interpolate(revSp,[0,1],[0,1]),
                }}>
                  {/* Fiverr tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      padding: "4px 12px", borderRadius: 6,
                      backgroundColor: T.greenVivid,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: T.white }}>fiverr</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.slate }}>Verified Review • {rev.author}</span>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 600, color: T.ink, margin: 0, lineHeight: 1.5 }}>
                    "{rev.text}"
                  </p>
                  <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                    {"⭐".repeat(rev.stars).split("").map((s,j) => (
                      <span key={j} style={{ fontSize: 20 }}>{s}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 6: Radial Orbit & Fiverr CTA  (1320–1500)
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 1318 && (
        <AbsoluteFill style={{
          backgroundColor: T.white,
          opacity: p6BgOp,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          {/* Radial orbit container */}
          <div style={{
            position: "relative", width: 520, height: 520,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            {/* Center badge */}
            <div style={{
              width: 128, height: 128, borderRadius: 36,
              backgroundColor: T.ink,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 18px 50px rgba(0,0,0,0.2)",
              transform: `scale(${interpolate(centerSp,[0,1],[0.2,1])})`,
              opacity: interpolate(centerSp,[0,1],[0,1]),
              zIndex: 10,
            }}>
              <span style={{ fontSize: 56 }}>⚡</span>
            </div>

            {/* Orbit rotation wrapper */}
            <div style={{
              position: "absolute", width: "100%", height: "100%",
              transform: `rotate(${orbitDeg}deg)`,
            }}>
              {ORBIT_ICONS.map((ic, i) => {
                const angle   = (i / ORBIT_ICONS.length) * 360;
                const rad     = (angle * Math.PI) / 180;
                const r       = iconR(i);
                const ix      = Math.cos(rad) * r;
                const iy      = Math.sin(rad) * r;

                return (
                  <div key={ic.label} style={{
                    position: "absolute", left: "50%", top: "50%",
                    transform: `translate(calc(-50% + ${ix}px), calc(-50% + ${iy}px)) rotate(${-orbitDeg}deg)`,
                    opacity: interpolate(iconSp(i),[0,1],[0,1]),
                  }}>
                    <div style={{
                      width: 68, height: 68, borderRadius: 20,
                      backgroundColor: T.white,
                      border: "1.5px solid #e8eaed",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 3,
                    }}>
                      <span style={{ fontSize: 26 }}>{ic.icon}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: T.slate, letterSpacing: 0.3 }}>
                        {ic.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA headline */}
          <div style={{ overflow: "hidden", padding: "8px 0" }}>
            <h2 style={{
              fontSize: 56, fontWeight: 900, color: T.ink,
              letterSpacing: -2, margin: 0, textAlign: "center",
              transform: `translateY(${interpolate(ctaHeadSp,[0,1],[40,0])}px)`,
              opacity: interpolate(ctaHeadSp,[0,1],[0,1]),
            }}>
              Hire an Expert on Fiverr.
            </h2>
          </div>

          {/* Fiverr button */}
          {frame >= 1404 && (
            <div style={{
              marginTop: 24,
              transform: `translateY(${interpolate(ctaBtnSp,[0,1],[44,0])}px) scale(${interpolate(ctaBtnSp,[0,1],[0.75,1])})`,
              opacity: interpolate(ctaBtnSp,[0,1],[0,1]),
              display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            }}>
              <div style={{
                padding: "20px 58px", borderRadius: 999,
                background: "linear-gradient(135deg, #1dbf73 0%, #16a264 100%)",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 8px 30px rgba(29,191,115,0.42), 0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: T.white, letterSpacing: -0.5 }}>
                  Order Gig Now →
                </span>
              </div>

              {/* Trust badge */}
              {frame >= 1430 && (
                <p style={{
                  fontSize: 17, fontWeight: 500, color: T.slate,
                  textAlign: "center", margin: 0,
                  opacity: interpolate(trustSp,[0,1],[0,1]),
                  transform: `translateY(${interpolate(trustSp,[0,1],[14,0])}px)`,
                }}>
                  ⚡ Fast Delivery • 100% Satisfaction Guarantee • Top Rated
                </p>
              )}
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
