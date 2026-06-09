import type { Category } from './types'

export const categories: Category[] = [
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    shortName: 'Digital Marketing',
    title: 'Best Digital Marketing Agencies',
    description:
      'Independent rankings of the best digital marketing agencies. Compare SEO, paid media, social and email specialists vetted by our editorial team.',
    blurb: 'Full-funnel teams driving measurable growth across every channel.',
    icon: 'TrendingUp',
  },
  {
    slug: 'business',
    name: 'Business',
    shortName: 'Business',
    title: 'Best Business Services & Consultants',
    description:
      'The top business consultancies, strategy firms and B2B service providers, ranked for results, transparency and client outcomes.',
    blurb: 'Strategy, consulting and B2B partners that help companies scale.',
    icon: 'Briefcase',
  },
  {
    slug: 'programming-tech',
    name: 'Programming & Tech',
    shortName: 'Programming & Tech',
    title: 'Best Programming & Tech Companies',
    description:
      'The best software development, engineering and IT partners for web, mobile and product. Reviewed for technical depth and reliable delivery.',
    blurb: 'Engineers and tech teams that ship reliable, scalable products.',
    icon: 'Code2',
  },
  {
    slug: 'home-garden',
    name: 'Home & Garden',
    shortName: 'Home & Garden',
    title: 'Best Home & Garden Services',
    description:
      'Trusted home improvement, interior and landscaping providers, independently reviewed for craftsmanship, value and customer care.',
    blurb: 'Improvement, interior and outdoor specialists you can trust.',
    icon: 'Home',
  },
  {
    slug: 'health',
    name: 'Health',
    shortName: 'Health',
    title: 'Best Health & Wellness Providers',
    description:
      'Carefully vetted health, wellness and medical service providers, ranked for expertise, care quality and patient trust.',
    blurb: 'Wellness, fitness and medical experts focused on real outcomes.',
    icon: 'HeartPulse',
  },
  {
    slug: 'property',
    name: 'Property',
    shortName: 'Property',
    title: 'Best Property & Real Estate Firms',
    description:
      'The leading real estate agencies, property managers and developers, reviewed for service, market knowledge and results.',
    blurb: 'Agents, managers and developers who know the market.',
    icon: 'Building2',
  },
  {
    slug: 'services',
    name: 'Services',
    shortName: 'Services',
    title: 'Best Professional Services',
    description:
      'Independent rankings of trusted local and professional service providers, vetted for reliability, value and customer satisfaction.',
    blurb: 'Dependable professionals across every kind of service.',
    icon: 'Wrench',
  },
  {
    slug: 'shopping',
    name: 'Shopping',
    shortName: 'Shopping',
    title: 'Best Shopping & Retail Brands',
    description:
      'The best online stores, retailers and e-commerce brands, reviewed for product quality, pricing and customer experience.',
    blurb: 'Stores and brands that deliver quality and value.',
    icon: 'ShoppingBag',
  },
  {
    slug: 'education',
    name: 'Education',
    shortName: 'Education',
    title: 'Best Education & Learning Platforms',
    description:
      'Top schools, courses, tutors and learning platforms, independently ranked for teaching quality, outcomes and value.',
    blurb: 'Courses, tutors and platforms that help you learn faster.',
    icon: 'GraduationCap',
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    shortName: 'Fashion',
    title: 'Best Fashion Brands & Boutiques',
    description:
      'A curated look at the best fashion labels, boutiques and stylists, reviewed for quality, style and customer experience.',
    blurb: 'Labels, boutiques and stylists worth following.',
    icon: 'Shirt',
  },
  {
    slug: 'food',
    name: 'Food',
    shortName: 'Food',
    title: 'Best Food & Dining',
    description:
      'The best restaurants, food brands and culinary services, independently reviewed for taste, quality and value.',
    blurb: 'Restaurants, brands and culinary services we love.',
    icon: 'UtensilsCrossed',
  },
  {
    slug: 'graphics-design',
    name: 'Graphics Design',
    shortName: 'Graphics Design',
    title: 'Best Graphic & Web Design Studios',
    description:
      'Studios that craft beautiful brands, websites and visuals. Reviewed for design quality, creativity and conversion-focused craft.',
    blurb: 'Designers who make brands and products look exceptional.',
    icon: 'PenTool',
  },
  {
    slug: 'lifestyle',
    name: 'Lifestyle',
    shortName: 'Lifestyle',
    title: 'Best Lifestyle Brands & Services',
    description:
      'A handpicked guide to lifestyle brands, services and experiences, reviewed for quality and everyday value.',
    blurb: 'Brands and services that elevate everyday living.',
    icon: 'Sparkles',
  },
  {
    slug: 'news',
    name: 'News',
    shortName: 'News',
    title: 'News & Media',
    description:
      'The latest news, analysis and editorial coverage across the topics and industries our readers care about most.',
    blurb: 'Timely coverage and analysis you can rely on.',
    icon: 'Newspaper',
  },
  {
    slug: 'sports',
    name: 'Sports',
    shortName: 'Sports',
    title: 'Best Sports & Fitness Services',
    description:
      'Top sports clubs, coaches, fitness brands and gear, independently reviewed for performance, value and results.',
    blurb: 'Clubs, coaches and gear to help you perform.',
    icon: 'Dumbbell',
  },
  {
    slug: 'travel',
    name: 'Travel',
    shortName: 'Travel',
    title: 'Best Travel Companies & Agencies',
    description:
      'The best travel agencies, tour operators and booking services, ranked for value, reliability and unforgettable experiences.',
    blurb: 'Agencies and operators for trips worth taking.',
    icon: 'Plane',
  },
  {
    slug: 'writing',
    name: 'Writing',
    shortName: 'Writing',
    title: 'Best Writing & Content Services',
    description:
      'Trusted copywriting, content and editorial services, reviewed for quality, expertise and dependable delivery.',
    blurb: 'Writers and content teams that get results.',
    icon: 'PenLine',
  },
  {
    slug: 'miscellaneous',
    name: 'Miscellaneous',
    shortName: 'Miscellaneous',
    title: 'Miscellaneous Guides & Reviews',
    description:
      'Everything else worth knowing — a catch-all for guides, reviews and recommendations that span categories.',
    blurb: 'Guides and reviews that defy a single category.',
    icon: 'LayoutGrid',
  },
]

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
