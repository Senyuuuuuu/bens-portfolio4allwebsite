import { z } from "zod";
import type { Caption } from "@remotion/captions";

export interface FaceTrackingPoint {
  timeInSeconds: number;
  xPercentage: number; // 0 to 100% horizontally
  yPercentage: number; // 0 to 100% vertically
  zoomScale?: number;  // Default 1.8x to 2.2x for vertical crop
}

export interface BRollScene {
  startFrame: number;
  durationInFrames: number;
  imageUrl?: string;
  imagePrompt?: string;
  haircutStyle?: "jellyfish cut" | "octopus cut" | "mohawk" | "faux hawk" | "Deva cut" | "rezo cut" | "TWA cut";
}

export interface ClipScene {
  id: string;
  vodSourceUrl: string;
  startFrame: number;
  durationInFrames: number;
  faceTrackingKeyframes?: FaceTrackingPoint[];
  bRollOverlays?: BRollScene[];
  whisperCaptions?: Caption[];
}

export const YouTubeShortsSchema = z.object({
  title: z.string().default("Epic Streamer Highlight #Shorts"),
  vodSourceUrl: z.string().default("input_video.mp4"),
  scenes: z.array(
    z.object({
      id: z.string(),
      startFrame: z.number(),
      durationInFrames: z.number(),
      textOverlay: z.string().optional(),
    })
  ).default([
    {
      id: "scene-1",
      startFrame: 0,
      durationInFrames: 300,
      textOverlay: "UNBELIEVABLE STREAM MOMENT!",
    },
  ]),
});

export type YouTubeShortsProps = z.infer<typeof YouTubeShortsSchema>;
