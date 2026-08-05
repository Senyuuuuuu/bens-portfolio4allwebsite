import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";

export const AutomatedPipelineCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Total duration: 6 seconds = 360 frames @ 60fps

  // --- PHASE 1: CHAOTIC-TO-STRUCTURED SHAPE MORPH (0.0s to 1.5s = 0 to 90 frames) ---
  const morphSpring = spring({
    frame,
    fps,
    config: { mass: 0.9, damping: 14, stiffness: 120 },
  });

  const morphProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Background gradient interpolation: #090a0f -> #0d0f1a with #6366f1 radial glow
  const bgGlowOpacity = interpolate(morphProgress, [0, 1], [0.1, 0.25]);

  // Color Morphing: Red/amber warning borders (#ef4444) -> Neon cyan/indigo gradients (#38bdf8 -> #818cf8)
  const borderR = Math.round(interpolate(morphProgress, [0, 1], [239, 56]));
  const borderG = Math.round(interpolate(morphProgress, [0, 1], [68, 189]));
  const borderB = Math.round(interpolate(morphProgress, [0, 1], [68, 248]));

  // Node 1 (Trigger - Left): "Webhook / New Lead"
  const node1Width = interpolate(morphProgress, [0, 1], [380, 320]);
  const node1Height = interpolate(morphProgress, [0, 1], [140, 160]);
  const node1X = interpolate(morphProgress, [0, 1], [-560, -480]);
  const node1Y = interpolate(morphProgress, [0, 1], [-260, 0]);

  // Node 2 (Core AI Agent - Center): "n8n AI Routing Agent"
  const node2Width = interpolate(morphProgress, [0, 1], [420, 360]);
  const node2Height = interpolate(morphProgress, [0, 1], [160, 200]);
  const node2X = interpolate(morphProgress, [0, 1], [520, 0]);
  const node2Y = interpolate(morphProgress, [0, 1], [-280, 0]);

  // Node 3 & 4 (Outputs - Right Stacked): "CRM Sync" and "Slack Notification"
  const node3X = interpolate(morphProgress, [0, 1], [-500, 480]);
  const node3Y = interpolate(morphProgress, [0, 1], [240, -90]);

  const node4X = interpolate(morphProgress, [0, 1], [540, 480]);
  const node4Y = interpolate(morphProgress, [0, 1], [220, 90]);

  // Status Badge Morphing: Red +99 Failed -> Neon Green Status 200 OK
  const badgeColorR = Math.round(interpolate(morphProgress, [0, 1], [239, 34]));
  const badgeColorG = Math.round(interpolate(morphProgress, [0, 1], [68, 197]));
  const badgeColorB = Math.round(interpolate(morphProgress, [0, 1], [68, 94]));

  // --- PHASE 2: WORKFLOW ACTIVATION & LIGHT PACKET SIMULATION (90 to 240 frames) ---
  // Packet 1 (Node 1 to Node 2): 90 to 150 frames
  const packet1Progress = interpolate(frame, [90, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Packet 2 (Node 2 to Output Nodes 3 & 4): 140 to 190 frames
  const packet2Progress = interpolate(frame, [140, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Node Bounce on Packet Impact
  const node2Bounce = interpolate(frame, [138, 145, 155], [1.0, 1.08, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const node3Bounce = interpolate(frame, [188, 195, 205], [1.0, 1.08, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gradient Ring Rotation for Center AI Node
  const ringRot = (frame * 3) % 360;

  // --- PHASE 3: HERO HEADLINE & CTA BUTTON MORPH (240 to 360 frames) ---
  const phase3Spring = spring({
    frame: frame - 240,
    fps,
    config: { stiffness: 160, damping: 14 },
  });

  const headlineOpacity = interpolate(phase3Spring, [0, 1], [0, 1]);
  const headlineScale = interpolate(phase3Spring, [0, 1], [0.85, 1.0]);

  // Central AI Node expands into CTA Button at bottom of screen
  const ctaMorphProgress = interpolate(frame, [240, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const ctaWidth = interpolate(ctaMorphProgress, [0, 1], [360, 440]);
  const ctaHeight = interpolate(ctaMorphProgress, [0, 1], [200, 68]);
  const ctaY = interpolate(ctaMorphProgress, [0, 1], [0, 260]);
  const ctaRadius = interpolate(ctaMorphProgress, [0, 1], [24, 100]);

  // Metallic Light Sweep across CTA Button
  const lightSweepPos = interpolate(frame, [260, 350], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0f1a",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Background Central Indigo Glow */}
      <div
        style={{
          position: "absolute",
          width: "1400px",
          height: "1400px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(99, 102, 241, ${bgGlowOpacity}) 0%, rgba(13, 15, 26, 0) 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* SVG CONNECTOR WIRES & GLOWING LIGHT PACKETS */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Wire 1: Left Node 1 to Center Node 2 */}
        <path
          d="M 640 540 C 760 540, 800 540, 960 540"
          fill="none"
          stroke="url(#wireGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Wire 2: Center Node 2 to Top Output Node 3 */}
        <path
          d="M 960 540 C 1120 540, 1200 450, 1440 450"
          fill="none"
          stroke="url(#wireGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Wire 3: Center Node 2 to Bottom Output Node 4 */}
        <path
          d="M 960 540 C 1120 540, 1200 630, 1440 630"
          fill="none"
          stroke="url(#wireGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Light Packet 1 (Node 1 -> Node 2) */}
        {packet1Progress > 0 && packet1Progress < 1 && (
          <circle
            cx={640 + packet1Progress * 320}
            cy={540}
            r="7"
            fill="#38bdf8"
            filter="drop-shadow(0 0 12px #38bdf8)"
          />
        )}

        {/* Light Packet 2 (Node 2 -> Node 3) */}
        {packet2Progress > 0 && packet2Progress < 1 && (
          <circle
            cx={960 + packet2Progress * 480}
            cy={540 - packet2Progress * 90}
            r="7"
            fill="#818cf8"
            filter="drop-shadow(0 0 12px #818cf8)"
          />
        )}
      </svg>

      {/* NODE 1: Webhook / New Lead (Left) */}
      <div
        style={{
          position: "absolute",
          width: `${node1Width}px`,
          height: `${node1Height}px`,
          left: `calc(50% + ${node1X}px - ${node1Width / 2}px)`,
          top: `calc(50% + ${node1Y}px - ${node1Height / 2}px)`,
          borderRadius: "20px",
          backgroundColor: "rgba(18, 22, 34, 0.9)",
          backdropFilter: "blur(20px)",
          border: `1.5px solid rgb(${borderR}, ${borderG}, ${borderB})`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            border: "1px solid #38bdf8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          ⚡
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#38bdf8", letterSpacing: "1px" }}>
            TRIGGER
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
            Webhook / New Lead
          </div>
          <div
            style={{
              marginTop: "6px",
              padding: "2px 8px",
              borderRadius: "100px",
              backgroundColor: `rgba(${badgeColorR}, ${badgeColorG}, ${badgeColorB}, 0.2)`,
              border: `1px solid rgb(${badgeColorR}, ${badgeColorG}, ${badgeColorB})`,
              fontSize: "10px",
              fontWeight: 800,
              color: `rgb(${badgeColorR}, ${badgeColorG}, ${badgeColorB})`,
              display: "inline-block",
            }}
          >
            {morphProgress > 0.6 ? "⚡ 0.02s execution" : "+99 FAILED"}
          </div>
        </div>
      </div>

      {/* NODE 2 & CTA MORPH BUTTON: Core n8n AI Routing Agent (Center) */}
      <div
        style={{
          position: "absolute",
          width: `${ctaWidth}px`,
          height: `${ctaHeight}px`,
          top: `calc(50% + ${ctaY}px - ${ctaHeight / 2}px)`,
          left: `calc(50% - ${ctaWidth / 2}px)`,
          borderRadius: `${ctaRadius}px`,
          backgroundColor: ctaMorphProgress > 0.5 ? "rgba(99, 102, 241, 0.95)" : "rgba(18, 22, 34, 0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid #818cf8",
          boxShadow: `0 0 40px rgba(99, 102, 241, ${0.4 + ctaMorphProgress * 0.4})`,
          padding: ctaMorphProgress > 0.5 ? "0" : "24px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${node2Bounce})`,
          zIndex: 20,
          overflow: "hidden",
        }}
      >
        {/* Animated Gradient Ring for AI Agent before CTA Morph */}
        {ctaMorphProgress < 0.5 && (
          <div
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: "26px",
              background: `conic-gradient(from ${ringRot}deg, #6366f1, #ec4899, #6366f1)`,
              opacity: 0.6,
              zIndex: -1,
            }}
          />
        )}

        {ctaMorphProgress < 0.5 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: "28px" }}>🤖</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
              n8n AI Routing Agent
            </div>
            <div
              style={{
                marginTop: "6px",
                padding: "2px 10px",
                borderRadius: "100px",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                border: "1px solid #22c55e",
                fontSize: "11px",
                fontWeight: 800,
                color: "#22c55e",
              }}
            >
              Status: 200 OK
            </div>
          </div>
        ) : (
          /* CTA Button Content */
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Light Sweep Effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(115deg, transparent ${lightSweepPos - 30}%, rgba(255,255,255,0.4) ${lightSweepPos}%, transparent ${lightSweepPos + 30}%)`,
                pointerEvents: "none",
              }}
            />
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.5px" }}>
              Get This Workflow Template →
            </span>
          </div>
        )}
      </div>

      {/* NODE 3: CRM Sync (Top Right Output) */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "140px",
          left: `calc(50% + ${node3X}px - 160px)`,
          top: `calc(50% + ${node3Y}px - 70px)`,
          borderRadius: "20px",
          backgroundColor: "rgba(18, 22, 34, 0.9)",
          backdropFilter: "blur(20px)",
          border: `1.5px solid rgb(${borderR}, ${borderG}, ${borderB})`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          transform: `scale(${node3Bounce})`,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: "28px" }}>📈</div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#818cf8" }}>OUTPUT NODE</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>CRM Lead Sync</div>
          <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700, marginTop: "4px" }}>✓ Instant Auto-Created</div>
        </div>
      </div>

      {/* NODE 4: Slack Notification (Bottom Right Output) */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "140px",
          left: `calc(50% + ${node4X}px - 160px)`,
          top: `calc(50% + ${node4Y}px - 70px)`,
          borderRadius: "20px",
          backgroundColor: "rgba(18, 22, 34, 0.9)",
          backdropFilter: "blur(20px)",
          border: `1.5px solid rgb(${borderR}, ${borderG}, ${borderB})`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: "28px" }}>🔔</div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#818cf8" }}>OUTPUT NODE</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>Slack Alert Sent</div>
          <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700, marginTop: "4px" }}>#sales-leads notified</div>
        </div>
      </div>

      {/* --- PHASE 3: HERO HEADLINE TEXT --- */}
      {headlineOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "120px",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "56px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            AUTOMATE EVERYTHING WITH n8n
          </h1>
          <div
            style={{
              marginTop: "12px",
              fontSize: "32px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            1 Workflow. 10x Scale. Zero Manual Work.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
