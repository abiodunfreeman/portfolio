# North Coast Heating & Cooling

A complete marketing-site demo for a fictional residential HVAC company serving Cleveland and its suburbs. Built with React, TypeScript, MUI, Tailwind CSS, and Vite. This project is independent of the sibling `portfolio_app`.

## Run locally

Requires Node.js 22.13 or newer.

```sh
cd north_coast_hvac
npm install
npm run dev
```

Open [http://127.0.0.1:5174](http://127.0.0.1:5174). The local Vite server includes `/api/chat`, so Frosty works with one command. No API key is required.

```sh
npm test
npm run lint
npm run format:check
npm run build
npm run preview
```

The production preview runs at [http://127.0.0.1:4174](http://127.0.0.1:4174) and also includes the local chat route. Format the source with `npm run format`.

## Deploy on Vercel

1. Import the repository into Vercel.
2. Set **Root Directory** to `north_coast_hvac` (or leave it blank if deploying this folder as its own repository).
3. Select **Vite**, with build command `npm run build` and output directory `dist`. Use Node.js 22 or newer.
4. Deploy. The included `vercel.json` routes page refreshes correctly and leaves `/api/chat` available as a Node serverless function.

Frosty works immediately in demo mode. To enable model-generated FAQ answers, add `OPENAI_API_KEY` in Vercel's environment settings and redeploy. Locally, copy `.env.example` to `.env.local`, add the key, and restart the dev server. `OPENAI_MODEL` defaults to `gpt-5.6-luna` and can be changed to a model available to your API project. Never prefix the key with `VITE_`; it belongs only on the server.

The adapter uses OpenAI's Responses API with a fresh business-specific system prompt on each request, bounded history, an eight-second upstream timeout, and `store: false`. No paid API call is needed for the demo or automated tests. Tests mock the live API; an actual key-enabled integration needs to be verified in your own deployment.

## Pages and demo flows

- **Home:** emergency phone CTA, service cards, suburbs, six-review carousel, FAQ accordion, hours, and trust badges.
- **Services:** AC repair, furnace installation, and maintenance details with illustrative ranges and preselected booking links.
- **Reviews:** all six sample testimonials and the illustrative 4.9-star rating.
- **Contact / Book:** validated name, phone, service, preferred date, and time window; local confirmation with a reference number. `/contact` redirects to `/book`.
- **Frosty:** available across pages. Try “Service area,” “What does a diagnostic cost?”, “Emergency help,” “Request a callback,” or “Book an appointment.” The widget falls back to the same rule-based answers if the API is unavailable. Callback collection runs locally and asks for confirmation before saving; those structured name/phone messages are excluded from model history.

Bookings and callbacks are appended to `localStorage` under `north-coast-demo-requests-v1`. They survive refreshes in the same browser. They are not sent to a company, emailed, or turned into actual appointments. Use sample details. Remove that single storage entry in browser developer tools to reset saved requests. Chat history itself is only kept in memory.

For a live backend, replace the clearly marked `LIVE INTEGRATION` sections in `src/pages/Booking.tsx` and `src/components/Frosty.tsx` with a POST to your Spring Boot endpoint. Show success only after the backend accepts the request; the backend should validate details and confirm availability. The chat route's rate limit is intentionally instance-local; a public paid integration should use a shared limiter.

## Code map

- `src/main.tsx`: entry point and quick-start comment; MUI theme and CSS-layer providers.
- `src/pages/`: the four pages.
- `src/components/Frosty.tsx`: chat UI, callback flow, and browser fallback.
- `src/lib/requests.ts`: booking validation and shared local storage.
- `shared/business.ts`: company details, services, price ranges, FAQs, and testimonials.
- `shared/chat.ts`: deterministic answers used by both client and server.
- `server/chatService.ts`: system prompt, request validation, and OpenAI integration.
- `server/chatHttp.ts`: shared HTTP adapter for local development and Vercel.
- `api/chat.ts`: Vercel function entry point.
- `src/styles.css` and `src/theme.ts`: responsive design and MUI customization.
- `tests/`: meaningful checks for request validation, model fallback, HTTP handling, dates, and storage failures.

All reviews, licensing claims, ratings, prices, and contact details are fictional demonstration content. The phone uses a reserved fictional 555 number, and the hero photo is AI-generated. Replace them with verified business details before adapting this demo for a real company.

Integration references: [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite), [MUI with Tailwind CSS v4](https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/), and [OpenAI text generation](https://developers.openai.com/api/docs/guides/text).
