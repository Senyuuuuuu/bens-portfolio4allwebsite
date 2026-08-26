import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CleanKineticN8nAd } from "./CleanKineticN8nAd";
import { DigitalArchitectIntro } from "./DigitalArchitectIntro";
import { SaaSPlatformAd } from "./SaaSPlatformAd";
import { HighlanderSaaSAd } from "./HighlanderSaaSAd";
import { VideoApplication } from "./VideoApplication";
import { YouTubeShortsComposition } from "./components/YouTubeShortsComposition";
import { YouTubeShortsSchema, type YouTubeShortsProps } from "./types/clipping";

/**
 * calculateMetadata — dynamically computes the total durationInFrames from the
 * sum of all scene durations in the validated JSON payload.
 * This allows any n8n-generated payload (short or long) to render correctly
 * without manually updating the hardcoded frame count.
 */
const calculateShortsDuration = async ({
  props,
}: {
  props: YouTubeShortsProps;
}) => {
  const totalFrames = props.scenes.reduce(
    (sum, scene) => sum + scene.durationInFrames,
    0,
  );
  // Clamp: minimum 1 second, maximum 3 minutes at 30fps (YouTube Shorts limit)
  const clamped = Math.max(30, Math.min(totalFrames, 5400));
  return { durationInFrames: clamped };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🎬 YOUTUBE SHORTS CLIPPING AUTOMATION STUDIO (9:16 Vertical - 1080×1920) */}
      {/*
        Duration is computed dynamically via calculateMetadata:
        total = sum(scene.durationInFrames) clamped to [30, 5400] frames.
        The hardcoded fallback of 900 frames (30s) is only used in Studio
        before a real payload is loaded.
      */}
      <Composition
        id="YouTubeShorts"
        component={YouTubeShortsComposition}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        schema={YouTubeShortsSchema}
        calculateMetadata={calculateShortsDuration}
        defaultProps={{
          title: "🔥 UNBELIEVABLE STREAM MOMENT!",
          vodSourceUrl: "input_video.mp4",
          scenes: [
            {
              id: "scene-1",
              vodSourceUrl: "input_video.mp4",
              startFrame: 0,
              durationInFrames: 300,
              textOverlay: "INSANE CLUTCH MOMENT",
              faceTrackingKeyframes: [
                { timeInSeconds: 0, xPercentage: 50, yPercentage: 50, zoomScale: 2.0 },
                { timeInSeconds: 5, xPercentage: 45, yPercentage: 48, zoomScale: 2.1 },
              ],
              whisperCaptions: [
                { text: " WAIT", startMs: 0, endMs: 400, timestampMs: 0, confidence: 0.99 },
                { text: " TILL", startMs: 400, endMs: 700, timestampMs: 400, confidence: 0.99 },
                { text: " YOU", startMs: 700, endMs: 1000, timestampMs: 700, confidence: 0.99 },
                { text: " SEE", startMs: 1000, endMs: 1300, timestampMs: 1000, confidence: 0.99 },
                { text: " THIS!", startMs: 1300, endMs: 1800, timestampMs: 1300, confidence: 0.99 },
              ],
            },
            {
              id: "scene-2",
              vodSourceUrl: "input_video.mp4",
              startFrame: 300,
              durationInFrames: 300,
              textOverlay: "UNBELIEVABLE REACTION",
              faceTrackingKeyframes: [
                { timeInSeconds: 0, xPercentage: 52, yPercentage: 50, zoomScale: 2.0 },
              ],
            },
            {
              id: "scene-3",
              vodSourceUrl: "input_video.mp4",
              startFrame: 600,
              durationInFrames: 300,
              textOverlay: "LIKE & SUBSCRIBE!",
              faceTrackingKeyframes: [
                { timeInSeconds: 0, xPercentage: 50, yPercentage: 50, zoomScale: 2.0 },
              ],
              whisperCaptions: [
                { text: " LIKE", startMs: 0, endMs: 600, timestampMs: 0, confidence: 0.99 },
                { text: " AND", startMs: 600, endMs: 900, timestampMs: 600, confidence: 0.99 },
                { text: " SUBSCRIBE!", startMs: 900, endMs: 1500, timestampMs: 900, confidence: 0.99 },
              ],
            },
          ],
        }}
      />

      {/* 🎬 BENYAMIN NAMTALASHVILI APPLICATION VIDEO (90s @ 60FPS = 5400 frames) */}
      <Composition
        id="VideoApplication"
        component={VideoApplication}
        durationInFrames={5400}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 🎬 HIGHLANDER SAAS GLASSMORPHISM SUITE (54s @ 60FPS = 3240 frames) */}
      <Composition
        id="HighlanderSaaSAd"
        component={HighlanderSaaSAd}
        durationInFrames={3240}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 🎬 STANDALONE PERSONAL BRAND HOOK (9s @ 60FPS = 540 frames) */}
      <Composition
        id="DigitalArchitectIntro"
        component={DigitalArchitectIntro}
        durationInFrames={540}
        fps={60}
        width={1920}
        height={1080}
      />
      {/* 🎬 PREMIUM SAAS PLATFORM AD (24s @ 60FPS = 1440 frames) */}
      <Composition
        id="SaaSPlatformAd"
        component={SaaSPlatformAd}
        durationInFrames={1440}
        fps={60}
        width={1920}
        height={1080}
      />
      {/* 🎬 MAIN GIG AD: Clean Kinetic Tech n8n Fiverr Ad (25 Seconds @ 60FPS = 1500 frames) */}
      <Composition
        id="CleanKineticN8nAd"
        component={CleanKineticN8nAd}
        durationInFrames={1500}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
