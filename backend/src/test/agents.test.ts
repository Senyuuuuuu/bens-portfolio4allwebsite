import { AgentRegistry } from '../agents/AgentRegistry';
import { AgentType, AgentStatus } from '@prisma/client';

describe('AI Agents & AgentRegistry Suite', () => {
  let registry: AgentRegistry;

  beforeAll(async () => {
    registry = AgentRegistry.getInstance();
    await registry.initialize();
  });

  test('AgentRegistry should initialize all 10 agents', () => {
    const agents = registry.getAllAgents();
    expect(agents.length).toBe(10);
  });

  test('All 10 expected agent IDs should be present', () => {
    const expectedIds = [
      'trend-hunter',
      'research-agent',
      'downloader',
      'transcriber',
      'clip-detector',
      'video-editor',
      'caption-agent',
      'thumbnail-agent',
      'publisher',
      'analytics-agent',
    ];

    for (const id of expectedIds) {
      const agent = registry.getAgent(id);
      expect(agent).toBeDefined();
      expect(agent?.id).toBe(id);
    }
  });

  test('Agent statuses should default to IDLE', () => {
    const statuses = registry.getAllStatuses();
    expect(statuses.length).toBe(10);
    for (const s of statuses) {
      expect(s.status).toBe(AgentStatus.IDLE);
      expect(s.tokensUsed).toBeGreaterThanOrEqual(0);
      expect(s.memoryMb).toBeGreaterThanOrEqual(0);
    }
  });

  test('Starting and stopping an agent updates status', async () => {
    const agent = registry.getAgent('trend-hunter');
    expect(agent).toBeDefined();

    await agent?.start();
    expect(agent?.getStatus().status).toBe(AgentStatus.RUNNING);

    await agent?.stop();
    expect(agent?.getStatus().status).toBe(AgentStatus.STOPPED);

    await agent?.restart();
    expect(agent?.getStatus().status).toBe(AgentStatus.RUNNING);

    await agent?.stop();
  });

  test('getAgentByType returns correct agent', () => {
    const downloader = registry.getAgentByType(AgentType.DOWNLOADER);
    expect(downloader).toBeDefined();
    expect(downloader?.id).toBe('downloader');
  });
});
