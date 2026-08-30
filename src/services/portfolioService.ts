import { PortfolioProject, CaseStudy } from '../types/database.types';

let localProjects: PortfolioProject[] = [
  // 1. WEB & APP PLATFORMS WITH CRM
  {
    id: 'proj-velametric-1',
    title: 'Website & Real Estate CRM Platform',
    slug: 'website-real-estate-crm',
    client: 'Velametric Real Estate Group',
    live_url: 'https://navajowhite-ant-953565.hostingersite.com/',
    project_type: 'web_app',
    description: 'An all-in-one real estate website and CRM system featuring interactive 3D property listings, automated agent lead assignment, and instant visit scheduling.',
    challenge: 'High drop-off rate on luxury property detail pages and fragmented lead tracking across property agents.',
    solution: 'Built a custom PropTech website with interactive WebGL floorplan previews and direct routing to the Velametric Real Estate CRM pipeline.',
    results: 'Generated 140+ qualified buyer inquiries in 30 days and reduced cost per lead acquisition by 62%.',
    featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    videos: [],
    completion_date: '2026-08-01',
    testimonial_quote: 'The real estate CRM and automated agent lead assignment transformed our luxury property sales completely.',
    testimonial_author: 'Managing Director, Velametric Real Estate Group',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Website Development', 'Real Estate CRM', '3D Property Showcases'],
    technologies: ['Velametric PropTech Engine', 'React', 'Three.js', 'PostgreSQL'],
    industry: 'Real Estate & PropTech'
  },
  {
    id: 'proj-velametric-2',
    title: 'Website & Institute of Distance Education CRM Platform',
    slug: 'website-distance-education-crm',
    client: 'Velametric Distance Education Institute',
    live_url: 'https://sienna-chimpanzee-129344.hostingersite.com/',
    project_type: 'web_app',
    description: 'A comprehensive distance learning portal and student enrollment CRM designed for university distance education institutes.',
    challenge: 'EduNexus faced unoptimized course enrollment funnels, slow admission processing, and fragmented student communication.',
    solution: 'Integrated a headless CMS course catalog with automated admission lead follow-up email sequences and student portal integration.',
    results: 'Over 15,000 active distance students enrolled within 6 months while lowering student acquisition cost by 40%.',
    featured_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'],
    videos: [],
    completion_date: '2026-08-10',
    testimonial_quote: 'Our distance education course enrollments tripled within two quarters thanks to automated student follow-up pipelines.',
    testimonial_author: 'Dean of Admissions, Institute of Distance Education',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Website Development', 'Distance Education CRM', 'Student Portal'],
    technologies: ['Velametric EdTech LMS Engine', 'React', 'Supabase Realtime'],
    industry: 'Education & EdTech'
  },
  {
    id: 'proj-velametric-3',
    title: 'E-Commerce Website with Integrated CRM Platform',
    slug: 'ecommerce-website-with-crm',
    client: 'Velametric Global Retail',
    live_url: 'https://mediumvioletred-viper-351367.hostingersite.com/',
    project_type: 'web_app',
    description: 'A high-conversion e-commerce storefront with integrated customer CRM, order tracking, abandoned cart follow-up automation, and payment gateways.',
    challenge: 'High abandoned cart rates and lack of customer lifetime value (LTV) tracking across online sales channels.',
    solution: 'Launched headless e-commerce storefront linked directly to customer purchase CRM and automated WhatsApp/email recovery tasks.',
    results: '310% increase in repeat customer orders and 100% multi-channel sales attribution.',
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1556742049-0a675659e366?auto=format&fit=crop&w=800&q=80'],
    videos: [],
    completion_date: '2026-08-20',
    testimonial_quote: 'The integrated e-commerce CRM allowed us to automate abandoned cart recoveries and track customer retention effortlessly.',
    testimonial_author: 'VP of E-Commerce, Velametric Retail',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['E-Commerce Storefront', 'Customer CRM', 'Payment Gateways'],
    technologies: ['Velametric Commerce Engine', 'React', 'Supabase'],
    industry: 'Retail & E-Commerce'
  },

  // 2. PRODUCTION & EVENT PARTNERS
  {
    id: 'proj-prod-1',
    title: 'Destiny Productions — Commercials & Event Cinema',
    slug: 'destiny-productions-showcase',
    client: 'Destiny Productions',
    project_type: 'video_production',
    instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
    production_partner: {
      name: 'Destiny Productions',
      instagram_handle: '@destiny_in_productions',
      instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
      tagline: 'High-Energy Commercials & Mega Event Cinema',
      role: 'Official Production Partner'
    },
    description: 'Cinematic brand commercial films, high-octane event coverage, and multi-camera live production engineered in partnership with Destiny Productions.',
    challenge: 'Delivering broadcast-grade 4K video coverage and viral reel edits for high-profile arena events under tight timelines.',
    solution: 'Utilized multi-angle RED camera setups, aerial drone cinematography, and same-day Instagram reel edit turnarounds.',
    results: 'Over 2.4 Million cumulative Instagram views and 85,000+ engagements across official event release campaigns.',
    featured_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
    ],
    videos: ['https://www.instagram.com/destiny_in_productions/?hl=en'],
    completion_date: '2026-08-15',
    testimonial_quote: 'Collaborating with Velametric allowed us to integrate digital landing pages with our live event cinema coverage seamlessly.',
    testimonial_author: 'Creative Director, Destiny Productions',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Video Production', 'Event Cinema', 'Instagram Reels'],
    technologies: ['RED Cinema Camera', 'Drone Aerials', 'DaVinci Resolve'],
    industry: 'Media & Event Production',
    video_reels: [
      {
        id: 'reel-d1',
        title: 'Arena Live Event Aftermovie 2026',
        video_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        partner_name: 'Destiny Productions',
        instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        views_count: '850K',
        duration: '0:58'
      },
      {
        id: 'reel-d2',
        title: 'Luxury Brand Commercial Campaign',
        video_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        thumbnail_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
        partner_name: 'Destiny Productions',
        instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        views_count: '1.2M',
        duration: '0:45'
      }
    ]
  },
  {
    id: 'proj-prod-2',
    title: 'Dapflix — Music Videos & Viral Instagram Reels',
    slug: 'dapflix-production-showcase',
    client: 'Dapflix',
    project_type: 'video_production',
    instagram_url: 'https://www.instagram.com/dapflix/?hl=en',
    production_partner: {
      name: 'Dapflix',
      instagram_handle: '@dapflix',
      instagram_url: 'https://www.instagram.com/dapflix/?hl=en',
      tagline: 'Cinematic Music Videos & Vertical Reel Storytelling',
      role: 'Official Production Partner'
    },
    description: 'Dynamic music videos, trendy vertical short-form Instagram reels, and youth culture visual storytelling produced by Dapflix.',
    challenge: 'Optimizing visual pacing and color palette dynamics for maximum organic retention on Instagram and TikTok algorithms.',
    solution: 'Designed ultra-punchy 9:16 vertical video edits with custom sound design, fast-paced transitions, and stylized LUT color grades.',
    results: 'Reached #1 trending sound ranking on social platforms with over 4.8 Million aggregate reel plays.',
    featured_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    ],
    videos: ['https://www.instagram.com/dapflix/?hl=en'],
    completion_date: '2026-08-18',
    testimonial_quote: 'Dapflix and Velametric create the ultimate combination of high-impact visual media and digital conversion tools.',
    testimonial_author: 'Lead Director, Dapflix',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Music Videos', 'Viral Instagram Reels', 'Color Grading'],
    technologies: ['Sony FX6', 'Anamorphic Lenses', 'After Effects'],
    industry: 'Entertainment & Music Production',
    video_reels: [
      {
        id: 'reel-dp1',
        title: 'Official Music Video Teaser Reel',
        video_url: 'https://www.instagram.com/dapflix/?hl=en',
        thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
        partner_name: 'Dapflix',
        instagram_url: 'https://www.instagram.com/dapflix/?hl=en',
        views_count: '2.1M',
        duration: '0:30'
      },
      {
        id: 'reel-dp2',
        title: 'Urban Fashion Viral Reel Cut',
        video_url: 'https://www.instagram.com/dapflix/?hl=en',
        thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        partner_name: 'Dapflix',
        instagram_url: 'https://www.instagram.com/dapflix/?hl=en',
        views_count: '1.7M',
        duration: '0:22'
      }
    ]
  },
  {
    id: 'proj-prod-3',
    title: 'Ekraahee Films — High-Fashion & Corporate Cinema',
    slug: 'ekraaheefilms-production-showcase',
    client: 'Ekraahee Films',
    project_type: 'video_production',
    instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
    production_partner: {
      name: 'Ekraahee Films',
      instagram_handle: '@ekraaheefilms',
      instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
      tagline: 'High-Fashion Storytelling & Corporate Cinema',
      role: 'Official Production Partner'
    },
    description: 'High-fashion editorial films, luxury brand commercials, and corporate documentary storytelling crafted by Ekraahee Films.',
    challenge: 'Capturing bespoke high-fashion aesthetics and corporate leadership narratives with cinematic authenticity.',
    solution: 'Deployed Arri Alexa Mini LF camera packages, customized studio lighting grids, and orchestral sound design scores.',
    results: 'Nominated for top regional fashion media film awards and generated 1.8M organic Instagram views.',
    featured_image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    videos: ['https://www.instagram.com/ekraaheefilms/?hl=en#'],
    completion_date: '2026-08-22',
    testimonial_quote: 'Working alongside Ekraahee Films brings an unmatched level of elegance and storytelling rigor to every production.',
    testimonial_author: 'Founder & Director, Ekraahee Films',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Fashion Commercials', 'Corporate Documentaries', 'Cinematography'],
    technologies: ['Arri Alexa Mini', 'Master Prime Lenses', 'Pro Tools'],
    industry: 'Fashion & Corporate Cinema',
    video_reels: [
      {
        id: 'reel-ef1',
        title: 'Haute Couture Fashion Film Reel',
        video_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        thumbnail_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
        partner_name: 'Ekraahee Films',
        instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        views_count: '920K',
        duration: '0:40'
      },
      {
        id: 'reel-ef2',
        title: 'Corporate Leadership Vision Documentary',
        video_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        thumbnail_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
        partner_name: 'Ekraahee Films',
        instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        views_count: '640K',
        duration: '1:15'
      }
    ]
  },
  // 3. FASHION & MODEL PORTFOLIO PHOTOSHOOT SHOWCASE
  {
    id: 'proj-fashion-1',
    title: 'Botanical Sunflower Couture — Model Portfolio Shoot',
    slug: 'botanical-sunflower-couture-shoot',
    client: 'Velametric Fashion & Media Studio',
    project_type: 'fashion_photography',
    instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
    production_partner: {
      name: 'Destiny Productions & Ekraahee Films',
      instagram_handle: '@destiny_in_productions',
      instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
      tagline: 'High-Fashion Portfolios, Editorial Modeling & Commercial Cinema',
      role: 'Creative Direction & Fashion Photography'
    },
    description: 'An exclusive outdoor high-fashion model portfolio shoot featuring bespoke handcrafted sunflower floral embroidery on ivory couture with soft natural mountain daylight illumination.',
    challenge: 'Achieving luminous natural skin tones while balancing high-contrast direct sunlight and highlighting intricate floral embroidery texture on white fabrics.',
    solution: 'Shot with Sony A7R V paired with 85mm f/1.4 G-Master prime lens utilizing subtle diffused bounce lighting and specialized filmic tone curve color grading.',
    results: 'Featured in premier Uttarakhand regional fashion lookbooks and generated 98,000+ viral impressions across Instagram fashion community reels.',
    featured_image: '/images/portfolio/model-portfolio-sunflower-01.jpg',
    gallery: [
      '/images/portfolio/model-portfolio-sunflower-01.jpg',
      '/images/portfolio/model-portfolio-sunflower-02.jpg'
    ],
    videos: ['https://www.instagram.com/destiny_in_productions/?hl=en'],
    completion_date: '2026-08-28',
    testimonial_quote: 'The composition, lighting dynamics, and color grading elevated my modeling portfolio to international agency standards.',
    testimonial_author: 'Professional Model, Velametric Fashion Network',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Model Portfolio Shoots', 'Outdoor Fashion Photography', 'Bespoke Styling', 'High-End Color Grading'],
    technologies: ['Sony A7R V', '85mm f/1.4 GM', 'Natural & Diffused Daylight', 'Capture One Pro'],
    industry: 'Fashion & Model Photography',
    video_reels: [
      {
        id: 'reel-f1',
        title: 'Botanical Couture Model Reel',
        video_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        thumbnail_url: '/images/portfolio/model-portfolio-sunflower-01.jpg',
        partner_name: 'Destiny Productions',
        instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        views_count: '340K',
        duration: '0:35'
      }
    ]
  },
  {
    id: 'proj-fashion-2',
    title: 'Urban Noir & Monochrome Fur — Fashion Lookbook Shoot',
    slug: 'urban-noir-fur-lookbook-shoot',
    client: 'Velametric Fashion & Media Studio',
    project_type: 'fashion_photography',
    instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
    production_partner: {
      name: 'Ekraahee Films & Dapflix',
      instagram_handle: '@ekraaheefilms',
      instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
      tagline: 'Contemporary Street Style & Luxury Brand Lookbooks',
      role: 'Fashion Photography & Cinematography'
    },
    description: 'High-contrast contemporary street style and editorial lookbook shoot pairing plush midnight black fur jackets with structured monochrome houndstooth pattern dresses in dynamic rooftop daylight.',
    challenge: 'Retaining fine shadow depth in rich faux fur textures without losing the geometric clarity of the houndstooth dress pattern.',
    solution: 'Employed high dynamic range metering, multi-angle editorial poses, and precision edge-lighting to separate subject silhouettes against natural backgrounds.',
    results: 'Acclaimed lookbook portfolio release driving a 240% increase in commercial model booking requests.',
    featured_image: '/images/portfolio/model-portfolio-urban-fur-01.jpg',
    gallery: [
      '/images/portfolio/model-portfolio-urban-fur-01.jpg',
      '/images/portfolio/model-portfolio-urban-fur-02.jpg',
      '/images/portfolio/model-portfolio-editorial-seating-01.jpg'
    ],
    videos: ['https://www.instagram.com/ekraaheefilms/?hl=en#'],
    completion_date: '2026-08-29',
    testimonial_quote: 'The team captured the bold contrast of the noir fur jacket and houndstooth silhouette with breathtaking editorial sophistication.',
    testimonial_author: 'Fashion Stylist & Creative Director',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Fashion Editorial Shoots', 'Commercial Brand Lookbooks', 'Cinematic Retouching', 'Outdoor Fashion Direction'],
    technologies: ['Sony A7R V', '50mm f/1.2 GM', 'High Dynamic Range Lighting', 'DaVinci Resolve Color'],
    industry: 'Fashion & Model Photography',
    video_reels: [
      {
        id: 'reel-f2',
        title: 'Urban Noir Fashion Lookbook Reel',
        video_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        thumbnail_url: '/images/portfolio/model-portfolio-urban-fur-01.jpg',
        partner_name: 'Ekraahee Films',
        instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        views_count: '480K',
        duration: '0:45'
      }
    ]
  },
  {
    id: 'proj-fashion-3',
    title: 'Studio Minimalist Noir & Street Glam — Model Test Series',
    slug: 'studio-minimalist-noir-model-lookbook',
    client: 'Velametric Fashion & Media Studio',
    project_type: 'fashion_photography',
    instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
    production_partner: {
      name: 'Destiny Productions & Dapflix',
      instagram_handle: '@destiny_in_productions',
      instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
      tagline: 'Contemporary Commercial Modeling & High-Key Studio Shoots',
      role: 'Creative Direction & Fashion Photography'
    },
    description: 'Sleek studio model portfolio test series pairing athletic cropped silhouettes with playful editorial poses, wind machine dynamics, and clean high-key studio backdrop lighting.',
    challenge: 'Balancing crisp hair motion and dynamic expression capture while maintaining clean shadow gradients on neutral seamless studio cycloramas.',
    solution: 'Multi-point Profoto strobe configuration with large Octabox key light and high-speed sync capturing spontaneous motion with pin-sharp clarity.',
    results: 'Model talent shortlisted for national athletic apparel and beauty commercial campaigns.',
    featured_image: '/images/portfolio/model-portfolio-lollipop-portrait-01.jpg',
    gallery: [
      '/images/portfolio/model-portfolio-lollipop-portrait-01.jpg',
      '/images/portfolio/model-portfolio-black-crop-standing-01.jpg',
      '/images/portfolio/model-portfolio-black-crop-seated-01.jpg'
    ],
    videos: ['https://www.instagram.com/destiny_in_productions/?hl=en'],
    completion_date: '2026-08-30',
    testimonial_quote: 'The studio lighting and artistic direction brought out a versatile range of editorial expressions effortlessly.',
    testimonial_author: 'Commercial Casting Director, Fashion Network',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Studio Model Portfolios', 'Lookbook Production', 'High-Key Lighting', 'Fashion Retouching'],
    technologies: ['Sony A7R V', 'Profoto D2 Strobes', 'Octabox 5ft', 'Capture One Pro'],
    industry: 'Fashion & Model Photography',
    video_reels: [
      {
        id: 'reel-f3',
        title: 'Minimalist Noir Studio BTS Reel',
        video_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        thumbnail_url: '/images/portfolio/model-portfolio-lollipop-portrait-01.jpg',
        partner_name: 'Destiny Productions',
        instagram_url: 'https://www.instagram.com/destiny_in_productions/?hl=en',
        views_count: '290K',
        duration: '0:28'
      }
    ]
  },
  {
    id: 'proj-fashion-4',
    title: 'Golden Opulence & Earth Tone Drapery — High-Fashion Series',
    slug: 'golden-opulence-earth-tone-editorial',
    client: 'Velametric Fashion & Media Studio',
    project_type: 'fashion_photography',
    instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
    production_partner: {
      name: 'Ekraahee Films & Velametric Studio',
      instagram_handle: '@ekraaheefilms',
      instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
      tagline: 'Haute Couture Editorial, Glamour & Texture Storytelling',
      role: 'Fashion Photography & Color Grading'
    },
    description: 'Luxe evening cocktail dress with gold sequined embroidery and minimalist earth-tone ribbed couture capturing warm ambient studio contours and sculptural posing.',
    challenge: 'Highlighting reflective gold metallic sequin sparkle without blowing out soft skin tones and fabric weave textures.',
    solution: 'Cross-polarized lighting setup with warm parabolic bounce reflectors for smooth skin tonal rolloff and controlled specular highlights on metallic sequins.',
    results: 'Featured across luxury boutique lookbooks and generated 115,000+ engagements on Instagram fashion reels.',
    featured_image: '/images/portfolio/model-portfolio-gold-sequin-glam-01.jpg',
    gallery: [
      '/images/portfolio/model-portfolio-gold-sequin-glam-01.jpg',
      '/images/portfolio/model-portfolio-beige-couture-kneeling-01.jpg'
    ],
    videos: ['https://www.instagram.com/ekraaheefilms/?hl=en#'],
    completion_date: '2026-08-30',
    testimonial_quote: 'The balance between reflective gold sequin glitter and warm earthy tones was executed with pure luxury perfection.',
    testimonial_author: 'Couture Fashion Designer',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Evening Glamour Shoots', 'Textured Drapery Photography', 'Commercial Lookbooks', 'Color Grading'],
    technologies: ['Sony A7R V', '85mm f/1.4 GM', 'Cross-Polarized Lighting', 'DaVinci Resolve Color'],
    industry: 'Fashion & Model Photography',
    video_reels: [
      {
        id: 'reel-f4',
        title: 'Golden Glamour Editorial Reel',
        video_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        thumbnail_url: '/images/portfolio/model-portfolio-gold-sequin-glam-01.jpg',
        partner_name: 'Ekraahee Films',
        instagram_url: 'https://www.instagram.com/ekraaheefilms/?hl=en#',
        views_count: '510K',
        duration: '0:42'
      }
    ]
  }
];

let localCaseStudies: CaseStudy[] = [
  {
    id: 'cs-velametric-1',
    title: 'Scaling Velametric Enterprise & Media Platforms by 310%',
    slug: 'scaling-velametric-enterprise-platforms',
    client: 'Velametric Global & Production Network',
    challenge: 'Fragmented customer journeys across real estate listings, education enrollments, e-commerce, and media campaigns.',
    solution: 'Deployed Velametric Global Built CMS & CRM engines linked to Destiny, Dapflix, and Ekraahee Films video production pipelines.',
    results: 'Triple-digit growth in sales conversion rates across Real Estate, Distance Education, E-Commerce, and Video Media channels.',
    featured_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    testimonial_quote: 'Velametric provided the unified platform for web publishing, industry CRM, financial advisory, and cinematic video production.',
    is_featured: true,
    status: 'PUBLISHED',
    metrics: [
      { id: 'm-1', case_study_id: 'cs-velametric-1', value: '310', prefix: '+', suffix: '%', label: 'Sales Velocity Growth' },
      { id: 'm-2', case_study_id: 'cs-velametric-1', value: '9', prefix: '', suffix: 'M+ Views', label: 'Instagram Reel Reach' },
      { id: 'm-3', case_study_id: 'cs-velametric-1', value: '3', prefix: '', suffix: ' Production Partners', label: 'Destiny, Dapflix, Ekraahee' }
    ]
  }
];

export const portfolioService = {
  async getProjects(): Promise<PortfolioProject[]> {
    return [...localProjects];
  },

  async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    const p = localProjects.find(item => item.slug === slug);
    return p ? JSON.parse(JSON.stringify(p)) : null;
  },

  async getCaseStudies(): Promise<CaseStudy[]> {
    return [...localCaseStudies];
  },

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
    const cs = localCaseStudies.find(item => item.slug === slug);
    return cs ? JSON.parse(JSON.stringify(cs)) : null;
  },

  async saveProject(project: Partial<PortfolioProject>): Promise<PortfolioProject> {
    if (project.id) {
      const idx = localProjects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        localProjects[idx] = { ...localProjects[idx], ...project } as PortfolioProject;
        return JSON.parse(JSON.stringify(localProjects[idx]));
      }
    }
    const newProj: PortfolioProject = {
      id: `proj-${Date.now()}`,
      title: project.title || 'New Project',
      slug: project.slug || `project-${Date.now()}`,
      client: project.client || 'Client Name',
      live_url: project.live_url || '',
      description: project.description || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      results: project.results || '',
      featured_image: project.featured_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      gallery: project.gallery || [],
      videos: project.videos || [],
      completion_date: project.completion_date || new Date().toISOString().split('T')[0],
      is_featured: project.is_featured ?? false,
      status: project.status || 'PUBLISHED',
      ...project
    };
    localProjects.push(newProj);
    return JSON.parse(JSON.stringify(newProj));
  },

  async saveCaseStudy(cs: Partial<CaseStudy>): Promise<CaseStudy> {
    if (cs.id) {
      const idx = localCaseStudies.findIndex(item => item.id === cs.id);
      if (idx !== -1) {
        localCaseStudies[idx] = { ...localCaseStudies[idx], ...cs } as CaseStudy;
        return JSON.parse(JSON.stringify(localCaseStudies[idx]));
      }
    }
    const newCS: CaseStudy = {
      id: `cs-${Date.now()}`,
      title: cs.title || 'New Case Study',
      slug: cs.slug || `case-study-${Date.now()}`,
      client: cs.client || 'Client',
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      results: cs.results || '',
      featured_image: cs.featured_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      is_featured: cs.is_featured ?? false,
      status: cs.status || 'PUBLISHED',
      ...cs
    };
    localCaseStudies.push(newCS);
    return JSON.parse(JSON.stringify(newCS));
  }
};
