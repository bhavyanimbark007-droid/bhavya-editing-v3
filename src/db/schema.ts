import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Single-row settings table: all scalar site content lives here as
 * columns; nested/array bits (hero cards, why-points, contact, ...) are
 * stored as jsonb so the shape matches defaultData.ts exactly.
 */
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull().default("BHAVYA"),
  footer: text("footer").notNull().default(""),
  nav: jsonb("nav").notNull(),
  hero: jsonb("hero").notNull(),
  marquee: jsonb("marquee").notNull(),
  statsMeta: jsonb("stats_meta").notNull(), // { heading, accent, cta }
  skillsMeta: jsonb("skills_meta").notNull(), // { eyebrow, heading }
  why: jsonb("why").notNull(),
  servicesMeta: jsonb("services_meta").notNull(), // { eyebrow, heading }
  workMeta: jsonb("work_meta").notNull(), // { eyebrow, heading, sub, cta }
  testimonialsMeta: jsonb("testimonials_meta").notNull(), // { eyebrow, heading }
  cta: jsonb("cta").notNull(),
  contact: jsonb("contact").notNull(),
  adminPasswordHash: text("admin_password_hash"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  title: text("title").notNull(),
  sub: text("sub").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  videoUrl: text("video_url").notNull().default(""),
  category: text("category").notNull().default("work"), // "work" | "hero"
  sort: integer("sort").notNull().default(0),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  unit: text("unit").notNull().default("/ video"),
  description: text("description").default(""),
  features: jsonb("features").notNull(),
  featured: boolean("featured").notNull().default(false),
  sort: integer("sort").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  message: text("message").notNull(),
  avatar: text("avatar").default(""),
  sort: integer("sort").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").default(""),
  level: integer("level").default(100),
  tags: jsonb("tags").notNull(),
  points: jsonb("points").notNull(),
  isNew: boolean("is_new").notNull().default(false),
  sort: integer("sort").notNull().default(0),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: integer("value").notNull().default(0),
  suffix: text("suffix").notNull().default("+"),
  sort: integer("sort").notNull().default(0),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").default(""),
  budget: text("budget").default(""),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
