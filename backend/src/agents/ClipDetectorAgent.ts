import { AgentType } from '@prisma/client';
import { BaseAgent } from './BaseAgent';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../index';

interface ClipDetection {
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  type: 'HOOK' | 'FUNNY' | 'EMOTIONAL' | 'STORY_CLIMAX' | 'ARGUMENT' | 'REACTION' | 'HIGH_ENGAGEMENT' | 'VIRAL';
  title: string;
  description: string;
  reason: string;
}

export class ClipDetectorAgent extends BaseAgent {
  private openai = new OpenAIService();

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const videoId = input.videoId as string;
    this.log('info', `🎬 Detecting clips in video: ${videoId}`);

    try {
      // Get transcript
      const transcript = await prisma.transcript.findUnique({ where: { videoId } });
      if (!transcript) throw new Error('No transcript found. Run transcription first.');

      const segments = JSON.parse(String(transcript.segments || '[]')) as Array<{
        id: number; start: number; end: number; text: string;
      }>;

      this.log('info', `📝 Analyzing ${segments.length} segments...`);

      // AI-powered clip detection
      const clips = await this.detectClipsWithAI(transcript.text, segments);

      // Save clips to database
      const savedClips = [];
      for (const clip of clips) {
        const saved = await prisma.clip.create({
          data: {
            videoId,
            startTime: clip.startTime,
            endTime: clip.endTime,
            duration: clip.duration,
            score: clip.score,
            type: clip.type,
            title: clip.title,
            description: clip.description,
          },
        });
        savedClips.push(saved);
      }

      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'DETECTING_CLIPS' },
      });

      this.log('success', `✅ Detected ${savedClips.length} viral clips`);
      return { videoId, clips: savedClips, count: savedClips.length };
    } catch (err) {
      this.log('error', `❌ Clip detection failed: ${err}`);
      throw err;
    }
  }

  private async detectClipsWithAI(
    fullText: string,
    segments: Array<{ id: number; start: number; end: number; text: string }>,
  ): Promise<ClipDetection[]> {
    const segmentSummary = segments
      .map((s) => `[${s.start.toFixed(1)}s-${s.end.toFixed(1)}s]: ${s.text}`)
      .join('\n')
      .slice(0, 8000);

    const prompt = `You are a viral short-form video expert. Analyze this transcript and identify the BEST clips for TikTok/YouTube Shorts.

Transcript segments:
${segmentSummary}

Identify 5-10 best clips. For each clip return:
- startTime: number (seconds)
- endTime: number (seconds)
- duration: number (endTime - startTime)
- score: number (0-100, viral potential)
- type: one of HOOK, FUNNY, EMOTIONAL, STORY_CLIMAX, ARGUMENT, REACTION, HIGH_ENGAGEMENT, VIRAL
- title: string (catchy clip title)
- description: string (why this clip is viral)
- reason: string (specific viral element)

Rules:
- Each clip should be 15-90 seconds
- Prefer hooks (first 30 seconds of video)
- Look for emotional peaks, punchlines, reveals
- Score by viral potential: reaction bait, humor, emotion, controversy

Return ONLY a valid JSON array of clip objects.`;

    const response = await this.openai.chat([{ role: 'user', content: prompt }], { maxTokens: 2000 });
    this.updateTokens(response.usage?.total_tokens || 0);

    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return this.generateFallbackClips(segments);

    try {
      const clips = JSON.parse(jsonMatch[0]) as ClipDetection[];
      return clips.filter((c) => c.startTime >= 0 && c.endTime > c.startTime);
    } catch {
      return this.generateFallbackClips(segments);
    }
  }

  private generateFallbackClips(segments: Array<{ id: number; start: number; end: number; text: string }>): ClipDetection[] {
    if (segments.length === 0) return [];
    const totalDuration = segments[segments.length - 1]?.end || 60;

    return [
      {
        startTime: 0,
        endTime: Math.min(30, totalDuration),
        duration: Math.min(30, totalDuration),
        score: 75,
        type: 'HOOK',
        title: 'Opening Hook',
        description: 'Strong opening segment',
        reason: 'First 30 seconds - highest retention',
      },
    ];
  }

  protected async onStop(): Promise<void> {}
}
