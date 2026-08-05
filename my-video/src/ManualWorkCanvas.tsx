import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Easing,
} from "remotion";

export const ManualWorkCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;

  // Total duration: 5 seconds = 300 frames @ 60fps
  // Phase 1 (0 to 60 frames): Capsule Morph Expansion & Node Shatter Entry from Scene 0
  // Phase 2 (60 to 240 frames): Micro-Jitter Parallax Chaos & Typography Punchline Slam
  // Phase 3 (240 to 300 frames): Magnetic Implosion & Color Morph into Scene 2 Tablet Container

  // --- PHASE 1: CAPSULE MORPH ENTRY (0 to 60 frames) ---
  const entryMorphSpring = spring({
    frame,
    fps,
    config: { mass: 1, damping: 14, stiffness: 120 },
  });

  // Entry capsule bounds morphing from Scene 0 capsule (360x80, r=40px) outward
  const entryCapsuleScale = interpolate(entryMorphSpring, [0, 0.4, 1], [1, 1.2, 0]);
  const entryCapsuleOpacity = interpolate(entryMorphSpring, [0, 0.5, 1], [1, 0.8, 0]);

  // Staggered Node Expansion from central capsule
  const getNodeEntryAnim = (delay: number, targetX: number, targetY: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { mass: 0.9, damping: 14, stiffness: 120 },
    });

    const posX = interpolate(s, [0, 1], [0, targetX]);
    const posY = interpolate(s, [0, 1], [0, targetY]);
    const nodeScale = interpolate(s, [0, 1], [0.1, 1]);
    const nodeOpacity = interpolate(s, [0, 1], [0, 1]);

    return { posX, posY, scale: nodeScale, opacity: nodeOpacity };
  };

  // --- PHASE 3: MAGNETIC IMPLOSION EXIT MORPH (240 to 300 frames) ---
  const exitMorphSpring = spring({
    frame: frame - 240,
    fps,
    config: { mass: 1.1, damping: 14, stiffness: 120 },
  });

  const exitImplodeProgress = interpolate(frame, [240, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.85, 0, 0.15, 1),
  });

  // Target positions for 4 nodes in Phase 2
  const node1Entry = getNodeEntryAnim(10, -560, -260);
  const node2Entry = getNodeEntryAnim(18, 520, -280);
  const node3Entry = getNodeEntryAnim(26, -500, 240);
  const node4Entry = getNodeEntryAnim(34, 540, 220);

  // Magnetic implosion factor (nodes pull into 0,0 at frame 240-300)
  const implodeFactor = interpolate(exitImplodeProgress, [0, 1], [1, 0]);
  const nodesFadeOut = interpolate(exitImplodeProgress, [0, 0.8, 1], [1, 0.4, 0]);

  // Merged dense tablet container emerging at center screen during implosion
  const mergedContainerWidth = interpolate(exitImplodeProgress, [0, 1], [300, 480]);
  const mergedContainerHeight = interpolate(exitImplodeProgress, [0, 1], [120, 320]);
  const mergedContainerRadius = interpolate(exitImplodeProgress, [0, 1], [16, 24]);
  const mergedContainerOpacity = interpolate(exitImplodeProgress, [0, 0.3, 1], [0, 1, 1]);

  // Color morph: Amber/Red warning border -> Dark space gray tablet bezel (#08080a) with indigo glow (#5e5ce6)
  const colorMorphR = Math.round(interpolate(exitImplodeProgress, [0, 1], [239, 8]));
  const colorMorphG = Math.round(interpolate(exitImplodeProgress, [0, 1], [68, 8]));
  const colorMorphB = Math.round(interpolate(exitImplodeProgress, [0, 1], [68, 10]));

  // Micro tremor screen shake
  const tremorX = Math.sin(frame * 0.8) * 2.5 * (1 - exitImplodeProgress);
  const tremorY = Math.cos(frame * 0.9) * 2 * (1 - exitImplodeProgress);

  // Spinner rotation
  const spinnerRot = (frame * 12) % 360;

  // --- TYPOGRAPHY PUNCHLINE (108 to 240 frames) ---
  const overlayOpacity = interpolate(frame, [108, 140, 230, 270], [0, 0.82, 0.82, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 1 Reveal: IS EVERYTHING
  const line1Spring = spring({
    frame: frame - 110,
    fps,
    config: { stiffness: 180, damping: 12 },
  });
  const line1Opacity = interpolate(line1Spring, [0, 1], [0, 1]) * (1 - exitImplodeProgress);

  // Line 2 Slam: STILL MANUAL?
  const line2Spring = spring({
    frame: frame - 122,
    fps,
    config: { stiffness: 240, damping: 10 },
  });
  const line2Opacity = interpolate(line2Spring, [0, 1], [0, 1]) * (1 - exitImplodeProgress);
  const line2Scale = interpolate(line2Spring, [0, 1], [1.45, 1.0]) * implodeFactor + (1 - implodeFactor) * 0.2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0b0e",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Whiteboard Grid */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          transform: `translate(${tremorX}px, ${tremorY}px)`,
        }}
      />

      {/* Entry Morph Capsule from Scene 0 */}
      {entryCapsuleScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            width: "360px",
            height: "80px",
            borderRadius: "40px",
            backgroundColor: "rgba(18, 22, 30, 0.9)",
            border: "2px solid rgba(239, 68, 68, 0.8)",
            boxShadow: "0 0 40px rgba(239, 68, 68, 0.6)",
            transform: `scale(${entryCapsuleScale})`,
            opacity: entryCapsuleOpacity,
            zIndex: 15,
          }}
        />
      )}

      {/* Master 3D Perspective Canvas Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${tremorX}px, ${tremorY}px)`,
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
      >
        {/* SVG Connector Wires */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            opacity: nodesFadeOut,
          }}
        >
          <path
            d="M 380 280 C 520 200, 680 420, 850 320"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <path
            d="M 1520 300 C 1300 480, 1150 250, 950 480"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
          />
        </svg>

        {/* Node 1 */}
        <div
          style={{
            position: "absolute",
            width: "380px",
            padding: "20px 24px",
            borderRadius: "16px",
            backgroundColor: "rgba(18, 22, 30, 0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            transform: `translate(${node1Entry.posX * implodeFactor}px, ${node1Entry.posY * implodeFactor}px) rotateX(10deg) rotateY(-8deg) scale(${node1Entry.scale * implodeFactor})`,
            opacity: node1Entry.opacity * nodesFadeOut,
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>📊</span>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "15px" }}>leads_export_v4.csv</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "2.5px solid rgba(239, 68, 68, 0.2)",
                borderTopColor: "#ef4444",
                transform: `rotate(${spinnerRot}deg)`,
              }}
            />
          </div>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#f87171", fontWeight: 600 }}>
            ⚠️ 4,096 Rows pending manual sync...
          </div>
        </div>

        {/* Node 2 */}
        <div
          style={{
            position: "absolute",
            width: "420px",
            borderRadius: "16px",
            backgroundColor: "rgba(18, 22, 30, 0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            transform: `translate(${node2Entry.posX * implodeFactor}px, ${node2Entry.posY * implodeFactor}px) rotateX(8deg) rotateY(12deg) scale(${node2Entry.scale * implodeFactor})`,
            opacity: node2Entry.opacity * nodesFadeOut,
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>CRM Lead Intake Form</div>
            <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "4px" }}>
              Field #42: Session Timed Out
            </div>
          </div>
        </div>

        {/* Node 3 */}
        <div
          style={{
            position: "absolute",
            width: "360px",
            padding: "20px 24px",
            borderRadius: "16px",
            backgroundColor: "rgba(18, 22, 30, 0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            transform: `translate(${node3Entry.posX * implodeFactor}px, ${node3Entry.posY * implodeFactor}px) rotateX(-6deg) rotateY(-10deg) scale(${node3Entry.scale * implodeFactor})`,
            opacity: node3Entry.opacity * nodesFadeOut,
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ padding: "4px 8px", borderRadius: "100px", backgroundColor: "#ef4444", color: "#ffffff", fontSize: "12px", fontWeight: 900 }}>
              +99 FAILED
            </span>
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px" }}>API Error</span>
          </div>
        </div>

        {/* Node 4 */}
        <div
          style={{
            position: "absolute",
            width: "370px",
            padding: "20px 24px",
            borderRadius: "16px",
            backgroundColor: "rgba(18, 22, 30, 0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            transform: `translate(${node4Entry.posX * implodeFactor}px, ${node4Entry.posY * implodeFactor}px) rotateX(-8deg) rotateY(8deg) scale(${node4Entry.scale * implodeFactor})`,
            opacity: node4Entry.opacity * nodesFadeOut,
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#f59e0b" }}>MANUAL REPEAT CYCLE</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginTop: "4px" }}>Cmd+C ➔ Cmd+V ➔ Repeat</div>
        </div>

        {/* Exit Morph Tablet Bezel Container (Emerges at center screen frames 240-300) */}
        {mergedContainerOpacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              width: `${mergedContainerWidth}px`,
              height: `${mergedContainerHeight}px`,
              borderRadius: `${mergedContainerRadius}px`,
              backgroundColor: `rgb(${colorMorphR}, ${colorMorphG}, ${colorMorphB})`,
              border: `2px solid rgba(94, 92, 230, ${exitImplodeProgress * 0.8})`,
              boxShadow: `0 30px 90px rgba(0, 0, 0, 0.8), 0 0 ${exitImplodeProgress * 50}px rgba(94, 92, 230, 0.4)`,
              opacity: mergedContainerOpacity,
              zIndex: 20,
            }}
          />
        )}
      </div>

      {/* Dark Overlay Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(10, 11, 14, ${overlayOpacity})`,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Headline Punchline */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {line1Spring > 0 && (
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "4px",
              textTransform: "uppercase",
              opacity: line1Opacity,
              marginBottom: "8px",
            }}
          >
            IS EVERYTHING
          </div>
        )}

        {line2Spring > 0 && (
          <h1
            style={{
              margin: 0,
              fontSize: "88px",
              fontWeight: 900,
              letterSpacing: "2px",
              textTransform: "uppercase",
              opacity: line2Opacity,
              transform: `scale(${line2Scale})`,
              background: "linear-gradient(135deg, #ef4444 0%, #f87171 50%, #f59e0b 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            STILL MANUAL?
          </h1>
        )}
      </div>
    </AbsoluteFill>
  );
};
