# MarketFlow — Digital Marketing Agency Platform

A full-stack Next.js + TypeScript + MongoDB platform for a digital marketing agency: public
marketing site, client authentication & dashboard, service requests, project tracking,
messaging, lead CRM, appointment booking, invoicing, and an admin back office.

> **Honest scope note:** this codebase implements real authentication, real MongoDB models,
> and real API routes for every core flow (auth, leads, service requests, projects, messages,
> appointments, invoices, notifications, blog, website audit tool). A handful of admin
> read-heavy screens (Clients, Payments detail, Services list) are wired to real endpoints
> where those endpoints exist, and left as clearly-labeled "connect this" stubs where a
> corresponding `/api/admin/*` aggregation route hasn't been built yet — see
> [What's stubbed / next steps](#whats-stubbed--next-steps) below. Real-time chat currently
> polls every 5s rather than using a live Socket.IO connection — see that section for how to
> upgrade it.

---

## 1. Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes (Node.js runtime)
- **Database:** MongoDB Atlas via Mongoose
- **Auth:** JWT (via `jose`, Edge-compatible) in an httpOnly cookie, bcrypt password hashing
- **Charts:** Recharts
- **Email:** Nodemailer (SMTP) — swap for Resend easily, see `src/lib/mailer.ts`
- **Payments:** Stripe SDK included, ready to wire up (see [Payments](#payments))
- **Real-time:** Socket.IO dependency included; chat currently polls (see [Chat](#chat--messaging))

---

## 2. Getting started

```bash
npm install
cp .env.example .env
# fill in MONGODB_URI and JWT_SECRET at minimum
npm run seed   # populates demo clients, leads, projects, invoices, reports, blog posts
npm run dev
```

Open http://localhost:3000.

The seed script creates an admin account using `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`
from your `.env` (defaults to `admin@marketflow.agency` / `ChangeMe123!` — **change this**
before deploying anywhere real). Demo clients are seeded with the password `Password123!`.

### Required environment variables

See `.env.example` for the full list. At minimum you need:

```
MONGODB_URI=...
JWT_SECRET=...           # any long random string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Everything else (Google OAuth, Cloudinary, Stripe/Razorpay, SMTP) is optional — the app
degrades gracefully without them (e.g. emails log to the console instead of sending; the
"Continue with Google" button prompts you to configure credentials).

---

## 3. Project structure

```
src/
  app/                    Next.js App Router pages
    (marketing pages)     /, /services, /pricing, /blog, /contact, /case-studies, /tools/*
    signup/, login/, onboarding/, forgot-password/, verify-email/
    dashboard/            Client-facing app (protected by middleware.ts)
    admin/                Admin/employee back office (protected by middleware.ts)
    api/                  All backend route handlers
  components/
    ui/                   Reusable primitives: Button, Input, StatusBadge, ProgressBar, Toast…
    layout/                Navbar, Footer
    marketing/             Hero, ServicesOverview, PricingCard, Testimonials…
    dashboard/, admin/      Sidebar, TopBar, DashboardCard, ChatWindow…
    forms/                  ContactForm
  models/                  Mongoose schemas — one per section-24 entity
  lib/                     db.ts, auth.ts, mailer.ts, rateLimit.ts, utils.ts
  middleware.ts            Protects /dashboard/* and /admin/*
scripts/seed.ts             Demo data seeder
```

---

## 4. Database models

`src/models/` contains a Mongoose schema for every entity: `User`, `ClientProfile`, `Service`,
`ServiceRequest`, `Project`, `Task`, `Lead`, `Appointment`, `Message`, `Invoice`, `Payment`,
`MarketingReport`, `Notification`, `BlogPost`, `Audit`, `ContactSubmission`. Indexes are set on
fields used for lookups (email, slug, status) and uniqueness constraints (invoice numbers,
appointment date+timeSlot to prevent double-booking, one MarketingReport per client per month).

There's no separate `Admin` collection — `User.role` is one of `client | admin | employee`,
enforced by `middleware.ts` and per-route role checks.

---

## 5. Authentication

- Passwords hashed with bcrypt (12 rounds).
- Sessions are a JWT in an httpOnly, sameSite=lax cookie, verified with `jose` so the same
  verification code works in both Node API routes and the Edge `middleware.ts`.
- `middleware.ts` redirects unauthenticated users away from `/dashboard/*` and `/admin/*`, and
  redirects clients away from `/admin/*`.
- Endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`,
  `GET /api/auth/verify-email?token=...`.
- Google OAuth is not wired up (button is present with a placeholder handler) — add
  `next-auth` or a manual OAuth flow using `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` if needed.

---

## 6. API reference (high level)

| Route | Methods | Notes |
|---|---|---|
| `/api/auth/signup` | POST | Creates User + ClientProfile, sends verification email |
| `/api/auth/login` | POST | Rate-limited, sets session cookie |
| `/api/contact` | POST | Saves ContactSubmission + creates a Lead, emails admin |
| `/api/leads` | GET/POST/PATCH | Admin/employee only — CRM Kanban backend |
| `/api/service-requests` | GET/POST/PATCH | Clients create, admins update status |
| `/api/projects` | GET/POST/PATCH | Includes nested Task fetch/update |
| `/api/appointments` | GET/POST | `?date=` returns free slots; unique index prevents double-booking |
| `/api/audit` | POST | Runs the free website SEO checker, stores an Audit doc |
| `/api/messages` | GET/POST | Conversation ID = sorted pair of user IDs |
| `/api/notifications` | GET/PATCH | Mark one or all as read |
| `/api/blog` | GET/POST | Public reads published posts; admin creates |
| `/api/invoices` | GET | Client sees own; admin sees all |
| `/api/services` | GET/POST/PATCH | Public catalog + admin pricing edits |
| `/api/admin/clients` | GET/PATCH | List clients + profiles; enable/disable accounts |
| `/api/support-contact` | GET | Resolves which admin a client's chat connects to |

All mutating routes validate input with `zod` and check `getSessionFromCookies()` for
authorization. Rate limiting (`src/lib/rateLimit.ts`) is in-memory and per-instance — replace
with a Redis-backed limiter (e.g. Upstash) before running multiple serverless instances.

---

## 7. Chat / messaging

`Message` documents are grouped by a deterministic `conversationId` (sorted `userA_userB`).
`ChatWindow.tsx` currently **polls** `GET /api/messages?with=...` every 5 seconds — this works
out of the box with zero extra infrastructure, but for true real-time delivery:

1. Add a small standalone Socket.IO server (`server/socket.ts`, not included, since Vercel's
   serverless functions can't hold a persistent socket connection).
2. Deploy it separately (e.g. a small Node service on Render/Fly.io) or self-host alongside a
   custom Next.js server.
3. Emit `message:new` to `recipientId`'s room from `POST /api/messages` (the code has a
   commented-out line marking exactly where), and listen for it client-side instead of polling.

---

## 8. Payments

`Payment` and `Invoice` models are ready, and the `stripe` package is installed, but the
actual Stripe Checkout session creation + webhook handler are **not implemented** — wire up:

1. `POST /api/checkout/create-session` — creates a Stripe Checkout Session for a selected
   package/service, with `client_reference_id` set to the logged-in user's ID.
2. `POST /api/webhooks/stripe` — verifies the signature with `STRIPE_WEBHOOK_SECRET`, then on
   `checkout.session.completed` creates a `Payment` doc, marks the related `Invoice` as
   `"Paid"`, and creates the `ServiceRequest`/`Project`.

**Card details are never stored in MongoDB** — only Stripe/Razorpay's own payment reference ID
and status, per the `Payment` model's design.

---

## 9. What's stubbed / next steps

To keep this delivery honest rather than padding it with fake-looking-real screens, these
admin views render a clear empty/connect-this state instead of invented data:

- **Admin → Payments (transaction table)** — needs the Stripe/Razorpay integration above
- **Admin → Services (list)** — now wired to the real `/api/services` route; add
  create/edit/delete UI on top of the existing `POST`/`PATCH` handlers
- **Dashboard → Reports** — needs `GET /api/marketing-reports` scoped to the logged-in client
- **File uploads** (service request attachments, blog featured images, profile photos) — no
  Cloudinary wiring yet; add `CLOUDINARY_*` env vars and a small upload route
- **Onboarding wizard** — currently client-side only; add `PATCH /api/onboarding` to persist
  each step to `ClientProfile`

Everything else (auth, leads, service requests, projects, messaging, appointments, the SEO
checker, invoices-read, blog) is fully wired end-to-end against MongoDB.

---

## 10. Security checklist implemented

- bcrypt password hashing, JWT httpOnly/sameSite cookies
- Role-based route protection in `middleware.ts` + per-route checks
- `zod` input validation on every mutating API route
- Basic in-memory rate limiting on signup/login/contact/audit
- Security headers set in `next.config.js` (X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy)
- No card data ever touches MongoDB (Payment model stores provider references only)
- `.env` is git-ignored; `.env.example` has placeholders only

For production, also add: CSRF protection on state-changing forms if you move off
same-site cookies, a Redis-backed rate limiter, Cloudinary upload validation (file type/size),
and a WAF/managed DDoS protection in front of Vercel or your host.

---

## 11. Deployment

**Frontend + API routes:** deploy to Vercel (recommended — zero config for Next.js App
Router) or any Node host that supports Next.js 14.

**Database:** MongoDB Atlas. Create a cluster, a database user, whitelist your deployment
platform's IPs (or `0.0.0.0/0` for serverless platforms with dynamic IPs), and put the
connection string in `MONGODB_URI`.

**Steps for Vercel:**
```bash
vercel
# add all vars from .env.example in the Vercel dashboard (Project Settings → Environment Variables)
vercel --prod
```

Run `npm run seed` locally against your production `MONGODB_URI` once, to populate demo data
(or skip it and let real signups populate the database).

---

## 12. Demo data

`npm run seed` creates: 1 admin account, 5 demo clients, 10 leads, 5 projects (with tasks),
5 invoices, 5 marketing reports, 5 appointments, 5 blog posts, and welcome notifications. All
seeded records use `@example.com` addresses and are safe to identify/delete — nothing here is
real customer data.
