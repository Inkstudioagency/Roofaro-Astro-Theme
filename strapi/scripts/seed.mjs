#!/usr/bin/env node
/**
 * Seeds the Roofaro demo content into Strapi through the official Strapi MCP server
 * (https://docs.strapi.io/cms/features/strapi-mcp-server).
 *
 *   1. Media files are uploaded with the admin upload endpoint (the MCP server can't upload files).
 *   2. Everything else goes through MCP tools at <STRAPI_URL>/mcp:
 *      media_list_assets / media_update_asset, and list_ / create_ / update_ / publish_
 *      for the `service` and `work` content types.
 *
 * Idempotent: media is matched by file name, entries by slug.
 *
 * Usage (Strapi must be running with the MCP server enabled):
 *   STRAPI_ADMIN_TOKEN=<admin token> npm run seed            # from /strapi
 *   STRAPI_ADMIN_TOKEN=<admin token> npm run seed -- --dry-run
 *
 * Create the Admin token in Strapi: Settings → Admin tokens → Create (Content Manager
 * permissions for Service and Work, plus Media Library).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SEED_DIR = path.resolve(here, '../seed');
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;
const DRY = process.argv.includes('--dry-run');

if (!TOKEN) {
  console.error('Missing STRAPI_ADMIN_TOKEN (an Admin token, see the header of this file).');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'data.json'), 'utf8'));

/* ------------------------------------------------------------------ MCP client */
let rpcId = 0;
async function mcp(method, params) {
  const res = await fetch(`${STRAPI_URL}/mcp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`MCP ${method} → HTTP ${res.status}: ${text}`);
  const line = text.split('\n').find((l) => l.startsWith('data: '));
  const msg = JSON.parse(line ? line.slice(6) : text);
  if (msg.error) throw new Error(`MCP ${method} → ${JSON.stringify(msg.error)}`);
  return msg.result;
}

async function tool(name, args = {}) {
  const result = await mcp('tools/call', { name, arguments: args });
  if (result.isError) throw new Error(`MCP tool ${name} failed: ${result.content?.map((c) => c.text).join(' ')}`);
  if (result.structuredContent) return result.structuredContent;
  const txt = result.content?.find((c) => c.type === 'text')?.text;
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

/* ------------------------------------------------------------------ HTML → Strapi Blocks */
function decode(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
const stripTags = (s) => decode(s.replace(/<[^>]+>/g, ''));

/** Minimal converter for the key-point lists: <p>, <h1-6>, <ul>/<ol> with plain-text items. */
function toBlocks(html) {
  const blocks = [];
  const re = /<(p|h[1-6]|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html || ''))) {
    const [, tag, inner] = m;
    if (tag === 'ul' || tag === 'ol') {
      const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((li) => ({
        type: 'list-item',
        children: [{ type: 'text', text: stripTags(li[1]) }],
      }));
      blocks.push({ type: 'list', format: tag === 'ol' ? 'ordered' : 'unordered', children: items });
    } else if (tag === 'p') {
      blocks.push({ type: 'paragraph', children: [{ type: 'text', text: stripTags(inner) }] });
    } else {
      blocks.push({ type: 'heading', level: Number(tag[1]), children: [{ type: 'text', text: stripTags(inner) }] });
    }
  }
  return blocks;
}

/* ------------------------------------------------------------------ media */
const MIME = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif' };
const mediaByFile = new Map();

async function ensureMedia(file) {
  if (mediaByFile.has(file)) return mediaByFile.get(file);
  const found = await tool('media_list_assets', { name: file, pageSize: 100 });
  const list = found.results ?? found.data ?? [];
  let asset = list.find((a) => a.name === file);
  if (!asset) {
    if (DRY) {
      console.log(`  [dry-run] would upload ${file}`);
      asset = { id: 0, name: file };
    } else {
      const buf = fs.readFileSync(path.join(SEED_DIR, 'media', file));
      const form = new FormData();
      form.append('files', new Blob([buf], { type: MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' }), file);
      const res = await fetch(`${STRAPI_URL}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body: form });
      if (!res.ok) throw new Error(`Upload ${file} failed: ${res.status} ${await res.text()}`);
      const uploaded = await res.json();
      asset = Array.isArray(uploaded) ? uploaded[0] : uploaded.data?.[0] ?? uploaded;
      console.log(`  ↑ uploaded ${file} (#${asset.id})`);
    }
  }
  mediaByFile.set(file, asset);
  return asset;
}

async function setAlt(ref) {
  if (!ref?.alt) return;
  const asset = mediaByFile.get(ref.file);
  if (!asset?.id || DRY || asset.alternativeText === ref.alt) return;
  await tool('media_update_asset', { id: asset.id, alternativeText: ref.alt });
  asset.alternativeText = ref.alt;
}

const id = (ref) => (ref ? mediaByFile.get(ref.file)?.id ?? null : null);
const ids = (refs) => (refs ?? []).map(id).filter((x) => x !== null);
const featureCards = (cards) =>
  (cards ?? []).map((c) => ({ icon: id(c.icon), title: c.title, description: c.description }));

/* ------------------------------------------------------------------ entries */
async function upsert(type, slug, payload) {
  const found = await tool(`list_${type}`, { filters: { slug: { $eq: slug } }, pageSize: 1 });
  const existing = (found.results ?? found.data ?? [])[0];
  if (DRY) {
    console.log(`  [dry-run] would ${existing ? 'update' : 'create'} ${type} "${slug}"`);
    return;
  }
  const res = existing
    ? await tool(`update_${type}`, { documentId: existing.documentId, data: payload })
    : await tool(`create_${type}`, { data: payload });
  const documentId = res.documentId ?? res.data?.documentId ?? res.result?.documentId ?? existing?.documentId;
  if (!documentId) throw new Error(`No documentId returned for ${type} "${slug}": ${JSON.stringify(res).slice(0, 300)}`);
  await tool(`publish_${type}`, { documentId });
  console.log(`  ${existing ? '↻ updated' : '+ created'} ${type} "${slug}" (published)`);
}

/* ------------------------------------------------------------------ run */
async function main() {
  const init = await mcp('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'roofaro-seed', version: '1.0.0' },
  });
  console.log(`Connected to ${init.serverInfo?.name} ${init.serverInfo?.version} at ${STRAPI_URL}/mcp${DRY ? ' (dry run)' : ''}`);

  const { tools } = await mcp('tools/list', {});
  const names = new Set(tools.map((t) => t.name));
  for (const t of ['service', 'work']) {
    for (const op of ['list', 'create', 'update', 'publish']) {
      if (!names.has(`${op}_${t}`)) throw new Error(`MCP tool ${op}_${t} not available. Check the Admin token's Content Manager permissions.`);
    }
  }

  console.log('\nMedia');
  const files = fs.readdirSync(path.join(SEED_DIR, 'media')).filter((f) => MIME[path.extname(f).toLowerCase()]);
  for (const f of files) await ensureMedia(f);
  for (const s of data.services) for (const ref of [s.thumbnail, s.bannerImage, s.solutionImage, ...s.overviewImages]) await setAlt(ref);
  for (const w of data.works) for (const ref of [w.thumbnail, w.bannerImage, w.overviewImage, w.challengeImage, w.approachImage, ...w.buildingImages]) await setAlt(ref);

  console.log('\nServices');
  for (const s of data.services) {
    await upsert('service', s.slug, {
      name: s.name,
      slug: s.slug,
      number: s.number,
      summary: s.summary,
      thumbnail: id(s.thumbnail),
      keyPoints: toBlocks(s.keyPoints),
      statNumber: s.statNumber,
      statText: s.statText,
      bannerImage: id(s.bannerImage),
      overviewTitle: s.overviewTitle,
      overviewImages: ids(s.overviewImages),
      overviewSummary: s.overviewSummary,
      solutionTitle: s.solutionTitle,
      solutionSummary: s.solutionSummary,
      solutionImage: id(s.solutionImage),
      solutionCards: featureCards(s.solutionCards),
      materialTitle: s.materialTitle,
      materialSummary: s.materialSummary,
      materialCards: featureCards(s.materialCards),
    });
  }

  // Created in file order (oldest first): the site lists works newest first by createdAt.
  console.log('\nWorks');
  for (const w of data.works) {
    await upsert('work', w.slug, {
      title: w.title,
      slug: w.slug,
      summary: w.summary,
      category: w.category,
      thumbnail: id(w.thumbnail),
      bannerImage: id(w.bannerImage),
      projectDuration: w.projectDuration,
      roofArea: w.roofArea,
      energySavings: w.energySavings,
      warranty: w.warranty,
      buildingTitle: w.buildingTitle,
      buildingImages: ids(w.buildingImages),
      overview: w.overview,
      overviewImage: id(w.overviewImage),
      challengeTitle: w.challengeTitle,
      challengeSummary: w.challengeSummary,
      challengeImage: id(w.challengeImage),
      approachTitle: w.approachTitle,
      approachSummary: w.approachSummary,
      approachImage: id(w.approachImage),
      impactTitle: w.impactTitle,
      impactSummary: w.impactSummary,
      impactCards: featureCards(w.impactCards),
    });
  }

  // Verify through MCP: published counts must match the seed file.
  const count = async (type) => (await tool(`list_${type}`, { status: 'published', pageSize: 1 })).pagination?.total;
  console.log('\nVerification (seed → Strapi published):');
  console.table([
    { type: 'service', seed: data.services.length, strapi: DRY ? '-' : await count('service') },
    { type: 'work', seed: data.works.length, strapi: DRY ? '-' : await count('work') },
    { type: 'media', seed: files.length, strapi: mediaByFile.size },
  ]);
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
