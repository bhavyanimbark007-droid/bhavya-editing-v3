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

/* ---------------------------------------------------- */
/*  Seed Defaults                                       */
/* ---------------------------------------------------- */

const SEED = {
  brand: "BHAVYA",
  footer: "© {year} Bhavya — Video Editor & Motion Designer.",
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
  },
};

/* ---------------------------------------------------- */
/*  Seed Once Only                                      */
/* ---------------------------------------------------- */

export async function ensureSeedData() {
  const [{ value }] = await db.select({ value: count() }).from(siteSettings);

  if (value > 0) return;

  // Insert main settings
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

  // Insert hero cards
  for (const [i, c] of SEED.hero.cards.entries()) {
    await db.insert(portfolioItems).values({
      ...c,
      category: "hero",
      sort: i,
    });
  }

  // Insert work projects
  for (const [i, p] of SEED.projects.entries()) {
    await db.insert(portfolioItems).values({
      ...p,
      category: "work",
      sort: i,
    });
  }
}

/* ---------------------------------------------------- */
/*  Assemble Public Content                             */
/* ---------------------------------------------------- */

export async function assembleContent() {
 await ensureSeedData();
  
  const [settings] = await db.select().from(siteSettings).limit(1);

  const heroCards = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.category, "hero"))
    .orderBy(asc(portfolioItems.sort));

  const workProjects = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.category, "work"))
    .orderBy(asc(portfolioItems.sort));

  return {
    brand: settings.brand,
    nav: settings.nav,
    hero: {
      ...(settings.hero as any),
      cards: heroCards.map((c) => ({
        tag: c.tag,
        title: c.title,
        img: c.thumbnailUrl,
        video: c.videoUrl,
      })),
    },
    work: {
      projects: workProjects.map((p) => ({
        tag: p.tag,
        title: p.title,
        sub: p.sub,
        img: p.thumbnailUrl,
        video: p.videoUrl,
      })),
    },
    footer: settings.footer,
  };
}

/* ---------------------------------------------------- */
/*  Apply CMS Updates                                   */
/* ---------------------------------------------------- */

export async function applyContent(c: any) {
  await db
    .update(siteSettings)
    .set({
      brand: c.brand,
      footer: c.footer,
      nav: c.nav,
      hero: { ...c.hero, cards: undefined },
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  // HERO
  await db.delete(portfolioItems).where(eq(portfolioItems.category, "hero"));

  for (const [i, card] of (c.hero.cards as any[]).entries()) {
    await db.insert(portfolioItems).values({
      tag: card.tag,
      title: card.title,
      sub: "",
      thumbnailUrl: card.img,
      videoUrl: card.video,
      category: "hero",
      sort: i,
    });
  }

  // WORK
  await db.delete(portfolioItems).where(eq(portfolioItems.category, "work"));

  for (const [i, p] of (c.work.projects as any[]).entries()) {
    await db.insert(portfolioItems).values({
      tag: p.tag,
      title: p.title,
      sub: p.sub,
      thumbnailUrl: p.img,
      videoUrl: p.video,
      category: "work",
      sort: i,
    });
  }
}

/* ---------------------------------------------------- */
/*  Inquiries                                           */
/* ---------------------------------------------------- */

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