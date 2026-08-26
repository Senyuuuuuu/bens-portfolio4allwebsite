#!/usr/bin/env node
/**
 * generate-broll.js
 *
 * Reads the GPT-4o scene breakdown JSON (which has bRollOverlays[].imagePrompt
 * fields but empty imageUrl fields), calls DALL-E 3 for each prompt, saves the
 * images to public/broll/, then writes the fully-enriched JSON (with imageUrl
 * injected) to stdout for the next n8n node (render-from-n8n.js) to consume.
 *
 * Usage (n8n Execute Command node):
 *   node "C:\...\my-video\generate-broll.js" --inline-json "{{ $json.choices[0].message.content }}"
 *
 * Optional flags:
 *   --quality standard|hd        DALL-E 3 quality (default: standard)
 *   --size 1024x1024|1792x1024   Image dimensions (default: 1024x1024 square)
 *   --rate-limit-ms 13000        Wait between API calls (default: 13000ms = ~4.5 img/min)
 *   --openai-key sk-xxx          Override OPENAI_API_KEY env var
 *   --dry-run                    Skip API calls, fill imageUrl with placeholder paths
 *
 * Stdout (JSON):
 *   { "success": true, "payload": { ...enrichedProps }, "imagesGenerated": 3, "skipped": 1 }
 *
 * On error:
 *   { "success": false, "error": "...", "stack": "..." }
 *   Process exits with code 1.
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const https = require("https");

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------
const args    = process.argv.slice(2);
const getArg  = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const INLINE_JSON    = getArg("--inline-json");
 const PROPS_FILE     = getArg("--props-file");
const QUALITY        = getArg("--quality") ?? "standard";
const SIZE           = getArg("--size") ?? "1024x1024";
const RATE_LIMIT_MS  = parseInt(getArg("--rate-limit-ms") ?? "13000", 10);
const OPENAI_KEY     = getArg("--openai-key") ?? process.env.OPENAI_API_KEY;
const DRY_RUN        = hasFlag("--dry-run");

// Output directory — relative to this script (must be inside Remotion's `public/` dir)
const SCRIPT_DIR = __dirname;
const BROLL_DIR  = path.join(SCRIPT_DIR, "public", "broll");

// ---------------------------------------------------------------------------
// Stdout helpers
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
const log = (...args) => process.stderr.write("[broll] " + args.join(" ") + "\n");

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
if (!INLINE_JSON && !PROPS_FILE) fail("--inline-json or --props-file is required. Pass the GPT-4o scene JSON string or a path to a JSON file.");
if (!DRY_RUN && !OPENAI_KEY) {
  fail("OPENAI_API_KEY env var or --openai-key flag is required for DALL-E 3 calls.");
}

// ---------------------------------------------------------------------------
// Parse input payload
// ---------------------------------------------------------------------------
let payload;
try {
  if (PROPS_FILE) {
    // File path mode — avoids Windows shell quoting issues entirely
    if (!fs.existsSync(PROPS_FILE)) fail(`Props file not found: ${PROPS_FILE}`);
    payload = JSON.parse(fs.readFileSync(PROPS_FILE, "utf-8"));
  } else {
    // Inline JSON string from n8n expression
    const raw = typeof INLINE_JSON === "string" ? INLINE_JSON : JSON.stringify(INLINE_JSON);
    payload = JSON.parse(raw);
  }
} catch (e) {
  fail(`Failed to parse input JSON: ${e.message}`);
}

if (!payload.scenes || !Array.isArray(payload.scenes)) {
  fail("Invalid payload: 'scenes' must be an array.");
}

// ---------------------------------------------------------------------------
// Collect all B-roll slots across all scenes
// ---------------------------------------------------------------------------
const brollSlots = [];
for (let si = 0; si < payload.scenes.length; si++) {
  const scene = payload.scenes[si];
  if (!Array.isArray(scene.bRollOverlays)) continue;
  for (let bi = 0; bi < scene.bRollOverlays.length; bi++) {
    const overlay = scene.bRollOverlays[bi];
    if (overlay.imagePrompt) {
      brollSlots.push({ sceneIndex: si, overlayIndex: bi, prompt: overlay.imagePrompt });
    }
  }
}

log(`Found ${brollSlots.length} B-roll slots across ${payload.scenes.length} scenes.`);

if (brollSlots.length === 0) {
  log("No imagePrompt fields found — returning payload unchanged.");
  succeed({ payload, imagesGenerated: 0, skipped: 0 });
}

// ---------------------------------------------------------------------------
// Ensure output directory exists
// ---------------------------------------------------------------------------
fs.mkdirSync(BROLL_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Call DALL-E 3 API
// ---------------------------------------------------------------------------
function dalleGenerate(prompt) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(
      JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: SIZE,
        quality: QUALITY,
        response_format: "b64_json",   // base64 avoids URL expiry issues
      })
    );

    const req = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/images/generations",
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": body.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`DALL-E API ${res.statusCode}: ${data.slice(0, 300)}`));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.data[0].b64_json);
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Save base64 image to disk and return the staticFile-relative path
// ---------------------------------------------------------------------------
function saveImage(b64, filename) {
  const fullPath = path.join(BROLL_DIR, filename);
  fs.writeFileSync(fullPath, Buffer.from(b64, "base64"));
  // Return the path relative to public/ — Remotion's staticFile("broll/x.png")
  return `broll/${filename}`;
}

// ---------------------------------------------------------------------------
// Rate-limit helper
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Main — sequential generation with rate limiting
// ---------------------------------------------------------------------------
async function main() {
  const enrichedPayload = JSON.parse(JSON.stringify(payload)); // deep clone
  let imagesGenerated = 0;
  let skipped = 0;

  for (let i = 0; i < brollSlots.length; i++) {
    const { sceneIndex, overlayIndex, prompt } = brollSlots[i];
    const sceneId  = enrichedPayload.scenes[sceneIndex].id ?? `scene-${sceneIndex}`;
    const filename = `${sceneId}-broll-${overlayIndex}.png`;

    // Skip if file already exists (allows re-runs without re-billing)
    const existingPath = path.join(BROLL_DIR, filename);
    if (fs.existsSync(existingPath)) {
      log(`[${i + 1}/${brollSlots.length}] Skipping ${filename} — already exists.`);
      enrichedPayload.scenes[sceneIndex].bRollOverlays[overlayIndex].imageUrl = `broll/${filename}`;
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      log(`[${i + 1}/${brollSlots.length}] DRY RUN — would generate: ${filename}`);
      log(`  Prompt: "${prompt.slice(0, 80)}..."`);
      // Write a 1×1 transparent PNG as placeholder
      const tinyPng = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      fs.writeFileSync(existingPath, tinyPng);
      enrichedPayload.scenes[sceneIndex].bRollOverlays[overlayIndex].imageUrl = `broll/${filename}`;
      imagesGenerated++;
      continue;
    }

    log(`[${i + 1}/${brollSlots.length}] Generating: ${filename}`);
    log(`  Prompt: "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"`);

    try {
      const startMs = Date.now();
      const b64 = await dalleGenerate(prompt);
      const relPath = saveImage(b64, filename);
      enrichedPayload.scenes[sceneIndex].bRollOverlays[overlayIndex].imageUrl = relPath;
      imagesGenerated++;

      const elapsed = Date.now() - startMs;
      log(`  ✅ Saved to public/${relPath} in ${elapsed}ms`);

      // Rate limit: DALL-E 3 allows ~5 images/min by default.
      // Wait between calls unless this is the last one.
      if (i < brollSlots.length - 1) {
        const waitMs = Math.max(0, RATE_LIMIT_MS - elapsed);
        if (waitMs > 0) {
          log(`  Waiting ${waitMs}ms for rate limit...`);
          await sleep(waitMs);
        }
      }
    } catch (err) {
      // Non-fatal: log the failure and continue. The overlay will render
      // as invisible (imageUrl stays undefined) rather than crashing the Short.
      log(`  ⚠️  Failed to generate ${filename}: ${err.message}`);
      log("  Continuing without this B-roll overlay (will be invisible in render).");
      skipped++;
    }
  }

  log(`\nDone: ${imagesGenerated} generated, ${skipped} skipped/failed.`);

  // Return the enriched payload — render-from-n8n.js reads this directly
  succeed({
    payload: enrichedPayload,
    imagesGenerated,
    skipped,
    brollDir: BROLL_DIR,
    totalSlots: brollSlots.length,
  });
}

main().catch((err) => fail(err.message, err.stack));
