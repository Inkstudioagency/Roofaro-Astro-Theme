# Scripts

Run from the theme root (npm; Node 22.12+):

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server on http://localhost:4321 (Strapi must be running) |
| `npm run build` | Static build to `dist/` (fetches all content from Strapi) |
| `npm run preview` | Serves `dist/` |
| `npm run strapi:dev` | Starts Strapi (`strapi develop`) on http://localhost:1337 |
| `npm run strapi:seed` | Imports demo content through the Strapi MCP server (needs `STRAPI_ADMIN_TOKEN`) |

Inside `strapi/`: `npm run develop`, `npm run build`, `npm run start` (production), `npm run seed [-- --dry-run]`.

Typical first run:
```bash
npm install && cp .env.example .env
cd strapi && npm install && cp .env.example .env && npm run develop   # create the admin user
# Admin → Settings → Admin tokens → create, then:
STRAPI_ADMIN_TOKEN=... npm run seed
cd .. && npm run dev
```

Without `STRAPI_URL`, `npm run dev` / `npm run build` use the bundled demo content (`strapi/seed/data.json`, images served at `/demo-media`).

Build failing with `[strapi] Could not reach …` means Strapi isn't running or `STRAPI_URL` is wrong.
