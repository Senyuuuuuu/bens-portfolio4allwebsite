import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";

export const Fiverrn8nGigAd: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Total duration: 7 seconds = 420 frames @ 60fps

  // --- PHASE 1: PAIN POINT & MAGIC CURSOR (0.0s to 2.0s = 0 to 120 frames) ---

  // Card Entry (0 to 30 frames)
  const cardEntry = spring({
    frame,
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 120 },
  });

  const cardEntryScale = interpolate(cardEntry, [0, 1], [0.7, 1.0]);
  const cardEntryOpacity = interpolate(cardEntry, [0, 1], [0, 1]);

  // Magic Cursor Star Motion (0.4s to 1.2s = 24 to 72 frames)
  const cursorProgress = interpolate(frame, [24, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const cursorX = interpolate(cursorProgress, [0, 1], [700, 0]);
  const cursorY = interpolate(cursorProgress, [0, 1], [-450, 0]);
  const cursorOpacity = interpolate(frame, [15, 24, 110, 130], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Click & Ripple (at frame 72 = 1.2s)
  const clickSpring = spring({
    frame: frame - 72,
    fps,
    config: { stiffness: 300, damping: 10 },
  });

  const rippleScale = interpolate(clickSpring, [0, 1], [0, 3.5]);
  const rippleOpacity = interpolate(clickSpring, [0, 0.3, 1], [0, 0.8, 0]);

  // Bounding Box Morph (72 to 120 frames = 1.2s to 2.0s)
  const morphProgress = interpolate(frame, [72, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cardWidth = interpolate(morphProgress, [0, 1], [460, 1100]);
  const cardHeight = interpolate(morphProgress, [0, 1], [160, 620]);
  const cardRadius = interpolate(morphProgress, [0, 1], [24, 32]);

  // Color Morph: Warning Red (#ef4444) -> Violet/Coral Gradient (#7c3aed -> #ff6d5a)
  const borderR = Math.round(interpolate(morphProgress, [0, 1], [239, 124]));
  const borderG = Math.round(interpolate(morphProgress, [0, 1], [68, 58]));
  const borderB = Math.round(interpolate(morphProgress, [0, 1], [68, 237]));

  // Error Content Fade Out as Workflow Canvas Opens
  const errorTextOpacity = interpolate(morphProgress, [0, 0.4], [1, 0], {
    extrapolateRight: "clamp",
  });

  // --- PHASE 2: n8n WORKFLOW CANVAS & PIPELINE (120 to 300 frames) ---
  const canvasContentOpacity = interpolate(morphProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // Nodes Entrance Springs (Staggered at frames 100, 115, 130)
  const getNodeSpring = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { mass: 0.9, damping: 14, stiffness: 120 },
    });
    return {
      scale: interpolate(s, [0, 1], [0.6, 1]),
      opacity: interpolate(s, [0, 1], [0, 1]),
    };
  };

  const node1 = getNodeSpring(100);
  const node2 = getNodeSpring(115);
  const node3 = getNodeSpring(130);
  const node4 = getNodeSpring(142);

  // Light Packets streaming along bezier wires (frames 140 to 280)
  const packet1 = interpolate(frame, [140, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const packet2 = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // AI Agent Ring Rotation
  const aiRingRot = (frame * 3) % 360;

  // --- PHASE 3: FIVERR GIG CTA OVERLAY (280 to 420 frames = 4.6s to 7.0s) ---
  const ctaSpring = spring({
    frame: frame - 280,
    fps,
    config: { stiffness: 160, damping: 14 },
  });

  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.85, 1.0]);

  // Metallic Light Sweep on CTA Button
  const lightSweep = interpolate(frame, [310, 410], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0c0a12",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Ambient Radial Glow 1: Top-Left Coral Glow */}
      <div
        style={{
          position: "absolute",
          width: "1400px",
          height: "1400px",
          top: "-300px",
          left: "-300px",
          background:
            "radial-gradient(circle, rgba(255, 109, 90, 0.25) 0%, rgba(12, 10, 18, 0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient Radial Glow 2: Center-Right Violet Glow */}
      <div
        style={{
          position: "absolute",
          width: "1400px",
          height: "1400px",
          top: "20%",
          right: "-300px",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(12, 10, 18, 0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid Canvas Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* --- MORPHING GLASSCONTAINER (ERROR CARD -> N8N CANVAS) --- */}
      <div
        style={{
          position: "relative",
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          borderRadius: `${cardRadius}px`,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1.5px solid rgb(${borderR}, ${borderG}, ${borderB})`,
          boxShadow: `0 30px 90px rgba(0, 0, 0, 0.8), 0 0 ${morphProgress * 40}px rgba(124, 58, 237, 0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cardEntryScale})`,
          opacity: cardEntryOpacity,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* PHASE 1: ERROR CARD CONTENT */}
        {errorTextOpacity > 0.01 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              opacity: errorTextOpacity,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#ef4444", letterSpacing: "1.5px" }}>
                MANUAL WORKFLOW ERROR
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                Manual Lead Export Required
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: N8N WORKFLOW CANVAS CONTENT */}
        {canvasContentOpacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canvasContentOpacity,
              padding: "40px",
              boxSizing: "border-box",
            }}
          >
            {/* SVG Bezier Connectors */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <defs>
                <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff6d5a" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>

              {/* Path 1: Trigger -> AI Node */}
              <path
                d="M 240 310 C 350 310, 420 310, 520 310"
                fill="none"
                stroke="url(#wireGrad)"
                strokeWidth="4"
                strokeDasharray="6 4"
              />

              {/* Path 2: AI Node -> Output 1 */}
              <path
                d="M 520 310 C 640 310, 720 220, 840 220"
                fill="none"
                stroke="url(#wireGrad)"
                strokeWidth="4"
              />

              {/* Path 3: AI Node -> Output 2 */}
              <path
                d="M 520 310 C 640 310, 720 400, 840 400"
                fill="none"
                stroke="url(#wireGrad)"
                strokeWidth="4"
              />

              {/* Light Packet 1 */}
              {packet1 > 0 && packet1 < 1 && (
                <circle
                  cx={240 + packet1 * 280}
                  cy={310}
                  r="6"
                  fill="#ff6d5a"
                  filter="drop-shadow(0 0 10px #ff6d5a)"
                />
              )}

              {/* Light Packet 2 */}
              {packet2 > 0 && packet2 < 1 && (
                <circle
                  cx={520 + packet2 * 320}
                  cy={310 - packet2 * 90}
                  r="6"
                  fill="#7c3aed"
                  filter="drop-shadow(0 0 10px #7c3aed)"
                />
              )}
            </svg>

            {/* NODE 1: Trigger */}
            <div
              style={{
                position: "absolute",
                left: "70px",
                top: "240px",
                width: "220px",
                padding: "16px 20px",
                borderRadius: "18px",
                backgroundColor: "rgba(18, 14, 28, 0.9)",
                border: "1.5px solid #ff6d5a",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transform: `scale(${node1.scale})`,
                opacity: node1.opacity,
              }}
            >
              <div style={{ fontSize: "24px" }}>⚡</div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#ff6d5a" }}>TRIGGER</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>Webhook Lead</div>
                <div style={{ fontSize: "10px", color: "#22c55e", fontWeight: 800, marginTop: "2px" }}>Status: 200 OK</div>
              </div>
            </div>

            {/* NODE 2: n8n AI Routing Agent */}
            <div
              style={{
                position: "absolute",
                left: "410px",
                top: "215px",
                width: "240px",
                padding: "20px 22px",
                borderRadius: "22px",
                backgroundColor: "rgba(18, 14, 28, 0.95)",
                border: "2px solid #7c3aed",
                boxShadow: "0 20px 50px rgba(124, 58, 237, 0.35)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transform: `scale(${node2.scale})`,
                opacity: node2.opacity,
              }}
            >
              {/* Rotating conic ring */}
              <div
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: "24px",
                  background: `conic-gradient(from ${aiRingRot}deg, #ff6d5a, #7c3aed, #ff6d5a)`,
                  opacity: 0.6,
                  zIndex: -1,
                }}
              />
              <div style={{ fontSize: "28px" }}>🤖</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
                n8n AI Routing Agent
              </div>
              <div style={{ fontSize: "10px", color: "#a78bfa", marginTop: "2px", fontWeight: 700 }}>
                ⚡ Auto-Enriching Data
              </div>
            </div>

            {/* NODE 3: CRM Auto-Sync */}
            <div
              style={{
                position: "absolute",
                right: "70px",
                top: "160px",
                width: "230px",
                padding: "16px 20px",
                borderRadius: "18px",
                backgroundColor: "rgba(18, 14, 28, 0.9)",
                border: "1.5px solid #7c3aed",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transform: `scale(${node3.scale})`,
                opacity: node3.opacity,
              }}
            >
              <div style={{ fontSize: "24px" }}>📈</div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#a78bfa" }}>OUTPUT</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>CRM Auto-Sync</div>
                <div style={{ fontSize: "10px", color: "#22c55e", fontWeight: 800, marginTop: "2px" }}>✓ Lead Saved</div>
              </div>
            </div>

            {/* NODE 4: Slack Alert */}
            <div
              style={{
                position: "absolute",
                right: "70px",
                top: "340px",
                width: "230px",
                padding: "16px 20px",
                borderRadius: "18px",
                backgroundColor: "rgba(18, 14, 28, 0.9)",
                border: "1.5px solid #ff6d5a",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transform: `scale(${node4.scale})`,
                opacity: node4.opacity,
              }}
            >
              <div style={{ fontSize: "24px" }}>🔔</div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#ff6d5a" }}>NOTIFY</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>Slack Notification</div>
                <div style={{ fontSize: "10px", color: "#22c55e", fontWeight: 800, marginTop: "2px" }}>#leads Sent</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- RIPPLE EFFECT FROM CLICK AT FRAME 72 --- */}
      {rippleOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "3px solid #ff6d5a",
            boxShadow: "0 0 40px #ff6d5a",
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />
      )}

      {/* --- MAGIC CURSOR GLOWING 4-POINT STAR --- */}
      {cursorOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: `calc(50% + ${cursorY}px)`,
            left: `calc(50% + ${cursorX}px)`,
            transform: "translate(-50%, -50%)",
            opacity: cursorOpacity,
            zIndex: 40,
            pointerEvents: "none",
            filter: "drop-shadow(0 0 16px #ff6d5a)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M 24 0 Q 24 24, 48 24 Q 24 24, 24 48 Q 24 24, 0 24 Q 24 24, 24 0 Z"
              fill="#ff6d5a"
            />
          </svg>
        </div>
      )}

      {/* --- PHASE 3: FIVERR GIG CALL TO ACTION OVERLAY --- */}
      {ctaOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(12, 10, 18, 0.85)",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            zIndex: 50,
          }}
        >
          {/* Badge Header */}
          <div
            style={{
              padding: "6px 18px",
              borderRadius: "100px",
              backgroundColor: "rgba(255, 109, 90, 0.15)",
              border: "1px solid #ff6d5a",
              fontSize: "13px",
              fontWeight: 800,
              color: "#ff6d5a",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Fiverr Automation Specialist
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "58px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            NEED CUSTOM n8n WORKFLOWS?
          </h1>

          <div
            style={{
              marginTop: "12px",
              fontSize: "28px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #a78bfa 0%, #ff6d5a 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Order Now & Automate Everything in 24 Hours
          </div>

          {/* CTA Glassmorphic Button with Metallic Sweep */}
          <div
            style={{
              position: "relative",
              marginTop: "36px",
              padding: "18px 48px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, #7c3aed 0%, #ff6d5a 100%)",
              boxShadow: "0 0 40px rgba(124, 58, 237, 0.5)",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Metallic Light Sweep */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(115deg, transparent ${lightSweep - 30}%, rgba(255,255,255,0.4) ${lightSweep}%, transparent ${lightSweep + 30}%)`,
                pointerEvents: "none",
              }}
            />
            Book Your Workflow →
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
