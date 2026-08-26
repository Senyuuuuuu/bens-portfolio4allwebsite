import { ServiceCategory, PromoItem, Provider } from '../types';

export const categoriesData: ServiceCategory[] = [
  {
    id: '1',
    name: 'Plumbing',
    slug: 'plumbing',
    iconName: 'Wrench',
    itemCount: 42,
    bgColor: '#E0F2FE',
    iconColor: '#0284C7',
    badge: 'Popular'
  },
  {
    id: '2',
    name: 'Deep Cleaning',
    slug: 'cleaning',
    iconName: 'Sparkles',
    itemCount: 68,
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
    badge: 'Top Deal'
  },
  {
    id: '3',
    name: 'Electrical',
    slug: 'electrical',
    iconName: 'Zap',
    itemCount: 35,
    bgColor: '#FEE2E2',
    iconColor: '#DC2626'
  },
  {
    id: '4',
    name: 'Appliance Repair',
    slug: 'repair',
    iconName: 'Hammer',
    itemCount: 29,
    bgColor: '#EDE9FE',
    iconColor: '#7C3AED'
  },
  {
    id: '5',
    name: 'AC Maintenance',
    slug: 'ac-repair',
    iconName: 'Wind',
    itemCount: 51,
    bgColor: '#CCFBF1',
    iconColor: '#0D9488'
  },
  {
    id: '6',
    name: 'Carpentry',
    slug: 'carpentry',
    iconName: 'Ruler',
    itemCount: 24,
    bgColor: '#FFEDD5',
    iconColor: '#EA580C'
  },
  {
    id: '7',
    name: 'Painting',
    slug: 'painting',
    iconName: 'Paintbrush',
    itemCount: 19,
    bgColor: '#FCE7F3',
    iconColor: '#DB2777'
  },
  {
    id: '8',
    name: 'Home Pest Control',
    slug: 'pest-control',
    iconName: 'ShieldAlert',
    itemCount: 16,
    bgColor: '#DCFCE7',
    iconColor: '#16A34A'
  }
];

export const promoBannersData: PromoItem[] = [
  {
    id: 'promo-1',
    title: '50% Off House Cleaning',
    subtitle: 'Professional deep clean for living spaces & kitchens',
    discount: '50% OFF',
    code: 'CLEAN50',
    buttonText: 'Claim Discount',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    category: 'Cleaning',
    expiresIn: 'Ends in 2 days'
  },
  {
    id: 'promo-2',
    title: 'Emergency AC Overhaul',
    subtitle: 'Full inspection, refrigerant check & coil disinfection',
    discount: '$30 OFF',
    code: 'COOLAIR30',
    buttonText: 'Book AC Tech',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    category: 'AC Maintenance',
    expiresIn: 'Limited slots'
  },
  {
    id: 'promo-3',
    title: 'Certified Plumbing Diagnostics',
    subtitle: 'Zero call-out charge with any pipe repair package',
    discount: 'FREE INSPECTION',
    code: 'PLUMBZERO',
    buttonText: 'Get Quote',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    category: 'Plumbing',
    expiresIn: 'This Weekend'
  }
];

export const featuredProviders: Provider[] = [
  {
    id: 'provider-marcus',
    name: 'Engr. Marcus Vance',
    title: 'Master Licensed Electrician & Smart Home Tech',
    category: 'Electrical',
    rating: 4.96,
    reviewCount: 248,
    hourlyRate: 48,
    experienceYears: 9,
    completedJobs: 1420,
    location: 'Metro Center · 2.4 km away',
    distance: '2.4 km',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
    bio: 'Certified Master Electrician with over 9 years of practical field engineering across residential circuit rewiring, subpanel upgrades, smart EV charger installations, and diagnostics. Committed to zero-defect safety standards, prompt response times, and leaving work areas immaculately clean.',
    specialties: [
      'Circuit Breaker & Subpanel Upgrades',
      'Fault Detection & Short Circuit Diagnostics',
      'EV Charger & Generator Switch Installation',
      'Whole-Home Recessed LED & Smart Lighting',
      'Code Compliance & Safety Certification'
    ],
    toolsProvided: [
      'Fluke Commercial Digital Multimeter',
      'Insulated 1000V Tool Arsenal',
      'Thermal Imaging Circuit Camera',
      'Conduit Benders & Cable Pulling Rig'
    ],
    certifications: [
      'State Master Electrician License #ME-89421',
      'OSHA 30 Safety Standard Certified',
      'Tesla & JuiceBox Certified EV Installer',
      'National Electrical Code (NEC 2023) Compliant'
    ],
    stats: {
      experience: '9 Years',
      rating: '4.96 ★',
      jobsDone: '1,420+',
      satisfaction: '99.4%'
    },
    availableSlots: [
      { id: 's1', time: '08:30 AM', period: 'Morning', available: true },
      { id: 's2', time: '10:00 AM', period: 'Morning', available: true },
      { id: 's3', time: '01:30 PM', period: 'Afternoon', available: true },
      { id: 's4', time: '03:45 PM', period: 'Afternoon', available: false },
      { id: 's5', time: '05:30 PM', period: 'Evening', available: true },
      { id: 's6', time: '07:00 PM', period: 'Evening', available: true }
    ],
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'Yesterday',
        serviceRendered: 'Main Electrical Panel Replacement',
        comment: 'Marcus arrived exactly on time with full safety gear. He identified a dangerous hidden grounding defect from our old contractor and rebuilt our breaker panel flawlessly in under 4 hours. Transparent pricing and exceptional professionalism.',
        verified: true
      },
      {
        id: 'rev-2',
        authorName: 'David R. Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '3 days ago',
        serviceRendered: 'Level 2 EV Wallbox Installation',
        comment: 'Super candid, explained every wire and permit requirement. Tested the charger with our car before leaving. Easily the best electrical technician I have booked on Tugon.',
        verified: true
      },
      {
        id: 'rev-3',
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        rating: 4.9,
        date: '1 week ago',
        serviceRendered: 'Recessed Kitchen Lighting',
        comment: 'Clean cuts, zero drywall mess, perfectly balanced light color temperatures. Marcus takes genuine pride in his craft.',
        verified: true
      }
    ]
  },
  {
    id: 'provider-elena',
    name: 'Elena Santos',
    title: 'Lead Specialist · Eco-Sanitation & Deep Clean',
    category: 'Cleaning',
    rating: 4.98,
    reviewCount: 312,
    hourlyRate: 36,
    experienceYears: 7,
    completedJobs: 1890,
    location: 'North District · 1.8 km away',
    distance: '1.8 km',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    bio: 'Dedicated home sanitization lead specializing in non-toxic, pet-friendly deep cleaning protocols, post-renovation dust elimination, and upholstery restoration. Equipped with hospital-grade HEPA filtration units.',
    specialties: [
      'Post-Construction & Move-In Sanitization',
      'Steam Upholstery & Mattress Restoration',
      'Kitchen Grease Extraction & Grout Scrubbing',
      'Hypoallergenic Plant-Based Products'
    ],
    toolsProvided: [
      'Commercial Kärcher Steam Extractor',
      'True HEPA Multi-Stage Vacuum System',
      'Organic Microfiber & pH-Neutral Cleaners'
    ],
    certifications: [
      'IICRC Certified House Cleaning Technician',
      'Green Clean Institute Environmental Certified'
    ],
    stats: {
      experience: '7 Years',
      rating: '4.98 ★',
      jobsDone: '1,890+',
      satisfaction: '99.8%'
    },
    availableSlots: [
      { id: 'e1', time: '09:00 AM', period: 'Morning', available: true },
      { id: 'e2', time: '01:00 PM', period: 'Afternoon', available: true },
      { id: 'e3', time: '04:00 PM', period: 'Evening', available: true }
    ],
    reviews: [
      {
        id: 'rev-e1',
        authorName: 'Michael Torres',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2 days ago',
        serviceRendered: '3-Bedroom Deep Clean',
        comment: 'The apartment feels brand new. Elena paid attention to baseboards and window tracks that most cleaners ignore.',
        verified: true
      }
    ]
  },
  {
    id: 'provider-ramon',
    name: 'Ramon Dela Cruz',
    title: 'Senior Hydraulic & Pipe System Specialist',
    category: 'Plumbing',
    rating: 4.92,
    reviewCount: 195,
    hourlyRate: 44,
    experienceYears: 12,
    completedJobs: 2150,
    location: 'West Valley · 3.1 km away',
    distance: '3.1 km',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    bio: '12 years resolving high-pressure pipe bursts, sewer camera diagnostics, gas line routing, and tankless water heater maintenance.',
    specialties: [
      'Trenchless Pipe Repair & Hydro-Jetting',
      'Tankless Water Heater Installation',
      'Emergency Leak Isolation & Valve Replacement'
    ],
    toolsProvided: [
      'Ridgid Fiber-Optic Drain Inspection Camera',
      'Rothenberger Electronic Pipe Freezer',
      'High-Torque Press Crimping Tool'
    ],
    certifications: [
      'Master Plumber Board Certification #MP-4402',
      'Backflow Prevention Assembly Inspector'
    ],
    stats: {
      experience: '12 Years',
      rating: '4.92 ★',
      jobsDone: '2,150+',
      satisfaction: '98.9%'
    },
    availableSlots: [
      { id: 'r1', time: '08:00 AM', period: 'Morning', available: true },
      { id: 'r2', time: '11:30 AM', period: 'Morning', available: true },
      { id: 'r3', time: '02:30 PM', period: 'Afternoon', available: true }
    ],
    reviews: [
      {
        id: 'rev-r1',
        authorName: 'Clara Oswald',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '5 days ago',
        serviceRendered: 'Emergency Pipe Leak Fix',
        comment: 'Arrived within 30 minutes of our booking. Solved a leak that had baffled two previous plumbers.',
        verified: true
      }
    ]
  }
];
