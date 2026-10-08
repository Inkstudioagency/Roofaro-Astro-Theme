# Styling and theming

## CSS files (`src/styles`, imported once by `BaseLayout`, in this order)
1. `normalize.css`
2. `webflow.css` — base + component styles (nav, slider, forms, rich text)
3. `roofaro-astro-theme.webflow.css` — the theme: CSS variables, typography, every section and breakpoint
4. `lenis.css` — smooth-scroll helpers
5. `custom.css` — **put your own rules here**
Plus `ix3-initial-states.css`, inlined in `<head>`: hides animated elements until the runtime starts them (prevents a flash).

All styles are global (not scoped) so the original specificity is preserved. No Tailwind.

## Design tokens
Colours, fonts, sizes, spacing and radii are CSS custom properties at the top of `roofaro-astro-theme.webflow.css` (`:root { --… }`). To rebrand, override them in `custom.css`:
```css
:root {
  --_color---primary-color--400: #1d4ed8; /* accent (default #f47e3e) */
}
```
(Check the exact variable names in the `:root` block.)

## Breakpoints
Desktop base → `max-width: 991px` (tablet, mobile menu) → `767px` → `479px`; plus `min-width: 1280px` and `1440px`.

## Fonts
Switzer (self-hosted in `public/fonts`, `@font-face` in the theme CSS) for headings; Manrope (Google Fonts `<link>` in `BaseLayout`) for body text.

## Animations
- Runtime: `public/js/webflow.js` + GSAP (`gsap`, `SplitText`, `ScrollTrigger`) from `public/js`.
- Trigger attributes: `hero-title`, `section-title`, `reveal-0s` … `reveal-8s`, `to-top-0s` … `to-top-8s`, `button-hover`. Add one to an element to reuse that animation.
- Counters: any element whose class contains `wf-counter` (e.g. `_wf-counter`) counts up to its number (`public/js/roofaro.js`).
- Smooth scrolling: Lenis on screens ≥ 768px (`public/js/roofaro.js`).
- The design is light; there is no dark mode switch.
