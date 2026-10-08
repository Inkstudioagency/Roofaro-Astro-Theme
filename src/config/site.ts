/**
 * Site-wide settings. Edit these values to rebrand the theme.
 * Everything here is sample data — replace it with your own before launch.
 */
export const site = {
  name: 'Roofaro',
  /** Used for canonical URLs and the sitemap. Override with the SITE_URL env variable. */
  url: 'https://example.com',
  /** Default <title> when a page doesn't pass its own. */
  defaultTitle: 'Roofaro - Roofing Services Astro Theme',
  defaultDescription:
    'Roofaro is a premium Astro theme built for roofing companies to attract more clients, showcase projects, and grow their business.',
  /** Default Open Graph image (path inside /public). */
  ogImage: '/images/open-graph.webp',
  locale: 'en',

  contact: {
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    /** Value used in the tel: link. */
    phoneHref: '+15551234567',
    address: '123 Example Street, Anytown',
  },

  /** Root-domain social links only (no usernames). `icon` picks the SVG in Footer.astro. */
  social: [
    { label: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
    { label: 'X', href: 'https://x.com/', icon: 'x' },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
  ],

  logo: { src: '/images/Logo-12.svg', alt: 'Roofaro logo' },
  /** Light logo used on the dark mobile menu and in the footer. */
  logoLight: { src: '/images/Footer-Logo-8.svg', alt: 'Roofaro logo' },
  /** Large wordmark at the bottom of the footer. */
  footerWordmark: { src: '/images/PeakShield.svg', alt: 'Roofaro wordmark' },
  footerSummary: 'Your trusted partner in luxury real estate. Find your perfect home with us.',

  /** Footer copyright + credits. */
  copyright: 'Copyright © Roofaro',
  credits: {
    designedBy: { label: 'Ink Studio', href: 'https://www.inks.studio/' },
    poweredBy: { label: 'Astro', href: 'https://astro.build/' },
  },

  /**
   * Interaction runtime ids. The animations in /public/js/webflow.js are scoped to these
   * ids (see BaseLayout `wfPage`), so keep them unless you rebuild the interactions.
   */
  webflowSiteId: '6ac67a406e52317ce52b459c',
} as const;

/** `wfPage` ids of the original pages. Each route passes the one whose sections it uses. */
export const wfPages = {
  home: '6ac67a406e52317ce52b4581',
  styleGuide: '6ac67a406e52317ce52b4582',
  password: '6ac67a406e52317ce52b4585',
  notFound: '6ac67a406e52317ce52b4586',
  about: '6ac67a406e52317ce52b4589',
  workDetail: '6ac67a406e52317ce52b458a',
  contact: '6ac67a406e52317ce52b458b',
  services: '6ac67a406e52317ce52b458e',
  serviceDetail: '6ac67a406e52317ce52b4591',
} as const;

export type Site = typeof site;
