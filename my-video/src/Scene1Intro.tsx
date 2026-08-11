import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';


// Design Tokens
const T = {
  bgGradient: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
  bgGridDot: "rgba(32, 33, 36, 0.05)",
  textDark: "#202124",
  textMuted: "#5f6368",
  bluePrimary: "#0284c7",
  blueGlow: "rgba(2, 132, 199, 0.25)",
  glassBg: "rgba(255, 255, 255, 0.85)",
  glassBorder: "rgba(32, 33, 36, 0.08)",
  glassShadow: "0 24px 60px rgba(32, 33, 36, 0.08), 0 6px 16px rgba(32, 33, 36, 0.04)",
  cardShadow: "0 12px 30px rgba(32, 33, 36, 0.05), 0 2px 8px rgba(32, 33, 36, 0.03)",
};

// 8 App Badges for Orbit Ring
const APP_BADGES = [
  { name: "Figma", color: "#f24e1e", bg: "#fef2f2", label: "FIG" },
  { name: "Sheets", color: "#10b981", bg: "#ecfdf5", label: "XLS" },
  { name: "Stripe", color: "#6366f1", bg: "#eef2ff", label: "STR" },
  { name: "OpenAI", color: "#0f766e", bg: "#f0fdfa", label: "AI" },
  { name: "Webflow", color: "#146ef5", bg: "#eff6ff", label: "WEB" },
  { name: "LinkedIn", color: "#0284c7", bg: "#f0f9ff", label: "IN" },
  { name: "Slack", color: "#ec4899", bg: "#fdf2f8", label: "SLK" },
  { name: "Gmail", color: "#ef4444", bg: "#fef2f2", label: "MSG" },
];

const AppBadgeIcon: React.FC<{ name: string; color: string; label: string }> = ({ name, color, label }) => {
  if (name === "Figma") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2H8.5C6.567 2 5 3.567 5 5.5C5 7.433 6.567 9 8.5 9H12V2Z" fill="#F24E1E"/>
        <path d="M12 9H8.5C6.567 9 5 10.567 5 12.5C5 14.433 6.567 16 8.5 16H12V9Z" fill="#A259FF"/>
        <path d="M5 19.5C5 17.567 6.567 16 8.5 16H12V19.5C12 21.433 10.433 23 8.5 23C6.567 23 5 21.433 5 19.5Z" fill="#0ACF83"/>
        <circle cx="15.5" cy="5.5" r="3.5" fill="#FF7262"/>
        <circle cx="15.5" cy="12.5" r="3.5" fill="#1ABCFE"/>
      </svg>
    );
  }
  if (name === "Sheets") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="3" fill="#10B981"/>
        <path d="M7 8H17M7 12H17M7 16H13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "Stripe") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#6366F1"/>
        <path d="M13.5 8.5C13.5 8 13 7.5 12 7.5C10.5 7.5 9.5 8.5 9.5 9.8C9.5 12.5 14.5 11.5 14.5 14.2C14.5 15.8 13 16.5 11.5 16.5C10 16.5 8.5 15.5 8.5 14.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "OpenAI") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#0F766E"/>
        <path d="M12 6V18M6 12H18M7.75 7.75L16.25 16.25M16.25 7.75L7.75 16.25" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "Slack") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 15A2 2 0 0 1 4 13A2 2 0 0 1 6 11H9V15H6Z" fill="#E01E5A"/>
        <path d="M9 6A2 2 0 0 1 11 4A2 2 0 0 1 13 6V9H9V6Z" fill="#36C5F0"/>
        <path d="M18 9A2 2 0 0 1 20 11A2 2 0 0 1 18 13H15V9H18Z" fill="#2EB67D"/>
        <path d="M15 18A2 2 0 0 1 13 20A2 2 0 0 1 11 18V15H15V18Z" fill="#ECB22E"/>
      </svg>
    );
  }
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: color,
        color: "#fff",
        fontSize: 10,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </div>
  );
};

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Standard Physics Engine config as specified: stiffness: 220, damping: 22
  const standardSpringConfig = { stiffness: 220, damping: 22 };

  // 1. Central Profile Badge Drop-in (Frames 0 - 30)
  const anchorDropSpring = spring({
    frame,
    fps,
    config: standardSpringConfig,
  });
  const anchorDropScale = interpolate(anchorDropSpring, [0, 1], [0, 1]);
  const anchorDropYOffset = interpolate(anchorDropSpring, [0, 1], [-120, 0]);

  // 2. Radial App Orbit Ring Physics (Frame 30 Explosion -> Continuous Orbit -> Frame 200-240 Compression)
  const orbitExplodeSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: standardSpringConfig,
  });
  const orbitContractSpring = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: standardSpringConfig,
  });
  const orbitBaseRadius = frame >= 30 ? interpolate(orbitExplodeSpring, [0, 1], [0, 240]) : 0;
  const orbitRadius = frame < 200
    ? orbitBaseRadius
    : interpolate(orbitContractSpring, [0, 1], [240, 0]);

  // 3. Frame 60 Bold Typography Scale Up Physics
  const titleSpring = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: standardSpringConfig,
  });
  const titleScale = frame >= 60 ? interpolate(titleSpring, [0, 1], [0.6, 1]) : 0;
  const titleOpacity = frame >= 60
    ? interpolate(titleSpring, [0, 1], [0, 1]) *
      interpolate(frame, [200, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // 4. Frame 90 Subtitle Typing Progress
  const subtitleText = "I engineer digital ecosystems.";
  const typeProgress = interpolate(frame, [90, 170], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typedLength = frame >= 90 ? Math.floor(typeProgress * subtitleText.length) : 0;

  // 5. Exit Transition (Frames 200 - 240)
  // Central Circle glides to the far left side of the screen (translateX 960 -> 320)
  const anchorMoveExit = interpolate(frame, [200, 240], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const anchorX = frame < 200 ? 960 : interpolate(anchorMoveExit, [0, 1], [960, 320]);
  const anchorY = 540 + anchorDropYOffset + Math.sin(frame * 0.04) * 4;

  return (
    <AbsoluteFill
      style={{
        background: T.bgGradient,
        overflow: "hidden",
        fontFamily: `${fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      }}
    >
      {/* Background Dot Grid */}
      <div
        style={{
          position: "absolute",
          inset: -200,
          backgroundImage: `radial-gradient(${T.bgGridDot} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Central Concentric Anchor Node */}
      <div
        style={{
          position: "absolute",
          left: anchorX,
          top: anchorY,
          transform: `translate(-50%, -50%) scale(${anchorDropScale})`,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer Pulsing Aura */}
        <div
          style={{
            position: "absolute",
            width: 170 + Math.sin(frame * 0.08) * 10,
            height: 170 + Math.sin(frame * 0.08) * 10,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Profile Circle Badge with Initials "BN" */}
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
            border: `3px solid ${T.bluePrimary}`,
            boxShadow: T.glassShadow,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: T.textDark,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              BN
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: T.bluePrimary,
                letterSpacing: 1.5,
                marginTop: 4,
              }}
            >
              ARCHITECT
            </div>
          </div>
        </div>

        {/* Orbiting App Badges (Frame 30 radial explosion -> continuous clockwise orbit -> Frame 200 compression) */}
        {frame >= 30 &&
          APP_BADGES.map((badge, idx) => {
            const count = APP_BADGES.length;
            const angle = (idx / count) * Math.PI * 2 + frame * 0.015;
            const badgeX = Math.cos(angle) * orbitRadius;
            const badgeY = Math.sin(angle) * orbitRadius;
            const badgeScale = interpolate(orbitRadius, [0, 240], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: badgeX,
                  top: badgeY,
                  transform: `translate(-50%, -50%) scale(${badgeScale})`,
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: badge.bg,
                  border: `1.5px solid ${badge.color}30`,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppBadgeIcon name={badge.name} color={badge.color} label={badge.label} />
              </div>
            );
          })}
      </div>

      {/* Frame 60 Header Typography & Frame 90 Subtitle */}
      {frame >= 60 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 720,
            transform: `translateX(-50%) scale(${titleScale})`,
            textAlign: "center",
            opacity: titleOpacity,
            zIndex: 30,
          }}
        >
          {/* Main Title: Extra Bold Inter */}
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: T.textDark,
              letterSpacing: "-1.5px",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span>Benyamin Namtalashvili</span>
            <span style={{ color: T.bluePrimary, fontWeight: 900 }}>•</span>
            <span style={{ color: T.bluePrimary }}>The Digital Architect</span>
          </h1>

          {/* Subtitle: Typed Medium Inter (Frame 90+) */}
          {frame >= 90 && (
            <div
              style={{
                marginTop: 20,
                display: "inline-block",
                padding: "10px 28px",
                borderRadius: 999,
                backgroundColor: T.glassBg,
                border: `1.5px solid ${T.glassBorder}`,
                boxShadow: T.cardShadow,
                fontSize: 18,
                fontWeight: 500,
                color: T.textDark,
              }}
            >
              {subtitleText.substring(0, typedLength)}
              <span style={{ color: T.bluePrimary, opacity: frame % 30 < 15 ? 1 : 0, fontWeight: 700 }}>|</span>
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
