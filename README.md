# Roofaro — Roofing Company Theme for Astro

**Live demo:** https://roofaro-astro.vercel.app

Roofaro is a modern website theme for roofing contractors and construction businesses, built with **Astro 7** and **Strapi 5**. It ships a full marketing site with smooth scroll animations, sliders, a contact form, and two CMS-driven collections: **Services** and **Works** (case studies).

## Features

- 9 page templates: Home, About, Services, Service detail, Work detail, Contact, Style Guide, 404, 401
- Strapi 5 headless CMS for Services and Works, with ready-made demo content
- Static output (no server needed), fast and SEO-friendly: canonical URLs, Open Graph, sitemap, robots.txt, JSON-LD FAQ
- Scroll-reveal and split-text heading animations, number counters, Lenis smooth scrolling
- Responsive at every breakpoint (desktop, tablet, mobile), with a slide-in mobile menu
- Contact form that works with any form backend (Formspree, Web3Forms, Basin, your own API)
- No UI framework, no Tailwind: plain Astro components and the theme's original CSS

## Quick start

Requirements: **Node.js 22.12+** and npm.

**Preview without a CMS:** run `npm install && npm run dev` with `STRAPI_URL` empty (or no `.env`). The site then renders the bundled demo content from `strapi/seed`, so you can try the theme before setting up Strapi. The live demo is built this way.

**With Strapi:**

```bash
# 1. Astro site
npm install
cp .env.example .env

# 2. Strapi CMS (in a second terminal)
cd strapi
npm install
cp .env.example .env        # replace every "tobemodified" value with a random string
npm run develop             # http://localhost:1337/admin → create your admin user

# 3. Demo content (Strapi admin → Settings → Admin tokens → create a token, then:)
STRAPI_ADMIN_TOKEN=<admin token> npm run seed

# 4. Back in the project root
npm run dev                 # http://localhost:4321
```

When `STRAPI_URL` is set, the site reads its CMS content from Strapi **at build time**, so Strapi must be running for `npm run dev` and `npm run build`.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Start the Astro dev server on `localhost:4321` |
| `npm run build` | Build the static site to `./dist/` |
| `npm run preview` | Preview the production build |
| `npm run strapi:dev` | Start Strapi (`strapi develop`) on `localhost:1337` |
| `npm run strapi:seed` | Import the demo content into Strapi (needs `STRAPI_ADMIN_TOKEN`) |

## Project structure

```
src/
  config/       site.ts (brand, contact, social, SEO), navigation.ts (menus)
  data/         faq.ts, team.ts, testimonials.ts (static content)
  layouts/      BaseLayout.astro
  components/
    global/     Header, Footer, SEO
    sections/   one folder per page + shared/ (Breadcrumb, Cta, Faq, Process, Testimonials)
    cards/      ServiceCard, WorkCard, FeatureCard, TeamCard
    ui/         Button
  lib/          strapi.ts (REST client), cms.ts (queries), blocks.ts (rich text), types.ts
  pages/        routes; services/[slug].astro and work/[slug].astro are generated from Strapi
  scripts/      forms.ts
  styles/       theme CSS + custom.css (your overrides)
public/         fonts/, images/, js/ (animation runtime, GSAP, Lenis)
strapi/         Strapi 5 project: content types, MCP-based seed script, demo content
```

## CMS (Strapi)

| Content type | Used on |
|---|---|
| **Service** — name, slug, number, summary, thumbnail, key points, stat, banner, overview (title, images, summary), solutions (title, summary, image, cards), materials (title, summary, cards) | Home services slider, `/portfolio`, `/services/[slug]` |
| **Work** — title, slug, summary, category, thumbnail, banner, 4 project stats, building (title, images), overview (text, image), challenge, approach, impact (title, summary, cards) | Home "Works" list, `/work/[slug]` |
| **Feature card** (component) — icon, title, description | Service solutions & materials, Work impact |

Services are ordered by their **number**; works are listed **newest first**. Only **published** entries appear on the site. After you publish changes, rebuild the site (in production, add a Strapi webhook that triggers your host's deploy hook).

The Strapi project enables the official **Strapi MCP server** (`/mcp`), so AI assistants can manage content. See [`strapi/README.md`](strapi/README.md).

## Configuration

Environment variables (`.env`):

| Variable | Description |
|---|---|
| `STRAPI_URL` | Strapi server URL, e.g. `http://localhost:1337`. Empty = bundled demo content |
| `STRAPI_API_TOKEN` | Optional read-only API token (leave empty when the Public role can read content, the default) |
| `SITE_URL` | Public URL of your site (canonical URLs, Open Graph, sitemap) |
| `PUBLIC_FORM_ENDPOINT` | Contact form endpoint. Empty = demo mode (shows the success message, sends nothing) |

Brand, contact details, social links and SEO defaults are in `src/config/site.ts`; menus in `src/config/navigation.ts`.

## Customization

- **Colors, fonts, spacing:** override the CSS variables in `src/styles/custom.css` (the tokens are defined at the top of `src/styles/roofaro-astro-theme.webflow.css`).
- **Logo:** replace the files referenced by `logo`, `logoLight` and `footerWordmark` in `src/config/site.ts`.
- **Static content** (FAQ, team, testimonials): edit the files in `src/data/`. Other copy lives in the section components in `src/components/sections/`.
- **Animations:** add the existing attributes to any element (`reveal-0s` … `reveal-8s`, `to-top-0s` … `to-top-8s`, `section-title`, `hero-title`) to reuse the theme's scroll animations.

## Deployment

1. Deploy Strapi to any Node host with a production database (PostgreSQL recommended) and a media upload provider (or a public `/uploads` folder).
2. Deploy the Astro site to any static host (Vercel, Netlify, Cloudflare Pages…) with `STRAPI_URL`, `SITE_URL` and `PUBLIC_FORM_ENDPOINT` set.
3. Add a Strapi webhook (Settings → Webhooks) that calls your host's deploy hook so content changes rebuild the site.

## Credits

- Design: [Ink Studio](https://www.inks.studio/)
- Built with [Astro](https://astro.build/) and [Strapi](https://strapi.io/)
- Animations: [GSAP](https://gsap.com/) and [Lenis](https://lenis.darkroom.engineering/)
- Fonts: Switzer ([Fontshare](https://www.fontshare.com/)) and Manrope (Google Fonts)
