# Content management

## Strapi (services + works)
Content types (schemas in `strapi/src/api/*/content-types/*/schema.json`):
- **Service**: name, slug, number (order + "01/04" label), summary, thumbnail, keyPoints (Blocks), statNumber, statText, bannerImage, overviewTitle, overviewImages, overviewSummary, solutionTitle, solutionSummary, solutionImage, solutionCards, materialTitle, materialSummary, materialCards. Draft & publish.
- **Work**: title, slug, summary, category, thumbnail, bannerImage, projectDuration, roofArea, energySavings, warranty, buildingTitle, buildingImages, overview, overviewImage, challengeTitle, challengeSummary, challengeImage, approachTitle, approachSummary, approachImage, impactTitle, impactSummary, impactCards. Draft & publish.
- **Feature card** component (`shared.feature-card`): icon, title, description.

Editing workflow: create/edit in the Strapi admin (`/admin`) → **Publish** → rebuild the site (locally `npm run build`; in production a Strapi webhook triggers the host's deploy hook). Only published entries are shown.

Writing tips:
- `keyPoints`: one paragraph ("Key Highlights") followed by a bulleted list.
- Stats such as `12 Days`, `25%`, `48hr`, `2.5M+` count up on scroll when they start with a number.
- Alt text: set the Media Library *alternative text*; thumbnails fall back to the entry name.

## Where each list comes from (`src/lib/cms.ts`)
| Section | Rule |
|---|---|
| Home services slider, `/portfolio`, contact "Service Required" | all services, by `number` ascending |
| Home "Works" | all works, newest first (`createdAt`) |
| Footer "Service Details" / "Work Details" | first service / first work |

## Demo mode
With `STRAPI_URL` empty, `src/lib/demo.ts` turns `strapi/seed/data.json` into the same Service/Work shapes, and `astro.config.mjs` serves/copies `strapi/seed/media` at `/demo-media`. Editing `data.json` changes the demo site; run the seed to load the same content into Strapi.

## Seeding / resetting demo content
`cd strapi && STRAPI_ADMIN_TOKEN=<admin token> npm run seed` (through the Strapi MCP server; idempotent). Data: `strapi/seed/data.json`, images: `strapi/seed/media/`.

## Static content
- FAQ: `src/data/faq.ts` (also emitted as FAQPage JSON-LD on Home).
- Team: `src/data/team.ts`. Testimonials: `src/data/testimonials.ts`.
- Other copy: in the section components under `src/components/sections/`.
