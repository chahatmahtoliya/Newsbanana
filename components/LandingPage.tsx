import React, { useState, useRef } from 'react';
import {
  Newspaper,
  Zap,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Film,
  Download,
  Shield,
  Move,
  Clock,
  ExternalLink,
  Sun,
  Moon,
  Monitor,
  Share2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Quote,
  Flame,
  Award
} from 'lucide-react';

interface LandingPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenStudio: (presetTemplateId?: string) => void;
}

const SHOWCASE_VIEWS = [
  {
    id: 'breaking-news',
    name: 'Breaking News Banner',
    caption: 'Urgent red banner with high-contrast alert headline and source badge',
    category: 'Urgent Alert',
    tagColor: 'bg-red-500 text-white',
    bgGradient: 'from-zinc-900 via-neutral-900 to-black',
    previewHeadline: 'MASSIVE DISCOVERY CONFIRMED BY SPACE RESEARCH TEAM',
    previewDesc: 'Scientists detect unprecedented signals from deep space, confirming long-held theoretical models.',
    source: 'GLOBAL NEWS WIRE',
    time: '2 MIN AGO',
    badge: 'BREAKING',
    type: 'banner',
    accentColor: '#EF4444'
  },
  {
    id: 'quote-card',
    name: 'Viral Quote Card',
    caption: 'Editorial serif typography with attribution badge and quotation watermark',
    category: 'Interview',
    tagColor: 'bg-amber-500 text-white',
    bgGradient: 'from-amber-950/40 via-stone-900 to-zinc-950',
    previewHeadline: '“The future belongs to creators who ship while others are still planning.”',
    previewDesc: 'Founder & Chief Editor addressing the annual digital journalism summit.',
    source: 'TECH INSIGHTS',
    time: 'EXCLUSIVE',
    badge: 'QUOTE',
    type: 'quote',
    accentColor: '#F59E0B'
  },
  {
    id: 'fact-check',
    name: 'Fact Check & Analysis',
    caption: 'Verified stamp with claim versus truth breakdown for high-credibility news',
    category: 'Investigation',
    tagColor: 'bg-emerald-500 text-white',
    bgGradient: 'from-emerald-950/40 via-zinc-900 to-black',
    previewHeadline: 'VERIFIED: NEW CLEAN ENERGY BILL PASSES WITH 84% APPROVAL',
    previewDesc: 'Official parliamentary audit disproves claims of budget deficit in initial renewable rollout.',
    source: 'POLICY AUDIT',
    time: 'VERIFIED TRUTH',
    badge: 'FACT CHECK',
    type: 'fact',
    accentColor: '#10B981'
  },
  {
    id: 'sports-score',
    name: 'Match & Sports Ticker',
    caption: 'Team logos, real-time score counter, and player stats in broadcast format',
    category: 'Sports Alert',
    tagColor: 'bg-sky-500 text-white',
    bgGradient: 'from-sky-950/40 via-zinc-900 to-black',
    previewHeadline: 'CHAMPIONSHIP FINAL: RIVALS CLINCH HISTORIC 3-2 COMEBACK',
    previewDesc: 'Stunning 89th-minute strike sends stadium into ecstasy after trailing by two goals.',
    source: 'SPORTS NETWORK',
    time: 'FULL TIME',
    badge: 'FINAL RESULT',
    type: 'sports',
    accentColor: '#0EA5E9'
  },
  {
    id: 'video-reel',
    name: '9:16 Vertical Reel',
    caption: 'Instagram Reel and TikTok motion format with animated progress bar',
    category: 'Social Video',
    tagColor: 'bg-violet-500 text-white',
    bgGradient: 'from-violet-950/40 via-zinc-900 to-black',
    previewHeadline: 'WHY THIS NEW AI HARDWARE IS SELLING OUT IN SECONDS',
    previewDesc: 'A 60-second deep dive into the unexpected engineering breakthrough.',
    source: 'SHORT REPORT',
    time: '0:45',
    badge: 'REEL MODE',
    type: 'reel',
    accentColor: '#8B5CF6'
  },
  {
    id: 'minimal-studio',
    name: 'Minimalist Studio',
    caption: 'Clean obsidian card with refined typography and subtle watermark logo',
    category: 'Editorial',
    tagColor: 'bg-zinc-700 text-white',
    bgGradient: 'from-zinc-900 via-neutral-900 to-black',
    previewHeadline: 'MARKET CLOSE: TECH INDICES SURGE PAST RECORD HIGHS',
    previewDesc: 'Strong quarterly earnings from semiconductor leaders trigger broad market rally.',
    source: 'FINANCIAL DESK',
    time: 'CLOSING BELL',
    badge: 'MARKET ALERT',
    type: 'minimal',
    accentColor: '#71717A'
  },
];

const FEATURES_LIST = [
  {
    icon: Layers,
    iconColor: 'text-emerald-500',
    title: 'Three Broadcast Aspect Ratios',
    description: 'Instant 1:1 square for Instagram & X, 16:9 widescreen for websites and YouTube, and 9:16 vertical for TikTok and Instagram Reels with one click.'
  },
  {
    icon: Film,
    iconColor: 'text-rose-500',
    title: 'Video Mode & Motion Audio',
    description: 'Turn static news into high-retention video stories with simulated audio bars, progress countdowns, and multi-image slideshow sequencing.'
  },
  {
    icon: Award,
    iconColor: 'text-amber-500',
    title: 'Custom Watermarks & Branding',
    description: 'Upload your channel or newsroom logo watermark. Resize from 40px to 220px, drag anywhere on the canvas, and save as your default identity.'
  },
  {
    icon: Shield,
    iconColor: 'text-sky-500',
    title: '100% Offline & Private',
    description: 'All canvas rendering, font rendering, and exports happen locally inside your browser. No scoops or unreleased drafts are ever uploaded to a server.'
  },
  {
    icon: Move,
    iconColor: 'text-violet-500',
    title: 'Real-Time Drag & Resize',
    description: 'Freely reposition headlines, descriptions, badges, and watermarks directly on the canvas with animated resize handles and automatic coordinate tracking.'
  },
  {
    icon: Zap,
    iconColor: 'text-orange-500',
    title: 'Instant 1-Second 4K Exports',
    description: 'Zero Photoshop subscriptions, zero render queues. Click Download and receive high-DPI crystal-clear PNGs and MP4s ready to post instantly.'
  },
];

const FAQ_ITEMS = [
  {
    q: 'What does Ncreative actually do?',
    a: 'Ncreative is a dedicated studio for digital journalists, content creators, and social media managers. It turns any headline, quote, or breaking alert into viral, branded news cards and 9:16 reels in seconds, eliminating the need for complex tools like Photoshop.'
  },
  {
    q: 'How fast is a graphic generation?',
    a: 'Under 10 seconds. You paste your headline, pick or customize your theme, drag elements where you want them, and export immediately. Everything renders in client-side GPU memory.'
  },
  {
    q: 'Can I export 9:16 video reels for Instagram and TikTok?',
    a: 'Yes. Switch to 9:16 vertical ratio and enable Video Mode. You can upload video backgrounds or multiple photos, and Ncreative renders an animated MP4 with broadcast progress indicators.'
  },
  {
    q: 'Do my pictures or headlines leave my computer?',
    a: 'No. Ncreative operates 100% client-side. The images you upload, the headlines you draft, and the exports you generate never leave your browser or touch an external server.'
  },
  {
    q: 'Can I use my own logo and brand colors?',
    a: 'Yes. Upload your PNG watermark, adjust its size, drag it to any corner or center position, and customize background colors, font families, and casing to match your brand guide.'
  },
  {
    q: 'Can I use Ncreative on mobile or tablets?',
    a: 'Yes. Ncreative is fully responsive with touch-optimized canvas drag-and-drop, mobile bottom bar, and full mobile upload support for reporters working in the field.'
  }
];

const GUIDES_LIST = [
  { title: 'Why breaking news cards get 8x more engagement', desc: 'The psychological impact of high-contrast news banners on social feeds' },
  { title: 'The anatomy of a viral quote card on X and LinkedIn', desc: 'Serif fonts, attribution placement, and the visual weight of speaker portraits' },
  { title: 'How to structure 9:16 news reels for maximum retention', desc: 'Hook pacing, lower-third safety zones, and subtitle readability' },
  { title: 'Setting up a 30-second newsroom publishing workflow', desc: 'How solo creators publish breaking alerts before major media outlets' },
  { title: 'Optimal aspect ratios and DPI settings for social platforms', desc: 'Resolution standards for 2026 across X, Instagram, Facebook, and Threads' }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenStudio
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoHeadline, setDemoHeadline] = useState('MAJOR BREAKING STORY PUBLISHED IN SECONDS');
  const [demoCategory, setDemoCategory] = useState('BREAKING NEWS');
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);
  const stripRef = useRef<HTMLUListElement>(null);

  const scrollStrip = (direction: 'left' | 'right') => {
    if (stripRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      stripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-paper text-ink transition-colors duration-200">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 border-b border-line-soft bg-paper/85 backdrop-blur-md transition-colors">
        <div className="mx-auto w-full max-w-4xl px-4 flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="bg-red-500 text-white p-1.5 rounded-[7px] shadow-sm group-hover:bg-red-600 transition-colors">
              <Newspaper className="w-4 h-4" />
            </div>
            <span className="text-[16px] font-bold tracking-tight">Ncreative</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-[14px] font-medium text-ink-soft">
            <a href="#showcase" className="hover:text-ink transition-colors">Showcase</a>
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="/blogs/" className="hover:text-ink transition-colors">Blog</a>
            {/* <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a> */}
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Open Studio Button */}
            <button
              onClick={() => onOpenStudio()}
              className="btn btn-primary !h-9 px-4 text-xs font-semibold sm:text-sm"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5 -mr-0.5 opacity-85" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-1.5 rounded-full text-ink-muted hover:text-ink transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ============ HERO SECTION ============ */}
        <section className="pt-14 md:pt-24 pb-12">
          <div className="mx-auto w-full max-w-4xl px-4 flex flex-col items-center">
            {/* Main Title */}
            <h1 className="site-title rise text-center [animation-delay:60ms]">
              Create breaking news graphics<br />in 10 seconds flat
            </h1>

            {/* Subtitle */}
            <p className="rise mt-4 max-w-xl text-center text-[15px] leading-[1.6] text-ink-soft text-balance [animation-delay:120ms] md:mt-5 md:text-base">
              Ncreative turns any headline, quote, or breaking alert into viral, broadcast-ready news cards and 9:16 reels before other outlets even open Photoshop.
            </p>

            {/* Micro badges */}
            <div className="rise mt-6 flex flex-wrap items-center justify-center gap-3 whitespace-nowrap [animation-delay:180ms] md:gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Zap className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="font-medium">10-second export</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium">100% private in-browser</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="rise mt-8 flex flex-wrap justify-center gap-3 [animation-delay:240ms] md:mt-10">
              <button
                onClick={() => onOpenStudio()}
                className="btn btn-primary !h-12 px-6 text-base font-semibold shadow-md"
              >
                <span>Launch Creator Studio</span>
                <ArrowRight className="w-4 h-4 -mr-1 opacity-85" />
              </button>
            </div>

            {/* Sublink */}
            <p className="rise mt-5 text-sm text-ink-muted [animation-delay:300ms]">
              Free to use online. Zero sign-up required.
            </p>
          </div>
        </section>

        {/* ============ SHOWCASE STRIP (Eight Ways to Publish) ============ */}
        <div className="flex flex-col gap-20 py-8 lg:gap-28 lg:py-16" id="showcase">
          <section className="overflow-hidden">
            <div className="mx-auto w-full max-w-4xl px-4 mb-4 sm:mb-8">
              <h2 className="section-title flex flex-col items-center text-center">
                <span className="text-ink-faint">One headline.</span>
                <span>Six ways to publish it.</span>
              </h2>
            </div>

            {/* Carousel Strip Container */}
            <div className="relative">
              <ul
                ref={stripRef}
                tabIndex={0}
                aria-label="Ncreative templates showcase"
                className="strip flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-clip overscroll-x-contain scroll-smooth py-4 cursor-grab focus:outline-none"
              >
                {SHOWCASE_VIEWS.map((item, idx) => (
                  <li key={item.id} className="shrink-0 snap-start">
                    <figure className="w-[310px] sm:w-[380px] md:w-[440px]">
                      {/* Card Frame */}
                      <div
                        onClick={() => onOpenStudio(item.id)}
                        className="overflow-hidden rounded-2xl shadow-bedo ring-1 ring-line cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:ring-red-500/40 bg-surface"
                      >
                        {/* Mockup Canvas */}
                        <div className={`p-5 md:p-6 bg-gradient-to-b ${item.bgGradient} text-white flex flex-col justify-between aspect-[4/3] relative select-none`}>
                          {/* Header tag */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${item.tagColor}`}>
                              {item.badge}
                            </span>
                            <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                              {item.time}
                            </span>
                          </div>

                          {/* Headline Body */}
                          <div className="my-auto py-2">
                            <h3 className={`font-black text-lg sm:text-xl md:text-2xl leading-tight text-white uppercase tracking-tight drop-shadow-sm`}>
                              {item.previewHeadline}
                            </h3>
                            <p className="mt-2 text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                              {item.previewDesc}
                            </p>
                          </div>

                          {/* Footer bar */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                            <span className="font-mono text-zinc-400 font-semibold">{item.source}</span>
                            <span className="text-red-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              Open Template <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DiskBuddy caption */}
                      <figcaption className="mt-3 flex items-baseline gap-2 px-1">
                        <span className="text-sm font-semibold">{item.name}</span>
                        <span className="text-xs text-ink-muted truncate">{item.caption}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={() => scrollStrip('left')}
                aria-label="Previous template"
                className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-bedo ring-1 ring-line backdrop-blur transition-all hover:bg-surface md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip('right')}
                aria-label="Next template"
                className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-bedo ring-1 ring-line backdrop-blur transition-all hover:bg-surface md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </section>

          {/* ============ INTERACTIVE DEMO WIDGET ============ */}
          <section className="mx-auto w-full max-w-4xl px-4">
            <div className="rounded-2xl border border-line bg-surface p-6 md:p-8 shadow-bedo">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Live Output Preview */}
                <div className="w-full md:w-1/2 aspect-square max-w-[340px] rounded-xl overflow-hidden shadow-md ring-1 ring-line relative bg-zinc-950 text-white p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                      {demoCategory}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">JUST NOW</span>
                  </div>
                  <div className="my-auto">
                    <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-white drop-shadow">
                      {demoHeadline || 'YOUR HEADLINE HERE'}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/15 pt-2 text-[11px] font-mono text-zinc-400">
                    <span>NCREATIVE LIVE</span>
                    <span className="text-red-400 font-bold">100% VECTOR</span>
                  </div>
                </div>

                {/* Live Controls */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-red-500 mb-1">
                    Live Interactive Test
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Type a headline. See it format.
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                    Test the instant typographic balancing before stepping into the studio.
                  </p>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-ink-soft block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={demoCategory}
                        onChange={(e) => setDemoCategory(e.target.value.toUpperCase())}
                        maxLength={20}
                        className="w-full h-10 px-3 rounded-lg border border-line bg-surface text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="CATEGORY"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-soft block mb-1">Headline</label>
                      <textarea
                        value={demoHeadline}
                        onChange={(e) => setDemoHeadline(e.target.value)}
                        rows={2}
                        maxLength={80}
                        className="w-full p-2.5 rounded-lg border border-line bg-surface text-ink text-xs resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Type any breaking news or quote..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenStudio()}
                    className="btn btn-primary !h-11 mt-4 w-full text-sm font-semibold"
                  >
                    <span>Open in Full Studio Editor</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ============ FEATURES SECTION ============ */}
          <section id="features" className="scroll-mt-20">
            <div className="mx-auto w-full max-w-4xl px-4">
              <h2 className="section-title flex flex-col items-center text-center">
                <span className="text-ink-faint">Find the story.</span>
                <span>Then publish it instantly.</span>
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 lg:mt-14">
                {FEATURES_LIST.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex flex-col items-start gap-2.5 lg:gap-3.5">
                      <Icon className={`h-8 w-8 shrink-0 ${feat.iconColor}`} />
                      <h3 className="text-lg font-bold tracking-tight">{feat.title}</h3>
                      <p className="text-sm leading-[1.65] text-ink-soft">{feat.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>


        {/* ============ PRICING SECTION (commented out) ============ */}
        {/*
        <div className="py-12 lg:py-24" id="pricing">
          <section className="scroll-mt-20">
            <div className="mx-auto w-full max-w-4xl px-4">
              <h2 className="section-title flex flex-col items-center text-center">
                <span className="text-ink-faint">Pay once.</span>
                <span>Keep it forever.</span>
              </h2>

              <div className="mt-6 rounded-2xl bg-surface-soft/90 px-1 pt-1 sm:mt-10">
                <div className="grid gap-0.5 overflow-hidden rounded-xl bg-fill shadow-bedo md:grid-cols-[3fr_2fr]">
                  Left Column
                  <div className="bg-surface p-6 lg:p-8">
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Ncreative Lifetime Studio
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft sm:text-base">
                      One payment. No subscription, no watermarks, unlimited 4K exports.
                    </p>

                    <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-3xl font-bold tracking-tight sm:text-[42px]">$9</span>
                      <span className="text-lg text-ink-muted line-through">$49</span>
                      <span className="text-base text-ink-muted">one-time</span>
                    </div>

                    Launch Copies Progress Bar
                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                        <span className="text-orange-500">Launch price for the first 300 copies</span>
                        <span className="shrink-0 text-ink-muted">84 left</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label="Launch copies claimed"
                        aria-valuemin={0}
                        aria-valuemax={300}
                        aria-valuenow={216}
                        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-fill"
                      >
                        <div className="h-full rounded-full bg-orange-500 transition-[width] duration-700" style={{ width: '72%' }} />
                      </div>
                      <p className="mt-1.5 text-xs text-ink-muted font-mono">216 of 300 claimed</p>
                    </div>

                    <button onClick={() => onOpenStudio()} className="btn btn-primary mt-6 w-full !h-12 text-base font-semibold">
                      <span>Get Lifetime Access · $9</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>

                    Features checklist
                    <ul className="mt-6 flex flex-col gap-2.5 sm:gap-3">
                      {[
                        'All eight visual templates & aspect ratios included',
                        '4K image downloads & 9:16 vertical video reel exports',
                        'Real-time drag, resize, typography & logo watermarking',
                        '100% offline & local processing - drafts stay private',
                        'Every future update & template pack, free forever'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  Right Column
                  <div className="grid content-start gap-5 bg-surface p-6 lg:p-8">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Fits your newsroom</h3>
                      <p className="mt-1 text-sm text-ink-soft sm:text-base">Ultra-fast, private, and lightweight.</p>
                    </div>
                    <ul className="flex flex-col gap-2.5 sm:gap-3">
                      {[
                        'Works on Mac, Windows, iOS, and Android',
                        'Runs right in browser without installing bloatware',
                        'Zero account required - start creating immediately',
                        'Instant 1-second exports without waiting in render queues'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                Bottom Card Banner
                <div className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-inset ring-line text-red-500">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Want to try it before buying?</div>
                      <div className="text-xs text-ink-soft">
                        You can test the entire Studio right now online. Instant license activation sent immediately upon checkout.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        */}


        {/* ============ FAQ SECTION ============ */}
        <div className="flex flex-col gap-20 py-12 lg:gap-28 lg:py-20" id="faq">
          <section className="scroll-mt-20">
            <div className="mx-auto w-full max-w-4xl px-4">
              <h2 className="section-title flex flex-col items-center text-center">
                <span className="text-ink-faint">Questions.</span>
                <span>Answered.</span>
              </h2>

              <div className="mx-auto mt-8 flex w-full max-w-xl flex-col divide-y divide-line-soft lg:mt-12">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="py-1">
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between gap-3 py-3.5 text-left text-sm font-semibold sm:text-base hover:text-red-500 transition-colors"
                        >
                          <span className="flex-1">{item.q}</span>
                          <span className="shrink-0 text-ink-soft">
                            {isOpen ? '—' : '+'}
                          </span>
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="pb-4 text-sm leading-[1.65] text-ink-soft">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-10 text-center text-sm text-ink-muted">
                Something else?{' '}
                <a href="mailto:hello@newsbanana.com" className="underline underline-offset-4 hover:text-ink transition-colors">
                  Email us
                </a>
              </p>
            </div>
          </section>

          {/* ============ GUIDES SECTION ============ */}
          <section>
            <div className="mx-auto w-full max-w-4xl px-4">
              <h2 className="section-title flex flex-col items-center text-center">
                <span className="text-ink-faint">Before you publish.</span>
                <span>Learn what makes news go viral.</span>
              </h2>

              <ul className="mx-auto mt-8 flex max-w-2xl flex-col divide-y divide-line-soft lg:mt-12">
                <li>
                  <a href="/blogs/flipkart-big-billion-days-2026-sale-date/" className="group flex w-full items-center gap-4 py-4 text-left transition-colors">
                    <span className="flex-1">
                      <span className="block text-base font-semibold text-ink group-hover:text-red-500 transition-colors">Flipkart Big Billion Days 2026: sale date and what is confirmed</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">A source-checked sale update and a practical publishing checklist for creators</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-ink-faint transition-colors group-hover:text-ink" />
                  </a>
                </li>
                {GUIDES_LIST.map((guide, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onOpenStudio()}
                      className="group flex w-full items-center gap-4 py-4 text-left transition-colors"
                    >
                      <span className="flex-1">
                        <span className="block text-base font-semibold text-ink group-hover:text-red-500 transition-colors">
                          {guide.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          {guide.desc}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-ink-faint transition-colors group-hover:text-ink" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-line-soft">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="bg-red-500 text-white p-1.5 rounded-[6px]">
                  <Newspaper className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-bold tracking-tight">Ncreative</span>
              </div>
              <p className="mt-4 text-xs leading-[1.65] text-ink-muted">
                Fast, broadcast-ready news graphic studio. Create breaking news banners, viral quote cards, and 9:16 reels in under 10 seconds.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => onOpenStudio()}
                  className="btn btn-primary !h-8 px-3 text-xs font-semibold"
                >
                  Open Studio
                </button>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-xs">
              <div>
                <p className="font-semibold text-ink uppercase tracking-wider mb-3">Product</p>
                <ul className="flex flex-col gap-2.5 text-ink-muted">
                  <li><button onClick={() => onOpenStudio()} className="hover:text-ink transition-colors">Creator Studio</button></li>
                  <li><a href="#showcase" className="hover:text-ink transition-colors">Showcase</a></li>
                  <li><a href="#features" className="hover:text-ink transition-colors">Features</a></li>
                  <li><a href="#faq" className="hover:text-ink transition-colors">FAQ</a></li>
                  <li><a href="/blogs/" className="hover:text-ink transition-colors">Blog</a></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-ink uppercase tracking-wider mb-3">Templates</p>
                <ul className="flex flex-col gap-2.5 text-ink-muted">
                  <li><button onClick={() => onOpenStudio('breaking-news')} className="hover:text-ink transition-colors">Breaking News</button></li>
                  <li><button onClick={() => onOpenStudio('quote-card')} className="hover:text-ink transition-colors">Quote Cards</button></li>
                  <li><button onClick={() => onOpenStudio('sports-score')} className="hover:text-ink transition-colors">Sports Match</button></li>
                  <li><button onClick={() => onOpenStudio('video-reel')} className="hover:text-ink transition-colors">9:16 Video Reel</button></li>
                  <li><button onClick={() => onOpenStudio('fact-check')} className="hover:text-ink transition-colors">Fact Check</button></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-ink uppercase tracking-wider mb-3">Support</p>
                <ul className="flex flex-col gap-2.5 text-ink-muted">
                  <li><a href="mailto:hello@newsbanana.com" className="hover:text-ink transition-colors">Email us</a></li>
                  <li><a href="#" className="hover:text-ink transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-ink transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-line-soft pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Ncreative. All rights reserved.</p>
            <p>Built for journalists, digital creators, and social desks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
