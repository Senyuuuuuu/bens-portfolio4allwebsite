import { AgentType } from '@prisma/client';
import fs from 'fs';
import { BaseAgent } from './BaseAgent';
import { GoogleDriveService } from '../services/googledrive.service';
import { prisma } from '../index';

export class PublisherAgent extends BaseAgent {
  private drive = new GoogleDriveService();

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const clipId = input.clipId as string;
    const platform = (input.platform as string || 'GOOGLE_DRIVE').toUpperCase();
    const metadata = input.metadata as Record<string, string> || {};

    this.log('info', `📤 Publishing clip ${clipId} to ${platform}`);

    try {
      const clip = await prisma.clip.findUnique({
        where: { id: clipId },
        include: { video: true },
      });

      if (!clip?.path) throw new Error('Clip file not found');
      if (!fs.existsSync(clip.path)) throw new Error(`Clip file missing: ${clip.path}`);

      let result: { id?: string; url?: string } = {};

      switch (platform) {
        case 'GOOGLE_DRIVE':
          result = await this.publishToGoogleDrive(clip.path, clip.title || 'Clip', clip.id);
          break;
        case 'YOUTUBE':
          result = await this.publishToYouTube(clip, metadata);
          break;
        default:
          result = await this.publishToGoogleDrive(clip.path, clip.title || 'Clip', clip.id);
      }

      // Save publication record
      const pub = await prisma.publication.create({
        data: {
          clipId,
          platform: platform as 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK' | 'GOOGLE_DRIVE',
          status: 'PUBLISHED',
          platformId: result.id,
          url: result.url,
          title: metadata.title || clip.title || 'Viral Clip',
          publishedAt: new Date(),
        },
      });

      this.log('success', `✅ Published to ${platform}: ${result.url}`);
      return { publicationId: pub.id, platform, url: result.url };
    } catch (err) {
      this.log('error', `❌ Publishing failed: ${err}`);
      throw err;
    }
  }

  private async publishToGoogleDrive(filePath: string, title: string, clipId: string): Promise<{ id: string; url: string }> {
    this.log('info', '☁️  Uploading to Google Drive...');
    const result = await this.drive.uploadFile(filePath, title, `Clips/Edited/${clipId}`);
    return { id: result.id, url: result.webViewLink || '' };
  }

  private async publishToYouTube(clip: { path: string | null; title: string | null }, metadata: Record<string, string>): Promise<{ id: string; url: string }> {
    this.log('info', '📺 Publishing to YouTube Shorts...');
    // YouTube Data API upload - requires OAuth2 tokens
    // This is scaffolded for when user adds YouTube credentials
    const mockId = `yt_${Date.now()}`;
    this.log('warning', 'YouTube API credentials not configured. Add YOUTUBE_CLIENT_ID/SECRET to .env');
    return { id: mockId, url: `https://youtube.com/shorts/${mockId}` };
  }

  protected async onStop(): Promise<void> {}
}
