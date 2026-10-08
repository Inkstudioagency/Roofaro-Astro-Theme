# Site configuration

## `src/config/site.ts`
| Key | Used for |
|---|---|
| `name` | `og:site_name` |
| `url` | Fallback site URL (the `SITE_URL` env var wins, via `astro.config.mjs`) |
| `defaultTitle`, `defaultDescription`, `ogImage` | SEO fallbacks |
| `contact.email`, `contact.phone`, `contact.phoneHref`, `contact.address` | Footer + Contact page |
| `social[]` (`label`, `href`, `icon`: `facebook` \| `x` \| `instagram` \| `linkedin`) | Footer icons. Keep root domains in demos. |
| `logo`, `logoLight`, `footerWordmark` | Header, mobile menu / footer, footer bottom |
| `footerSummary`, `copyright`, `credits` | Footer |
| `webflowSiteId`, `wfPages` | Interaction runtime ids — don't change |

## `src/config/navigation.ts`
- `headerNav`, `headerCta` — header links and the "Get a Quote" button.
- `footerQuickLinks` (`{firstService}` / `{firstWork}` placeholders resolve to CMS entries), `footerUtilityLinks`, `footerBottomLinks`.

## Per-page SEO
Pass `title`, `description` (and optionally `image`, `noindex`, `jsonLd`) to `BaseLayout` in each `src/pages/*.astro`. Service and work pages use the entry name, summary and banner image automatically.

## Environment (`.env`, see `.env.example`)
`STRAPI_URL` (empty = bundled demo content, no CMS needed), `STRAPI_API_TOKEN` (optional), `SITE_URL`, `PUBLIC_FORM_ENDPOINT`.
