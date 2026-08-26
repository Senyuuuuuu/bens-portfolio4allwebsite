import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message = '', tier = 'Enterprise' } = body;
    const normalized = message.toLowerCase();

    // Realistic 2000ms delay to simulate n8n + Vector RAG + LLM execution
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const execId = 'exec_' + Math.random().toString(36).substring(2, 10);
    const ticketId = 'TICK-' + Math.floor(100000 + Math.random() * 900000);

    if (normalized.includes('billing') || normalized.includes('invoice') || normalized.includes('charge') || normalized.includes('refund')) {
      return NextResponse.json({
        status: 'success',
        workflow: 'n8n-customer-support-v1',
        executionId: execId,
        timestamp: new Date().toISOString(),
        ticket: {
          id: ticketId,
          sentiment: 'neutral_inquiry',
          priority: 'P2-Medium',
          category: 'Billing & Invoicing',
          tier,
          status: 'RESOLVED'
        },
        ragSources: [
          {
            document: 'Enterprise Billing & Refund Policy v2.4',
            relevanceScore: 0.96,
            snippet: 'All recurring enterprise subscriptions reset monthly on the 1st. Invoices are automatically adjusted for prorated seat changes.'
          },
          {
            document: 'Stripe Payment Gateway Integration SOP',
            relevanceScore: 0.89,
            snippet: 'Refund requests processed within 3 business days are credited directly to the original payment method.'
          }
        ],
        aiResolution: {
          output: `I have reviewed your account and recent billing history. The recent line item reflects your upgraded enterprise automation seat quota activated earlier this month. Your next statement will automatically apply your promotional credit discount.`,
          confidenceScore: 0.97,
          suggestedActions: [
            'Download Itemized Invoice PDF',
            'Manage Stripe Payment Methods',
            'Schedule Call with Billing Concierge'
          ]
        },
        telemetry: {
          webhookLatencyMs: 28,
          ragLatencyMs: 165,
          llmLatencyMs: 1780,
          totalExecutionMs: 1973,
          tokensUsed: 426
        }
      });
    }

    if (normalized.includes('api') || normalized.includes('token') || normalized.includes('webhook') || normalized.includes('endpoint')) {
      return NextResponse.json({
        status: 'success',
        workflow: 'n8n-customer-support-v1',
        executionId: execId,
        timestamp: new Date().toISOString(),
        ticket: {
          id: ticketId,
          sentiment: 'technical_inquiry',
          priority: 'P1-High',
          category: 'API & Webhook Infrastructure',
          tier,
          status: 'RESOLVED'
        },
        ragSources: [
          {
            document: 'n8n Webhook Authentication Guide v3.1',
            relevanceScore: 0.98,
            snippet: 'API tokens can be rotated dynamically via the developer settings console or authenticated via Bearer headers in your n8n HTTP Request node.'
          },
          {
            document: 'Rate Limiting & Concurrency Architecture',
            relevanceScore: 0.91,
            snippet: 'Default production quota is 5,000 requests/minute with automated exponential backoff on HTTP 429.'
          }
        ],
        aiResolution: {
          output: `Your webhook endpoints are currently active and passing health checks. If you are rotating your security secret, update the Header Auth credential in your n8n workflow canvas under node credentials.`,
          confidenceScore: 0.99,
          suggestedActions: [
            'Rotate API Keys in Portal',
            'Inspect n8n Execution Logs',
            'Download Postman Collection'
          ]
        },
        telemetry: {
          webhookLatencyMs: 22,
          ragLatencyMs: 140,
          llmLatencyMs: 1620,
          totalExecutionMs: 1782,
          tokensUsed: 390
        }
      });
    }

    // Default Fallback
    return NextResponse.json({
      status: 'success',
      workflow: 'n8n-customer-support-v1',
      executionId: execId,
      timestamp: new Date().toISOString(),
      ticket: {
        id: ticketId,
        sentiment: 'positive_general',
        priority: 'P3-Normal',
        category: 'General AI Automation Support',
        tier,
        status: 'RESOLVED'
      },
      ragSources: [
        {
          document: 'Autonomous AI Orchestration Knowledge Base',
          relevanceScore: 0.92,
          snippet: 'JARVIS autonomous workflows monitor queues 24/7, routing complex edge cases directly to designated slack escalation channels.'
        }
      ],
      aiResolution: {
        output: `Your message has been processed through the n8n RAG pipeline. The autonomous agent synthesized your request against active system knowledge bases with high confidence.`,
        confidenceScore: 0.95,
        suggestedActions: [
          'Explore Workflow Architecture',
          'Download n8n JSON Export',
          'Book Discovery Call'
        ]
      },
      telemetry: {
        webhookLatencyMs: 31,
        ragLatencyMs: 155,
        llmLatencyMs: 1810,
        totalExecutionMs: 1996,
        tokensUsed: 382
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Mock Webhook Error', details: String(error) },
      { status: 500 }
    );
  }
}
