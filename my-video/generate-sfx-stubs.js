/**
 * generate-sfx-stubs.js
 * Creates minimal valid silent MP3 stub files in /public
 * so Remotion doesn't throw on missing audio assets.
 * Replace each file with a real SFX once sourced.
 *
 * Run: node generate-sfx-stubs.js
 */
const fs = require("fs");
const path = require("path");

const SFX_FILES = [
  { name: "bg_music.mp3",       note: "25s looping corporate tech underscore (0.22 vol)" },
  { name: "sub_impact.mp3",     note: "Frame 150 — deep sub-bass thump on final lockup" },
  { name: "card_whoosh.mp3",    note: "Frame 200/530/540/840 — smooth air whoosh, card morphs" },
  { name: "glass_click.mp3",    note: "Frame 410 — glass haptic button click (Apple-style)" },
  { name: "mobile_pop.mp3",     note: "Frame 444 — soft mobile app card pop" },
  { name: "data_ticks.mp3",     note: "Frame 620 — rapid light mechanical counter ticks (160f)" },
  { name: "node_pops.mp3",      note: "Frame 920–944 — 4 consecutive soft bubble pops" },
  { name: "success_chime.mp3",  note: "Frame 1020 — bright ascending 3-note success chime" },
  { name: "zoom_swoosh.mp3",    note: "Frame 1120 — fast camera snap-zoom swoosh" },
  { name: "review_ping.mp3",    note: "Frame 1180 & 1220 — Apple-style glass notification ping" },
  { name: "orbit_flutter.mp3",  note: "Frame 1332 — radial 10-icon UI pop flutter" },
  { name: "final_chime.mp3",    note: "Frame 1400 — warm positive corporate logo chime" },
];

/**
 * Minimal valid MP3: ID3v2 header + 1 silent MPEG frame
 * This is enough for Remotion to decode without errors.
 */
const SILENT_MP3 = Buffer.concat([
  // ID3v2.3 tag header (10 bytes)
  Buffer.from([
    0x49, 0x44, 0x33, // "ID3"
    0x03, 0x00,       // version 2.3.0
    0x00,             // flags
    0x00, 0x00, 0x00, 0x0a, // size (10 bytes, synchsafe)
  ]),
  // Padding to make ID3 tag 20 bytes total
  Buffer.alloc(10, 0x00),
  // MPEG1 Layer3 silent frame header (frame sync + 128kbps 44.1kHz stereo)
  Buffer.from([0xff, 0xfb, 0x90, 0x00]),
  // 417 bytes of zeroed frame data (standard 128kbps frame size)
  Buffer.alloc(413, 0x00),
]);

const publicDir = path.join(__dirname, "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log("Created /public directory");
}

let created = 0;
let skipped = 0;

for (const { name, note } of SFX_FILES) {
  const filePath = path.join(publicDir, name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, SILENT_MP3);
    console.log(`  ✓ CREATED stub: ${name}`);
    console.log(`    → Replace with: ${note}`);
    created++;
  } else {
    const size = fs.statSync(filePath).size;
    if (size > 1024) {
      console.log(`  ● EXISTS (real file, ${(size/1024).toFixed(0)}KB): ${name}`);
    } else {
      console.log(`  ○ EXISTS (stub): ${name}`);
    }
    skipped++;
  }
}

console.log(`\n✅ Done — ${created} stubs created, ${skipped} already present.`);
console.log("\n📋 SOUND DESIGN BRIEF:");
console.log("Replace each stub with a real SFX file matching these descriptions:\n");
for (const { name, note } of SFX_FILES) {
  console.log(`  ${name.padEnd(24)} → ${note}`);
}
console.log("\n💡 Recommended free sources:");
console.log("  • Freesound.org (CC0 license filter)");
console.log("  • Pixabay.com/sound-effects");
console.log("  • Zapsplat.com (free tier)");
console.log("  • ElevenLabs SFX (AI-generated, text-to-sfx)");
console.log("  • fal.ai audio models via runapi-cli");
