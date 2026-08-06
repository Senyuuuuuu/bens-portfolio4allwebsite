import { Caption } from "@remotion/captions";
import { getVideoMetadata } from "@remotion/media-utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  getStaticFiles,
  OffthreadVideo,
  Sequence,
  staticFile,
  useDelayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { z } from "zod";
import { loadFont } from "../load-font";
import { chunkCaptionsIntoPages } from "./chunking";
import { NoCaptionFile } from "./NoCaptionFile";
import SubtitlePage from "./SubtitlePage";

export const captionTokenSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  timestampMs: z.number().nullable(),
  confidence: z.number().nullable(),
});

export const captionedVideoSchema = z.object({
  src: z.string(),
  clipStartMs: z.number().optional(),
  clipEndMs: z.number().optional(),
  subtitles: z.array(captionTokenSchema).optional(),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
  const fps = 30;

  if (props.clipStartMs !== undefined && props.clipEndMs !== undefined) {
    const clipDurationSec = (props.clipEndMs - props.clipStartMs) / 1000;
    return {
      fps,
      durationInFrames: Math.floor(clipDurationSec * fps),
    };
  }

  const resolvedVideoSrc =
    props.src.startsWith("http://") || props.src.startsWith("https://")
      ? props.src
      : staticFile(props.src);

  const metadata = await getVideoMetadata(resolvedVideoSrc);
  return {
    fps,
    durationInFrames: Math.floor(metadata.durationInSeconds * fps),
  };
};

const getFileExists = (file: string) => {
  try {
    const files = getStaticFiles();
    const fileExists = files.find((f) => f.src === file);
    return Boolean(fileExists);
  } catch (_e) {
    return true;
  }
};

export const CaptionedVideo: React.FC<{
  src: string;
  clipStartMs?: number;
  clipEndMs?: number;
  subtitles?: Caption[];
}> = ({ src, clipStartMs = 0, subtitles: propsSubtitles }) => {
  const [subtitles, setSubtitles] = useState<Caption[]>(propsSubtitles ?? []);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();

  const resolvedVideoSrc = useMemo(() => {
    return src.startsWith("http://") || src.startsWith("https://")
      ? src
      : staticFile(src);
  }, [src]);

  const rawSubtitlesFile = useMemo(() => {
    return src
      .replace(/.mp4$/, ".json")
      .replace(/.mkv$/, ".json")
      .replace(/.mov$/, ".json")
      .replace(/.webm$/, ".json");
  }, [src]);

  const subtitlesFileUrl = useMemo(() => {
    return rawSubtitlesFile.startsWith("http://") || rawSubtitlesFile.startsWith("https://")
      ? rawSubtitlesFile
      : staticFile(rawSubtitlesFile);
  }, [rawSubtitlesFile]);

  const fetchSubtitles = useCallback(async () => {
    try {
      await loadFont();

      // Priority 1: Direct subtitles prop passed in inputProps
      if (propsSubtitles && propsSubtitles.length > 0) {
        setSubtitles(propsSubtitles);
        continueRender(handle);
        return;
      }

      // Priority 2: Fetch subtitle JSON file
      if (!getFileExists(rawSubtitlesFile)) {
        setSubtitles([]);
        continueRender(handle);
        return;
      }

      const res = await fetch(subtitlesFileUrl);
      if (!res.ok) {
        setSubtitles([]);
        continueRender(handle);
        return;
      }
      const data = (await res.json()) as Caption[];
      setSubtitles(data);
      continueRender(handle);
    } catch (e) {
      console.warn(`[CaptionedVideo] Error loading subtitles:`, e);
      setSubtitles(propsSubtitles ?? []);
      continueRender(handle);
    }
  }, [continueRender, handle, propsSubtitles, rawSubtitlesFile, subtitlesFileUrl]);

  useEffect(() => {
    fetchSubtitles();

    let c: { cancel: () => void } | null = null;
    try {
      c = watchStaticFile(rawSubtitlesFile, () => {
        fetchSubtitles();
      });
    } catch (_e) {
      // Ignored in headless render mode
    }

    return () => {
      c?.cancel();
    };
  }, [fetchSubtitles, rawSubtitlesFile]);

  // Chunk captions into max 6 words per screen to avoid visual clutter
  const pages = useMemo(() => {
    return chunkCaptionsIntoPages(subtitles ?? [], { maxWordsPerPage: 6 });
  }, [subtitles]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill>
        <OffthreadVideo
          style={{
            objectFit: "cover",
          }}
          src={resolvedVideoSrc}
          startFrom={Math.floor((clipStartMs / 1000) * fps)}
        />
      </AbsoluteFill>
      {pages.map((page, index) => {
        const subtitleStartFrame = Math.max(0, ((page.startMs - clipStartMs) / 1000) * fps);
        const subtitleEndFrame = Math.max(0, ((page.endMs - clipStartMs) / 1000) * fps);
        const durationInFrames = Math.max(1, subtitleEndFrame - subtitleStartFrame);

        return (
          <Sequence
            key={index}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage page={page} clipStartMs={clipStartMs} />
          </Sequence>
        );
      })}
      {pages.length > 0 || (propsSubtitles && propsSubtitles.length > 0) || getFileExists(rawSubtitlesFile) ? null : (
        <NoCaptionFile />
      )}
    </AbsoluteFill>
  );
};
