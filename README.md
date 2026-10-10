# HappyLand Hotel Diani — Public Website

This is the standalone visitor-facing website. Deploy this project separately at `https://happylandhoteldiani.co.ke`. The staff booking and operations system is deployed independently at `https://portal.happylandhoteldiani.co.ke`.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Create `.env.local` from `.env.example` and set `BOOKING_SYSTEM_URL` to the staff system origin. The site needs a server-side Next.js deployment; do not use a static export because room pages and the public API proxy use server rendering.

## System integration — priority

- The staff system is the only source of truth for room inventory, rates, date availability, room descriptions/photos, enquiries, and reservations.
- The website reads staff-managed rooms through `GET /api/public/hotel`; room listings and detail pages therefore reflect staff changes without copying a database or synchronizing deploy artifacts.
- The browser reuses the public room catalog for up to 30 seconds across the homepage, room list, and room detail navigation to make room clicks immediate. Date-specific availability is never taken from this catalog: it is checked through the live availability proxy, then checked again by the staff system when a booking is submitted.
- That public catalog includes the staff-managed virtual three-bedroom combinations alongside physical room categories. Use each returned accommodation slug for availability and booking; never expose internal physical room codes or model a combination as local stock.
- Website API routes proxy availability, booking, and enquiry requests to the staff system. Availability is checked again transactionally by the staff system when a visitor confirms a reservation. Reservations are stored there with source `Website`, appear in the staff reservations workspace, and trigger its configured email notifications.
- Guests may submit partial or full M-Pesa payments from the booking confirmation or the reusable `/payment` portal. The portal verifies the booking reference/email against the staff system and displays the live verified balance and pending submissions. Each amount and transaction code is proxied to the staff system; it never stores payment or reservation records locally. Submissions remain pending and staff must verify each transaction before it counts as paid.
- Room images uploaded by staff are served by the staff system and referenced by absolute URLs in the public hotel API. Keep the staff system's database and photo storage durable and reachable from this deployment.
- The website proxies staff photos through its own server-side image route and caches each immutable, unique photo URL for up to one year. Room pages use Next.js image optimization to serve responsive AVIF/WebP variants; the optimized image cache is held by the Next.js deployment, not copied into `public/`. Use persistent cache storage or a CDN in production if the website runs on ephemeral or multiple instances.
- Local photos in `public/images/` are for property-level editorial pages and the gallery only. Bookable room cards and details must use the current room photos from the staff API; never present a bundled image as a live room-category gallery or as live inventory.
- Do not add local production inventory, reservation storage, or a second staff dashboard to this project. `/admin` redirects to the staff system.

After booking, guests should call the hotel to confirm current M-Pesa payment instructions before sending money. The confirmation form accepts partial payments and M-Pesa codes for staff review; it does not collect money or confirm that a payment was received.

## Deploying separately

This is the guest-facing website project. It has its own Dockerfile and Coolify application, separate from the staff system at `https://portal.happylandhoteldiani.co.ke`. Deploy the staff system first and make sure its public API works before setting up this website. The website must use that API; it must not have its own live room inventory, booking database, or payment database.

### Coolify setup: public website

#### 1. Prepare DNS and the staff system

1. Point the `happylandhoteldiani.co.ke` DNS A/AAAA record to the Coolify server. Allow inbound ports `80` and `443`.
2. Deploy the staff booking system first by following `C:\booking_systemf\README.md`.
3. Open `https://portal.happylandhoteldiani.co.ke/api/public/hotel` in a browser. Continue only after it returns hotel content; the website needs to reach this address over HTTPS.

#### 2. Create a separate website application

1. In Coolify, create a new application and connect the Git repository/branch that contains this website. Do not reuse or edit the staff application's settings.
2. Select **Dockerfile** as the build pack. Set **Base Directory** to the directory that actually contains this website's `package.json` and `Dockerfile`:
   - Use `/` when this project is the root of its own repository (the current `C:\dni` arrangement).
   - Use `/dni` only if you intentionally keep the website inside a shared repository under a folder named `dni`.
3. Set **Dockerfile Location** to `/Dockerfile`, relative to the Base Directory. If Coolify asks for a build context, use the same directory as the Base Directory.
4. Set the domain to **`https://happylandhoteldiani.co.ke`**, enable Coolify's HTTPS proxy/certificate, and set the application/container port to **`3000`**.

#### 3. Add the environment variables

In the website application's **Environment Variables** settings, add:

| Variable | Value | Where to set it |
| --- | --- | --- |
| `HOTEL_SITE_URL` | `https://happylandhoteldiani.co.ke` | Build and runtime |
| `BOOKING_SYSTEM_URL` | `https://portal.happylandhoteldiani.co.ke` | Build and runtime; server-only |
| `HOTEL_IMAGE_HOSTS` | Leave empty unless room images come from additional hosts. If needed, enter comma-separated hostnames only, without `https://` or paths. | Build time only |

Coolify may call build-time values **Build Arguments** and runtime values **Environment Variables**. Add each variable at the scopes in the table. Keep `BOOKING_SYSTEM_URL` private: do not name it `NEXT_PUBLIC_BOOKING_SYSTEM_URL` or expose it to browser code. It is a URL, not a credential.

#### 4. Deploy and check the website

1. Save the settings and click **Deploy**. Wait for the build and deployment to finish; check Coolify's build and runtime logs if either fails.
2. Open `https://happylandhoteldiani.co.ke`. Check the home page, room list, room details, and room photos.
3. Check date-specific availability using the site's booking flow. Confirm the website server can reach the staff API and image URLs.
4. Do not make a test booking on the live site unless you are prepared to remove the resulting reservation from the staff system. Website bookings are real staff-system records.
5. Configure rooms, rates, descriptions, amenities, and approved photos in the staff system before publishing. Those changes are fetched from the staff API and do not require a website redeploy.

The website does not need a persistent database or media volume. Do not use static export: this application needs a running Node.js server for room pages and API proxies. Any image-optimization cache is separate from room inventory and reservations; use a persistent cache or CDN only if your Coolify hosting needs it.

### If something does not work

- **Coolify cannot find the Dockerfile or `package.json`:** correct the Base Directory to the folder containing both files. Use `/` for this project's own repository; use `/dni` only for a shared repository that really has a `dni/` folder.
- **Room list is empty or requests fail:** confirm `BOOKING_SYSTEM_URL` is exactly `https://portal.happylandhoteldiani.co.ke`, set at build and runtime, and that the staff API URL above works from outside the server.
- **Room photos fail:** check that room photos are configured in the staff system and that their image host is allowed through `HOTEL_IMAGE_HOSTS` when using a host other than the staff portal.
- **HTTPS does not activate:** check the root-domain DNS record, ports 80/443, and the exact domain configured for this website application.

## Validation

```powershell
npm.cmd run lint
npm.cmd run build
```
