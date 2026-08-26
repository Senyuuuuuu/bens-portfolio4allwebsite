/**
 * ComponentRegistry.tsx
 *
 * Stacks ClipScene segments sequentially using Remotion's <Series> component.
 * Each scene renders:
 *  1. FaceTracker — dynamic 9:16 vertical crop with pan/zoom
 *  2. B-Roll overlays — spring-animated AI image cards
 *  3. DynamicSubtitles — word-level caption pop-up (per scene or global)
 *  4. Optional text overlay badge
 *
 * CRITICAL: B-roll spring offset is computed from `useCurrentFrame()` which
 * inside a <Sequence> is ALWAYS relative to that Sequence's `from` prop.
 * Do NOT add scene.startFrame again — that would double-offset the spring.
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Img } from "remotion";
import type { ClipScene } from "../types/clipping";
import { FaceTracker } from "./FaceTracker";
import { DynamicSubtitles } from "./DynamicSubtitles";
import type { Caption } from "@remotion/captions";

interface ComponentRegistryProps {
  scenes: ClipScene[];
  fallbackVodUrl: string;
  globalCaptions?: Caption[];
}

// ---------------------------------------------------------------------------
// B-Roll overlay — spring-in card composited over the streamer footage
// ---------------------------------------------------------------------------
interface BRollCardProps {
  imageUrl: string;
}

const BRollCard: React.FC<BRollCardProps> = ({ imageUrl }) => {
  const frame = useCurrentFrame(); // ← scoped to THIS <Sequence>
  const { fps } = useVideoConfig();

  // Spring pop-in: stiffness 120, damping 14 per JARVIS mandate
  const spr = spring({
    frame,
    fps,
    config: { stiffness: 120, damping: 14 },
    durationInFrames: Math.round(fps * 0.5),
  });

  const opacity = interpolate(spr, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideY = interpolate(spr, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scaleVal = interpolate(spr, [0, 1], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        translate: `0px ${slideY}px`,
        scale: String(scaleVal),
        justifyContent: "center",
        alignItems: "center",
        // ⚠️ NO CSS transition
      }}
    >
      <Img
        src={imageUrl}
        style={{
          width: "90%",
          height: "50%",
          borderRadius: 28,
          objectFit: "cover",
          boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
          border: "3px solid rgba(255,255,255,0.22)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Single scene renderer
// ---------------------------------------------------------------------------
interface SceneRendererProps {
  scene: ClipScene;
  fallbackVodUrl: string;
  globalCaptions?: Caption[];
}

const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  fallbackVodUrl,
  globalCaptions,
}) => {
  const vodUrl = scene.vodSourceUrl || fallbackVodUrl;
  const captions = scene.whisperCaptions ?? globalCaptions ?? [];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F17" }}>
      {/* 1. Face-tracked streamer footage — startFrom seeks to the correct VOD timestamp */}
      <FaceTracker
        src={vodUrl}
        keyframes={scene.faceTrackingKeyframes}
        durationInFrames={scene.durationInFrames}
        startFrom={scene.startFrame}
      />

      {/* 2. B-Roll AI image overlays */}
      {scene.bRollOverlays?.map((broll, idx) => {
        if (!broll.imageUrl) return null;
        return (
          <Sequence
            key={`broll-${idx}`}
            from={broll.startFrame}
            durationInFrames={broll.durationInFrames}
            layout="none"
          >
            <BRollCard imageUrl={broll.imageUrl} />
          </Sequence>
        );
      })}

      {/* 3. Per-scene or global word-level subtitles */}
      {captions.length > 0 && <DynamicSubtitles captions={captions} />}

      {/* 4. Optional text overlay badge */}
      {scene.textOverlay && <SceneTextBadge text={scene.textOverlay} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Text overlay badge (hook text rendered at top-centre of the scene)
// ---------------------------------------------------------------------------
const SceneTextBadge: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { stiffness: 180, damping: 16 },
    durationInFrames: Math.round(fps * 0.4),
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 72 }}
    >
      <div
        style={{
          opacity: spr,
          scale: String(interpolate(spr, [0, 1], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })),
          backgroundColor: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(14px)",
          padding: "14px 32px",
          borderRadius: 40,
          border: "2.5px solid rgba(255,230,0,0.85)",
          color: "#FFFFFF",
          fontFamily: "'Outfit', 'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "1px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
          textTransform: "uppercase",
          maxWidth: "88%",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main export — Series-stacked scene registry
// ---------------------------------------------------------------------------
export const ComponentRegistry: React.FC<ComponentRegistryProps> = ({
  scenes,
  fallbackVodUrl,
  globalCaptions,
}) => {
  return (
    <AbsoluteFill>
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
            offset={0}
          >
            <SceneRenderer
              scene={scene}
              fallbackVodUrl={fallbackVodUrl}
              globalCaptions={globalCaptions}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

