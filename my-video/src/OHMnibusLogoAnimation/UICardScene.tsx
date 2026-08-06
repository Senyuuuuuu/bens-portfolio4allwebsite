import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface UICardSceneProps {
  isVertical: boolean;
}

export const UICardScene: React.FC<UICardSceneProps> = ({ isVertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cards data
  const cards = [
    {
      title: "SaaS Web Platform",
      badge: "App Engine",
      icon: "🚀",
      description: "High-performance React & Remotion workflow suite.",
      color: "#8B5CF6",
    },
    {
      title: "Vector Design Tokens",
      badge: "Design System",
      icon: "🎨",
      description: "Adaptive typography, liquid glass & HSL color tokens.",
      color: "#06B6D4",
    },
    {
      title: "n8n Workflow Nodes",
      badge: "Automation",
      icon: "⚡",
      description: "Autonomous post-render streaming & cloud webhooks.",
      color: "#EC4899",
    },
  ];

  // Phase 1 Card Stagger Animations (Frames 0-45)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        gap: isVertical ? "32px" : "40px",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: isVertical ? "40px 60px" : "60px 100px",
      }}
    >
      {cards.map((card, index) => {
        // Staggered entry spring for each card
        const cardDelay = index * 6;
        const cardSpring = spring({
          frame: Math.max(0, frame - cardDelay),
          fps,
          config: { stiffness: 120, damping: 14 },
        });

        // Floating hover animation based on sine wave
        const floatOffset = Math.sin((frame / fps) * Math.PI * 2 + index * 1.2) * 8;

        const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1.0]);
        const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

        return (
          <div
            key={index}
            style={{
              flex: 1,
              maxWidth: isVertical ? "100%" : "380px",
              width: isVertical ? "85%" : "auto",
              backgroundColor: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(16px)",
              borderRadius: "24px",
              padding: isVertical ? "28px 32px" : "32px 36px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
              transform: `scale(${cardScale}) translateY(${floatOffset}px)`,
              opacity: cardOpacity,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transition: "transform 0.2s ease",
            }}
          >
            {/* Header Badge & Icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  padding: "8px 14px",
                  backgroundColor: `${card.color}15`,
                  borderRadius: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: isVertical ? "13px" : "14px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: card.color,
                  backgroundColor: `${card.color}12`,
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {card.badge}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: isVertical ? "24px" : "26px",
                fontWeight: 800,
                color: "#0F172A",
                margin: 0,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {card.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: isVertical ? "15px" : "16px",
                lineHeight: 1.5,
                color: "#64748B",
                margin: 0,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {card.description}
            </p>

            {/* Visual Indicator Progress Bar */}
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "#F1F5F9",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  width: `${65 + index * 15}%`,
                  height: "100%",
                  backgroundColor: card.color,
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
