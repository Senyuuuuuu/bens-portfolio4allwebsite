import { BaseAgent } from './BaseAgent';
import { AgentType } from '@prisma/client';
import { prisma } from '../index';

export class BusinessBIAgent extends BaseAgent {
  constructor(id = 'business-bi', name = 'Business Intelligence Agent', type = AgentType.BUSINESS_BI) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { leadId } = input;
    if (!leadId) throw new Error('leadId is required for BusinessBIAgent');

    const lead = await prisma.businessLead.findUnique({
      where: { id: leadId as string },
      include: { audit: true, social: true },
    });
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    this.log('info', `🧠 Synthesizing AI Business Intelligence for: ${lead.name}...`);

    // Color palette selection based on business category
    const palettes: Record<string, string[]> = {
      Restaurant: ['#1e293b', '#e11d48', '#fbbf24', '#f8fafc'],
      Hotel: ['#0f172a', '#0284c7', '#38bdf8', '#f8fafc'],
      Resort: ['#042f2e', '#0d9488', '#f59e0b', '#f8fafc'],
      Spa: ['#1c1917', '#d97706', '#fef3c7', '#ffffff'],
      Salon: ['#18181b', '#ec4899', '#f472b6', '#ffffff'],
      Clinic: ['#0f172a', '#2563eb', '#60a5fa', '#ffffff'],
      Default: ['#0f172a', '#0d9488', '#38bdf8', '#ffffff'],
    };

    const palette = palettes[lead.category] || palettes.Default;

    const intelligence = await prisma.businessIntelligence.upsert({
      where: { leadId: lead.id },
      update: {
        summary: `${lead.name} is a premier ${lead.category} operating in ${lead.address || 'the local region'}. Known for excellent customer ratings (${lead.rating || 4.5}/5 stars across ${lead.reviewCount} reviews).`,
        services: [
          `Premium ${lead.category} Experiences`,
          'VIP Online Reservations',
          'Specialized Local Services',
          'Customer Care & Support',
        ],
        brandStyle: 'Modern, High-Converting & Mobile-Optimized',
        colorPalette: palette,
        targetAudience: `Local residents and visitors seeking high quality ${lead.category.toLowerCase()} services`,
        improvements: [
          'Add Instant 24/7 Mobile Online Booking System',
          'Implement High-Converting Hero CTA Sections',
          'Upgrade Page Speed to Sub-Second Performance',
          'Display Live Google Customer Reviews Widget',
        ],
      },
      create: {
        leadId: lead.id,
        summary: `${lead.name} is a premier ${lead.category} operating in ${lead.address || 'the local region'}. Known for excellent customer ratings (${lead.rating || 4.5}/5 stars across ${lead.reviewCount} reviews).`,
        services: [
          `Premium ${lead.category} Experiences`,
          'VIP Online Reservations',
          'Specialized Local Services',
          'Customer Care & Support',
        ],
        brandStyle: 'Modern, High-Converting & Mobile-Optimized',
        colorPalette: palette,
        targetAudience: `Local residents and visitors seeking high quality ${lead.category.toLowerCase()} services`,
        improvements: [
          'Add Instant 24/7 Mobile Online Booking System',
          'Implement High-Converting Hero CTA Sections',
          'Upgrade Page Speed to Sub-Second Performance',
          'Display Live Google Customer Reviews Widget',
        ],
      },
    });

    this.log('success', `✅ Business Intelligence generated for ${lead.name}. Selected palette: ${palette.join(', ')}.`);
    this.updateTokens(450);
    return { leadId: lead.id, intelligence };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'Business Intelligence Agent stopped');
  }
}
