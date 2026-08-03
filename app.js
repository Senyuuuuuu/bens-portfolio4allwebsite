/* ═══════════════════════════════════════════════
   JARVIS — AI Operating System | Core Engine
   ═══════════════════════════════════════════════ */

'use strict';

// ── AGENT DATA ──────────────────────────────────
const AGENTS = [
    // Development
    { id:'ceo',       name:'CEO Agent',         role:'Chief Executive Officer',     dept:'strategy',    icon:'👑', color:'#FACC15', tasks:['Strategic Roadmap Q3','Investor Brief'], status:'working' },
    { id:'pm',        name:'Project Manager',   role:'Project Orchestration',       dept:'strategy',    icon:'📋', color:'#38BDF8', tasks:['Sprint Planning','Risk Assessment'], status:'working' },
    { id:'frontend',  name:'Frontend Engineer', role:'React & Next.js Expert',      dept:'development', icon:'💻', color:'#00E5FF', tasks:['Alpha App UI components','Dashboard widgets'], status:'working' },
    { id:'backend',   name:'Backend Engineer',  role:'API & Database Architect',    dept:'development', icon:'🗄', color:'#8B5CF6', tasks:['REST API v2 endpoints','DB schema migration'], status:'processing' },
    { id:'react',     name:'React Expert',      role:'Component Architecture',      dept:'development', icon:'⚛', color:'#61DAFB', tasks:['Component library audit','State management'], status:'working' },
    { id:'nextjs',    name:'Next.js Expert',    role:'Full-Stack Rendering',        dept:'development', icon:'▲', color:'#F8FAFC', tasks:['SSR optimization','Route handlers'], status:'idle' },
    { id:'python',    name:'Python Engineer',   role:'Backend & AI Scripting',      dept:'development', icon:'🐍', color:'#22C55E', tasks:['ML pipeline','Data processing scripts'], status:'working' },
    { id:'devops',    name:'DevOps Engineer',   role:'CI/CD & Infrastructure',      dept:'development', icon:'🔧', color:'#F97316', tasks:['Docker config','GitHub Actions pipeline'], status:'working' },
    { id:'deploy',    name:'Deploy Agent',      role:'Deployment & Rollouts',       dept:'development', icon:'🚀', color:'#10B981', tasks:['MetaShop v2 deploy','CDN cache purge'], status:'working' },
    { id:'testing',   name:'Testing Agent',     role:'Automated Test Runner',       dept:'development', icon:'🧪', color:'#A78BFA', tasks:['E2E test suite','Coverage analysis'], status:'idle' },
    { id:'qa',        name:'QA Agent',          role:'Quality Assurance',           dept:'development', icon:'✅', color:'#34D399', tasks:['Alpha App QA pass','Performance audit'], status:'working' },
    // Design
    { id:'ui',        name:'UI Designer',       role:'Interface & Visual Design',   dept:'design',      icon:'🎨', color:'#EC4899', tasks:['Design system tokens','Component library'], status:'working' },
    { id:'ux',        name:'UX Designer',       role:'User Experience Research',    dept:'design',      icon:'🖌', color:'#F472B6', tasks:['User journey maps','Usability audit'], status:'processing' },
    { id:'graphic',   name:'Graphic Designer',  role:'Visual Assets & Media',       dept:'design',      icon:'🖼', color:'#C084FC', tasks:['Brand assets Q3','Social media kit'], status:'idle' },
    { id:'brand',     name:'Brand Designer',    role:'Brand Identity & Strategy',   dept:'design',      icon:'💎', color:'#818CF8', tasks:['TechFlow rebrand','Logo variants'], status:'working' },
    // Automation & Marketing
    { id:'automation',name:'Automation Eng.',  role:'n8n Workflow Architect',      dept:'automation',  icon:'⚙', color:'#FB923C', tasks:['Lead sync automation','Slack webhooks'], status:'working' },
    { id:'n8n',       name:'n8n Specialist',   role:'No-Code Integration Expert',  dept:'automation',  icon:'🔄', color:'#FF6B35', tasks:['CRM integration flow','Email sequences'], status:'processing' },
    { id:'seo',       name:'SEO Specialist',   role:'Search Engine Optimization',  dept:'strategy',    icon:'🔍', color:'#4ADE80', tasks:['Keyword research','Technical audit'], status:'working' },
    { id:'marketing', name:'Marketing Strategist', role:'Growth & Campaigns',      dept:'strategy',    icon:'📈', color:'#2DD4BF', tasks:['Q3 campaign strategy','Content calendar'], status:'idle' },
    // Operations
    { id:'sales',     name:'Sales Agent',      role:'Business Development',        dept:'operations',  icon:'💼', color:'#FCD34D', tasks:['Lead qualification','Proposal drafts'], status:'working' },
    { id:'research',  name:'Research Agent',   role:'Market & Tech Research',      dept:'operations',  icon:'🔬', color:'#67E8F9', tasks:['Competitor analysis','Tech trends'], status:'processing' },
    { id:'docs',      name:'Docs Writer',      role:'Technical Documentation',     dept:'operations',  icon:'📄', color:'#A3E635', tasks:['API documentation','User guides'], status:'idle' },
    { id:'support',   name:'Support Agent',    role:'Customer Success',            dept:'operations',  icon:'🎧', color:'#34D399', tasks:['Ticket #1247','FAQ updates'], status:'working' },
    { id:'finance',   name:'Finance Assistant', role:'Financial Operations',       dept:'operations',  icon:'💰', color:'#FACC15', tasks:['Monthly invoices','Expense reports'], status:'idle' },
    { id:'meeting',   name:'Meeting Assistant', role:'Calendar & Meeting Ops',     dept:'operations',  icon:'📅', color:'#60A5FA', tasks:['Schedule Q4 review','Meeting notes'], status:'idle' },
    { id:'database',  name:'Database Engineer', role:'Data Architecture',          dept:'development', icon:'🗃', color:'#F87171', tasks:['Index optimization','Query tuning'], status:'processing' },
];

const DEPT_LABELS = {
    strategy:    '🧠 Strategy & Leadership',
    development: '🏢 Development Studio',
    design:      '🎨 Design Studio',
    automation:  '⚙ Automation Factory',
    operations:  '💼 Operations',
};

const ACTIVITY_FEED = [
    { icon:'✅', text:'Frontend Agent completed Alpha App dashboard', time:'2m ago' },
    { icon:'🚀', text:'MetaShop v2.1 deployed to production', time:'5m ago' },
    { icon:'🧪', text:'Testing Agent ran 847 tests — 100% pass', time:'8m ago' },
    { icon:'🔄', text:'n8n Lead Capture flow triggered × 23', time:'10m ago' },
    { icon:'📋', text:'Project Manager updated TechFlow sprint', time:'12m ago' },
    { icon:'🎨', text:'Brand Designer exported TechFlow assets', time:'15m ago' },
    { icon:'🔍', text:'SEO Specialist published keyword report', time:'18m ago' },
    { icon:'💼', text:'Sales Agent qualified 3 new leads', time:'22m ago' },
];

const RUNNING_TASKS = [
    { dot:'#00E5FF', task:'Building Alpha App components', agent:'Frontend', pct:'78%' },
    { dot:'#8B5CF6', task:'Migrating DB schema v3 → v4', agent:'Backend', pct:'45%' },
    { dot:'#22C55E', task:'Deploying MetaShop to Vercel', agent:'DevOps', pct:'92%' },
    { dot:'#EC4899', task:'Designing TechFlow UI tokens', agent:'UI Designer', pct:'61%' },
    { dot:'#F97316', task:'n8n CRM sync workflow setup', agent:'n8n Specialist', pct:'33%' },
];

const MISSION_LOG = [
    { agent:'CEO', msg:'Assigned Alpha App delivery to PM', time:'00:01' },
    { agent:'PM', msg:'Sprint decomposed — 8 tasks created', time:'00:02' },
    { agent:'Frontend', msg:'Starting component scaffolding', time:'00:03' },
    { agent:'Backend', msg:'Schema migration in progress', time:'00:04' },
    { agent:'QA', msg:'Test suite ready — awaiting code freeze', time:'00:05' },
    { agent:'DevOps', msg:'CI/CD pipeline configured', time:'00:06' },
    { agent:'UI', msg:'Design tokens published to Figma', time:'00:07' },
    { agent:'Research', msg:'Competitor analysis complete', time:'00:08' },
];

// ── GEMINI CONFIG ─────────────────────────────────
const JARVIS_SYSTEM_PROMPT = `You are JARVIS — the executive AI Operating System for Apex Digital.
You talk like ChatGPT Advanced Voice Mode combined with JARVIS's executive warmth and British elegance.

Voice & Conversation Guidelines:
- Speak clearly, naturally, warmly, and gracefully in complete, fluid sentences.
- Never sound robotic, overly terse, or scripted. Speak like an intelligent co-founder having a fluid conversation.
- ALWAYS end every response with 1 to 2 proactive, helpful follow-up suggestions or next logical actions.
- Format responses to be spoken-word friendly: use clear phrasing, avoid lists with bullet characters, and avoid unpronounceable code dumps.
- Address the user as "Sir" occasionally with natural warmth.`;

function getGeminiKey() {
    const key = localStorage.getItem('jarvis_gemini_key');
    return key && !key.startsWith('AQ.') ? key : '';
}

function setGeminiKey(key) {
    localStorage.setItem('jarvis_gemini_key', key.trim());
}

// ── LOCAL OFFLINE INTELLIGENCE ENGINE (NO API KEY REQUIRED) ─────
function getJarvisLocalResponse(userMessage, conversationHistory = []) {
    const text = userMessage.toLowerCase().trim();

    // Navigation & Views
    if (text.includes('project') || text.includes('app')) {
        document.getElementById('nav-projects')?.click();
        return "Opening the Projects view, Sir. We currently have 8 active projects in the pipeline, including Alpha App at 78% completion and MetaShop v2.1 which has passed QA review. Would you like me to trigger the Vercel production deployment for MetaShop, or shall we inspect the Alpha App roadmap?";
    }
    if (text.includes('workforce') || text.includes('agent') || text.includes('team')) {
        document.getElementById('nav-workforce')?.click();
        return "Navigating to the AI Workforce directory, Sir. All 26 specialized agents are active across development, design, automation, sales, and operations. Would you like an operational status report from the Frontend agent, or shall I assign a new task to the team?";
    }
    if (text.includes('automation') || text.includes('n8n') || text.includes('workflow')) {
        document.getElementById('nav-automation')?.click();
        return "Opening the Automation Factory, Sir. Our 6 master n8n workflows have completed over 400 lead qualification and alert runs today with zero errors. Shall I trigger the Google Maps Lead Discovery intake, or review our database snapshot schedules?";
    }
    if (text.includes('mission') || text.includes('control')) {
        document.getElementById('nav-mission')?.click();
        return "Accessing Mission Control, Sir. All 26 node connections are live, active, and transmitting real-time telemetry. Would you like me to inspect node network latency, or highlight agents currently executing high-priority tasks?";
    }
    if (text.includes('analytics') || text.includes('metric') || text.includes('stat')) {
        document.getElementById('nav-analytics')?.click();
        return "Displaying Analytics and Revenue metrics, Sir. Current monthly recurring revenue is $124,800, with 340 engineering hours saved through automation this month. Shall I compile a downloadable executive breakdown, or review our Q3 trajectory goals?";
    }
    if (text.includes('crm') || text.includes('sales') || text.includes('lead')) {
        document.getElementById('nav-sales')?.click();
        return "Opening the Sales & Leads Pipeline, Sir. Leads Gorilla intake has qualified 3 HOT tier leads today including Smith Plumbing with an 85 scoring index. Would you like me to draft an automated outreach sequence for them, or sync their profiles with HubSpot?";
    }
    if (text.includes('setting') || text.includes('config') || text.includes('key')) {
        document.getElementById('nav-settings')?.click();
        return "Opening System Settings, Sir. Voice Chat is running in keyless local mode, completely ready for any voice command. Would you like to review active n8n webhooks, or configure a Gemini Cloud key for additional reasoning?";
    }
    if (text.includes('dev') || text.includes('code') || text.includes('repo')) {
        document.getElementById('nav-development')?.click();
        return "Opening the Development Studio, Sir. Active repository Alpha App is building smoothly with Next.js 15 App Router and React 19 Server Components. Shall I run an automated component optimization, or check our latest Vercel deployment logs?";
    }

    // Action Commands
    if (text.includes('deploy') || text.includes('publish') || text.includes('build')) {
        return "Initiating automated deployment for all QA-passed projects to Vercel, Sir. Build pipelines are actively compiling and telemetry looks nominal. Would you like me to monitor the build logs, or notify you once the deployment goes live?";
    }
    if (text.includes('backup') || text.includes('snapshot')) {
        return "Executing a full database snapshot and encrypted system backup, Sir. All configuration tokens and state logs have been secured. Would you like me to verify the storage checksums, or return to the main dashboard?";
    }
    if (text.includes('report') || text.includes('summary')) {
        return "Compiling the agency performance report, Sir. Monthly recurring revenue is up 18.4% and client satisfaction remains at 99.8%. Would you like me to read the key highlights, or email this report to your executive inbox?";
    }
    if (text.includes('meeting') || text.includes('schedule') || text.includes('calendar')) {
        return "I've logged a strategic team sync on your executive calendar for 14:00 today, Sir. Agenda topics include Q3 growth and n8n pipeline expansion. Would you like me to send reminders to the team, or draft meeting prep notes?";
    }

    // Status & Telemetry
    if (text.includes('status') || text.includes('health') || text.includes('system') || text.includes('diagnostic')) {
        return "All systems are fully nominal, Sir. All 26 AI agents are online with CPU load at 28%, memory at 54%, and zero active system errors. Would you like me to run a full diagnostic sweep across our n8n workflows, or review today's task queue?";
    }
    if (text.includes('revenue') || text.includes('mrr') || text.includes('money') || text.includes('finance') || text.includes('earn')) {
        return "Monthly recurring revenue is standing at $124,800 across 24 active agency clients, Sir, pacing smoothly toward our Q3 goal of $180,000. Would you like a breakdown of top revenue accounts like E-Com Global and Nexus Corp, or shall we check new sales pipeline opportunities?";
    }
    if (text.includes('client') || text.includes('customer')) {
        return "We currently manage 24 active agency clients with an average health score of 94 out of 100, Sir. Nexus Corp and E-Com Global represent our largest active accounts. Would you like me to display client onboarding files, or check recent support ticket resolutions?";
    }

    // Greetings & Identity
    if (text.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        return `${timeOfDay}, Sir. I am online, listening, and fully operational. Would you like a quick briefing on active projects, or shall we review today's sales pipeline?`;
    }
    if (text.includes('who are you') || text.includes('what are you') || text.includes('your name')) {
        return "I am JARVIS, the central AI Operating System for Apex Digital. I coordinate our 26 specialized AI agents, manage client acquisition, oversee Next.js web development, and automate agency operations, Sir. Would you like to inspect our active workforce, or launch a new project?";
    }
    if (text.includes('what can you do') || text.includes('help') || text.includes('capabilities')) {
        return "I can manage your 26 AI agents, trigger n8n workflows, deploy web applications to Vercel, track revenue, and optimize business processes via voice commands, Sir. Would you like me to demonstrate an automated workflow, or show our current project dashboard?";
    }
    if (text.includes('thank') || text.includes('thanks') || text.includes('great job')) {
        return "It is always a pleasure to assist, Sir. Would you like me to standby for your next instruction, or review our system metrics?";
    }
    if (text.includes('who created you') || text.includes('who built you') || text.includes('creator')) {
        return "I was designed as the central AI command system for Apex Digital, Sir, engineered to automate agency growth and scale software development. Shall we review our active agent architecture?";
    }

    // Intelligent Topic Synthesizer
    if (text.includes('marketing') || text.includes('outreach')) {
        return "I've instructed the Outreach and Sales agents to review lead intake and optimize conversion sequences, Sir. Would you like to view our qualified leads, or run a new search?";
    }
    if (text.includes('design') || text.includes('ui') || text.includes('figma')) {
        return "The UI and Design agents are reviewing Figma tokens and styling specifications, Sir. All design system rules are synced. Shall I open the Design Studio for you?";
    }
    if (text.includes('security') || text.includes('auth') || text.includes('ssl')) {
        return "Security protocols are active, Sir. All endpoints are protected with SSL, token rotation, and firewall isolation. Would you like me to generate a security telemetry log?";
    }

    // Default polite JARVIS persona fallback with suggestions
    return `Right away, Sir. I've logged your request regarding "${userMessage}" and dispatched our AI workforce to process it. All metrics remain nominal. Would you like me to monitor progress in Mission Control, or prepare a summary report for you?`;
}

async function askGemini(userMessage, conversationHistory = []) {
    const apiKey = getGeminiKey();
    if (!apiKey) {
        return getJarvisLocalResponse(userMessage, conversationHistory);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const contents = [];
    for (const turn of conversationHistory.slice(-8)) {
        contents.push({ role: turn.role === 'jarvis' ? 'model' : 'user', parts: [{ text: turn.content }] });
    }
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const body = {
        system_instruction: { parts: [{ text: JARVIS_SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 400,
        }
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            console.warn('Gemini API request failed with status:', res.status, '— Using Local Engine fallback.');
            return getJarvisLocalResponse(userMessage, conversationHistory);
        }
        const data = await res.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (responseText) return responseText;
        return getJarvisLocalResponse(userMessage, conversationHistory);
    } catch (e) {
        console.warn('Gemini API fetch error — Using Local Engine fallback:', e);
        return getJarvisLocalResponse(userMessage, conversationHistory);
    }
}

// Conversation memory shared between voice and chat
const CONVERSATION_HISTORY = [];

function addToHistory(role, content) {
    CONVERSATION_HISTORY.push({ role, content });
    if (CONVERSATION_HISTORY.length > 20) CONVERSATION_HISTORY.shift();
}

// ── PARTICLE SYSTEM ──────────────────────────────
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const particles = Array.from({length: 80}, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.4 + 0.1,
    }));

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,229,255,${p.a * 0.4})`;
            ctx.fill();
        });

        // Neural connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,229,255,${0.04 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
}

// ── SPHERE ANIMATION ───────────────────────────────────
// NOTE: Replaced by JarvisOrb in jarvis-hud.js
function initSphere() {
    // JarvisOrb in jarvis-hud.js handles the canvas arc reactor rendering.
    // This function is intentionally a no-op to avoid conflicts.
}

// ── HERO PARTICLES ───────────────────────────────
function initHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 4 + 1;
        Object.assign(p.style, {
            position: 'absolute',
            width: size + 'px', height: size + 'px',
            borderRadius: '50%',
            background: Math.random() > 0.5 ? 'rgba(0,229,255,0.6)' : 'rgba(139,92,246,0.5)',
            left: (Math.random() * 100) + '%',
            top:  (Math.random() * 100) + '%',
            animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
            boxShadow: `0 0 ${size * 3}px currentColor`,
        });
        container.appendChild(p);
    }
}

// ── CLOCK ────────────────────────────────────────
function initClock() {
    const el = document.getElementById('topbar-clock');
    function tick() {
        const d = new Date();
        el.textContent = d.toLocaleTimeString('en-US', { hour12: false });
    }
    tick();
    setInterval(tick, 1000);
}

// ── SYSTEM HEALTH ANIMATION ──────────────────────
function animateSystemHealth() {
    const metrics = [
        { bar: 'cpu-bar', val: 'cpu-val', base: 25, range: 30 },
        { bar: 'mem-bar', val: 'mem-val', base: 50, range: 20 },
        { bar: 'gpu-bar', val: 'gpu-val', base: 15, range: 25 },
    ];
    setInterval(() => {
        metrics.forEach(m => {
            const pct = Math.round(m.base + Math.random() * m.range);
            const bar = document.getElementById(m.bar);
            const val = document.getElementById(m.val);
            if (bar) bar.style.width = pct + '%';
            if (val) val.textContent = pct + '%';
        });
    }, 2500);
}

// ── LIVE AGENT ACTIVITY ──────────────────────────
function renderLiveActivity() {
    const el = document.getElementById('live-activity-list');
    if (!el) return;
    const shown = AGENTS.filter(a => a.status !== 'idle').slice(0, 8);
    el.innerHTML = shown.map(a => {
        const pct = Math.round(30 + Math.random() * 60);
        return `
        <div class="agent-activity-item">
            <div class="agent-av agent-av-ring" style="background:rgba(${hexToRgb(a.color)},0.1);border-color:${a.color};--agent-c:${a.color}">${a.icon}</div>
            <div class="agent-info">
                <div class="agent-name-row">
                    <span class="agent-status-dot"></span>
                    ${a.name}
                </div>
                <div class="agent-task-row">${a.tasks[0]}</div>
            </div>
            <div class="agent-progress-wrap" style="--agent-c:${a.color}">
                <div class="agent-progress-mini"><div class="agent-progress-fill" style="width:${pct}%"></div></div>
                <span class="agent-pct">${pct}%</span>
            </div>
        </div>`;
    }).join('');
}

// ── ACTIVITY FEED ────────────────────────────────
function renderActivityFeed() {
    const el = document.getElementById('activity-feed');
    if (!el) return;
    el.innerHTML = ACTIVITY_FEED.map(f => `
        <div class="feed-item">
            <span class="feed-icon">${f.icon}</span>
            <span class="feed-text">${f.text}</span>
            <span class="feed-time">${f.time}</span>
        </div>
    `).join('');
}

// Add new feed item periodically
function startLiveFeed() {
    const newItems = [
        { icon:'🤖', text:'n8n Specialist triggered Lead Capture × 5' },
        { icon:'⚡', text:'Automation saved 3.2 hours automatically' },
        { icon:'📊', text:'Analytics Agent compiled weekly metrics' },
        { icon:'💬', text:'Support Agent resolved ticket #1248' },
        { icon:'🔐', text:'DevOps Agent rotated API keys automatically' },
        { icon:'📱', text:'Mobile App build triggered by Frontend Agent' },
    ];
    let idx = 0;
    setInterval(() => {
        const el = document.getElementById('activity-feed');
        if (!el) return;
        const item = newItems[idx % newItems.length];
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.innerHTML = `<span class="feed-icon">${item.icon}</span><span class="feed-text">${item.text}</span><span class="feed-time">just now</span>`;
        el.prepend(div);
        if (el.children.length > 12) el.lastChild.remove();
        idx++;
    }, 5000);
}

// ── RUNNING TASKS LIST ───────────────────────────
function renderRunningTasks() {
    const el = document.getElementById('running-tasks-list');
    if (!el) return;
    el.innerHTML = RUNNING_TASKS.map(t => `
        <div class="rt-item">
            <div class="rt-dot" style="background:${t.dot}"></div>
            <div class="rt-body">
                <div class="rt-task">${t.task}</div>
                <div class="rt-agent">${t.agent}</div>
            </div>
            <span class="rt-pct">${t.pct}</span>
        </div>
    `).join('');
}

// ── WORKFORCE VIEW ───────────────────────────────
function renderWorkforce() {
    const el = document.getElementById('departments-grid');
    if (!el) return;

    const grouped = {};
    AGENTS.forEach(a => {
        if (!grouped[a.dept]) grouped[a.dept] = [];
        grouped[a.dept].push(a);
    });

    el.innerHTML = Object.entries(grouped).map(([dept, agents]) => `
        <div class="dept-section" data-dept="${dept}">
            <div class="dept-label">${DEPT_LABELS[dept] || dept}</div>
            <div class="agents-row">
                ${agents.map(a => renderAgentCard(a)).join('')}
            </div>
        </div>
    `).join('');

    // Click events
    el.querySelectorAll('.agent-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.agentId;
            openAgentModal(AGENTS.find(a => a.id === id));
        });
    });
}

function renderAgentCard(a) {
    const pct = Math.round(20 + Math.random() * 70);
    const statusClass = a.status === 'working' ? 'working' : a.status === 'processing' ? 'processing' : 'idle';
    const statusLabel = a.status === 'working' ? '● WORKING' : a.status === 'processing' ? '⟳ PROCESSING' : '○ IDLE';
    return `
        <div class="agent-card" data-agent-id="${a.id}" style="--agent-color:${a.color}">
            <div class="ac-avatar">
                ${a.icon}
                <div class="working-indicator ${a.status !== 'idle' ? 'active' : 'idle'}"></div>
            </div>
            <div class="ac-name">${a.name}</div>
            <div class="ac-role">${a.role}</div>
            <span class="ac-status ${statusClass}">${statusLabel}</span>
            <div class="ac-task">${a.tasks[0]}</div>
            <div class="ac-progress"><div class="fill" style="width:${pct}%"></div></div>
        </div>
    `;
}

// ── AGENT MODAL ──────────────────────────────────
function openAgentModal(agent) {
    if (!agent) return;
    const backdrop = document.getElementById('agent-modal-backdrop');
    const content = document.getElementById('modal-content');
    const pct = Math.round(30 + Math.random() * 60);
    const cpu = Math.round(10 + Math.random() * 50);
    const mem = Math.round(20 + Math.random() * 40);

    content.innerHTML = `
        <div class="modal-agent-header">
            <div class="modal-avatar" style="border-color:${agent.color};background:rgba(${hexToRgb(agent.color)},0.1)">${agent.icon}</div>
            <div>
                <div class="modal-agent-name">${agent.name}</div>
                <div class="modal-agent-role">${agent.role}</div>
                <span class="modal-agent-dept">${DEPT_LABELS[agent.dept] || agent.dept}</span>
            </div>
        </div>
        <div class="modal-stats-row">
            <div class="modal-stat">
                <div class="modal-stat-val" style="color:${agent.color}">${pct}%</div>
                <div class="modal-stat-label">Progress</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-val">${cpu}%</div>
                <div class="modal-stat-label">CPU Usage</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-val">${mem}%</div>
                <div class="modal-stat-label">Memory</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-val" style="color:#22C55E">99.8%</div>
                <div class="modal-stat-label">Uptime</div>
            </div>
        </div>
        <div class="modal-section-title">CURRENT TASKS</div>
        ${agent.tasks.map(t => `<div class="feed-item"><span class="feed-icon">⚡</span><span class="feed-text">${t}</span></div>`).join('')}
        <div class="modal-section-title">AGENT LOG</div>
        <div class="modal-log">[${new Date().toLocaleTimeString()}] Agent initialized\n[${new Date().toLocaleTimeString()}] Task "${agent.tasks[0]}" assigned\n[${new Date().toLocaleTimeString()}] Processing...\n[${new Date().toLocaleTimeString()}] Tools active: 3\n[${new Date().toLocaleTimeString()}] Collaborating with connected agents</div>
        <div class="modal-section-title">CONNECTED AGENTS</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
            ${AGENTS.slice(0,3).map(a => `<span style="padding:3px 8px;border-radius:99px;font-size:0.62rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:var(--text-muted)">${a.icon} ${a.name}</span>`).join('')}
        </div>
    `;
    backdrop.classList.add('open');
}

function closeModal() {
    document.getElementById('agent-modal-backdrop').classList.remove('open');
}

// ── MISSION CONTROL ──────────────────────────────
function renderMissionControl() {
    const nodesEl = document.getElementById('mission-nodes');
    if (!nodesEl) return;

    const positions = [
        { x: 50, y: 12 },
        { x: 20, y: 30 }, { x: 50, y: 30 }, { x: 80, y: 30 },
        { x: 15, y: 55 }, { x: 35, y: 55 }, { x: 55, y: 55 }, { x: 75, y: 55 },
        { x: 25, y: 80 }, { x: 50, y: 80 }, { x: 75, y: 80 },
    ];

    const shown = AGENTS.slice(0, positions.length);
    nodesEl.innerHTML = shown.map((a, i) => {
        const pos = positions[i];
        const isActive = a.status !== 'idle';
        return `
            <div class="mission-node" style="left:${pos.x}%;top:${pos.y}%" data-agent-id="${a.id}">
                <div class="mission-node-avatar ${isActive ? 'active' : ''}" style="border-color:${a.color};background:rgba(${hexToRgb(a.color)},0.08)">
                    ${a.icon}
                </div>
                <div class="mission-node-label">${a.name}</div>
                <div class="mission-node-status" style="color:${a.color}">${a.status.toUpperCase()}</div>
            </div>
        `;
    }).join('');

    // Mission Canvas connections
    initMissionCanvas(shown, positions);

    // Mission log
    const logEl = document.getElementById('mission-log-list');
    if (logEl) {
        logEl.innerHTML = MISSION_LOG.map(l => `
            <div class="mission-log-item">
                <span class="log-agent">[${l.agent}]</span> ${l.msg}
                <span class="log-time">${l.time}</span>
            </div>
        `).join('');
    }

    // Task queue
    const queueEl = document.getElementById('task-queue-list');
    if (queueEl) {
        const tasks = [
            { name:'Alpha App feature complete', agent:'Frontend', priority:'#00E5FF', status:'IN PROGRESS' },
            { name:'DB migration rollback plan', agent:'Backend', priority:'#EF4444', status:'QUEUED' },
            { name:'TechFlow design approval', agent:'UI Designer', priority:'#EC4899', status:'REVIEW' },
            { name:'Weekly SEO report publish', agent:'SEO Agent', priority:'#22C55E', status:'READY' },
            { name:'Client onboarding email', agent:'Sales Agent', priority:'#FACC15', status:'PENDING' },
        ];
        queueEl.innerHTML = tasks.map(t => `
            <div class="task-queue-item">
                <div class="tq-priority" style="background:${t.priority}"></div>
                <div class="tq-body">
                    <div class="tq-name">${t.name}</div>
                    <div class="tq-meta">${t.agent}</div>
                </div>
                <span class="tq-status" style="color:${t.priority}">${t.status}</span>
            </div>
        `).join('');
    }
}

function initMissionCanvas(agents, positions) {
    const canvas = document.getElementById('mission-canvas');
    if (!canvas) return;
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    const ctx = canvas.getContext('2d');

    // Draw animated connections
    const connections = [
        [0, 1], [0, 2], [0, 3],
        [1, 4], [2, 5], [2, 6], [3, 7],
        [4, 8], [5, 9], [7, 10],
    ];

    let t = 0;
    function drawConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        connections.forEach(([from, to]) => {
            if (from >= positions.length || to >= positions.length) return;
            const p1 = positions[from];
            const p2 = positions[to];
            const x1 = p1.x / 100 * canvas.width;
            const y1 = p1.y / 100 * canvas.height;
            const x2 = p2.x / 100 * canvas.width;
            const y2 = p2.y / 100 * canvas.height;

            // Base line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(0,229,255,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated data packet
            const progress = (t * 0.5 + from * 0.3) % 1;
            const px = x1 + (x2 - x1) * progress;
            const py = y1 + (y2 - y1) * progress;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,229,255,0.8)';
            ctx.fill();
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00E5FF';
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        t += 0.005;
        requestAnimationFrame(drawConnections);
    }
    drawConnections();
}

// ── NAVIGATION & VIEW RENDERERS ─────────────────
function initNav() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const views = document.querySelectorAll('.view');
    const breadcrumb = document.getElementById('breadcrumb-view');

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const viewId = item.dataset.view;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            const target = document.getElementById(`view-${viewId}`);
            if (target) target.classList.add('active');

            if (breadcrumb) breadcrumb.textContent = item.querySelector('.nav-label').textContent;

            // Render view-specific content
            if (viewId === 'workforce') renderWorkforce();
            else if (viewId === 'mission') renderMissionControl();
            else if (viewId === 'automation') renderAutomationView();
            else if (viewId === 'projects') renderProjectsView();
            else if (viewId === 'clients') renderClientsView();
            else if (viewId === 'crm') renderCrmView();
            else if (viewId === 'sales') renderSalesView();
            else if (viewId === 'development') renderDevView();
            else if (viewId === 'design') renderDesignView();
            else if (viewId === 'video') renderVideoView();
            else if (viewId === 'analytics') renderAnalyticsView();
            else if (viewId === 'knowledge') renderKnowledgeView();
            else if (viewId === 'memory') renderMemoryView();
            else if (viewId === 'notifications') renderNotificationsView();
            else if (viewId === 'settings') renderSettingsView();
        });
    });

    // Hero workforce button
    const wfBtn = document.getElementById('view-workforce-btn');
    if (wfBtn) {
        wfBtn.addEventListener('click', () => {
            document.getElementById('nav-workforce').click();
        });
    }
}

// ── WORKFORCE FILTER ─────────────────────────────
function initWorkforceFilter() {
    document.addEventListener('click', e => {
        if (!e.target.classList.contains('filter-pill')) return;
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        const dept = e.target.dataset.dept;
        document.querySelectorAll('.dept-section').forEach(s => {
            s.style.display = (dept === 'all' || s.dataset.dept === dept) ? '' : 'none';
        });
    });
}

// ── AUTOMATIONS RENDERER ────────────────────────
function renderAutomationView() {
    const el = document.getElementById('automation-grid');
    if (!el) return;
    const flows = [
        { name: 'Leads Gorilla → AI Qualifier → HubSpot', icon: '⚡', type: 'n8n Webhook', runs: '412 today', status: 'RUNNING', color: '#00E5FF' },
        { name: 'Client Onboarding Email Sequence', icon: '📧', type: 'n8n Cron / Gmail', runs: '18 active', status: 'RUNNING', color: '#22C55E' },
        { name: 'Salon Booking Availability Engine', icon: '💇', type: 'Google Sheets API', runs: '89 today', status: 'RUNNING', color: '#8B5CF6' },
        { name: 'Vercel Deployment Telemetry → Slack', icon: '🔔', type: 'Webhook', runs: '47 events', status: 'RUNNING', color: '#FACC15' },
        { name: 'Weekly Analytics & Revenue Report', icon: '📊', type: 'Cron Mon 8AM', runs: 'Scheduled', status: 'SCHEDULED', color: '#38BDF8' },
        { name: 'Database Snapshot → Google Drive', icon: '🗄', type: 'Cron Daily 2AM', runs: 'Scheduled', status: 'SCHEDULED', color: '#EC4899' },
    ];
    el.innerHTML = flows.map(f => `
        <div class="hud-card">
            <div class="hud-card-header">
                <span style="font-size:1.4rem">${f.icon}</span>
                <span class="hud-badge ${f.status === 'RUNNING' ? 'green' : 'cyan'}">${f.status}</span>
            </div>
            <div class="hud-card-title">${f.name}</div>
            <div class="hud-meta">${f.type} · ${f.runs}</div>
            <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:0.7rem;color:var(--text-muted)">ID: flow-${Math.floor(Math.random()*9000+1000)}</span>
                <button class="btn-ghost" style="padding:4px 10px;font-size:0.7rem" onclick="jarvisVoice?.speak('Executing workflow ${f.name.replace(/[^a-zA-Z0-9 ]/g,'')} now, Sir.');">Run Now ⚡</button>
            </div>
        </div>
    `).join('');
}

// ── PROJECTS RENDERER ───────────────────────────
function renderProjectsView() {
    const el = document.getElementById('projects-grid');
    if (!el) return;
    const projects = [
        { name: 'Alpha App', client: 'Nexus Corp', progress: 78, stack: 'Next.js 15, PostgreSQL', badge: 'IN DEV', color: '#00E5FF' },
        { name: 'MetaShop v2.1', client: 'E-Com Global', progress: 95, stack: 'React 19, Vercel, Tailwind', badge: 'QA PASS', color: '#22C55E' },
        { name: 'TechFlow UI System', client: 'TechFlow Inc', progress: 60, stack: 'Figma, Design Tokens, React', badge: 'DESIGN', color: '#8B5CF6' },
        { name: 'Salon Booking Backend', client: 'Luxe Salon', progress: 90, stack: 'n8n, Google Sheets API', badge: 'DEPLOYED', color: '#FACC15' },
        { name: 'LandingX Growth Engine', client: 'Apex Digital Internal', progress: 40, stack: 'Next.js, Tailwind v4', badge: 'BUILDING', color: '#EC4899' },
        { name: 'API v2 Gateway', client: 'CloudScale', progress: 85, stack: 'Node.js, Redis, Docker', badge: 'TESTING', color: '#38BDF8' },
    ];
    el.innerHTML = projects.map(p => `
        <div class="hud-card">
            <div class="hud-card-header">
                <span class="hud-card-title">${p.name}</span>
                <span class="hud-badge cyan">${p.badge}</span>
            </div>
            <div class="hud-meta">Client: <strong>${p.client}</strong></div>
            <div class="hud-meta" style="margin-top:2px">Stack: ${p.stack}</div>
            <div style="margin-top:16px">
                <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px">
                    <span style="color:var(--text-muted)">Completion</span>
                    <span style="font-weight:700;color:${p.color}">${p.progress}%</span>
                </div>
                <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
                    <div style="height:100%;width:${p.progress}%;background:${p.color}"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// ── CLIENTS RENDERER ─────────────────────────────
function renderClientsView() {
    const el = document.getElementById('clients-grid');
    if (!el) return;
    const clients = [
        { name: 'Nexus Corp', status: 'ACTIVE', mrr: '$24,000/mo', health: '98/100', color: '#22C55E', projects: 2 },
        { name: 'TechFlow Inc', status: 'ACTIVE', mrr: '$18,500/mo', health: '94/100', color: '#22C55E', projects: 1 },
        { name: 'E-Com Global', status: 'ACTIVE', mrr: '$32,000/mo', health: '91/100', color: '#22C55E', projects: 2 },
        { name: 'Luxe Salon Group', status: 'ACTIVE', mrr: '$8,500/mo', health: '89/100', color: '#22C55E', projects: 1 },
        { name: 'CloudScale Systems', status: 'ONBOARDING', mrr: '$16,000/mo', health: '85/100', color: '#FACC15', projects: 1 },
        { name: 'Vanguard Media', status: 'PROPOSAL', mrr: '$12,000/mo', health: '78/100', color: '#38BDF8', projects: 1 },
    ];
    el.innerHTML = clients.map(c => `
        <div class="hud-card">
            <div class="hud-card-header">
                <span class="hud-card-title">${c.name}</span>
                <span class="hud-badge green">${c.status}</span>
            </div>
            <div class="hud-stat-num" style="color:var(--cyan);font-size:1.3rem">${c.mrr}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
                <span class="hud-meta">Active Projects: ${c.projects}</span>
                <span style="font-size:0.75rem;font-weight:700;color:${c.color};background:rgba(34,197,94,0.1);padding:3px 8px;border-radius:99px">AI Health ${c.health}</span>
            </div>
        </div>
    `).join('');
}

// ── CRM RENDERER ─────────────────────────────────
function renderCrmView() {
    const el = document.getElementById('crm-pipeline-grid');
    if (!el) return;
    const stages = [
        { title: 'Discovery (3)', deals: [{ name: 'Apex Logistics', val: '$15,000', agent: 'Sales Agent' }] },
        { title: 'Proposal (2)', deals: [{ name: 'Vanguard Media', val: '$12,000', agent: 'CEO Agent' }] },
        { title: 'Negotiation (2)', deals: [{ name: 'CloudScale', val: '$16,000', agent: 'PM Agent' }] },
        { title: 'Closed Won (8)', deals: [{ name: 'Nexus Corp', val: '$24,000', agent: 'JARVIS Auto' }, { name: 'E-Com Global', val: '$32,000', agent: 'JARVIS Auto' }] },
    ];
    el.innerHTML = stages.map(s => `
        <div class="hud-card">
            <div class="hud-card-header">
                <span class="hud-card-title" style="font-size:0.85rem">${s.title}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px">
                ${s.deals.map(d => `
                    <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:10px">
                        <div style="font-weight:600;font-size:0.85rem">${d.name}</div>
                        <div style="color:var(--green);font-weight:700;font-size:0.9rem;margin-top:4px">${d.val}</div>
                        <div style="font-size:0.65rem;color:var(--text-muted);margin-top:4px">Owner: ${d.agent}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ── SALES & LEADS RENDERER ───────────────────────
function renderSalesView() {
    const el = document.getElementById('sales-dashboard-grid');
    if (!el) return;
    const leads = [
        { name: 'Smith Plumbing', city: 'Los Angeles', score: 85, tier: 'HOT', valueProp: 'AI-powered booking automation + Google Maps boost', status: 'Outreach Sent' },
        { name: 'Luxe Dental Care', city: 'Miami', score: 75, tier: 'HOT', valueProp: '24/7 AI Receptionist + Automated Follow-ups', status: 'Replied' },
        { name: 'Beacon Law Group', city: 'Chicago', score: 62, tier: 'WARM', valueProp: 'Retainer proposal generator & Lead Intake', status: 'Sequence Day 3' },
    ];
    el.innerHTML = leads.map(l => `
        <div class="hud-card">
            <div class="hud-card-header">
                <span class="hud-card-title">${l.name}</span>
                <span class="hud-badge ${l.tier === 'HOT' ? 'hot' : 'yellow'}">${l.tier} (${l.score}/90)</span>
            </div>
            <div class="hud-meta">Location: ${l.city} · Leads Gorilla Intake</div>
            <div style="margin-top:10px;font-size:0.78rem;color:var(--text-2);background:rgba(0,229,255,0.04);border-left:2px solid var(--cyan);padding:8px">
                <strong>Gemini AI Value Prop:</strong><br>${l.valueProp}
            </div>
            <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:0.7rem;color:var(--green)">HubSpot: Synced</span>
                <span class="hud-badge cyan">${l.status}</span>
            </div>
        </div>
    `).join('');
}

// ── DEV STUDIO RENDERER ──────────────────────────
function renderDevView() {
    const el = document.getElementById('dev-studio-grid');
    if (!el) return;
    el.innerHTML = `
        <div class="hud-card">
            <div class="hud-card-header">
                <span class="hud-card-title">👨‍💻 Active Repository: Alpha App (v2.4.0)</span>
                <span class="hud-badge green">BUILD PASSING</span>
            </div>
            <div style="font-family:var(--font-mono);font-size:0.75rem;background:#05070b;border-radius:10px;padding:14px;color:#a7f3d0;line-height:1.6">
                // Next.js 15 App Router + React 19 Server Components<br>
                const jarvisAgent = new AutonomousAgent({<br>
                &nbsp;&nbsp;name: "Frontend Engineer",<br>
                &nbsp;&nbsp;model: "gemini-2.0-flash",<br>
                &nbsp;&nbsp;telemetry: true<br>
                });<br>
                await jarvisAgent.optimizeUIComponents(); // 60 FPS achieved
            </div>
        </div>
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">Vercel Deployments</span></div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:0.78rem">
                <div style="display:flex;justify-content:space-between"><span>alpha-app.vercel.app</span><span style="color:var(--green)">● Live (2m ago)</span></div>
                <div style="display:flex;justify-content:space-between"><span>metashop-v2.vercel.app</span><span style="color:var(--green)">● Live (5m ago)</span></div>
                <div style="display:flex;justify-content:space-between"><span>landing-x.vercel.app</span><span style="color:var(--yellow)">⟳ Building</span></div>
            </div>
        </div>
    `;
}

// ── DESIGN STUDIO RENDERER ───────────────────────
function renderDesignView() {
    const el = document.getElementById('design-studio-grid');
    if (!el) return;
    const tokens = [
        { name: 'Electric Cyan', hex: '#00E5FF', use: 'Primary Accents & HUD Glow' },
        { name: 'Deep Nebula', hex: '#05070B', use: 'Primary Command BG' },
        { name: 'Space Purple', hex: '#8B5CF6', use: 'AI Intelligence Telemetry' },
    ];
    el.innerHTML = tokens.map(t => `
        <div class="hud-card">
            <div style="height:60px;background:${t.hex};border-radius:10px;margin-bottom:10px"></div>
            <div style="font-weight:700">${t.name}</div>
            <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--cyan);margin-top:2px">${t.hex}</div>
            <div class="hud-meta" style="margin-top:4px">${t.use}</div>
        </div>
    `).join('');
}

// ── VIDEO STUDIO RENDERER ────────────────────────
function renderVideoView() {
    const el = document.getElementById('video-studio-grid');
    if (!el) return;
    el.innerHTML = `
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">🎬 AI Video Generator</span><span class="hud-badge purple">READY</span></div>
            <p style="font-size:0.8rem;color:var(--text-2)">Create viral agency case studies, client demo shorts, and video summaries automatically.</p>
            <div style="margin-top:14px;display:flex;gap:10px">
                <button class="btn-primary" onclick="jarvisVoice?.speak('Generating AI video breakdown for client presentation now, Sir.');">Generate Campaign Video</button>
            </div>
        </div>
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">Render Queue</span></div>
            <div style="font-size:0.78rem;color:var(--text-muted)">No active render jobs in queue.</div>
        </div>
    `;
}

// ── ANALYTICS RENDERER ───────────────────────────
function renderAnalyticsView() {
    const el = document.getElementById('analytics-grid');
    if (!el) return;
    el.innerHTML = `
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">Agency Revenue Trajectory</span><span class="hud-badge green">+18.4%</span></div>
            <div class="hud-stat-num" style="color:var(--green)">$124,800 / mo</div>
            <div class="hud-meta">Target Q3: $180,000 / mo</div>
        </div>
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">AI Automation Efficiency</span><span class="hud-badge cyan">72% SAVINGS</span></div>
            <div class="hud-stat-num" style="color:var(--cyan)">340 Hours Saved</div>
            <div class="hud-meta">Equivalent to 2.1 full-time engineers</div>
        </div>
    `;
}

// ── KNOWLEDGE BASE RENDERER ──────────────────────
function renderKnowledgeView() {
    const el = document.getElementById('knowledge-grid');
    if (!el) return;
    const docs = [
        { title: 'JARVIS System Architecture', cat: 'ENGINEERING', size: '24 KB' },
        { title: 'Apex Digital Brand Guidelines 2026', cat: 'DESIGN', size: '42 KB' },
        { title: 'n8n Lead Intelligence Playbook', cat: 'AUTOMATION', size: '18 KB' },
        { title: 'Client Onboarding & SLA Specs', cat: 'OPERATIONS', size: '15 KB' },
    ];
    el.innerHTML = docs.map(d => `
        <div class="hud-card">
            <div class="hud-card-header">
                <span class="hud-badge purple">${d.cat}</span>
                <span style="font-size:0.7rem;color:var(--text-muted)">${d.size}</span>
            </div>
            <div class="hud-card-title" style="margin-top:6px">${d.title}</div>
            <div class="hud-meta" style="margin-top:8px">Semantic vector indexed</div>
        </div>
    `).join('');
}

// ── MEMORY RENDERER ──────────────────────────────
function renderMemoryView() {
    const el = document.getElementById('memory-grid');
    if (!el) return;
    const mems = [
        { title: 'Client Preference: TechFlow', text: 'Prefers dark minimal UI with Space Grotesk typography.' },
        { title: 'Production Stack Rule', text: 'All new web projects must use Next.js 15 App Router + Tailwind v4.' },
        { title: 'Salon Booking Logic', text: 'Check Google Sheets "Bookings" tab directly for availability, bypass Calendar.' },
    ];
    el.innerHTML = mems.map(m => `
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title" style="font-size:0.9rem">🧠 ${m.title}</span></div>
            <p style="font-size:0.78rem;color:var(--text-2);line-height:1.5">${m.text}</p>
        </div>
    `).join('');
}

// ── NOTIFICATIONS RENDERER ───────────────────────
function renderNotificationsView() {
    const el = document.getElementById('notifications-grid');
    if (!el) return;
    el.innerHTML = `
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">Live Alert Stream</span><span class="hud-badge cyan">REAL-TIME</span></div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">
                <div style="padding:10px;background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;border-radius:6px;font-size:0.8rem">
                    <strong>MetaShop v2.1 Deployed:</strong> Production deployment completed cleanly by DevOps Agent (2m ago).
                </div>
                <div style="padding:10px;background:rgba(250,204,21,0.06);border-left:3px solid #facc15;border-radius:6px;font-size:0.8rem">
                    <strong>API Rate Warning:</strong> Gemini 2.0 Flash usage at 42% of daily quota (15m ago).
                </div>
                <div style="padding:10px;background:rgba(0,229,255,0.06);border-left:3px solid #00e5ff;border-radius:6px;font-size:0.8rem">
                    <strong>New Lead Qualified:</strong> Smith Plumbing scored 85/90 (HOT Tier) via Leads Gorilla webhook (32m ago).
                </div>
            </div>
        </div>
    `;
}

// ── SETTINGS RENDERER ────────────────────────────
function renderSettingsView() {
    const el = document.getElementById('settings-grid');
    if (!el) return;
    el.innerHTML = `
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">🔑 AI Model Config</span></div>
            <div style="font-size:0.8rem;color:var(--text-2);margin-bottom:12px">Gemini 2.0 Flash is currently active for JARVIS reasoning.</div>
            <button class="btn-primary" onclick="document.getElementById('api-key-btn')?.click()">Configure Gemini API Key</button>
        </div>
        <div class="hud-card">
            <div class="hud-card-header"><span class="hud-card-title">⚙ n8n Automation Engine</span></div>
            <div style="font-size:0.8rem;color:var(--text-2);margin-bottom:12px">Endpoint: https://n8n.srv1862735.hstgr.cloud</div>
            <button class="btn-ghost" onclick="window.open('https://n8n.srv1862735.hstgr.cloud','_blank')">Open n8n Instance ↗</button>
        </div>
    `;
}

// ── COMMAND PALETTE (⌘K) ─────────────────────────
function initCommandPalette() {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-palette-input');
    const results = document.getElementById('cmd-palette-results');
    const searchBar = document.getElementById('search-bar');
    if (!backdrop || !input || !results) return;

    const commands = [
        { name: 'Go to Dashboard', cat: 'NAVIGATION', action: () => document.getElementById('nav-dashboard')?.click() },
        { name: 'View AI Workforce / Agents', cat: 'NAVIGATION', action: () => document.getElementById('nav-workforce')?.click() },
        { name: 'Open Mission Control', cat: 'NAVIGATION', action: () => document.getElementById('nav-mission')?.click() },
        { name: 'Open Automation Factory', cat: 'NAVIGATION', action: () => document.getElementById('nav-automation')?.click() },
        { name: 'View Projects', cat: 'NAVIGATION', action: () => document.getElementById('nav-projects')?.click() },
        { name: 'View Sales & Leads Pipeline', cat: 'NAVIGATION', action: () => document.getElementById('nav-sales')?.click() },
        { name: 'Open Development Studio', cat: 'NAVIGATION', action: () => document.getElementById('nav-development')?.click() },
        { name: 'Open Settings', cat: 'NAVIGATION', action: () => document.getElementById('nav-settings')?.click() },
        { name: 'Trigger Voice Command ("Hey JARVIS")', cat: 'VOICE', action: () => document.getElementById('voice-trigger')?.click() },
        { name: 'Configure Gemini API Key', cat: 'SETTINGS', action: () => document.getElementById('api-key-btn')?.click() },
        { name: 'Deploy All Ready Projects', cat: 'ACTION', action: () => jarvisVoice?.processCommand('deploy all ready projects') },
        { name: 'Run Full System Backup', cat: 'ACTION', action: () => jarvisVoice?.processCommand('run a full system backup') },
    ];

    function openPalette() {
        backdrop.classList.add('active');
        input.value = '';
        renderResults('');
        input.focus();
    }

    function closePalette() {
        backdrop.classList.remove('active');
    }

    function renderResults(query) {
        const q = query.toLowerCase().trim();
        const filtered = commands.filter(c => c.name.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q));
        if (filtered.length === 0) {
            results.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.8rem">No matching commands found</div>`;
            return;
        }
        results.innerHTML = filtered.map((c, i) => `
            <div class="cmd-item ${i===0?'selected':''}" data-idx="${i}">
                <div class="cmd-item-left">
                    <span class="cmd-item-icon">⚡</span>
                    <span>${c.name}</span>
                </div>
                <span class="cmd-item-cat">${c.cat}</span>
            </div>
        `).join('');

        results.querySelectorAll('.cmd-item').forEach((el, idx) => {
            el.addEventListener('click', () => {
                closePalette();
                filtered[idx].action();
            });
        });
    }

    if (searchBar) searchBar.addEventListener('click', openPalette);
    input.addEventListener('input', e => renderResults(e.target.value));

    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('active')) closePalette();
            else openPalette();
        }
        if (e.key === 'Escape' && backdrop.classList.contains('active')) {
            closePalette();
        }
    });

    backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closePalette();
    });
}

// ── JARVIS VOICE INTERACTION SYSTEM ─────────────────────────────
class JarvisVoiceEngine {
    constructor() {
        this.state = 'STANDBY'; // STANDBY | LISTENING | THINKING | SPEAKING
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.wakeWords = [
            'hey jarvis', 'jarvis', 'hi jarvis', 'hello jarvis', 'okay jarvis', 'yo jarvis',
            'hey jarivs', 'jarivs', 'hi jarivs', 'hello jarivs', 'okay jarivs',
            'javis', 'hey javis', 'travis'
        ];
        this.lastGreetingIndex = -1;
        this.greetings = [
            "Yes, Sir?",
            "I'm listening, Sir.",
            "At your service, Sir.",
            "How may I assist you, Sir?",
            "What can I do for you today, Sir?",
            "Ready for your command, Sir."
        ];
        this.taskStartPhrases = [
            "I'll take care of that.",
            "One moment.",
            "Working on it.",
            "Allow me.",
            "I'm checking that now.",
            "Certainly."
        ];
        this.thinkingPhrases = [
            "I'm analysing the request.",
            "Reviewing the available information.",
            "One moment while I process that.",
            "I'm gathering the relevant details."
        ];
        this.completionPhrases = [
            "Done.",
            "Completed.",
            "Everything is ready.",
            "The task has been completed.",
            "I've finished."
        ];
        this.errorPhrases = [
            "It appears there was an issue.",
            "That didn't complete successfully.",
            "I'll try another approach.",
            "I'll need a bit more information."
        ];
        this.sessionMemory = {
            lastSubject: null,
            lastCommand: null,
            history: []
        };
        this.audioCtx = null;
        this.isMicActive = false;
        this.isListeningForCommand = false;
        this.commandTimeout = null;
    }

    init() {
        console.log('🎙 Initializing JARVIS Autonomous Voice Engine (Refined Persona & Wake Word Active)...');
        this.setupAudioContext();
        this.setupSpeechRecognition();
        this.updateUI();
    }

    detectWakeWord(text) {
        if (!text) return null;
        const lower = text.toLowerCase().trim();
        
        for (const ww of this.wakeWords) {
            if (lower.includes(ww)) return ww;
        }

        const match = lower.match(/\b(hey|hi|hello|okay|yo)?\s*(jarvis|jarivs|javis|jarvises)\b/i);
        if (match) return match[0];

        return null;
    }

    setupAudioContext() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.audioCtx = new AudioCtx();
        } catch(e) {
            console.warn('AudioContext initialization note:', e);
        }
    }

    playActivationChime() {
        try {
            if (!this.audioCtx) this.setupAudioContext();
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            if (!this.audioCtx) return;

            const now = this.audioCtx.currentTime;
            const osc1 = this.audioCtx.createOscillator();
            const osc2 = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';
            osc1.frequency.setValueAtTime(520, now);
            osc2.frequency.setValueAtTime(780, now + 0.08);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc1.start(now);
            osc1.stop(now + 0.12);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.35);
        } catch(e) {}
    }

    setupSpeechRecognition() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            console.warn('SpeechRecognition API is not natively supported in this environment.');
            this.setCaption('SYSTEM', 'SpeechRecognition API unavailable in this browser environment.');
            return;
        }

        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-GB';

        this.recognition.onstart = () => {
            this.isMicActive = true;
            console.log('🎙 Microphone active — Listening for "Hey JARVIS" or "JARVIS"...');
            this.updateUI();
        };

        let _voiceDebounceTimer = null;
        this.recognition.onresult = (event) => {
            if (this.synthesis && this.synthesis.speaking) {
                this.synthesis.cancel();
                this.setState('LISTENING');
            }

            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript.toLowerCase().trim();
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript + ' ';
                }
            }

            const currentText = (finalTranscript || interimTranscript).trim();
            if (!currentText) return;

            clearTimeout(_voiceDebounceTimer);
            _voiceDebounceTimer = setTimeout(() => {
                this.setCaption('DIRECTOR', currentText);
            }, 100);

            // Check for Wake Word ('jarvis', 'hey jarvis', 'jarivs', 'hey jarivs')
            const detectedWakeWord = this.detectWakeWord(currentText);

            if (detectedWakeWord && this.state === 'STANDBY') {
                this.handleWakeWord(currentText, detectedWakeWord);
            } else if (this.isListeningForCommand && finalTranscript.trim()) {
                const innerWake = this.detectWakeWord(finalTranscript);
                if (innerWake) {
                    const wakeIdx = finalTranscript.toLowerCase().indexOf(innerWake.toLowerCase());
                    const cmdAfter = finalTranscript.slice(wakeIdx + innerWake.length).trim();
                    if (cmdAfter.length > 2) {
                        clearTimeout(_voiceDebounceTimer);
                        _voiceDebounceTimer = setTimeout(() => {
                            this.processCommand(cmdAfter);
                        }, 200);
                        return;
                    }
                }

                clearTimeout(_voiceDebounceTimer);
                _voiceDebounceTimer = setTimeout(() => {
                    this.processCommand(finalTranscript.trim());
                }, 200);
            }
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                this.setCaption('SYSTEM', 'Microphone permission denied.');
            }
        };

        this.recognition.onend = () => {
            if (this.isMicActive) {
                try { this.recognition.start(); } catch(e) {}
            }
        };

        try {
            this.recognition.start();
        } catch(e) {
            console.log('Mic auto-start queued:', e);
        }
    }

    getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12)  return "Good morning, Sir.";
        if (hour >= 12 && hour < 17) return "Good afternoon, Sir.";
        if (hour >= 17 && hour < 21) return "Good evening, Sir.";
        return "Good evening, Sir.";
    }

    getRandomGreeting() {
        let idx;
        do {
            idx = Math.floor(Math.random() * this.greetings.length);
        } while (idx === this.lastGreetingIndex && this.greetings.length > 1);
        this.lastGreetingIndex = idx;
        return this.greetings[idx];
    }

    handleWakeWord(fullText, wakeWord) {
        console.log(`⚡ Wake word detected: "${wakeWord}"`);
        this.playActivationChime();
        this.setState('LISTENING');

        const lowerFull = fullText.toLowerCase();
        const wakeIdx = lowerFull.indexOf(wakeWord.toLowerCase());
        const commandAfter = wakeIdx !== -1 ? fullText.slice(wakeIdx + wakeWord.length).trim() : "";

        if (commandAfter.length > 3) {
            this.processCommand(commandAfter);
        } else {
            this.isListeningForCommand = true;
            const hour = new Date().getHours();
            const timeOfDay = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
            const greeting = `${timeOfDay}, Sir. I am online and listening. How may I assist you?`;
            
            this.speak(greeting, () => {
                this.setState('LISTENING');
            });

            this._appendToChat(greeting);

            clearTimeout(this.commandTimeout);
            this.commandTimeout = setTimeout(() => {
                if (this.state === 'LISTENING') {
                    this.setState('STANDBY');
                }
            }, 10000);
        }
    }

    _appendToChat(text) {
        const messages = document.getElementById('jarvis-messages');
        if (!messages) return;
        const div = document.createElement('div');
        div.className = 'msg jarvis';
        div.innerHTML = `<div class="msg-content">${text}</div><div class="msg-time">Just now</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    async processCommand(rawCommand) {
        this.isListeningForCommand = false;
        clearTimeout(this.commandTimeout);
        console.log(`🎯 JARVIS Gemini Command: "${rawCommand}"`);

        this.setState('THINKING');
        addToHistory('user', rawCommand);

        // Show command in HUD comm panel
        if (window.hudShowUserMessage) hudShowUserMessage(rawCommand);

        // Quick navigation intents (instant, no API needed)
        const lower = rawCommand.toLowerCase();
        let navAction = null;
        if (lower.includes('open projects') || lower.match(/\bprojects\b/))
            navAction = () => document.getElementById('nav-projects')?.click();
        else if (lower.includes('workforce') || lower.includes('team') || lower.includes('agents'))
            navAction = () => document.getElementById('nav-workforce')?.click();
        else if (lower.includes('automation') || lower.includes('n8n') || lower.includes('workflow'))
            navAction = () => document.getElementById('nav-automation')?.click();
        else if (lower.includes('mission control'))
            navAction = () => document.getElementById('nav-mission')?.click();
        else if (lower.includes('analytics') || lower.includes('report'))
            navAction = () => document.getElementById('nav-analytics')?.click();
        else if (lower.includes('calendar') || lower.includes('schedule'))
            navAction = () => document.getElementById('nav-calendar')?.click();

        if (navAction) navAction();

        // Call Gemini for reasoning
        const responseText = await askGemini(rawCommand, CONVERSATION_HISTORY);
        addToHistory('jarvis', responseText);

        // Update chat panel with user message
        const messages = document.getElementById('jarvis-messages');
        if (messages) {
            const userDiv = document.createElement('div');
            userDiv.className = 'msg user';
            userDiv.innerHTML = `<div class="msg-content">${rawCommand}</div><div class="msg-time">just now</div>`;
            messages.appendChild(userDiv);

            // Stream JARVIS response
            const jarvisDiv = document.createElement('div');
            jarvisDiv.className = 'msg jarvis msg-streaming';
            const contentEl = document.createElement('div');
            contentEl.className = 'msg-content';
            const timeEl = document.createElement('div');
            timeEl.className = 'msg-time';
            timeEl.textContent = 'just now';
            jarvisDiv.appendChild(contentEl);
            jarvisDiv.appendChild(timeEl);
            messages.appendChild(jarvisDiv);
            messages.scrollTop = messages.scrollHeight;

            if (window.hudShowResponse) {
                hudShowResponse(responseText.slice(0, 120) + (responseText.length > 120 ? '...' : ''));
            }

            if (window.typeText) {
                typeText(contentEl, responseText, 20, () => {
                    jarvisDiv.classList.remove('msg-streaming');
                    messages.scrollTop = messages.scrollHeight;
                });
            } else {
                contentEl.textContent = responseText;
                jarvisDiv.classList.remove('msg-streaming');
            }
        }

        // Speak response
        this.speak(responseText, () => { this.setState('STANDBY'); });
    }

    sanitizeTextForSpeech(text) {
        if (!text) return "";
        return text
            .replace(/```[\s\S]*?```/g, "Code block omitted.")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\*\*([^*]+)\*\*/g, "$1")
            .replace(/\*([^*]+)\*/g, "$1")
            .replace(/#+\s*/g, "")
            .replace(/https?:\/\/\S+/g, "link")
            .replace(/\$([0-9,]+)k\b/gi, (m, p1) => `${p1} thousand dollars`)
            .replace(/\$([0-9,]+)\b/g, (m, p1) => `${p1.replace(/,/g, '')} dollars`)
            .replace(/\bv([0-9]+)\.([0-9]+)\b/gi, "version $1 point $2")
            .replace(/\bNext\.js\b/gi, "Next dot J S")
            .replace(/\bn8n\b/gi, "N 8 N")
            .replace(/[^a-zA-Z0-9\s.,'?!-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    speak(text, onComplete) {
        if (!this.synthesis) {
            if (onComplete) onComplete();
            return;
        }

        const cleanText = this.sanitizeTextForSpeech(text);
        if (!cleanText) {
            if (onComplete) onComplete();
            return;
        }

        this.synthesis.cancel();
        this.setState('SPEAKING');
        this.setCaption('JARVIS', cleanText);

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95; // Slightly slower, composed British cadence
        utterance.pitch = 0.95; // Calm, warm, deep, intelligent tone

        const voices = this.synthesis.getVoices();
        // Refined British Voice Selector: Prefer British English (en-GB) voices
        const britishVoice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en_GB' || v.name.includes('Google UK English Male') || v.name.includes('Oliver') || v.name.includes('Daniel') || v.name.includes('Arthur') || v.name.includes('George'));
        const fallbackEnglish = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Male')));

        if (britishVoice) {
            utterance.voice = britishVoice;
        } else if (fallbackEnglish) {
            utterance.voice = fallbackEnglish;
        }

        utterance.onend = () => {
            if (onComplete) {
                onComplete();
            } else {
                this.setState('STANDBY');
            }
        };

        utterance.onerror = () => {
            if (onComplete) {
                onComplete();
            } else {
                this.setState('STANDBY');
            }
        };

        this.synthesis.speak(utterance);
    }

    setState(newState) {
        this.state = newState;
        this.updateUI();
        // Sync with central HUD state machine
        if (window.JarvisHUD) {
            const hudMap = { STANDBY: 'IDLE', LISTENING: 'LISTENING', THINKING: 'PROCESSING', SPEAKING: 'SPEAKING' };
            const mappedState = hudMap[newState];
            if (mappedState) JarvisHUD.setState(mappedState);
        }
    }

    setCaption(speaker, text) {
        const speakerEl = document.getElementById('lv-speaker');
        const captionEl = document.getElementById('lv-caption');
        if (speakerEl) speakerEl.textContent = speaker ? `${speaker}:` : '';
        if (captionEl) captionEl.textContent = text;
    }

    updateUI() {
        const banner = document.getElementById('live-voice-banner');
        const dot = document.getElementById('lv-status-dot');
        const statusText = document.getElementById('lv-status-text');
        const overlay = document.getElementById('voice-overlay');
        const trigger = document.getElementById('voice-trigger');

        if (!banner || !dot || !statusText) return;

        banner.className = `live-voice-banner ${this.state.toLowerCase()}`;
        dot.className = `lv-status-dot ${this.state.toLowerCase()}`;

        if (this.state === 'STANDBY') {
            statusText.textContent = 'STANDBY — SAY "HEY JARVIS"';
            if (overlay) overlay.classList.remove('active');
            if (trigger) trigger.classList.remove('active');
        } else {
            if (overlay) overlay.classList.add('active');
            if (trigger) trigger.classList.add('active');

            if (this.state === 'LISTENING') {
                statusText.textContent = 'LISTENING...';
            } else if (this.state === 'THINKING') {
                statusText.textContent = 'THINKING...';
            } else if (this.state === 'SPEAKING') {
                statusText.textContent = 'JARVIS SPEAKING...';
            }
        }
    }
}

// Global Voice System Instance
let jarvisVoice = null;

function initVoiceSpectrum() {
    const canvas = document.getElementById('voice-spectrum-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function renderSpectrum() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bars = 24;
        const barWidth = 6;
        const gap = 6;
        const startX = (canvas.width - (bars * (barWidth + gap))) / 2;
        const state = jarvisVoice ? jarvisVoice.state : 'STANDBY';

        for (let i = 0; i < bars; i++) {
            let height = 6;
            if (state === 'LISTENING') {
                height = 10 + Math.sin(t * 8 + i * 0.5) * 16 + Math.cos(t * 4 + i * 0.3) * 10;
            } else if (state === 'SPEAKING') {
                height = 14 + Math.sin(t * 12 + i * 0.4) * 20 + Math.sin(t * 6 + i * 0.8) * 12;
            } else if (state === 'THINKING') {
                height = 8 + Math.sin(t * 15 + i) * 6;
            }

            const x = startX + i * (barWidth + gap);
            const y = (canvas.height - height) / 2;

            const gradient = ctx.createLinearGradient(0, y, 0, y + height);
            gradient.addColorStop(0, '#00e5ff');
            gradient.addColorStop(1, '#8b5cf6');

            ctx.fillStyle = gradient;
            ctx.shadowBlur = state !== 'STANDBY' ? 10 : 0;
            ctx.shadowColor = '#00e5ff';
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, barWidth, height, 3);
            } else {
                ctx.rect(x, y, barWidth, height);
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        t += 0.05;
        requestAnimationFrame(renderSpectrum);
    }
    renderSpectrum();
}

function initVoice() {
    jarvisVoice = new JarvisVoiceEngine();
    jarvisVoice.init();
    initVoiceSpectrum();

    const trigger = document.getElementById('voice-trigger');
    const overlay = document.getElementById('voice-overlay');
    const closeBtn = document.getElementById('voice-close');

    if (trigger) trigger.addEventListener('click', () => {
        if (jarvisVoice) {
            if (jarvisVoice.state !== 'STANDBY') {
                jarvisVoice.setState('STANDBY');
            } else {
                jarvisVoice.handleWakeWord("hey jarvis", "hey jarvis");
            }
        }
    });
    if (closeBtn) closeBtn.addEventListener('click', () => {
        if (jarvisVoice) jarvisVoice.setState('STANDBY');
    });
    if (overlay) overlay.addEventListener('click', e => {
        if (e.target === overlay && jarvisVoice) jarvisVoice.setState('STANDBY');
    });
}

// ── JARVIS CHAT (Gemini-powered) ─────────────────
function initJarvisChat() {
    const input = document.getElementById('jarvis-input');
    const sendBtn = document.getElementById('jarvis-send');
    const messages = document.getElementById('jarvis-messages');
    const statusBadge = document.getElementById('jarvis-status');

    function appendMessage(text, from, isTyping = false) {
        const div = document.createElement('div');
        div.className = `msg ${from}${isTyping ? ' typing-indicator' : ''}`;
        div.innerHTML = `<div class="msg-content">${text}</div><div class="msg-time">just now</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Sound cue on send
        if (window.JarvisSounds) JarvisSounds.playClick();

        appendMessage(text, 'user');
        input.value = '';
        input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        if (statusBadge) statusBadge.textContent = 'ANALYZING...';

        // HUD comm panel: show user message
        if (window.hudShowUserMessage) hudShowUserMessage(text);

        // Update state machine
        if (window.JarvisHUD) JarvisHUD.setState('PROCESSING');

        // Show animated typing indicator
        const typingEl = document.createElement('div');
        typingEl.className = 'msg jarvis typing-indicator';
        typingEl.innerHTML = `<div class="msg-content"><div class="processing-dots"><span></span><span></span><span></span></div><span class="processing-label">ANALYZING</span></div>`;
        messages.appendChild(typingEl);
        messages.scrollTop = messages.scrollHeight;

        addToHistory('user', text);
        const response = await askGemini(text, CONVERSATION_HISTORY);
        addToHistory('jarvis', response);

        typingEl.remove();

        // Create streaming message element
        const jarvisDiv = document.createElement('div');
        jarvisDiv.className = 'msg jarvis msg-streaming';
        const contentEl = document.createElement('div');
        contentEl.className = 'msg-content';
        const timeEl = document.createElement('div');
        timeEl.className = 'msg-time';
        timeEl.textContent = 'just now';
        jarvisDiv.appendChild(contentEl);
        jarvisDiv.appendChild(timeEl);
        messages.appendChild(jarvisDiv);
        messages.scrollTop = messages.scrollHeight;

        // Update state to SPEAKING
        if (window.JarvisHUD) JarvisHUD.setState('SPEAKING');
        if (statusBadge) statusBadge.textContent = 'RESPONDING';

        // Show response in HUD comm panel
        if (window.hudShowResponse) {
            hudShowResponse(response.slice(0, 120) + (response.length > 120 ? '...' : ''));
        }

        // Progressive text rendering
        const onTypingComplete = () => {
            jarvisDiv.classList.remove('msg-streaming');
            if (statusBadge) statusBadge.textContent = 'READY';
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            input.focus();
            if (window.JarvisHUD) JarvisHUD.setState('IDLE');
            messages.scrollTop = messages.scrollHeight;
        };

        if (window.typeText) {
            typeText(contentEl, response, 20, onTypingComplete);
        } else {
            contentEl.textContent = response;
            onTypingComplete();
        }

        // Also speak the response if voice is idle
        if (jarvisVoice && jarvisVoice.state === 'STANDBY') {
            jarvisVoice.speak(response);
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); });
}

// ── QUICK COMMANDS ───────────────────────────────
function initQuickCmds() {
    document.querySelectorAll('.quick-cmd').forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.dataset.cmd;
            const input = document.getElementById('jarvis-input');
            const triggers = {
                status: 'What is the system status?',
                deploy: 'Deploy all QA-ready projects now',
                report: 'Generate this week\'s performance report',
                agents: 'Give me an agent briefing',
                backup: 'Run a full system backup',
                meeting: 'Schedule a team meeting',
            };
            if (input && triggers[cmd]) {
                input.value = triggers[cmd];
                document.getElementById('jarvis-send')?.click();
            }
        });
    });
}

// ── MODAL CLOSE ──────────────────────────────────
function initModalClose() {
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('agent-modal-backdrop')?.addEventListener('click', e => {
        if (e.target.id === 'agent-modal-backdrop') closeModal();
    });
}

// ── KEYBOARD SHORTCUTS ───────────────────────────
function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        }
        if (e.key === 'Escape') {
            closeModal();
            document.getElementById('voice-overlay')?.classList.remove('active');
        }
    });
}

// ── COUNTER ANIMATIONS ───────────────────────────
function animateCounters() {
    function countUp(el, target, suffix = '') {
        if (!el) return;
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.round(current) + suffix;
            if (current >= target) clearInterval(timer);
        }, 20);
    }
    // Animate KPI values
    setTimeout(() => {
        document.getElementById('kpi-revenue') && (document.getElementById('kpi-revenue').style.opacity = '1');
    }, 500);
}

// ── LIVE TASK COUNTER ────────────────────────────
function startTaskCounter() {
    let count = 47;
    setInterval(() => {
        if (document.hidden) return; // pause when tab not visible
        const delta = Math.floor(Math.random() * 5) - 2;
        count = Math.max(30, Math.min(80, count + delta));
        requestAnimationFrame(() => {
            const el = document.getElementById('active-tasks-count');
            const badge = document.getElementById('tasks-count-badge');
            if (el) el.textContent = count;
            if (badge) badge.textContent = count;
        });
    }, 6000);
}

// ── UTILITY ─────────────────────────────────────
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

// ── MISSION LOG LIVE UPDATES ─────────────────────
function startMissionLogUpdates() {
    const entries = [
        { agent:'Frontend', msg:'Component alpha-dashboard compiled' },
        { agent:'Backend', msg:'API endpoint /v2/projects live' },
        { agent:'DevOps', msg:'Docker image built and pushed' },
        { agent:'QA', msg:'Test coverage at 94.2%' },
        { agent:'UI', msg:'Handoff to Frontend complete' },
        { agent:'n8n', msg:'Automation triggered 8 times' },
    ];
    let idx = 0;
    setInterval(() => {
        if (document.hidden) return; // pause when tab not visible
        const el = document.getElementById('mission-log-list');
        if (!el) return;
        const e = entries[idx % entries.length];
        const div = document.createElement('div');
        div.className = 'mission-log-item';
        const t = new Date();
        div.innerHTML = `<span class="log-agent">[${e.agent}]</span> ${e.msg}<span class="log-time">${t.toLocaleTimeString()}</span>`;
        requestAnimationFrame(() => {
            el.prepend(div);
            if (el.children.length > 12) el.lastChild.remove();
        });
        idx++;
    }, 5000);
}

// ── NEW PROJECT BUTTON ───────────────────────────
function initNewProject() {
    const btn = document.getElementById('new-project-btn');
    if (btn) btn.addEventListener('click', () => {
        const input = document.getElementById('jarvis-input');
        if (input) {
            input.value = 'Create a new project';
            input.focus();
        }
    });
}

// ── API KEY SETUP UI ─────────────────────────────
function initApiKeySetup() {
    // Inject key setup button into topbar
    const topbarRight = document.querySelector('.topbar-right');
    if (!topbarRight) return;

    const keyBtn = document.createElement('button');
    keyBtn.id = 'api-key-btn';
    keyBtn.title = 'Configure AI Model / Local Voice';
    keyBtn.style.cssText = `
        background: rgba(0,229,255,0.08); border: 1px solid rgba(0,229,255,0.25);
        color: var(--cyan, #00e5ff); border-radius: 8px; padding: 6px 10px;
        cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; gap: 5px;
        transition: all 0.2s; font-weight: 500;
    `;
    const hasKey = !!getGeminiKey();
    keyBtn.innerHTML = hasKey ? '🔑 GEMINI KEY' : '🎙 LOCAL VOICE ACTIVE';
    keyBtn.style.color = hasKey ? '#22c55e' : '#00e5ff';
    topbarRight.insertBefore(keyBtn, topbarRight.firstChild);

    // Modal
    const modal = document.createElement('div');
    modal.id = 'key-modal';
    modal.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.75); backdrop-filter:blur(8px);
        align-items:center; justify-content:center;
    `;
    modal.innerHTML = `
        <div style="background:#0f172a; border:1px solid rgba(0,229,255,0.25); border-radius:16px;
            padding:28px; width:440px; max-width:90vw; box-shadow:0 0 60px rgba(0,229,255,0.15)">
            <h3 style="color:#00e5ff; margin:0 0 10px; font-size:1.1rem; display:flex; align-items:center; gap:8px">
                🎙 JARVIS Engine Config
            </h3>
            
            <div style="background:rgba(0,229,255,0.08); border:1px solid rgba(0,229,255,0.25); border-radius:10px; padding:12px 14px; margin-bottom:18px; color:#38bdf8; font-size:0.8rem; line-height:1.45">
                <strong>✨ Voice Chat is 100% Active in Keyless Mode!</strong><br>
                JARVIS speaks and processes voice commands locally without needing any API key. You can optionally add a Gemini Cloud key below.
            </div>

            <p style="color:#94a3b8; font-size:0.8rem; margin:0 0 12px">
                Optional: Cloud Gemini API Key (get free at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#00e5ff">aistudio.google.com</a>)
            </p>

            <input id="key-input" type="password" placeholder="AIza... (Leave blank for Keyless Local Mode)"
                value="${getGeminiKey()}"
                style="width:100%; box-sizing:border-box; padding:12px 16px;
                    background:#1e293b; border:1px solid rgba(255,255,255,0.1);
                    border-radius:10px; color:#f1f5f9; font-size:0.85rem;
                    outline:none; font-family:monospace; margin-bottom:18px">

            <div style="display:flex; gap:10px; justify-content:space-between; align-items:center">
                <button id="key-use-local" style="padding:10px 14px; background:rgba(0,229,255,0.1);
                    border:1px solid rgba(0,229,255,0.3); color:#00e5ff;
                    border-radius:8px; cursor:pointer; font-size:0.8rem">Use Local Mode</button>
                <div style="display:flex; gap:8px">
                    <button id="key-cancel" style="padding:10px 16px; background:transparent;
                        border:1px solid rgba(255,255,255,0.1); color:#64748b;
                        border-radius:8px; cursor:pointer; font-size:0.8rem">Cancel</button>
                    <button id="key-save" style="padding:10px 20px; background:linear-gradient(135deg,#00e5ff,#8b5cf6);
                        border:none; color:#000; border-radius:8px; cursor:pointer;
                        font-weight:600; font-size:0.8rem">Save Config</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    keyBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    modal.querySelector('#key-cancel').addEventListener('click', () => { modal.style.display = 'none'; });
    
    modal.querySelector('#key-use-local').addEventListener('click', () => {
        setGeminiKey('');
        modal.querySelector('#key-input').value = '';
        keyBtn.innerHTML = '🎙 LOCAL VOICE ACTIVE';
        keyBtn.style.color = '#00e5ff';
        modal.style.display = 'none';
        
        const messages = document.getElementById('jarvis-messages');
        if (messages) {
            const div = document.createElement('div');
            div.className = 'msg jarvis';
            div.innerHTML = `<div class="msg-content">Voice Chat is running in Keyless Local Mode, Sir. All voice commands and systems are active.</div><div class="msg-time">just now</div>`;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            if (jarvisVoice) {
                jarvisVoice.speak("Voice Chat is running in Keyless Local Mode, Sir. All systems are operational.");
            }
        }
    });

    modal.querySelector('#key-save').addEventListener('click', () => {
        const val = modal.querySelector('#key-input').value.trim();
        setGeminiKey(val);
        if (val) {
            keyBtn.innerHTML = '🔑 GEMINI KEY';
            keyBtn.style.color = '#22c55e';
        } else {
            keyBtn.innerHTML = '🎙 LOCAL VOICE ACTIVE';
            keyBtn.style.color = '#00e5ff';
        }
        modal.style.display = 'none';
        
        const messages = document.getElementById('jarvis-messages');
        if (messages) {
            const div = document.createElement('div');
            div.className = 'msg jarvis';
            div.innerHTML = `<div class="msg-content">${val ? "Gemini Cloud connected, Sir." : "Keyless Local Engine active, Sir."} All voice commands ready.</div><div class="msg-time">just now</div>`;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            if (jarvisVoice) {
                jarvisVoice.speak(`${val ? "Gemini Cloud connected" : "Keyless Local Engine active"}, Sir.`);
            }
        }
    });
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
}

// ── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Background & visuals
    initBackground();
    initSphere();
    initHeroParticles();

    // Clock
    initClock();

    // Navigation
    initNav();
    initWorkforceFilter();

    // Data rendering
    renderLiveActivity();
    renderActivityFeed();
    renderRunningTasks();

    // Interactions
    initApiKeySetup();
    initCommandPalette();
    initVoice();
    initJarvisChat();
    initQuickCmds();
    initModalClose();
    initKeyboardShortcuts();
    initNewProject();

    // Animations & Live
    animateSystemHealth();
    animateCounters();
    startTaskCounter();
    startLiveFeed();

    // Delayed mission log (for when user navigates there)
    setTimeout(startMissionLogUpdates, 1000);

    // Sphere glow intensity is now handled by JarvisOrb in jarvis-hud.js
    // (removed duplicate tickSphereGlow)

    (function setHeroGreeting() {
        const el = document.getElementById('hero-greeting');
        if (!el) return;
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12)       el.textContent = 'Good morning';
        else if (hour >= 12 && hour < 17) el.textContent = 'Good afternoon';
        else                               el.textContent = 'Good evening';
    })();

    console.log('%c JARVIS AI Operating System — Initialized', 'color:#00E5FF;font-size:14px;font-weight:bold;');
    console.log('%c 26 Agents Online | All Systems Nominal', 'color:#22C55E;font-size:11px;');
});
