# Project architecture

## Stack
- **Astro 7**, static output (`astro build` → `dist/`). No UI framework, no islands.
- **Strapi 5** in `/strapi` (own `package.json`, excluded from the Astro `tsconfig`). Content is fetched **at build time**.
- **Global CSS** from the original design in `src/styles/` (no Tailwind).
- **Interactions**: the design's animation runtime `public/js/webflow.js` (scroll reveals, split-text headings, FAQ accordion, sliders, mobile menu) + jQuery + GSAP 3 (`gsap`, `SplitText`, `ScrollTrigger`) + Lenis, all self-hosted and loaded by `BaseLayout`. `public/js/roofaro.js` runs the number counters and Lenis smooth scrolling. `src/scripts/forms.ts` handles form submits.

## Folders
```
src/
  config/       site.ts (brand, contact, social, SEO defaults, wfPages ids), navigation.ts (menus)
  data/         faq.ts, team.ts, testimonials.ts
  layouts/      BaseLayout.astro — <html data-wf-page>, <head>, Header/Footer, scripts
  components/
    global/     Header, Footer, SEO
    sections/   home/, about/, services/, service-detail/, work-detail/, contact/,
                style-guide/, not-found/, password/ + shared/ (Breadcrumb, Cta, Faq, Process, Testimonials)
    cards/      ServiceCard, WorkCard, FeatureCard, TeamCard
    ui/         Button
  lib/          strapi.ts (client), cms.ts (queries + ordering), blocks.ts (rich text), types.ts
  pages/        index, about, portfolio, contact, style-guide, 404, 401, robots.txt.ts,
                services/[slug].astro, work/[slug].astro (getStaticPaths from Strapi)
  scripts/      forms.ts
  styles/       normalize.css, webflow.css, roofaro-astro-theme.webflow.css, lenis.css,
                ix3-initial-states.css (inlined in <head>), custom.css (yours)
public/         fonts/, images/, js/
strapi/         Strapi project: src/api (service, work), src/components/shared/feature-card.json,
                config (MCP enabled), scripts/seed.mjs, seed/ (data.json + media)
```

## Data flow
1. A page (`src/pages/*.astro`) renders `BaseLayout` with `title`, `description`, `wfPage` and a list of section components.
2. CMS sections call `getServices()` / `getWorks()` (Strapi when `STRAPI_URL` is set, otherwise the bundled demo content from `src/lib/demo.ts`) from `src/lib/cms.ts`. Each collection is fetched once per build (cached promise) via `strapiGetAll()` in `src/lib/strapi.ts`, which follows pagination and populates media + components.
3. Media URLs go through `mediaUrl()` (prefixes `STRAPI_URL` for local uploads) and `mediaSrcset()` (responsive formats). Rich text (Strapi Blocks) goes through `renderBlocks()` and is output inside `.w-richtext` with `set:html`.
4. Dynamic routes build one page per entry with `getStaticPaths()`.
5. The Footer's "Service Details" / "Work Details" links resolve to the first Service / Work.
6. In the browser, `webflow.js` runs the interactions for the page id in `<html data-wf-page>`; `forms.ts` intercepts form submits.

## Interaction ids (`wfPage`, see `wfPages` in `src/config/site.ts`)
| Page | Key | id |
|---|---|---|
| Home | `home` | 6ac67a406e52317ce52b4581 |
| Style guide | `styleGuide` | …4582 |
| 401 | `password` | …4585 |
| 404 | `notFound` | …4586 |
| About | `about` | …4589 |
| Work detail | `workDetail` | …458a |
| Contact | `contact` | …458b |
| Services | `services` | …458e |
| Service detail | `serviceDetail` | …4591 |

Attribute-driven animations (`reveal-*`, `to-top-*`, `section-title`, `hero-title`, `button-hover`) work on every page. Page-scoped ones (hero slider images, journey cards, FAQ) run on the page id they were designed for.
