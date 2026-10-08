## Roofaro theme

Before changing pages, components, content, config or styles, read the theme handbook: `.claude/skills/astro-template-guidance/SKILL.md` (it routes to the right file in `references/`).

- CMS content (Services, Works) comes from Strapi in `strapi/` at build time; Strapi must be running for `npm run dev` / `npm run build`.
- Keep the original class names and attributes: the CSS and the animation runtime depend on them.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
