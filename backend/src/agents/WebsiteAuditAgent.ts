import { BaseAgent } from './BaseAgent';
import { AgentType, PipelineStage } from '@prisma/client';
import { prisma } from '../index';

export class WebsiteAuditAgent extends BaseAgent {
  constructor(id = 'website-audit', name = 'Website Audit Agent', type = AgentType.WEBSITE_AUDIT) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { leadId } = input;
    if (!leadId) throw new Error('leadId is required for WebsiteAuditAgent');

    const lead = await prisma.businessLead.findUnique({ where: { id: leadId as string } });
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    this.log('info', `🌐 Auditing digital presence for: ${lead.name}...`);

    let audit;
    if (!lead.website) {
      // Business has NO website — 0 score, maximum opportunity
      audit = await prisma.websiteAudit.upsert({
        where: { leadId: lead.id },
        update: {
          hasSsl: false,
          isMobileFriendly: false,
          loadTimeMs: 0,
          seoScore: 0,
          qualityScore: 15, // Extremely low score indicates website is urgent need
          hasBooking: false,
          hasContactForm: false,
          missingFeatures: ['Website Missing', 'Online Booking', 'SSL Security', 'Mobile Layout', 'Contact Form'],
        },
        create: {
          leadId: lead.id,
          hasSsl: false,
          isMobileFriendly: false,
          loadTimeMs: 0,
          seoScore: 0,
          qualityScore: 15,
          hasBooking: false,
          hasContactForm: false,
          missingFeatures: ['Website Missing', 'Online Booking', 'SSL Security', 'Mobile Layout', 'Contact Form'],
        },
      });

      await prisma.businessLead.update({
        where: { id: lead.id },
        update: {
          leadScore: 95, // Urgent priority lead
          pipelineStage: PipelineStage.WEBSITE_AUDITED,
        },
      });

      this.log('warning', `⚠️ Lead ${lead.name} has NO website! Assigned Lead Score 95.`);
    } else {
      // Existing website audit simulation
      const hasSsl = lead.website.startsWith('https');
      const isMobileFriendly = Math.random() > 0.4;
      const loadTimeMs = Math.floor(Math.random() * 3000) + 1200;
      const seoScore = Math.floor(Math.random() * 40) + 40;
      const qualityScore = Math.floor((seoScore + (hasSsl ? 20 : 0) + (isMobileFriendly ? 30 : 10)) / 1.1);
      const missing = [];
      if (!hasSsl) missing.push('HTTPS SSL Security');
      if (!isMobileFriendly) missing.push('Mobile Viewport Optimization');
      if (loadTimeMs > 2500) missing.push('Fast Load Speed (< 2s)');
      missing.push('Modern Online Booking Widget', 'High Converting CTA');

      audit = await prisma.websiteAudit.upsert({
        where: { leadId: lead.id },
        update: {
          hasSsl,
          isMobileFriendly,
          loadTimeMs,
          seoScore,
          qualityScore,
          hasBooking: false,
          hasContactForm: true,
          missingFeatures: missing,
        },
        create: {
          leadId: lead.id,
          hasSsl,
          isMobileFriendly,
          loadTimeMs,
          seoScore,
          qualityScore,
          hasBooking: false,
          hasContactForm: true,
          missingFeatures: missing,
        },
      });

      const newLeadScore = Math.max(30, 100 - qualityScore);
      await prisma.businessLead.update({
        where: { id: lead.id },
        update: {
          leadScore: newLeadScore,
          pipelineStage: PipelineStage.WEBSITE_AUDITED,
        },
      });

      this.log('success', `✅ Audit completed for ${lead.name}. Quality Score: ${qualityScore}/100. Opportunity Score: ${newLeadScore}.`);
    }

    this.updateTokens(320);
    return { leadId: lead.id, audit };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'Website Audit Agent stopped');
  }
}
