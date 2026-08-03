const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // System Status
  status: () => request<Record<string, unknown>>('/api/status'),
  health: () => request<{ status: string }>('/health'),

  // Agents
  agents: {
    list: () => request<{ agents: AgentStatus[] }>('/api/agents'),
    status: (id: string) => request<AgentStatus>(`/api/agents/${id}/status`),
    logs: (id: string, limit = 100) => request<{ logs: AgentLog[] }>(`/api/agents/${id}/logs?limit=${limit}`),
    start: (id: string) => request<{ success: boolean }>(`/api/agents/${id}/start`, { method: 'POST' }),
    stop: (id: string) => request<{ success: boolean }>(`/api/agents/${id}/stop`, { method: 'POST' }),
    restart: (id: string) => request<{ success: boolean }>(`/api/agents/${id}/restart`, { method: 'POST' }),
    execute: (id: string, input: Record<string, unknown>) =>
      request<{ jobId: string }>(`/api/agents/${id}/execute`, { method: 'POST', body: JSON.stringify(input) }),
  },

  // Google Maps Search
  maps: {
    search: (category: string, location: string, limit = 10) =>
      request<{ jobId: string }>('/api/maps/search', { method: 'POST', body: JSON.stringify({ category, location, limit }) }),
  },

  // Business Analysis & Audit
  business: {
    analyze: (leadId: string) =>
      request<{ jobId: string }>('/api/business/analyze', { method: 'POST', body: JSON.stringify({ leadId }) }),
  },

  facebook: {
    analyze: (leadId: string) =>
      request<{ jobId: string }>('/api/facebook/analyze', { method: 'POST', body: JSON.stringify({ leadId }) }),
  },

  // Website Audit & Generator
  website: {
    audit: (leadId: string) =>
      request<{ jobId: string }>('/api/website/audit', { method: 'POST', body: JSON.stringify({ leadId }) }),
    generate: (leadId: string) =>
      request<{ jobId: string }>('/api/website/generate', { method: 'POST', body: JSON.stringify({ leadId }) }),
    get: (slug: string) =>
      request<GeneratedWebsite>(`/api/website/${slug}`),
  },

  // Screenshots
  screenshots: {
    generate: (leadId: string) =>
      request<{ jobId: string }>('/api/screenshots', { method: 'POST', body: JSON.stringify({ leadId }) }),
  },

  // Outreach Drafts
  outreach: {
    generate: (leadId: string) =>
      request<{ jobId: string }>('/api/outreach', { method: 'POST', body: JSON.stringify({ leadId }) }),
    drafts: (status?: string) =>
      request<{ drafts: OutreachDraft[] }>(`/api/outreach/drafts${status ? `?status=${status}` : ''}`),
    approve: (id: string) =>
      request<{ success: boolean; draft: OutreachDraft }>(`/api/outreach/${id}/approve`, { method: 'POST' }),
  },

  // CRM Pipeline
  crm: {
    updateStage: (leadId: string, stage: string, notes?: string) =>
      request<{ success: boolean; lead: BusinessLead }>('/api/crm/update', { method: 'POST', body: JSON.stringify({ leadId, stage, notes }) }),
  },

  // Leads
  leads: {
    list: (params?: { stage?: string; category?: string; search?: string; priority?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.stage) q.set('stage', params.stage);
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      if (params?.priority) q.set('priority', params.priority);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      return request<{ leads: BusinessLead[]; total: number; page: number }>(`/api/leads?${q}`);
    },
    get: (id: string) => request<BusinessLead>(`/api/leads/${id}`),
  },

  // Jobs
  jobs: {
    list: (params?: { status?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      return request<{ jobs: Job[]; total: number; queueStats: QueueStats }>(`/api/jobs?${q}`);
    },
    get: (id: string) => request<Job>(`/api/jobs/${id}`),
    cancel: (id: string) => request<{ success: boolean }>(`/api/jobs/${id}/cancel`, { method: 'POST' }),
    retry: (id: string) => request<{ newJobId: string }>(`/api/jobs/${id}/retry`, { method: 'POST' }),
  },

  // Settings
  settings: {
    list: () => request<{ settings: Setting[] }>('/api/settings'),
    set: (key: string, value: string, category?: string, encrypted?: boolean) =>
      request<{ setting: Setting }>('/api/settings', { method: 'POST', body: JSON.stringify({ key, value, category, encrypted }) }),
    delete: (key: string) => request<{ success: boolean }>(`/api/settings/${key}`, { method: 'DELETE' }),
  },

  // Analytics
  analytics: {
    summary: () => request<{ summary: Record<string, unknown> }>('/api/analytics/summary'),
  },

  // Logs
  logs: (params?: { level?: string; agentId?: string; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.level) q.set('level', params.level);
    if (params?.agentId) q.set('agentId', params.agentId);
    if (params?.limit) q.set('limit', String(params.limit));
    return request<{ logs: LogEntry[] }>(`/api/logs?${q}`);
  },
};

// Types
export interface AgentStatus {
  id: string; name: string; type: string; status: string;
  currentJob: string | null; memoryMb: number; cpuPercent: number;
  tokensUsed: number; startTime: string | null; uptime: number | null;
}

export interface AgentLog {
  level: string; message: string; timestamp: string; meta?: Record<string, unknown>;
}

export interface BusinessLead {
  id: string; name: string; category: string; rating?: number; reviewCount: number;
  phone?: string; email?: string; website?: string; facebookUrl?: string; address?: string;
  hasWebsite: boolean; leadScore: number; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  pipelineStage: 'QUALIFIED' | 'WEBSITE_AUDITED' | 'WEBSITE_GENERATED' | 'OUTREACH_DRAFTED' | 'OUTREACH_SENT' | 'INTERESTED' | 'MEETING_SCHEDULED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  notes?: string; createdAt: string; updatedAt: string;
  audit?: WebsiteAudit; social?: SocialProfile; intelligence?: BusinessIntelligence;
  websiteDemos?: GeneratedWebsite[]; screenshots?: Screenshot[]; outreachDrafts?: OutreachDraft[];
}

export interface WebsiteAudit {
  id: string; leadId: string; hasSsl: boolean; isMobileFriendly: boolean; loadTimeMs: number;
  seoScore: number; qualityScore: number; hasBooking: boolean; hasContactForm: boolean;
  missingFeatures: string[]; createdAt: string;
}

export interface SocialProfile {
  id: string; leadId: string; platform: string; pageUrl?: string; followerCount: number;
  postCount: number; hasPhotoAssets: boolean; bioSummary?: string; createdAt: string;
}

export interface BusinessIntelligence {
  id: string; leadId: string; summary: string; services: string[]; brandStyle?: string;
  colorPalette: string[]; targetAudience?: string; improvements: string[]; createdAt: string;
}

export interface GeneratedWebsite {
  id: string; leadId: string; title: string; slug: string; templateName: string;
  htmlCode: string; cssCode: string; jsCode: string; reactCode: string;
  previewUrl?: string; exportZipPath?: string; version: number; createdAt: string;
}

export interface Screenshot {
  id: string; leadId: string; viewport: 'DESKTOP' | 'TABLET' | 'MOBILE' | 'HERO';
  imagePath: string; imageUrl?: string; createdAt: string;
}

export interface OutreachDraft {
  id: string; leadId: string; channel: 'EMAIL' | 'FACEBOOK_MSG' | 'LINKEDIN_MSG' | 'SMS';
  subject?: string; bodyText: string; status: 'DRAFT' | 'APPROVED' | 'SENT' | 'REJECTED';
  approvedAt?: string; sentAt?: string; createdAt: string; lead?: BusinessLead;
}

export interface Job {
  id: string; type: string; status: string; priority: number;
  progress: number; input?: Record<string, unknown>; output?: Record<string, unknown>;
  error?: string; startedAt?: string; completedAt?: string; duration?: number;
  agentId?: string; agent?: { name: string }; createdAt: string;
}

export interface QueueStats {
  waiting: number; active: number; completed: number; failed: number; delayed: number;
}

export interface Setting { id: string; key: string; value: string; category?: string; encrypted: boolean; }