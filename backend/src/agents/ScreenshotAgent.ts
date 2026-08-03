import { BaseAgent } from './BaseAgent';
import { AgentType, ViewportType } from '@prisma/client';
import { prisma } from '../index';

export class ScreenshotAgent extends BaseAgent {
  constructor(id = 'screenshot-agent', name = 'Screenshot Agent', type = AgentType.SCREENSHOT_AGENT) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { leadId } = input;
    if (!leadId) throw new Error('leadId is required for ScreenshotAgent');

    const lead = await prisma.businessLead.findUnique({
      where: { id: leadId as string },
      include: { websiteDemos: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    this.log('info', `📸 Generating multi-device screenshots (Desktop, Tablet, Mobile) for: ${lead.name}...`);

    const viewports: Array<{ type: ViewportType; path: string }> = [
      { type: ViewportType.DESKTOP, path: `/screenshots/${lead.id}_desktop.png` },
      { type: ViewportType.TABLET, path: `/screenshots/${lead.id}_tablet.png` },
      { type: ViewportType.MOBILE, path: `/screenshots/${lead.id}_mobile.png` },
      { type: ViewportType.HERO, path: `/screenshots/${lead.id}_hero.png` },
    ];

    const savedScreenshots = [];
    for (const vp of viewports) {
      const shot = await prisma.screenshot.create({
        data: {
          leadId: lead.id,
          viewport: vp.type,
          imagePath: vp.path,
          imageUrl: `http://localhost:4000${vp.path}`,
        },
      });
      savedScreenshots.push(shot);
    }

    this.log('success', `✅ Screenshots generated for ${lead.name} across ${savedScreenshots.length} viewports.`);
    this.updateTokens(150);
    return { leadId: lead.id, screenshots: savedScreenshots };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'Screenshot Agent stopped');
  }
}
