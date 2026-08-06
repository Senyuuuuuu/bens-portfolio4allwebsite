import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";

/**
 * Root composition configuration for programmatic YouTube clipping and TikTok shorts.
 * Accepts inputProps for video URL, clip start/end timestamps, and word-level caption JSON.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TikTokShort"
      component={CaptionedVideo}
      calculateMetadata={calculateCaptionedVideoMetadata}
      schema={captionedVideoSchema}
      width={1080}
      height={1920}
      fps={30}
      defaultProps={{
        src: staticFile("sample-video.mp4"),
        clipStartMs: 0,
        clipEndMs: 30000, // Default 30-second duration fallback
      }}
    />
  );
};
