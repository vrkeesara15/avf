/**
 * Central content for the Akshaya Vidya Foundation site.
 * All copy is derived from the AVF Web Application Requirements Document (v1.0).
 * In production this would be served by a CMS (ADM-02 / PRG-04).
 */

export interface Org {
  name: string;
  shortName: string;
  tagline: string;
  founded: number;
  city: string;
  email: string;
  altEmail: string;
  phone: string;
  address: string;
  regNumber: string;
  reg80G: string;
  fcra: string;
  cin: string;
  social: { label: string; href: string; icon: string }[];
}

export const org: Org = {
  name: "Akshaya Vidya Foundation",
  shortName: "AVF",
  tagline: "Educate · Empower · Uplift",
  founded: 2013,
  city: "Hyderabad",
  email: "info@akshayavidya.org",
  altEmail: "donate@akshayavidya.org",
  phone: "+91 90000 12345",
  address:
    "Nandanavanam, LB Nagar, Hyderabad, Telangana 500074, India",
  regNumber: "TS/2013/0042178",
  reg80G: "AAATA1234F20214",
  fcra: "010230456",
  cin: "U85300TG2013NPL089123",
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "f" },
    { label: "Twitter", href: "https://twitter.com", icon: "𝕏" },
    { label: "Instagram", href: "https://instagram.com", icon: "◉" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
    { label: "YouTube", href: "https://youtube.com", icon: "▶" },
  ],
};

/** HP-03 / IMP-01 — headline impact metrics (admin-editable). */
export interface Metric {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  accent?: boolean;
}

export const metrics: Metric[] = [
  { id: "children", label: "Children educated", value: 8500, suffix: "+" },
  { id: "avlcs", label: "Learning centres", value: 5 },
  { id: "years", label: "Years of service", value: 12, accent: true },
  { id: "volunteers", label: "Volunteers onboarded", value: 1200, suffix: "+" },
  { id: "gurukul", label: "Gurukul seats won", value: 340, suffix: "+" },
  { id: "women", label: "Women placed in jobs", value: 600, suffix: "+" },
  { id: "science", label: "Science centre students", value: 2100, suffix: "+" },
  { id: "tutors", label: "Tutors trained", value: 180, suffix: "+" },
];

/** PRG-01 — programme verticals (sitemap §4.3). */
export interface Program {
  slug: string;
  name: string;
  short: string;
  icon: string;
  color: string;
  category: "Education" | "Empowerment" | "Community";
  overview: string;
  facts: { label: string; value: string }[];
  highlights: string[];
}

export const programs: Program[] = [
  {
    slug: "avlc",
    name: "AV Learning Centres (AVLCs)",
    short: "Free remedial & holistic evening education for slum children aged 6–16.",
    icon: "📚",
    color: "#1b4f8a",
    category: "Education",
    overview:
      "Since 2013, our Akshaya Vidya Learning Centres run free evening classes for children aged 6–16, supplementing government school education with structured academics, life skills and mentorship across five locations in the twin cities.",
    facts: [
      { label: "Age group", value: "6–16 years" },
      { label: "Timings", value: "Mon–Fri, 6 PM – 8 PM" },
      { label: "Centres", value: "5 across Hyderabad" },
      { label: "Cost to families", value: "Completely free" },
    ],
    highlights: [
      "Structured academics aligned to the school curriculum",
      "Life-skills, values and mentorship sessions",
      "Locations: Nandanavanam, Singareni Colony, Borabanda, Rasoolpura, Medchal",
    ],
  },
  {
    slug: "science-centre",
    name: "Sir C.V. Raman Science Centre",
    short: "Hands-on science education that sparks curiosity and discovery.",
    icon: "🔬",
    color: "#2e9e6b",
    category: "Education",
    overview:
      "The Sir C.V. Raman Science Centre brings hands-on, experiment-led science to children who would otherwise never set foot in a laboratory — turning abstract textbook chapters into living curiosity.",
    facts: [
      { label: "Focus", value: "Experiential STEM" },
      { label: "Students reached", value: "2,100+" },
      { label: "Format", value: "Lab sessions & workshops" },
    ],
    highlights: [
      "Working models and live experiments",
      "Encourages enquiry-based learning",
      "Bridges the gap between theory and practice",
    ],
  },
  {
    slug: "digital-education",
    name: "Digital Education",
    short: "ICT access and digital literacy for slum children.",
    icon: "💻",
    color: "#2463a8",
    category: "Education",
    overview:
      "Our Digital Education programme provides ICT access and foundational computer literacy to children from slum communities, closing the digital divide that holds them back from modern opportunity.",
    facts: [
      { label: "Focus", value: "Digital literacy" },
      { label: "Beneficiaries", value: "Slum-community children" },
    ],
    highlights: [
      "Computer fundamentals and internet safety",
      "Access to devices and supervised practice",
      "Preparation for a technology-driven future",
    ],
  },
  {
    slug: "project-gurukul",
    name: "Project Gurukul",
    short: "Coaching for Telangana Government Gurukul entrance exams.",
    icon: "🎓",
    color: "#d8631a",
    category: "Education",
    overview:
      "Project Gurukul provides focused coaching that helps our children win seats in Telangana's prestigious Government Gurukul residential schools — a life-changing pathway to quality education.",
    facts: [
      { label: "Outcome", value: "340+ Gurukul seats won" },
      { label: "Focus", value: "Entrance exam coaching" },
    ],
    highlights: [
      "Structured exam preparation",
      "Mentoring and mock tests",
      "Pathway to free residential schooling",
    ],
  },
  {
    slug: "women-empowerment",
    name: "Women & Youth Empowerment",
    short: "Vocational skill training leading to real employment.",
    icon: "💪",
    color: "#7c3aed",
    category: "Empowerment",
    overview:
      "Our Women & Youth Empowerment vertical delivers vocational training across multiple skill categories, supporting trainees all the way through to placement in dignified employment.",
    facts: [
      { label: "Women placed", value: "600+ in jobs" },
      { label: "Focus", value: "Skill development & placement" },
      { label: "Tracks", value: "Tailoring, beauty, computers, retail" },
    ],
    highlights: [
      "Job-ready vocational skill tracks",
      "Placement support and employer linkages",
      "Financial independence for women and youth",
    ],
  },
  {
    slug: "project-tejas",
    name: "Project Tejas — Girl Child",
    short: "Girl child advocacy and uninterrupted education.",
    icon: "🌸",
    color: "#db2777",
    category: "Empowerment",
    overview:
      "Project Tejas champions the girl child — advocating against early drop-out and ensuring girls stay in school, gain confidence, and grow into empowered young women.",
    facts: [
      { label: "Focus", value: "Girl child education & advocacy" },
      { label: "Approach", value: "Mentorship & community outreach" },
    ],
    highlights: [
      "Keeping girls in school",
      "Confidence and leadership building",
      "Community awareness on girl-child rights",
    ],
  },
  {
    slug: "relief-activities",
    name: "Relief Activities",
    short: "Community support during natural calamities.",
    icon: "🤝",
    color: "#0891b2",
    category: "Community",
    overview:
      "When calamity strikes, AVF mobilises to support affected families with essential relief — standing with our communities in their most difficult moments.",
    facts: [
      { label: "Focus", value: "Disaster & community relief" },
      { label: "Approach", value: "Rapid local mobilisation" },
    ],
    highlights: [
      "Essential supplies during calamities",
      "Community-led distribution",
      "Long-standing local trust networks",
    ],
  },
  {
    slug: "project-annapoorna",
    name: "Project Annapoorna",
    short: "Nutrition and food security for children in need.",
    icon: "🍲",
    color: "#ca8a04",
    category: "Community",
    overview:
      "Project Annapoorna tackles hunger and malnutrition, ensuring that no child has to choose between an empty stomach and an education.",
    facts: [
      { label: "Focus", value: "Nutrition & food security" },
      { label: "Beneficiaries", value: "Children at our centres" },
    ],
    highlights: [
      "Nutritious meals and supplements",
      "Supports attendance and learning",
      "Food security for vulnerable families",
    ],
  },
];

/** IMP-03 — AVF Stars beneficiary stories. */
export interface Story {
  id: string;
  name: string;
  headline: string;
  body: string;
  program: string;
  year: number;
  initials: string;
  color: string;
}

export const stories: Story[] = [
  {
    id: "ramesh",
    name: "Ramesh",
    headline: "From an AVLC evening class to IIT Kharagpur",
    body: "Ramesh joined our Nandanavanam learning centre as a shy schoolboy. With years of free evening classes, mentorship and unwavering encouragement, he cracked one of India's toughest entrance exams and is now a student at IIT Kharagpur — living proof of what consistent support can unlock.",
    program: "Education",
    year: 2023,
    initials: "R",
    color: "#1b4f8a",
  },
  {
    id: "lakshmi",
    name: "Lakshmi",
    headline: "A tailoring skill that rebuilt a family's future",
    body: "A single mother of two, Lakshmi enrolled in our Women Empowerment tailoring track. Within months she completed her training, received placement support, and today earns a steady income — sending both her children back to school.",
    program: "Women Empowerment",
    year: 2024,
    initials: "L",
    color: "#7c3aed",
  },
  {
    id: "anjali",
    name: "Anjali",
    headline: "Winning a Gurukul seat against the odds",
    body: "Through Project Gurukul's focused coaching, Anjali secured admission to a Telangana Government Gurukul residential school — a free, high-quality education that her family could never have afforded otherwise.",
    program: "Education",
    year: 2024,
    initials: "A",
    color: "#d8631a",
  },
  {
    id: "kiran",
    name: "Kiran",
    headline: "Discovering a love for science",
    body: "At the Sir C.V. Raman Science Centre, Kiran built his first working circuit. That spark grew into a fascination with engineering — he now tops his science class and dreams of becoming an engineer.",
    program: "Science",
    year: 2023,
    initials: "K",
    color: "#2e9e6b",
  },
];

/** HP-09 / IMP-05 — testimonials. */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Akshaya Vidya Foundation's work with slum children is exactly the kind of grassroots transformation our communities need. Their discipline and impact are commendable.",
    name: "Senior IPS Officer",
    role: "Hyderabad Police",
    initials: "HP",
    color: "#1b4f8a",
  },
  {
    id: "t2",
    quote:
      "I have donated for three years and every rupee is accounted for. The 80G receipts arrive instantly and the impact reports are genuinely moving.",
    name: "Priya Menon",
    role: "Monthly Donor, Bengaluru",
    initials: "PM",
    color: "#d8631a",
  },
  {
    id: "t3",
    quote:
      "Volunteering at the AVLC evening classes has been the most fulfilling part of my week. The children's hunger to learn is contagious.",
    name: "Arjun Reddy",
    role: "Volunteer Tutor",
    initials: "AR",
    color: "#2e9e6b",
  },
  {
    id: "t4",
    quote:
      "As a CSR partner we look for credible, transparent NGOs. AVF's reporting and on-ground reach made the partnership decision easy.",
    name: "Meera Iyer",
    role: "CSR Lead, Tech Corp",
    initials: "MI",
    color: "#7c3aed",
  },
];

/** DON-02 — donation tiers with per-rupee impact (INR locale). */
export interface Tier {
  id: string;
  amount: number;
  impact: string;
}

export const donationTiers: Tier[] = [
  { id: "tier-500", amount: 500, impact: "Stationery for 1 child for a month" },
  { id: "tier-2400", amount: 2400, impact: "A full year of learning for 1 child" },
  { id: "tier-10000", amount: 10000, impact: "Equipment for 1 AVLC centre" },
  { id: "tier-50000", amount: 50000, impact: "Sponsor a Science Lab module" },
];

/** VOL-01 — volunteer interest areas. */
export const volunteerInterests = [
  "Teaching / Tutoring",
  "Administration",
  "Fundraising",
  "Events",
  "Technology",
  "Content & Media",
];

/** VOL-03 — open volunteer roles. */
export interface Role {
  id: string;
  title: string;
  location: string;
  commitment: string;
  description: string;
}

export const volunteerRoles: Role[] = [
  {
    id: "tutor",
    title: "Evening Class Tutor",
    location: "AVLC Centres, Hyderabad",
    commitment: "2 evenings / week",
    description:
      "Teach core subjects to children aged 6–16 during our 6–8 PM evening classes. No formal teaching degree required — just patience and commitment.",
  },
  {
    id: "skills-trainer",
    title: "Women Skills Trainer",
    location: "Borabanda Centre",
    commitment: "Flexible",
    description:
      "Lead vocational sessions (tailoring, computers, beauty) for our Women Empowerment programme and help trainees become job-ready.",
  },
  {
    id: "events",
    title: "Events & Outreach Volunteer",
    location: "Hybrid",
    commitment: "Per event",
    description:
      "Help plan and run community events, graduation days, and donor drives. Great for those with energy and organisational flair.",
  },
  {
    id: "tech",
    title: "Tech & Digital Volunteer",
    location: "Remote",
    commitment: "5 hrs / week",
    description:
      "Support our Digital Education programme and help maintain our website, social media, and impact dashboards.",
  },
];

/** GAL-01 — gallery albums + items. */
export type Album =
  | "All"
  | "AVLC Classroom"
  | "Events & Workshops"
  | "Volunteer Activities"
  | "Graduation"
  | "Community Programs"
  | "Govt & Police Visits";

export const albums: Album[] = [
  "All",
  "AVLC Classroom",
  "Events & Workshops",
  "Volunteer Activities",
  "Graduation",
  "Community Programs",
  "Govt & Police Visits",
];

export interface Photo {
  id: string;
  album: Exclude<Album, "All">;
  caption: string;
  detail: string;
  icon: string;
  color: string;
}

export const photos: Photo[] = [
  { id: "p1", album: "AVLC Classroom", caption: "Evening class at Nandanavanam", detail: "Children studying during our 6–8 PM session at the LB Nagar centre.", icon: "📖", color: "#1b4f8a" },
  { id: "p2", album: "Graduation", caption: "Gurukul achievers felicitated", detail: "Celebrating students who won Government Gurukul seats this year.", icon: "🎓", color: "#d8631a" },
  { id: "p3", album: "Events & Workshops", caption: "Science Centre experiment day", detail: "Hands-on physics workshop at the Sir C.V. Raman Science Centre.", icon: "🔬", color: "#2e9e6b" },
  { id: "p4", album: "Volunteer Activities", caption: "Volunteers leading a reading circle", detail: "Weekend volunteers run an interactive reading session.", icon: "🤝", color: "#7c3aed" },
  { id: "p5", album: "Community Programs", caption: "Project Annapoorna meal drive", detail: "Distributing nutritious meals to children and families.", icon: "🍲", color: "#ca8a04" },
  { id: "p6", album: "Govt & Police Visits", caption: "Hyderabad Police visit", detail: "Senior IPS officers interact with our students and tutors.", icon: "🎖️", color: "#0891b2" },
  { id: "p7", album: "AVLC Classroom", caption: "Digital literacy lab", detail: "Children learning computer fundamentals at Borabanda.", icon: "💻", color: "#2463a8" },
  { id: "p8", album: "Volunteer Activities", caption: "Women skills training", detail: "Tailoring track in progress at our empowerment centre.", icon: "🧵", color: "#db2777" },
  { id: "p9", album: "Community Programs", caption: "Relief distribution drive", detail: "Essential supplies handed out during monsoon flooding.", icon: "📦", color: "#0f766e" },
];

/** NEWS-01 — blog / news posts. */
export interface Post {
  id: string;
  title: string;
  category: "News" | "Event Recap" | "Success Story" | "Announcement";
  date: string;
  excerpt: string;
  icon: string;
  color: string;
  featured?: boolean;
}

export const posts: Post[] = [
  {
    id: "n1",
    title: "AVF opens its fifth learning centre in Medchal",
    category: "Announcement",
    date: "02/06/2025",
    excerpt:
      "Our newest AV Learning Centre begins free evening classes for over 120 children in the Medchal community.",
    icon: "🏫",
    color: "#1b4f8a",
    featured: true,
  },
  {
    id: "n2",
    title: "340 children win Government Gurukul seats this year",
    category: "Success Story",
    date: "20/05/2025",
    excerpt:
      "Project Gurukul records its best-ever results, opening doors to free residential schooling for hundreds of families.",
    icon: "🎓",
    color: "#d8631a",
    featured: true,
  },
  {
    id: "n3",
    title: "Annual Science Fair lights up the C.V. Raman Centre",
    category: "Event Recap",
    date: "28/04/2025",
    excerpt:
      "Students showcased working models and experiments to parents, donors and visiting scientists.",
    icon: "🔬",
    color: "#2e9e6b",
    featured: true,
  },
  {
    id: "n4",
    title: "Women Empowerment cohort celebrates 50 new placements",
    category: "News",
    date: "10/04/2025",
    excerpt:
      "Fifty women from our vocational programme secured employment this quarter across retail and tailoring.",
    icon: "💪",
    color: "#7c3aed",
  },
];

/** NEWS-02 — upcoming events. */
export interface AvfEvent {
  id: string;
  title: string;
  date: string; // DD/MM/YYYY
  day: string;
  month: string;
  venue: string;
  mode: "In-person" | "Online" | "Hybrid";
  description: string;
}

export const events: AvfEvent[] = [
  {
    id: "e1",
    title: "Volunteer Orientation & Induction",
    date: "21/06/2025",
    day: "21",
    month: "Jun",
    venue: "Nandanavanam Centre, LB Nagar",
    mode: "In-person",
    description: "Meet the team, tour a centre, and learn how to get started as an AVF volunteer.",
  },
  {
    id: "e2",
    title: "Annual Donor Impact Meet 2025",
    date: "05/07/2025",
    day: "05",
    month: "Jul",
    venue: "Hyderabad (venue TBA)",
    mode: "Hybrid",
    description: "An evening of impact stories, financial transparency and a look at the year ahead.",
  },
  {
    id: "e3",
    title: "Gurukul Coaching Demo Class (Online)",
    date: "12/07/2025",
    day: "12",
    month: "Jul",
    venue: "Zoom",
    mode: "Online",
    description: "Open demo of Project Gurukul's exam-prep methodology for parents and well-wishers.",
  },
];

/** HP-08 / Trust — institutional supporters. */
export const partners = [
  "Hyderabad Police",
  "Govt. of Telangana",
  "Tech Corp CSR",
  "Rotary Hyderabad",
  "Diaspora Donors (USA)",
  "Local Schools Network",
];

/** About — leadership/team. */
export interface Member {
  name: string;
  role: string;
  initials: string;
  color: string;
}

export const team: Member[] = [
  { name: "Founder & President", role: "Vision & Strategy", initials: "FP", color: "#1b4f8a" },
  { name: "Programme Director", role: "AVLCs & Education", initials: "PD", color: "#d8631a" },
  { name: "Empowerment Lead", role: "Women & Youth", initials: "EL", color: "#7c3aed" },
  { name: "Operations Head", role: "Centres & Relief", initials: "OH", color: "#2e9e6b" },
];

/** NEWS-04 — annual reports. */
export const reports = [
  { year: "2024–25", label: "Annual Impact Report", size: "PDF · 4.2 MB" },
  { year: "2023–24", label: "Annual Impact Report", size: "PDF · 3.8 MB" },
  { year: "2022–23", label: "Annual Impact Report", size: "PDF · 3.1 MB" },
];
