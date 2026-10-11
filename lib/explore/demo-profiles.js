/**
 * ============================================================
 * WORLDWIDE DIPO
 * EXPLORE — DEMO DIRECTORY
 * ============================================================
 *
 * PURPOSE
 * -------
 * These profiles are ONLY showcase/demo profiles used to make
 * the Worldwide DIPO Explore experience feel alive before real
 * DIPO users join the platform.
 *
 * IMPORTANT LEGAL / PRODUCT RULE
 * ------------------------------
 * None of these profiles represent:
 *
 *   - an official Worldwide DIPO account
 *   - an account created by the person/company
 *   - an endorsement
 *   - a partnership
 *   - a sponsorship
 *   - DIPO verification
 *   - ownership of the DIPO profile
 *
 * Every demo profile permanently carries:
 *
 *   ✦ DIPO Demo
 *   Example / showcase profile
 *   Not an official Worldwide DIPO profile
 *
 * Real users are NEVER stored in this file.
 * Real approved users come from Supabase automatically.
 *
 * ============================================================
 */

const DEMO_NOTICE =
  'Demo showcase profile — not an official Worldwide DIPO profile.';

const DEMO_SOURCE_TYPE = 'public-example';

function createDemoProfile({
  id,
  name,
  slug,
  category,
  profession,
  headline,
  location,
  since,
  knownFor,
  description,
  story,
  tags,
  accent = 'neutral',
}) {
  return {
    id,
    name,
    slug,

    /*
     * Public display information
     */
    category,
    profession,
    headline,
    location,

    /*
     * Story / identity information
     */
    since,
    known_for: knownFor,
    description,
    story,
    tags,

    /*
     * Demo safety
     */
    is_demo: true,
    demo_label: '✦ DIPO Demo',
    demo_notice: DEMO_NOTICE,
    demo_source_type: DEMO_SOURCE_TYPE,

    /*
     * Demo profiles can NEVER be considered owners.
     */
    is_owner: false,

    /*
     * Demo profiles are not database profiles.
     */
    is_real_dipo: false,
    status: 'demo',

    /*
     * No external image is bundled intentionally.
     * The Explore UI can generate initials/avatar fallback.
     */
    avatar_url: null,

    /*
     * UI metadata
     */
    accent,
  };
}

/* ============================================================
   01 — CREATORS
   ============================================================ */

const CREATORS = [
  createDemoProfile({
    id: 'demo-creator-carryminati',
    name: 'CarryMinati',
    slug: 'demo-carryminati',
    category: 'Creators',
    profession: 'Digital Creator',
    headline: 'Indian YouTube Creator & Entertainer',
    location: 'India',
    since: '2014',
    knownFor:
      'YouTube entertainment, gaming, commentary and digital content.',
    description:
      'A demo showcase profile representing how a major creator could structure a digital identity on Worldwide DIPO.',
    story:
      'CarryMinati is known for building a large digital audience through entertainment, gaming and creator-led content.',
    tags: [
      'Creator',
      'YouTube',
      'Gaming',
      'Entertainment',
    ],
    accent: 'creator',
  }),

  createDemoProfile({
    id: 'demo-creator-bhuvan-bam',
    name: 'Bhuvan Bam',
    slug: 'demo-bhuvan-bam',
    category: 'Creators',
    profession: 'Creator & Entertainer',
    headline: 'Digital Creator, Performer & Storyteller',
    location: 'Mumbai, India',
    since: '2015',
    knownFor:
      'BB Ki Vines, comedy, entertainment and original storytelling.',
    description:
      'A demo showcase profile showing how a creator can combine identity, work and social presence in one DIPO.',
    story:
      'Bhuvan Bam built his creator career through character-driven digital entertainment and expanded into music and acting.',
    tags: [
      'Creator',
      'Entertainment',
      'Comedy',
      'Storytelling',
    ],
    accent: 'creator',
  }),

  createDemoProfile({
    id: 'demo-creator-technical-guruji',
    name: 'Technical Guruji',
    slug: 'demo-technical-guruji',
    category: 'Creators',
    profession: 'Technology Creator',
    headline: 'Technology & Gadget Creator',
    location: 'Dubai / India',
    since: '2015',
    knownFor:
      'Technology reviews, gadgets, consumer tech and educational videos.',
    description:
      'A demo technology-creator DIPO showing how content, expertise and links could live together.',
    story:
      'Technical Guruji is known for technology-focused videos covering gadgets, consumer electronics and digital products.',
    tags: [
      'Technology',
      'Gadgets',
      'YouTube',
      'Reviews',
    ],
    accent: 'technology',
  }),

  createDemoProfile({
    id: 'demo-creator-sandeep-maheshwari',
    name: 'Sandeep Maheshwari',
    slug: 'demo-sandeep-maheshwari',
    category: 'Creators',
    profession: 'Motivational Speaker',
    headline: 'Speaker, Entrepreneur & Photographer',
    location: 'New Delhi, India',
    since: '2006',
    knownFor:
      'Motivational talks, personal development and entrepreneurship.',
    description:
      'A demo creator profile showing how knowledge, speaking and professional work could be presented in one place.',
    story:
      'Sandeep Maheshwari is known for motivational content and his entrepreneurial journey, including ImagesBazaar.',
    tags: [
      'Speaker',
      'Motivation',
      'Entrepreneur',
      'Personal Growth',
    ],
    accent: 'creator',
  }),

  createDemoProfile({
    id: 'demo-creator-ranveer-allahbadia',
    name: 'Ranveer Allahbadia',
    slug: 'demo-ranveer-allahbadia',
    category: 'Creators',
    profession: 'Creator & Podcast Host',
    headline: 'Podcast Host, Creator & Entrepreneur',
    location: 'Mumbai, India',
    since: '2014',
    knownFor:
      'Podcasts, interviews, self-improvement and creator content.',
    description:
      'A demo podcast-creator profile showing how multiple content and professional links could be organized.',
    story:
      'Ranveer Allahbadia is known for podcasting, interviews and digital content around personal development and entrepreneurship.',
    tags: [
      'Podcast',
      'Creator',
      'Entrepreneur',
      'Interviews',
    ],
    accent: 'creator',
  }),
];

/* ============================================================
   02 — BUSINESSES
   ============================================================ */

const BUSINESSES = [
  createDemoProfile({
    id: 'demo-business-zerodha',
    name: 'Zerodha',
    slug: 'demo-zerodha',
    category: 'Businesses',
    profession: 'Financial Services',
    headline: 'Technology-led Indian Brokerage',
    location: 'Bengaluru, India',
    since: '2010',
    knownFor:
      'Online investing, trading platforms and retail brokerage services.',
    description:
      'A demo business DIPO showing how a major Indian company could present its identity, products and ecosystem.',
    story:
      'Zerodha began operations in August 2010 and built technology-led brokerage and investing products.',
    tags: [
      'Fintech',
      'Investing',
      'Trading',
      'Technology',
    ],
    accent: 'business',
  }),

  createDemoProfile({
    id: 'demo-business-tata',
    name: 'Tata Group',
    slug: 'demo-tata-group',
    category: 'Businesses',
    profession: 'Business Group',
    headline: 'Global Indian Business Group',
    location: 'Mumbai, India',
    since: '1868',
    knownFor:
      'Businesses across technology, automotive, steel, consumer products and more.',
    description:
      'A demo enterprise profile representing a large multi-business ecosystem on Worldwide DIPO.',
    story:
      'The Tata Group traces its origins to 1868 and operates across multiple industries and markets.',
    tags: [
      'Enterprise',
      'India',
      'Global',
      'Business',
    ],
    accent: 'business',
  }),

  createDemoProfile({
    id: 'demo-business-reliance',
    name: 'Reliance Industries',
    slug: 'demo-reliance-industries',
    category: 'Businesses',
    profession: 'Diversified Enterprise',
    headline: 'Indian Diversified Business Group',
    location: 'Mumbai, India',
    since: '1973',
    knownFor:
      'Energy, petrochemicals, retail, telecommunications and digital services.',
    description:
      'A demo enterprise DIPO showing how a diversified organization could structure its public digital identity.',
    story:
      'Reliance Industries is a diversified Indian enterprise with businesses spanning energy and consumer-facing digital and retail sectors.',
    tags: [
      'Enterprise',
      'Retail',
      'Technology',
      'Telecom',
    ],
    accent: 'business',
  }),

  createDemoProfile({
    id: 'demo-business-infosys',
    name: 'Infosys',
    slug: 'demo-infosys',
    category: 'Businesses',
    profession: 'Technology Services',
    headline: 'Global IT & Consulting Company',
    location: 'Bengaluru, India',
    since: '1981',
    knownFor:
      'IT services, consulting, digital transformation and technology solutions.',
    description:
      'A demo enterprise DIPO showing how a global technology company could organize its digital identity.',
    story:
      'Infosys was established in 1981 and grew into a global technology services and consulting company.',
    tags: [
      'Technology',
      'Consulting',
      'IT Services',
      'Enterprise',
    ],
    accent: 'technology',
  }),

  createDemoProfile({
    id: 'demo-business-mahindra',
    name: 'Mahindra Group',
    slug: 'demo-mahindra-group',
    category: 'Businesses',
    profession: 'Diversified Business Group',
    headline: 'Indian Mobility & Business Group',
    location: 'Mumbai, India',
    since: '1945',
    knownFor:
      'Automotive, farm equipment, technology, financial services and other businesses.',
    description:
      'A demo business profile representing a large Indian group with multiple business verticals.',
    story:
      'Mahindra began in 1945 and has expanded into mobility, farming, technology and several other sectors.',
    tags: [
      'Automotive',
      'Business',
      'Mobility',
      'Enterprise',
    ],
    accent: 'business',
  }),
];

/* ============================================================
   03 — ONLINE BUSINESSES
   ============================================================ */

const ONLINE_BUSINESSES = [
  createDemoProfile({
    id: 'demo-online-meesho',
    name: 'Meesho',
    slug: 'demo-meesho',
    category: 'Online Businesses',
    profession: 'E-commerce Platform',
    headline: 'Online Marketplace for Indian Sellers',
    location: 'Bengaluru, India',
    since: '2015',
    knownFor:
      'Online commerce and seller-focused marketplace experiences.',
    description:
      'A demo online-business DIPO showing how a digital-first company could present its public identity.',
    story:
      'Meesho started in 2015 and developed an online commerce platform connecting sellers and consumers.',
    tags: [
      'E-commerce',
      'Marketplace',
      'Online Business',
      'Sellers',
    ],
    accent: 'online',
  }),

  createDemoProfile({
    id: 'demo-online-flipkart',
    name: 'Flipkart',
    slug: 'demo-flipkart',
    category: 'Online Businesses',
    profession: 'E-commerce',
    headline: 'Indian Digital Commerce Platform',
    location: 'Bengaluru, India',
    since: '2007',
    knownFor:
      'Online shopping, marketplace commerce and digital retail.',
    description:
      'A demo e-commerce profile illustrating how an online business could build a dedicated digital identity.',
    story:
      'Flipkart was founded in 2007 and became one of India’s major online commerce platforms.',
    tags: [
      'E-commerce',
      'Shopping',
      'Marketplace',
      'Online',
    ],
    accent: 'online',
  }),

  createDemoProfile({
    id: 'demo-online-swiggy',
    name: 'Swiggy',
    slug: 'demo-swiggy',
    category: 'Online Businesses',
    profession: 'Food & Convenience Platform',
    headline: 'Online Food & Convenience Platform',
    location: 'Bengaluru, India',
    since: '2014',
    knownFor:
      'Online food ordering, delivery and convenience services.',
    description:
      'A demo digital-business DIPO showing how an online platform could organize its identity and services.',
    story:
      'Swiggy launched in 2014 and expanded from food delivery into broader convenience and commerce services.',
    tags: [
      'Food',
      'Delivery',
      'Online Business',
      'Technology',
    ],
    accent: 'online',
  }),

  createDemoProfile({
    id: 'demo-online-zomato',
    name: 'Zomato',
    slug: 'demo-zomato',
    category: 'Online Businesses',
    profession: 'Food Technology',
    headline: 'Food Discovery & Delivery Platform',
    location: 'Gurugram, India',
    since: '2008',
    knownFor:
      'Restaurant discovery, food delivery and dining technology.',
    description:
      'A demo online-business profile showing how a large digital platform could present its ecosystem.',
    story:
      'Zomato began in 2008 as an online restaurant discovery service and later expanded into food delivery and related services.',
    tags: [
      'Food',
      'Technology',
      'Delivery',
      'Restaurants',
    ],
    accent: 'online',
  }),

  createDemoProfile({
    id: 'demo-online-blinkit',
    name: 'Blinkit',
    slug: 'demo-blinkit',
    category: 'Online Businesses',
    profession: 'Quick Commerce',
    headline: 'Online Convenience & Quick Commerce',
    location: 'Gurugram, India',
    since: '2013',
    knownFor:
      'Quick-commerce delivery and online everyday shopping.',
    description:
      'A demo quick-commerce DIPO showing how an online-first service could structure its digital identity.',
    story:
      'Blinkit began in 2013 under the name Grofers and later evolved into the Blinkit quick-commerce brand.',
    tags: [
      'Quick Commerce',
      'Delivery',
      'Shopping',
      'Online',
    ],
    accent: 'online',
  }),
];

/* ============================================================
   04 — SHOPS
   ============================================================ */

const SHOPS = [
  createDemoProfile({
    id: 'demo-shop-croma',
    name: 'Croma',
    slug: 'demo-croma',
    category: 'Shops',
    profession: 'Electronics Retail',
    headline: 'Consumer Electronics Retailer',
    location: 'India',
    since: '2006',
    knownFor:
      'Consumer electronics, appliances, gadgets and technology products.',
    description:
      'A demo retail DIPO showing how a physical-and-online shop could create one public digital identity.',
    story:
      'Croma is an Indian electronics retail brand with physical stores and an online shopping presence.',
    tags: [
      'Electronics',
      'Retail',
      'Shop',
      'Technology',
    ],
    accent: 'shop',
  }),

  createDemoProfile({
    id: 'demo-shop-reliance-digital',
    name: 'Reliance Digital',
    slug: 'demo-reliance-digital',
    category: 'Shops',
    profession: 'Electronics Retail',
    headline: 'Technology & Electronics Retail',
    location: 'India',
    since: '2007',
    knownFor:
      'Electronics, appliances, gadgets and consumer technology retail.',
    description:
      'A demo shop profile showing how a large retail network could organize products, services and contact information.',
    story:
      'Reliance Digital is an electronics retail business operating across India with stores and digital commerce.',
    tags: [
      'Electronics',
      'Retail',
      'Gadgets',
      'Shop',
    ],
    accent: 'shop',
  }),

  createDemoProfile({
    id: 'demo-shop-vijay-sales',
    name: 'Vijay Sales',
    slug: 'demo-vijay-sales',
    category: 'Shops',
    profession: 'Electronics Retail',
    headline: 'Indian Electronics Retailer',
    location: 'India',
    since: '1967',
    knownFor:
      'Consumer electronics, appliances, televisions, mobiles and computers.',
    description:
      'A demo retail DIPO illustrating how a long-running electronics business could present its digital identity.',
    story:
      'Vijay Sales is an Indian electronics retailer with a long-standing physical retail presence and online shopping channel.',
    tags: [
      'Electronics',
      'Retail',
      'Appliances',
      'Shop',
    ],
    accent: 'shop',
  }),

  createDemoProfile({
    id: 'demo-shop-dmart',
    name: 'DMart',
    slug: 'demo-dmart',
    category: 'Shops',
    profession: 'Retail Store',
    headline: 'Indian Value Retail Chain',
    location: 'Mumbai, India',
    since: '2002',
    knownFor:
      'Everyday retail, grocery, household and consumer products.',
    description:
      'A demo retail profile showing how a physical store network can create a modern digital identity.',
    story:
      'DMart is an Indian retail chain operated by Avenue Supermarts, serving everyday consumer shopping needs.',
    tags: [
      'Retail',
      'Grocery',
      'Shopping',
      'Stores',
    ],
    accent: 'shop',
  }),

  createDemoProfile({
    id: 'demo-shop-shoppers-stop',
    name: 'Shoppers Stop',
    slug: 'demo-shoppers-stop',
    category: 'Shops',
    profession: 'Fashion Retail',
    headline: 'Indian Department Store Retailer',
    location: 'Mumbai, India',
    since: '1991',
    knownFor:
      'Fashion, beauty, accessories and lifestyle retail.',
    description:
      'A demo retail DIPO showing how a multi-category store could organize its online identity.',
    story:
      'Shoppers Stop is an Indian department-store retailer focused on fashion, beauty and lifestyle products.',
    tags: [
      'Fashion',
      'Retail',
      'Lifestyle',
      'Shop',
    ],
    accent: 'shop',
  }),
];

/* ============================================================
   05 — BRANDS
   ============================================================ */

const BRANDS = [
  createDemoProfile({
    id: 'demo-brand-boat',
    name: 'boAt',
    slug: 'demo-boat',
    category: 'Brands',
    profession: 'Consumer Electronics Brand',
    headline: 'Indian Audio & Consumer Electronics Brand',
    location: 'Mumbai, India',
    since: '2016',
    knownFor:
      'Audio products, wearables and consumer electronics.',
    description:
      'A demo brand DIPO showing how a consumer brand could bring products, identity and links into one place.',
    story:
      'boAt was founded in 2016 and grew as an Indian consumer electronics and lifestyle brand.',
    tags: [
      'Audio',
      'Technology',
      'Wearables',
      'Brand',
    ],
    accent: 'brand',
  }),

  createDemoProfile({
    id: 'demo-brand-nykaa',
    name: 'Nykaa',
    slug: 'demo-nykaa',
    category: 'Brands',
    profession: 'Beauty & Lifestyle Brand',
    headline: 'Indian Beauty & Lifestyle Company',
    location: 'Mumbai, India',
    since: '2012',
    knownFor:
      'Beauty, personal care, fashion and lifestyle commerce.',
    description:
      'A demo brand profile showing how a large consumer company could organize its digital identity.',
    story:
      'Nykaa was founded in 2012 by Falguni Nayar as a digital-first beauty and consumer technology platform.',
    tags: [
      'Beauty',
      'Fashion',
      'Lifestyle',
      'E-commerce',
    ],
    accent: 'brand',
  }),

  createDemoProfile({
    id: 'demo-brand-amul',
    name: 'Amul',
    slug: 'demo-amul',
    category: 'Brands',
    profession: 'Food & Dairy Brand',
    headline: 'Indian Dairy & Food Brand',
    location: 'Anand, Gujarat, India',
    since: '1946',
    knownFor:
      'Dairy products, milk, butter, cheese and food products.',
    description:
      'A demo brand DIPO showing how a well-known Indian consumer brand could structure its online identity.',
    story:
      'Amul grew from the cooperative dairy movement in Gujarat and became one of India’s most recognized food brands.',
    tags: [
      'Food',
      'Dairy',
      'Consumer Brand',
      'India',
    ],
    accent: 'brand',
  }),

  createDemoProfile({
    id: 'demo-brand-titan',
    name: 'Titan',
    slug: 'demo-titan',
    category: 'Brands',
    profession: 'Lifestyle Brand',
    headline: 'Indian Watches, Jewellery & Lifestyle Brand',
    location: 'Bengaluru, India',
    since: '1984',
    knownFor:
      'Watches, jewellery, eyewear and lifestyle products.',
    description:
      'A demo lifestyle-brand profile showing how products, categories and digital identity can live together.',
    story:
      'Titan began in 1984 and expanded from watches into jewellery, eyewear and several lifestyle categories.',
    tags: [
      'Watches',
      'Jewellery',
      'Lifestyle',
      'Retail',
    ],
    accent: 'brand',
  }),

  createDemoProfile({
    id: 'demo-brand-mamaearth',
    name: 'Mamaearth',
    slug: 'demo-mamaearth',
    category: 'Brands',
    profession: 'Personal Care Brand',
    headline: 'Indian Personal Care & Beauty Brand',
    location: 'Gurugram, India',
    since: '2016',
    knownFor:
      'Personal care, skincare, haircare and beauty products.',
    description:
      'A demo consumer-brand DIPO showing how a digital-first brand could present its product identity.',
    story:
      'Mamaearth launched in 2016 and developed a consumer brand around personal care and beauty products.',
    tags: [
      'Beauty',
      'Skincare',
      'Personal Care',
      'D2C',
    ],
    accent: 'brand',
  }),
];

/* ============================================================
   06 — SERVICES
   ============================================================ */

const SERVICES = [
  createDemoProfile({
    id: 'demo-service-urban-company',
    name: 'Urban Company',
    slug: 'demo-urban-company',
    category: 'Services',
    profession: 'Home Services Platform',
    headline: 'Technology-enabled Home Services',
    location: 'Gurugram, India',
    since: '2014',
    knownFor:
      'Home cleaning, beauty, repair and professional services.',
    description:
      'A demo service-business DIPO showing how customers could discover services and contact information.',
    story:
      'Urban Company operates a technology platform connecting customers with service professionals across multiple categories.',
    tags: [
      'Home Services',
      'Marketplace',
      'Professionals',
      'Technology',
    ],
    accent: 'service',
  }),

  createDemoProfile({
    id: 'demo-service-ola',
    name: 'Ola',
    slug: 'demo-ola',
    category: 'Services',
    profession: 'Mobility Platform',
    headline: 'Indian Mobility & Transportation Platform',
    location: 'Bengaluru, India',
    since: '2010',
    knownFor:
      'Ride-hailing, mobility and transportation services.',
    description:
      'A demo service profile showing how a large mobility platform could present its digital identity.',
    story:
      'Ola was founded in 2010 and built a technology platform around mobility and transportation services.',
    tags: [
      'Mobility',
      'Transport',
      'Technology',
      'Services',
    ],
    accent: 'service',
  }),

  createDemoProfile({
    id: 'demo-service-rapido',
    name: 'Rapido',
    slug: 'demo-rapido',
    category: 'Services',
    profession: 'Mobility Service',
    headline: 'Bike Taxi & Mobility Platform',
    location: 'Bengaluru, India',
    since: '2015',
    knownFor:
      'Bike taxis and urban mobility services.',
    description:
      'A demo mobility-service DIPO showing how a service brand could organize its customer-facing information.',
    story:
      'Rapido began in 2015 and became known for bike-taxi and mobility services in Indian cities.',
    tags: [
      'Mobility',
      'Bike Taxi',
      'Transport',
      'Urban',
    ],
    accent: 'service',
  }),

  createDemoProfile({
    id: 'demo-service-policybazaar',
    name: 'Policybazaar',
    slug: 'demo-policybazaar',
    category: 'Services',
    profession: 'Insurance Marketplace',
    headline: 'Online Insurance & Financial Services Platform',
    location: 'Gurugram, India',
    since: '2008',
    knownFor:
      'Online comparison and purchase of insurance products.',
    description:
      'A demo service-platform profile illustrating how a digital service could organize its identity and offerings.',
    story:
      'Policybazaar was founded in 2008 and developed an online platform for comparing insurance products.',
    tags: [
      'Insurance',
      'Fintech',
      'Marketplace',
      'Online Services',
    ],
    accent: 'service',
  }),

  createDemoProfile({
    id: 'demo-service-razorpay',
    name: 'Razorpay',
    slug: 'demo-razorpay',
    category: 'Services',
    profession: 'Fintech Platform',
    headline: 'Online Payments & Business Banking Technology',
    location: 'Bengaluru, India',
    since: '2014',
    knownFor:
      'Payment infrastructure and financial technology for businesses.',
    description:
      'A demo fintech-service DIPO showing how a B2B technology platform could present its ecosystem.',
    story:
      'Razorpay was founded in 2014 and developed payment and financial technology infrastructure for businesses.',
    tags: [
      'Fintech',
      'Payments',
      'B2B',
      'Technology',
    ],
    accent: 'service',
  }),
];

/* ============================================================
   07 — PROFESSIONALS
   ============================================================ */

const PROFESSIONALS = [
  createDemoProfile({
    id: 'demo-professional-nithin-kamath',
    name: 'Nithin Kamath',
    slug: 'demo-nithin-kamath',
    category: 'Professionals',
    profession: 'Entrepreneur',
    headline: 'Founder & Entrepreneur',
    location: 'Bengaluru, India',
    since: '2010',
    knownFor:
      'Co-founding Zerodha and work in financial technology.',
    description:
      'A demo professional DIPO showing how an entrepreneur could bring career, work and public links together.',
    story:
      'Nithin Kamath co-founded Zerodha in 2010 and is associated with entrepreneurship and financial technology.',
    tags: [
      'Entrepreneur',
      'Fintech',
      'Business',
      'Founder',
    ],
    accent: 'professional',
  }),

  createDemoProfile({
    id: 'demo-professional-falguni-nayar',
    name: 'Falguni Nayar',
    slug: 'demo-falguni-nayar',
    category: 'Professionals',
    profession: 'Entrepreneur',
    headline: 'Founder & Business Leader',
    location: 'Mumbai, India',
    since: '2012',
    knownFor:
      'Founding Nykaa and building a consumer technology business.',
    description:
      'A demo professional profile showing how a founder could present career milestones and business work.',
    story:
      'Falguni Nayar founded Nykaa in 2012 and built the company into a major beauty and lifestyle platform.',
    tags: [
      'Founder',
      'Entrepreneur',
      'Beauty',
      'Business',
    ],
    accent: 'professional',
  }),

  createDemoProfile({
    id: 'demo-professional-bhavish-aggarwal',
    name: 'Bhavish Aggarwal',
    slug: 'demo-bhavish-aggarwal',
    category: 'Professionals',
    profession: 'Entrepreneur',
    headline: 'Technology Entrepreneur',
    location: 'Bengaluru, India',
    since: '2010',
    knownFor:
      'Building mobility and electric-vehicle businesses.',
    description:
      'A demo founder profile illustrating how professional identity and company work could be presented together.',
    story:
      'Bhavish Aggarwal is an Indian technology entrepreneur associated with Ola and electric-mobility ventures.',
    tags: [
      'Entrepreneur',
      'Mobility',
      'EV',
      'Technology',
    ],
    accent: 'professional',
  }),

  createDemoProfile({
    id: 'demo-professional-kiran-mazumdar-shaw',
    name: 'Kiran Mazumdar-Shaw',
    slug: 'demo-kiran-mazumdar-shaw',
    category: 'Professionals',
    profession: 'Entrepreneur & Biotech Leader',
    headline: 'Biotechnology Entrepreneur',
    location: 'Bengaluru, India',
    since: '1978',
    knownFor:
      'Founding Biocon and building a biotechnology enterprise.',
    description:
      'A demo professional identity showing how long-term career history and leadership work could be presented.',
    story:
      'Kiran Mazumdar-Shaw founded Biocon and became a prominent figure in Indian biotechnology entrepreneurship.',
    tags: [
      'Biotech',
      'Entrepreneur',
      'Science',
      'Leadership',
    ],
    accent: 'professional',
  }),

  createDemoProfile({
    id: 'demo-professional-deepinder-goyal',
    name: 'Deepinder Goyal',
    slug: 'demo-deepinder-goyal',
    category: 'Professionals',
    profession: 'Entrepreneur',
    headline: 'Technology Entrepreneur',
    location: 'Gurugram, India',
    since: '2008',
    knownFor:
      'Co-founding Zomato and building technology-led food services.',
    description:
      'A demo entrepreneur DIPO showing how founder identity and company work can be brought into one public profile.',
    story:
      'Deepinder Goyal co-founded Zomato in 2008 and is associated with technology-led food and commerce businesses.',
    tags: [
      'Founder',
      'Food Tech',
      'Technology',
      'Entrepreneur',
    ],
    accent: 'professional',
  }),
];

/* ============================================================
   08 — EDUCATION
   ============================================================ */

const EDUCATION = [
  createDemoProfile({
    id: 'demo-education-physics-wallah',
    name: 'Physics Wallah',
    slug: 'demo-physics-wallah',
    category: 'Education',
    profession: 'EdTech Platform',
    headline: 'Education Platform for Students',
    location: 'Noida, India',
    since: '2020',
    knownFor:
      'Online and offline education, test preparation and learning programs.',
    description:
      'A demo education DIPO showing how an education platform could organize its identity and learning ecosystem.',
    story:
      'Physics Wallah was founded in 2020 by Alakh Pandey and Prateek Maheshwari and grew from a YouTube education presence into a broader education platform.',
    tags: [
      'Education',
      'EdTech',
      'JEE',
      'NEET',
    ],
    accent: 'education',
  }),

  createDemoProfile({
    id: 'demo-education-unacademy',
    name: 'Unacademy',
    slug: 'demo-unacademy',
    category: 'Education',
    profession: 'EdTech Platform',
    headline: 'Online Learning & Test Preparation',
    location: 'Bengaluru, India',
    since: '2015',
    knownFor:
      'Online courses, educators and competitive exam preparation.',
    description:
      'A demo education profile showing how courses, educators and learning resources could live in one digital identity.',
    story:
      'Unacademy grew from an education-video initiative into an online learning and test-preparation platform.',
    tags: [
      'Education',
      'Online Learning',
      'Courses',
      'Exams',
    ],
    accent: 'education',
  }),

  createDemoProfile({
    id: 'demo-education-vedantu',
    name: 'Vedantu',
    slug: 'demo-vedantu',
    category: 'Education',
    profession: 'Online Education',
    headline: 'Live Online Learning Platform',
    location: 'Bengaluru, India',
    since: '2014',
    knownFor:
      'Live online classes, tutoring and school education.',
    description:
      'A demo EdTech DIPO showing how an education company could present its learning ecosystem.',
    story:
      'Vedantu developed an online learning platform focused on live teaching and school education.',
    tags: [
      'Education',
      'Tutoring',
      'Online Classes',
      'Learning',
    ],
    accent: 'education',
  }),

  createDemoProfile({
    id: 'demo-education-upgrad',
    name: 'upGrad',
    slug: 'demo-upgrad',
    category: 'Education',
    profession: 'Higher Education & Upskilling',
    headline: 'Higher Education & Professional Learning',
    location: 'Mumbai, India',
    since: '2015',
    knownFor:
      'Online higher education, professional programs and upskilling.',
    description:
      'A demo education-business profile showing how professional learning could be organized in a public DIPO.',
    story:
      'upGrad was founded in 2015 and focuses on higher education, professional learning and career upskilling.',
    tags: [
      'Education',
      'Upskilling',
      'Career',
      'Online Learning',
    ],
    accent: 'education',
  }),

  createDemoProfile({
    id: 'demo-education-byjus',
    name: 'BYJU’S',
    slug: 'demo-byjus',
    category: 'Education',
    profession: 'EdTech',
    headline: 'Digital Learning Platform',
    location: 'Bengaluru, India',
    since: '2011',
    knownFor:
      'Digital learning products and education technology.',
    description:
      'A demo education profile illustrating how a large digital-learning brand could structure its online identity.',
    story:
      'BYJU’S began as an education technology venture and developed digital learning products for students.',
    tags: [
      'EdTech',
      'Education',
      'Learning',
      'Technology',
    ],
    accent: 'education',
  }),
];

/* ============================================================
   MASTER DEMO DIRECTORY
   ============================================================ */

export const DIPO_DEMO_PROFILES = [
  ...CREATORS,
  ...BUSINESSES,
  ...ONLINE_BUSINESSES,
  ...SHOPS,
  ...BRANDS,
  ...SERVICES,
  ...PROFESSIONALS,
  ...EDUCATION,
];

/* ============================================================
   CATEGORY CONFIGURATION
   ============================================================ */

export const DIPO_DEMO_CATEGORIES = [
  {
    id: 'all',
    label: 'All',
    description:
      'Discover example DIPO identities from across India.',
  },

  {
    id: 'Creators',
    label: 'Creators',
    description:
      'Creators, entertainers, podcasters and digital personalities.',
  },

  {
    id: 'Businesses',
    label: 'Businesses',
    description:
      'Large Indian businesses and enterprise examples.',
  },

  {
    id: 'Online Businesses',
    label: 'Online Businesses',
    description:
      'Digital-first companies and online platforms.',
  },

  {
    id: 'Shops',
    label: 'Shops',
    description:
      'Retail stores and shopping businesses.',
  },

  {
    id: 'Brands',
    label: 'Brands',
    description:
      'Indian consumer, lifestyle and product brands.',
  },

  {
    id: 'Services',
    label: 'Services',
    description:
      'Service platforms and customer-focused businesses.',
  },

  {
    id: 'Professionals',
    label: 'Professionals',
    description:
      'Founder, entrepreneur and professional identity examples.',
  },

  {
    id: 'Education',
    label: 'Education',
    description:
      'Education companies and learning platforms.',
  },
];

/* ============================================================
   SAFE HELPERS
   ============================================================ */

export function getAllDemoProfiles() {
  return DIPO_DEMO_PROFILES.map((profile) => ({
    ...profile,
    tags: Array.isArray(profile.tags)
      ? [...profile.tags]
      : [],
  }));
}

export function getDemoProfileBySlug(slug) {
  if (!slug) return null;

  const safeSlug = String(slug)
    .trim()
    .toLowerCase();

  return (
    DIPO_DEMO_PROFILES.find(
      (profile) =>
        profile.slug.toLowerCase() === safeSlug,
    ) || null
  );
}

export function getDemoProfilesByCategory(
  category,
) {
  if (!category || category === 'all') {
    return getAllDemoProfiles();
  }

  const safeCategory = String(category)
    .trim()
    .toLowerCase();

  return DIPO_DEMO_PROFILES.filter(
    (profile) =>
      profile.category.toLowerCase() ===
      safeCategory,
  ).map((profile) => ({
    ...profile,
    tags: Array.isArray(profile.tags)
      ? [...profile.tags]
      : [],
  }));
}

export function searchDemoProfiles(query) {
  const safeQuery = String(query || '')
    .trim()
    .toLowerCase();

  if (!safeQuery) {
    return getAllDemoProfiles();
  }

  return DIPO_DEMO_PROFILES.filter((profile) => {
    const searchableText = [
      profile.name,
      profile.profession,
      profile.headline,
      profile.location,
      profile.category,
      profile.since,
      profile.known_for,
      profile.description,
      profile.story,
      ...(profile.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(safeQuery);
  }).map((profile) => ({
    ...profile,
    tags: Array.isArray(profile.tags)
      ? [...profile.tags]
      : [],
  }));
}

export function filterDemoProfiles({
  query = '',
  category = '',
} = {}) {
  let profiles = getAllDemoProfiles();

  const safeCategory = String(category || '')
    .trim()
    .toLowerCase();

  const safeQuery = String(query || '')
    .trim()
    .toLowerCase();

  if (
    safeCategory &&
    safeCategory !== 'all'
  ) {
    profiles = profiles.filter(
      (profile) =>
        profile.category.toLowerCase() ===
        safeCategory,
    );
  }

  if (safeQuery) {
    profiles = profiles.filter((profile) => {
      const searchableText = [
        profile.name,
        profile.profession,
        profile.headline,
        profile.location,
        profile.category,
        profile.since,
        profile.known_for,
        profile.description,
        profile.story,
        ...(profile.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(
        safeQuery,
      );
    });
  }

  return profiles;
}

/* ============================================================
   DIRECTORY STATS
   ============================================================ */

export const DIPO_DEMO_STATS = {
  total: DIPO_DEMO_PROFILES.length,

  creators: CREATORS.length,

  businesses: BUSINESSES.length,

  onlineBusinesses:
    ONLINE_BUSINESSES.length,

  shops: SHOPS.length,

  brands: BRANDS.length,

  services: SERVICES.length,

  professionals:
    PROFESSIONALS.length,

  education: EDUCATION.length,
};

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

export default DIPO_DEMO_PROFILES;