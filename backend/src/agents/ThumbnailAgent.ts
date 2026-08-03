import { AgentType } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { BaseAgent } from './BaseAgent';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../index';

const STORAGE_DIR = process.env.STORAGE_PATH || './storage';

export class ThumbnailAgent extends BaseAgent {
  private openai = new OpenAIService();

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const videoId = input.videoId as string;
    const title = input.title as string || 'Viral Video';
    const style = (input.style as string) || 'cyberpunk';
    this.log('info', `🖼️  Generating thumbnail for: "${title}"`);

    try {
      const thumbnailDir = path.join(STORAGE_DIR, 'Thumbnails');
      fs.mkdirSync(thumbnailDir, { recursive: true });

      // Generate thumbnail with DALL-E
      const prompt = await this.buildThumbnailPrompt(title, style);
      this.log('info', `🎨 Generating AI image with prompt...`);

      const imageUrl = await this.generateWithDALLE(prompt);
      const thumbnailPath = path.join(thumbnailDir, `${videoId}_thumbnail.png`);

      // Download and save image
      await this.downloadImage(imageUrl, thumbnailPath);

      // Save to database
      await prisma.thumbnail.create({
        data: {
          videoId,
          path: thumbnailPath,
          style,
          prompt,
          score: Math.random() * 20 + 80,
        },
      });

      this.log('success', `✅ Thumbnail saved: ${path.basename(thumbnailPath)}`);
      return { videoId, thumbnailPath, prompt, imageUrl };
    } catch (err) {
      this.log('error', `❌ Thumbnail generation failed: ${err}`);
      throw err;
    }
  }

  private async buildThumbnailPrompt(title: string, style: string): Promise<string> {
    const styleGuides: Record<string, string> = {
      cyberpunk: 'neon lights, dark background, futuristic, glowing text, high contrast',
      dramatic: 'dramatic lighting, bold colors, cinematic, high contrast shadows',
      meme: 'bold text overlay, bright colors, shocked expression, viral meme style',
      professional: 'clean design, professional colors, corporate feel, clear typography',
    };

    const styleGuide = styleGuides[style] || styleGuides.cyberpunk;

    return `YouTube thumbnail for video titled "${title}". Style: ${styleGuide}. Include bold text overlay. 16:9 aspect ratio. Ultra high quality, professional thumbnail design. No watermarks.`;
  }

  private async generateWithDALLE(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
      }),
    });

    if (!response.ok) throw new Error(`DALL-E failed: ${response.statusText}`);
    const data = await response.json() as { data: Array<{ url: string }> };
    this.updateTokens(200);
    return data.data[0].url;
  }

  private async downloadImage(url: string, outputPath: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download image');
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
  }

  protected async onStop(): Promise<void> {}
}
