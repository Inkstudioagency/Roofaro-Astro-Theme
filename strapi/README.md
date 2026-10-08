# Roofaro CMS (Strapi 5)

The headless CMS behind the Roofaro Astro theme. It powers the two dynamic parts of the site: **Services** and **Works** (case studies).

## Content model

| Content type | Kind | Fields | Used on |
|---|---|---|---|
| **Service** (`api::service.service`) | Collection, draft & publish | `name`, `slug` (UID), `number` (display order, "01/04"), `summary`, `thumbnail`, `keyPoints` (Blocks), `statNumber`, `statText`, `bannerImage`, `overviewTitle`, `overviewImages` (multiple), `overviewSummary`, `solutionTitle`, `solutionSummary`, `solutionImage`, `solutionCards` (Feature card ×n), `materialTitle`, `materialSummary`, `materialCards` (Feature card ×n) | Home slider, `/portfolio`, `/services/[slug]` |
| **Work** (`api::work.work`) | Collection, draft & publish | `title`, `slug` (UID), `summary`, `category`, `thumbnail`, `bannerImage`, `projectDuration`, `roofArea`, `energySavings`, `warranty`, `buildingTitle`, `buildingImages` (multiple), `overview`, `overviewImage`, `challengeTitle`, `challengeSummary`, `challengeImage`, `approachTitle`, `approachSummary`, `approachImage`, `impactTitle`, `impactSummary`, `impactCards` (Feature card ×n) | Home "Works", `/work/[slug]` |
| **Feature card** (`shared.feature-card`) | Component | `icon` (image, SVG recommended), `title`, `description` | Service solutions & materials, Work impact |

Ordering: services by `number` (ascending); works newest first (`createdAt`).

Tips:
- `keyPoints` renders as "Key Highlights" + a bullet list on the service cards: one paragraph followed by a bulleted list.
- Project stats that start with a number (`12 Days`, `25%`) count up when they scroll into view.
- The design shows 4 solution cards, 4 material cards and 6 impact cards; other counts work too.

The schemas live in `src/api/*/content-types/*/schema.json` and `src/components/shared/feature-card.json`.

## Setup

```bash
npm install
cp .env.example .env     # replace every "tobemodified" value with a random string
npm run develop          # http://localhost:1337/admin
```

On startup, `src/index.ts` gives the **Public** role read-only access (`find`, `findOne`) to Service and Work, so the Astro build can fetch published content without a token. Set `STRAPI_PUBLIC_READ=false` and use a read-only API token (`STRAPI_API_TOKEN` in the Astro `.env`) if you prefer a private API.

## Strapi MCP server

`config/server.ts` enables the [Strapi MCP server](https://docs.strapi.io/cms/features/strapi-mcp-server) (Strapi 5.47+), so AI clients can list, create, update and publish Services and Works and manage the Media Library at `http://localhost:1337/mcp`. It's on by default in development; set `MCP_ENABLED=true` to enable it in production.

Create an **Admin token** (Settings → Admin tokens). Its permissions decide which tools the client gets. Then connect, for example, Claude Code:

```bash
claude mcp add strapi-mcp --transport http http://localhost:1337/mcp \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## Demo content (seed)

`seed/data.json` holds the demo services and works, and `seed/media` holds their images and icons. `scripts/seed.mjs` imports them **through the MCP server**:

- media files are uploaded with the admin upload endpoint (the MCP server can't upload files), and their alt text is set with `media_update_asset`;
- services and works are matched by slug and created or updated with the `create_*` / `update_*` tools, then published with `publish_*`;
- the key-point HTML is converted to Strapi Blocks;
- at the end, published counts are checked against the seed file.

```bash
STRAPI_ADMIN_TOKEN=<admin token> npm run seed -- --dry-run   # preview
STRAPI_ADMIN_TOKEN=<admin token> npm run seed
```

The seed is idempotent, so running it again updates the existing entries instead of duplicating them.

## Uploads and SVG

Feature-card icons are SVG, so SVG uploads are allowed (`UPLOAD_ALLOW_SVG=true`, see `config/plugins.ts`). An SVG can contain scripts when it is opened directly from the Strapi domain, so give Media Library access only to trusted editors, or set `UPLOAD_ALLOW_SVG=false` and use PNG/WebP icons. The Astro site renders icons with `<img>`, where scripts never run.

## Deploying

Use any Strapi host and a production database (PostgreSQL recommended, see `config/database.ts`). For media, configure an upload provider (S3, Cloudinary…) or make sure `/uploads` is publicly reachable. Add a webhook (Settings → Webhooks) that triggers a rebuild of the Astro site when content is published.
