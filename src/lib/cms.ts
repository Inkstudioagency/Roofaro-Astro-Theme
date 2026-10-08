/**
 * CMS queries used by the pages. Each collection is fetched once per build (cached promise),
 * then sliced per section to reproduce the original collection-list settings.
 * Without STRAPI_URL, the bundled demo content (src/lib/demo.ts) is used instead.
 */
import { hasStrapi, strapiGetAll } from './strapi';
import { demoServices, demoWorks } from './demo';
import type { Service, Work } from './types';

let servicesPromise: Promise<Service[]> | undefined;
let worksPromise: Promise<Work[]> | undefined;

/** All published services, ordered by their number (01, 02, …). */
function loadServices(): Promise<Service[]> {
  const source = hasStrapi
    ? strapiGetAll<Service>('services', {
        'populate[thumbnail]': true,
        'populate[bannerImage]': true,
        'populate[overviewImages]': true,
        'populate[solutionImage]': true,
        'populate[solutionCards][populate][icon]': true,
        'populate[materialCards][populate][icon]': true,
        sort: 'number:asc',
      })
    : Promise.resolve([...demoServices]);
  return source.then((items) => items.sort((a, b) => a.number - b.number));
}

export function getServices(): Promise<Service[]> {
  servicesPromise ??= loadServices();
  return servicesPromise;
}

/** All published works, newest first (the CMS default order of the original lists). */
function loadWorks(): Promise<Work[]> {
  const source = hasStrapi
    ? strapiGetAll<Work>('works', {
        'populate[thumbnail]': true,
        'populate[bannerImage]': true,
        'populate[buildingImages]': true,
        'populate[overviewImage]': true,
        'populate[challengeImage]': true,
        'populate[approachImage]': true,
        'populate[impactCards][populate][icon]': true,
        sort: 'createdAt:desc',
      })
    : Promise.resolve([...demoWorks]);
  return source.then((items) => items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function getWorks(): Promise<Work[]> {
  worksPromise ??= loadWorks();
  return worksPromise;
}

export const serviceHref = (s: Pick<Service, 'slug'>) => `/services/${s.slug}`;
export const workHref = (w: Pick<Work, 'slug'>) => `/work/${w.slug}`;

/** "1" → "01", as shown on the service cards. */
export const padNumber = (n: number) => String(n).padStart(2, '0');
