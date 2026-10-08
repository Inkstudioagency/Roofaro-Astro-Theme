/**
 * Demo content used when STRAPI_URL is not set: the same entries the Strapi seed imports
 * (strapi/seed/data.json), with images served from /demo-media (see astro.config.mjs).
 * This keeps the theme previewable without a running CMS. Set STRAPI_URL to use Strapi.
 */
import data from '../../strapi/seed/data.json';
import type { Blocks, FeatureCard, Service, StrapiMedia, Work } from './types';

interface MediaRef {
  file: string;
  alt?: string;
  width?: number;
  height?: number;
}
interface CardRef {
  icon: MediaRef | null;
  title: string;
  description: string;
}

let nextId = 1;

function media(ref: MediaRef | null | undefined): StrapiMedia | null {
  if (!ref) return null;
  const id = nextId++;
  return {
    id,
    documentId: `demo-media-${id}`,
    url: `/demo-media/${encodeURIComponent(ref.file)}`,
    alternativeText: ref.alt || null,
    width: ref.width ?? null,
    height: ref.height ?? null,
    formats: null,
  };
}

const cards = (refs: CardRef[]): FeatureCard[] =>
  refs.map((c) => ({ id: nextId++, icon: media(c.icon), title: c.title, description: c.description }));

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** The key-point HTML (<p> + <ul>) as Strapi Blocks, like the seed script produces. */
function keyPoints(html: string): Blocks {
  const blocks: Blocks = [];
  for (const [, tag, inner] of html.matchAll(/<(p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (tag === 'p') {
      blocks.push({ type: 'paragraph', children: [{ type: 'text', text: decode(inner) }] });
    } else {
      blocks.push({
        type: 'list',
        format: tag === 'ol' ? 'ordered' : 'unordered',
        children: [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((li) => ({
          type: 'list-item' as const,
          children: [{ type: 'text' as const, text: decode(li[1]) }],
        })),
      });
    }
  }
  return blocks;
}

export const demoServices: Service[] = data.services.map((s, i) => ({
  ...s,
  id: i + 1,
  documentId: `demo-service-${i + 1}`,
  thumbnail: media(s.thumbnail),
  keyPoints: keyPoints(s.keyPoints),
  bannerImage: media(s.bannerImage),
  overviewImages: s.overviewImages.map(media).filter((m): m is StrapiMedia => m !== null),
  solutionImage: media(s.solutionImage),
  solutionCards: cards(s.solutionCards),
  materialCards: cards(s.materialCards),
}));

// The seed file lists works oldest first; give them increasing creation dates.
export const demoWorks: Work[] = data.works.map((w, i) => ({
  ...w,
  id: i + 1,
  documentId: `demo-work-${i + 1}`,
  createdAt: new Date(Date.UTC(2026, 0, 1 + i)).toISOString(),
  thumbnail: media(w.thumbnail),
  bannerImage: media(w.bannerImage),
  buildingImages: w.buildingImages.map(media).filter((m): m is StrapiMedia => m !== null),
  overviewImage: media(w.overviewImage),
  challengeImage: media(w.challengeImage),
  approachImage: media(w.approachImage),
  impactCards: cards(w.impactCards),
}));
