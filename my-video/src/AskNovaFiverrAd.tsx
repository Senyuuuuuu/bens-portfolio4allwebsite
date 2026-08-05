import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";
import { interpolatePath } from "@remotion/paths";

export const AskNovaFiverrAd: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Total duration: 12 seconds = 720 frames @ 60fps
  // Phase 1 (Frames 0 - 180): Pain Point Hook & Magic Interface
  // Phase 2 (Frames 180 - 360): Workflow Assembly Morph & Node Extrusion
  // Phase 3 (Frames 360 - 540): Scale Expansion & 3D Z-Axis App Grid
  // Phase 4 (Frames 540 - 720): Fiverr CTA Singularity & Typographic Explosion

  // --- AMBIENT PARTICLES DATA ---
  const particles = Array.from({ length: 18 }).map((_, i) => {
    const seed = i * 137.5;
    const initialX = Math.sin(seed) * 800;
    const initialY = Math.cos(seed) * 450;
    const size = 3 + (i % 4) * 2;
    const speed = 0.4 + (i % 3) * 0.3;
    return { initialX, initialY, size, speed, opacity: 0.2 + (i % 5) * 0.1 };
  });

  // --- PHASE 1: PAIN POINT HOOK (Frames 0 - 180) ---
  const typingText = "How much time do you waste on manual tasks?";
  const charsCount = Math.floor(
    interpolate(frame, [20, 100], [0, typingText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const currentTypedText = typingText.slice(0, charsCount);
  const isTypingDone = charsCount === typingText.length;
  const cursorBlink = isTypingDone ? (Math.floor(frame / 20) % 2 === 0 ? 1 : 0) : 1;

  // Subtext Fade In at Frame 60: "Stop copying & pasting. Start automating." (Inter, 24px, #a8b2d1)
  const subtextOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtextTranslateY = interpolate(frame, [60, 90], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Bezier path for 4-point SVG Star glide from (left: 100px, bottom: -50px) to (Fix This button: left: 240px, top: 0px)
  const sparkFlyProgress = interpolate(frame, [30, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const sparkX = interpolate(sparkFlyProgress, [0, 1], [-450, 240]);
  const sparkY = interpolate(sparkFlyProgress, [0, 1], [320, 0]);

  // Click at Frame 150: star scale 1.0 -> 0.8 -> 1.0 via spring
  const clickSpring = spring({
    frame: frame - 150,
    fps,
    config: { stiffness: 300, damping: 10 },
  });
  const starClickScale = interpolate(clickSpring, [0, 0.5, 1], [1.0, 0.8, 1.0]);

  // Catalyst (Frame 150): Text strings use spring to scale down to 0 and disappear
  const catalystSpring = spring({
    frame: frame - 150,
    fps,
    config: { stiffness: 220, damping: 14 },
  });
  const textCatalystScale = interpolate(catalystSpring, [0, 1], [1.0, 0]);

  // White Click Ripple (Frame 150)
  const rippleScale = interpolate(clickSpring, [0, 1], [0, 4.0]);
  const rippleOpacity = interpolate(clickSpring, [0, 0.2, 1], [0, 0.8, 0]);

  // --- PHASE 2: WORKFLOW ASSEMBLY MORPH (Frames 180 - 360) ---
  const morphProgress = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Bounding Box Morph: Container (700x80, r=40px) -> Workspace (1500x700, r=24px)
  const windowWidth = interpolate(morphProgress, [0, 1], [700, 1500]);
  const windowHeight = interpolate(morphProgress, [0, 1], [80, 700]);
  const windowRadius = interpolate(morphProgress, [0, 1], [40, 24]);

  const searchBarContentOpacity = interpolate(morphProgress, [0, 0.3], [1, 0], {
    extrapolateRight: "clamp",
  });
  const workflowContentOpacity = interpolate(morphProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // 3 Workflow Nodes Extrusion (Staggered by 10 frames: 200, 210, 220)
  const getNodeExtrusion = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, stiffness: 120 },
    });
    return {
      scale: interpolate(s, [0, 1], [0.5, 1.0]),
      translateZ: interpolate(s, [0, 1], [-50, 0]),
      opacity: interpolate(s, [0, 1], [0, 1.0]),
    };
  };

  const node1 = getNodeExtrusion(200);
  const node2 = getNodeExtrusion(210);
  const node3 = getNodeExtrusion(220);

  // SVG Path Morphing using @remotion/paths interpolatePath()
  // Starts as straight line: "M 200 350 L 1300 350"
  // Morphs into curved bezier path: "M 200 350 Q 750 180, 1300 350"
  const wireMorphProgress = interpolate(frame, [210, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const straightPath = "M 200 350 L 1300 350";
  const curvedPath = "M 200 350 Q 750 180, 1300 350";
  const currentWirePath = interpolatePath(wireMorphProgress, straightPath, curvedPath);

  // Data Badges (+1 Lead, Synced ⚡) Springs (Frames 260+)
  const badge1Spring = spring({
    frame: frame - 265,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const badge2Spring = spring({
    frame: frame - 280,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // --- PHASE 3: SCALE EXPANSION & 3D APP GRID (Frames 360 - 540) ---
  const cameraPushProgress = interpolate(frame, [360, 400], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.85, 0, 0.15, 1),
  });

  // Workspace container scale 1.0 -> 8.0 & borderRadius -> 0px (Wipe Mask)
  const workspaceScale = interpolate(cameraPushProgress, [0, 1], [1.0, 8.0]);
  const workspaceRadius = interpolate(cameraPushProgress, [0, 1], [24, 0]);
  const workspaceOpacity = interpolate(cameraPushProgress, [0, 0.8, 1], [1, 0.4, 0]);

  // 3D Grid Reveal
  const gridRevealOpacity = interpolate(cameraPushProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // 12 App Icons
  const apps = [
    { name: "Slack", icon: "💬" },
    { name: "Sheets", icon: "📊" },
    { name: "Gmail", icon: "✉️" },
    { name: "Stripe", icon: "💳" },
    { name: "OpenAI", icon: "🤖" },
    { name: "Hubspot", icon: "📈" },
    { name: "Notion", icon: "📝" },
    { name: "Zapier", icon: "⚡" },
    { name: "Airtable", icon: "🗄️" },
    { name: "Webhook", icon: "🔗" },
    { name: "Postgres", icon: "🐘" },
    { name: "Shopify", icon: "🛍️" },
  ];

  // Heavy Spring Stagger Wave (stiffness: 180, damping: 10)
  const getAppSpring = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const waveDelay = 370 + (col + (2 - row)) * 6;
    const s = spring({
      frame: frame - waveDelay,
      fps,
      config: { stiffness: 180, damping: 10 },
    });
    return {
      translateZ: interpolate(s, [0, 0.5, 1], [-120, 40, 0]),
      scale: interpolate(s, [0, 1], [0, 1.0]),
    };
  };

  // --- PHASE 4: FIVERR CTA SINGULARITY (Frames 540 - 720) ---
  const gridCollapseProgress = interpolate(frame, [540, 580], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  // App Icons Singularity Convergence to (left: 50%, top: 50%)
  const collapseScale = interpolate(gridCollapseProgress, [0, 1], [1.0, 0.01]);
  const collapseOpacity = interpolate(gridCollapseProgress, [0, 0.85, 1], [1, 0.5, 0]);

  // Magenta Circle Scale & Typographic Explosion (scaleX: 1 -> 50)
  const explosionSpring = spring({
    frame: frame - 580,
    fps,
    config: { stiffness: 240, damping: 12 },
  });
  const magentaCircleScaleX = interpolate(explosionSpring, [0, 1], [1, 50]);
  const explosionOpacity = interpolate(explosionSpring, [0, 0.15, 1], [0, 0.9, 0]);

  // CTA Elements Entrance Spring (Frames 585+)
  const ctaSpring = spring({
    frame: frame - 585,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);
  const buttonTranslateY = interpolate(ctaSpring, [0, 1], [40, 0]);

  // Trust Badge Slide Up (Frames 610+)
  const badgeSpring = spring({
    frame: frame - 610,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const badgeTranslateY = interpolate(badgeSpring, [0, 1], [30, 0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  // Continuous Orbital Star around CTA Button using Math.cos() & Math.sin()
  const orbitTime = (frame - 585) * 0.08;
  const orbitX = Math.cos(orbitTime) * 180;
  const orbitY = Math.sin(orbitTime) * 28;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0415",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Background Environment with Center Radial Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.25) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Ambient Dust Particles */}
      {particles.map((p, i) => {
        const py = (p.initialY + frame * p.speed) % 1080 - 540;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: "#d946ef",
              left: `calc(50% + ${p.initialX}px)`,
              top: `calc(50% + ${py}px)`,
              opacity: p.opacity,
              boxShadow: "0 0 10px #d946ef",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* --- PHASE 1 & PHASE 2: MORPHING WORKSPACE CONTAINER --- */}
      {workspaceOpacity > 0.01 && (
        <div
          style={{
            position: "relative",
            width: `${windowWidth}px`,
            height: `${windowHeight}px`,
            borderRadius: `${windowRadius}px`,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "0 30px 90px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 40px rgba(217, 70, 239, 0.25)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${workspaceScale})`,
            opacity: workspaceOpacity,
            boxSizing: "border-box",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          {/* PHASE 1: SEARCH BAR TYPING CONTENT & SUBTEXT */}
          {searchBarContentOpacity > 0.01 && (
            <div
              style={{
                width: "100%",
                height: "100%",
                padding: "0 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: searchBarContentOpacity,
                transform: `scale(${textCatalystScale})`,
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "22px", color: "rgba(255, 255, 255, 0.5)" }}>🔍</span>
                  <span style={{ fontSize: "22px", fontWeight: 600, color: "#ffffff" }}>
                    {currentTypedText}
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "24px",
                        backgroundColor: "#d946ef",
                        marginLeft: "4px",
                        verticalAlign: "middle",
                        opacity: cursorBlink,
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* Glowing "Fix This" Button */}
              <div
                style={{
                  padding: "12px 28px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 24px rgba(217, 70, 239, 0.6)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.5px",
                }}
              >
                Fix This
              </div>
            </div>
          )}

          {/* Subtext Below Search Bar (Frames 60 - 150) */}
          {searchBarContentOpacity > 0.01 && frame < 150 && subtextOpacity > 0.01 && (
            <div
              style={{
                position: "absolute",
                bottom: "-48px",
                fontSize: "24px",
                fontWeight: 500,
                color: "#a8b2d1",
                opacity: subtextOpacity * textCatalystScale,
                transform: `translateY(${subtextTranslateY}px)`,
                pointerEvents: "none",
              }}
            >
              Stop copying & pasting. Start automating.
            </div>
          )}

          {/* PHASE 2: WORKFLOW ASSEMBLY MORPH & NODE EXTRUSION */}
          {workflowContentOpacity > 0.01 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: workflowContentOpacity,
                padding: "60px",
                boxSizing: "border-box",
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* SVG Connector Line using @remotion/paths interpolatePath() */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <path
                  d={currentWirePath}
                  fill="none"
                  stroke="#d946ef"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 12px #d946ef)"
                />
              </svg>

              {/* DATA BADGE 1: "+1 Lead" */}
              {badge1Spring > 0.01 && (
                <div
                  style={{
                    position: "absolute",
                    left: "480px",
                    top: "220px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid #22c55e",
                    boxShadow: "0 0 15px rgba(34, 197, 94, 0.4)",
                    color: "#22c55e",
                    fontSize: "12px",
                    fontWeight: 800,
                    transform: `scale(${badge1Spring})`,
                    zIndex: 25,
                  }}
                >
                  +1 Lead
                </div>
              )}

              {/* DATA BADGE 2: "Synced ⚡" */}
              {badge2Spring > 0.01 && (
                <div
                  style={{
                    position: "absolute",
                    right: "480px",
                    top: "220px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(217, 70, 239, 0.2)",
                    border: "1px solid #d946ef",
                    boxShadow: "0 0 15px rgba(217, 70, 239, 0.4)",
                    color: "#d946ef",
                    fontSize: "12px",
                    fontWeight: 800,
                    transform: `scale(${badge2Spring})`,
                    zIndex: 25,
                  }}
                >
                  Synced ⚡
                </div>
              )}

              {/* NODE 1: Stripe Payment (Left) */}
              <div
                style={{
                  position: "absolute",
                  left: "140px",
                  top: "280px",
                  width: "320px",
                  padding: "24px 28px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(22, 10, 36, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1.5px solid #635BFF",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(99, 91, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  transform: `scale(${node1.scale}) translateZ(${node1.translateZ}px)`,
                  opacity: node1.opacity,
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(99, 91, 255, 0.2)",
                    border: "1px solid #635BFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  💳
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#635BFF", letterSpacing: "1.5px" }}>
                    TRIGGER
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                    Stripe Payment
                  </div>
                </div>
              </div>

              {/* NODE 2: n8n AI Router (Center) */}
              <div
                style={{
                  position: "absolute",
                  left: "590px",
                  top: "280px",
                  width: "320px",
                  padding: "24px 28px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(22, 10, 36, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1.5px solid #d946ef",
                  boxShadow: "0 20px 50px rgba(217, 70, 239, 0.4), 0 0 35px rgba(217, 70, 239, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  transform: `scale(${node2.scale}) translateZ(${node2.translateZ}px)`,
                  opacity: node2.opacity,
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(217, 70, 239, 0.2)",
                    border: "1px solid #d946ef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  🤖
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#d946ef", letterSpacing: "1.5px" }}>
                    AI ROUTER
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                    n8n AI Router
                  </div>
                </div>
              </div>

              {/* NODE 3: CRM + Slack (Right) */}
              <div
                style={{
                  position: "absolute",
                  right: "140px",
                  top: "280px",
                  width: "320px",
                  padding: "24px 28px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(22, 10, 36, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1.5px solid #36C5F0",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(54, 197, 240, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  transform: `scale(${node3.scale}) translateZ(${node3.translateZ}px)`,
                  opacity: node3.opacity,
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(54, 197, 240, 0.2)",
                    border: "1px solid #36C5F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  💬
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#36C5F0", letterSpacing: "1.5px" }}>
                    OUTPUT
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                    CRM + Slack
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* White Click Ripple (Frame 150) */}
      {rippleOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 0 40px #ffffff, 0 0 60px #d946ef",
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />
      )}

      {/* 4-Point SVG Magenta Star Cursor (Phase 1 & Phase 2) */}
      {frame < 360 && (
        <div
          style={{
            position: "absolute",
            top: frame < 180 ? `calc(50% + ${sparkY}px)` : "50%",
            left: frame < 180 ? `calc(50% + ${sparkX}px)` : "50%",
            transform: `translate(-50%, -50%) scale(${starClickScale})`,
            zIndex: 40,
            pointerEvents: "none",
            filter: "drop-shadow(0px 0px 14px #d946ef)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M 24 0 Q 24 24, 48 24 Q 24 24, 24 48 Q 24 24, 0 24 Q 24 24, 24 0 Z"
              fill="#d946ef"
            />
          </svg>
        </div>
      )}

      {/* --- PHASE 3: THE SCALE EXPANSION & 3D APP GRID (Frames 360 - 540) --- */}
      {gridRevealOpacity > 0.01 && collapseOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: gridRevealOpacity * collapseOpacity,
            transformStyle: "preserve-3d",
            perspective: "1000px",
            zIndex: 20,
          }}
        >
          {/* Hero Headlines Above Grid */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "36px",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-1px",
              }}
            >
              Connect 1,000+ Apps.
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 700,
                marginTop: "8px",
                backgroundImage: "linear-gradient(to right, #d946ef, #38bdf8)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Your entire tech stack, completely synced.
            </div>
          </div>

          {/* 4x3 3D Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "28px",
              width: "1140px",
              transformStyle: "preserve-3d",
              transform: `scale(${collapseScale}) rotateX(25deg) rotateY(-15deg)`,
            }}
          >
            {apps.map((app, idx) => {
              const appAnim = getAppSpring(idx);
              return (
                <div
                  key={idx}
                  style={{
                    padding: "26px 24px",
                    borderRadius: "22px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    transform: `scale(${appAnim.scale}) translateZ(${appAnim.translateZ}px)`,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: "36px" }}>{app.icon}</span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>{app.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- PHASE 4: THE FIVERR CTA SINGULARITY (Frames 540 - 720) --- */}
      {/* Magenta Circle Explosion Sweep (scaleX: 1 -> 50) */}
      {explosionOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#d946ef",
            boxShadow: "0 0 100px #d946ef, 0 0 200px #8b5cf6",
            transform: `scaleX(${magentaCircleScaleX}) scaleY(${magentaCircleScaleX * 0.5})`,
            opacity: explosionOpacity,
            zIndex: 35,
          }}
        />
      )}

      {/* Final Text Lockup, CTA Button & Trust Badge */}
      {ctaOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: ctaOpacity,
            zIndex: 50,
          }}
        >
          {/* Primary CTA Headline */}
          <h1
            style={{
              margin: 0,
              fontSize: "72px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1.5px",
            }}
          >
            Custom n8n Workflows
          </h1>

          {/* Secondary Text */}
          <div
            style={{
              marginTop: "16px",
              fontSize: "36px",
              fontWeight: 400,
              color: "#a8b2d1",
            }}
          >
            Built, Hosted, and Scaled for your Business.
          </div>

          {/* Hire me on Fiverr Button */}
          <div
            style={{
              position: "relative",
              marginTop: "48px",
              padding: "22px 64px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)",
              boxShadow: "0 0 60px rgba(217, 70, 239, 0.6)",
              fontSize: "24px",
              fontWeight: 800,
              color: "#ffffff",
              transform: `translateY(${buttonTranslateY}px)`,
              cursor: "pointer",
            }}
          >
            Hire me on Fiverr →

            {/* Continuous Orbiting Star using Math.cos() & Math.sin() */}
            <div
              style={{
                position: "absolute",
                top: `calc(50% + ${orbitY}px)`,
                left: `calc(50% + ${orbitX}px)`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 14px #d946ef)",
                pointerEvents: "none",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M 16 0 Q 16 16, 32 16 Q 16 16, 16 32 Q 16 16, 0 16 Q 16 16, 16 0 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>
          </div>

          {/* Trust Badge: ⭐ 5.0 Top Rated Seller */}
          <div
            style={{
              marginTop: "28px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#facc15",
              opacity: badgeOpacity,
              transform: `translateY(${badgeTranslateY}px)`,
            }}
          >
            <span>⭐</span>
            <span>5.0 Top Rated Seller</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
