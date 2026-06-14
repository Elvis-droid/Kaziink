// ─── KaziLink Data & Constants ────────────────────────────────────────────────

export const SEED_JOBS = [
  {
    id: 'sj1', empId: 'seed', empName: 'Amina Hassan',
    title: 'House Cleaning',
    desc: 'Experienced cleaner needed for a 4-bedroom house in Mikocheni. All cleaning supplies provided. Work hours: 8am–4pm. Friendly household.',
    loc: 'Mikocheni, Dar es Salaam', pay: 'TSh 25,000/day',
    cat: 'Cleaning', posted: 'Jun 5, 2026', status: 'open',
  },
  {
    id: 'sj2', empId: 'seed', empName: 'Robert Mwangi',
    title: 'Night Security Guard',
    desc: 'Reliable security guard for gated compound. 6PM–6AM shift. Uniform and meals provided. Must be honest and alert.',
    loc: 'Oyster Bay, Dar es Salaam', pay: 'TSh 40,000/night',
    cat: 'Security', posted: 'Jun 7, 2026', status: 'open',
  },
  {
    id: 'sj3', empId: 'seed', empName: 'Sarah Kimani',
    title: 'Nanny & Childcare',
    desc: 'Loving, experienced nanny for two children (ages 3 and 5). Mon–Fri, 7am–5pm. Must be patient and trustworthy.',
    loc: 'Masaki, Dar es Salaam', pay: 'TSh 350,000/month',
    cat: 'Childcare', posted: 'Jun 7, 2026', status: 'open',
  },
  {
    id: 'sj4', empId: 'seed', empName: 'Joseph Tarimo',
    title: 'Construction Laborer',
    desc: 'General laborers needed for new residential project. Heavy lifting involved. Safety gear provided. 6 days/week.',
    loc: 'Mbagala, Dar es Salaam', pay: 'TSh 22,000/day',
    cat: 'Construction', posted: 'Jun 8, 2026', status: 'open',
  },
  {
    id: 'sj5', empId: 'seed', empName: 'Grace Mushi',
    title: 'Family Cook',
    desc: 'Home cook for a family of 6. Lunch and dinner preparation. Comfortable kitchen with all equipment provided.',
    loc: 'Sinza, Dar es Salaam', pay: 'TSh 280,000/month',
    cat: 'Cooking', posted: 'Jun 8, 2026', status: 'open',
  },
  {
    id: 'sj6', empId: 'seed', empName: 'David Lyimo',
    title: 'Personal Driver',
    desc: 'Personal driver needed. Must have clean Class C licence. Flexible hours. Car and fuel provided by employer.',
    loc: 'Upanga, Dar es Salaam', pay: 'TSh 400,000/month',
    cat: 'Driving', posted: 'Jun 9, 2026', status: 'open',
  },
];

export const CAT_ICONS = {
  Cleaning:     '🧹',
  Security:     '🔒',
  Childcare:    '👶',
  Construction: '🏗️',
  Cooking:      '👨‍🍳',
  Gardening:    '🌿',
  Driving:      '🚗',
  Painting:     '🎨',
  Plumbing:     '🪛',
  Other:        '💼',
};

export const ALL_CATS = [
  'Cleaning', 'Security', 'Childcare', 'Construction',
  'Cooking', 'Gardening', 'Driving', 'Painting', 'Plumbing', 'Other',
];

export const EDU_OPTS = [
  'No formal education',
  'Primary school',
  'Secondary (O-Level)',
  'Secondary (A-Level)',
  'Certificate / Diploma',
  "Bachelor's Degree",
  'Masters / Postgraduate',
];

export const PROG_STEPS = ['Confirmed', 'Arrived', 'Inspection', 'Completed'];
