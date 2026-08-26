#!/usr/bin/env node
/**
 * render-from-n8n.js
 *
 * Remotion render bridge — called by the n8n "Remotion Render Node" via
 * Execute Command. Reads a validated JSON payload, renders the YouTubeShorts
 * composition to an MP4 file, and writes structured JSON to stdout so n8n
 * can parse the output file path and metadata.
 *
 * Usage (n8n Execute Command node):
 *   node "C:\...\my-video\render-from-n8n.js" [--props-file path] [--output-dir path]
 *
 * Or with inline JSON (piped from n8n Set node):
 *   node render-from-n8n.js --inline-json "{{ JSON.stringify($json) }}"
 *
 * Stdout (JSON):
 *   { "success": true, "outputFile": "...", "durationMs": 12345, "fileSizeBytes": 9876543 }
 *
 * On error:
 *   { "success": false, "error": "message", "stack": "..." }
 *   Process exits with code 1 so n8n detects the failure.
 */

"use strict";

const path = require("path");
const fs = require("fs");

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const SCRIPT_DIR = __dirname;
const PROPS_FILE = getArg("--props-file") ?? path.join(SCRIPT_DIR, "remotion-props.json");
const OUTPUT_DIR = getArg("--output-dir") ?? path.join(SCRIPT_DIR, "out");
const INLINE_JSON = getArg("--inline-json");
const COMPOSITION_ID = getArg("--composition") ?? "YouTubeShorts";
const CONCURRENCY = parseInt(getArg("--concurrency") ?? "4", 10);

// ---------------------------------------------------------------------------
// Output helpers — always write JSON to stdout so n8n can parse it
// ---------------------------------------------------------------------------
function succeed(data) {
  process.stdout.write(JSON.stringify({ success: true, ...data }) + "\n");
  process.exit(0);
}

function fail(error, stack) {
  process.stdout.write(
    JSON.stringify({ success: false, error: String(error), stack: stack ?? "" }) + "\n"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // 1. Load the props payload
  let rawProps;
  if (INLINE_JSON) {
    try {
      rawProps = JSON.parse(INLINE_JSON);
    } catch (e) {
      fail(`Failed to parse --inline-json: ${e.message}`);
    }
  } else {
    if (!fs.existsSync(PROPS_FILE)) {
      fail(`Props file not found: ${PROPS_FILE}`);
    }
    try {
      rawProps = JSON.parse(fs.readFileSync(PROPS_FILE, "utf-8"));
    } catch (e) {
      fail(`Failed to read/parse props file: ${e.message}`);
    }
  }

  // 2. Validate against the YouTubeShortsSchema (Zod v4 — needs tsx/ts-node or
  //    a pre-compiled JS build). We do a lightweight structural check here and
  //    rely on Remotion's own schema validation for the full Zod pass.
  if (!rawProps.scenes || !Array.isArray(rawProps.scenes) || rawProps.scenes.length === 0) {
    fail("Invalid props: 'scenes' must be a non-empty array.");
  }
  if (!rawProps.vodSourceUrl) {
    fail("Invalid props: 'vodSourceUrl' is required.");
  }

  // 3. Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 4. Generate a timestamped output filename
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);
  const safeTitle = (rawProps.title ?? "short")
    .replace(/[^a-zA-Z0-9\-_]/g, "_")
    .slice(0, 40);
  const outputFile = path.join(OUTPUT_DIR, `${safeTitle}_${timestamp}.mp4`);

  // 5. Write props to a temp file for Remotion's CLI --props flag
  //    (renderMedia() API requires the bundle path — use CLI for simplicity
  //    since the bundle may not exist. CLI is more robust for local use.)
  const tempPropsFile = path.join(OUTPUT_DIR, `._render_props_${timestamp}.json`);
  fs.writeFileSync(tempPropsFile, JSON.stringify(rawProps, null, 2), "utf-8");

  // 6. Try the programmatic renderMedia() API first (fastest, no subprocess)
  try {
    await renderProgrammatic(rawProps, outputFile, tempPropsFile);
  } catch (programmaticErr) {
    // Fallback to CLI subprocess if renderMedia fails (e.g. bundle not found)
    console.error(
      "[render-from-n8n] Programmatic render failed, falling back to CLI:",
      programmaticErr.message
    );
    await renderViaCLI(outputFile, tempPropsFile);
  } finally {
    // Clean up temp props file
    try { fs.unlinkSync(tempPropsFile); } catch (_) {}
  }
}

// ---------------------------------------------------------------------------
// Programmatic render via @remotion/renderer renderMedia()
// ---------------------------------------------------------------------------
async function renderProgrammatic(props, outputFile, tempPropsFile) {
  // Dynamically require @remotion/renderer to avoid crashing if not installed
  let renderer;
  try {
    renderer = require("@remotion/renderer");
  } catch (e) {
    throw new Error("@remotion/renderer not found. Run: npm install @remotion/renderer");
  }

  const { renderMedia, selectComposition, bundle } = renderer;

  // Bundle the Remotion project (caches after first run)
  const bundleDir = path.join(__dirname, ".remotion-bundle");
  const entryPoint = path.join(__dirname, "src", "index.ts");

  process.stderr.write("[render-from-n8n] Bundling Remotion project...\n");
  const startBundle = Date.now();

  const bundleLocation = await bundle({
    entryPoint,
    outDir: bundleDir,
    onProgress: (progress) => {
      if (progress % 25 === 0) {
        process.stderr.write(`[render-from-n8n] Bundle progress: ${progress}%\n`);
      }
    },
  });

  process.stderr.write(
    `[render-from-n8n] Bundle complete in ${Date.now() - startBundle}ms\n`
  );

  // Select the composition and apply calculateMetadata
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: COMPOSITION_ID,
    inputProps: props,
  });

  process.stderr.write(
    `[render-from-n8n] Rendering ${composition.durationInFrames} frames @ ${composition.fps}fps\n`
  );

  const startRender = Date.now();

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputFile,
    inputProps: props,
    concurrency: CONCURRENCY,
    logLevel: "verbose",
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        process.stderr.write(`[render-from-n8n] Render progress: ${pct}%\n`);
      }
    },
  });

  const durationMs = Date.now() - startRender;
  const fileSizeBytes = fs.statSync(outputFile).size;
  const fileSizeMB = (fileSizeBytes / 1024 / 1024).toFixed(2);

  process.stderr.write(
    `[render-from-n8n] Render complete: ${fileSizeMB}MB in ${durationMs}ms\n`
  );

  succeed({
    outputFile,
    compositionId: COMPOSITION_ID,
    durationMs,
    fileSizeBytes,
    fileSizeMB: parseFloat(fileSizeMB),
    framesRendered: composition.durationInFrames,
    fps: composition.fps,
    title: props.title ?? "Untitled",
    sceneCount: props.scenes.length,
    timestamp: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// CLI fallback via npx remotion render
// ---------------------------------------------------------------------------
async function renderViaCLI(outputFile, tempPropsFile) {
  const { execSync } = require("child_process");

  const cmd = [
    "npx",
    "remotion",
    "render",
    COMPOSITION_ID,
    JSON.stringify(outputFile),
    `--props=${JSON.stringify(tempPropsFile)}`,
    "--log=verbose",
    `--concurrency=${CONCURRENCY}`,
    "--overwrite",
  ].join(" ");

  process.stderr.write(`[render-from-n8n] CLI command: ${cmd}\n`);

  const startRender = Date.now();

  try {
    execSync(cmd, {
      cwd: __dirname,
      stdio: ["inherit", "inherit", "inherit"],
      windowsHide: true,
    });
  } catch (e) {
    fail(`CLI render failed: ${e.message}`, e.stack);
  }

  const durationMs = Date.now() - startRender;

  if (!fs.existsSync(outputFile)) {
    fail(`CLI render completed but output file not found: ${outputFile}`);
  }

  const fileSizeBytes = fs.statSync(outputFile).size;
  const fileSizeMB = (fileSizeBytes / 1024 / 1024).toFixed(2);

  succeed({
    outputFile,
    compositionId: COMPOSITION_ID,
    durationMs,
    fileSizeBytes,
    fileSizeMB: parseFloat(fileSizeMB),
    timestamp: new Date().toISOString(),
    method: "cli-fallback",
  });
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
main().catch((err) => fail(err.message, err.stack));
