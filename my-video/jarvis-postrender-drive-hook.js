import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { google } from "googleapis";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

/**
 * JARVIS Automated Post-Render Google Drive Upload Hook
 * Streams rendered MP4 video straight to Google Drive API v3 upon render completion
 */
async function jarvisPostRenderDriveHook(localFilePath, folderId) {
  console.log(`\n[Jarvis] Export detected: ${localFilePath}`);
  console.log(`[Jarvis] Authenticating with Google Drive API v3...`);

  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyFilePath || !fs.existsSync(keyFilePath)) {
    throw new Error(
      `[Jarvis Error] GOOGLE_APPLICATION_CREDENTIALS path is missing or invalid: ${keyFilePath}`
    );
  }

  // Headless Server-to-Server Authentication via Service Account
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });
  const fileName = path.basename(localFilePath);

  console.log(`[Jarvis] Streaming '${fileName}' to Google Drive Folder ID '${folderId}'...`);

  // Stream video file directly to Drive API
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: "video/mp4",
      body: fs.createReadStream(localFilePath),
    },
    fields: "id, name, webViewLink",
  });

  if (response.status === 200) {
    console.log(`[Jarvis] Upload complete! File ID: ${response.data.id}`);
    console.log(`[Jarvis] Google Drive Link: ${response.data.webViewLink}`);

    // Automatic Local Disk Cleanup
    console.log(`[Jarvis] Auto-deleting temporary local file to conserve storage...`);
    fs.unlinkSync(localFilePath);
    console.log(`[Jarvis] Local disk cleanup complete.`);
  } else {
    throw new Error(`[Jarvis Error] Google Drive upload failed with HTTP status ${response.status}`);
  }
}

/**
 * Main Executable Pipeline: Remotion Render + Post-Render Event Listener Hook
 */
export async function executeRenderWithJarvisHook(options = {}) {
  const compositionId = options.compositionId || process.env.REMOTION_COMPOSITION_ID || "OHMnibusLogoAnimation";
  const folderId = options.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    console.error(`[Jarvis Error] GOOGLE_DRIVE_FOLDER_ID is missing from environment variables.`);
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "out");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, `${compositionId}-${Date.now()}.mp4`);

  try {
    // 1. Bundle React Remotion Composition
    console.log(`[Jarvis] Bundling Remotion composition...`);
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "src", "index.ts"),
      webpackOverride: (config) => config,
    });

    // 2. Select Composition
    console.log(`[Jarvis] Loading composition '${compositionId}'...`);
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: options.inputProps || {},
    });

    console.log(
      `[Jarvis] Starting render: '${compositionId}' (${composition.width}x${composition.height} @ ${composition.fps} FPS, ${composition.durationInFrames} frames)...`
    );

    // 3. Server-Side Remotion Media Export
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: options.inputProps || {},
      onProgress: ({ progress }) => {
        const pct = (progress * 100).toFixed(1);
        process.stdout.write(`\r[Jarvis] Render progress: ${pct}%`);
      },
    });

    console.log(`\n[Jarvis] Remotion render completed successfully!`);

    // 4. POST-RENDER HOOK: Automatic Drive Upload & Cleanup Stream
    await jarvisPostRenderDriveHook(outputPath, folderId);

    console.log(`[Jarvis] Post-render automation pipeline executed with 100% success!`);
  } catch (error) {
    console.error(`\n[Jarvis Error] Pipeline execution failed:`, error);
    
    // Cleanup partial local file if export crashed
    if (fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
      } catch (_e) {
        // Ignored
      }
    }
    process.exit(1);
  }
}

// Auto-run if executed directly via CLI: node jarvis-postrender-drive-hook.js
if (process.argv[1] && process.argv[1].endsWith("jarvis-postrender-drive-hook.js")) {
  executeRenderWithJarvisHook();
}
