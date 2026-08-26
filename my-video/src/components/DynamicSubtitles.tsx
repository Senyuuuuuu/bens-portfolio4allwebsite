/**
 * DynamicSubtitles.tsx
 *
 * Word-by-word kinetic subtitle system for YouTube Shorts.
 *
 * Features:
 *  - Ingests @remotion/captions Caption[] (from Whisper / Deepgram)
 *  - Groups words into TikTok-style "pages" via createTikTokStyleCaptions()
 *  - Each page fades in using interpolate() — NO CSS animation
 *  - The currently-active word pops with a spring() bounce — NO CSS transition
 *  - Highlighted word turns viral yellow (#FFE600)
 */

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from "@remotion/captions";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const SWITCH_CAPTIONS_EVERY_MS = 1200;
const HIGHLIGHT_COLOR = "#FFE600"; // viral TikTok / Reels yellow
const FONT_SIZE = 68; // px — large for mobile readability
const PADDING_BOTTOM = 240; // px — safe area above swipe-up UI

// ---------------------------------------------------------------------------
// Single word token with spring-pop animation
// ---------------------------------------------------------------------------
interface WordTokenProps {
  text: string;
  isActive: boolean;
}

const WordToken: React.FC<WordTokenProps> = ({ text, isActive }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven scale pop — fires once when the word first becomes active.
  // Because this renders inside a <Sequence> scoped to its page, `frame` is
  // always relative to the page start, so the spring reads as frame 0 = begin.
  const popScale = isActive
    ? spring({
        frame,
        fps,
        from: 1,
        to: 1.2,
        config: { stiffness: 320, damping: 18 },
        durationInFrames: Math.round(fps * 0.25),
      })
    : 1;

  // Vertical bounce — active word lifts up 4px on pop
  const liftY = isActive
    ? interpolate(popScale, [1, 1.2], [0, -6], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <span
      style={{
        display: "inline-block",
        color: isActive ? HIGHLIGHT_COLOR : "#FFFFFF",
        scale: String(popScale),
        translate: `0px ${liftY}px`,
        // ⚠️ NO CSS transition — all motion is frame-driven
      }}
    >
      {text}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Single caption page (a group of words shown simultaneously on screen)
// ---------------------------------------------------------------------------
interface CaptionPageProps {
  page: TikTokPage;
}

const CaptionPage: React.FC<CaptionPageProps> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page fade-in using interpolate — no CSS animation
  const opacity = interpolate(frame, [0, Math.round(fps * 0.12)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Slide-up entrance: page rises 18px over the same window
  const slideY = interpolate(frame, [0, Math.round(fps * 0.12)], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const currentTimeMs = (frame / fps) * 1000;
  // Timestamps on page tokens are absolute (from video start).
  // `page.startMs` is the absolute start of this page — add currentTimeMs
  // (which is relative to this <Sequence>'s from-frame) to get absolute ms.
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: PADDING_BOTTOM,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          translate: `0px ${slideY}px`,
          fontSize: FONT_SIZE,
          fontWeight: 900,
          fontFamily: "'Outfit', 'Montserrat', 'Inter', sans-serif",
          textTransform: "uppercase",
          whiteSpace: "pre-wrap",
          textAlign: "center",
          color: "#FFFFFF",
          textShadow:
            "0px 8px 20px rgba(0,0,0,0.95), 0px 2px 8px rgba(0,0,0,0.9)",
          WebkitTextStroke: "3px #000000",
          padding: "0 40px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 18px",
          // Prevent layout shifts from popping words
          lineHeight: 1.25,
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

          return (
            <WordToken
              key={`${token.fromMs}-${token.text}`}
              text={token.text}
              isActive={isActive}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
interface DynamicSubtitlesProps {
  captions: Caption[];
}

export const DynamicSubtitles: React.FC<DynamicSubtitlesProps> = ({
  captions,
}) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    if (!captions || captions.length === 0) return { pages: [] };
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  if (pages.length === 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = nextPage
          ? Math.round((nextPage.startMs / 1000) * fps)
          : startFrame + Math.round((SWITCH_CAPTIONS_EVERY_MS / 1000) * fps);
        const durationInFrames = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={`page-${index}-${page.startMs}`}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

