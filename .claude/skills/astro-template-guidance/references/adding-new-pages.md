# Adding a new page, route or section

## New static page
1. Create `src/pages/<route>.astro`:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import Breadcrumb from '../components/sections/shared/Breadcrumb.astro';
   import Faq from '../components/sections/shared/Faq.astro';
   import Cta from '../components/sections/shared/Cta.astro';
   import { wfPages } from '../config/site';
   ---
   <BaseLayout title="Pricing || Roofaro" description="…" wfPage={wfPages.about}>
     <Breadcrumb subtitle="PRICING" title="Fair prices, no surprises." summary="…" />
     <Faq />
     <Cta />
   </BaseLayout>
   ```
2. **`wfPage` is required.** It selects which page's animations run. Reuse the id of the page whose sections you reuse (see `project-architecture.md`). The shared reveal animations work with any id.
3. Add the link to `src/config/navigation.ts` (`headerNav`, `footerQuickLinks` or `footerUtilityLinks`).
4. Utility pages that shouldn't be indexed: pass `noindex` to `BaseLayout` and add the route to the sitemap `filter` in `astro.config.mjs`.

## New section
- Create `src/components/sections/<page>/<Name>.astro` (or `shared/` if used on several pages).
- Reuse the existing classes from `src/styles/roofaro-astro-theme.webflow.css` (e.g. `section-gap`, `container-main w-container`, `section-heading-block`, `heading-style-2`, `text-size-large`).
- Buttons: `<Button kind="primary|secondary" variant="v1|v2" href="/contact" text="Free Inspection" />`.
- Add scroll animations with the existing attributes: `section-title=""` on headings, `reveal-0s=""` … `reveal-8s=""` or `to-top-0s=""` … `to-top-8s=""` on blocks, `hero-title=""` in heroes.
- Repeated items → make a card component with typed `Props` and map over an array (see `src/data/`).
- New CSS goes in `src/styles/custom.css`.

## New CMS-driven route
1. Add the content type in Strapi (`strapi/src/api/<name>/content-types/<name>/schema.json` + controller/route/service, copy the `work` ones), restart Strapi and add its uid to `PUBLIC_READ` in `strapi/src/index.ts`.
2. Add a TypeScript interface in `src/lib/types.ts` and a cached getter in `src/lib/cms.ts` using `strapiGetAll()` with explicit `populate[...]` params.
3. Create `src/pages/<route>/[slug].astro` with `getStaticPaths()` returning `{ params: { slug }, props: { item } }`.
