/**
 * Minimal, typed Strapi v5 REST client. Server-side only: import it from .astro frontmatter
 * or endpoints, never from a client <script>, so the API token never reaches the browser.
 */
import type { StrapiMedia } from './types';

const STRAPI_URL = (import.meta.env.STRAPI_URL ?? process.env.STRAPI_URL ?? '').replace(/\/$/, '');
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN ?? process.env.STRAPI_API_TOKEN ?? '';

/** False when STRAPI_URL is not set: the site then renders the bundled demo content (src/lib/demo.ts). */
export const hasStrapi = STRAPI_URL !== '';

type QueryValue = string | number | boolean;
export type Query = Record<string, QueryValue>;

interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

function requireUrl(): string {
  if (!STRAPI_URL) {
    throw new Error(
      '[strapi] STRAPI_URL is not set. Copy .env.example to .env and point it at your Strapi server (see README → "CMS (Strapi)").',
    );
  }
  return STRAPI_URL;
}

export async function strapiFetch<T>(path: string, query: Query = {}): Promise<T> {
  const url = new URL(`/api/${path.replace(/^\//, '')}`, requireUrl());
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));

  let res: Response;
  try {
    res = await fetch(url, {
      headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
    });
  } catch (error) {
    throw new Error(`[strapi] Could not reach ${url.origin}. Is Strapi running? (${(error as Error).message})`);
  }
  if (!res.ok) {
    throw new Error(`[strapi] ${res.status} ${res.statusText} on ${url.pathname}${url.search}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/** Fetch every published entry of a collection type, following pagination. */
export async function strapiGetAll<T>(collection: string, query: Query = {}): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    const res = await strapiFetch<StrapiListResponse<T>>(collection, {
      ...query,
      'pagination[page]': page,
      'pagination[pageSize]': 100,
    });
    items.push(...res.data);
    pageCount = res.meta.pagination.pageCount;
    page += 1;
  } while (page <= pageCount);
  return items;
}

/** Absolute URL for a Strapi media file (local uploads are returned as relative paths). */
export function mediaUrl(media?: Pick<StrapiMedia, 'url'> | null): string {
  if (!media?.url) return '';
  // Absolute URLs (cloud upload providers) and bundled demo media are used as-is.
  if (/^https?:\/\//.test(media.url) || media.url.startsWith('/demo-media/')) return media.url;
  return `${requireUrl()}${media.url}`;
}

/**
 * `srcset` from Strapi's responsive formats (small 500 / medium 750 / large 1000) plus the
 * original, mirroring Webflow's `-p-500/-p-800/-p-1080` variants. With `sizes`, the width
 * descriptor also sets the image's intrinsic size, so it's emitted even without formats.
 * Empty when the width is unknown (e.g. SVGs).
 */
export function mediaSrcset(media?: StrapiMedia | null): string | undefined {
  if (!media?.url) return undefined;
  const entries = Object.values(media.formats ?? {})
    .filter((f): f is NonNullable<typeof f> => !!f && !!f.width)
    .sort((a, b) => a.width - b.width)
    .map((f) => `${mediaUrl(f)} ${f.width}w`);
  if (media.width) entries.push(`${mediaUrl(media)} ${media.width}w`);
  return entries.length ? entries.join(', ') : undefined;
}
