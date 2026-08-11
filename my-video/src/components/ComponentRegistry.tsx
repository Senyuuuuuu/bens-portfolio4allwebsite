import React from "react";
import { AbsoluteFill, Sequence, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ClipScene } from "../types/clipping";
import { FaceTracker } from "./FaceTracker";

interface ComponentRegistryProps {
  scenes: ClipScene[];
  fallbackVodUrl: string;
}

export const ComponentRegistry: React.FC<ComponentRegistryProps> = ({
  scenes,
  fallbackVodUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F17" }}>
      {scenes.map((scene) => {
        const vodUrl = scene.vodSourceUrl || fallbackVodUrl;

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            {/* 1. Main Face-Tracked Streamer Crop */}
            <FaceTracker src={vodUrl} keyframes={scene.faceTrackingKeyframes} />

            {/* 2. B-Roll AI Image Overlays */}
            {scene.bRollOverlays?.map((broll, idx) => {
              if (!broll.imageUrl) return null;

              const brollFrame = frame - (scene.startFrame + broll.startFrame);
              const spr = spring({
                frame: brollFrame,
                fps,
                config: { stiffness: 120, damping: 14 },
              });
              const opacity = interpolate(spr, [0, 1], [0, 1]);

              return (
                <Sequence
                  key={`broll-${idx}`}
                  from={broll.startFrame}
                  durationInFrames={broll.durationInFrames}
                >
                  <AbsoluteFill style={{ opacity, justifyContent: "center", alignItems: "center" }}>
                    <Img
                      src={broll.imageUrl}
                      style={{
                        width: "90%",
                        height: "50%",
                        borderRadius: 24,
                        objectFit: "cover",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                        border: "3px solid rgba(255,255,255,0.2)",
                      }}
                    />
                  </AbsoluteFill>
                </Sequence>
              );
            })}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
