import { getProductionRobots } from '@/lib/seo/production-seo';

export default function robots() {
  const rules = getProductionRobots();

  return {
    rules: {
      userAgent: '*',
      allow: rules.index ? '/' : undefined,
      disallow: rules.index
        ? [
            '/dashboard/',
            '/admin/',
            '/auth/',
            '/api/',
          ]
        : '/',
    },

    sitemap: rules.index
      ? 'https://worldwidedipo.com/sitemap.xml'
      : undefined,
  };
}