import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

// ─── BlueAlpha SVG Brand Mark ──────────────────────────────────────────────────
const BlueAlphaMark: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Outer glow ring */}
    <div
      style={{
        position: "absolute",
        width: size * 1.4,
        height: size * 1.4,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,88,244,0.3) 0%, transparent 70%)",
      }}
    />
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        fill="url(#blueGradV2)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M38 70 L50 35 L62 70 M42 58 L58 58"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="28" r="4" fill="white" opacity="0.9" />
      <defs>
        <linearGradient id="blueGradV2" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E58F4" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// ─── Main Export: <LogoReveal/> ─────────────────────────────────────────────────
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Avatar spring shrink config: { stiffness: 120, damping: 12, mass: 0.8 }
  const avatarSpring = spring({
    frame,
    fps,
    config: { stiffness: 120, damping: 12, mass: 0.8 },
  });
  const avatarScale = interpolate(avatarSpring, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo spring entry config: { stiffness: 120, damping: 12, mass: 0.8 }
  const logoSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { stiffness: 120, damping: 12, mass: 0.8 },
  });

  // "BlueAlpha" typography slide-in from right
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const textX = interpolate(frame, [15, 35], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Tagline fade in
  const taglineOpacity = interpolate(frame, [28, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Background color transition from soft purple to deep sky blue
  const bgProgress = interpolate(frame, [0, 59], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const sceneOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", opacity: sceneOpacity }}>
      {/* Background gradients */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 45%, #F0EFFF 0%, #E4E2F4 100%)",
          opacity: 1 - bgProgress,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 45%, #8ECAFF 0%, #1E58F4 100%)",
          opacity: bgProgress,
        }}
      />

      {/* White dot grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.05 * bgProgress,
          pointerEvents: "none",
        }}
      />

      {/* Center stage */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {/* Ghost avatar shrinking to 0 */}
        <div
          style={{
            position: "absolute",
            width: 120,
            height: 160,
            borderRadius: "60px 60px 20px 20px",
            background: "linear-gradient(180deg, #B794F4 0%, #9F7AEA 100%)",
            scale: String(avatarScale),
            boxShadow: "0 20px 60px rgba(167,139,250,0.3)",
            transformOrigin: "50% 50%",
          }}
        />

        {/* Brand mark springing into view */}
        <div
          style={{
            scale: String(logoSpring),
            transformOrigin: "50% 50%",
            filter: "drop-shadow(0 20px 40px rgba(30,88,244,0.35))",
          }}
        >
          <BlueAlphaMark size={140} />
        </div>

        {/* Brand name and tagline */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateX(${textX}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontFamily: "'Inter', 'Roboto', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: bgProgress > 0.5 ? "white" : "#1a1a2e",
              lineHeight: 1,
              textShadow: bgProgress > 0.5 ? "0 2px 20px rgba(30,88,244,0.3)" : "none",
            }}
          >
            BlueAlpha
          </div>
          <div
            style={{
              opacity: taglineOpacity,
              marginTop: 12,
              fontSize: 22,
              fontFamily: "'Inter', 'Roboto', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: bgProgress > 0.5 ? "rgba(255,255,255,0.7)" : "rgba(26,26,46,0.5)",
            }}
          >
            Measure · Analyze · Execute
          </div>
        </div>
      </div>
    </div>
  );
};
