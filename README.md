# BHAVYA CMS — Next.js 14 Edition

The exact same video-editor portfolio, converted from Vite + localStorage to
**Next.js 14 (App Router) + Drizzle ORM + Neon PostgreSQL + Cloudinary**, with a
database-backed admin portal at `/admin`.

Design, colors, fonts, animations, components and copy are unchanged — only the
data layer moved from `localStorage` to Postgres.

---

## 1. One-time setup: copy the components

All UI components are identical to the Vite project. Copy them from the Vite
project into this one:

```bash
# from the repo root
cp ../src/components/*.tsx        nextjs/src/components/   # Navbar, Hero, Marquee,
                                                          # Stats, Skills, WhyMe,
                                                          # Services, Work,
                                                          # Testimonials, FinalCTA,
                                                          # Contact, Footer,
                                                          # VideoModal, Reveal,
                                                          # CMSEditor
cp ../src/utils/cn.ts             nextjs/src/utils/        # (optional, if used)
```

Then add `"use client";` as the **first line** of every copied file (they use
hooks / browser events). They already import from `../lib/content`,
`../lib/cms` and `lucide-react`, all of which exist in this project with the
same public API.

> `Home.tsx`, `admin/page.tsx` and the API routes are already written for you —
> do not overwrite them.

## 2. Environment variables

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon.tech → create project → copy connection string |
| `JWT_SECRET` | Any long random string (`openssl rand -hex 32`) |
| `ADMIN_PASSWORD_HASH` | Optional. Leave empty and set the password from `/admin` on first visit (bcrypt-hashed and stored in `site_settings`) |
| `CLOUDINARY_*` | Cloudinary dashboard → Account Details / API Keys |

## 3. Create the schema

```bash
npm install
npx drizzle-kit push     # creates all tables in Neon
npm run dev
```

On the **first request** the database auto-seeds itself with the exact default
content (`ensureSeedData()` in `src/db/queries.ts`) — only if the tables are
empty.

## 4. Use it

- Public site: `http://localhost:3000`
- Admin portal: `http://localhost:3000/admin` (the old `#cms` link redirects here)
  - **Inbox** tab — every contact-form submission, live (8s polling), mark
    read / reply / delete
  - **Site Editor** tab — edit every headline, card, price, testimonial,
    image URL and video URL; changes save to Postgres and go live instantly

## 5. API routes

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/data` | GET | – | Full site content (assembled from all tables) |
| `/api/contact` | POST | – | Public contact form → `inquiries` table |
| `/api/upload` | POST | admin | Signed Cloudinary upload (images/video) |
| `/api/admin/login` | GET/POST/DELETE | – | Session setup / login / logout |
| `/api/admin/settings` | GET/PUT/DELETE | admin | Whole-site content read / write / reset |
| `/api/admin/portfolio` | GET/POST/PUT/DELETE | admin | `portfolio_items` CRUD |
| `/api/admin/services` | GET/POST/PUT/DELETE | admin | `services` CRUD |
| `/api/admin/testimonials` | GET/POST/PUT/DELETE | admin | `testimonials` CRUD |
| `/api/admin/skills` | GET/POST/PUT/DELETE | admin | `skills` CRUD |
| `/api/admin/stats` | GET/POST/PUT/DELETE | admin | `stats` CRUD |
| `/api/admin/inquiries` | GET/PUT/DELETE | admin | Lead inbox |

## 6. Deploy to Vercel

1. Push this folder to GitHub.
2. Vercel → New Project → import repo → framework preset **Next.js**.
3. Add the env vars from `.env.example`.
4. Deploy. Run `npx drizzle-kit push` once locally (or add it as a
   `postinstall` script) to create tables in Neon.
5. Visit `/admin`, set your password, start editing. Done.

## Database tables

`site_settings` · `portfolio_items` · `services` · `testimonials` · `skills` ·
`stats` · `inquiries` — defined in `src/db/schema.ts`.

## Security notes

- Passwords: bcrypt (10 rounds), stored in `site_settings.admin_password_hash`
  or provided via `ADMIN_PASSWORD_HASH`.
- Sessions: HMAC-SHA256 signed tokens in an `httpOnly`, `sameSite=lax`,
  `secure` cookie, 30-minute expiry.
- All admin routes verify the session server-side before touching data.
- Cloudinary uploads are server-signed (API secret never leaves the server).
