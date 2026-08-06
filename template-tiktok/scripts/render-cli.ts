import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

export interface RenderOptions {
  entryPoint: string;
  compositionId: string;
  outputLocation: string;
  inputProps: {
    src: string;
    clipStartMs?: number;
    clipEndMs?: number;
  };
}

/**
 * Server-Side Programmatic Rendering Engine
 * Bundles the Remotion project and renders the final MP4 video using dynamic inputProps.
 */
export async function renderTikTokShort(options: RenderOptions) {
  console.log(`[JARVIS Render Engine] Bundling Remotion composition...`);

  // 1. Bundle Remotion project
  const bundleLocation = await bundle({
    entryPoint: options.entryPoint,
    webpackOverride: (config) => config,
  });

  console.log(`[JARVIS Render Engine] Selecting composition '${options.compositionId}'...`);

  // 2. Select composition & compute dynamic duration
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: options.compositionId,
    inputProps: options.inputProps,
  });

  console.log(
    `[JARVIS Render Engine] Starting render (Duration: ${composition.durationInFrames} frames @ ${composition.fps} FPS)...`
  );

  // 3. Render video output (.mp4)
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: options.outputLocation,
    inputProps: options.inputProps,
    onProgress: ({ progress }) => {
      console.log(`[JARVIS Render Engine] Render progress: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`[JARVIS Render Engine] Render complete: ${options.outputLocation}`);
}
