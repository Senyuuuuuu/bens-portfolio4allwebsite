import axios from 'axios';
import { AgentType } from '@prisma/client';
import { BaseAgent } from './BaseAgent';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../index';

interface TrendResult {
  title: string;
  source: string;
  url?: string;
  viralScore: number;
  competition: number;
  estimatedViews?: number;
  growthRate?: number;
  confidence: number;
  category?: string;
  keywords: string[];
}

export class TrendHunterAgent extends BaseAgent {
  private openai = new OpenAIService();
  private running = false;

  constructor(id: string, name: string, type: AgentType) {
    super({ id, name, type });
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    this.running = true;
    await this.start();
    this.log('info', '🔍 Starting trend discovery...');

    const results: TrendResult[] = [];

    try {
      // Parallel trend discovery
      const [youtubeResults, redditResults, googleResults] = await Promise.allSettled([
        this.fetchYouTubeTrending(),
        this.fetchRedditTrending(),
        this.fetchGoogleTrends(input.query as string),
      ]);

      if (youtubeResults.status === 'fulfilled') results.push(...youtubeResults.value);
      if (redditResults.status === 'fulfilled') results.push(...redditResults.value);
      if (googleResults.status === 'fulfilled') results.push(...googleResults.value);

      this.log('info', `📊 Found ${results.length} raw trends, ranking...`);

      // AI-powered ranking
      const ranked = await this.rankWithAI(results);

      // Persist to database
      for (const trend of ranked) {
        await prisma.trend.upsert({
          where: { id: `${trend.source}-${trend.title.slice(0, 50)}`.replace(/[^a-z0-9-]/gi, '-') },
          update: {
            viralScore: trend.viralScore,
            growthRate: trend.growthRate,
            updatedAt: new Date(),
          },
          create: {
            title: trend.title,
            source: trend.source,
            url: trend.url,
            viralScore: trend.viralScore,
            competition: trend.competition,
            estimatedViews: trend.estimatedViews,
            growthRate: trend.growthRate,
            confidence: trend.confidence,
            category: trend.category,
            keywords: trend.keywords,
          },
        });
      }

      this.log('success', `✅ Saved ${ranked.length} trends to database`);
      return { trends: ranked, count: ranked.length };
    } catch (err) {
      this.log('error', `❌ Trend discovery failed: ${err}`);
      throw err;
    } finally {
      this.running = false;
    }
  }

  private async fetchYouTubeTrending(): Promise<TrendResult[]> {
    this.log('info', '📺 Fetching YouTube trending...');
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      this.log('warning', 'YouTube API key not configured, skipping');
      return this.getMockTrends('youtube');
    }

    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        maxResults: 20,
        regionCode: 'US',
        key: apiKey,
      },
    });

    return data.items.map((item: Record<string, unknown>) => {
      const snippet = item.snippet as Record<string, unknown>;
      const stats = item.statistics as Record<string, unknown>;
      const views = parseInt(String(stats?.viewCount || '0'));
      return {
        title: snippet.title as string,
        source: 'youtube',
        url: `https://youtube.com/watch?v=${item.id}`,
        viralScore: Math.min(100, views / 100000),
        competition: 70,
        estimatedViews: views,
        growthRate: Math.random() * 50 + 10,
        confidence: 85,
        category: snippet.categoryId as string,
        keywords: ((snippet.tags as string[]) || []).slice(0, 10),
      };
    });
  }

  private async fetchRedditTrending(): Promise<TrendResult[]> {
    this.log('info', '👽 Fetching Reddit trending...');
    try {
      const { data } = await axios.get('https://www.reddit.com/r/videos/hot.json?limit=20', {
        headers: { 'User-Agent': 'ACF-Bot/1.0' },
      });
      return data.data.children.map((post: Record<string, unknown>) => {
        const p = post.data as Record<string, unknown>;
        return {
          title: p.title as string,
          source: 'reddit',
          url: `https://reddit.com${p.permalink}`,
          viralScore: Math.min(100, (p.score as number) / 1000),
          competition: 50,
          estimatedViews: p.score as number,
          growthRate: Math.random() * 30,
          confidence: 75,
          category: p.link_flair_text as string,
          keywords: String(p.title).toLowerCase().split(' ').filter((w) => w.length > 4),
        };
      });
    } catch {
      return this.getMockTrends('reddit');
    }
  }

  private async fetchGoogleTrends(_query?: string): Promise<TrendResult[]> {
    this.log('info', '🔎 Fetching Google Trends...');
    // Google Trends doesn't have an official API; use mock/RSS approach
    return this.getMockTrends('google_trends');
  }

  private async rankWithAI(trends: TrendResult[]): Promise<TrendResult[]> {
    try {
      const topTrends = trends.slice(0, 30);
      const prompt = `You are a viral content analyst. Rank these trends by viral potential for short-form video content.
      
Trends: ${JSON.stringify(topTrends.map(t => ({ title: t.title, source: t.source, views: t.estimatedViews })), null, 2)}

Return a JSON array of the top 10 trends with updated viralScore (0-100), confidence (0-100), and keywords array.`;

      const response = await this.openai.chat([{ role: 'user', content: prompt }], { maxTokens: 1000 });
      this.updateTokens(response.usage?.total_tokens || 0);

      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const ranked = JSON.parse(jsonMatch[0]) as Partial<TrendResult>[];
        return ranked.map((r, i) => ({
          ...topTrends[i],
          ...r,
          viralScore: r.viralScore ?? topTrends[i]?.viralScore ?? 50,
        }));
      }
    } catch {
      this.log('warning', 'AI ranking failed, using raw scores');
    }
    return trends.sort((a, b) => b.viralScore - a.viralScore).slice(0, 20);
  }

  private getMockTrends(source: string): TrendResult[] {
    const topics = [
      'AI tools productivity hack',
      'Viral cooking challenge',
      'Crazy gym transformation',
      'Money saving tips 2025',
      'Gaming world record broken',
    ];
    return topics.map((title, i) => ({
      title,
      source,
      viralScore: 90 - i * 10,
      competition: 60 + i * 5,
      estimatedViews: 1000000 - i * 100000,
      growthRate: 30 - i * 5,
      confidence: 80 - i * 5,
      keywords: title.toLowerCase().split(' '),
    }));
  }

  protected async onStop(): Promise<void> {
    this.running = false;
  }
}
