import { BaseAgent } from './BaseAgent';
import { AgentType } from '@prisma/client';
import { prisma } from '../index';

export class AnalyticsAgent extends BaseAgent {
  constructor(id = 'analytics-agent', name = 'Analytics Agent', type = AgentType.ANALYTICS) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    this.log('info', '📊 Aggregating Lead Generation & Website Automation metrics...');

    const [totalLeads, leadsNoWebsite, websitesGenerated, outreachSent, stageCounts] = await Promise.all([
      prisma.businessLead.count(),
      prisma.businessLead.count({ where: { hasWebsite: false } }),
      prisma.generatedWebsite.count(),
      prisma.outreachDraft.count({ where: { status: 'SENT' } }),
      prisma.businessLead.groupBy({ by: ['pipelineStage'], _count: { pipelineStage: true } }),
    ]);

    const summary = {
      totalLeads,
      leadsNoWebsite,
      websitesGenerated,
      outreachSent,
      stages: Object.fromEntries(stageCounts.map((s) => [s.pipelineStage.toLowerCase(), s._count.pipelineStage])),
      timestamp: new Date().toISOString(),
    };

    this.log('success', `✅ Analytics summary generated. Total Leads: ${totalLeads}, Websites Generated: ${websitesGenerated}.`);
    this.updateTokens(180);
    return summary;
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'Analytics Agent stopped');
  }
}
