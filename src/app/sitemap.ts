import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.sindikatncr.com';
const LANGUAGES = ['sr', 'en'] as const;
const HOMEPAGE_PATHS = [''] as const;
const MAIN_PAGE_SLUGS = [
  'nova-pristupnica',
  'tema/faq',
  'kontakt',
  'dokumenti',
  'politika-privatnosti',
] as const;
const TEMA_PAGE_SLUGS = [
  'tema/ko-smo-mi',
  'tema/zasto-sada',
  'tema/nas-plan',
  'tema/pravna-podrska',
  'tema/benefiti',
  'tema/anonimnost',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date().toISOString();

  const homepageEntries = LANGUAGES.flatMap((lang) =>
    HOMEPAGE_PATHS.map((suffix) => ({
      url: `${BASE_URL}/${lang}${suffix ? `/${suffix}` : ''}/`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    }))
  );

  // ENHANCED: Prioritize FAQ and key tema pages
  const highPriorityTemaPages = ['tema/faq'];
  const standardTemaPages = TEMA_PAGE_SLUGS.filter(slug => !highPriorityTemaPages.includes(slug));
  
  // Filter out FAQ from main pages to avoid duplicates
  const mainPageSlugsWithoutFAQ = MAIN_PAGE_SLUGS.filter(slug => slug !== 'tema/faq');
  
  const mainPageEntries = LANGUAGES.flatMap((lang) =>
    mainPageSlugsWithoutFAQ.map((slug) => ({
      url: `${BASE_URL}/${lang}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  const highPriorityEntries = LANGUAGES.flatMap((lang) =>
    highPriorityTemaPages.map((slug) => ({
      url: `${BASE_URL}/${lang}/${slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  );

  const temaPageEntries = LANGUAGES.flatMap((lang) =>
    standardTemaPages.map((slug) => ({
      url: `${BASE_URL}/${lang}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...homepageEntries, ...mainPageEntries, ...highPriorityEntries, ...temaPageEntries];
}
