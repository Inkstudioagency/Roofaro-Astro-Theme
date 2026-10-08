---
name: astro-template-guidance
description: Use this skill whenever you need to understand how the template works, including adding new pages, managing content, configuring pages, using components, understanding project architecture, using scripts, or styling and theming. Use it for ANY question related to the structure, usage, and customization of the project template.
---

# Template Guidance (Roofaro — Astro + Strapi)

This skill is the unified handbook for the Roofaro theme. It uses the progressive disclosure pattern to keep context lean.

Depending on the user's specific request, **you MUST read the appropriate reference document** from the `references/` directory before proceeding.

## Routing Guide

Read the specific file in `references/` based on the user's request:

- **Adding a new page, route, or section:**
  Read: `references/adding-new-pages.md`

- **Using, modifying, or understanding UI components (e.g. ServiceCard, Button, SEO):**
  Read: `references/component-usage.md`

- **Adding, editing, or updating content (Strapi services and works, FAQ, team, testimonials):**
  Read: `references/content-management.md`

- **Configuring site settings, navigation, social links, or SEO (`src/config/site.ts`, `src/config/navigation.ts`):**
  Read: `references/page-configuration.md`

- **Understanding the high-level codebase structure or data flow:**
  Read: `references/project-architecture.md`

- **Running the npm scripts (dev, build, preview, Strapi, seed):**
  Read: `references/script-usage.md`

- **Customizing styles, CSS variables, animations, or the visual theme:**
  Read: `references/styling-and-theming.md`

- **Working with multi-language (i18n) features, translations, or localized routing:**
  Read: `references/i18n-guidance.md`

## Instructions

1. Identify the domain of the user's request.
2. Read the corresponding reference markdown file in `references/` relative to this skill.
3. Follow the instructions within that reference file.
4. Never change the design's CSS or markup structure unless the user asks for a design change: the theme is a 1:1 conversion and the animations depend on the class names and attributes.
