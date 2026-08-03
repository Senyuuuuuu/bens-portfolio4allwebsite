import { AgentType } from '@prisma/client';
import { BaseAgent } from './BaseAgent';
import { MapsDiscoveryAgent } from './MapsDiscoveryAgent';
import { WebsiteAuditAgent } from './WebsiteAuditAgent';
import { FacebookAnalysisAgent } from './FacebookAnalysisAgent';
import { BusinessBIAgent } from './BusinessBIAgent';
import { WebsiteGeneratorAgent } from './WebsiteGeneratorAgent';
import { ScreenshotAgent } from './ScreenshotAgent';
import { OutreachAgent } from './OutreachAgent';
import { CRMAgent } from './CRMAgent';
import { AnalyticsAgent } from './AnalyticsAgent';
import { logger } from '../services/logger.service';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, BaseAgent> = new Map();

  private constructor() {}

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  async initialize(): Promise<void> {
    const agentDefs: Array<{ id: string; name: string; type: AgentType; AgentClass: new () => BaseAgent }> = [
      { id: 'maps-discovery', name: 'Google Maps Discovery Agent', type: AgentType.MAPS_DISCOVERY, AgentClass: MapsDiscoveryAgent },
      { id: 'website-audit', name: 'Website Audit Agent', type: AgentType.WEBSITE_AUDIT, AgentClass: WebsiteAuditAgent },
      { id: 'facebook-analysis', name: 'Facebook Analysis Agent', type: AgentType.FACEBOOK_ANALYSIS, AgentClass: FacebookAnalysisAgent },
      { id: 'business-bi', name: 'Business Intelligence Agent', type: AgentType.BUSINESS_BI, AgentClass: BusinessBIAgent },
      { id: 'website-generator', name: 'AI Website Generator', type: AgentType.WEBSITE_GENERATOR, AgentClass: WebsiteGeneratorAgent },
      { id: 'screenshot-agent', name: 'Screenshot Agent', type: AgentType.SCREENSHOT_AGENT, AgentClass: ScreenshotAgent },
      { id: 'outreach-agent', name: 'Personalized Outreach Agent', type: AgentType.OUTREACH_AGENT, AgentClass: OutreachAgent },
      { id: 'crm-agent', name: 'CRM Agent', type: AgentType.CRM_AGENT, AgentClass: CRMAgent },
      { id: 'analytics-agent', name: 'Analytics Agent', type: AgentType.ANALYTICS, AgentClass: AnalyticsAgent },
    ];

    for (const def of agentDefs) {
      const agent = new def.AgentClass();
      this.agents.set(def.id, agent);
    }

    logger.info(`✅ Initialized ${this.agents.size} AI agents in AgentRegistry`);
  }

  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  getAgentByType(type: AgentType): BaseAgent | undefined {
    return Array.from(this.agents.values()).find((a) => a.type === type);
  }

  getAllStatuses(): ReturnType<BaseAgent['getStatus']>[] {
    return Array.from(this.agents.values()).map((a) => a.getStatus());
  }
}
