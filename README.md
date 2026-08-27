# Sunrider India Sales Desk - pitch dashboard

Single-file, dependency-free sales dashboard for Sunrider India (modelled sample data over the real product catalogue).

- `sunrider-sales-dashboard.html` - the dashboard (open directly, or serve with `python3 -m http.server 8081`)
- `data.json` - the same dataset in a standalone file (also embedded in the HTML as `DATA`)
- `india-states.svg` - India state outlines used for the geography map (Simplemaps, free for commercial use; attribution appreciated)
- `pincodes.json` - simplified postal pincode boundaries for the nine metros (from the all-India pincode boundary KML) plus a pincode to state/district lookup; fetched on demand, so serve the folder over http for the pincode panel

## What is in it

- Two fiscal years of modelled data: FY2025 (Apr 2024 - Mar 2025, mock prior year) and FY2026 (Apr 2025 - Mar 2026). Every comparison is year-on-year against the same period.
- Sticky header: India + state selector, product search, fiscal year, Full year / Q1-Q4 / Custom month range, channel and category filters, theme capsule.
- Left sidebar switches between pages (Overview, YoY comparison, Sales channels, Products, Buyers, Social & ads, Geography, Distributors, Product table); the profile at the bottom opens a demo popover with edit-profile and change-password dialogs (nothing is stored).
- Overview KPIs, monthly trend with prior-year overlay, and a highlights digest linking into each page.
- Year-on-year comparison: FY2026 vs FY2025 grouped monthly bars, scorecard, and category / channel / state movers.
- Sales channels (direct sale, membership, WhatsApp, affiliate, Meta ads, Google ads): stacked chart, mix, category x channel heatmap. The two paid channels are derived from the ads table so channel and ad numbers reconcile.
- Products: ranking with catalogue images from in.sunrider.com, category mix, year-on-year momentum.
- Buyers: buyer tiles, new vs repeat, age and gender, and what each age group buys.
- Social media and paid ads: spend vs attributed revenue, platform breakdown (Meta, YouTube, Google), Meta funnel, platform efficiency, campaigns table, brand sentiment by platform and theme.
- Geography: every state shaded on the choropleth, metro pins, market bars (Top 12 / all), and a pincode drill-down per metro (real postal boundaries, modelled revenue split, pincode search).
- Distributors: a modelled local distributor network in every state and union territory (tiers, team size, join year, YoY), on a map, in a sortable, searchable table, and summarised by state.
- Sortable, searchable product table.
- Every large card has its own local filters; global filters show as removable chips.

Typeface: Google Sans Flex. Light theme by default.

## Analytics layer (teardown response)

Built in response to the Studio 1947 build review (27 Aug 2026), all on the modelled data:

- Blockers: state filters never fall back to all-India (explicit empty and small-sample banners), every market has orders behind its revenue, and the navigation collapses into a slide-over sheet with search below 900px.
- Trust: one last-click attribution model (Meta, Google and YouTube ads are channels and match the ads page), a 0.05 dead band so no change reads as a decline, rupee-weighted movers with a materiality floor and an "emerging, small base" list, Pareto-skewed distributor revenue with tiers by volume, and channel-specific AOV and repeat behaviour.
- Gaps: customer estimates with cohort retention, time to second order, LTV and CAC by channel; contribution margin by SKU and by channel; distributor health (active rate, signups, dormancy, time to first sale); coverage versus potential by state on household counts; target versus actual with price/volume/mix and new/repeat decomposition; and exception tiles computed from thresholds each refresh.

Cost of goods, commission rates, households, targets, stock cover and cohort curves are modelled inputs in `data.json`; swap them for real files when available.

## Deploy on Vercel

The site is fully static (no build step). `vercel.json` sets `framework: null`, serves the repo root, rewrites `/` to `sunrider-sales-dashboard.html`, and caches the two JSON files. `index.html` is a fallback redirect for hosts that ignore `vercel.json` (GitHub Pages, Netlify).

1. Import the repo in Vercel (Add New Project). Framework preset: **Other**. Leave build command and output directory empty.
2. Deploy. The dashboard opens at `/` (also `/dashboard`); deep links like `/#sec-social` keep working.
3. Nothing else is required: fonts come from Google Fonts, product images from Sunrider's CDN, and `pincodes.json` is fetched from the same origin, so the pincode panel works on Vercel.

Local preview: `python3 -m http.server 8081` in the repo folder, then open `http://localhost:8081/`.

## Access password

`middleware.js` is a Vercel Edge Middleware that gates every path (HTML, JSON, SVG). Visitors get a branded login page at `/login`; a correct password sets a 30-day HttpOnly session cookie, and `/logout` (also the Sign out item in the profile menu) clears it.

The password is read from the `SITE_PASSWORD` environment variable in Vercel (Project → Settings → Environment Variables, then redeploy). If the variable is not set, the fallback in `middleware.js` is used. To rotate the password, change the variable and redeploy; existing sessions stop working immediately because the cookie is derived from the password.

The gate only runs on Vercel. The local preview server does not enforce it.
