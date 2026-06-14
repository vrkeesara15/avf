/** Domain types shared across the API. */

export type Role =
  | "super_admin"
  | "content_editor"
  | "donation_viewer"
  | "gallery_manager";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
}

export type DonationStatus = "created" | "paid" | "failed";
export type Frequency = "one-time" | "monthly" | "annual";

export interface Donation {
  id: string;
  amount: number;
  frequency: Frequency;
  status: DonationStatus;
  // donor details (captured at verification)
  donorName?: string;
  email?: string;
  phone?: string;
  pan?: string;
  city?: string;
  organisation?: string;
  marketingConsent?: boolean;
  // payment references
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  receiptNo?: string;
  receiptEmailed?: boolean;
  createdAt: string;
  paidAt?: string;
}

export type VolunteerStatus = "pending" | "active" | "inactive";

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  profession?: string;
  availability?: string;
  interest: string;
  consent: boolean;
  status: VolunteerStatus;
  createdAt: string;
}

export type InquiryType = "contact" | "partner";
export type InquiryStatus = "new" | "in_progress" | "resolved";

export interface Inquiry {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  // contact
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  // partner (CSR)
  orgName?: string;
  contact?: string;
  designation?: string;
  phone?: string;
  nature?: string;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  short: string;
  icon: string;
  color: string;
  category: "Education" | "Empowerment" | "Community";
  overview: string;
  facts: { label: string; value: string }[];
  highlights: string[];
  order: number;
}

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

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export interface Post {
  id: string;
  title: string;
  category: "News" | "Event Recap" | "Success Story" | "Announcement";
  date: string;
  excerpt: string;
  body?: string;
  icon: string;
  color: string;
  featured?: boolean;
}

export interface AvfEvent {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  venue: string;
  mode: "In-person" | "Online" | "Hybrid";
  description: string;
}

export interface Photo {
  id: string;
  album: string;
  caption: string;
  detail: string;
  icon: string;
  color: string;
  url?: string;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  accent?: boolean;
  order: number;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  target?: string;
  createdAt: string;
}

/** Names of the collections used by the store. */
export type CollectionName =
  | "adminUsers"
  | "donations"
  | "volunteers"
  | "inquiries"
  | "subscribers"
  | "programs"
  | "stories"
  | "testimonials"
  | "posts"
  | "events"
  | "gallery"
  | "metrics"
  | "audit";
