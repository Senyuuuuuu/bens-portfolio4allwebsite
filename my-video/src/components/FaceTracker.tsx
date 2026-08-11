import React from "react";
import { AbsoluteFill, Video, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { FaceTrackingPoint } from "../types/clipping";

interface FaceTrackerProps {
  src: string;
  keyframes?: FaceTrackingPoint[];
  defaultScale?: number;
}

export const FaceTracker: React.FC<FaceTrackerProps> = ({
  src,
  keyframes = [],
  defaultScale = 2.0,
}) => {
  const videoSrc = src.startsWith("http://") || src.startsWith("https://") ? src : staticFile(src);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  // Calculate tracked face X percentage (default 50% = center)
  let trackedX = 50;
  let trackedY = 50;
  let currentScale = defaultScale;

  if (keyframes.length > 0) {
    const times = keyframes.map((k) => k.timeInSeconds);
    const xValues = keyframes.map((k) => k.xPercentage);
    const yValues = keyframes.map((k) => k.yPercentage);
    const scaleValues = keyframes.map((k) => k.zoomScale ?? defaultScale);

    trackedX = interpolate(currentTimeSec, times, xValues, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    trackedY = interpolate(currentTimeSec, times, yValues, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    currentScale = interpolate(currentTimeSec, times, scaleValues, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Calculate CSS translation to center the tracked coordinate in 9:16 container
  const offsetX = (50 - trackedX) * 2.5; // Smooth horizontal panning offset
  const offsetY = (50 - trackedY) * 1.5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${currentScale}) translate(${offsetX}px, ${offsetY}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Video
          src={videoSrc}
          style={{
            minWidth: "100%",
            minHeight: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
