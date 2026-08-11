import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Pure Physics Calculation Helper (No React hooks inside loops/conditionals)
const calculateSpring = (
  frame: number,
  fps: number,
  delayFrames = 0,
  stiffness = 340,
  damping = 18,
  mass = 0.6
) => {
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: {
      stiffness,
      damping,
      mass,
    },
  });
};

// Camera Easing Engine: Bezier(0.16, 1, 0.3, 1)
const cameraEasing = Easing.bezier(0.16, 1, 0.3, 1);

// Glassmorphism System Optimized for 1080p (1920x1080 @ 60 FPS)
const glassStyle: React.CSSProperties = {
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.78)",
  border: "1.5px solid rgba(255, 255, 255, 0.9)",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)",
  borderRadius: 24,
};

const glassPillStyle: React.CSSProperties = {
  ...glassStyle,
  borderRadius: 999,
  padding: "14px 32px",
};

export const HighlanderSaaSAd: React.FC = () => {
  // Top level hooks ONLY
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Total duration: 3240 frames (54s @ 60 FPS in 1080p: 1920x1080)

  // --------------------------------------------------------------------------
  // GLOBAL CAMERA & BACKGROUND ENGINE
  // --------------------------------------------------------------------------
  const bgGradAngle = interpolate(frame, [0, 3240], [120, 480]);
  const bgChromatic = interpolate(frame, [180, 240, 1680, 1740], [0, 6, 0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOutOpacity = interpolate(frame, [3210, 3240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --------------------------------------------------------------------------
  // PHASE 1: Kinetic Intro & Hook (0:00 - 0:03 | Frames 0 - 180)
  // --------------------------------------------------------------------------
  const p1Active = frame < 190;
  const p1LogoSpring = calculateSpring(frame, fps, 0);
  const p1RotateY = interpolate(p1LogoSpring, [0, 1], [-15, 0]);
  
  const p1Msg1Spring = calculateSpring(frame, fps, 15);
  const p1Msg2Spring = calculateSpring(frame, fps, 30);

  // Fast whip-zoom passing through card
  const p1WhipZoom = interpolate(frame, [150, 180], [1, 4.2], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p1WhipOpacity = interpolate(frame, [165, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --------------------------------------------------------------------------
  // PHASE 2: Typographic Growth & Layout Morph (0:03 - 0:08 | Frames 180 - 480)
  // --------------------------------------------------------------------------
  const p2Active = frame >= 175 && frame < 500;
  const p2ChartY = interpolate(frame, [200, 270], [1080, 0], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p2XBackTilt = interpolate(frame, [360, 440], [0, 12], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const p2Tag1Spring = calculateSpring(frame, fps, 260);
  const p2Tag2Spring = calculateSpring(frame, fps, 290);

  // --------------------------------------------------------------------------
  // PHASE 3: Interactive Micro-Interactions (0:09 - 0:14 | Frames 480 - 840)
  // --------------------------------------------------------------------------
  const p3Active = frame >= 470 && frame < 860;
  const p3PanX = interpolate(frame, [720, 840], [0, -1920], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3LensBlur = interpolate(frame, [750, 810], [0, 16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const p3CursorX = interpolate(frame, [540, 640], [1200, 960], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3CursorY = interpolate(frame, [540, 640], [800, 570], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3PressScale = interpolate(frame, [640, 655, 670], [1, 0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3RippleScale = interpolate(frame, [645, 710], [0, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --------------------------------------------------------------------------
  // PHASE 4: Depth-Field Walkthrough (0:14 - 0:28 | Frames 840 - 1680)
  // --------------------------------------------------------------------------
  const p4Active = frame >= 840 && frame < 1700;
  const p4ZPushZoom = interpolate(frame, [1450, 1680], [1, 2.0], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p4BackgroundBlur = interpolate(frame, [900, 1000], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const p4SliderValue = interpolate(frame, [1100, 1380], [0, 85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --------------------------------------------------------------------------
  // PHASE 5: High-Density Analytics (0:28 - 0:35 | Frames 1680 - 2100)
  // --------------------------------------------------------------------------
  const p5Active = frame >= 1670 && frame < 2120;
  const p5CardFlipY = interpolate(frame, [1680, 1760], [90, 0], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p5CounterValue = Math.round(interpolate(frame, [1720, 2000], [1000000, 4200000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const p5GraphDash = interpolate(frame, [1740, 1980], [1000, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --------------------------------------------------------------------------
  // PHASE 6: Feature Blitz Sequence (0:36 - 0:41 | Frames 2100 - 2460)
  // --------------------------------------------------------------------------
  const p6Beat = Math.floor(Math.max(0, frame - 2100) / 120); // 0, 1, 2
  const p6LockSnapSpring = calculateSpring(frame, fps, 2220);
  const p6GlobeSpinY = interpolate(frame, [2340, 2460], [0, 360]);

  // --------------------------------------------------------------------------
  // PHASE 7: Branded Grand Finale (0:41 - 0:54 | Frames 2460 - 3240)
  // --------------------------------------------------------------------------
  const p7Active = frame >= 2450;
  const p7BracketLeftX = interpolate(frame, [2460, 2560], [-400, 200], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p7BracketRightX = interpolate(frame, [2460, 2560], [400, -200], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p7CtaSpring = calculateSpring(frame, fps, 2520);
  
  // Character Shuffle URL Morphing
  const fullUrl = "www.highlander.ai";
  const ctaText = "Let's Raise ⚡";
  const morphProgress = interpolate(frame, [2700, 2780], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayedText = morphProgress < 0.5 ? ctaText : fullUrl;

  return (
    <AbsoluteFill
      style={{
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        opacity: fadeOutOpacity,
        backgroundColor: "#FFFFFF",
        perspective: 1200,
      }}
    >
      {/* 🌊 WebGL Fluid Gradient Canvas */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${bgGradAngle}deg, #FFFFFF 0%, #DCE6F8 50%, #1E40AF 100%)`,
          filter: bgChromatic > 0 ? `hue-rotate(${bgChromatic * 4}deg)` : "none",
        }}
      />

      {/* ==================================================================== */}
      {/* PHASE 1: Kinetic Intro & Hook */}
      {/* ==================================================================== */}
      {p1Active && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: p1WhipOpacity,
            transform: `scale(${p1WhipZoom}) rotateY(${p1RotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* 3D Brand Mark */}
          <div
            style={{
              ...glassPillStyle,
              background: "rgba(30, 64, 175, 0.92)",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: 36,
              letterSpacing: "-0.03em",
              transform: `scale(${p1LogoSpring})`,
              marginBottom: 40,
              boxShadow: "0 20px 50px rgba(30, 64, 175, 0.35)",
            }}
          >
            ⚡ HIGHLANDER SAAS
          </div>

          {/* Cascading Glass Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 550 }}>
            <div
              style={{
                ...glassStyle,
                padding: "20px 28px",
                transform: `translateY(${(1 - p1Msg1Spring) * 60}px) scale(${p1Msg1Spring})`,
                fontSize: 20,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              "Are you ready to scale your B2B raise?" 🚀
            </div>

            <div
              style={{
                ...glassStyle,
                background: "rgba(30, 64, 175, 0.88)",
                color: "#FFFFFF",
                padding: "20px 28px",
                transform: `translateY(${(1 - p1Msg2Spring) * 60}px) scale(${p1Msg2Spring})`,
                fontSize: 20,
                fontWeight: 700,
                alignSelf: "flex-end",
              }}
            >
              "We need instant institutional capital." 💎
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* PHASE 2: Typographic Growth & Layout Morph */}
      {/* ==================================================================== */}
      {p2Active && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `rotateX(${p2XBackTilt}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Per-letter 3D "GROW" Flips */}
          <div style={{ position: "absolute", display: "flex", gap: 10 }}>
            {["G", "R", "O", "W"].map((char, idx) => {
              const charSpring = calculateSpring(frame, fps, 180 + idx * 8);
              return (
                <div
                  key={idx}
                  style={{
                    fontSize: 260,
                    fontWeight: 900,
                    color: "rgba(30, 64, 175, 0.07)",
                    transform: `rotateX(${(1 - charSpring) * 90}deg) scale(${charSpring})`,
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>

          {/* Glass Chart Card */}
          <div
            style={{
              ...glassStyle,
              width: 1300,
              height: 680,
              transform: `translateY(${p2ChartY}px)`,
              padding: 48,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em" }}>
                Highlander Capital OS
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div
                  style={{
                    ...glassPillStyle,
                    transform: `scale(${p2Tag1Spring})`,
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#DC2626",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  ✖ Manual Friction
                </div>
                <div
                  style={{
                    ...glassPillStyle,
                    transform: `scale(${p2Tag2Spring})`,
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "#16A34A",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  ✓ Autonomous Valuation
                </div>
              </div>
            </div>

            {/* Glowing Data Bars */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 32, marginTop: 40 }}>
              {[40, 65, 50, 85, 95, 120, 160].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * 2.5}px`,
                    background: "linear-gradient(180deg, #60A5FA 0%, #1E40AF 100%)",
                    borderRadius: 16,
                    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
                    transform: `scaleY(${Math.min(1, Math.max(0, (frame - 240 - i * 12) / 30))})`,
                    transformOrigin: "bottom",
                  }}
                />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* PHASE 3: Interactive Micro-Interactions */}
      {/* ==================================================================== */}
      {p3Active && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `translateX(${p3PanX}px)`,
            filter: p3LensBlur > 0 ? `blur(${p3LensBlur}px)` : "none",
          }}
        >
          {/* Card Stack */}
          <div
            style={{
              ...glassStyle,
              width: 1000,
              height: 550,
              padding: 50,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 900, color: "#1E40AF" }}>
              Raising, Reimagined.
            </div>

            <div style={{ position: "relative", alignSelf: "flex-start" }}>
              <div
                style={{
                  ...glassPillStyle,
                  background: "#1E40AF",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: 26,
                  transform: `scale(${p3PressScale})`,
                }}
              >
                Just Clicks ⚡
              </div>

              {/* Ripple Impact */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 200,
                  height: 60,
                  borderRadius: 999,
                  border: "2px solid #60A5FA",
                  transform: `translate(-50%, -50%) scale(${p3RippleScale})`,
                  opacity: Math.max(0, 1 - p3RippleScale / 2.5),
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Precision Cursor */}
          <div
            style={{
              position: "absolute",
              left: p3CursorX,
              top: p3CursorY,
              zIndex: 200,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </svg>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* PHASE 4: Depth-Field Walkthrough */}
      {/* ==================================================================== */}
      {p4Active && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${p4ZPushZoom})`,
            filter: p4BackgroundBlur > 0 ? `blur(${p4BackgroundBlur}px)` : "none",
          }}
        >
          {/* Master Form Card */}
          <div
            style={{
              ...glassStyle,
              width: 1200,
              height: 700,
              padding: 48,
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A" }}>
              Setup Your Raise (Deep Dive)
            </div>

            {/* Reactive Spring Counter Slider */}
            <div
              style={{
                ...glassStyle,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1E40AF" }}>
                Target Allocation: {Math.round(p4SliderValue)}%
              </div>
              <div
                style={{
                  width: "100%",
                  height: 16,
                  backgroundColor: "rgba(226, 232, 240, 0.9)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${p4SliderValue}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #60A5FA 0%, #1E40AF 100%)",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* PHASE 5: High-Density Analytics */}
      {/* ==================================================================== */}
      {p5Active && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `rotateY(${p5CardFlipY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              width: 1400,
            }}
          >
            {/* Analytics Card 1 */}
            <div style={{ ...glassStyle, padding: 36, height: 320 }}>
              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>
                High-Density Analytics
              </div>

              <svg width="550" height="180" viewBox="0 0 550 180">
                <path
                  d="M 10 150 Q 150 10 300 110 T 540 20"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="6"
                  strokeDasharray="1000"
                  strokeDashoffset={p5GraphDash}
                />
              </svg>
            </div>

            {/* Analytics Card 2 */}
            <div style={{ ...glassStyle, padding: 36, height: 320 }}>
              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>
                Live Committed Capital
              </div>
              <div style={{ fontSize: 60, fontWeight: 900, color: "#16A34A" }}>
                ${(p5CounterValue / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* PHASE 6: Feature Blitz Sequence */}
      {/* ==================================================================== */}
      {p6Beat === 0 && frame >= 2100 && frame < 2460 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ ...glassStyle, padding: "40px 60px", fontSize: 48, fontWeight: 900 }}>
            ⌨️ 24/7 Global Investor Desk
          </div>
        </AbsoluteFill>
      )}

      {p6Beat === 1 && frame >= 2100 && frame < 2460 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              ...glassStyle,
              padding: "40px 60px",
              fontSize: 48,
              fontWeight: 900,
              transform: `scale(${p6LockSnapSpring})`,
            }}
          >
            🔒 Enterprise Grade Security
          </div>
        </AbsoluteFill>
      )}

      {p6Beat >= 2 && frame >= 2100 && frame < 2460 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: 400,
              height: 400,
              borderRadius: 999,
              border: "4px dashed #2563EB",
              transform: `rotateY(${p6GlobeSpinY}deg)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div style={{ ...glassPillStyle, position: "absolute", top: -20, fontSize: 20 }}>
              🇺🇸 US Institutional
            </div>
            <div style={{ ...glassPillStyle, position: "absolute", bottom: -20, fontSize: 20 }}>
              🇬🇧 UK Angels
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* PHASE 7: Branded Grand Finale */}
      {/* ==================================================================== */}
      {p7Active && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              left: p7BracketLeftX,
              fontSize: 160,
              fontWeight: 900,
              color: "#1E40AF",
            }}
          >
            [
          </div>
          <div
            style={{
              position: "absolute",
              right: p7BracketRightX,
              fontSize: 160,
              fontWeight: 900,
              color: "#1E40AF",
            }}
          >
            ]
          </div>

          <div
            style={{
              ...glassPillStyle,
              transform: `scale(${p7CtaSpring})`,
              background: "#1E40AF",
              color: "#FFFFFF",
              padding: "24px 64px",
              boxShadow: "0 25px 60px rgba(30, 64, 175, 0.45)",
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em" }}>
              {displayedText}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
