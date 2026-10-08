// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

/**
 * Demo mode (no STRAPI_URL): the site renders the Strapi seed content (src/lib/demo.ts).
 * This serves its images at /demo-media in dev and copies them into the build.
 */
function demoMedia() {
  const src = fileURLToPath(new URL('./strapi/seed/media/', import.meta.url));
  const types = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif' };
  /** @type {import('astro').AstroIntegration} */
  const integration = {
    name: 'roofaro-demo-media',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/demo-media', (req, res, next) => {
          const file = path.join(src, path.basename(decodeURIComponent((req.url ?? '').split('?')[0])));
          if (!fs.existsSync(file)) return next();
          res.setHeader('Content-Type', types[/** @type {keyof typeof types} */ (path.extname(file).toLowerCase())] ?? 'application/octet-stream');
          fs.createReadStream(file).pipe(res);
        });
      },
      'astro:build:done': ({ dir }) => {
        fs.cpSync(src, fileURLToPath(new URL('demo-media/', dir)), { recursive: true });
      },
    },
  };
  return integration;
}

// https://astro.build/config
export default defineConfig({
  site: env.SITE_URL || 'https://example.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Utility pages carry noindex, so keep them out of the sitemap.
      filter: (page) => !/\/(401|404|style-guide)\/?$/.test(page),
    }),
    ...(env.STRAPI_URL ? [] : [demoMedia()]),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
