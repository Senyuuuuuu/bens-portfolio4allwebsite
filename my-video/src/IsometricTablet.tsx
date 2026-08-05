import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";

export const IsometricTablet: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Total duration: 6 seconds = 360 frames @ 60fps
  // Phase 1 (0 to 60 frames): Entry Shape Morph from Scene 1 merged container (480x320, r=24) into 3D Tablet (950x690, r=36)
  // Phase 2 (60 to 300 frames): Continuous Idle Float & Bento Grid Reveal
  // Phase 3 (300 to 360 frames): Hero Card Boundary Morph into Full 100vw/100vh Scene 3 Dashboard

  // --- PHASE 1: ENTRY MORPH FROM SCENE 1 CONTAINER ---
  const entrySpring = spring({
    frame,
    fps,
    config: { mass: 1, damping: 14, stiffness: 120 },
  });

  const entryProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Tablet dimensions morphing from entry container (480x320) to full tablet size (950x690)
  const tabletWidth = interpolate(entryProgress, [0, 1], [480, 950]);
  const tabletHeight = interpolate(entryProgress, [0, 1], [320, 690]);
  const tabletRadius = interpolate(entryProgress, [0, 1], [24, 36]);

  // Phase 1 3D Reveal Pose
  const baseScale = interpolate(entryProgress, [0, 1], [1.1, 0.85]);
  const baseTranslateY = interpolate(entryProgress, [0, 1], [200, 0]);
  const baseRotateX = interpolate(entryProgress, [0, 1], [40, 25]);
  const rotateZ = interpolate(entryProgress, [0, 1], [-20, -12]);

  // --- PHASE 2: CONTINUOUS IDLE FLOAT (60 to 300 frames) ---
  const floatCycle = (frame / 60) * ((2 * Math.PI) / 3);
  const floatY = Math.sin(floatCycle) * 8 * entryProgress;
  const floatRotX = Math.sin(floatCycle) * 1 * entryProgress;

  const translateY = baseTranslateY + floatY;
  const rotateX = baseRotateX + floatRotX;

  // Staggered Bento Cards Spring Entry (frames 72, 82, 92)
  const getCardAnim = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { mass: 1, damping: 14, stiffness: 120 },
    });
    return {
      scale: interpolate(s, [0, 1], [0.6, 1]),
      opacity: interpolate(s, [0, 1], [0, 1]),
      translateY: interpolate(s, [0, 1], [40, 0]),
    };
  };

  const card1Anim = getCardAnim(72);
  const card2Anim = getCardAnim(82);
  const card3Anim = getCardAnim(83);

  // --- PHASE 3: HERO CARD BOUNDARY MORPH INTO SCENE 3 DASHBOARD (300 to 360 frames) ---
  const exitMorphProgress = interpolate(frame, [300, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.85, 0, 0.15, 1),
  });

  // Hero Card expansion from internal tablet card (width: 48%, height: 100%, r=24) outward to full 1920x1080 (r=0)
  const heroCardWidth = interpolate(exitMorphProgress, [0, 1], [432, 1920]);
  const heroCardHeight = interpolate(exitMorphProgress, [0, 1], [592, 1080]);
  const heroCardRadius = interpolate(exitMorphProgress, [0, 1], [24, 0]);

  // Camera push into screen during exit morph
  const cameraPushScale = interpolate(exitMorphProgress, [0, 1], [baseScale, 3.2]);
  const cameraFlattenRotX = interpolate(exitMorphProgress, [0, 1], [rotateX, 0]);
  const cameraFlattenRotZ = interpolate(exitMorphProgress, [0, 1], [rotateZ, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0f",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: "1600px",
          height: "1600px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(94, 92, 230, 0.18) 0%, rgba(94, 92, 230, 0) 50%)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Isometric Tablet Device */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${heroCardWidth > 450 ? 950 + (heroCardWidth - 432) * 2 : tabletWidth}px`,
          height: `${tabletHeight}px`,
          backgroundColor: "#08080a",
          borderRadius: `${tabletRadius}px`,
          padding: "24px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "20px 60px 140px rgba(0, 0, 0, 0.7), 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 2px rgba(255, 255, 255, 0.3)",
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          transform: `translate(-50%, -50%) perspective(1500px) translateY(${translateY}px) rotateX(${cameraFlattenRotX}deg) rotateZ(${cameraFlattenRotZ}deg) scale(${cameraPushScale})`,
          boxSizing: "border-box",
        }}
      >
        {/* Tablet Screen */}
        <div
          style={{
            position: "relative",
            width: "900px",
            height: "640px",
            backgroundColor: "#0b0c10",
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            padding: "24px",
            boxSizing: "border-box",
            background:
              "radial-gradient(circle at 80% 20%, rgba(94, 92, 230, 0.12) 0%, rgba(11, 12, 16, 1) 70%)",
          }}
        >
          {/* Hero Card 1 (Morphing Outward to Full Dashboard Background in Phase 3) */}
          <div
            style={{
              width: `${heroCardWidth}px`,
              height: `${heroCardHeight}px`,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              borderRadius: `${heroCardRadius}px`,
              padding: "28px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: card1Anim.opacity,
              transform: `scale(${card1Anim.scale}) translateY(${card1Anim.translateY}px)`,
              zIndex: 10,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#5e5ce6",
                    boxShadow: "0 0 12px #5e5ce6",
                  }}
                />
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Revenue Analytics
                </span>
              </div>
              <h2
                style={{
                  color: "#ffffff",
                  fontSize: "36px",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-1px",
                }}
              >
                $284,950.00
              </h2>
              <span style={{ color: "#30d158", fontSize: "14px", fontWeight: 600, marginTop: "4px", display: "inline-block" }}>
                ↑ +24.8% this month
              </span>
            </div>

            {/* Glowing Chart Line Visual */}
            <div style={{ position: "relative", width: "100%", height: "140px", marginTop: "20px" }}>
              <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5e5ce6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#5e5ce6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 100 Q 60 40, 120 70 T 240 20 T 300 40 L 300 120 L 0 120 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M 0 100 Q 60 40, 120 70 T 240 20 T 300 40"
                  fill="none"
                  stroke="#5e5ce6"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Active Nodes</span>
              <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "14px" }}>1,024 Verified</span>
            </div>
          </div>

          {/* Right Column (Cards 2 & 3) */}
          <div
            style={{
              width: "48%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: 1 - exitMorphProgress,
            }}
          >
            {/* Card 2 */}
            <div
              style={{
                width: "100%",
                height: "47%",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "24px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: card2Anim.opacity,
                transform: `scale(${card2Anim.scale}) translateY(${card2Anim.translateY}px)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", fontWeight: 600 }}>SYSTEM THROUGHPUT</span>
                <span style={{ backgroundColor: "rgba(94, 92, 230, 0.2)", color: "#a5a3ff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "12px" }}>LIVE</span>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}>99.98%</div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                width: "100%",
                height: "47%",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "24px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: card3Anim.opacity,
                transform: `scale(${card3Anim.scale}) translateY(${card3Anim.translateY}px)`,
              }}
            >
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", fontWeight: 600 }}>QUANTUM ENCRYPTION</span>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", marginTop: "4px" }}>AES-256 Active</div>
              </div>
              <div style={{ fontSize: "20px" }}>🛡️</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
