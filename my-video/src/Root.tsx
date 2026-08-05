import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CleanKineticN8nAd } from "./CleanKineticN8nAd";
import { AskNovaFiverrAd } from "./AskNovaFiverrAd";
import { Beliv8N8nAd } from "./Beliv8N8nAd";
import { HighConvertingSalesAd } from "./HighConvertingSalesAd";
import { KineticMorphingAd } from "./KineticMorphingAd";
import { RhythmicMontagemAd } from "./RhythmicMontagemAd";
import { SaaSPlatformAd } from "./SaaSPlatformAd";
import { InfiniteSaaSAd } from "./InfiniteSaaSAd";
import { CleanFlyThroughAd } from "./CleanFlyThroughAd";
import { DigitalArchitectIntro } from "./DigitalArchitectIntro";
import { FinalAdN8n } from "./FinalAdN8n";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🎬 FINAL COMBINED AD: 9s DigitalArchitect Intro + 25s Full CleanKinetic N8n (34s @ 60FPS = 2040 frames) */}
      <Composition
        id="FinalAdN8n"
        component={FinalAdN8n}
        durationInFrames={2040}
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
      {/* 🎬 THE CLEAN FLY-THROUGH AGENCY AD (18s @ 60FPS = 1080 frames) */}
      <Composition
        id="CleanFlyThroughAd"
        component={CleanFlyThroughAd}
        durationInFrames={1080}
        fps={60}
        width={1920}
        height={1080}
      />
      {/* 🎬 THE INFINITE HORIZONTAL SAAS CANVAS (24s @ 60FPS = 1440 frames) */}
      {/* 🎬 PREMIUM SAAS PLATFORM AD (LUZ ROJA Slowed Style - 24s @ 60FPS = 1440 frames) */}
      <Composition
        id="SaaSPlatformAd"
        component={SaaSPlatformAd}
        durationInFrames={1440}
        fps={60}
        width={1920}
        height={1080}
      />
      {/* 🎬 HIGH-ENERGY RHYTHMIC UI AD (Google Workspace x Montagem Ritmada Style - 24s @ 60FPS = 1440 frames) */}
      {/* 🎬 MAIN GIG AD: Clean Kinetic Tech n8n Fiverr Ad (25 Seconds @ 60FPS = 1500 frames) */}
      <Composition
        id="CleanKineticN8nAd"
        component={CleanKineticN8nAd}
        durationInFrames={1500}
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
      {/* 🎬 HIGH-CONVERTING 3-IN-1 AGENCY AD (24s @ 60FPS = 1440 frames) */}
      {/* 🎬 KINETIC MORPHING TECH AD — Google/Apple aesthetic (18s @ 60FPS = 1080 frames) */}
    </>
  );
};
