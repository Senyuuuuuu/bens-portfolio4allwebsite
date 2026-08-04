import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const WatermarkRemover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("input_video.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.14) translate(-38px, -20px)",
        }}
      />
    </AbsoluteFill>
  );
};
