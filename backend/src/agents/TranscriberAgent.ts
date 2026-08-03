import { AgentType } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BaseAgent } from './BaseAgent';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../index';

export class TranscriberAgent extends BaseAgent {
  private openai = new OpenAIService();

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const videoId = input.videoId as string;
    const videoPath = input.videoPath as string;

    this.log('info', `🎤 Transcribing video: ${videoId}`);

    try {
      let transcript: {
        text: string;
        segments: TranscriptSegment[];
        language: string;
      };

      if (process.env.USE_OPENAI_WHISPER === 'true') {
        transcript = await this.transcribeWithOpenAI(videoPath);
      } else {
        transcript = await this.transcribeWithLocalWhisper(videoPath);
      }

      // Save to database
      await prisma.transcript.upsert({
        where: { videoId },
        update: {
          text: transcript.text,
          language: transcript.language,
          segments: JSON.stringify(transcript.segments),
          wordTimings: JSON.stringify(this.extractWordTimings(transcript.segments)),
        },
        create: {
          videoId,
          text: transcript.text,
          language: transcript.language,
          segments: JSON.stringify(transcript.segments),
          wordTimings: JSON.stringify(this.extractWordTimings(transcript.segments)),
        },
      });

      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'TRANSCRIBED' },
      });

      this.log('success', `✅ Transcription complete: ${transcript.text.length} chars`);
      return { videoId, transcript, wordCount: transcript.text.split(' ').length };
    } catch (err) {
      this.log('error', `❌ Transcription failed: ${err}`);
      throw err;
    }
  }

  private async transcribeWithOpenAI(videoPath: string): Promise<{
    text: string;
    segments: TranscriptSegment[];
    language: string;
  }> {
    this.log('info', '🌐 Using OpenAI Whisper API...');

    // Extract audio first
    const audioPath = videoPath.replace(/\.[^.]+$/, '_audio.mp3');
    await this.extractAudio(videoPath, audioPath);

    const formData = new FormData();
    const audioBuffer = fs.readFileSync(audioPath);
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), path.basename(audioPath));
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    if (!response.ok) throw new Error(`OpenAI Whisper failed: ${response.statusText}`);
    const data = await response.json() as Record<string, unknown>;

    // Cleanup
    fs.unlinkSync(audioPath);
    this.updateTokens(100);

    return {
      text: data.text as string,
      language: (data.language as string) || 'en',
      segments: (data.segments as TranscriptSegment[]) || [],
    };
  }

  private transcribeWithLocalWhisper(videoPath: string): Promise<{
    text: string;
    segments: TranscriptSegment[];
    language: string;
  }> {
    return new Promise((resolve, reject) => {
      this.log('info', '🖥️  Using local Whisper...');
      const whisper = process.env.WHISPER_PATH || 'whisper';
      const args = [videoPath, '--output_format', 'json', '--output_dir', path.dirname(videoPath)];

      const proc = spawn(whisper, args);
      proc.on('close', (code) => {
        if (code === 0) {
          const jsonFile = videoPath.replace(/\.[^.]+$/, '.json');
          const result = JSON.parse(fs.readFileSync(jsonFile, 'utf-8')) as Record<string, unknown>;
          resolve({
            text: result.text as string,
            segments: result.segments as TranscriptSegment[],
            language: result.language as string,
          });
        } else {
          reject(new Error(`Whisper failed with code ${code}`));
        }
      });
      proc.on('error', () => reject(new Error('Whisper not installed. Set USE_OPENAI_WHISPER=true or install whisper.')));
    });
  }

  private extractAudio(videoPath: string, audioPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-i', videoPath, '-vn', '-acodec', 'mp3', '-y', audioPath]);
      ffmpeg.on('close', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg audio extraction failed: ${code}`)));
      ffmpeg.on('error', () => reject(new Error('FFmpeg not found')));
    });
  }

  private extractWordTimings(segments: TranscriptSegment[]): Array<{ word: string; start: number; end: number }> {
    const words: Array<{ word: string; start: number; end: number }> = [];
    for (const segment of segments) {
      if (segment.words) {
        words.push(...segment.words);
      }
    }
    return words;
  }

  protected async onStop(): Promise<void> {}
}

interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
}
