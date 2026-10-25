import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const singletons = ['siteSettings', 'homePage'];

export default defineConfig({
  name: 'boebes-karla',
  title: 'Μουσείο Κάρλας',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Περιεχόμενο')
          .items([
            S.listItem().title('Ρυθμίσεις & επικοινωνία').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem().title('Αρχική σελίδα').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            ...S.documentTypeListItems().filter((i) => !singletons.includes(i.getId() || '')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (t) => t.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
});
