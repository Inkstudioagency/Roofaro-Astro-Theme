import type { Schema, Struct } from '@strapi/strapi';

export interface SharedFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_cards';
  info: {
    description: 'Icon + title + short text. Used for service solutions/materials and work impact cards.';
    displayName: 'Feature card';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.feature-card': SharedFeatureCard;
    }
  }
}
