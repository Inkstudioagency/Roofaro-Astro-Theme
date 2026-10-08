export interface NavLink {
  label: string;
  href: string;
}

/** Header menu (desktop + mobile). */
export const headerNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/portfolio' },
  { label: 'Works', href: '/#section_works' },
  { label: 'Contact', href: '/contact' },
];

/** "Get a Quote" button in the header. */
export const headerCta: NavLink = { label: 'Get a Quote', href: '/contact' };

/**
 * Footer "Quick Links". `{firstService}` / `{firstWork}` are replaced at build time with the
 * first Service / Work from Strapi, so the demo links never point at a deleted entry.
 */
export const footerQuickLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
  { label: 'Service Details', href: '{firstService}' },
  { label: 'Work Details', href: '{firstWork}' },
];

export const footerUtilityLinks: NavLink[] = [
  { label: 'Style Guide', href: '/style-guide' },
  { label: '404', href: '/404' },
  { label: '401', href: '/401' },
];

/** Small links in the footer bottom bar. */
export const footerBottomLinks: NavLink[] = [
  { label: 'Not Found', href: '/404' },
  { label: 'Password', href: '/401' },
];

/** True when `href` is the page being rendered (used for `w--current` + aria-current). */
export function isCurrent(href: string, pathname: string): boolean {
  if (href.includes('#')) return false;
  const clean = (p: string) => p.replace(/\/+$/, '') || '/';
  return clean(href) === clean(pathname);
}
