import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { fitText } from "@remotion/layout-utils";
import { TheBoldFont } from "../load-font";
import { ChunkedPage } from "./chunking";

const fontFamily = TheBoldFont;

interface TikTokDynamicCaptionProps {
  readonly page: ChunkedPage;
  readonly clipStartMs?: number;
}

// Visual design tokens
const HIGHLIGHT_COLOR = "#FFE600"; // Vibrant TikTok yellow
const UPCOMING_COLOR = "#FFFFFF"; // Pure white
const PAST_COLOR = "rgba(255, 255, 255, 0.75)"; // Dimmed white
const BACKGROUND_BG = "rgba(0, 0, 0, 0.7)"; // Dark glass backdrop
const DESIRED_FONT_SIZE = 100;

/**
 * TikTokDynamicCaption Component
 * Renders word-by-word highlighted captions with spring physics and continuous mathematical shape morphing.
 */
export const TikTokDynamicCaption: React.FC<TikTokDynamicCaptionProps> = ({
  page,
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  // =========================================================================
  // FRAME TO MILLISECOND MATHEMATICS:
  // Inside a Remotion <Sequence from={subtitleStartFrame}>, useCurrentFrame() returns
  // 0-indexed frames starting from the beginning of THIS page.
  // Therefore, current playback time in milliseconds is:
  // currentTimeMs = page.startMs + (frame / fps) * 1000
  // =========================================================================
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  // Spring physics for entrance transition (stiffness: 120, damping: 14 as per standards)
  const springEntrance = spring({
    frame,
    fps,
    config: {
      stiffness: 120,
      damping: 14,
    },
  });

  // Calculate dynamic font size based on container width limit (88% screen width)
  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width * 0.88,
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  // Smooth entrance scale (0.85 -> 1.0) and vertical translation (40px -> 0px)
  const containerScale = interpolate(springEntrance, [0, 1], [0.85, 1]);
  const containerTranslateY = interpolate(springEntrance, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        top: undefined,
        bottom: 300,
        height: 220,
        paddingLeft: 40,
        paddingRight: 40,
        zIndex: 9999,
      }}
    >
      {/* Morphing Bounding Box Container with Glassmorphism */}
      <div
        style={{
          backgroundColor: BACKGROUND_BG,
          borderRadius: 24,
          padding: "24px 44px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 2px rgba(255, 255, 255, 0.4)",
          transform: makeTransform([
            scale(containerScale),
            translateY(containerTranslateY),
          ]),
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {page.tokens.map((token, index) => {
          // Word-level active & past state evaluation
          const isWordActive =
            currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
          const isWordPast = currentTimeMs >= token.toMs;

          // Compute Spring Physics for active word pulse scale
          const relativeFrameForWord = Math.max(
            0,
            ((currentTimeMs - token.fromMs) / 1000) * fps
          );

          const activePulseSpring = spring({
            frame: relativeFrameForWord,
            fps,
            config: {
              stiffness: 160,
              damping: 12,
            },
          });

          // Scale active word up (1.0 -> 1.20) for punchy dynamic impact
          const wordScale = isWordActive
            ? interpolate(activePulseSpring, [0, 1], [1.0, 1.20])
            : 1.0;

          // Color selection
          let wordColor = UPCOMING_COLOR;
          if (isWordActive) {
            wordColor = HIGHLIGHT_COLOR;
          } else if (isWordPast) {
            wordColor = PAST_COLOR;
          }

          return (
            <span
              key={`${token.fromMs}-${index}`}
              style={{
                fontFamily,
                fontSize,
                fontWeight: 900,
                color: wordColor,
                textTransform: "uppercase",
                display: "inline-block",
                transform: makeTransform([scale(wordScale)]),
                WebkitTextStroke: isWordActive ? "8px black" : "4px black",
                paintOrder: "stroke fill",
                textShadow: isWordActive
                  ? "0 0 30px rgba(255, 230, 0, 0.9), 0 10px 20px rgba(0,0,0,0.9)"
                  : "0 4px 10px rgba(0,0,0,0.8)",
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
