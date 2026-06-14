import type {
  Program,
  Story,
  Testimonial,
  Post,
  AvfEvent,
  Photo,
  Metric,
} from "../types";

/** Initial content seeded into Firestore (admin-editable thereafter). */

export const seedMetrics: Metric[] = [
  { id: "children", label: "Children educated", value: 8500, suffix: "+", order: 1 },
  { id: "avlcs", label: "Learning centres", value: 5, order: 2 },
  { id: "years", label: "Years of service", value: 12, accent: true, order: 3 },
  { id: "volunteers", label: "Volunteers onboarded", value: 1200, suffix: "+", order: 4 },
  { id: "gurukul", label: "Gurukul seats won", value: 340, suffix: "+", order: 5 },
  { id: "women", label: "Women placed in jobs", value: 600, suffix: "+", order: 6 },
  { id: "science", label: "Science centre students", value: 2100, suffix: "+", order: 7 },
  { id: "tutors", label: "Tutors trained", value: 180, suffix: "+", order: 8 },
];

export const seedPrograms: Program[] = [
  {
    id: "avlc",
    slug: "avlc",
    name: "AV Learning Centres (AVLCs)",
    short: "Free remedial & holistic evening education for slum children aged 6–16.",
    icon: "📚",
    color: "#1b4f8a",
    category: "Education",
    order: 1,
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
    id: "science-centre",
    slug: "science-centre",
    name: "Sir C.V. Raman Science Centre",
    short: "Hands-on science education that sparks curiosity and discovery.",
    icon: "🔬",
    color: "#2e9e6b",
    category: "Education",
    order: 2,
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
    id: "digital-education",
    slug: "digital-education",
    name: "Digital Education",
    short: "ICT access and digital literacy for slum children.",
    icon: "💻",
    color: "#2463a8",
    category: "Education",
    order: 3,
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
    id: "project-gurukul",
    slug: "project-gurukul",
    name: "Project Gurukul",
    short: "Coaching for Telangana Government Gurukul entrance exams.",
    icon: "🎓",
    color: "#d8631a",
    category: "Education",
    order: 4,
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
    id: "women-empowerment",
    slug: "women-empowerment",
    name: "Women & Youth Empowerment",
    short: "Vocational skill training leading to real employment.",
    icon: "💪",
    color: "#7c3aed",
    category: "Empowerment",
    order: 5,
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
    id: "project-tejas",
    slug: "project-tejas",
    name: "Project Tejas — Girl Child",
    short: "Girl child advocacy and uninterrupted education.",
    icon: "🌸",
    color: "#db2777",
    category: "Empowerment",
    order: 6,
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
    id: "relief-activities",
    slug: "relief-activities",
    name: "Relief Activities",
    short: "Community support during natural calamities.",
    icon: "🤝",
    color: "#0891b2",
    category: "Community",
    order: 7,
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
    id: "project-annapoorna",
    slug: "project-annapoorna",
    name: "Project Annapoorna",
    short: "Nutrition and food security for children in need.",
    icon: "🍲",
    color: "#ca8a04",
    category: "Community",
    order: 8,
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

export const seedStories: Story[] = [
  { id: "ramesh", name: "Ramesh", headline: "From an AVLC evening class to IIT Kharagpur", body: "Ramesh joined our Nandanavanam learning centre as a shy schoolboy. With years of free evening classes, mentorship and unwavering encouragement, he cracked one of India's toughest entrance exams and is now a student at IIT Kharagpur — living proof of what consistent support can unlock.", program: "Education", year: 2023, initials: "R", color: "#1b4f8a" },
  { id: "lakshmi", name: "Lakshmi", headline: "A tailoring skill that rebuilt a family's future", body: "A single mother of two, Lakshmi enrolled in our Women Empowerment tailoring track. Within months she completed her training, received placement support, and today earns a steady income — sending both her children back to school.", program: "Women Empowerment", year: 2024, initials: "L", color: "#7c3aed" },
  { id: "anjali", name: "Anjali", headline: "Winning a Gurukul seat against the odds", body: "Through Project Gurukul's focused coaching, Anjali secured admission to a Telangana Government Gurukul residential school — a free, high-quality education that her family could never have afforded otherwise.", program: "Education", year: 2024, initials: "A", color: "#d8631a" },
  { id: "kiran", name: "Kiran", headline: "Discovering a love for science", body: "At the Sir C.V. Raman Science Centre, Kiran built his first working circuit. That spark grew into a fascination with engineering — he now tops his science class and dreams of becoming an engineer.", program: "Science", year: 2023, initials: "K", color: "#2e9e6b" },
];

export const seedTestimonials: Testimonial[] = [
  { id: "t1", quote: "Akshaya Vidya Foundation's work with slum children is exactly the kind of grassroots transformation our communities need. Their discipline and impact are commendable.", name: "Senior IPS Officer", role: "Hyderabad Police", initials: "HP", color: "#1b4f8a" },
  { id: "t2", quote: "I have donated for three years and every rupee is accounted for. The 80G receipts arrive instantly and the impact reports are genuinely moving.", name: "Priya Menon", role: "Monthly Donor, Bengaluru", initials: "PM", color: "#d8631a" },
  { id: "t3", quote: "Volunteering at the AVLC evening classes has been the most fulfilling part of my week. The children's hunger to learn is contagious.", name: "Arjun Reddy", role: "Volunteer Tutor", initials: "AR", color: "#2e9e6b" },
  { id: "t4", quote: "As a CSR partner we look for credible, transparent NGOs. AVF's reporting and on-ground reach made the partnership decision easy.", name: "Meera Iyer", role: "CSR Lead, Tech Corp", initials: "MI", color: "#7c3aed" },
];

export const seedPosts: Post[] = [
  { id: "n1", title: "AVF opens its fifth learning centre in Medchal", category: "Announcement", date: "02/06/2025", excerpt: "Our newest AV Learning Centre begins free evening classes for over 120 children in the Medchal community.", icon: "🏫", color: "#1b4f8a", featured: true },
  { id: "n2", title: "340 children win Government Gurukul seats this year", category: "Success Story", date: "20/05/2025", excerpt: "Project Gurukul records its best-ever results, opening doors to free residential schooling for hundreds of families.", icon: "🎓", color: "#d8631a", featured: true },
  { id: "n3", title: "Annual Science Fair lights up the C.V. Raman Centre", category: "Event Recap", date: "28/04/2025", excerpt: "Students showcased working models and experiments to parents, donors and visiting scientists.", icon: "🔬", color: "#2e9e6b", featured: true },
  { id: "n4", title: "Women Empowerment cohort celebrates 50 new placements", category: "News", date: "10/04/2025", excerpt: "Fifty women from our vocational programme secured employment this quarter across retail and tailoring.", icon: "💪", color: "#7c3aed" },
];

export const seedEvents: AvfEvent[] = [
  { id: "e1", title: "Volunteer Orientation & Induction", date: "21/06/2025", day: "21", month: "Jun", venue: "Nandanavanam Centre, LB Nagar", mode: "In-person", description: "Meet the team, tour a centre, and learn how to get started as an AVF volunteer." },
  { id: "e2", title: "Annual Donor Impact Meet 2025", date: "05/07/2025", day: "05", month: "Jul", venue: "Hyderabad (venue TBA)", mode: "Hybrid", description: "An evening of impact stories, financial transparency and a look at the year ahead." },
  { id: "e3", title: "Gurukul Coaching Demo Class (Online)", date: "12/07/2025", day: "12", month: "Jul", venue: "Zoom", mode: "Online", description: "Open demo of Project Gurukul's exam-prep methodology for parents and well-wishers." },
];

export const seedGallery: Photo[] = [
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
