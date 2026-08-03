import { AgentType } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BaseAgent } from './BaseAgent';
import { prisma } from '../index';
import { io } from '../index';

const STORAGE_DIR = process.env.STORAGE_PATH || './storage';

export class VideoEditorAgent extends BaseAgent {
  private activeProcess: ReturnType<typeof spawn> | null = null;

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const clipId = input.clipId as string;
    const videoPath = input.videoPath as string;
    const jobId = input.jobId as string;

    this.log('info', `✂️  Editing clip: ${clipId}`);
    this.setCurrentJob(jobId);

    try {
      const clip = await prisma.clip.findUnique({ where: { id: clipId } });
      if (!clip) throw new Error('Clip not found');

      const outputDir = path.join(STORAGE_DIR, 'Clips', 'Edited');
      fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, `${clipId}_edited.mp4`);

      // Step 1: Trim clip
      this.log('info', `✂️  Trimming ${clip.startTime}s - ${clip.endTime}s`);
      await this.trimClip(videoPath, outputPath, clip.startTime, clip.endTime, jobId);

      // Step 2: Reframe to 9:16
      const reframedPath = outputPath.replace('_edited.mp4', '_9x16.mp4');
      this.log('info', '📐 Reframing to 9:16 vertical...');
      await this.reframeTo9x16(outputPath, reframedPath, jobId);

      // Step 3: Enhance quality
      const finalPath = reframedPath.replace('_9x16.mp4', '_final.mp4');
      this.log('info', '✨ Applying enhancements...');
      await this.enhanceVideo(reframedPath, finalPath, jobId);

      // Cleanup intermediary files
      fs.existsSync(outputPath) && fs.unlinkSync(outputPath);
      fs.existsSync(reframedPath) && fs.unlinkSync(reframedPath);

      const stats = fs.statSync(finalPath);

      // Update clip
      await prisma.clip.update({
        where: { id: clipId },
        data: { path: finalPath },
      });

      await prisma.video.update({
        where: { id: clip.videoId },
        data: { status: 'EDITED', editedPath: finalPath },
      });

      this.log('success', `✅ Edit complete: ${path.basename(finalPath)}`);
      return { clipId, outputPath: finalPath, fileSize: stats.size };
    } catch (err) {
      this.log('error', `❌ Edit failed: ${err}`);
      throw err;
    } finally {
      this.setCurrentJob(null);
    }
  }

  private trimClip(input: string, output: string, start: number, end: number, jobId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const duration = end - start;
      const args = [
        '-ss', String(start),
        '-i', input,
        '-t', String(duration),
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-avoid_negative_ts', 'make_zero',
        '-y', output,
      ];

      this.activeProcess = spawn('ffmpeg', args);
      this.monitorFFmpeg(this.activeProcess, jobId, resolve, reject);
    });
  }

  private reframeTo9x16(input: string, output: string, jobId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Smart crop to 9:16 - center crop or face-detect crop
      const args = [
        '-i', input,
        '-vf', [
          'scale=iw*min(1080/iw\\,1920/ih):ih*min(1080/iw\\,1920/ih)',
          'pad=1080:1920:(1080-iw*min(1080/iw\\,1920/ih))/2:(1920-ih*min(1080/iw\\,1920/ih))/2:black',
        ].join(','),
        '-c:v', 'libx264',
        '-crf', '23',
        '-preset', 'fast',
        '-c:a', 'aac',
        '-y', output,
      ];

      this.activeProcess = spawn('ffmpeg', args);
      this.monitorFFmpeg(this.activeProcess, jobId, resolve, reject);
    });
  }

  private enhanceVideo(input: string, output: string, jobId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Add zoom punch-in, brightness/contrast boost, subtle motion blur
      const args = [
        '-i', input,
        '-vf', [
          'eq=brightness=0.05:saturation=1.2:contrast=1.1',
          'unsharp=5:5:1.0:5:5:0.0',
        ].join(','),
        '-c:v', 'libx264',
        '-crf', '20',
        '-preset', 'fast',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-y', output,
      ];

      this.activeProcess = spawn('ffmpeg', args);
      this.monitorFFmpeg(this.activeProcess, jobId, resolve, reject);
    });
  }

  private monitorFFmpeg(
    proc: ReturnType<typeof spawn>,
    jobId: string | undefined,
    resolve: () => void,
    reject: (err: Error) => void,
  ): void {
    proc.stderr?.on('data', (data: Buffer) => {
      const line = data.toString();
      const timeMatch = line.match(/time=(\d+:\d+:\d+\.\d+)/);
      if (timeMatch && jobId) {
        io.to(`job:${jobId}`).emit('job:ffmpeg_progress', { jobId, time: timeMatch[1] });
      }
    });
    proc.on('close', (code) => {
      this.activeProcess = null;
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
    proc.on('error', (err) => {
      reject(new Error(`FFmpeg not found: ${err.message}`));
    });
  }

  protected async onStop(): Promise<void> {
    if (this.activeProcess) {
      this.activeProcess.kill('SIGTERM');
      this.activeProcess = null;
    }
  }
}
