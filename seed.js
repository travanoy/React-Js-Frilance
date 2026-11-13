// Regenerates db.json: 8 designers, each with 3-4 projects, 2-3 services, 3-5 reviews.
// Designer ratings are computed from the seeded reviews.
// Run: node seed.js  (or: npm run seed)
const fs = require('fs');
const path = require('path');

function iso(daysAgo, hour = 10) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(hour, (daysAgo * 13) % 60, 0, 0);
  return d.toISOString();
}

const designers = [
  {
    id: 'd-001', name: 'Aysel Mammadova', title: 'UI/UX Designer',
    bio: 'Product designer with a passion for clean, accessible interfaces. Worked with fintech and e-commerce startups across Azerbaijan and Europe.',
    skills: ['UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Figma'],
    hourlyRate: 40, currency: 'AZN', experience: 6, location: 'Baku, Azerbaijan',
    email: 'aysel.mammadova@example.com', phone: '+994 50 111 22 33',
    behance: 'ayselmammadova', dribbble: 'aysel_mm', instagram: 'aysel.designs',
    isAvailable: true, isVerified: true, createdDaysAgo: 400,
  },
  {
    id: 'd-002', name: 'Tural Hasanov', title: 'Brand Identity Designer',
    bio: 'I help businesses find their visual voice. 50+ completed branding projects: logos, brand books, packaging.',
    skills: ['Logo Design', 'Brand Identity', 'Typography', 'Packaging', 'Illustrator'],
    hourlyRate: 35, currency: 'AZN', experience: 8, location: 'Baku, Azerbaijan',
    email: 'tural.hasanov@example.com', phone: '+994 55 222 33 44',
    behance: 'turalhasanov', dribbble: 'tural_h', instagram: 'tural.brands',
    isAvailable: true, isVerified: true, createdDaysAgo: 700,
  },
  {
    id: 'd-003', name: 'Emma Richardson', title: 'Illustrator & Character Designer',
    bio: 'Freelance illustrator from London, now based in Baku. Children\'s books, editorial illustration, and character design for games.',
    skills: ['Digital Illustration', 'Character Design', 'Procreate', 'Photoshop', 'Storyboarding'],
    hourlyRate: 50, currency: 'USD', experience: 9, location: 'Baku, Azerbaijan',
    email: 'emma.richardson@example.com', phone: '+994 70 333 44 55',
    behance: 'emmarich', dribbble: 'emma_draws', instagram: 'emma.illustrates',
    isAvailable: false, isVerified: true, createdDaysAgo: 550,
  },
  {
    id: 'd-004', name: 'Rashad Aliyev', title: 'Motion Designer',
    bio: 'Motion graphics and animation for ads, explainers, and social media. After Effects wizard, Cinema 4D enthusiast.',
    skills: ['Motion Graphics', '2D Animation', 'After Effects', 'Cinema 4D', 'Video Editing'],
    hourlyRate: 45, currency: 'AZN', experience: 5, location: 'Ganja, Azerbaijan',
    email: 'rashad.aliyev@example.com', phone: '+994 51 444 55 66',
    behance: 'rashadmotion', dribbble: 'rashad_a', instagram: 'rashad.motion',
    isAvailable: true, isVerified: false, createdDaysAgo: 300,
  },
  {
    id: 'd-005', name: 'Nigar Guliyeva', title: 'UI/UX & Mobile App Designer',
    bio: 'Mobile-first designer focused on iOS and Android apps. I design products people love to use every day.',
    skills: ['Mobile Design', 'UI Design', 'User Testing', 'Figma', 'Sketch'],
    hourlyRate: 55, currency: 'USD', experience: 7, location: 'Baku, Azerbaijan',
    email: 'nigar.guliyeva@example.com', phone: '+994 77 555 66 77',
    behance: 'nigarguliyeva', dribbble: 'nigar_g', instagram: 'nigar.ux',
    isAvailable: true, isVerified: true, createdDaysAgo: 600,
  },
  {
    id: 'd-006', name: 'Marco Bianchi', title: 'Print & Editorial Designer',
    bio: 'Italian designer specializing in editorial layouts, magazines, books, and print campaigns. Type lover.',
    skills: ['Editorial Design', 'Print Design', 'InDesign', 'Typography', 'Art Direction'],
    hourlyRate: 38, currency: 'USD', experience: 12, location: 'Sumqayit, Azerbaijan',
    email: 'marco.bianchi@example.com', phone: '+994 50 666 77 88',
    behance: 'marcobianchi', dribbble: 'marco_b', instagram: 'marco.prints',
    isAvailable: true, isVerified: false, createdDaysAgo: 250,
  },
  {
    id: 'd-007', name: 'Leyla Karimova', title: 'Graphic Designer & Illustrator',
    bio: 'Versatile designer covering social media graphics, posters, and custom illustrations. Fast turnaround, friendly communication.',
    skills: ['Graphic Design', 'Social Media Design', 'Illustration', 'Photoshop', 'Canva'],
    hourlyRate: 20, currency: 'AZN', experience: 3, location: 'Lankaran, Azerbaijan',
    email: 'leyla.karimova@example.com', phone: '+994 55 777 88 99',
    behance: 'leylakarimova', dribbble: 'leyla_k', instagram: 'leyla.creates',
    isAvailable: true, isVerified: false, createdDaysAgo: 150,
  },
  {
    id: 'd-008', name: 'Kanan Valiyev', title: 'Product Designer & Design Systems Lead',
    bio: 'Senior product designer building scalable design systems for SaaS companies. Ex-agency, now full-time freelance.',
    skills: ['Design Systems', 'Product Design', 'UI Design', 'Figma', 'Webflow'],
    hourlyRate: 70, currency: 'USD', experience: 10, location: 'Baku, Azerbaijan',
    email: 'kanan.valiyev@example.com', phone: '+994 70 888 99 00',
    behance: 'kananvaliyev', dribbble: 'kanan_v', instagram: 'kanan.design',
    isAvailable: false, isVerified: true, createdDaysAgo: 800,
  },
];

// [designerId, title, description, category, tags, tools, likes, views, daysAgo]
const projectRows = [
  ['d-001', 'Banking App Redesign', 'Complete UX overhaul of a mobile banking app: onboarding, transfers, and analytics dashboard.', 'ui-ux', ['fintech', 'mobile', 'dashboard'], ['Figma', 'Principle'], 248, 3100, 45],
  ['d-001', 'E-commerce Design System', 'Component library and tokens for a marketplace with 40+ screens.', 'ui-ux', ['design-system', 'e-commerce'], ['Figma'], 156, 1900, 120],
  ['d-001', 'Travel Booking Web App', 'End-to-end booking flow with map search and price calendar.', 'ui-ux', ['travel', 'web-app', 'booking'], ['Figma', 'Protopie'], 97, 1200, 200],
  ['d-001', 'Healthcare Dashboard', 'Patient monitoring dashboard for clinics with data-heavy tables and charts.', 'ui-ux', ['healthcare', 'dashboard', 'data-viz'], ['Figma'], 64, 850, 15],

  ['d-002', 'Caspian Coffee Rebrand', 'Full rebrand of a Baku coffee chain: logo, packaging, signage, and brand book.', 'branding', ['coffee', 'rebrand', 'packaging'], ['Illustrator', 'Photoshop'], 310, 4200, 60],
  ['d-002', 'Tech Startup Identity', 'Identity for an AI startup: geometric logomark, motion-ready variations.', 'branding', ['tech', 'logo', 'startup'], ['Illustrator', 'After Effects'], 189, 2400, 90],
  ['d-002', 'Organic Food Packaging', 'Packaging line for an organic food brand — 12 SKUs with shelf-impact focus.', 'branding', ['packaging', 'food', 'organic'], ['Illustrator', 'Dimension'], 142, 1800, 30],

  ['d-003', 'Children\'s Book: The Star Collector', '32-page picture book illustration, full color, character design and layouts.', 'illustration', ['children', 'book', 'characters'], ['Procreate', 'Photoshop'], 425, 5600, 75],
  ['d-003', 'Game Characters Pack', '12 stylized characters for an indie RPG with expression sheets.', 'illustration', ['game-art', 'characters', 'rpg'], ['Procreate', 'Photoshop'], 367, 4100, 140],
  ['d-003', 'Editorial Series for Tech Magazine', 'Monthly editorial illustrations on AI, privacy, and the future of work.', 'illustration', ['editorial', 'tech', 'conceptual'], ['Photoshop', 'Illustrator'], 203, 2700, 25],
  ['d-003', 'Animal Alphabet Posters', 'A-Z animal poster series for kids\' rooms, printed and digital versions.', 'illustration', ['posters', 'children', 'animals'], ['Procreate'], 98, 1300, 10],

  ['d-004', 'Fintech Explainer Video', '90-second animated explainer: script visualization, storyboards, full animation.', 'motion', ['explainer', 'fintech', '2d-animation'], ['After Effects', 'Illustrator'], 178, 2900, 50],
  ['d-004', 'Logo Animations Pack', 'Animated logo reveals for 8 brands — from minimal to playful.', 'motion', ['logo-animation', 'branding'], ['After Effects'], 134, 1600, 100],
  ['d-004', 'Instagram Ads Campaign', '15 animated ad creatives for a fashion retailer\'s seasonal campaign.', 'motion', ['ads', 'social-media', 'fashion'], ['After Effects', 'Photoshop'], 88, 1100, 20],

  ['d-005', 'Fitness Tracking App', 'iOS fitness app: workout builder, progress rings, and social challenges.', 'ui-ux', ['fitness', 'ios', 'mobile'], ['Figma', 'Sketch'], 290, 3800, 65],
  ['d-005', 'Food Delivery App Redesign', 'Reduced checkout steps from 6 to 3; new visual language and dark mode.', 'ui-ux', ['food-delivery', 'mobile', 'dark-mode'], ['Figma'], 215, 2600, 110],
  ['d-005', 'Meditation App Concept', 'Calm-inspired concept with generative gradients and haptic-first interactions.', 'ui-ux', ['wellness', 'concept', 'mobile'], ['Figma', 'Midjourney'], 167, 2000, 35],

  ['d-006', 'Architecture Magazine Layout', '120-page quarterly magazine: grid system, typography, and photo direction.', 'print', ['magazine', 'editorial', 'typography'], ['InDesign', 'Photoshop'], 119, 1500, 80],
  ['d-006', 'Poetry Book Design', 'Hardcover poetry collection with custom drop caps and letterpress cover.', 'print', ['book', 'typography', 'letterpress'], ['InDesign'], 86, 950, 160],
  ['d-006', 'Festival Poster Series', 'Jazz festival posters — riso-inspired, three colorways.', 'print', ['posters', 'festival', 'riso'], ['Illustrator', 'InDesign'], 145, 1750, 40],

  ['d-007', 'Restaurant Social Media Kit', '30 post templates and story highlights for a seafood restaurant.', 'other', ['social-media', 'templates', 'restaurant'], ['Photoshop', 'Canva'], 54, 700, 28],
  ['d-007', 'Wedding Invitation Suite', 'Hand-illustrated floral invitations with envelope liners and menu cards.', 'illustration', ['wedding', 'floral', 'stationery'], ['Procreate', 'Illustrator'], 73, 880, 55],
  ['d-007', 'Bookstore Window Posters', 'Seasonal poster series for a local bookstore chain.', 'print', ['posters', 'retail'], ['Photoshop'], 41, 520, 12],

  ['d-008', 'SaaS Design System "Atlas"', 'Multi-brand design system: 200+ components, theming, and documentation site.', 'ui-ux', ['design-system', 'saas', 'documentation'], ['Figma', 'Storybook'], 332, 4500, 95],
  ['d-008', 'Analytics Platform UI', 'Data-dense analytics product with customizable dashboards and dark mode.', 'ui-ux', ['analytics', 'dashboard', 'saas'], ['Figma'], 241, 3200, 130],
  ['d-008', 'Marketing Site in Webflow', 'Full marketing site with CMS, interactions, and localization.', 'other', ['webflow', 'marketing', 'web'], ['Webflow', 'Figma'], 127, 1900, 22],
];

// [designerId, title, description, deliveryDays, price, currency, includes, tier]
const serviceRows = [
  ['d-001', 'UX Audit of Your App', 'Heuristic evaluation of up to 10 screens with prioritized recommendations.', 5, 300, 'AZN', ['Audit report (PDF)', 'Top-10 issues list', '1-hour call'], 'basic'],
  ['d-001', 'Mobile App Design', 'Full app design up to 15 screens with interactive prototype.', 14, 1200, 'AZN', ['15 screens', 'Interactive prototype', 'Design system starter', '2 revision rounds'], 'standard'],
  ['d-001', 'End-to-End Product Design', 'Research, wireframes, UI, prototype, and developer handoff for a full product.', 30, 3500, 'AZN', ['User research', 'Unlimited screens', 'Full design system', 'Dev handoff', '4 revision rounds'], 'premium'],

  ['d-002', 'Logo Design', 'Three logo concepts, two revision rounds, final files in all formats.', 7, 400, 'AZN', ['3 concepts', '2 revisions', 'AI/EPS/PNG/SVG files'], 'basic'],
  ['d-002', 'Brand Identity Package', 'Logo, color palette, typography, business cards, and mini brand guide.', 14, 1100, 'AZN', ['Logo + variations', 'Brand guide (20 pages)', 'Stationery design', '3 revisions'], 'standard'],
  ['d-002', 'Full Brand System', 'Complete identity with packaging, signage, social templates, and brand book.', 30, 2800, 'AZN', ['Everything in Standard', 'Packaging design', 'Social media kit', 'Brand book (50+ pages)'], 'premium'],

  ['d-003', 'Custom Illustration', 'One detailed digital illustration, personal or commercial license.', 7, 250, 'USD', ['1 illustration', 'Source file', 'Commercial license'], 'basic'],
  ['d-003', 'Character Design Pack', 'Three characters with turnarounds and expression sheets.', 14, 800, 'USD', ['3 characters', 'Turnaround sheets', 'Expressions', '2 revisions'], 'standard'],

  ['d-004', 'Logo Animation', 'Animated logo reveal up to 10 seconds, sound design included.', 5, 200, 'AZN', ['10s animation', 'Sound design', 'MP4 + MOV + GIF'], 'basic'],
  ['d-004', 'Explainer Video (60s)', 'Script-to-screen 60-second explainer with custom illustrations.', 21, 1500, 'AZN', ['Storyboard', 'Custom illustration', 'Voiceover sync', 'Full HD render'], 'standard'],
  ['d-004', 'Video Campaign Package', 'Explainer plus 10 social cutdowns in all aspect ratios.', 30, 3200, 'AZN', ['90s explainer', '10 social versions', 'All aspect ratios', 'Source project files'], 'premium'],

  ['d-005', 'App Screen Redesign', 'Redesign of up to 5 screens of your existing app.', 7, 450, 'USD', ['5 screens', 'Before/after report', '1 revision round'], 'basic'],
  ['d-005', 'Full Mobile App Design', 'Up to 25 screens, prototype, and design tokens for developers.', 21, 2200, 'USD', ['25 screens', 'Prototype', 'Design tokens', '3 revisions'], 'standard'],
  ['d-005', 'Design Partner (Monthly)', 'A month of dedicated design: unlimited requests, one at a time.', 30, 4500, 'USD', ['Unlimited requests', '48h average turnaround', 'Weekly sync calls', 'Pause anytime'], 'premium'],

  ['d-006', 'Brochure / Booklet Design', 'Up to 12 pages, print-ready PDF with bleed and crop marks.', 7, 350, 'USD', ['12 pages', 'Print-ready PDF', '2 revisions'], 'basic'],
  ['d-006', 'Magazine / Catalog Design', 'Up to 60 pages with custom grid and typographic system.', 21, 1400, 'USD', ['60 pages', 'Custom grid system', 'Print supervision', '3 revisions'], 'standard'],

  ['d-007', 'Social Media Posts (10x)', 'Ten branded posts for Instagram or Facebook with source files.', 4, 80, 'AZN', ['10 posts', 'Source files', '1 revision'], 'basic'],
  ['d-007', 'Monthly Social Media Kit', '30 posts, 10 stories, and highlight covers, planned with a content calendar.', 10, 250, 'AZN', ['30 posts', '10 stories', 'Highlight covers', 'Content calendar'], 'standard'],

  ['d-008', 'Design System Audit', 'Review of your existing design system with a gap analysis and roadmap.', 7, 900, 'USD', ['Audit report', 'Gap analysis', 'Roadmap', '90-min workshop'], 'basic'],
  ['d-008', 'Design System Foundation', 'Tokens, core components, and documentation for one brand.', 21, 3800, 'USD', ['Design tokens', '50+ components', 'Usage documentation', 'Figma library setup'], 'standard'],
  ['d-008', 'Enterprise Design System', 'Multi-brand, multi-platform system with governance model and team training.', 45, 9500, 'USD', ['Multi-brand theming', '200+ components', 'Governance playbook', 'Team training (3 sessions)'], 'premium'],
];

// [designerId, clientName, rating, comment, projectCategory, daysAgo]
const reviewRows = [
  ['d-001', 'Orkhan Babayev', 5, 'Aysel transformed our banking app. Conversion on onboarding doubled.', 'ui-ux', 40],
  ['d-001', 'Sarah Mitchell', 5, 'Incredibly thorough UX research and beautiful execution.', 'ui-ux', 90],
  ['d-001', 'Farid Jafarov', 4, 'Great work, slightly over the deadline but worth it.', 'ui-ux', 150],
  ['d-001', 'Kamala Nasibova', 5, 'The design system she built saves our devs hours every week.', 'ui-ux', 200],

  ['d-002', 'Murad Safarov', 5, 'Our coffee shop rebrand exceeded expectations. Customers noticed immediately.', 'branding', 55],
  ['d-002', 'Jennifer Adams', 5, 'Tural nailed our startup identity on the second concept.', 'branding', 85],
  ['d-002', 'Elchin Mammadli', 4, 'Professional process, detailed brand book. Recommended.', 'branding', 120],
  ['d-002', 'Aytan Suleymanova', 5, 'Packaging design helped us get into two retail chains.', 'branding', 20],
  ['d-002', 'David Chen', 4, 'Solid logo work, good communication throughout.', 'branding', 250],

  ['d-003', 'Lucy Thompson', 5, 'Emma illustrated our children\'s book beautifully. Kids adore it.', 'illustration', 70],
  ['d-003', 'Vugar Hasanli', 5, 'The character pack for our game is outstanding — exactly the style we wanted.', 'illustration', 130],
  ['d-003', 'Maria Gonzalez', 5, 'Editorial illustrations always on time, always on brief.', 'illustration', 30],
  ['d-003', 'Tom Becker', 4, 'Lovely work, a few extra revision rounds needed to land the style.', 'illustration', 180],

  ['d-004', 'Samir Aghayev', 5, 'The explainer video paid for itself within a month of launch.', 'motion', 45],
  ['d-004', 'Anna Kowalska', 4, 'Great animation quality. Communication could be a bit faster.', 'motion', 95],
  ['d-004', 'Ilgar Talibov', 4, 'Logo animation looks fantastic on our website and socials.', 'motion', 15],

  ['d-005', 'Rena Akhundova', 5, 'Nigar redesigned our delivery app checkout — cart abandonment dropped 30%.', 'ui-ux', 60],
  ['d-005', 'James Wilson', 5, 'Best mobile designer I\'ve worked with. Period.', 'ui-ux', 110],
  ['d-005', 'Gunel Rahimova', 5, 'Thoughtful, fast, and a great communicator.', 'ui-ux', 170],
  ['d-005', 'Peter Novak', 4, 'Strong design skills, premium price but justified.', 'ui-ux', 220],
  ['d-005', 'Zaur Isgandarov', 5, 'The fitness app design got us featured on the App Store.', 'ui-ux', 25],

  ['d-006', 'Claudia Rossi', 5, 'Marco\'s editorial layouts are works of art. Our magazine has never looked better.', 'print', 75],
  ['d-006', 'Anar Guliyev', 4, 'Beautiful poetry book design, print supervision was very helpful.', 'print', 140],
  ['d-006', 'Sophie Laurent', 4, 'Festival posters were a hit. Would book again.', 'print', 35],

  ['d-007', 'Nihad Agayev', 5, 'Leyla handles all our restaurant\'s social media design. Fast and reliable.', 'other', 22],
  ['d-007', 'Lala Huseynzade', 5, 'The wedding invitations were stunning — guests kept asking who made them.', 'illustration', 48],
  ['d-007', 'Emin Nagiyev', 4, 'Good value for money, quick revisions.', 'other', 80],

  ['d-008', 'Rachel Green', 5, 'Kanan built our design system from scratch. Dev velocity visibly improved.', 'ui-ux', 100],
  ['d-008', 'Javid Mirzayev', 5, 'Deep expertise in design systems. Worth every dollar.', 'ui-ux', 160],
  ['d-008', 'Michael Brown', 4, 'Excellent systems thinking. Premium tier is genuinely premium.', 'ui-ux', 210],
  ['d-008', 'Aysu Bagirova', 5, 'The audit alone fixed half our consistency problems.', 'ui-ux', 50],
];

const projects = projectRows.map((r, i) => ({
  id: `p-${String(i + 1).padStart(3, '0')}`,
  designerId: r[0],
  title: r[1],
  description: r[2],
  category: r[3],
  images: [
    `https://picsum.photos/seed/${r[0]}-p${i + 1}-a/800/600`,
    `https://picsum.photos/seed/${r[0]}-p${i + 1}-b/800/600`,
    `https://picsum.photos/seed/${r[0]}-p${i + 1}-c/800/600`,
  ],
  tags: r[4],
  tools: r[5],
  likes: r[6],
  views: r[7],
  createdAt: iso(r[8]),
}));

const services = serviceRows.map((r, i) => ({
  id: `s-${String(i + 1).padStart(3, '0')}`,
  designerId: r[0],
  title: r[1],
  description: r[2],
  deliveryDays: r[3],
  price: r[4],
  currency: r[5],
  includes: r[6],
  tier: r[7],
}));

const reviews = reviewRows.map((r, i) => ({
  id: `r-${String(i + 1).padStart(3, '0')}`,
  designerId: r[0],
  clientName: r[1],
  rating: r[2],
  comment: r[3],
  projectCategory: r[4],
  createdAt: iso(r[5], 14),
}));

const orders = [
  { id: 'o-001', serviceId: 's-002', designerId: 'd-001', clientName: 'Orkhan Babayev', clientEmail: 'orkhan.b@example.com', requirements: 'Fitness app, 12 screens, dark theme preferred. Figma file of current version available.', status: 'completed', createdAt: iso(50) },
  { id: 'o-002', serviceId: 's-005', designerId: 'd-002', clientName: 'Aytan Suleymanova', clientEmail: 'aytan.s@example.com', requirements: 'Organic honey brand, need full identity before harvest season.', status: 'in-progress', createdAt: iso(12) },
  { id: 'o-003', serviceId: 's-010', designerId: 'd-004', clientName: 'Samir Aghayev', clientEmail: 'samir.a@example.com', requirements: '60s explainer for a parking app. Script draft attached.', status: 'pending', createdAt: iso(0) },
  { id: 'o-004', serviceId: 's-013', designerId: 'd-005', clientName: 'Rena Akhundova', clientEmail: 'rena.a@example.com', requirements: 'Full redesign of grocery delivery app, 20+ screens.', status: 'completed', createdAt: iso(70) },
  { id: 'o-005', serviceId: 's-018', designerId: 'd-007', clientName: 'Nihad Agayev', clientEmail: 'nihad.a@example.com', requirements: 'June social media kit for the seafood restaurant, summer menu focus.', status: 'in-progress', createdAt: iso(3) },
  { id: 'o-006', serviceId: 's-021', designerId: 'd-008', clientName: 'Rachel Green', clientEmail: 'rachel.g@example.com', requirements: 'Design system foundation for our HR SaaS. React + Figma.', status: 'cancelled', createdAt: iso(90) },
];

const finalDesigners = designers.map((d) => {
  const ds = reviews.filter((r) => r.designerId === d.id);
  const avg = ds.reduce((s, r) => s + r.rating, 0) / ds.length;
  return {
    id: d.id,
    name: d.name,
    title: d.title,
    bio: d.bio,
    avatar: `https://i.pravatar.cc/200?u=${d.id}`,
    skills: d.skills,
    hourlyRate: d.hourlyRate,
    currency: d.currency,
    experience: d.experience,
    location: d.location,
    email: d.email,
    phone: d.phone,
    behanceUrl: `https://behance.net/${d.behance}`,
    dribbbleUrl: `https://dribbble.com/${d.dribbble}`,
    instagramUrl: `https://instagram.com/${d.instagram}`,
    isAvailable: d.isAvailable,
    isVerified: d.isVerified,
    rating: Math.round(avg * 10) / 10,
    reviewsCount: ds.length,
    createdAt: iso(d.createdDaysAgo),
  };
});

const db = { designers: finalDesigners, projects, services, reviews, orders };

fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
console.log(
  `Seeded ${finalDesigners.length} designers, ${projects.length} projects, ` +
  `${services.length} services, ${reviews.length} reviews, ${orders.length} orders.`
);
