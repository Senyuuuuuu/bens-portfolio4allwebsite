/**
 * FaceTracker.tsx
 *
 * Dynamically pans and zooms the source VOD so the streamer's face is always
 * centred inside the 9:16 (1080×1920) vertical crop.
 *
 * Technique:
 *  - Keyframes (timeInSeconds, xPercentage, yPercentage, zoomScale) are
 *    interpolated over the global frame timeline via Remotion's `interpolate()`.
 *  - A spring filter is applied per-axis to produce butter-smooth camera motion
 *    that matches JARVIS' seamless morphing mandate.
 *  - NO CSS `transition` or `animation` properties are used — those break
 *    Remotion's frame-accurate rendering pipeline.
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import type { FaceTrackingPoint } from "../types/clipping";

interface FaceTrackerProps {
  src: string;
  keyframes?: FaceTrackingPoint[];
  defaultScale?: number;
  /** Total frames in the SOURCE VOD we are trimming to. */
  durationInFrames?: number;
  /**
   * The frame in the SOURCE VOD where this clip segment begins.
   * Maps to Remotion <Video trimBefore> (renamed from startFrom in v4).
   * This seeks the video to the correct timestamp so each scene shows
   * the right moment in the VOD — not frame 0 every time.
   * Defaults to 0 (beginning of video).
   */
  startFrom?: number;
}

export const FaceTracker: React.FC<FaceTrackerProps> = ({
  src,
  keyframes = [],
  defaultScale = 2.0,
  durationInFrames,
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  const videoSrc =
    src.startsWith("http://") || src.startsWith("https://")
      ? src
      : staticFile(src);

  // -------------------------------------------------------------------------
  // Interpolate raw keyframe values over the frame timeline
  // -------------------------------------------------------------------------
  let rawX = 50;
  let rawY = 50;
  let rawScale = defaultScale;

  if (keyframes.length >= 2) {
    const times = keyframes.map((k) => k.timeInSeconds);
    rawX = interpolate(currentTimeSec, times, keyframes.map((k) => k.xPercentage), {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    rawY = interpolate(currentTimeSec, times, keyframes.map((k) => k.yPercentage), {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    rawScale = interpolate(
      currentTimeSec,
      times,
      keyframes.map((k) => k.zoomScale ?? defaultScale),
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else if (keyframes.length === 1) {
    rawX = keyframes[0].xPercentage;
    rawY = keyframes[0].yPercentage;
    rawScale = keyframes[0].zoomScale ?? defaultScale;
  }

  // -------------------------------------------------------------------------
  // Spring-smooth the raw interpolated values for cinematic camera glide
  // spring() requires an integer frame index, so we use the current frame
  // directly and let the keyframe interpolation supply the target value.
  // We achieve smoothing by layering a spring over the delta from centre.
  // -------------------------------------------------------------------------
  const springConfig = { stiffness: 120, damping: 14 };

  const smoothX = spring({
    frame,
    fps,
    from: 50,
    to: rawX,
    config: springConfig,
    durationInFrames: durationInFrames ?? frame + 1,
  });

  const smoothY = spring({
    frame,
    fps,
    from: 50,
    to: rawY,
    config: springConfig,
    durationInFrames: durationInFrames ?? frame + 1,
  });

  // Convert percentage offsets to translate values:
  // (50 - tracked%) * factor gives direction + magnitude in px
  const translateX = (50 - smoothX) * 3.2; // horizontal: wider range
  const translateY = (50 - smoothY) * 2.0; // vertical: tighter range

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Single wrapper div — all motion is driven by frame-computed CSS values */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // ⚠️ NO `transition` here — values are fully frame-driven.
          scale: String(rawScale),
          translate: `${translateX}px ${translateY}px`,
        }}
      >
        <Video
          src={videoSrc}
          // ✅ trimBefore (formerly startFrom) seeks the VOD to the correct
          // scene timestamp. Without this, every scene plays from frame 0.
          trimBefore={startFrom}
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
