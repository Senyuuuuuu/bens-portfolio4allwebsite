import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { interpolatePath } from "@remotion/paths";

export const CleanKineticN8nAd: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Custom Bezier Easing: Snappy entrance with long-tail deceleration
  const cubicBezier = Easing.bezier(0.16, 1, 0.3, 1);

  // =========================================================================
  // GLOBAL BACKGROUND COLOR MORPH
  // Pristine off-white (#f8f9fa) shifting to pure white (#ffffff)
  // =========================================================================
  const bgShift = interpolate(frame, [0, 450, 900], [0, 0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgRed = Math.round(interpolate(bgShift, [0, 1], [248, 255]));
  const bgGreen = Math.round(interpolate(bgShift, [0, 1], [249, 255]));
  const bgBlue = Math.round(interpolate(bgShift, [0, 1], [250, 255]));
  const bgColor = `rgb(${bgRed}, ${bgGreen}, ${bgBlue})`;

  // =========================================================================
  // PHASE 1: THE KINETIC HOOK (Frames 0 - 180 / 0s - 3s)
  // =========================================================================
  const isPhase1 = frame < 185;

  // Rapid Masked Text Swap every 40 frames
  let phase1Text = "Automate leads.";
  let textIndex = 0;
  if (frame >= 120) {
    phase1Text = "Effortless automation";
    textIndex = 3;
  } else if (frame >= 80) {
    phase1Text = "Automate workflows.";
    textIndex = 2;
  } else if (frame >= 40) {
    phase1Text = "Automate emails.";
    textIndex = 1;
  }

  const textLocalFrame = frame % 40;
  const textSpring = spring({
    frame: textIndex === 3 ? Math.max(0, frame - 120) : textLocalFrame,
    fps,
    config: { stiffness: 280, damping: 22 },
  });

  // Masked Slide-up Kinetic Reveal
  const textY = interpolate(textSpring, [0, 1], [110, 0]);
  const textScale = interpolate(textSpring, [0, 1], [0.92, 1.0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Z-Axis Push Through Camera Wipe at Frame 155-180
  const zPushProgress = interpolate(frame, [155, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
  const zScale = interpolate(zPushProgress, [0, 1], [1.0, 20.0]);
  const zOpacity = interpolate(zPushProgress, [0, 0.72, 1], [1, 1, 0]);

  // Floating background cards: Continuous Life Loops using Math.sin()
  const float1Y = Math.sin(frame * 0.045) * 18;
  const float1X = Math.cos(frame * 0.035) * 12;
  const float1Rot = Math.sin(frame * 0.03) * 4;

  const float2Y = Math.sin(frame * 0.05 + 1.5) * 20;
  const float2X = Math.cos(frame * 0.04 + 1.5) * 14;
  const float2Rot = Math.cos(frame * 0.035) * -5;

  const float3Y = Math.sin(frame * 0.04 + 3.0) * 16;
  const float3X = Math.cos(frame * 0.045 + 3.0) * 16;
  const float3Rot = Math.sin(frame * 0.04) * 3;

  const floatCardOpacity = interpolate(frame, [0, 20, 145, 165], [0, 0.65, 0.65, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // =========================================================================
  // PHASE 2: THE COMMAND BOX (Frames 180 - 360 / 3s - 6s)
  // =========================================================================
  const commandBoxEntrySpring = spring({
    frame: frame - 178,
    fps,
    config: { stiffness: 150, damping: 14 },
  });

  // Shape Interpolation (State Morphing Command Box -> Canvas Grid)
  const morphProgress = interpolate(frame, [350, 395], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cubicBezier,
  });

  const boxWidth = interpolate(morphProgress, [0, 1], [800, 1560]);
  const boxHeight = interpolate(morphProgress, [0, 1], [130, 680]);
  const boxRadius = interpolate(morphProgress, [0, 1], [18, 26]);
  const boxBgOpacity = interpolate(morphProgress, [0, 1], [1, 0.97]);

  // Continuous Life Loop for Command Box resting state
  const boxRestY = Math.sin(frame * 0.04) * 6;
  const boxRestRotX = Math.cos(frame * 0.035) * 1.5;

  const commandBoxOpacity = interpolate(frame, [175, 188, 525, 545], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const commandBoxScale = interpolate(commandBoxEntrySpring, [0, 1], [0.82, 1.0]);

  // Typing animation: "When a new Stripe payment succeeds..."
  const fullTypeString = "When a new Stripe payment succeeds...";
  const typingProgress = interpolate(frame, [192, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typedCharCount = Math.floor(typingProgress * fullTypeString.length);
  const currentTypedText = fullTypeString.slice(0, typedCharCount);

  // Sleek Mac Cursor trajectory towards "+ Create Workflow" button
  const cursorFlyProgress = interpolate(frame, [245, 292], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const cursorX = interpolate(cursorFlyProgress, [0, 1], [400, 248]);
  const cursorY = interpolate(cursorFlyProgress, [0, 1], [230, 0]);

  // Click & Bounce physics at frame 298
  const clickBounce = spring({
    frame: frame - 298,
    fps,
    config: { stiffness: 350, damping: 12 },
  });
  const cursorScale = interpolate(clickBounce, [0, 0.5, 1], [1, 0.76, 1]);
  const buttonScale = interpolate(clickBounce, [0, 0.5, 1], [1, 0.91, 1]);

  const cursorOpacity = interpolate(frame, [240, 250, 340, 355], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flashing Action Verbs in n8n Orange (#ea580c)
  const isFlashingVerbs = frame >= 302 && frame < 360;
  let flashVerb = "Extract";
  let verbIndex = 0;
  if (frame >= 344) {
    flashVerb = "Sync";
    verbIndex = 3;
  } else if (frame >= 330) {
    flashVerb = "Route";
    verbIndex = 2;
  } else if (frame >= 316) {
    flashVerb = "Analyze";
    verbIndex = 1;
  }

  const verbSpring = spring({
    frame: frame - (302 + verbIndex * 14),
    fps,
    config: { stiffness: 300, damping: 16 },
  });
  const verbScale = interpolate(verbSpring, [0, 1], [0.82, 1.0]);
  const verbY = interpolate(verbSpring, [0, 1], [20, 0]);

  // =========================================================================
  // PHASE 3: THE RAPID NODE BUILD (Frames 360 - 540 / 6s - 9s)
  // =========================================================================
  const canvasContentOpacity = interpolate(morphProgress, [0.35, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Snappy Node Entrance Springs (stiffness: 300, damping: 24)
  const getNodeSpring = (delay: number, restOffset: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { stiffness: 300, damping: 24 },
    });
    // Continuous Life Loop for Node resting state
    const lifeY = Math.sin((frame + restOffset) * 0.05) * 5;
    return {
      scale: interpolate(s, [0, 1], [0.62, 1]),
      opacity: interpolate(s, [0, 1], [0, 1]),
      y: interpolate(s, [0, 1], [50, 0]) + lifeY,
    };
  };

  const node1 = getNodeSpring(380, 0);
  const node2 = getNodeSpring(402, 100);
  const node3 = getNodeSpring(424, 200);

  // Vector Path Interpolation for Connecting Wires using @remotion/paths
  const wire1PathStraight = "M 380 340 L 770 340";
  const wire1PathCurved = "M 380 340 C 480 300, 670 380, 770 340";

  const wire2PathStraight = "M 990 340 L 1380 340";
  const wire2PathCurved = "M 990 340 C 1090 380, 1280 300, 1380 340";

  // Path morphing progress over time
  const wireMorphProgress = interpolate(frame, [440, 500], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cubicBezier,
  });

  const animatedWire1 = interpolatePath(
    wireMorphProgress,
    wire1PathStraight,
    wire1PathCurved
  );
  const animatedWire2 = interpolatePath(
    wireMorphProgress,
    wire2PathStraight,
    wire2PathCurved
  );

  // Line drawing progress using strokeDashoffset
  const line1Progress = interpolate(frame, [430, 460], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cubicBezier,
  });

  const line2Progress = interpolate(frame, [455, 485], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cubicBezier,
  });

  // Animated Data Pulse Packets
  const pulse1 = interpolate(frame, [435, 475], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse2 = interpolate(frame, [460, 500], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Small Blue Checkmark ✓ Bubbling up above Node 3
  const checkmarkSpring = spring({
    frame: frame - 486,
    fps,
    config: { stiffness: 350, damping: 14 },
  });
  const checkmarkScale = interpolate(checkmarkSpring, [0, 1], [0, 1.0]);
  const checkmarkY = interpolate(checkmarkSpring, [0, 1], [18, 0]);
  const checkmarkLifeY = Math.sin(frame * 0.08) * 4;

  // =========================================================================
  // PHASE 4: DIRECT VALUE PROPOSITION (Frames 540 - 720 / 9s - 12s)
  // =========================================================================
  // Snap Zoom into Checkmark
  const snapZoomProgress = interpolate(frame, [530, 560], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
  const snapZoomScale = interpolate(snapZoomProgress, [0, 1], [1.0, 18.0]);
  const snapZoomOpacity = interpolate(snapZoomProgress, [0.75, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Masked Typography Reveal & Review Card Springs
  const phase4HeaderSpring = spring({
    frame: frame - 558,
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const phase4HeaderY = interpolate(phase4HeaderSpring, [0, 1], [100, 0]);

  const phase4SubtextSpring = spring({
    frame: frame - 572,
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const phase4SubtextY = interpolate(phase4SubtextSpring, [0, 1], [80, 0]);

  const reviewSpring = spring({
    frame: frame - 588,
    fps,
    config: { stiffness: 160, damping: 16 },
  });
  const reviewX = interpolate(reviewSpring, [0, 1], [160, 0]);
  const reviewOpacity = interpolate(reviewSpring, [0, 1], [0, 1]);
  const reviewLifeY = Math.sin(frame * 0.045) * 8;
  const reviewLifeRot = Math.cos(frame * 0.035) * 2;

  const phase4ExitOpacity = interpolate(frame, [705, 730], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // =========================================================================
  // PHASE 5: THE RADIAL APP OUTRO (Frames 720 - 900 / 12s - 15s)
  // =========================================================================
  const phase5EntrySpring = spring({
    frame: frame - 718,
    fps,
    config: { stiffness: 180, damping: 16 },
  });
  const logoCenterScale = interpolate(phase5EntrySpring, [0, 1], [0.3, 1.0]);
  const logoCenterOpacity = interpolate(phase5EntrySpring, [0, 1], [0, 1]);
  const logoCenterLifeY = Math.sin(frame * 0.05) * 6;

  // 10 App Icons in 3D Orbital Path
  const apps = [
    { name: "Gmail", color: "#ea4335", icon: "M" },
    { name: "Slack", color: "#4a154b", icon: "#" },
    { name: "Drive", color: "#4285f4", icon: "▲" },
    { name: "Sheets", color: "#0f9d58", icon: "⊞" },
    { name: "Discord", color: "#5865f2", icon: "🎮" },
    { name: "Notion", color: "#000000", icon: "N" },
    { name: "Webhook", color: "#0284c7", icon: "⚡" },
    { name: "Postgres", color: "#336791", icon: "🐘" },
    { name: "Airtable", color: "#f59e0b", icon: "⎈" },
    { name: "OpenAI", color: "#10a37f", icon: "⚛" },
  ];

  const orbitRadius = 270;
  const baseOrbitAngle = (frame - 740) * 0.28; // continuous clockwise rotation

  // Fiverr CTA & Logo Entry Springs
  const ctaSpring = spring({
    frame: frame - 775,
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [60, 0]);

  const fiverrLogoSpring = spring({
    frame: frame - 795,
    fps,
    config: { stiffness: 240, damping: 18 },
  });
  const fiverrLogoY = interpolate(fiverrLogoSpring, [0, 1], [50, 0]);
  const fiverrLogoScale = interpolate(fiverrLogoSpring, [0, 1], [0.7, 1.0]);
  const fiverrLogoOpacity = interpolate(fiverrLogoSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1200,
      }}
    >
      {/* ========================================================================= */}
      {/* PHASE 1: THE KINETIC HOOK                                                */}
      {/* ========================================================================= */}
      {isPhase1 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: zOpacity,
            transform: `scale(${zScale})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Floating UI Elements with 3D Depth & Compound Shadows */}
          <div
            style={{
              position: "absolute",
              top: 180 + float1Y,
              left: 220 + float1X,
              transform: `rotateZ(${float1Rot}deg) translateZ(40px)`,
              width: 240,
              height: 160,
              backgroundColor: "#ffffff",
              borderRadius: 18,
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.05), 0 20px 60px rgba(0, 0, 0, 0.08)",
              filter: "blur(4px)",
              opacity: floatCardOpacity,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af" }}>
              LEAD CONVERSION
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                height: 80,
              }}
            >
              <div style={{ width: 28, height: "40%", backgroundColor: "#e5e7eb", borderRadius: 4 }} />
              <div style={{ width: 28, height: "70%", backgroundColor: "#ea580c", borderRadius: 4 }} />
              <div style={{ width: 28, height: "55%", backgroundColor: "#e5e7eb", borderRadius: 4 }} />
              <div style={{ width: 28, height: "95%", backgroundColor: "#ea580c", borderRadius: 4 }} />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 220 + float2Y,
              right: 240 + float2X,
              transform: `rotateZ(${float2Rot}deg) translateZ(60px)`,
              width: 260,
              height: 180,
              backgroundColor: "#ffffff",
              borderRadius: 18,
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.05), 0 20px 60px rgba(0, 0, 0, 0.08)",
              filter: "blur(4px)",
              opacity: floatCardOpacity,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af" }}>
              AUTOMATION TASKS
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: i === 2 ? "#e5e7eb" : "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 900,
                  }}
                >
                  {i !== 2 ? "✓" : ""}
                </div>
                <div
                  style={{
                    height: 10,
                    width: i === 1 ? 140 : i === 2 ? 100 : 120,
                    backgroundColor: "#f3f4f6",
                    borderRadius: 5,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 200 + float3Y,
              left: 320 + float3X,
              transform: `rotateZ(${float3Rot}deg) translateZ(30px)`,
              width: 220,
              height: 150,
              backgroundColor: "#ffffff",
              borderRadius: 18,
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.05), 0 20px 60px rgba(0, 0, 0, 0.08)",
              filter: "blur(4px)",
              opacity: floatCardOpacity,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: "#ffedd5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ea580c",
                fontWeight: 900,
              }}
            >
              📄
            </div>
            <div style={{ height: 8, width: 120, backgroundColor: "#e5e7eb", borderRadius: 4 }} />
            <div style={{ height: 8, width: 80, backgroundColor: "#f3f4f6", borderRadius: 4 }} />
          </div>

          {/* Masked Kinetic Typography Reveal */}
          <div
            style={{
              overflow: "hidden",
              padding: "10px 40px",
            }}
          >
            <h1
              style={{
                fontSize: 88,
                fontWeight: 800,
                color: "#202124",
                letterSpacing: "-2.5px",
                margin: 0,
                lineHeight: 1.1,
                transform: `translateY(${textY}px) scale(${textScale})`,
                opacity: textOpacity,
              }}
            >
              {phase1Text}
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2 & 3: COMMAND BOX & CANVAS NODE BUILD                              */}
      {/* ========================================================================= */}
      {frame >= 170 && frame < 550 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: snapZoomOpacity,
            transform: `scale(${snapZoomScale})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Continuous Morphing Box Container with Compound Shadows & Resting Tilt */}
          <div
            style={{
              width: boxWidth,
              height: boxHeight,
              borderRadius: boxRadius,
              backgroundColor: `rgba(255, 255, 255, ${boxBgOpacity})`,
              boxShadow:
                "0 6px 16px rgba(0, 0, 0, 0.04), 0 24px 64px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              opacity: commandBoxOpacity,
              transform: `translateY(${boxRestY}px) rotateX(${boxRestRotX}deg) scale(${commandBoxScale})`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Canvas Dot Grid (Morphs in Phase 3) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#f8f9fa",
                backgroundImage:
                  "radial-gradient(#d1d5db 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
                opacity: canvasContentOpacity,
                pointerEvents: "none",
              }}
            />

            {/* Phase 2 Command Box Contents */}
            {morphProgress < 0.9 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 32px",
                  opacity: 1 - morphProgress,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: "#ea580c",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 600,
                      color: "#202124",
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {!isFlashingVerbs ? (
                      <>
                        <span>{currentTypedText}</span>
                        <span
                          style={{
                            display: "inline-block",
                            width: 3,
                            height: 28,
                            backgroundColor: "#ea580c",
                            marginLeft: 4,
                          }}
                        />
                      </>
                    ) : (
                      <div style={{ overflow: "hidden", padding: "4px 0" }}>
                        <span
                          style={{
                            color: "#ea580c",
                            fontWeight: 800,
                            fontSize: 32,
                            transform: `translateY(${verbY}px) scale(${verbScale})`,
                            display: "inline-block",
                            textShadow: "0 4px 20px rgba(234, 88, 12, 0.3)",
                          }}
                        >
                          Action: {flashVerb}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#ea580c",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 18,
                    padding: "14px 26px",
                    borderRadius: 12,
                    boxShadow:
                      "0 4px 12px rgba(234, 88, 12, 0.3), 0 12px 32px rgba(234, 88, 12, 0.2)",
                    transform: `scale(${buttonScale})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>+ Create Workflow</span>
                </div>
              </div>
            )}

            {/* Sleek Mac Pointer Cursor */}
            {frame >= 240 && frame < 360 && morphProgress < 0.5 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 60,
                  transform: `translate(${cursorX}px, ${cursorY}px) scale(${cursorScale})`,
                  opacity: cursorOpacity,
                  zIndex: 50,
                  pointerEvents: "none",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3L10.07 19.97L13.58 13.58L19.97 10.07L3 3Z"
                    fill="#111827"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PHASE 3: CANVAS NODES & VECTOR WIRE MORPHING                          */}
            {/* ===================================================================== */}
            {morphProgress > 0.1 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: canvasContentOpacity,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 120px",
                }}
              >
                {/* SVG Vector Paths with Morphing */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  {/* Line 1: Node 1 -> Node 2 */}
                  <path
                    d={animatedWire1}
                    stroke="#bdc1c6"
                    strokeWidth="4"
                    strokeDasharray="450"
                    strokeDashoffset={450 * (1 - line1Progress)}
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Data Pulse Packet 1 */}
                  {line1Progress > 0.8 && (
                    <circle
                      cx={380 + (770 - 380) * pulse1}
                      cy={340}
                      r="6"
                      fill="#ea580c"
                    />
                  )}

                  {/* Line 2: Node 2 -> Node 3 */}
                  <path
                    d={animatedWire2}
                    stroke="#bdc1c6"
                    strokeWidth="4"
                    strokeDasharray="450"
                    strokeDashoffset={450 * (1 - line2Progress)}
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Data Pulse Packet 2 */}
                  {line2Progress > 0.8 && (
                    <circle
                      cx={990 + (1380 - 990) * pulse2}
                      cy={340}
                      r="6"
                      fill="#2563eb"
                    />
                  )}
                </svg>

                {/* Node 1: Stripe */}
                <div
                  style={{
                    width: 260,
                    height: 150,
                    backgroundColor: "#ffffff",
                    borderRadius: 20,
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.04), 0 16px 40px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #e5e7eb",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transform: `scale(${node1.scale}) translateY(${node1.y}px)`,
                    opacity: node1.opacity,
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: "#635bff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 22,
                        boxShadow: "0 6px 16px rgba(99, 91, 255, 0.3)",
                      }}
                    >
                      S
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
                        Stripe
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                        Payment Trigger
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#10b981",
                      backgroundColor: "#ecfdf5",
                      padding: "6px 12px",
                      borderRadius: 8,
                    }}
                  >
                    <span>● Active Trigger</span>
                    <span>200 OK</span>
                  </div>
                </div>

                {/* Node 2: OpenAI */}
                <div
                  style={{
                    width: 260,
                    height: 150,
                    backgroundColor: "#ffffff",
                    borderRadius: 20,
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.04), 0 16px 40px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #e5e7eb",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transform: `scale(${node2.scale}) translateY(${node2.y}px)`,
                    opacity: node2.opacity,
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: "#10a37f",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 22,
                        boxShadow: "0 6px 16px rgba(16, 163, 127, 0.3)",
                      }}
                    >
                      ⚛
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
                        OpenAI
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                        AI Reasoning
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#2563eb",
                      backgroundColor: "#eff6ff",
                      padding: "6px 12px",
                      borderRadius: 8,
                    }}
                  >
                    <span>GPT-4o Agent</span>
                    <span>120ms</span>
                  </div>
                </div>

                {/* Node 3: HubSpot */}
                <div
                  style={{
                    width: 260,
                    height: 150,
                    backgroundColor: "#ffffff",
                    borderRadius: 20,
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.04), 0 16px 40px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #e5e7eb",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transform: `scale(${node3.scale}) translateY(${node3.y}px)`,
                    opacity: node3.opacity,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  {/* Small Blue Checkmark ✓ Bubbling up above Node 3 */}
                  <div
                    style={{
                      position: "absolute",
                      top: -24,
                      right: -10,
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      backgroundColor: "#2563eb",
                      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 22,
                      transform: `scale(${checkmarkScale}) translateY(${checkmarkY + checkmarkLifeY}px)`,
                    }}
                  >
                    ✓
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: "#ff7a59",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 22,
                        boxShadow: "0 6px 16px rgba(255, 122, 89, 0.3)",
                      }}
                    >
                      ⎈
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
                        HubSpot
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                        CRM Sync
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#ea580c",
                      backgroundColor: "#fff7ed",
                      padding: "6px 12px",
                      borderRadius: 8,
                    }}
                  >
                    <span>Deal Created</span>
                    <span>Synced</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4: DIRECT VALUE PROPOSITION                                        */}
      {/* ========================================================================= */}
      {frame >= 545 && frame < 735 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase4ExitOpacity,
            padding: "0 180px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Masked Kinetic Typography Block */}
            <div style={{ maxWidth: 760 }}>
              <div style={{ overflow: "hidden", padding: "8px 0" }}>
                <h2
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: "#202124",
                    letterSpacing: "-2px",
                    margin: 0,
                    transform: `translateY(${phase4HeaderY}px)`,
                    lineHeight: 1.1,
                  }}
                >
                  Directly integrated.
                </h2>
              </div>

              <div style={{ overflow: "hidden", padding: "6px 0", marginTop: 12 }}>
                <p
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    color: "#5f6368",
                    margin: 0,
                    transform: `translateY(${phase4SubtextY}px)`,
                  }}
                >
                  Zero Zapier fees. Infinite scale.
                </p>
              </div>
            </div>

            {/* Floating Evidence: Fiverr 5-Star Review Card */}
            <div
              style={{
                width: 480,
                backgroundColor: "#ffffff",
                borderRadius: 24,
                boxShadow:
                  "0 8px 24px rgba(0, 0, 0, 0.04), 0 24px 64px rgba(0, 0, 0, 0.08)",
                border: "1px solid #f1f3f4",
                padding: 32,
                transform: `translateX(${reviewX}px) translateY(${reviewLifeY}px) rotateZ(${reviewLifeRot}deg)`,
                opacity: reviewOpacity,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: "#1dbf73",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 18px rgba(29, 191, 115, 0.3)",
                  }}
                >
                  JD
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
                    Verified Client
                  </div>
                  <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
                    SaaS Founder
                  </div>
                </div>
              </div>

              <div style={{ color: "#fbbf24", fontSize: 22, letterSpacing: 3 }}>
                ★★★★★
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#1f2937",
                  lineHeight: 1.4,
                }}
              >
                "Exceptional workflow setup! Fast, reliable, and saved us thousands in automation costs."
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================================= */}
      {/* PHASE 5: THE RADIAL APP OUTRO                                             */}
      {/* ========================================================================= */}
      {frame >= 710 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1000,
          }}
        >
          {/* Radial Orbit Container */}
          <div
            style={{
              position: "relative",
              width: 600,
              height: 480,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Centerpiece: n8n Logo with Compound Glow */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 36,
                backgroundColor: "#ea580c",
                boxShadow:
                  "0 10px 25px rgba(234, 88, 12, 0.25), 0 30px 90px rgba(234, 88, 12, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 48,
                fontWeight: 900,
                transform: `scale(${logoCenterScale}) translateY(${logoCenterLifeY}px)`,
                opacity: logoCenterOpacity,
                zIndex: 20,
              }}
            >
              n8n
            </div>

            {/* Orbiting App Icons with Individual Life Loops */}
            {apps.map((app, index) => {
              const iconPopSpring = spring({
                frame: frame - (736 + index * 2.5),
                fps,
                config: { stiffness: 220, damping: 16 },
              });

              const currentRadius = interpolate(iconPopSpring, [0, 1], [0, orbitRadius]);
              const popOpacity = interpolate(iconPopSpring, [0, 1], [0, 1]);

              const angleDeg = index * (360 / apps.length) + baseOrbitAngle;
              const angleRad = (angleDeg * Math.PI) / 180;

              const x = Math.cos(angleRad) * currentRadius;
              const y = Math.sin(angleRad) * currentRadius;

              // Individual Life Loop offset
              const iconLifeY = Math.sin((frame + index * 40) * 0.06) * 4;

              return (
                <div
                  key={app.name}
                  style={{
                    position: "absolute",
                    transform: `translate(${x}px, ${y + iconLifeY}px) rotate(${-baseOrbitAngle}deg)`,
                    opacity: popOpacity,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      backgroundColor: "#ffffff",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.04), 0 16px 36px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      fontWeight: 800,
                      color: app.color,
                    }}
                  >
                    {app.icon}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fiverr CTA Text Masked Reveal */}
          <div style={{ marginTop: 40, overflow: "hidden", padding: "6px 0" }}>
            <h2
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#202124",
                letterSpacing: "-1.5px",
                margin: 0,
                transform: `translateY(${ctaY}px)`,
              }}
            >
              Hire an n8n Expert on Fiverr.
            </h2>
          </div>

          {/* Fiverr Logo Badge */}
          <div
            style={{
              marginTop: 20,
              transform: `translateY(${fiverrLogoY}px) scale(${fiverrLogoScale})`,
              opacity: fiverrLogoOpacity,
            }}
          >
            <div
              style={{
                backgroundColor: "#1dbf73",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: 22,
                padding: "12px 32px",
                borderRadius: 30,
                letterSpacing: "-0.5px",
                boxShadow:
                  "0 6px 18px rgba(29, 191, 115, 0.25), 0 16px 40px rgba(29, 191, 115, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>fiverr.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
