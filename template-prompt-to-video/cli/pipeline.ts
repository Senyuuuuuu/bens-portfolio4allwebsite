#!/usr/bin/env bun
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

dotenv.config({ quiet: true });

interface PipelineOptions {
  title?: string;
  topic?: string;
  prompt?: string;
  output?: string;
}

function parseArgs(): PipelineOptions {
  const args = process.argv.slice(2);
  const options: PipelineOptions = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--title" && args[i + 1]) options.title = args[++i];
    else if (args[i] === "--topic" && args[i + 1]) options.topic = args[++i];
    else if (args[i] === "--prompt" && args[i + 1]) options.prompt = args[++i];
    else if (args[i] === "--output" && args[i + 1]) options.output = args[++i];
  }

  return options;
}

async function runPipeline() {
  console.log("🎬 Starting Remotion AI Video Pipeline...");
  const options = parseArgs();

  const title = options.title || options.prompt || "Automated AI Video";
  const topic = options.topic || "AI Architecture";
  const outputPath = options.output || path.join(process.cwd(), "out", "rendered_video.mp4");

  console.log(`📌 Title: "${title}"`);
  console.log(`📌 Topic: "${topic}"`);

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("⚡ Executing timeline & asset generation...");

  try {
    // Invoke cli.ts non-interactively using bun/tsx
    const genCmd = `npx tsx cli/cli.ts --title "${title.replace(/"/g, '\\"')}" --topic "${topic.replace(/"/g, '\\"')}"`;
    execSync(genCmd, { stdio: "inherit" });
  } catch (err) {
    console.warn("⚠️ Generator CLI warning/fallback. Checking local timeline assets...");
  }

  console.log("🎥 Rendering Remotion composition to MP4...");

  try {
    const renderCmd = `npx remotion render AiGeneratedVideo "${outputPath}"`;
    console.log(`Running: ${renderCmd}`);
    execSync(renderCmd, { stdio: "inherit" });
    console.log(`✅ Render Complete! Video saved to: ${outputPath}`);
  } catch (err: any) {
    console.error("❌ Render failed:", err.message);
    process.exit(1);
  }
}

runPipeline();
