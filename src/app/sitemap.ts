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

  const mainPageEntries = LANGUAGES.flatMap((lang) =>
    MAIN_PAGE_SLUGS.map((slug) => ({
      url: `${BASE_URL}/${lang}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  const temaPageEntries = LANGUAGES.flatMap((lang) =>
    TEMA_PAGE_SLUGS.map((slug) => ({
      url: `${BASE_URL}/${lang}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...homepageEntries, ...mainPageEntries, ...temaPageEntries];
}
