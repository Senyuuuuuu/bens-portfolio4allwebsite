import { BaseAgent } from './BaseAgent';
import { AgentType, PipelineStage } from '@prisma/client';
import { prisma } from '../index';

export class CRMAgent extends BaseAgent {
  constructor(id = 'crm-agent', name = 'CRM Agent', type = AgentType.CRM_AGENT) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { leadId, stage, notes } = input;
    if (!leadId) throw new Error('leadId is required for CRMAgent');

    const lead = await prisma.businessLead.findUnique({ where: { id: leadId as string } });
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    this.log('info', `📈 Updating CRM Lead Pipeline for: ${lead.name}...`);

    const updatedLead = await prisma.businessLead.update({
      where: { id: lead.id },
      update: {
        pipelineStage: (stage as PipelineStage) || lead.pipelineStage,
        notes: notes ? `${lead.notes || ''}\n[${new Date().toLocaleDateString()}] ${notes}` : lead.notes,
      },
    });

    this.log('success', `✅ CRM Stage updated for ${lead.name} to: ${updatedLead.pipelineStage}`);
    this.updateTokens(100);
    return { leadId: lead.id, lead: updatedLead };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'CRM Agent stopped');
  }
}
