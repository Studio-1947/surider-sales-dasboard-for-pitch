# Sunrider India Sales Desk - pitch dashboard

Single-file, dependency-free sales dashboard for Sunrider India (modelled sample data over the real product catalogue).

- `sunrider-sales-dashboard.html` - the dashboard (open directly, or serve with `python3 -m http.server 8081`)
- `data.json` - the same dataset in a standalone file (also embedded in the HTML as `DATA`)
- `india-states.svg` - India state outlines used for the geography map (Simplemaps, free for commercial use; attribution appreciated)

Features: period / region (state) / channel / category filters, KPIs with prior-period deltas, revenue trend with prior-period overlay, sales-channel stack (direct, membership, WhatsApp, affiliate), category × channel heatmap, product ranking with catalogue images, momentum movers, buyer profile, choropleth pin map, sortable and searchable product table. Typeface: Google Sans Flex.
