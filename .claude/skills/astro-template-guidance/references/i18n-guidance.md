# Multi-language (i18n)

Roofaro ships in **English only**; there is no built-in translation system. To add languages:

1. Enable Astro i18n routing in `astro.config.mjs`:
   ```js
   i18n: { locales: ['en', 'de'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } }
   ```
2. Move pages for other locales into `src/pages/<locale>/…` and set `<html lang>` in `BaseLayout` from `Astro.currentLocale` instead of `site.locale`.
3. Static copy lives in the section components and `src/data/`; extract strings into `src/i18n/<locale>.ts` dictionaries and read them with a small `t(key)` helper.
4. Strapi: enable **Internationalization** on Service and Work (Content-Type Builder → Advanced settings → *Enable localization*), then add `locale=<code>` to the queries in `src/lib/cms.ts` and generate `getStaticPaths` per locale.
5. Add `hreflang` alternates in `src/components/global/SEO.astro` and set `i18n` in the `@astrojs/sitemap` options.

See https://docs.astro.build/en/guides/internationalization/ and https://docs.strapi.io/cms/features/internationalization.
