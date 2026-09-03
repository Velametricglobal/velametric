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

  // 3. EDITORIAL & HIGH-FASHION PHOTOSHOOTS (LOCAL HIGH-RES ASSETS)
  {
    id: 'proj-photo-1',
    title: 'Haute Couture & Modern Fashion Lookbook',
    slug: 'haute-couture-fashion-lookbook',
    client: 'Velametric Fashion Atelier',
    project_type: 'photoshoot',
    description: 'Modern haute couture lookbook and outdoor daylight fashion portraiture emphasizing intricate sunflower embroidery, dynamic postures, and pristine outdoor natural lighting.',
    challenge: 'Balancing intense direct daylight exposure while maintaining texture in bright white silk and vivid yellow floral embroidery.',
    solution: 'Captured using wide dynamic range prime portrait lenses with subtle fill reflectors to achieve clean skin tones and true-to-life fabric color fidelity.',
    results: 'Featured in top regional designer fashion showcases and generated over 350+ lookbook inquiries with high client retention.',
    featured_image: '/images/photoshoot/_dsc9548.jpg',
    gallery: [
      '/images/photoshoot/_dsc9548.jpg',
      '/images/photoshoot/_dsc9549.jpg',
      '/images/photoshoot/_dsc9537.jpg',
      '/images/photoshoot/_dsc9536.jpg',
      '/images/photoshoot/_dsc9544.jpg',
      '/images/photoshoot/_dsc9540.jpg',
      '/images/photoshoot/_dsc9550.jpg',
      '/images/photoshoot/_dsc9551.jpg',
      '/images/photoshoot/_dsc9553.jpg',
      '/images/photoshoot/_dsc9554.jpg',
      '/images/photoshoot/_dsc9555.jpg'
    ],
    videos: [],
    completion_date: '2026-08-25',
    testimonial_quote: 'The clarity, colors, and framing of the lookbook shoot exceeded our expectations. Truly world-class fashion imagery.',
    testimonial_author: 'Lead Fashion Designer, Velametric Atelier',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Fashion Photography', 'Model Portfolio', 'Editorial Retouching', 'Color Grading'],
    technologies: ['Nikon Full-Frame Sensor', 'Prime 85mm f/1.4 Lens', 'Natural Ambient Lighting', 'Capture One Pro'],
    industry: 'Fashion & Apparel'
  },
  {
    id: 'proj-photo-2',
    title: 'Heritage Bridal & Traditional Haute Couture',
    slug: 'heritage-bridal-haute-couture',
    client: 'Velametric Bridal & Heritage Atelier',
    project_type: 'photoshoot',
    description: 'Traditional Himalayan and North-Indian ethnic bridal photoshoot capturing handcrafted gold jewellery, royal lavender embroidered lehenga, and scenic golden hour atmosphere.',
    challenge: 'Capturing intricate gold Nath and jewellery shimmer against soft evening twilight without harsh flash reflections.',
    solution: 'Used fast telephoto f/2.8 zoom optics during peak sunset golden hour to create creamy bokeh backgrounds and warm ambient skin tones.',
    results: 'Delivered high-resolution editorial spread with 100% client satisfaction and 500+ social media shares across campaigns.',
    featured_image: '/images/photoshoot/_dsc9561.jpg',
    gallery: [
      '/images/photoshoot/_dsc9561.jpg',
      '/images/photoshoot/_dsc9556.jpg',
      '/images/photoshoot/_dsc9569.jpg',
      '/images/photoshoot/_dsc9567.jpg',
      '/images/photoshoot/_dsc9563.jpg',
      '/images/photoshoot/_dsc9557.jpg',
      '/images/photoshoot/_dsc9558.jpg',
      '/images/photoshoot/_dsc9564.jpg',
      '/images/photoshoot/_dsc9565.jpg',
      '/images/photoshoot/_dsc9559.jpg',
      '/images/photoshoot/_dsc9560.jpg',
      '/images/photoshoot/_dsc9562.jpg'
    ],
    videos: [],
    completion_date: '2026-08-27',
    testimonial_quote: 'The bridal photos captured the soul and royal elegance of our traditional jewellery collection flawlessly.',
    testimonial_author: 'Creative Director, Heritage Bridal Atelier',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Bridal Photography', 'Jewellery Showcases', 'Sunset Cinematography', 'High-End Retouching'],
    technologies: ['Nikon FX Pro Series', '70-200mm f/2.8 VR', 'Golden Hour Lighting', 'Color Master Suite'],
    industry: 'Bridal & Luxury Jewellery'
  },
  {
    id: 'proj-photo-3',
    title: 'Fine-Art Studio & Silver Jewellery Portraits',
    slug: 'fine-art-studio-jewellery-portraits',
    client: 'Velametric Fine Art Studio',
    project_type: 'photoshoot',
    description: 'Studio-lit fine art jewellery and silver ornament photoshoot with shimmering high-key backdrop, crisp skin tones, and detailed accessory emphasis.',
    challenge: 'Highlighting fine micro-details in silver filigree jewelry against high-sparkle background surfaces.',
    solution: 'Controlled multi-point softbox studio lighting with dedicated rim lights to separate the subject and maximize jewelry luster.',
    results: 'Produced signature commercial catalog imagery ready for luxury print catalogues, web banners, and billboard campaigns.',
    featured_image: '/images/photoshoot/_dsc9528.jpg',
    gallery: [
      '/images/photoshoot/_dsc9528.jpg',
      '/images/photoshoot/_dsc9529.jpg',
      '/images/photoshoot/_dsc9530.jpg',
      '/images/photoshoot/_dsc9531.jpg',
      '/images/photoshoot/_dsc9535.jpg',
      '/images/photoshoot/_dsc9538.jpg'
    ],
    videos: [],
    completion_date: '2026-08-28',
    testimonial_quote: 'Studio portraits and jewellery sharpness were of the absolute highest caliber. Perfect for our luxury catalog.',
    testimonial_author: 'Brand Manager, Fine Art Jewellery Studio',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Studio Photography', 'Jewellery Macro Detail', 'Beauty Retouching', 'Glamour Lighting'],
    technologies: ['Strobe Softbox Array', 'Nikon Micro-NIKKOR', 'High-Key Sparkle Wall', 'Photoshop Raw Engine'],
    industry: 'Fine Art & Studio Portraiture'
  },
  {
    id: 'proj-photo-4',
    title: 'Contemporary Beauty, Hair & Glamour Studio Portfolio',
    slug: 'contemporary-beauty-glamour-portfolio',
    client: 'Velametric Beauty & Talent Studio',
    project_type: 'photoshoot',
    description: 'Contemporary beauty makeover, hair transformation, and high-fashion model portfolio shoot highlighting studio rim lighting, editorial makeup artistry, and lifestyle hair curls.',
    challenge: 'Achieving consistent color temperature between close-up makeup detail and dynamic full-length hair styling movement.',
    solution: 'Engineered dual diffused softbox key lights paired with hair kicker strobes for multidimensional depth and silky hair texture definition.',
    results: 'Created an 8-frame agency model comp card lookbook with 100% approval from commercial casting directors.',
    featured_image: '/images/photoshoot/bp_photo_12.jpg',
    gallery: [
      '/images/photoshoot/bp_photo_12.jpg',
      '/images/photoshoot/bp_photo_4.jpg',
      '/images/photoshoot/bp_photo_5.jpg',
      '/images/photoshoot/bp_photo_8.jpg',
      '/images/photoshoot/bp_photo_9.jpg',
      '/images/photoshoot/bp_photo_10.jpg',
      '/images/photoshoot/bp_photo_11.jpg',
      '/images/photoshoot/bp_photo_13.jpg',
      '/images/photoshoot/bp_photo_1.jpg'
    ],
    videos: [],
    completion_date: '2026-08-29',
    testimonial_quote: 'The studio lighting, hair definition, and color accuracy in these portfolio frames gave our models the competitive edge.',
    testimonial_author: 'Artistic Director, Velametric Beauty Studio',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Model Portfolio', 'Beauty Photography', 'Hair Transformation BTS', 'Studio Retouching'],
    technologies: ['Diffused Key Softboxes', 'Hair Kicker Strobes', 'Prime 50mm f/1.8 Optics', 'Capture One Pro'],
    industry: 'Beauty & Model Portfolios'
  },
  {
    id: 'proj-photo-5',
    title: 'Gold Sequin Haute Couture & Silk Studio Editorial',
    slug: 'gold-sequin-haute-couture-studio',
    client: 'Velametric Haute Couture Studio',
    project_type: 'photoshoot',
    description: 'Exclusive studio fashion spread featuring geometric gold sequined haute couture gown against draped silk backdrop, captured with high-dynamic range studio strobes.',
    challenge: 'Managing intense metallic sequin reflections without washing out skin highlight tones or crushing background silk folds.',
    solution: 'Placed large cross-polarized softboxes with gentle ambient fill to balance sequin sparkle and organic skin luminosity.',
    results: 'Featured as the headline look for regional couture collections with 100% positive editorial reception.',
    featured_image: '/images/photoshoot/6c1a4692.jpg',
    gallery: [
      '/images/photoshoot/6c1a4692.jpg',
      '/images/photoshoot/6c1a4689.jpg',
      '/images/photoshoot/6c1a4690.jpg',
      '/images/photoshoot/6c1a4691.jpg'
    ],
    videos: [],
    completion_date: '2026-08-29',
    testimonial_quote: 'The gold sequin gown shoot came out breathtaking. The light falloff and fabric textures look straight out of a luxury magazine.',
    testimonial_author: 'Head of Couture, Velametric Atelier',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Haute Couture Editorial', 'Studio Strobe Lighting', 'Reflection Management', 'Color Retouching'],
    technologies: ['Full-Frame Pro Sensor', 'Prime 85mm f/1.4 Lens', 'Octabox Soft Diffusers', 'Capture One Pro'],
    industry: 'Haute Couture & Luxury Fashion'
  },
  {
    id: 'proj-photo-6',
    title: 'Pop Editorial & Contemporary Model Studio Lookbook',
    slug: 'pop-editorial-urban-model-lookbook',
    client: 'Velametric Talent & Model Agency',
    project_type: 'photoshoot',
    description: 'Vibrant studio model test shoot featuring high-contrast beauty lighting, dynamic hair motion styling, casual denim overlays, and expressive editorial poses.',
    challenge: 'Balancing playful prop color tones (candy pops) with neutral high-fashion wardrobe and crisp background separation.',
    solution: 'Designed a dynamic rim-lit studio setup paired with gentle directional wind accents to create authentic movement and expression.',
    results: 'Delivered an 11-frame comprehensive agency comp card lookbook for international modeling placements.',
    featured_image: '/images/photoshoot/img_4776.jpg',
    gallery: [
      '/images/photoshoot/img_4776.jpg',
      '/images/photoshoot/img_4781.jpg',
      '/images/photoshoot/img_4797.jpg',
      '/images/photoshoot/img_4762.jpg',
      '/images/photoshoot/img_4756.jpg',
      '/images/photoshoot/6c1a4705.jpg',
      '/images/photoshoot/6c1a4711.jpg',
      '/images/photoshoot/6c1a4725.jpg',
      '/images/photoshoot/6c1a4727.jpg',
      '/images/photoshoot/img_4803.jpg',
      '/images/photoshoot/img_4804.jpg',
      '/images/photoshoot/img_4808.jpg'
    ],
    videos: [],
    completion_date: '2026-08-30',
    testimonial_quote: 'The vibrant pop aesthetic and sharp hair styling delivered the exact dynamic model portfolio look we needed.',
    testimonial_author: 'Talent Scout, Velametric Agency',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Model Portfolio', 'Pop Editorial', 'High-Key Studio Lighting', 'Beauty Retouching'],
    technologies: ['Prime 50mm f/1.8 Optics', 'Dual Softbox Array', 'Wind Machine Accents', 'Photoshop Master Engine'],
    industry: 'Model Portfolios & Pop Fashion'
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

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_PROJECTS = 'velametric_portfolio_projects_v2';
const STORAGE_KEY_STUDIES = 'velametric_case_studies_v2';

function loadProjectsFromStorage(): PortfolioProject[] {
  if (typeof window === 'undefined') return [...localProjects];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading projects from storage:', e);
  }
  return [...localProjects];
}

function notifyPortfolioUpdated(projects: PortfolioProject[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent('velametric_portfolio_updated', { detail: { projects } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Error saving projects to storage:', e);
  }
}

function saveProjectsToStorage(projects: PortfolioProject[]) {
  notifyPortfolioUpdated(projects);
}

export const portfolioService = {
  async getProjects(): Promise<PortfolioProject[]> {
    const local = loadProjectsFromStorage();

    // Optionally try background sync from Supabase if configured
    if (isSupabaseConfigured() && typeof window !== 'undefined') {
      supabase.from('portfolio_projects').select('*').then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const dbMapped: PortfolioProject[] = data.map((row: any) => ({
            id: row.id,
            title: row.title || 'Untitled Project',
            slug: row.slug || `project-${row.id}`,
            client: row.client_name || row.client || 'Client',
            client_name: row.client_name || row.client,
            live_url: row.project_url || row.live_url || '',
            project_url: row.project_url || row.live_url || '',
            project_type: row.category || 'web_app',
            category: row.category,
            description: row.description || row.short_description || '',
            featured_image: row.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            gallery: Array.isArray(row.gallery_images) ? row.gallery_images : (row.gallery || []),
            technologies: Array.isArray(row.technologies) ? row.technologies : [],
            videos: row.video_url ? [row.video_url] : [],
            is_featured: row.is_featured ?? true,
            status: row.status || 'PUBLISHED'
          }));

          // Merge: keep local rich objects and overlay db items
          if (dbMapped.length > 0 && dbMapped.some(p => p.featured_image && p.featured_image.trim())) {
            const merged = [...local];
            dbMapped.forEach(dbP => {
              const idx = merged.findIndex(m => m.id === dbP.id || m.slug === dbP.slug);
              if (idx !== -1) {
                merged[idx] = { ...merged[idx], ...dbP };
              } else {
                merged.push(dbP);
              }
            });
            saveProjectsToStorage(merged);
          }
        }
      }).catch(err => {
        console.warn('Supabase portfolio fetch non-blocking fallback:', err);
      });
    }

    return local;
  },

  async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    const projects = loadProjectsFromStorage();
    const cleanSlug = slug.toLowerCase().trim();
    
    // Direct match
    let p = projects.find(item => item.slug?.toLowerCase() === cleanSlug || item.id === slug);
    
    // Fuzzy match
    if (!p) {
      p = projects.find(item => {
        const itemSlug = (item.slug || '').toLowerCase();
        return itemSlug.includes(cleanSlug) || cleanSlug.includes(itemSlug);
      });
    }
    
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
    const projects = loadProjectsFromStorage();
    let savedProject: PortfolioProject;

    if (project.id) {
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        projects[idx] = { ...projects[idx], ...project } as PortfolioProject;
        savedProject = projects[idx];
      } else {
        savedProject = project as PortfolioProject;
        projects.push(savedProject);
      }
    } else {
      savedProject = {
        id: `proj-${Date.now()}`,
        title: project.title || 'New Project',
        slug: project.slug || `project-${Date.now()}`,
        client: project.client || 'Client Name',
        live_url: project.live_url || '',
        description: project.description || '',
        challenge: project.challenge || '',
        solution: project.solution || '',
        results: project.results || '',
        featured_image: project.featured_image || '/images/photoshoot/_dsc9548.jpg',
        gallery: project.gallery || [],
        videos: project.videos || [],
        completion_date: project.completion_date || new Date().toISOString().split('T')[0],
        is_featured: project.is_featured ?? false,
        status: project.status || 'PUBLISHED',
        ...project
      };
      projects.push(savedProject);
    }

    saveProjectsToStorage(projects);

    // Sync to Supabase if valid UUID or configured
    if (isSupabaseConfigured() && typeof window !== 'undefined') {
      try {
        const dbPayload: any = {
          title: savedProject.title,
          slug: savedProject.slug,
          client_name: savedProject.client,
          project_url: savedProject.live_url,
          description: savedProject.description,
          featured_image: savedProject.featured_image,
          gallery_images: savedProject.gallery || [],
          technologies: savedProject.technologies || [],
          is_featured: savedProject.is_featured,
          status: savedProject.status || 'completed',
          updated_at: new Date().toISOString()
        };

        // If ID is valid UUID, upsert; otherwise match by slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(savedProject.id);
        if (isUUID) {
          dbPayload.id = savedProject.id;
          supabase.from('portfolio_projects').upsert([dbPayload]).then(() => {});
        } else if (savedProject.slug) {
          supabase.from('portfolio_projects').update(dbPayload).eq('slug', savedProject.slug).then(() => {});
        }
      } catch (err) {
        console.warn('Supabase portfolio save non-blocking error:', err);
      }
    }

    return JSON.parse(JSON.stringify(savedProject));
  },

  async deleteProject(id: string): Promise<boolean> {
    let projects = loadProjectsFromStorage();
    const initialLen = projects.length;
    projects = projects.filter(p => p.id !== id);
    saveProjectsToStorage(projects);

    if (isSupabaseConfigured() && typeof window !== 'undefined') {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        supabase.from('portfolio_projects').delete().eq('id', id).then(() => {});
      }
    }

    return projects.length < initialLen;
  },

  async deletePhoto(projectId: string, photoUrl: string): Promise<PortfolioProject | null> {
    const projects = loadProjectsFromStorage();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return null;

    const proj = projects[idx];
    const currentGallery = proj.gallery || [];
    const updatedGallery = currentGallery.filter(url => url !== photoUrl);
    proj.gallery = updatedGallery;

    // If the deleted photo was also the featured_image (display profile photo), replace it with the next photo or placeholder
    if (proj.featured_image === photoUrl) {
      proj.featured_image = updatedGallery.length > 0 ? updatedGallery[0] : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
    }

    projects[idx] = proj;
    saveProjectsToStorage(projects);
    return JSON.parse(JSON.stringify(proj));
  },

  async setFeaturedImage(projectId: string, photoUrl: string): Promise<PortfolioProject | null> {
    const projects = loadProjectsFromStorage();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return null;

    const proj = projects[idx];
    proj.featured_image = photoUrl;

    // Ensure it's in the gallery if not already present
    if (!proj.gallery) proj.gallery = [];
    if (!proj.gallery.includes(photoUrl)) {
      proj.gallery.unshift(photoUrl);
    }

    projects[idx] = proj;
    saveProjectsToStorage(projects);
    return JSON.parse(JSON.stringify(proj));
  },

  async deleteFeaturedImage(projectId: string): Promise<PortfolioProject | null> {
    const projects = loadProjectsFromStorage();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return null;

    const proj = projects[idx];
    const oldFeatured = proj.featured_image;
    const gallery = (proj.gallery || []).filter(url => url !== oldFeatured);
    proj.gallery = gallery;
    proj.featured_image = gallery.length > 0 ? gallery[0] : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';

    projects[idx] = proj;
    saveProjectsToStorage(projects);
    return JSON.parse(JSON.stringify(proj));
  },

  async addPhotoToGallery(projectId: string, photoUrl: string): Promise<PortfolioProject | null> {
    return this.addMultiplePhotosToGallery(projectId, [photoUrl]);
  },

  async addMultiplePhotosToGallery(projectId: string, photoUrls: string[]): Promise<PortfolioProject | null> {
    const projects = loadProjectsFromStorage();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return null;

    const proj = projects[idx];
    if (!proj.gallery) proj.gallery = [];
    
    photoUrls.forEach(url => {
      if (url && url.trim() && !proj.gallery?.includes(url.trim())) {
        proj.gallery?.push(url.trim());
      }
    });

    if (!proj.featured_image || proj.featured_image.includes('unsplash.com/photo-1551288049')) {
      if (proj.gallery.length > 0) {
        proj.featured_image = proj.gallery[0];
      }
    }

    projects[idx] = proj;
    saveProjectsToStorage(projects);
    return JSON.parse(JSON.stringify(proj));
  },

  async restoreProjectDefaults(projectId: string): Promise<PortfolioProject | null> {
    const defaultProj = localProjects.find(p => p.id === projectId);
    if (!defaultProj) return null;

    const projects = loadProjectsFromStorage();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx !== -1) {
      projects[idx] = JSON.parse(JSON.stringify(defaultProj));
      saveProjectsToStorage(projects);
      return JSON.parse(JSON.stringify(projects[idx]));
    }
    return null;
  },

  async resetProjectsToDefault(): Promise<PortfolioProject[]> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_PROJECTS);
      window.dispatchEvent(new CustomEvent('velametric_portfolio_updated', { detail: { projects: localProjects } }));
      window.dispatchEvent(new Event('storage'));
    }
    return [...localProjects];
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
