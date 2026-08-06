import { Caption } from "@remotion/captions";

export interface ChunkedPage {
  text: string;
  startMs: number;
  endMs: number;
  tokens: {
    text: string;
    fromMs: number;
    toMs: number;
  }[];
}

export interface ChunkingOptions {
  maxWordsPerPage?: number;
  combineWithinMs?: number;
}

/**
 * Custom Chunking Logic for TikTok-Style Word Pagination
 * Groups individual word tokens into small readable phrases (e.g. max 5-7 words per screen)
 * to ensure high readability and zero UI clutter.
 */
export function chunkCaptionsIntoPages(
  subtitles: Caption[],
  options: ChunkingOptions = {}
): ChunkedPage[] {
  const maxWords = options.maxWordsPerPage ?? 6;
  const combineMs = options.combineWithinMs ?? 1200;

  if (!subtitles || subtitles.length === 0) {
    return [];
  }

  const pages: ChunkedPage[] = [];
  let currentTokens: Caption[] = [];
  let pageStartMs = subtitles[0].startMs;

  for (let i = 0; i < subtitles.length; i++) {
    const token = subtitles[i];

    if (currentTokens.length === 0) {
      pageStartMs = token.startMs;
    }

    currentTokens.push(token);

    const timeDiff = token.endMs - pageStartMs;
    const isMaxWordsReached = currentTokens.length >= maxWords;
    const isTimeThresholdReached = timeDiff >= combineMs;
    const isLastToken = i === subtitles.length - 1;

    // Check if next token has a significant pause (> 600ms gap)
    const nextToken = subtitles[i + 1];
    const isPauseNext = nextToken ? nextToken.startMs - token.endMs > 600 : false;

    if (isMaxWordsReached || isTimeThresholdReached || isPauseNext || isLastToken) {
      const pageEndMs = token.endMs;
      const fullText = currentTokens.map((t) => t.text).join(" ");

      pages.push({
        text: fullText,
        startMs: pageStartMs,
        endMs: pageEndMs,
        tokens: currentTokens.map((t) => ({
          text: t.text + " ",
          fromMs: t.startMs,
          toMs: t.endMs,
        })),
      });

      currentTokens = [];
    }
  }

  return pages;
}
