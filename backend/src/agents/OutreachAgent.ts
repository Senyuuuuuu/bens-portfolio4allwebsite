import { BaseAgent } from './BaseAgent';
import { AgentType, OutreachChannel, DraftStatus, PipelineStage } from '@prisma/client';
import { prisma } from '../index';

export class OutreachAgent extends BaseAgent {
  constructor(id = 'outreach-agent', name = 'Personalized Outreach Agent', type = AgentType.OUTREACH_AGENT) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { leadId } = input;
    if (!leadId) throw new Error('leadId is required for OutreachAgent');

    const lead = await prisma.businessLead.findUnique({
      where: { id: leadId as string },
      include: { audit: true, intelligence: true, websiteDemos: { take: 1 } },
    });
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    this.log('info', `✉️ Generating personalized outreach sequence for: ${lead.name}...`);

    const demoUrl = lead.websiteDemos[0]?.previewUrl || `http://localhost:3000/website-preview/${lead.id}`;
    const missingItems = lead.audit?.missingFeatures.slice(0, 3).join(', ') || 'online booking, mobile responsiveness';

    // Email Draft
    const emailDraft = await prisma.outreachDraft.create({
      data: {
        leadId: lead.id,
        channel: OutreachChannel.EMAIL,
        subject: `Complementary Website Upgrade Demo for ${lead.name}`,
        bodyText: `Hi Team at ${lead.name},

I noticed your ${lead.category.toLowerCase()} in ${lead.address || 'the region'} has fantastic reviews (${lead.rating || 4.8} stars!).

${!lead.hasWebsite ? `I saw that ${lead.name} doesn't currently have a dedicated mobile website for online bookings.` : `While inspecting your current online presence, we noticed opportunities to improve your mobile load speed and online booking system (${missingItems}).`}

To demonstrate what's possible, our AI Website Studio put together a **custom, fully interactive demo website** tailored specifically for ${lead.name}:

👉 **Interactive Demo Website**: ${demoUrl}

Key Features Included:
- 📱 100% Mobile Responsive Design
- ⚡ Sub-second Page Load Times
- 📅 Instant 24/7 Mobile Online Booking System
- ★ Live Google Customer Review Integration

Would you be open to a 5-minute chat this week to review the demo together?

Best regards,
Growth Automation Team`,
        status: DraftStatus.DRAFT,
      },
    });

    // Facebook / Social Draft
    const facebookDraft = await prisma.outreachDraft.create({
      data: {
        leadId: lead.id,
        channel: OutreachChannel.FACEBOOK_MSG,
        subject: `Custom Demo for ${lead.name}`,
        bodyText: `Hi ${lead.name}! 👋 Love the work you're doing in ${lead.category}. We created a free interactive demo website for your business with an online booking widget: ${demoUrl}. Check it out and let us know what you think!`,
        status: DraftStatus.DRAFT,
      },
    });

    await prisma.businessLead.update({
      where: { id: lead.id },
      update: { pipelineStage: PipelineStage.OUTREACH_DRAFTED },
    });

    this.log('success', `✅ Outreach drafts created for ${lead.name} (Email & Facebook). Ready for review in Outreach Studio.`);
    this.updateTokens(380);
    return { leadId: lead.id, drafts: [emailDraft, facebookDraft] };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'Personalized Outreach Agent stopped');
  }
}
