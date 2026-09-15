# Abiodun Freeman — portfolio

A responsive portfolio for freelance clients and employers, built with React,
TypeScript, Vite, and Tailwind CSS. The visual direction pairs a dark background
with vivid orange accents, generous typography, and interactive details.

## Run locally

Use Node.js 24 LTS and npm. From this folder:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. The page updates as you edit the files.

## Make it yours

- `src/data/portfolio.ts`: edit the project stories, services, experience, and contact
  details. The North Coast entries include `liveUrl` links to their deployed
  front-end demos. Keep claims and links grounded in your actual work.
- `src/App.tsx`: update the page sections, skills, process copy, and interactions.
- `src/components/SiteHeader.tsx`: update the header navigation and direct email link.
- `src/hooks/useCopyEmail.ts`: shared clipboard feedback for both email copy buttons.
- `src/index.css`: update the colors, typography, and visual effects.
- `index.html`: update the browser title and search/social descriptions.
- `public/social-card.png`: the 1200 × 630 image used when sharing the site.
- `public/resume.txt`: the downloadable, unchanged copy of the original resume.
  Replace this copy when you update your resume.

Fonts are installed locally through Fontsource and bundled by Vite. Visitors do
not need to fetch fonts from Google Fonts.

The project visuals in `src/components/ProjectVisual.tsx` and
`src/components/NorthCoastVisual.tsx` are original concept illustrations, labeled
on the page. The North Coast cards and project details link to their interactive
front-end demos. The other illustrations communicate the kind of work described
in the resume without using screenshots of internal client applications.

The hero sculpture lives in `src/components/OrbitSculpture.tsx`. Visitors can
pause or play its animation with the button on the sculpture. Animation starts
paused when the visitor's system requests reduced motion, and rendering pauses
when the sculpture is off screen or the browser tab is hidden.

## Format and check

```sh
npm run format
npm run format:check
npm run lint
npm run build
```

Prettier uses two-space indentation, single quotes, semicolons, and automatic
Tailwind class sorting. Install the **Prettier — Code formatter** extension in
VS Code to use the included format-on-save settings.

The production build runs TypeScript checking before generating the `dist`
folder. To view that build locally:

```sh
npm run preview
```

## Deploy to Vercel

1. Push the portfolio repository to your Git provider.
2. Import that repository into Vercel.
3. Set **Root Directory** to `portfolio_app`.
4. Use **Vite** as the framework, **npm run build** as the build command, and
   **dist** as the output directory. The included `vercel.json` sets these build
   options and uses `npm ci` to install the locked dependencies.
5. Deploy. Vercel will publish subsequent pushes automatically when the project
   is connected to your Git repository.

If you upload `portfolio_app` as its own repository, leave Root Directory at the
repository root instead. This is a static site and requires no environment
variables or backend service.

The canonical URL and social preview URLs in `index.html` use
`https://abiodunfreeman.com`, the domain listed in the resume. If you deploy to a
different production domain, update the canonical link, `og:url`, `og:image`,
and `twitter:image` to that domain. Keep the social image URLs absolute and make
sure `/social-card.png` is publicly reachable on the production domain.

The contact links open the visitor's email application; they do not submit to a
server. This project has not been deployed on your behalf.
