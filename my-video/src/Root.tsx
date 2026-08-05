import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CleanKineticN8nAd } from "./CleanKineticN8nAd";
import { AskNovaFiverrAd } from "./AskNovaFiverrAd";
import { Beliv8N8nAd } from "./Beliv8N8nAd";
import { HighConvertingSalesAd } from "./HighConvertingSalesAd";
import { KineticMorphingAd } from "./KineticMorphingAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🎬 MAIN GIG AD: Clean Kinetic Tech n8n Fiverr Ad (15 Seconds @ 60FPS = 900 frames) */}
      <Composition
        id="CleanKineticN8nAd"
        component={CleanKineticN8nAd}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
      />

      <Composition
        id="FullProductLaunch"
        component={AskNovaFiverrAd}
        durationInFrames={720}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 🎬 BELIV8 STYLE: Green Neon n8n Ad (25 Seconds @ 60FPS = 1500 frames) */}
      <Composition
        id="Beliv8N8nAd"
        component={Beliv8N8nAd}
        durationInFrames={1500}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 🎬 HIGH-CONVERTING 3-IN-1 AGENCY AD (24s @ 60FPS = 1440 frames) */}
      <Composition
        id="HighConvertingSalesAd"
        component={HighConvertingSalesAd}
        durationInFrames={1440}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 🎬 KINETIC MORPHING TECH AD — Google/Apple aesthetic (25s @ 60FPS = 1500 frames) */}
      <Composition
        id="KineticMorphingAd"
        component={KineticMorphingAd}
        durationInFrames={1500}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
