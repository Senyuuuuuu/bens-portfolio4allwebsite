import { AgentType } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { BaseAgent } from './BaseAgent';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../index';

const STORAGE_DIR = process.env.STORAGE_PATH || './storage';

interface CaptionWord {
  word: string;
  start: number;
  end: number;
  highlight?: boolean;
}

export class CaptionAgent extends BaseAgent {
  private openai = new OpenAIService();

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const clipId = input.clipId as string;
    const videoId = input.videoId as string;
    this.log('info', `📝 Generating captions for clip: ${clipId || videoId}`);

    try {
      const transcript = await prisma.transcript.findUnique({ where: { videoId } });
      if (!transcript) throw new Error('No transcript found');

      const wordTimings = JSON.parse(String(transcript.wordTimings || '[]')) as CaptionWord[];

      // Generate SRT file
      const srtContent = this.generateSRT(wordTimings, transcript.text);
      const vttContent = this.generateVTT(wordTimings);

      // Style captions with AI
      const styledCaptions = await this.styleWithAI(wordTimings);

      // Save files
      const captionDir = path.join(STORAGE_DIR, 'Captions');
      fs.mkdirSync(captionDir, { recursive: true });

      const id = clipId || videoId;
      const srtPath = path.join(captionDir, `${id}.srt`);
      const vttPath = path.join(captionDir, `${id}.vtt`);

      fs.writeFileSync(srtPath, srtContent);
      fs.writeFileSync(vttPath, vttContent);

      // Save to database
      await prisma.caption.create({
        data: {
          videoId: videoId || undefined,
          clipId: clipId || undefined,
          srtPath,
          vttPath,
          text: transcript.text,
          style: styledCaptions as unknown as Record<string, unknown>,
        },
      });

      this.log('success', `✅ Captions generated: ${path.basename(srtPath)}`);
      return { srtPath, vttPath, wordCount: wordTimings.length, style: styledCaptions };
    } catch (err) {
      this.log('error', `❌ Caption generation failed: ${err}`);
      throw err;
    }
  }

  private generateSRT(words: CaptionWord[], fullText: string): string {
    if (words.length === 0) {
      // Fallback: split text into chunks
      const lines = fullText.match(/.{1,50}(\s|$)/g) || [fullText];
      return lines.map((line, i) => {
        const start = i * 3;
        const end = start + 3;
        return `${i + 1}\n${this.formatSRTTime(start)} --> ${this.formatSRTTime(end)}\n${line.trim()}\n`;
      }).join('\n');
    }

    // Group words into 5-word chunks for captions
    const chunks: { words: CaptionWord[]; text: string }[] = [];
    for (let i = 0; i < words.length; i += 5) {
      const chunk = words.slice(i, i + 5);
      chunks.push({
        words: chunk,
        text: chunk.map((w) => w.word).join(' '),
      });
    }

    return chunks.map((chunk, i) => {
      const start = chunk.words[0]?.start ?? 0;
      const end = chunk.words[chunk.words.length - 1]?.end ?? start + 2;
      return `${i + 1}\n${this.formatSRTTime(start)} --> ${this.formatSRTTime(end)}\n${chunk.text}\n`;
    }).join('\n');
  }

  private generateVTT(words: CaptionWord[]): string {
    let vtt = 'WEBVTT\n\n';
    for (let i = 0; i < words.length; i += 5) {
      const chunk = words.slice(i, i + 5);
      const start = chunk[0]?.start ?? 0;
      const end = chunk[chunk.length - 1]?.end ?? start + 2;
      const text = chunk.map((w) => w.word).join(' ');
      vtt += `${this.formatVTTTime(start)} --> ${this.formatVTTTime(end)}\n${text}\n\n`;
    }
    return vtt;
  }

  private async styleWithAI(words: CaptionWord[]): Promise<{
    highlightWords: string[];
    emojiMap: Record<string, string>;
    colorTheme: string;
  }> {
    if (words.length === 0) return { highlightWords: [], emojiMap: {}, colorTheme: '#FFD700' };

    const sample = words.slice(0, 50).map((w) => w.word).join(' ');
    const prompt = `Analyze these caption words and return a JSON with:
- highlightWords: array of 5-10 impactful words to highlight in bright color
- emojiMap: object mapping key words to emojis (e.g. {"amazing": "🔥", "money": "💰"})
- colorTheme: hex color for caption highlight (e.g. "#FFD700")

Words: "${sample}"

Return ONLY valid JSON.`;

    try {
      const response = await this.openai.chat([{ role: 'user', content: prompt }], { maxTokens: 300 });
      this.updateTokens(response.usage?.total_tokens || 0);
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { highlightWords: [], emojiMap: {}, colorTheme: '#FFD700' };
    } catch {
      return { highlightWords: [], emojiMap: {}, colorTheme: '#FFD700' };
    }
  }

  private formatSRTTime(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return `${h}:${m}:${s},${ms}`;
  }

  private formatVTTTime(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
  }

  protected async onStop(): Promise<void> {}
}
