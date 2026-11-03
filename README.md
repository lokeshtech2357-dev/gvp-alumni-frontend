# GVP Alumni Frontend

Standalone Next.js 15.5.29 frontend for the GVP Alumni website.

## Local development

1. Install Node.js 18.18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the backend origin (for example, `http://localhost:5000`). The frontend also accepts an origin ending in `/api`.
4. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` if Google sign-in is enabled.
5. Run `npm run dev`; use `npm run build` to create a production build.

Image and video uploads request a short-lived signature from the authenticated backend and send the media directly to Cloudinary. Configure the Cloudinary credentials on the backend, never in this frontend.
