import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { CleanKineticN8nAd } from "./CleanKineticN8nAd";
import { AskNovaFiverrAd } from "./AskNovaFiverrAd";
import { DigitalArchitectIntro } from "./DigitalArchitectIntro";
import { FinalAdN8n } from "./FinalAdN8n";
import { SaaSPlatformAd } from "./SaaSPlatformAd";
import { LogoAnimation } from "./OHMnibusLogoAnimation";
import { Dynamic3DText, dynamic3DTextSchema } from "./Dynamic3DText";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🎬 3D Dynamic WebGL Text Skill Composition (5s @ 30 FPS = 150 frames) */}
      <Composition
        id="Dynamic3DText"
        component={Dynamic3DText}
        schema={dynamic3DTextSchema}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: "OHMnibus 3D",
          fontUrl:
            "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
          color: "#A855F7",
          bevelEnabled: true,
          bevelSize: 0.03,
          bevelThickness: 0.08,
          height: 0.2,
        }}
      />

      {/* 🎬 OHMnibus Logo Animation (5s @ 30 FPS = 150 frames, 16:9 Landscape) */}
      <Composition
        id="OHMnibusLogoAnimation"
        component={LogoAnimation}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🎬 OHMnibus Vertical Short Logo Animation (5s @ 30 FPS = 150 frames, 9:16 Vertical) */}
      <Composition
        id="OHMnibusLogoAnimationVertical"
        component={LogoAnimation}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />

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

      <Composition
        id="FullProductLaunch"
        component={AskNovaFiverrAd}
        durationInFrames={720}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
