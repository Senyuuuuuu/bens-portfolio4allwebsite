import { AgentType } from '@prisma/client';
import { BaseAgent } from './BaseAgent';
import { OpenAIService } from '../services/openai.service';

export class ResearchAgent extends BaseAgent {
  private openai = new OpenAIService();

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.start();
    const topic = input.topic as string;
    this.log('info', `🔬 Researching topic: "${topic}"`);

    try {
      const [seoData, contentData] = await Promise.all([
        this.generateSEO(topic),
        this.generateContent(topic),
      ]);

      this.log('success', `✅ Research complete for "${topic}"`);
      return { ...seoData, ...contentData, topic };
    } catch (err) {
      this.log('error', `❌ Research failed: ${err}`);
      throw err;
    }
  }

  private async generateSEO(topic: string): Promise<Record<string, unknown>> {
    const prompt = `You are an expert YouTube/TikTok SEO strategist. For the topic: "${topic}"
    
Generate a JSON response with:
- keywords: array of 20 high-traffic keywords
- hashtags: array of 15 viral hashtags
- tags: array of 10 YouTube tags
- searchVolume: estimated monthly searches
- difficulty: SEO difficulty 0-100

Return ONLY valid JSON.`;

    const response = await this.openai.chat([{ role: 'user', content: prompt }], { maxTokens: 800 });
    this.updateTokens(response.usage?.total_tokens || 0);
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { keywords: [], hashtags: [], tags: [] };
  }

  private async generateContent(topic: string): Promise<Record<string, unknown>> {
    const prompt = `You are a viral content strategist. For the topic: "${topic}"

Generate a JSON response with:
- titles: array of 5 viral video titles (under 60 chars each)
- description: 1 YouTube description (300 words, SEO optimized)
- hooks: array of 3 video hook ideas (first 3 seconds)
- callToAction: array of 3 CTA options
- outline: array of 5 content sections

Return ONLY valid JSON.`;

    const response = await this.openai.chat([{ role: 'user', content: prompt }], { maxTokens: 1200 });
    this.updateTokens(response.usage?.total_tokens || 0);
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { titles: [], description: '', hooks: [] };
  }

  protected async onStop(): Promise<void> {}
}
