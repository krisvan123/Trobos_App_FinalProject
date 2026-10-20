# TROBOS — Emergency Mobility Prototype

**TROBOS** is a Next.js 15 / TypeScript academic prototype illustrating two transport services:

- **Tandem:** a rider takes the passenger while a separate driver moves their car.
- **Breakdown rescue:** a flatbed tow truck transfers the car to a selected example workshop, while an alternative vehicle takes passengers to their destination.

> **This is a demonstration, not a deployable emergency dispatch service.** Drivers, insurance, workshop partnerships, live tracking, OTP, payment balances and response times are simulated. Do not rely on it for real-world assistance.

## Technology

Next.js App Router, React 19, TypeScript, Tailwind CSS, Zustand, Lucide, Framer Motion. Optional integrations: Google Maps JavaScript API and Supabase Auth/PostgREST. A real OpenStreetMap map is displayed when Google Maps is not configured.

## Run locally

Requirements: Node.js 22 and npm.

```bash
git clone https://github.com/krisvan123/Trobos_App_FinalProject.git
cd Trobos_App_FinalProject
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Without service configuration, use **Try without entering data** from /login to explore the clearly labelled demo. No account, actual dispatch, insurance policy, or payment is created.

## Optional Google Maps

1. Create a project in [Google Cloud](https://console.cloud.google.com/), enable **Maps JavaScript API**, and set up billing.
2. Restrict the *browser* key by website referrer (localhost and the exact deployed host) and by Maps JavaScript API.
3. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local` or Vercel environment variables.
4. Restart the development server or redeploy.

The actual Google basemap will load with markers for pickup, passenger destination and car destination. **Vehicle marker movement and dotted connector lines remain simulations, not driver GPS or road navigation.** Google Maps Platform is usage billed; configure quotas and budget alerts before deployment. No Google key is stored in the repository.

When the key is absent or rejected, the app displays OpenStreetMap as an actual map fallback. The prototype lets a user optionally grant browser geolocation access for the pickup point; it does not track a driver.

## Optional Supabase backend

1. Create a Supabase project and enable Email Auth.
2. Apply [supabase/schema.sql](supabase/schema.sql) in its SQL Editor.
3. Add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the deployment (also to `.env.local` locally).
4. Restart/redeploy. The login/register pages switch from demo-only mode to Supabase Auth.
5. Test registration, email confirmation where required, login, recording a demo request and logout.

The Next.js `/api/auth` handler sets HttpOnly SameSite cookies and verifies Supabase sessions. The `/api/trips` handler stores *demo request records* in a Supabase Postgres table protected by Row Level Security; only the authenticated user may read/write their records. Server/API credentials are not checked into version control. Never put a service-role key in a `NEXT_PUBLIC_` variable.

**Important:** database-backed demo records do **not** dispatch drivers or constitute real bookings, verification, payment, insurance, or live location sharing. Those would require production integrations, safety controls, operator validation, legal/commercial agreements and end-to-end testing.

## Useful commands

```bash
npm run dev         # local development
npm run typecheck   # TypeScript check
npm run test        # fare calculation unit tests (Node.js 22)
npm run build       # production build
npm run start       # run production build
```

CI runs these checks on pushes and pull requests. Inspect GitHub Actions for the latest result; a commit being pushed does not mean that its build or deployment succeeded.

## Areas intentionally not operational

- No real towing fleet, driver dispatch, route-aware navigation, two-way driver chat, GPS streaming, or push notifications.
- No payment gateway, settled balance, insurer contract or verified workshop affiliation.
- Demo prices/ETAs use a geodesic approximation and are **not actual service quotes**.
- Driver dashboard is a separate **illustrative simulator**, not a verified operator portal.
- Reset-password email requires the hosted Auth provider and is not available in offline demo mode.

For a production product, implement driver/vehicle roles, verified operator onboarding, backend-authoritative trip state transitions, location consent and retention, payments/receipts, rate limits, audit logs, incident reporting and end-to-end tests before real use.

© 2026 TROBOS Academic Prototype.
