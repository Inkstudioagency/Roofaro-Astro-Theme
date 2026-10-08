# Components

## Global (`src/components/global`)
| Component | Props | Notes |
|---|---|---|
| `SEO` | `title?`, `description?`, `image?`, `type?`, `noindex?` | Rendered by `BaseLayout`. Falls back to `site.defaultTitle/defaultDescription/ogImage`. Builds canonical + OG/Twitter tags. |
| `Header` | `variant?: 'v1' \| 'v2'` | Menu from `headerNav` / `headerCta`. Marks the current page with `w--current` + `aria-current`. Mobile menu below 992px (handled by the runtime). `v2` is the 404 variant. |
| `Footer` | — | Links from `footerQuickLinks`, `footerUtilityLinks`, `footerBottomLinks`; contact + social from `site`. Reads Strapi to resolve the "Service Details" / "Work Details" links. |

## Layout
`BaseLayout` props: `title?`, `description?`, `image?`, `type?`, `noindex?`, **`wfPage`** (required), `layout?: 'default' | 'utility' | 'bare'` (`utility` = 404 wrapper, `bare` = no header/footer, used by `/401`), `jsonLd?`.

## UI
`Button` — `kind?: 'primary' | 'secondary'`, `variant?: 'v1' | 'v2'`, `href`, `text`, `target?`. The arrow hover animation comes from the `button-hover` attribute.

## Shared sections (`src/components/sections/shared`)
| Component | Props |
|---|---|
| `Breadcrumb` | `variant?: 'default' \| 'service' \| 'service-details'`, `subtitle`, `title`, `summary`, `backgroundImage?` |
| `Cta` | — |
| `Faq` | — (questions in `src/data/faq.ts`) |
| `Process` | — |
| `Testimonials` | — (slides in `src/data/testimonials.ts`) |

## Cards (`src/components/cards`)
| Component | Props |
|---|---|
| `ServiceCard` | `service: Service`, `total: number`, `variant?: 'slider' \| 'grid'` (Home slider vs. `/portfolio` grid) |
| `WorkCard` | `work: Work` |
| `FeatureCard` | `card: FeatureCard`, `blockClass`, `contentClass`, `reveal?` — icon + title + text, same markup as the original rich-text cards |
| `TeamCard` | `member: TeamMember`, `reveal` |

## CMS sections
- Home: `home/ServicesSlider` (one slide per service), `home/Works`.
- Services page: `services/ServicesGrid`.
- Service detail: `service-detail/ServiceOverview`, `OurSolution`, `MaterialOptions` (prop `service`).
- Work detail: `work-detail/WorkHero`, `Building`, `ProjectOverview`, `WorkJourney`, `ProjectImpact` (prop `work`); `Gallery` is static.
- Contact: `contact/ContactForm` fills the "Service Required" options from Strapi services.

## Rules
- Keep the original class names and attributes: the CSS and the animations target them.
- Components that read Strapi do so in their frontmatter (server-side). Never import `src/lib/strapi.ts` from a client `<script>`.
