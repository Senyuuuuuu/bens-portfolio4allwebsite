import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { google } from "googleapis";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * -----------------------------------------------------------------------------
 * 1. Google Drive API Service Account Authorization & File Upload
 * -----------------------------------------------------------------------------
 */
async function uploadToGoogleDrive(filePath, folderId) {
  console.log(`\n[JARVIS Cloud Sync] Authenticating with Google Drive API (Service Account)...`);

  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyFilePath || !fs.existsSync(keyFilePath)) {
    throw new Error(
      `GOOGLE_APPLICATION_CREDENTIALS path missing or invalid. Check your .env file: ${keyFilePath}`
    );
  }

  // Initialize Service Account Auth Client
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });
  const fileName = path.basename(filePath);

  console.log(`[JARVIS Cloud Sync] Initiating stream upload of '${fileName}' to Drive folder ID '${folderId}'...`);

  // Stream upload configuration
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: "video/mp4",
      body: fs.createReadStream(filePath),
    },
    fields: "id, name, webViewLink",
  });

  if (response.status === 200) {
    console.log(`[JARVIS Cloud Sync] Upload successful! File ID: ${response.data.id}`);
    console.log(`[JARVIS Cloud Sync] View Link: ${response.data.webViewLink}`);

    // Auto-cleanup local file after verified upload
    console.log(`[JARVIS Storage] Deleting local file '${filePath}' to save disk space...`);
    fs.unlinkSync(filePath);
    console.log(`[JARVIS Storage] Local cleanup complete.`);
  } else {
    throw new Error(`Google Drive API returned non-200 status code: ${response.status}`);
  }
}

/**
 * -----------------------------------------------------------------------------
 * 2. Main Remotion Programmatic Rendering & Orchestration
 * -----------------------------------------------------------------------------
 */
async function main() {
  const compositionId = process.env.REMOTION_COMPOSITION_ID || "OHMnibusLogoAnimation";
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    console.error("ERROR: GOOGLE_DRIVE_FOLDER_ID is missing in .env file.");
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "out");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, `${compositionId}-${Date.now()}.mp4`);

  try {
    // STEP 1: Remotion Webpack Bundling
    console.log(`[JARVIS Engine] Bundling Remotion React composition...`);
    const entryPoint = path.join(process.cwd(), "src", "index.ts");
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    // STEP 2: Select Composition & Extract Metadata
    console.log(`[JARVIS Engine] Selecting composition '${compositionId}'...`);
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
    });

    console.log(
      `[JARVIS Engine] Rendering '${compositionId}' (${composition.width}x${composition.height} @ ${composition.fps} FPS, ${composition.durationInFrames} frames)...`
    );

    // STEP 3: Server-Side Remotion Media Rendering
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      onProgress: ({ progress }) => {
        const percent = (progress * 100).toFixed(1);
        process.stdout.write(`\r[JARVIS Engine] Rendering progress: ${percent}%`);
      },
    });

    console.log(`\n[JARVIS Engine] Render complete: ${outputPath}`);

    // STEP 4: Automatic Google Drive Upload & Disk Cleanup
    await uploadToGoogleDrive(outputPath, folderId);

    console.log(`\n[JARVIS Pipeline] Automation pipeline executed with 100% success!`);
  } catch (error) {
    console.error(`\n[JARVIS Pipeline Error] Pipeline execution failed:`, error);
    process.exit(1);
  }
}

main();
