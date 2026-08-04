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

  // Phase 1: Device Reveal (0 to 2 seconds = 0 to 120 frames at 60fps)
  const revealProgress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const baseScale = interpolate(revealProgress, [0, 1], [1.5, 0.85]);
  const baseTranslateY = interpolate(revealProgress, [0, 1], [500, 0]);
  const baseRotateX = interpolate(revealProgress, [0, 1], [60, 25]);
  const rotateZ = interpolate(revealProgress, [0, 1], [-25, -12]);
  const opacity = interpolate(revealProgress, [0, 1], [0, 1]);

  // Phase 2: Continuous Idle Float (2 to 6 seconds)
  // 3-second sinusoidal cycle = 180 frames loop
  const floatCycle = (frame / 60) * ((2 * Math.PI) / 3);
  const floatY = Math.sin(floatCycle) * 8 * revealProgress;
  const floatRotX = Math.sin(floatCycle) * 1 * revealProgress;

  const translateY = baseTranslateY + floatY;
  const rotateX = baseRotateX + floatRotX;

  // Phase 3: Bento Grid Card Spring Animations (Triggered at 1.2s = 72 frames)
  const cardDelays = [72, 82, 92];

  const getCardAnim = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { mass: 1, damping: 14, stiffness: 120 },
    });
    const cScale = interpolate(s, [0, 1], [0.6, 1]);
    const cOpacity = interpolate(s, [0, 1], [0, 1]);
    const cTranslateY = interpolate(s, [0, 1], [40, 0]);
    return { scale: cScale, opacity: cOpacity, translateY: cTranslateY };
  };

  const card1Anim = getCardAnim(cardDelays[0]);
  const card2Anim = getCardAnim(cardDelays[1]);
  const card3Anim = getCardAnim(cardDelays[2]);

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
      {/* Background Subtle Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "1600px",
          height: "1600px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(94, 92, 230, 0.15) 0%, rgba(94, 92, 230, 0) 50%)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Isometric Tablet Device */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "950px",
          height: "690px",
          backgroundColor: "#08080a",
          borderRadius: "36px",
          padding: "24px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "20px 60px 140px rgba(0, 0, 0, 0.7), 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 2px rgba(255, 255, 255, 0.3)",
          opacity,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          transform: `translate(-50%, -50%) perspective(1500px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${baseScale})`,
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
          {/* Glassmorphic Bento Cards Container */}

          {/* Card 1: Left Hero Card (50% Width, 100% Height) */}
          <div
            style={{
              width: "48%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              padding: "28px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: card1Anim.opacity,
              transform: `scale(${card1Anim.scale}) translateY(${card1Anim.translateY}px)`,
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

          {/* Right Column (Cards 2 & 3 - 48% Width) */}
          <div
            style={{
              width: "48%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Card 2: Top Right (46% Height) */}
            <div
              style={{
                width: "100%",
                height: "47%",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
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
                <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", fontWeight: 600 }}>
                  SYSTEM THROUGHPUT
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(94, 92, 230, 0.2)",
                    color: "#a5a3ff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "12px",
                    border: "1px solid rgba(94, 92, 230, 0.4)",
                  }}
                >
                  LIVE
                </span>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}>
                99.98<span style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)" }}>%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "92%",
                    height: "100%",
                    background: "linear-gradient(90deg, #5e5ce6, #64d2ff)",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>

            {/* Card 3: Bottom Right (46% Height) */}
            <div
              style={{
                width: "100%",
                height: "47%",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
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
                <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", fontWeight: 600 }}>
                  QUANTUM ENCRYPTION
                </span>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", marginTop: "4px" }}>
                  AES-256 Active
                </div>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(48, 209, 88, 0.15)",
                  border: "1px solid rgba(48, 209, 88, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🛡️
              </div>
            </div>
          </div>

          {/* Screen Glare Reflection Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(105deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 40%)",
              pointerEvents: "none",
              borderRadius: "20px",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
