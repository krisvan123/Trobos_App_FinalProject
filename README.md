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
6. In Supabase Auth URL Configuration, add `https://YOUR-HOST/reset-password` (and the local equivalent) to the redirect allow-list to enable email password recovery.

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


## TROBOS 2.0 — responsive map-first UI

- **Phone:** full-viewport map, floating pickup header, scrollable rescue sheet and five-tab mobile navigation.
- **Tablet:** separate rescue panel beside a large map with map-focused controls.
- **Desktop:** slim app rail, dedicated control panel and immersive interactive map.
- **Theme:** custom slate/midnight colors, restrained copper accents, night map tiles and reduced-motion support.
- **Preview:** select “Lihat animasi dua kendaraan” on the home screen to instantly play the independent passenger and towing animation. The driver search demo is available via the booking flow.
- **Installable app appearance:** `/manifest.webmanifest` (generated by Next.js) sets standalone display. Offline operation and native mobile packages are *not* implemented.
- **Maps:** Google Maps JavaScript API + **Routes API** (new Routes library, not legacy Directions API) are needed for Google turn-by-turn road geometry. Without Google Maps configured, the app uses Leaflet with keyless OpenStreetMap standard tiles for light and a CSS night treatment for dark mode. Optional `NEXT_PUBLIC_CARTO_BASEMAPS_API_KEY` enables native CARTO light/dark tiles; CARTO requires its own free-tier key. If that key is invalid, the app falls back to OpenStreetMap instead of showing watermarked tiles. The OSM public tile service is best-effort and appropriate only for small prototype traffic; obey the OSM tile usage policy and use a dedicated tile provider for a production app. Map routing may retrieve *preset public demo coordinates only* via the public OSRM routing demo (attribution required, no uptime guarantee). Personal GPS coordinates are **never sent to OSRM**. If routing is unavailable, the polyline is labelled illustrative.

The animation is an experience prototype, not actual traffic/navigation or driver telemetry. Do not use demo route suggestions for a real emergency.

To obtain an optional CARTO key, visit https://www.carto.com/basemaps/apikey/ . A Google Maps browser API key and a CARTO basemaps key are **different** and are never bundled in the repository.

## TROBOS Premium Public Experience

Landing, sign-in, sign-up, account recovery and password reset use the same
midnight/copper brand tokens as the application dashboard, with custom layouts
for phones, tablets and desktop. The landing hero uses a **real interactive
basemap** (Google Maps when configured, OpenStreetMap otherwise).

Moving passenger vehicles, cars and flatbed towing trucks now use hand-crafted
top-down **SVG vehicle silhouettes** instead of emoji/sticker markers. The
orientation is calculated from the local route geometry and follows bends,
while each simulated vehicle advances independently. The icons are source-owned,
scalable and do not imitate Gojek/Grab trade dress or logos. No real driver GPS
data is used.

In backend-free demo mode, the public login page never asks for a real password.
The registration page only requests a demo display name and acknowledgement,
not unnecessary passwords or contact details. Real signup/authentication
is enabled only with the configured Supabase service.

### Service-specific vehicle tracking
For **Tandem**, the customer car is depicted as a car driven to the passenger destination. For **Rescue**, the second tracked vehicle is a flatbed tow truck heading for the chosen workshop. Both are fictional demo routes; no vehicle telemetry or dispatch is available.

## Booking-first prototype (October 2026)

Guest booking and tracking are available without registration. The dashboard
begins with a **trip planner rather than a map**; after the user confirms
the demo booking, the full-screen map and tracking sheet appear. Users may
choose from several illustrative Jakarta pickups or explicitly authorize
device GPS. Destination options are independent of the pickup.

For Rescue, the car is automatically assigned to the **geographically nearest
example workshop from the passenger destination**. This compares preset
latitude/longitude values by straight-line distance, not verified business
locations, road ETA, operating hours or live capacity. The fallback map may
illustrate routes if real road routing is unavailable.

Search and travel animations have been slowed down for demonstration.
Sign-in and registration are optional; the Supabase demo trip archive is
used only for a signed-in session when Supabase is configured.

## Frontend redesign — booking to tracking

The October 2026 frontend refresh replaces the duplicated orange prototype
forms with a single cohesive booking-first journey experience:

- **Before booking:** a responsive, scrollable planner and branded two-route
  concept visual (not a live map). Configure service, optional device location
  or Jakarta demo pickup, passenger destination, passenger count and demo
  vehicle. Rescue shows the closest example workshop relative to the
  passenger destination.
- **Review:** an accessible, branded order summary with explicit disclaimers
  and a confirm-to-track action. No fake payment checkout.
- **After booking:** a full-screen real basemap (Google only if API key and
  Routes API are correctly configured; otherwise OpenStreetMap) with
  separately animated vehicle silhouettes and compact tracking overlays.
- **Journey stages:** dispatch, PIN, inspection and completion all share
  the same copper/midnight visual system, with production developer controls
  hidden and expandable secondary tracking actions on mobile.

The public location presets, map routes, prices, PIN and drivers are
demonstration data. Passing automated tests and production builds does not
replace testing the deployed app directly on real phone/tablet browsers.

## Distinct rescue routes and independent animation skipping

The Rescue prototype uses **separate endpoint coordinates** for passenger
destination and illustrative workshop. The workshop fixtures are explicitly
labelled as unverified demo points; they are not real dispatch partners.
The passenger route is solid blue, while the tow-truck route is dashed
copper. Road segments can naturally overlap near the pickup, but they split
towards their independent destinations. Previously persisted Rescue
bookings are migrated to the corrected example workshop coordinates.

During the approach phase, users may skip the pickup animation. Once the
trip has started, **Skip penumpang** and **Skip derek/Skip mobil** advance
their respective vehicle independently. The remaining animated vehicle
continues automatically, regardless of which finishes first. The journey
only completes after both progress values reach 100%.

## Prototype quality pass — October 21, 2026

- **Map and route selection:** all predefined pickup, destination and workshop
  coordinates are eligible for keyless road routing. Each road leg is requested
  independently. If unavailable, its fallback is visibly called an illustration
  rather than real road navigation. A separate optional map picker supports
  searching *preset* locations or tapping a point. Arbitrary GPS/map-selected
  coordinates are never forwarded to the public OSRM demo service.
- **Operator demo:** the customer and driver/operator pages use the same
  persisted Zustand trip state and demo chat messages **when navigating on the
  same browser tab**. This is *not* real-time dispatch across devices or a real
  communication service.
- **Trust:** safety/help/chat disclaim that insurance, operator verification,
  call center, phone and towing partnerships are not active.
- **Quality:** regression tests check routing constraints, store integration and
  prototype safety labels. CI continues to run Node tests, TypeScript and a
  Next.js production build. Real phone/tablet browser testing, automated
  cross-device E2E testing and live routing availability still require
  separate verification.

### Manual visual acceptance checks

1. At 375px, 768px and 1440px, verify the booking form, theme and bottom
   navigation have no clipped buttons or horizontal overflow.
2. Choose Mega Kuningan pickup and SCBD destination; inspect preview and
   confirm. Switch to Rescue and verify the workshop differs from passenger
   destination when appropriate.
3. Try the preset search and map-pin selector. Custom coordinates must display
   fallback routing honestly; do not assume Google/OSRM routing is available.
4. Place a demo booking, navigate to /driver *in the same tab*, verify its
   location/status, send a reply, navigate back and verify chat.
5. Skip either vehicle during tracking and confirm the other continues.
6. Check help tutorial, safety disclosures, dark mode, profile and vehicles.
7. Refresh an unfinished demo and confirm the state loads without stale
   alerts, phantom drivers, or false insurance/verification claims.

## Presentation-safe simulation clock (October 2026)

The authoritative demonstration timeline is now controlled by
`DemoSimulationRuntime` in the root layout and stored timestamps:
`searchStartedAt`, `approachStartedAt` and `travelStartedAt`.
The map **renders** fractional marker positions but no longer changes the
status itself. Browser navigation between `/app` and `/driver`, or a
page refresh in the same browser, can resume progress from these saved times.
Skip actions remain independent, so one vehicle finishing doesn't stop the
other. Previous trips lacking timestamps safely start a new demo clock from
their last saved position when loaded.

For live presentations, the tracking header includes a **restart demo**
control with explicit confirmation. Restarting ends the current simulation
but doesn't clear completed trip history. Use this to switch between Tandem
and Rescue during a talk.

These are *client-side demonstration clocks*, not a backend authoritative
travel timeline. The operating-system clock can be changed and multiple
devices are not synchronized. The app still needs direct visual checks at
the target venue before claiming complete reliability.
