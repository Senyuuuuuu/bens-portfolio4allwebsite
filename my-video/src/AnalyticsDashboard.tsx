import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";

export const AnalyticsDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Phase 1: Match-Cut Zoom Transition (0.0s to 1.2s = 0 to 72 frames)

  // Phase 2: UI Activation & Metrics (1.2s to 3.8s = 72 to 228 frames)
  const fullUiOpacity = interpolate(frame, [45, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Number Counter Animations
  const revenueNum = Math.floor(
    interpolate(frame, [72, 150], [0, 128450], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  const retentionNum = interpolate(frame, [72, 150], [0, 98.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  }).toFixed(1);

  const growthNum = Math.floor(
    interpolate(frame, [72, 150], [0, 42], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  // SVG Path Draw Animation
  const pathTotalLength = 800;
  const strokeDashoffset = interpolate(frame, [72, 180], [pathTotalLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Tip of the curve particle coordinates (approximated along SVG path)
  const particleProgress = interpolate(frame, [72, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleX = interpolate(particleProgress, [0, 1], [0, 750]);
  // Curved height trajectory
  const particleY =
    90 - Math.sin(particleProgress * Math.PI * 1.5) * 50 + (1 - particleProgress) * 20;

  // Action Pills Spring Animations
  const getPillSpring = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { stiffness: 150, damping: 12 },
    });
    const opacity = interpolate(s, [0, 1], [0, 1]);
    const translateX = interpolate(s, [0, 1], [80, 0]);
    return { opacity, translateX };
  };

  const pill1 = getPillSpring(72);
  const pill2 = getPillSpring(84);
  const pill3 = getPillSpring(96);

  // Phase 3: Multi-Device Pull-Back Outro (3.5s to 6.0s = 210 to 360 frames)
  const pullBackProgress = interpolate(frame, [228, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const containerScale = interpolate(pullBackProgress, [0, 1], [1, 0.65]);
  const containerRotateX = interpolate(pullBackProgress, [0, 1], [0, 14]);

  // Synchronized Hover Idle Loop (Frames 220+)
  const hoverCycle = (frame / 60) * ((2 * Math.PI) / 2.5);
  const hoverY = Math.sin(hoverCycle) * 6 * pullBackProgress;

  // Companion Device Springs
  const companionSpring = spring({
    frame: frame - 235,
    fps,
    config: { mass: 1, damping: 16, stiffness: 100 },
  });

  const phoneTranslateX = interpolate(companionSpring, [0, 1], [380, 260]);
  const phoneRotateY = interpolate(companionSpring, [0, 1], [0, -18]);
  const phoneOpacity = interpolate(companionSpring, [0, 1], [0, 1]);

  const laptopTranslateX = interpolate(companionSpring, [0, 1], [-380, -260]);
  const laptopRotateY = interpolate(companionSpring, [0, 1], [0, 18]);
  const laptopOpacity = interpolate(companionSpring, [0, 1], [0, 1]);

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
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "1600px",
          height: "1600px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(13, 13, 15, 0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Multi-Device Stage */}
      <div
        style={{
          position: "relative",
          width: "1920px",
          height: "1080px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          transform: `perspective(1500px) rotateX(${containerRotateX}) translateY(${hoverY}px) scale(${containerScale})`,
        }}
      >
        {/* Left Companion Device (Laptop Mockup Behind) */}
        <div
          style={{
            position: "absolute",
            width: "560px",
            height: "360px",
            backgroundColor: "#16171d",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            opacity: laptopOpacity,
            transform: `translateX(${laptopTranslateX}px) translateZ(-100px) rotateY(${laptopRotateY}deg)`,
            padding: "16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>
          <div
            style={{
              width: "100%",
              height: "260px",
              backgroundColor: "#0f1015",
              borderRadius: "12px",
              padding: "16px",
              boxSizing: "border-box",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "8px" }}>
              COMMAND CENTER
            </div>
            <div style={{ color: "#6366f1", fontWeight: 700, fontSize: "20px" }}>
              Cluster Status: Operational
            </div>
          </div>
        </div>

        {/* Right Companion Device (iPhone Mockup In Front) */}
        <div
          style={{
            position: "absolute",
            width: "240px",
            height: "480px",
            backgroundColor: "#1c1d24",
            borderRadius: "40px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
            opacity: phoneOpacity,
            transform: `translateX(${phoneTranslateX}px) translateZ(80px) rotateY(${phoneRotateY}deg)`,
            padding: "12px",
            boxSizing: "border-box",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#121318",
              borderRadius: "32px",
              padding: "20px 16px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "18px",
                backgroundColor: "#000000",
                borderRadius: "12px",
                margin: "0 auto 12px auto",
              }}
            />
            <div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>MOBILE NOTIFICATIONS</span>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px", marginTop: "4px" }}>
                +$12,450.00
              </div>
            </div>
            <div
              style={{
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                color: "#818cf8",
                padding: "8px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Payment Confirmed
            </div>
          </div>
        </div>

        {/* Primary Central Tablet & Full-Bleed Dashboard UI */}
        <div
          style={{
            position: "relative",
            width: "1000px",
            height: "680px",
            backgroundColor: "#121318",
            borderRadius: "28px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 50px 120px rgba(0, 0, 0, 0.8)",
            padding: "32px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: fullUiOpacity,
            zIndex: 5,
          }}
        >
          {/* Header Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "#6366f1",
                  boxShadow: "0 0 14px #6366f1",
                }}
              />
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.5px" }}>
                NEXUS ANALYTICS
              </span>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Realtime Data
              </div>
            </div>
          </div>

          {/* Three Metric Counter Boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "16px" }}>
            {/* Stat 1: Revenue */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", fontWeight: 600 }}>
                TOTAL REVENUE
              </span>
              <div style={{ color: "#ffffff", fontSize: "26px", fontWeight: 700, marginTop: "4px" }}>
                ${revenueNum.toLocaleString()}
              </div>
            </div>

            {/* Stat 2: Retention */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", fontWeight: 600 }}>
                RETENTION RATE
              </span>
              <div style={{ color: "#34d399", fontSize: "26px", fontWeight: 700, marginTop: "4px" }}>
                {retentionNum}%
              </div>
            </div>

            {/* Stat 3: Growth */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", fontWeight: 600 }}>
                MoM GROWTH
              </span>
              <div style={{ color: "#818cf8", fontSize: "26px", fontWeight: 700, marginTop: "4px" }}>
                +{growthNum}%
              </div>
            </div>
          </div>

          {/* SVG Line Chart Draw Area */}
          <div style={{ position: "relative", width: "100%", height: "240px", marginTop: "16px" }}>
            <svg width="100%" height="100%" viewBox="0 0 750 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area Gradient Fill Under Curve */}
              <path
                d="M 0 140 Q 150 40, 300 90 T 600 30 T 750 60 L 750 160 L 0 160 Z"
                fill="url(#areaGradient)"
              />

              {/* Vector Revenue Line */}
              <path
                d="M 0 140 Q 150 40, 300 90 T 600 30 T 750 60"
                fill="none"
                stroke="#6366f1"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={pathTotalLength}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Glowing Tip Particle */}
            {particleProgress > 0 && particleProgress < 1 && (
              <div
                style={{
                  position: "absolute",
                  left: `${particleX}px`,
                  top: `${particleY}px`,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 16px 6px #6366f1, 0 0 4px #ffffff",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>

          {/* Staggered Action Toast Pills (Bottom Right) */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              right: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Pill 1 */}
            <div
              style={{
                backgroundColor: "rgba(20, 21, 30, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "10px 18px",
                borderRadius: "30px",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                opacity: pill1.opacity,
                transform: `translateX(${pill1.translateX}px)`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>💳</span> New Enterprise Subscription — <span style={{ color: "#34d399" }}>+$299/mo</span>
            </div>

            {/* Pill 2 */}
            <div
              style={{
                backgroundColor: "rgba(20, 21, 30, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "10px 18px",
                borderRadius: "30px",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                opacity: pill2.opacity,
                transform: `translateX(${pill2.translateX}px)`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚡</span> Stripe Payout Executed — <span style={{ color: "#818cf8" }}>+$14,250.00</span>
            </div>

            {/* Pill 3 */}
            <div
              style={{
                backgroundColor: "rgba(20, 21, 30, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "10px 18px",
                borderRadius: "30px",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                opacity: pill3.opacity,
                transform: `translateX(${pill3.translateX}px)`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🚀</span> API Cluster Auto-Scaled — <span style={{ color: "#60a5fa" }}>+64 Nodes</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
