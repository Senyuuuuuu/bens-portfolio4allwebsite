import React from "react";
import { AbsoluteFill } from "remotion";
import { TikTokDynamicCaption } from "./TikTokDynamicCaption";
import { ChunkedPage } from "./chunking";

interface SubtitlePageProps {
  readonly page: ChunkedPage;
  readonly clipStartMs?: number;
}

export const SubtitlePage: React.FC<SubtitlePageProps> = ({ page, clipStartMs = 0 }) => {
  return (
    <AbsoluteFill>
      <TikTokDynamicCaption page={page} clipStartMs={clipStartMs} />
    </AbsoluteFill>
  );
};

export default SubtitlePage;
