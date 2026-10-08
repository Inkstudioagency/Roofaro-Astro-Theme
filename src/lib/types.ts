/** Strapi v5 REST shapes for the two Roofaro collections (Service, Work). */

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  mime?: string;
  formats?: Partial<Record<'thumbnail' | 'small' | 'medium' | 'large', StrapiMediaFormat>> | null;
}

/* ---------- Strapi "Blocks" rich text ---------- */
export interface BlocksText {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}
export interface BlocksLink {
  type: 'link';
  url: string;
  children: BlocksText[];
}
export type BlocksInline = BlocksText | BlocksLink;
export interface BlocksListItem {
  type: 'list-item';
  children: BlocksInline[];
}
export type BlocksNode =
  | { type: 'paragraph'; children: BlocksInline[] }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: BlocksInline[] }
  | { type: 'quote'; children: BlocksInline[] }
  | { type: 'code'; children: BlocksText[] }
  | { type: 'list'; format: 'ordered' | 'unordered'; children: (BlocksListItem | Extract<BlocksNode, { type: 'list' }>)[] }
  | { type: 'image'; image: StrapiMedia; children: BlocksText[] };
export type Blocks = BlocksNode[];

/* ---------- Shared component: shared.feature-card ---------- */
/** Icon + title + text card (service solutions/materials, work impact). */
export interface FeatureCard {
  id: number;
  icon: StrapiMedia | null;
  title: string;
  description: string;
}

/* ---------- Collections ---------- */
export interface Service {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  /** Display order and the "01/04" counter on cards. */
  number: number;
  summary: string;
  thumbnail: StrapiMedia | null;
  keyPoints: Blocks | null;
  statNumber: string;
  statText: string;
  bannerImage: StrapiMedia | null;
  overviewTitle: string;
  overviewImages: StrapiMedia[] | null;
  overviewSummary: string;
  solutionTitle: string;
  solutionSummary: string;
  solutionImage: StrapiMedia | null;
  solutionCards: FeatureCard[];
  materialTitle: string;
  materialSummary: string;
  materialCards: FeatureCard[];
}

export interface Work {
  id: number;
  documentId: string;
  createdAt: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  thumbnail: StrapiMedia | null;
  bannerImage: StrapiMedia | null;
  projectDuration: string;
  roofArea: string;
  energySavings: string;
  warranty: string;
  buildingTitle: string;
  buildingImages: StrapiMedia[] | null;
  overview: string;
  overviewImage: StrapiMedia | null;
  challengeTitle: string;
  challengeSummary: string;
  challengeImage: StrapiMedia | null;
  approachTitle: string;
  approachSummary: string;
  approachImage: StrapiMedia | null;
  impactTitle: string;
  impactSummary: string;
  impactCards: FeatureCard[];
}
