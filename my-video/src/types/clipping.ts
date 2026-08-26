/**
 * clipping.ts — Core Zod schemas & TypeScript types for the YouTube Shorts
 * Clipping Automation Studio. Validates the JSON payload emitted by the n8n
 * LLM node before it reaches the Remotion renderer.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Haircut naming conventions (per LLM system prompt constraints)
// ---------------------------------------------------------------------------
export const HaircutStyleSchema = z.enum([
  "jellyfish cut",
  "octopus cut",
  "mohawk",
  "faux hawk",
  "Deva cut",
  "rezo cut",
  "TWA cut",
]);
export type HaircutStyle = z.infer<typeof HaircutStyleSchema>;

// ---------------------------------------------------------------------------
// Caption token — compatible with @remotion/captions Caption interface
// ---------------------------------------------------------------------------
export const CaptionSchema = z.object({
  text: z.string(),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  timestampMs: z.number().nonnegative(),
  confidence: z.number().min(0).max(1).default(0.9),
});
export type CaptionToken = z.infer<typeof CaptionSchema>;

// ---------------------------------------------------------------------------
// Face-Tracking Keyframe
// ---------------------------------------------------------------------------
export const FaceTrackingKeyframeSchema = z.object({
  /** Seconds relative to the START of this scene (not the global timeline). */
  timeInSeconds: z.number().nonnegative(),
  /** Horizontal position of the tracked subject, 0–100%. */
  xPercentage: z.number().min(0).max(100),
  /** Vertical position of the tracked subject, 0–100%. */
  yPercentage: z.number().min(0).max(100),
  /** Zoom multiplier (1×–4×). Default 2.0 for 9:16 vertical crop. */
  zoomScale: z.number().min(1).max(4).default(2.0),
});
export type FaceTrackingPoint = z.infer<typeof FaceTrackingKeyframeSchema>;

// ---------------------------------------------------------------------------
// B-Roll overlay (AI image composited on top of streamer footage)
// ---------------------------------------------------------------------------
export const BRollSceneSchema = z.object({
  /** Frame offset relative to the parent ClipScene's startFrame. */
  startFrame: z.number().nonnegative(),
  durationInFrames: z.number().positive(),
  /** Resolved CDN or local staticFile URL. Omit to skip this overlay slot. */
  imageUrl: z.string().optional(),
  /** Raw prompt sent to the image-generation model (stored for audit). */
  imagePrompt: z.string().optional(),
  /** Approved haircut naming convention used in the prompt. */
  haircutStyle: HaircutStyleSchema.optional(),
});
export type BRollScene = z.infer<typeof BRollSceneSchema>;

// ---------------------------------------------------------------------------
// Clip Scene — one segment of the final Short
// ---------------------------------------------------------------------------
export const ClipSceneSchema = z.object({
  id: z.string().min(1),
  vodSourceUrl: z.string().min(1),
  /** Start frame IN THE SOURCE VOD for this clip segment. */
  startFrame: z.number().nonnegative(),
  /** Frames this scene contributes to the final output timeline. */
  durationInFrames: z.number().positive(),
  /** Punchy action-hook badge rendered at the top of this scene. */
  textOverlay: z.string().optional(),
  /** Face-tracking keyframes. Defaults to centred crop at 2× zoom. */
  faceTrackingKeyframes: z.array(FaceTrackingKeyframeSchema).optional(),
  /** B-roll overlays (timestamps relative to THIS scene). */
  bRollOverlays: z.array(BRollSceneSchema).optional(),
  /**
   * Word-level captions. Timestamps MUST be relative to this scene
   * (0 ms = first frame of this scene).
   */
  whisperCaptions: z.array(CaptionSchema).optional(),
});
export type ClipScene = z.infer<typeof ClipSceneSchema>;

// ---------------------------------------------------------------------------
// Root composition schema — the validated n8n → Remotion payload contract
// ---------------------------------------------------------------------------
export const YouTubeShortsSchema = z.object({
  /** Title displayed in the header badge and YouTube upload metadata. */
  title: z.string().default("🔥 Epic Streamer Highlight #Shorts"),
  /** Fallback VOD URL used when individual scenes omit their own. */
  vodSourceUrl: z.string().min(1).default("input_video.mp4"),
  /** Ordered scene segments stacked via <Series> to form the timeline. */
  scenes: z
    .array(ClipSceneSchema)
    .min(1)
    .default([
      {
        id: "scene-1",
        vodSourceUrl: "input_video.mp4",
        startFrame: 0,
        durationInFrames: 300,
        textOverlay: "INSANE CLUTCH MOMENT",
        faceTrackingKeyframes: [
          { timeInSeconds: 0, xPercentage: 50, yPercentage: 50, zoomScale: 2.0 },
        ],
      },
    ]),
  /**
   * Global captions for the entire Short (ms from frame 0).
   * Used when scenes don't carry scene-level whisperCaptions.
   */
  globalCaptions: z.array(CaptionSchema).optional(),
});

export type YouTubeShortsProps = z.infer<typeof YouTubeShortsSchema>;
