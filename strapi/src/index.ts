import type { Core } from '@strapi/strapi';

/** Content types the Astro frontend reads. The Public role gets read-only access to them. */
const PUBLIC_READ = ['api::service.service', 'api::work.work'];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * Grants the Public role `find` + `findOne` on the theme's content types (idempotent),
   * so the Astro build can fetch published content without extra setup.
   * Set STRAPI_PUBLIC_READ=false and use a read-only API token (STRAPI_API_TOKEN in the
   * Astro .env) if you prefer a private API.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.STRAPI_PUBLIC_READ === 'false') return;
    const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!role) return;
    for (const uid of PUBLIC_READ) {
      for (const action of ['find', 'findOne']) {
        const name = `${uid}.${action}`;
        const exists = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: name, role: role.id } });
        if (!exists) {
          await strapi.db.query('plugin::users-permissions.permission').create({ data: { action: name, role: role.id } });
        }
      }
    }
  },
};
