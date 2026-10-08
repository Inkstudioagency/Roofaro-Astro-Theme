import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Strapi MCP server (Strapi >= 5.47): exposes content + media tools at /mcp for AI clients.
  // Enabled by default in development; set MCP_ENABLED=true to enable it in production.
  // Clients authenticate with an Admin token: Authorization: Bearer <ADMIN_TOKEN>.
  mcp: {
    enabled: env.bool('MCP_ENABLED', env('NODE_ENV', 'development') !== 'production'),
  },
});

export default config;
