export interface NavItem {
  label: string;
  to: string;
}

/** Main menu — reorganised per requirements §4.3 / NAV-01. */
export const mainNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Impact", to: "/impact" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Gallery", to: "/gallery" },
  { label: "News & Events", to: "/news" },
  { label: "Contact", to: "/contact" },
];

export const footerQuickLinks: NavItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Our Programs", to: "/programs" },
  { label: "Impact & AVF Stars", to: "/impact" },
  { label: "Volunteer", to: "/get-involved" },
  { label: "Gallery", to: "/gallery" },
  { label: "News & Events", to: "/news" },
];

export const footerSupportLinks: NavItem[] = [
  { label: "Donate Now", to: "/donate" },
  { label: "Overseas / USA Donations", to: "/donate/overseas" },
  { label: "Partner With Us (CSR)", to: "/contact#partner" },
  { label: "Annual Reports", to: "/news#reports" },
  { label: "Contact Us", to: "/contact" },
];
