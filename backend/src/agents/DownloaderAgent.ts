import { AgentType } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BaseAgent } from './BaseAgent';
import { prisma } from '../index';
import { io } from '../index';

const DOWNLOAD_DIR = process.env.UPLOADS_PATH || './uploads';

export class DownloaderAgent extends BaseAgent {
  private activeProcess: ReturnType<typeof spawn> | null = null;

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const url = input.url as string;
    const jobId = input.jobId as string;
    this.log('info', `⬇️  Downloading: ${url}`);
    this.setCurrentJob(jobId);

    if (!fs.existsSync(DOWNLOAD_DIR)) {
      fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        url,
        source: this.detectSource(url),
        status: 'DOWNLOADING',
      },
    });

    try {
      const outputPath = await this.downloadWithYtDlp(url, video.id, jobId);
      const stats = fs.statSync(outputPath);

      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'DOWNLOADED',
          rawPath: outputPath,
          fileSize: stats.size,
        },
      });

      this.log('success', `✅ Downloaded: ${path.basename(outputPath)}`);
      return { videoId: video.id, path: outputPath, fileSize: stats.size };
    } catch (err) {
      await prisma.video.update({
        where: { id: video.id },
        data: { status: 'FAILED' },
      });
      this.log('error', `❌ Download failed: ${err}`);
      throw err;
    } finally {
      this.setCurrentJob(null);
    }
  }

  private downloadWithYtDlp(url: string, videoId: string, jobId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputTemplate = path.join(DOWNLOAD_DIR, `${videoId}.%(ext)s`);
      const ytdlp = process.env.YTDLP_PATH || 'yt-dlp';

      const args = [
        url,
        '-o', outputTemplate,
        '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        '--merge-output-format', 'mp4',
        '--no-playlist',
        '--progress',
        '--newline',
      ];

      this.activeProcess = spawn(ytdlp, args);
      let outputFile = '';

      this.activeProcess.stdout?.on('data', (data: Buffer) => {
        const line = data.toString().trim();
        if (line.includes('[download]') || line.includes('[Merger]')) {
          this.log('info', line);
          // Parse progress
          const match = line.match(/(\d+\.?\d*)%/);
          if (match && jobId) {
            const progress = parseFloat(match[1]);
            io.to(`job:${jobId}`).emit('job:progress', { jobId, progress });
          }
          // Track output filename
          const destMatch = line.match(/Destination: (.+)/);
          if (destMatch) outputFile = destMatch[1];
        }
      });

      this.activeProcess.stderr?.on('data', (data: Buffer) => {
        this.log('warning', data.toString().trim());
      });

      this.activeProcess.on('close', (code) => {
        if (code === 0) {
          // Find the output file
          const files = fs.readdirSync(DOWNLOAD_DIR)
            .filter(f => f.startsWith(videoId))
            .map(f => path.join(DOWNLOAD_DIR, f));
          if (files.length > 0) {
            resolve(files[0]);
          } else if (outputFile) {
            resolve(outputFile);
          } else {
            reject(new Error('Output file not found after download'));
          }
        } else {
          reject(new Error(`yt-dlp exited with code ${code}`));
        }
        this.activeProcess = null;
      });

      this.activeProcess.on('error', (err) => {
        reject(new Error(`yt-dlp not found: ${err.message}. Install with: pip install yt-dlp`));
        this.activeProcess = null;
      });
    });
  }

  private detectSource(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('twitch.tv')) return 'twitch';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
    if (url.includes('kick.com')) return 'kick';
    return 'unknown';
  }

  protected async onStop(): Promise<void> {
    if (this.activeProcess) {
      this.activeProcess.kill();
      this.activeProcess = null;
    }
  }
}
