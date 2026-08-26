#!/usr/bin/env node
/**
 * whisper-transcribe.js
 *
 * Sends a local MP4/WAV file to the OpenAI Whisper API (whisper-1),
 * normalises the verbose_json response into the Remotion Caption[] format
 * that clipping.ts expects, and writes structured JSON to stdout for n8n
 * to parse.
 *
 * Usage (n8n Execute Command node):
 *   node "C:\...\my-video\whisper-transcribe.js" --video-path "C:\...\public\input_video.mp4"
 *
 * Optional flags:
 *   --language en            Whisper language hint (omit for auto-detect)
 *   --scene-start-ms 0       Trim: offset all timestamps by N ms (for non-zero scene start)
 *   --scene-end-ms 10000     Trim: only include words that end before this ms
 *   --openai-key sk-xxx      Override OPENAI_API_KEY env var
 *
 * Stdout (JSON):
 *   {
 *     "success": true,
 *     "captions": [
 *       { "text": " WAIT", "startMs": 0, "endMs": 420, "timestampMs": 0, "confidence": 0.98 }
 *     ],
 *     "fullTranscript": "Wait till you see this!",
 *     "durationMs": 9800,
 *     "wordCount": 6
 *   }
 *
 * On error:
 *   { "success": false, "error": "message", "stack": "..." }
 *   Process exits with code 1.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const VIDEO_PATH = getArg("--video-path");
const LANGUAGE = getArg("--language") ?? undefined;
const SCENE_START_MS = parseInt(getArg("--scene-start-ms") ?? "0", 10);
const SCENE_END_MS = getArg("--scene-end-ms")
  ? parseInt(getArg("--scene-end-ms"), 10)
  : Infinity;
const OPENAI_KEY = getArg("--openai-key") ?? process.env.OPENAI_API_KEY;

// ---------------------------------------------------------------------------
// Output helpers
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
// Validation
// ---------------------------------------------------------------------------
if (!VIDEO_PATH) {
  fail("--video-path is required. Example: --video-path C:\\...\\public\\input_video.mp4");
}
if (!fs.existsSync(VIDEO_PATH)) {
  fail(`Video file not found: ${VIDEO_PATH}`);
}
if (!OPENAI_KEY) {
  fail(
    "OpenAI API key is required. Set OPENAI_API_KEY env var or pass --openai-key sk-..."
  );
}

// ---------------------------------------------------------------------------
// Extract audio from video using ffmpeg (Whisper works best on WAV/MP3)
// Whisper API accepts: mp3, mp4, mpeg, mpga, m4a, wav, webm (max 25MB)
// ---------------------------------------------------------------------------
function extractAudioIfNeeded(videoPath) {
  const ext = path.extname(videoPath).toLowerCase();
  // These formats Whisper API accepts directly
  const whisperCompatible = [".mp3", ".mp4", ".m4a", ".wav", ".webm", ".mpeg", ".mpga"];
  if (whisperCompatible.includes(ext)) {
    return { audioPath: videoPath, isTempFile: false };
  }

  // Extract to MP3 via ffmpeg for other formats
  process.stderr.write(`[whisper] Extracting audio from ${ext} file via ffmpeg...\n`);
  const tempAudio = videoPath.replace(/\.[^.]+$/, "_whisper_audio.mp3");
  try {
    execSync(
      `ffmpeg -y -i "${videoPath}" -vn -ar 16000 -ac 1 -b:a 64k "${tempAudio}"`,
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    return { audioPath: tempAudio, isTempFile: true };
  } catch (e) {
    // ffmpeg not available — just pass the original file and let Whisper handle it
    process.stderr.write("[whisper] ffmpeg not found — passing original file to Whisper.\n");
    return { audioPath: videoPath, isTempFile: false };
  }
}

// ---------------------------------------------------------------------------
// Call OpenAI Whisper API using multipart/form-data
// We use Node.js built-in https to avoid needing the openai npm package
// ---------------------------------------------------------------------------
async function transcribeWithWhisper(audioPath) {
  // Check file size — Whisper API limit is 25MB
  const fileSizeBytes = fs.statSync(audioPath).size;
  const fileSizeMB = fileSizeBytes / 1024 / 1024;
  process.stderr.write(
    `[whisper] Sending ${fileSizeMB.toFixed(1)}MB to Whisper API (whisper-1)...\n`
  );
  if (fileSizeMB > 25) {
    fail(
      `Audio file is ${fileSizeMB.toFixed(1)}MB — exceeds Whisper API's 25MB limit. ` +
        "Extract a shorter clip or compress the audio with: ffmpeg -i input.mp4 -vn -ar 16000 -ac 1 -b:a 32k audio.mp3"
    );
  }

  // Build multipart/form-data body manually
  const boundary = "----RemotionWhisperBoundary" + Date.now();
  const fileContent = fs.readFileSync(audioPath);
  const filename = path.basename(audioPath);
  const mimeType = getMimeType(path.extname(audioPath).toLowerCase());

  // Build the multipart body parts
  const parts = [];

  // model field
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n`
    )
  );

  // response_format = verbose_json gives us word-level timestamps
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="response_format"\r\n\r\nverbose_json\r\n`
    )
  );

  // timestamp_granularities = word for per-word timing
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="timestamp_granularities[]"\r\n\r\nword\r\n`
    )
  );

  // Optional language
  if (LANGUAGE) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${LANGUAGE}\r\n`
      )
    );
  }

  // The audio file
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
    )
  );
  parts.push(fileContent);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  const body = Buffer.concat(parts);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/audio/transcriptions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(
              new Error(
                `Whisper API error ${res.statusCode}: ${data.slice(0, 400)}`
              )
            );
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse Whisper response: ${e.message}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function getMimeType(ext) {
  const map = {
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".m4a": "audio/mp4",
    ".wav": "audio/wav",
    ".webm": "audio/webm",
    ".mpeg": "audio/mpeg",
    ".mpga": "audio/mpeg",
  };
  return map[ext] ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Convert Whisper verbose_json → Remotion Caption[]
//
// Whisper returns:
//   words: [ { word: " WAIT", start: 0.0, end: 0.42 }, ... ]
//
// Remotion Caption[] needs:
//   [ { text: " WAIT", startMs: 0, endMs: 420, timestampMs: 0, confidence: 0.99 }, ... ]
//
// Scene offset: if this clip starts at 10s in the VOD, Whisper timestamps
// are relative to the extracted audio (0-based). We ADD scene_start_ms to
// align them with the global timeline IF the caller wants global captions.
// For per-scene whisperCaptions, leave scene_start_ms = 0 (default).
// ---------------------------------------------------------------------------
function whisperToRemotionCaptions(whisperResponse) {
  const words = whisperResponse.words ?? [];

  if (words.length === 0) {
    // Fall back to segment-level if no word-level data returned
    const segments = whisperResponse.segments ?? [];
    return segments.map((seg) => ({
      text: " " + seg.text.trim(),
      startMs: Math.round(seg.start * 1000) + SCENE_START_MS,
      endMs: Math.round(seg.end * 1000) + SCENE_START_MS,
      timestampMs: Math.round(seg.start * 1000) + SCENE_START_MS,
      confidence: seg.avg_logprob ? Math.min(1, Math.exp(seg.avg_logprob)) : 0.9,
    }));
  }

  return words
    .map((w) => {
      const startMs = Math.round(w.start * 1000) + SCENE_START_MS;
      const endMs = Math.round(w.end * 1000) + SCENE_START_MS;
      return {
        // Ensure text starts with a space (Whisper convention, matches @remotion/captions)
        text: w.word.startsWith(" ") ? w.word : " " + w.word,
        startMs,
        endMs,
        timestampMs: startMs,
        confidence: 0.99, // Whisper doesn't expose per-word confidence; 0.99 is conventional
      };
    })
    .filter((caption) => {
      // Apply scene window filter if provided
      return caption.endMs <= SCENE_END_MS;
    });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // 1. Prepare audio file
  const { audioPath, isTempFile } = extractAudioIfNeeded(VIDEO_PATH);

  try {
    // 2. Call Whisper
    const startTs = Date.now();
    const whisperResponse = await transcribeWithWhisper(audioPath);
    const apiDurationMs = Date.now() - startTs;

    process.stderr.write(
      `[whisper] Transcription complete in ${apiDurationMs}ms\n`
    );

    // 3. Convert to Remotion format
    const captions = whisperToRemotionCaptions(whisperResponse);
    const fullTranscript = whisperResponse.text ?? "";

    process.stderr.write(
      `[whisper] Generated ${captions.length} caption tokens from ${fullTranscript.split(" ").length} words\n`
    );

    // 4. Emit structured result to stdout for n8n to parse
    succeed({
      captions,
      fullTranscript: fullTranscript.trim(),
      durationMs: Math.round((whisperResponse.duration ?? 0) * 1000),
      wordCount: captions.length,
      apiDurationMs,
      language: whisperResponse.language ?? "en",
      videoPath: VIDEO_PATH,
    });
  } finally {
    // Clean up temp audio file if we created one
    if (isTempFile && fs.existsSync(audioPath)) {
      try { fs.unlinkSync(audioPath); } catch (_) {}
    }
  }
}

main().catch((err) => fail(err.message, err.stack));
