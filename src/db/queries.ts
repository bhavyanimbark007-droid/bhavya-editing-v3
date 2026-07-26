import { asc, count, eq } from "drizzle-orm";
import { db } from "./index";
import {
  inquiries,
  portfolioItems,
  services,
  siteSettings,
  skills,
  stats,
  testimonials,
} from "./schema";

/* ------------------------------------------------------------------ */
/*  Seed defaults — mirrors defaultData.ts from the Vite project      */
/* ------------------------------------------------------------------ */

const SEED = {
  brand: "BHAVYA",
  footer: "© {year} Bhavya — Video Editor & Motion Designer. All rights reserved.",
  nav: [
    { id: "work", label: "My Work" },
    { id: "skills", label: "Skills" },
    { id: "why", label: "Why Me" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    badge: "Available for Freelance",
    script: "not just a",
    title: "VIDEO EDITOR",
    subtitle: "I make videos that stop the scroll, tell stories, and grow brands.",
    primaryCta: "Watch My Work",
    secondaryCta: "Download Resume",
    cards: [
      { tag: "MOTION", title: "Motion Graphics", img: "https://images.pexels.com/photos/15310083/pexels-photo-15310083.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", video: "https://videos.pexels.com/video-files/36956158/15656746_1080_1920_30fps.mp4" },
      { tag: "BRAND", title: "Brand Campaign", img: "https://images.pexels.com/photos/8089675/pexels-photo-8089675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", video: "https://videos.pexels.com/video-files/36604691/15520328_1920_1080_25fps.mp4" },
      { tag: "YOUTUBE", title: "YouTube Edit", img: "https://images.pexels.com/photos/8100067/pexels-photo-8100067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", video: "https://videos.pexels.com/video-files/7699548/7699548-hd_1920_1080_30fps.mp4" },
      { tag: "REELS", title: "Instagram Reel", img: "https://images.pexels.com/photos/15549322/pexels-photo-15549322.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", video: "https://videos.pexels.com/video-files/37050264/15695542_1080_1920_30fps.mp4" },
    ],
  },
  marquee: ["SOUND DESIGN", "THUMBNAIL DESIGN", "YOUTUBE EDITING", "MOTION GRAPHICS", "COLOR GRADING", "BRAND VIDEOS", "INSTAGRAM REELS", "VFX & COMPOSITING"],
  statsMeta: { heading: "Turning raw footage into", accent: "VIRAL CONTENT", cta: "Let's Work Together" },
  statsItems: [
    { value: 50, suffix: "+", label: "PROJECTS COMPLETED" },
    { value: 2, suffix: "M+", label: "VIEWS GENERATED" },
    { value: 3, suffix: "+", label: "YEARS EXPERIENCE" },
    { value: 20, suffix: "+", label: "HAPPY CLIENTS" },
  ],
  skillsMeta: { eyebrow: "WHAT I BRING", heading: "What I Bring to the Table" },
  skillCards: [
    { tags: [{ label: "Ae", color: "indigo" }, { label: "Pr", color: "purple" }, { label: "DaVinci", color: "sky" }], title: "Advanced Video Editing", points: ["A to Z Premiere Pro Editing", "Motion Graphics in After Effects", "Color Grading in DaVinci Resolve", "Sound Design & Audio Mixing"], isNew: false },
    { tags: [{ label: "Reels", color: "pink" }, { label: "Shorts", color: "red" }, { label: "TikTok", color: "teal" }], title: "Short Form Content", points: ["Hook-based editing psychology", "Fast-paced cuts & transitions", "Trending audio sync", "Caption & subtitle styling"], isNew: false },
    { tags: [{ label: "VFX", color: "violet" }, { label: "Mograph", color: "fuchsia" }], title: "Motion Graphics & VFX", points: ["Custom intro/outro animations", "Lower thirds & title cards", "Green screen & compositing", "Kinetic typography"], isNew: false },
    { tags: [{ label: "Strategy", color: "green" }, { label: "AI Tools", color: "cyan" }], title: "Content Strategy", points: ["Thumbnail psychology", "Hook writing for video", "Retention-based structure", "AI tools for content creation"], isNew: true },
  ],
  why: {
    eyebrow: "THE DIFFERENTIATOR",
    heading: "Why Hire Me?",
    left: { title: "Raw", sub: "Footage" },
    right: { title: "Viral", sub: "Content" },
    points: ["Fast Turnaround", "Cinema-Quality Output", "Revisions Included"],
    quoteTitle: '"I don\'t just edit — I tell your story"',
    quoteBody: "Every cut, color grade, and transition is intentional. I think like a storyteller, not just an editor.",
  },
  servicesMeta: { eyebrow: "PRICING & PACKAGES", heading: "Services I Offer" },
  plans: [
    { name: "Reels & Shorts", price: "₹2,000", unit: "/ video", features: ["Short form editing", "Captions & subtitles", "Color grading", "1 revision included"], featured: false },
    { name: "YouTube Videos", price: "₹5,000", unit: "/ video", features: ["Full video edit", "Motion graphics included", "Custom thumbnail", "Color grade + audio mix", "3 revisions included"], featured: true },
    { name: "Brand Videos", price: "₹10K+", unit: "/ project", features: ["Scripting help & concept", "Full production edit", "VFX & compositing", "Color grade + sound", "Unlimited revisions"], featured: false },
  ],
  workMeta: { eyebrow: "PORTFOLIO", heading: "My Work", sub: "Videos that stopped the scroll", cta: "View Full Portfolio" },
  projects: [
    { tag: "BRAND", title: "Brand Campaign Edit", sub: "Premium brand storytelling", img: "https://images.pexels.com/photos/30878455/pexels-photo-30878455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", video: "https://videos.pexels.com/video-files/36604691/15520328_1920_1080_25fps.mp4" },
    { tag: "YOUTUBE", title: "YouTube Vlog", sub: "Travel & lifestyle content", img: "https://images.pexels.com/photos/14776915/pexels-photo-14776915.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", video: "https://videos.pexels.com/video-files/37669026/15969552_2560_1440_60fps.mp4" },
    { tag: "REELS", title: "Instagram Reel", sub: "Viral short form content", img: "https://images.pexels.com/photos/8537023/pexels-photo-8537023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", video: "https://videos.pexels.com/video-files/37050264/15695542_1080_1920_30fps.mp4" },
    { tag: "MOTION", title: "Motion Graphics Demo", sub: "After Effects showcase", img: "https://images.pexels.com/photos/14146812/pexels-photo-14146812.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", video: "https://videos.pexels.com/video-files/35708644/15133956_1920_1080_30fps.mp4" },
    { tag: "FILM", title: "Travel Film", sub: "Cinematic travel edit", img: "https://images.pexels.com/photos/14541040/pexels-photo-14541040.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", video: "https://videos.pexels.com/video-files/26081786/11929718_1920_1080_60fps.mp4" },
    { tag: "BRAND", title: "Product Ad", sub: "E-commerce product video", img: "https://images.pexels.com/photos/6457668/pexels-photo-6457668.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", video: "https://videos.pexels.com/video-files/34677880/14698571_1920_1080_25fps.mp4" },
  ],
  testimonialsMeta: { eyebrow: "SOCIAL PROOF", heading: "What Clients Say" },
  reviews: [
    { quote: "Best video editor I've hired. Fast delivery, great communication, and the color grading was absolutely cinematic. Will definitely hire again!", name: "Priya Mehta", role: "Brand Owner • D2C Startup" },
    { quote: "He edited my brand reel and it literally went viral on Instagram. Now I hire him for every project. 10/10 recommend!", name: "Arjun Verma", role: "Content Creator • 100K Followers" },
    { quote: "The thumbnail + edit combo he delivered was perfect. My CTR went from 2% to 8% after his edits. My channel literally started growing overnight!", name: "Sneha Kapoor", role: "Lifestyle Vlogger • YouTube" },
    { quote: "Professional, creative, on-time. If you need a video editor who understands content strategy too — he's your guy. Absolutely loved the work!", name: "Vikram Das", role: "Agency Founder • Mumbai" },
    { quote: "My product launch video looked like a big-brand commercial. The motion graphics and sound design were next level. Worth every rupee.", name: "Rohan Shah", role: "Founder • E-commerce Brand" },
  ],
  cta: { line1: "STOP WAITING.", line2: "START CREATING.", sub: "Your story deserves to be told — cinematically.", button: "Hire Me Now" },
  contact: {
    headingPre: "Let's Create Something",
    headingAccent: "Insane",
    email: "bhavya@email.com",
    instagram: "@bhavya.edits",
    youtube: "youtube.com/@bhavya",
    location: "Your City, India",
    response: "Within 24 hours",
    tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut Pro"],
    formTitle: "Send a Message",
    submit: "Send Message",
  },
};

/* ------------------------------------------------------------------ */
/*  Seed                                                              */
/* ------------------------------------------------------------------ */

export async function ensureSeedData() {
  const [{ value: n }] = await db.select({ value: count() }).from(siteSettings);
  if (n > 0) return;

  await db.insert(siteSettings).values({
    brand: SEED.brand,
    footer: SEED.footer,
    nav: SEED.nav,
    hero: SEED.hero,
    marquee: SEED.marquee,
    statsMeta: SEED.statsMeta,
    skillsMeta: SEED.skillsMeta,
    why: SEED.why,
    servicesMeta: SEED.servicesMeta,
    workMeta: SEED.workMeta,
    testimonialsMeta: SEED.testimonialsMeta,
    cta: SEED.cta,
    contact: SEED.contact,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || null,
  });

  for (const [i, c] of SEED.hero.cards.entries()) {
    await db.insert(portfolioItems).values({ ...c, category: "hero", sort: i });
  }
  for (const [i, p] of SEED.projects.entries()) {
    await db.insert(portfolioItems).values({ ...p, category: "work", sort: i });
  }
  for (const [i, s] of SEED.plans.entries()) {
    await db.insert(services).values({ ...s, sort: i });
  }
  for (const [i, t] of SEED.reviews.entries()) {
    await db.insert(testimonials).values({ message: t.quote, name: t.name, role: t.role, sort: i });
  }
  for (const [i, s] of SEED.skillCards.entries()) {
    await db.insert(skills).values({ name: s.title, tags: s.tags, points: s.points, isNew: s.isNew, sort: i });
  }
  for (const [i, s] of SEED.statsItems.entries()) {
    await db.insert(stats).values({ ...s, sort: i });
  }
}

/* ------------------------------------------------------------------ */
/*  Assemble the full SiteContent JSON for the public site            */
/* ------------------------------------------------------------------ */

export async function assembleContent() {
  await ensureSeedData();
  const [settings] = await db.select().from(siteSettings).limit(1);
  const heroCards = await db.select().from(portfolioItems).where(eq(portfolioItems.category, "hero")).orderBy(asc(portfolioItems.sort));
  const workProjects = await db.select().from(portfolioItems).where(eq(portfolioItems.category, "work")).orderBy(asc(portfolioItems.sort));
  const plans = await db.select().from(services).orderBy(asc(services.sort));
  const reviews = await db.select().from(testimonials).orderBy(asc(testimonials.sort));
  const skillCards = await db.select().from(skills).orderBy(asc(skills.sort));
  const statItems = await db.select().from(stats).orderBy(asc(stats.sort));

  return {
    brand: settings.brand,
    nav: settings.nav,
    hero: { ...(settings.hero as object), cards: heroCards.map((c) => ({ tag: c.tag, title: c.title, img: c.thumbnailUrl, video: c.videoUrl })) },
    marquee: settings.marquee,
    stats: { ...(settings.statsMeta as object), items: statItems.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })) },
    skills: { ...(settings.skillsMeta as object), cards: skillCards.map((s) => ({ tags: s.tags, title: s.name, points: s.points, isNew: s.isNew })) },
    why: settings.why,
    services: { ...(settings.servicesMeta as object), plans: plans.map((p) => ({ name: p.name, price: p.price, unit: p.unit, features: p.features, featured: p.featured })) },
    work: { ...(settings.workMeta as object), projects: workProjects.map((p) => ({ tag: p.tag, title: p.title, sub: p.sub, img: p.thumbnailUrl, video: p.videoUrl })) },
    testimonials: { ...(settings.testimonialsMeta as object), reviews: reviews.map((r) => ({ quote: r.message, name: r.name, role: r.role })) },
    cta: settings.cta,
    contact: settings.contact,
    footer: settings.footer,
  };
}

/* ------------------------------------------------------------------ */
/*  Apply a full content object back to the database                  */
/* ------------------------------------------------------------------ */

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function applyContent(c: any) {
  await db
    .update(siteSettings)
    .set({
      brand: c.brand,
      footer: c.footer,
      nav: c.nav,
      hero: { ...c.hero, cards: undefined },
      marquee: c.marquee,
      statsMeta: { heading: c.stats.heading, accent: c.stats.accent, cta: c.stats.cta },
      skillsMeta: { eyebrow: c.skills.eyebrow, heading: c.skills.heading },
      why: c.why,
      servicesMeta: { eyebrow: c.services.eyebrow, heading: c.services.heading },
      workMeta: { eyebrow: c.work.eyebrow, heading: c.work.heading, sub: c.work.sub, cta: c.work.cta },
      testimonialsMeta: { eyebrow: c.testimonials.eyebrow, heading: c.testimonials.heading },
      cta: c.cta,
      contact: c.contact,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  // collections: replace-all strategy keeps sort order identical to the editor
  await db.delete(portfolioItems);
  for (const [i, card] of (c.hero.cards as any[]).entries()) {
    await db.insert(portfolioItems).values({ tag: card.tag, title: card.title, sub: "", thumbnailUrl: card.img, videoUrl: card.video, category: "hero", sort: i });
  }
  for (const [i, p] of (c.work.projects as any[]).entries()) {
    await db.insert(portfolioItems).values({ tag: p.tag, title: p.title, sub: p.sub, thumbnailUrl: p.img, videoUrl: p.video, category: "work", sort: i });
  }

  await db.delete(services);
  for (const [i, p] of (c.services.plans as any[]).entries()) {
    await db.insert(services).values({ name: p.name, price: p.price, unit: p.unit, features: p.features, featured: p.featured, sort: i });
  }

  await db.delete(testimonials);
  for (const [i, r] of (c.testimonials.reviews as any[]).entries()) {
    await db.insert(testimonials).values({ message: r.quote, name: r.name, role: r.role, sort: i });
  }

  await db.delete(skills);
  for (const [i, s] of (c.skills.cards as any[]).entries()) {
    await db.insert(skills).values({ name: s.title, tags: s.tags, points: s.points, isNew: s.isNew, sort: i });
  }

  await db.delete(stats);
  for (const [i, s] of (c.stats.items as any[]).entries()) {
    await db.insert(stats).values({ value: s.value, suffix: s.suffix, label: s.label, sort: i });
  }
}

/* ------------------------------------------------------------------ */
/*  Inquiries                                                         */
/* ------------------------------------------------------------------ */

export async function listInquiries() {
  return db.select().from(inquiries).orderBy(asc(inquiries.createdAt));
}

export async function createInquiry(data: {
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  message: string;
}) {
  const [row] = await db.insert(inquiries).values(data).returning();
  return row;
}
