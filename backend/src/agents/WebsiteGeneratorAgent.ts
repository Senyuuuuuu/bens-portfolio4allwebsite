import { BaseAgent } from './BaseAgent';
import { AgentType, PipelineStage } from '@prisma/client';
import { prisma } from '../index';

export class WebsiteGeneratorAgent extends BaseAgent {
  constructor(id = 'website-generator', name = 'AI Website Generator', type = AgentType.WEBSITE_GENERATOR) {
    super(id, name, type);
  }

  async execute(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { leadId } = input;
    if (!leadId) throw new Error('leadId is required for WebsiteGeneratorAgent');

    const lead = await prisma.businessLead.findUnique({
      where: { id: leadId as string },
      include: { intelligence: true, audit: true },
    });
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    this.log('info', `🎨 Generating AI Demo Website for: ${lead.name}...`);

    const primaryColor = lead.intelligence?.colorPalette[1] || '#0d9488';
    const secondaryColor = lead.intelligence?.colorPalette[2] || '#38bdf8';
    const slug = `${lead.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-demo`;

    // Generate responsive HTML/Tailwind demo code
    const htmlCode = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lead.name} — Premium ${lead.category}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .bg-brand-primary { background-color: ${primaryColor}; }
    .text-brand-primary { color: ${primaryColor}; }
    .border-brand-primary { border-color: ${primaryColor}; }
    .bg-brand-secondary { background-color: ${secondaryColor}; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased">

  <!-- Navigation -->
  <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center font-bold text-white shadow-lg">
        ${lead.name.charAt(0)}
      </div>
      <span className="font-bold text-lg text-white tracking-tight">${lead.name}</span>
    </div>
    <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
      <a href="#about" className="hover:text-white transition">About</a>
      <a href="#services" className="hover:text-white transition">Services</a>
      <a href="#testimonials" className="hover:text-white transition">Reviews</a>
      <a href="#contact" className="hover:text-white transition">Contact</a>
    </div>
    <a href="#booking" className="px-5 py-2.5 rounded-xl bg-brand-primary hover:opacity-90 font-semibold text-sm text-white transition shadow-lg">
      Book Appointment
    </a>
  </nav>

  <!-- Hero Section -->
  <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-xs font-medium mb-6">
      ★ ${lead.rating || 4.8} Stars (${lead.reviewCount || 150}+ Reviews)
    </div>
    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
      Experience Excellence at <br/><span className="text-brand-primary">${lead.name}</span>
    </h1>
    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
      Your premier destination for exceptional ${lead.category.toLowerCase()} services in ${lead.address || 'the area'}. Dedicated to comfort, quality, and total satisfaction.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#booking" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-primary font-bold text-white shadow-xl hover:opacity-90 transition">
        Reserve Your Spot Online
      </a>
      <a href="tel:${lead.phone || '+15550000000'}" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 transition border border-slate-700">
        📞 ${lead.phone || 'Call Us Directly'}
      </a>
    </div>
  </section>

  <!-- Services Grid -->
  <section id="services" className="py-20 px-6 bg-slate-900/50 border-t border-slate-800">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Our Signature Services</h2>
        <p className="text-slate-400 text-sm mt-2">Tailored experiences designed for your needs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${(lead.intelligence?.services || ['Premium VIP Service', 'Custom Care Package', 'Express Online Booking']).map((s: string, i: number) => `
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60 hover:border-slate-600 transition group">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xl mb-4">
              0${i + 1}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">${s}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Top tier service delivered with precision, attention to detail, and unmatched professionalism.</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact & Location -->
  <section id="contact" className="py-20 px-6 max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Visit ${lead.name} Today</h2>
        <p className="text-slate-400 text-sm mb-6">We are conveniently located to serve you better.</p>
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center gap-3">📍 ${lead.address || 'Local Region'}</div>
          <div className="flex items-center gap-3">📞 ${lead.phone || '+1 (555) 123-4567'}</div>
          <div className="flex items-center gap-3">✉️ ${lead.email || 'contact@business.com'}</div>
        </div>
      </div>
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Book Your Appointment</h3>
        <form className="space-y-4" onsubmit="event.preventDefault(); alert('Booking submitted!');">
          <input type="text" placeholder="Your Name" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500" />
          <input type="email" placeholder="Your Email Address" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500" />
          <button type="submit" className="w-full py-3.5 rounded-xl bg-brand-primary font-bold text-white shadow-lg hover:opacity-90 transition">
            Confirm Instant Booking
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer className="py-8 text-center text-slate-500 text-xs border-t border-slate-800">
    © ${new Date().getFullYear()} ${lead.name}. All rights reserved. Demo created by AI Website Studio.
  </footer>
</body>
</html>`;

    const website = await prisma.generatedWebsite.create({
      data: {
        leadId: lead.id,
        title: `${lead.name} — AI Demo Website`,
        slug,
        templateName: 'Modern Glassmorphic Business',
        htmlCode,
        cssCode: `/* Brand Primary: ${primaryColor} */`,
        jsCode: 'console.log("Demo loaded");',
        reactCode: `export default function Website() { return (${htmlCode.replace(/class=/g, 'className=')}); }`,
        previewUrl: `http://localhost:3000/website-preview/${slug}`,
        version: 1,
      },
    });

    await prisma.businessLead.update({
      where: { id: lead.id },
      update: { pipelineStage: PipelineStage.WEBSITE_GENERATED },
    });

    this.log('success', `✨ AI Demo Website generated for ${lead.name}! Preview URL: http://localhost:3000/website-preview/${slug}`);
    this.updateTokens(680);
    return { leadId: lead.id, websiteId: website.id, slug, previewUrl: website.previewUrl };
  }

  protected async onStop(): Promise<void> {
    this.log('info', 'AI Website Generator Agent stopped');
  }
}
