import { Service, ServiceCategory, ServicePackage, PriceAuditRecord } from '../types/database.types';

const AUDIT_STORAGE_KEY = 'VELAMETRIC_PRICE_AUDIT_LOGS';
const SERVICES_STORAGE_KEY = 'VELAMETRIC_SERVICES_STORE';

export const INITIAL_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-dev', name: 'Website & App Development', slug: 'website-app-development', description: 'Websites, Web Apps, SaaS Platforms & Mobile Engineering', sort_order: 1 },
  { id: 'cat-mktg', name: 'Marketing (Digital & Offline)', slug: 'marketing', description: 'Social Media, SEO, Lead Gen Campaigns & Local Activation', sort_order: 2 },
  { id: 'cat-brand', name: 'Branding & Graphics', slug: 'branding-graphics', description: 'Brand Identity, Logos, Visual Systems & Guidelines', sort_order: 3 },
  { id: 'cat-vid', name: 'Video Production', slug: 'video-production', description: '4K Commercial Films, Instagram Reels & Music Videos', sort_order: 4 },
  { id: 'cat-pr', name: 'Media & PR', slug: 'media-pr', description: 'Press Releases, Digital PR, Media Outreach & Reputation', sort_order: 5 },
  { id: 'cat-fin', name: 'Financial Consultancy', slug: 'financial-consultancy', description: 'Government Subsidy Loans, Business CC & Debt Capital', sort_order: 6 },
  { id: 'cat-event', name: 'Event Organization & Management', slug: 'event-organization', description: 'Concerts, Corporate Events, Fashion Shows & Activations', sort_order: 7 }
];

export const INITIAL_SERVICES: Service[] = [
  // 1. WEBSITE DEVELOPMENT
  {
    id: 'srv-web-dev',
    category_id: 'cat-dev',
    category_name: 'Website & App Development',
    name: 'Website Development',
    slug: 'website-development',
    short_description: 'High-performance React & Next.js websites built with modern UI/UX, SEO optimization, and instant WhatsApp integration.',
    full_description: 'We build fast, responsive, and conversion-optimized websites tailored for market leaders. Every website comes with an intuitive admin builder interface, SEO setup, and instant lead capture routing.',
    icon: 'Laptop',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'],
    benefits: ['Sub-second load times & Google Core Web Vitals optimization', 'Modern responsive UI/UX designed for mobile conversions', 'Built-in SEO structure, meta tags & sitemap generator', 'Integrated WhatsApp button, call triggers & lead capture forms'],
    process_steps: [
      { title: '1. Consultation & Wireframe', desc: 'Define page structure, copy hierarchy, and CTA placement.' },
      { title: '2. UI/UX Design & Build', desc: 'Develop responsive React layout and animated visual assets.' },
      { title: '3. CMS & Form Integration', desc: 'Connect inquiry forms directly to CRM pipeline routing.' },
      { title: '4. Testing & Launch', desc: 'Deploy SSL, perform speed tuning, and submit Google Console sitemaps.' }
    ],
    disclaimer: 'Prices shown are starting rates based on standard scope. Domain, hosting, paid plugins, custom assets, and applicable GST are extra unless otherwise specified.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 1,
    packages: [
      {
        id: 'pkg-web-startup',
        service_id: 'srv-web-dev',
        tier: 'STARTUP',
        name: 'Startup Website',
        price: 24999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Startups & Small Businesses',
        inclusions: [
          'Up to 5 pages (Home, About, Services, Contact, Gallery)',
          'Responsive website (Mobile, Tablet, Desktop)',
          'Modern UI/UX design',
          'Basic enquiry form',
          'WhatsApp instant chat button',
          'Direct Call button',
          'Google Maps integration',
          'Basic SEO setup & meta tags',
          'Social media links integration',
          'SSL security configuration',
          'Basic speed optimization',
          '1 month basic technical support'
        ],
        exclusions: [
          'Domain registration',
          'Premium hosting subscription',
          'Paid third-party plugins',
          'Advanced custom web app features',
          'E-commerce & payment gateways',
          'Paid third-party APIs',
          'Professional photography or video',
          'Applicable GST taxes'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-web-ent',
        service_id: 'srv-web-dev',
        tier: 'ENTERPRISE',
        name: 'Enterprise Website',
        price: 59999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Growing & Established Businesses',
        badge: 'Most Popular',
        inclusions: [
          'Up to 12 pages',
          'Premium custom UI/UX design',
          'Responsive mobile-first layout',
          'Headless CMS integration',
          'Admin panel access',
          'Dynamic services catalog',
          'Portfolio & case study showcases',
          'Client testimonials module',
          'Blog / News publishing system',
          'Contact & lead capture management',
          'WhatsApp & CRM pipeline integration',
          'Advanced SEO foundation & meta tags',
          'Google Analytics & Search Console setup',
          'Performance & speed optimization',
          '3 months dedicated support'
        ],
        exclusions: [
          'Domain and server hosting charges',
          'Paid third-party APIs',
          'Stock asset licensing fees',
          'Custom SaaS architecture',
          'Large-scale multi-vendor e-commerce',
          'Third-party software subscriptions',
          'Photography/videography shoots',
          'Applicable GST taxes'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-web-org',
        service_id: 'srv-web-dev',
        tier: 'ORGANIZATION',
        name: 'Organization Website',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Large Organizations & Custom Requirements',
        inclusions: [
          'Custom architecture for Corporates, Universities & Institutions',
          'Advanced multi-user CMS',
          'Multi-language localization support',
          'Multi-location regional structure',
          'Custom web portals & API integrations',
          'Advanced CRM synchronization',
          'Custom analytics & executive dashboards',
          'Enterprise SEO & security audit',
          'Cloud infrastructure setup (AWS / GCP)',
          'Dedicated account manager & SLA support'
        ],
        exclusions: [
          'Scope, timeline, and final quotation provided based on requirements'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 2. WEB APPLICATION & APP DEVELOPMENT
  {
    id: 'srv-web-app',
    category_id: 'cat-dev',
    category_name: 'Website & App Development',
    name: 'Web Application & App Development',
    slug: 'web-application-development',
    short_description: 'Custom SaaS platforms, customer portals, database engines, and full-stack web applications.',
    full_description: 'We design and engineer scalable web applications built with PostgreSQL, authentication rules, role-based dashboards, and REST/GraphQL API connections.',
    icon: 'Laptop',
    cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Prices shown are starting rates based on standard scope. Server hosting, cloud infrastructure, third-party APIs, and applicable GST are extra.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 2,
    packages: [
      {
        id: 'pkg-app-startup',
        service_id: 'srv-web-app',
        tier: 'STARTUP',
        name: 'Startup Web App',
        price: 79999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Early Stage Web Apps & MVP Launch',
        inclusions: [
          'Full-stack business web application',
          'Responsive user interface',
          'User authentication & login system',
          'Database architecture & schema',
          'Admin control dashboard',
          'Basic CRM data management',
          'Basic REST API integration',
          'Deployment & cloud setup support',
          '1 month technical support'
        ],
        exclusions: [
          'Complex third-party API licensing',
          'High-volume cloud server charges',
          'Advanced AI / ML models',
          'Native iOS/Android apps',
          'Paid third-party services',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-app-ent',
        service_id: 'srv-web-app',
        tier: 'ENTERPRISE',
        name: 'Enterprise Web App',
        price: 199999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Scaling Companies & Enterprise Platforms',
        badge: 'Most Popular',
        inclusions: [
          'Custom full-stack web application',
          'Advanced multi-panel admin control',
          'Authentication & session security',
          'Role-based access control (RBAC)',
          'Scalable relational database architecture',
          'Third-party API & webhook integrations',
          'CRM, deal pipelines & automated reports',
          'Real-time notifications & activity logs',
          'Advanced validation forms',
          'Production deployment & SSL security',
          '3 months dedicated support'
        ],
        exclusions: [
          'High-scale cloud infrastructure fees',
          'Major subscription-based APIs',
          'Custom mobile applications (unless in scope)',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-app-org',
        service_id: 'srv-web-app',
        tier: 'ORGANIZATION',
        name: 'Organization Platform',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Enterprise Portals, ERP & AI Platforms',
        inclusions: [
          'Custom SaaS platforms & ERP systems',
          'Multi-tenant enterprise architecture',
          'Mobile application engineering (iOS & Android)',
          'Government & institutional portals',
          'AI / LLM workflow integrations',
          'High-availability microservice ecosystem',
          'Dedicated DevOps & SLA support'
        ],
        exclusions: [
          'Scope, timeline, and final quotation based on technical assessment'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 3. DIGITAL MARKETING
  {
    id: 'srv-digi-mktg',
    category_id: 'cat-mktg',
    category_name: 'Marketing (Digital & Offline)',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    short_description: 'Social media management, viral reel production, SEO ranking, and lead generation campaigns.',
    full_description: 'Accelerate brand visibility with targeted digital marketing campaigns linked to lead capture pipelines and real-time CRM performance analytics.',
    icon: 'Megaphone',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Ad spend budgets (Meta / Google Ads), influencer fees, and GST are extra and billed separately.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 3,
    packages: [
      {
        id: 'pkg-mktg-startup',
        service_id: 'srv-digi-mktg',
        tier: 'STARTUP',
        name: 'Startup Digital Marketing',
        price: 14999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Startups & Local Brands',
        inclusions: [
          'Social media growth strategy',
          'Up to 12 custom social posts per month',
          '4 high-converting short reels',
          'Copywriting & hashtag research',
          'Monthly content calendar approval',
          'Basic page SEO optimization',
          'Google Business Profile setup & management',
          'Monthly analytics performance report'
        ],
        exclusions: [
          'Paid advertisement budget',
          'Influencer collaboration fees',
          'On-location video shoots',
          'Printing / physical marketing',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-mktg-ent',
        service_id: 'srv-digi-mktg',
        tier: 'ENTERPRISE',
        name: 'Enterprise Digital Marketing',
        price: 34999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Growing Brands & E-Commerce',
        badge: 'Most Popular',
        inclusions: [
          'Complete social media management',
          'Up to 20 creative posts per month',
          '8 viral short reels',
          'Comprehensive content strategy',
          'Search Engine Optimization (SEO)',
          'Google Business Profile optimization',
          '2 monthly SEO blog articles',
          'Inbound lead generation strategy',
          'Meta & Google paid ad management',
          'Competitor analysis & conversion tuning',
          'Monthly strategy review meeting'
        ],
        exclusions: [
          'Ad spend budget (billed directly to client ad account)',
          'Influencer charges',
          'Production expenses',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-mktg-org',
        service_id: 'srv-digi-mktg',
        tier: 'ORGANIZATION',
        name: 'Organization Digital Marketing',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Multi-Location Brands & Large Enterprises',
        inclusions: [
          'Multi-platform campaign orchestration',
          'High ad-spend scaling ($10k+ monthly management)',
          'Multi-location regional targeting',
          'Custom lead-capture funnel engineering',
          'Dedicated digital marketing strategist',
          'Brand reputation monitoring',
          'Omnichannel media campaigns'
        ],
        exclusions: [
          'Ad spend budget billed separately'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 4. OFFLINE MARKETING
  {
    id: 'srv-offline-mktg',
    category_id: 'cat-mktg',
    category_name: 'Marketing (Digital & Offline)',
    name: 'Offline Marketing',
    slug: 'offline-marketing',
    short_description: 'Print marketing, local brand activations, BTL activities, and outdoor campaign strategy.',
    full_description: 'Drive high-impact local visibility with offline campaign planning, creative collateral design, print coordination, and regional brand activations.',
    icon: 'Megaphone',
    cover_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Media buying, printing production, outdoor hoarding rentals, and venue fees are extra.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 4,
    packages: [
      {
        id: 'pkg-off-startup',
        service_id: 'srv-offline-mktg',
        tier: 'STARTUP',
        name: 'Startup Offline Campaign',
        price: 24999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Local Brand Launches',
        inclusions: [
          'Campaign strategy & planning',
          'Local marketing roadmap',
          'Flyer, banner & poster designs',
          'Promotional material preparation',
          'Local campaign coordination',
          'Post-campaign summary report'
        ],
        exclusions: [
          'Printing production charges',
          'Outdoor hoarding rentals',
          'Newspaper / Radio ad costs',
          'Venue charges & travel',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-off-ent',
        service_id: 'srv-offline-mktg',
        tier: 'ENTERPRISE',
        name: 'Enterprise Offline Campaign',
        price: 74999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Regional Brand Activations',
        badge: 'Most Popular',
        inclusions: [
          '360-degree campaign strategy',
          'Creative collateral development',
          'High-res print & billboard designs',
          'Outdoor marketing planning',
          'Local activation coordination',
          'Promotional material management',
          'Regional media coordination',
          'Comprehensive performance report'
        ],
        exclusions: [
          'Media buying & space rentals',
          'Print manufacturing costs',
          'Celebrity / influencer fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-off-org',
        service_id: 'srv-offline-mktg',
        tier: 'ORGANIZATION',
        name: 'Organization Offline Campaign',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: State-wide & Large Scale Activations',
        inclusions: [
          'State-wide & multi-city campaigns',
          'Large outdoor billboard networks',
          'Institutional & corporate activations',
          'Event promotions & sponsorships',
          'Integrated online + offline campaigns'
        ],
        exclusions: [
          'Quotation provided based on media plan'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 5. BRANDING & GRAPHICS
  {
    id: 'srv-branding',
    category_id: 'cat-brand',
    category_name: 'Branding & Graphics',
    name: 'Branding & Graphics',
    slug: 'branding-and-graphics',
    short_description: 'Complete brand identity design, logos, brand books, typography systems, and social kits.',
    full_description: 'Craft an unforgettable brand identity. We design logos, color systems, brand guidelines, business stationery, and social media creative kits.',
    icon: 'Sparkles',
    cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Printing, packaging manufacturing, trademark registration, and GST are extra.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 5,
    packages: [
      {
        id: 'pkg-brand-startup',
        service_id: 'srv-branding',
        tier: 'STARTUP',
        name: 'Startup Branding',
        price: 19999,
        price_display_type: 'FIXED',
        currency: 'INR',
        target_audience: 'Best for: New Brand Identities',
        inclusions: [
          'Primary logo design & variations',
          'Brand color palette definition',
          'Typography selection',
          'Basic brand style sheet',
          'Business card design',
          'Letterhead & envelope design',
          'Social media profile kit',
          '5 social media launch creatives'
        ],
        exclusions: [
          'Printing production',
          'Packaging design',
          'Brand photography',
          'Trademark / legal fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-brand-ent',
        service_id: 'srv-branding',
        tier: 'ENTERPRISE',
        name: 'Enterprise Branding',
        price: 49999,
        price_display_type: 'FIXED',
        currency: 'INR',
        target_audience: 'Best for: Complete Rebranding & Scale',
        badge: 'Most Popular',
        inclusions: [
          'Professional brand logo suite',
          'Complete visual identity system',
          'Brand color & gradient guide',
          'Typography hierarchy',
          'Comprehensive brand book & guidelines',
          'Business stationery design',
          'Complete social media creative kit',
          'Pitch deck & presentation template',
          '15 social media creatives',
          'Brand positioning strategy'
        ],
        exclusions: [
          'Physical print production',
          'Packaging manufacturing',
          'Trademark registration fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-brand-org',
        service_id: 'srv-branding',
        tier: 'ORGANIZATION',
        name: 'Organization Identity',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Corporate Identity & Packaging Systems',
        inclusions: [
          'Full corporate identity & rebranding',
          'Multi-brand architecture guidelines',
          'Complete product packaging design systems',
          'Environmental & retail space branding',
          'Global brand governance manuals'
        ],
        exclusions: [
          'Quotation based on project scope'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 6. VIDEO PRODUCTION
  {
    id: 'srv-video-prod',
    category_id: 'cat-vid',
    category_name: 'Video Production',
    name: 'Video Production',
    slug: 'video-production',
    short_description: 'Cinematic commercial films, viral Instagram reels, music videos, and event cinema.',
    full_description: 'In partnership with Destiny Productions, Dapflix, and Ekraahee Films, we produce broadcast-grade commercial video films and high-impact social media reels.',
    icon: 'Video',
    cover_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Actor fees, premium locations, drone permits, travel, and GST are extra unless specified.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 6,
    packages: [
      {
        id: 'pkg-vid-startup',
        service_id: 'srv-video-prod',
        tier: 'STARTUP',
        name: 'Startup Video',
        price: 29999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Brand Commercials & Social Reels',
        inclusions: [
          'Concept & script guidance',
          '1 shoot session with camera crew',
          'Professional lighting & audio setup',
          'Video editing & cuts',
          'Background music track',
          'Basic motion graphics & title cards',
          '1 final video delivered',
          'Optimized for Instagram reels & YouTube'
        ],
        exclusions: [
          'Actors / models fees',
          'Location rental charges',
          'Drone aerial cinematography',
          'Voice-over artist charges',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-vid-ent',
        service_id: 'srv-video-prod',
        tier: 'ENTERPRISE',
        name: 'Enterprise Video',
        price: 74999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: High-Impact Commercials & Reels',
        badge: 'Most Popular',
        inclusions: [
          'Creative concept & scriptwriting',
          'Pre-production planning & storyboard',
          '4K RED / Arri camera shoot session',
          'Professional cinema lighting grid',
          'Post-production editing & color grading',
          'VFX & motion graphics titles',
          'Professional voice-over coordination',
          'Multiple social media formats (9:16, 16:9)',
          'Up to 2 revision rounds'
        ],
        exclusions: [
          'Celebrity fees & premium location fees',
          'Drone permits',
          'Stock asset licensing',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-vid-org',
        service_id: 'srv-video-prod',
        tier: 'ORGANIZATION',
        name: 'Organization Cinema',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Cinema, Documentaries & Ad Films',
        inclusions: [
          'Commercial TVC & ad films',
          'Corporate documentary cinema',
          'Music video productions',
          'Multi-day event cinema coverage',
          'In partnership with Destiny, Dapflix & Ekraahee'
        ],
        exclusions: [
          'Production scope breakdown'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 7. MEDIA & PR
  {
    id: 'srv-media-pr',
    category_id: 'cat-pr',
    category_name: 'Media & PR',
    name: 'Media & PR Strategy',
    slug: 'media-and-pr',
    short_description: 'Press release distribution, digital PR campaigns, media publications, and brand authority.',
    full_description: 'Build brand credibility with strategic media press releases, digital PR placements, and interview features across major news outlets.',
    icon: 'Megaphone',
    cover_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Paid media distribution fees and event press charges are extra.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 7,
    packages: [
      {
        id: 'pkg-pr-startup',
        service_id: 'srv-media-pr',
        tier: 'STARTUP',
        name: 'Startup PR',
        price: 19999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Digital PR & Press Releases',
        inclusions: [
          'PR strategy & media positioning',
          '1 press release draft per month',
          'Basic media list coordination',
          'Digital PR outreach',
          'Monthly media coverage report'
        ],
        exclusions: [
          'Paid guaranteed publication fees',
          'Event press conference costs',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-pr-ent',
        service_id: 'srv-media-pr',
        tier: 'ENTERPRISE',
        name: 'Enterprise PR',
        price: 49999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Regional & National Media Outreach',
        badge: 'Most Popular',
        inclusions: [
          'Comprehensive PR & media roadmap',
          'Multiple press releases per month',
          'Regional & national media outreach',
          'Executive interview coordination',
          'Digital PR & authority backlinks',
          'Reputation monitoring & monthly report'
        ],
        exclusions: [
          'Paid media portal fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-pr-org',
        service_id: 'srv-media-pr',
        tier: 'ORGANIZATION',
        name: 'Organization PR',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Corporate Reputation & State PR',
        inclusions: [
          'Crisis management & corporate PR',
          'State & national press conferences',
          'Government & institutional PR campaigns'
        ],
        exclusions: [
          'Scope based on media plan'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 8. GOVERNMENT SUBSIDY LOANS
  {
    id: 'srv-subsidy-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Government Subsidy Loans Consultancy',
    slug: 'government-subsidy-loans',
    short_description: 'Consultancy for claiming up to 25% capital subsidy refunds on business expansion loans.',
    full_description: 'Our financial advisory team prepares detailed project reports (DPR), handles bank sanction guidance, and assists with government capital subsidy scheme claims.',
    icon: 'Calculator',
    cover_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Financial services are subject to eligibility, lender policies and applicable government regulations. Approval, subsidy, interest rate or funding is not guaranteed.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 8,
    packages: [
      {
        id: 'pkg-sub-startup',
        service_id: 'srv-subsidy-loans',
        tier: 'STARTUP',
        name: 'Startup Consultancy Case',
        price: 4999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Micro & Small Business Units',
        inclusions: [
          'Initial financial consultation',
          'Basic eligibility assessment',
          'Government scheme identification',
          'Document requirement checklist',
          'Application process guidance',
          'Basic business plan guidance'
        ],
        exclusions: [
          'Government nodal application fees',
          'Bank processing charges',
          'CA audit & certification charges',
          'Guaranteed loan approval or subsidy',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-sub-ent',
        service_id: 'srv-subsidy-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Consultancy Case',
        price: 11999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Manufacturing & Expansion Units',
        badge: 'Most Popular',
        inclusions: [
          'Detailed financial consultation',
          'Scheme comparison & subsidy optimization',
          'Comprehensive DPR guidance',
          'Bank sanction documentation support',
          'Nodal agency application filing guidance',
          'Follow-up & audit guidance'
        ],
        exclusions: [
          'Bank / Government filing fees',
          'CA audit charges',
          'Guarantee of loan approval or subsidy',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-sub-org',
        service_id: 'srv-subsidy-loans',
        tier: 'ORGANIZATION',
        name: 'Organization Project Financing',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Large Project & Infrastructure Financing',
        inclusions: [
          'Multi-scheme capital financing',
          'Large manufacturing & infrastructure projects',
          'Multi-location institutional credit advisory'
        ],
        exclusions: [
          'All approvals subject to bank & government policies'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 9. BUSINESS LOANS & CASH CREDIT (CC)
  {
    id: 'srv-business-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Business Loans & Cash Credit (CC)',
    slug: 'business-loans-cash-credit',
    short_description: 'Working capital financing, Cash Credit (CC) limits, machinery loans, and debt capital.',
    full_description: 'We structure business loan applications, evaluate working capital needs, prepare financial projections, and guide bank credit committee reviews.',
    icon: 'Calculator',
    cover_image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Financial services are subject to eligibility, lender policies and applicable regulations. Approval or funding is not guaranteed.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 9,
    packages: [
      {
        id: 'pkg-biz-startup',
        service_id: 'srv-business-loans',
        tier: 'STARTUP',
        name: 'Startup Case',
        price: 4999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Working Capital Assessment',
        inclusions: [
          'Requirement & turnover assessment',
          'Basic eligibility assessment',
          'Loan product guidance',
          'Document checklist preparation',
          'Application submission guidance'
        ],
        exclusions: [
          'Bank / NBFC processing fees',
          'Legal verification charges',
          'Guarantee of loan approval',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-biz-ent',
        service_id: 'srv-business-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Case',
        price: 14999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: CC Limits & Machinery Capital',
        badge: 'Most Popular',
        inclusions: [
          'Detailed working capital requirement audit',
          'Lender product comparison',
          'Business profile & CMA data guidance',
          'Bank presentation preparation',
          'Follow-up support'
        ],
        exclusions: [
          'Bank processing charges',
          'Legal / accounting fees',
          'Guarantee of loan approval',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-biz-org',
        service_id: 'srv-business-loans',
        tier: 'ORGANIZATION',
        name: 'Organization Corporate Finance',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Structured Corporate Financing & Large CC Limits',
        inclusions: [
          'Large working capital CC limits ($1M+)',
          'Machinery & plant expansion financing',
          'Structured debt syndicate financing'
        ],
        exclusions: [
          'Approval subject to lender credit committee'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 10. PERSONAL LOANS
  {
    id: 'srv-personal-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Personal Loans Consultancy',
    slug: 'personal-loans-consultancy',
    short_description: 'Eligibility assessment, documentation checklist, and application guidance for personal credit.',
    full_description: 'Professional guidance for personal credit evaluation, interest rate comparisons, and bank documentation filing.',
    icon: 'Calculator',
    cover_image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'All lending decisions, interest rates, and loan approvals remain solely with respective banks and NBFC lenders.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 10,
    packages: [
      {
        id: 'pkg-per-startup',
        service_id: 'srv-personal-loans',
        tier: 'STARTUP',
        name: 'Startup Case',
        price: 999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Individual Eligibility Assessment',
        inclusions: [
          'Initial requirement evaluation',
          'Basic CIBIL & eligibility guidance',
          'Document checklist',
          'Application submission guidance'
        ],
        exclusions: [
          'Lender processing fees',
          'Approval guarantee',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-per-ent',
        service_id: 'srv-personal-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Case',
        price: 2499,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Priority Processing & Documentation',
        badge: 'Most Popular',
        inclusions: [
          'Detailed credit profile evaluation',
          'Multi-bank product comparison',
          'Complete documentation support',
          'Priority application guidance'
        ],
        exclusions: [
          'Bank processing charges',
          'Approval guarantee',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-per-org',
        service_id: 'srv-personal-loans',
        tier: 'ORGANIZATION',
        name: 'Organization Case',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Executive Financial Consultancy',
        inclusions: [
          'Customized high-volume corporate executive consultancy'
        ],
        exclusions: [
          'All decisions remain with lenders'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 11. HOME LOANS
  {
    id: 'srv-home-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Home Loans Consultancy',
    slug: 'home-loans-consultancy',
    short_description: 'Property loan eligibility assessment, interest rate comparison, and balance transfer guidance.',
    full_description: 'Guiding home buyers through mortgage options, property title checks, documentation submission, and bank balance transfer options.',
    icon: 'Calculator',
    cover_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Property verification, stamp duty, valuation charges, and final approval remain subject to lender policies.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 11,
    packages: [
      {
        id: 'pkg-home-startup',
        service_id: 'srv-home-loans',
        tier: 'STARTUP',
        name: 'Startup Case',
        price: 2499,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: First-Time Home Buyers',
        inclusions: [
          'Initial mortgage consultation',
          'Eligibility & income assessment',
          'Document checklist',
          'Application guidance'
        ],
        exclusions: [
          'Bank valuation charges',
          'Legal title search fees',
          'Stamp duty & registration',
          'Approval guarantee',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-home-ent',
        service_id: 'srv-home-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Case',
        price: 5999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Balance Transfer & Construction',
        badge: 'Most Popular',
        inclusions: [
          'Detailed financial & loan comparison',
          'Bank interest rate negotiation support',
          'Documentation assembly assistance',
          'Follow-up guidance'
        ],
        exclusions: [
          'Bank processing & legal fees',
          'Property valuation fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-home-org',
        service_id: 'srv-home-loans',
        tier: 'ORGANIZATION',
        name: 'Organization Case',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Commercial Property & Multi-Unit Financing',
        inclusions: [
          'Complex commercial property & multi-unit financing advisory'
        ],
        exclusions: [
          'Quotation based on project financing scope'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 12. EVENT ORGANIZATION & MANAGEMENT
  {
    id: 'srv-events-mgmt',
    category_id: 'cat-event',
    category_name: 'Event Organization & Management',
    name: 'Event Organization & Management',
    slug: 'event-organization-and-management',
    short_description: 'Corporate events, concerts, fashion shows, college fests, and brand activation management.',
    full_description: 'We plan and execute memorable events with complete staging, vendor management, artist coordination, photography, and live production.',
    icon: 'Sparkles',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    disclaimer: 'Venue rental, artist fees, sound/lighting production, catering, security, and GST are extra.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 12,
    packages: [
      {
        id: 'pkg-evt-startup',
        service_id: 'srv-events-mgmt',
        tier: 'STARTUP',
        name: 'Startup Event',
        price: 49999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Workshops & Brand Activations',
        inclusions: [
          'Event planning & schedule breakdown',
          'Basic event concept design',
          'Vendor coordination',
          'Stage layout & branding plan',
          'Basic social media promotion graphics',
          'Event-day on-site coordination'
        ],
        exclusions: [
          'Venue rental charges',
          'Artist / celebrity fees',
          'Sound & lighting equipment hire',
          'Catering & security',
          'Travel & accommodation',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-evt-ent',
        service_id: 'srv-events-mgmt',
        tier: 'ENTERPRISE',
        name: 'Enterprise Event',
        price: 149999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Corporate Events, Fests & Fashion Shows',
        badge: 'Most Popular',
        inclusions: [
          'End-to-end event planning & execution',
          'Creative concept & stage design',
          'Vendor & production management',
          'Artist & celebrity liaison',
          'Complete event branding & promotion',
          'Social media campaign launch',
          'Event photography & video coordination',
          'On-site event-day crew management',
          'Sponsor coordination'
        ],
        exclusions: [
          'Venue lease fees',
          'Artist performance fees',
          'Catering & hospitality',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-evt-org',
        service_id: 'srv-events-mgmt',
        tier: 'ORGANIZATION',
        name: 'Organization Mega Event',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Concerts, State Events & Mega Festivals',
        inclusions: [
          'Multi-day music festivals & mega concerts',
          'State & government event production',
          'Large corporate summits & fashion weeks',
          'Complete turnkey production management'
        ],
        exclusions: [
          'Scope & quotation based on audience size, location, and technical rider'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Request a Quotation',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  }
];

export const serviceService = {
  async getCategories(): Promise<ServiceCategory[]> {
    return [...INITIAL_SERVICE_CATEGORIES];
  },

  async getServices(): Promise<Service[]> {
    const saved = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Temporary patch for broken image in local storage
        const offlineService = parsed.find((s: any) => s.id === 'srv-offline-mktg');
        if (offlineService && offlineService.cover_image === 'https://images.unsplash.com/photo-1542744094-3a3172720180?auto=format&fit=crop&w=1200&q=80') {
           offlineService.cover_image = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80';
           localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {}
    }
    return [...INITIAL_SERVICES];
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const services = await this.getServices();
    const cleanSlug = slug.toLowerCase().trim();

    // Direct match
    let s = services.find(item => item.slug?.toLowerCase() === cleanSlug || item.id === slug);
    if (s) return JSON.parse(JSON.stringify(s));

    // Alias mapping for common variations & footer links
    const aliasMap: Record<string, string> = {
      'web-app-development': 'web-application-development',
      'web-development': 'website-development',
      'website-builder': 'website-development',
      'web-apps': 'web-application-development',
      'video-production-and-events': 'commercial-video-production',
      'video-production': 'commercial-video-production',
      'video': 'commercial-video-production',
      'reels': 'instagram-reels-production',
      'events': 'event-organization-management',
      'event-management': 'event-organization-management',
      'marketing': 'digital-marketing',
      'branding': 'branding-identity',
      'loans': 'government-subsidy-loans',
      'financial-advisory': 'government-subsidy-loans',
      'pr': 'press-release-digital-pr'
    };

    if (aliasMap[cleanSlug]) {
      s = services.find(item => item.slug === aliasMap[cleanSlug]);
      if (s) return JSON.parse(JSON.stringify(s));
    }

    // Fuzzy matching
    s = services.find(item => {
      const itemSlug = (item.slug || '').toLowerCase();
      const itemName = (item.name || '').toLowerCase();
      return itemSlug.includes(cleanSlug) || cleanSlug.includes(itemSlug) || itemName.includes(cleanSlug);
    });

    return s ? JSON.parse(JSON.stringify(s)) : null;
  },

  async saveService(serviceData: Partial<Service>, changedBy: string = 'Super Admin'): Promise<Service> {
    const services = await this.getServices();
    let updatedService: Service;

    if (serviceData.id) {
      const idx = services.findIndex(s => s.id === serviceData.id);
      if (idx !== -1) {
        // Track price changes for audit logging
        const oldService = services[idx];
        if (serviceData.packages && oldService.packages) {
          serviceData.packages.forEach(newPkg => {
            const oldPkg = oldService.packages?.find(p => p.id === newPkg.id);
            if (oldPkg && (oldPkg.price !== newPkg.price || oldPkg.price_display_type !== newPkg.price_display_type)) {
              this.logPriceAudit({
                id: `audit-${Date.now()}-${Math.random()}`,
                service_id: oldService.id,
                service_name: oldService.name,
                package_id: newPkg.id,
                package_name: newPkg.name,
                old_price_display: oldPkg.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : `₹${oldPkg.price.toLocaleString()}`,
                new_price_display: newPkg.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : `₹${newPkg.price.toLocaleString()}`,
                changed_by: changedBy,
                timestamp: new Date().toISOString()
              });
            }
          });
        }

        services[idx] = { ...services[idx], ...serviceData } as Service;
        updatedService = services[idx];
      } else {
        updatedService = serviceData as Service;
        services.push(updatedService);
      }
    } else {
      updatedService = {
        id: `srv-${Date.now()}`,
        name: serviceData.name || 'New Service',
        slug: serviceData.slug || `service-${Date.now()}`,
        short_description: serviceData.short_description || '',
        full_description: serviceData.full_description || '',
        icon: serviceData.icon || 'Laptop',
        cover_image: serviceData.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        is_featured: serviceData.is_featured ?? false,
        status: serviceData.status || 'PUBLISHED',
        sort_order: services.length + 1,
        ...serviceData
      } as Service;
      services.push(updatedService);
    }

    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_services_updated', { detail: { services } }));
      window.dispatchEvent(new Event('storage'));
    }
    return JSON.parse(JSON.stringify(updatedService));
  },

  async deleteService(id: string): Promise<boolean> {
    let services = await this.getServices();
    services = services.filter(s => s.id !== id);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_services_updated', { detail: { services } }));
      window.dispatchEvent(new Event('storage'));
    }
    return true;
  },

  async logPriceAudit(record: PriceAuditRecord): Promise<void> {
    const logs = await this.getPriceAuditLogs();
    logs.unshift(record);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  },

  async getPriceAuditLogs(): Promise<PriceAuditRecord[]> {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'audit-initial',
        service_id: 'srv-web-dev',
        service_name: 'Website Development',
        package_id: 'pkg-web-ent',
        package_name: 'Enterprise Website',
        old_price_display: '₹49,999',
        new_price_display: '₹59,999',
        changed_by: 'Super Admin',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }
};
