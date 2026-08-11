import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CleanKineticN8nAd } from "./CleanKineticN8nAd";
import { DigitalArchitectIntro } from "./DigitalArchitectIntro";
import { SaaSPlatformAd } from "./SaaSPlatformAd";
import { HighlanderSaaSAd } from "./HighlanderSaaSAd";
import { VideoApplication } from "./VideoApplication";
import { YouTubeShortsComposition } from "./components/YouTubeShortsComposition";
import { YouTubeShortsSchema } from "./types/clipping";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🎬 YOUTUBE SHORTS CLIPPING AUTOMATION STUDIO (9:16 Vertical - 1080x1920) */}
      <Composition
        id="YouTubeShorts"
        component={YouTubeShortsComposition}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        schema={YouTubeShortsSchema}
        defaultProps={{
          title: "🔥 UNBELIEVABLE STREAM MOMENT!",
          vodSourceUrl: "input_video.mp4",
          scenes: [
            {
              id: "scene-1",
              startFrame: 0,
              durationInFrames: 600,
              textOverlay: "INSANE CLUTCH MOMENT",
            },
            {
              id: "scene-2",
              startFrame: 600,
              durationInFrames: 600,
              textOverlay: "UNBELIEVABLE REACTION",
            },
            {
              id: "scene-3",
              startFrame: 1200,
              durationInFrames: 600,
              textOverlay: "LIKE & SUBSCRIBE!",
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
