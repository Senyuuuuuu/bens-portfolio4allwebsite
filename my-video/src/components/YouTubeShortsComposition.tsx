import React from "react";
import { AbsoluteFill } from "remotion";
import type { YouTubeShortsProps } from "../types/clipping";
import { ComponentRegistry } from "./ComponentRegistry";
import { DynamicSubtitles } from "./DynamicSubtitles";
import type { Caption } from "@remotion/captions";

// Default sample captions if none passed in payload
const DEFAULT_CAPTIONS: Caption[] = [
  { text: " WAIT", startMs: 0, endMs: 400, timestampMs: 0, confidence: 0.99 },
  { text: " TILL", startMs: 400, endMs: 700, timestampMs: 400, confidence: 0.99 },
  { text: " YOU", startMs: 700, endMs: 900, timestampMs: 700, confidence: 0.99 },
  { text: " SEE", startMs: 900, endMs: 1200, timestampMs: 900, confidence: 0.99 },
  { text: " THIS", startMs: 1200, endMs: 1500, timestampMs: 1200, confidence: 0.99 },
  { text: " INSANE", startMs: 1500, endMs: 2000, timestampMs: 1500, confidence: 0.99 },
  { text: " PLAY!", startMs: 2000, endMs: 2600, timestampMs: 2000, confidence: 0.99 },
  { text: " LIKE", startMs: 2800, endMs: 3200, timestampMs: 2800, confidence: 0.99 },
  { text: " AND", startMs: 3200, endMs: 3500, timestampMs: 3200, confidence: 0.99 },
  { text: " SUBSCRIBE!", startMs: 3500, endMs: 4200, timestampMs: 3500, confidence: 0.99 },
];

export const YouTubeShortsComposition: React.FC<YouTubeShortsProps> = ({
  title,
  vodSourceUrl,
  scenes,
}) => {
  const formattedScenes = scenes.map((sc) => ({
    id: sc.id,
    vodSourceUrl,
    startFrame: sc.startFrame,
    durationInFrames: sc.durationInFrames,
    faceTrackingKeyframes: [
      { timeInSeconds: 0, xPercentage: 50, yPercentage: 50, zoomScale: 2.0 },
      { timeInSeconds: 5, xPercentage: 45, yPercentage: 50, zoomScale: 2.1 },
      { timeInSeconds: 10, xPercentage: 55, yPercentage: 50, zoomScale: 2.0 },
    ],
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 1. Base Streamer Video & Face-Tracked Scene Layer */}
      <ComponentRegistry scenes={formattedScenes} fallbackVodUrl={vodSourceUrl} />

      {/* 2. Top Header Title Badge */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            padding: "16px 36px",
            borderRadius: "40px",
            border: "2px solid rgba(255, 230, 0, 0.8)",
            color: "#FFFFFF",
            fontFamily: "'Outfit', 'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "1px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </div>
      </div>

      {/* 3. TikTok / Reels Dynamic Kinetic Subtitles */}
      <DynamicSubtitles captions={DEFAULT_CAPTIONS} />
    </AbsoluteFill>
  );
};
