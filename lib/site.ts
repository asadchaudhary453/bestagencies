export const SITE = {
  name: 'Best Agencies',
  url: 'https://www.bestagencies.co.uk',
  description:
    'Independent, research-backed rankings of the best agencies in the UK and beyond. Compare top SEO, web design, digital marketing, PR and software development agencies.',
  twitter: '@bestagencies',
  email: 'info@bestagencies.co.uk',
  locale: 'en_GB',
} as const

export type Site = typeof SITE
