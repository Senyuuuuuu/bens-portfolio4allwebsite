import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";

const SWITCH_CAPTIONS_EVERY_MS = 1200;
const HIGHLIGHT_COLOR = "#FFE600"; // Vibrant viral subtitle yellow

interface DynamicSubtitlesProps {
  captions: Caption[];
}

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 220,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          fontFamily: "'Outfit', 'Montserrat', 'Inter', sans-serif",
          textTransform: "uppercase",
          whiteSpace: "pre-wrap",
          textAlign: "center",
          color: "#FFFFFF",
          textShadow: "0px 8px 16px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.8)",
          WebkitTextStroke: "3px black",
          padding: "0 40px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 16px",
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

          return (
            <span
              key={`${token.fromMs}-${token.text}`}
              style={{
                color: isActive ? HIGHLIGHT_COLOR : "#FFFFFF",
                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                transition: "all 0.05s ease-in-out",
                display: "inline-block",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const DynamicSubtitles: React.FC<DynamicSubtitlesProps> = ({ captions }) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    if (!captions || captions.length === 0) {
      return { pages: [] };
    }
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  if (pages.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          Math.min(
            nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
            startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps
          )
        );
        const durationInFrames = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={`page-${index}-${page.startMs}`}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
