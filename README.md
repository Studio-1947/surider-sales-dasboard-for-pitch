# Sunrider India Sales Desk - pitch dashboard

Single-file, dependency-free sales dashboard for Sunrider India (modelled sample data over the real product catalogue).

- `sunrider-sales-dashboard.html` - the dashboard (open directly, or serve with `python3 -m http.server 8081`)
- `data.json` - the same dataset in a standalone file (also embedded in the HTML as `DATA`)
- `india-states.svg` - India state outlines used for the geography map (Simplemaps, free for commercial use; attribution appreciated)
- `pincodes.json` - simplified postal pincode boundaries for the nine metros (from the all-India pincode boundary KML) plus a pincode to state/district lookup; fetched on demand, so serve the folder over http for the pincode panel

## What is in it

- Two fiscal years of modelled data: FY2025 (Apr 2024 - Mar 2025, mock prior year) and FY2026 (Apr 2025 - Mar 2026). Every comparison is year-on-year against the same period.
- Sticky header: India + state selector, product search, theme capsule; second row with fiscal year, Full year / Q1-Q4 / Custom month range.
- Left sidebar navigation with scroll-spy and the signed-in profile.
- Overview KPIs, monthly trend with prior-year overlay.
- Sales channels (direct sale, membership, WhatsApp, affiliate): stacked chart, mix, category x channel heatmap.
- Products: ranking with catalogue images from in.sunrider.com, category mix, year-on-year momentum.
- Buyers: new vs repeat, age and gender.
- Social media and paid ads: spend vs attributed revenue, platform breakdown (Meta, YouTube, Google), Meta funnel, campaigns table, brand sentiment by platform and theme.
- Geography: every state shaded on the choropleth, metro pins, market bars (Top 12 / all), and a pincode drill-down per metro (real postal boundaries, modelled revenue split, pincode search).
- Sortable, searchable product table.
- Every large card has its own local filters; global filters show as removable chips.

Typeface: Google Sans Flex. Light theme by default.
