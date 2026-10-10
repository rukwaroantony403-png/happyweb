<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Priority: public website integration boundary

- This folder is a standalone public website, deployed separately at `https://happylandhoteldiani.co.ke`; the staff booking/operations app is deployed independently at `https://portal.happylandhoteldiani.co.ke`.
- The parent app is authoritative for rooms, rates, availability, images, enquiries, and reservations. Keep `BOOKING_SYSTEM_URL` pointed at the staff app. Website API handlers must proxy public reads/writes to that system; do not create local production reservations, inventory, or a copied SQLite database.
- The visitor website owns presentation and content that is not managed in the staff system. Staff-managed room data and photos must come from the public hotel API; successful public bookings must be recorded by the staff app with source `Website`.
- The supplied inventory is 20 physical units: 5 studios, 10 one-bedroom, and 5 two-bedroom units. Three-bedroom accommodations are virtual products assembled by the staff system from A2+A3, C2+C3, and D2+D3. Display the products returned by the live API, book using their accommodation slugs, and never publish the internal component room codes or create local inventory for them.
- The staff system owns the component-level availability lock: a combination reserves all of its physical units together. Do not infer component mappings or availability in this website.
- Treat the split deployment and live synchronization as a priority when changing either application. Coordinate public API or photo URL changes with the parent app, and keep this folder's deployment instructions current.
