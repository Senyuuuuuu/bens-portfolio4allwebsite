import { BaseAgent } from './BaseAgent';
import { AgentType, Priority, PipelineStage } from '@prisma/client';
import { prisma } from '../index';

export class MapsDiscoveryAgent extends BaseAgent {
  constructor(id = 'maps-discovery', name = 'Google Maps Discovery Agent', type = AgentType.MAPS_DISCOVERY) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { category = 'Restaurant', location = 'New York, NY', limit = 10 } = input;
    this.log('info', `🔍 Searching Google Maps for '${category}' in '${location}'...`);

    // Simulated / API Discovery of Businesses
    const discoveredLeads = [
      {
        name: `Lakeside ${category} & Bar`,
        category: category as string,
        rating: 4.6,
        reviewCount: 128,
        phone: '+1 (555) 234-5678',
        email: `contact@lakeside${(category as string).toLowerCase().replace(/\s+/g, '')}.com`,
        website: Math.random() > 0.4 ? `https://www.lakeside${(category as string).toLowerCase().replace(/\s+/g, '')}.com` : null,
        facebookUrl: `https://facebook.com/lakeside${(category as string).toLowerCase().replace(/\s+/g, '')}`,
        address: `128 Waterfront Way, ${location}`,
        latitude: 40.7128,
        longitude: -74.0060,
        hasWebsite: Math.random() > 0.4,
      },
      {
        name: `Grand View ${category} Resort`,
        category: category as string,
        rating: 4.8,
        reviewCount: 245,
        phone: '+1 (555) 876-5432',
        email: `info@grandview${(category as string).toLowerCase().replace(/\s+/g, '')}.org`,
        website: null, // High priority lead without website
        facebookUrl: `https://facebook.com/grandview${(category as string).toLowerCase().replace(/\s+/g, '')}`,
        address: `450 Mountain Ridge Dr, ${location}`,
        latitude: 40.7306,
        longitude: -73.9352,
        hasWebsite: false,
      },
      {
        name: `Apex ${category} Center`,
        category: category as string,
        rating: 3.9,
        reviewCount: 42,
        phone: '+1 (555) 345-6789',
        email: `hello@apex${(category as string).toLowerCase().replace(/\s+/g, '')}.net`,
        website: `http://apex${(category as string).toLowerCase().replace(/\s+/g, '')}.old-site.com`, // Outdated website
        facebookUrl: null,
        address: `88 Central Ave, ${location}`,
        latitude: 40.7589,
        longitude: -73.9851,
        hasWebsite: true,
      },
    ];

    const savedLeads = [];
    for (const leadData of discoveredLeads) {
      // Calculate initial score & priority
      const leadScore = !leadData.hasWebsite ? 85 : (leadData.rating && leadData.rating < 4.0 ? 70 : 50);
      const priority = !leadData.hasWebsite ? Priority.HIGH : Priority.MEDIUM;

      const lead = await prisma.businessLead.create({
        data: {
          name: leadData.name,
          category: leadData.category,
          rating: leadData.rating,
          reviewCount: leadData.reviewCount,
          phone: leadData.phone,
          email: leadData.email,
          website: leadData.website,
          facebookUrl: leadData.facebookUrl,
          address: leadData.address,
          latitude: leadData.latitude,
          longitude: leadData.longitude,
          hasWebsite: leadData.hasWebsite,
          leadScore,
          priority,
          pipelineStage: PipelineStage.QUALIFIED,
        },
      });

      savedLeads.push(lead);
      this.log('success', `✨ Discovered business: ${lead.name} (Has Website: ${lead.hasWebsite ? 'Yes' : 'NO - High Priority'})`);
    }

    this.updateTokens(250);
    return { count: savedLeads.length, leads: savedLeads };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'Maps Discovery Agent stopped');
  }
}
