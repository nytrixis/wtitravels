// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL ?? 'https://www.wtitravels.com';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      // Utility/conversion pages must not be indexed or listed.
      filter: (page) => !/\/(thank-you|404|lp\/.*)\/?$/.test(page),
    }),
  ],
  image: { layout: 'constrained' },
  vite: { build: { cssCodeSplit: true } },
});
