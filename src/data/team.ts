/** About page → "Our Team". Images live in /public/images. */
export interface TeamMember {
  name: string;
  role: string;
  image: string;
  /** Root-domain link only in the demo (catalogue rule: no real profiles). */
  social: string;
  /** Include in the mobile slider (< 768px). The original design shows 7 of the 8 there. */
  mobile?: boolean;
}

export const team: TeamMember[] = [
  { name: 'Esther Howard', role: 'CEO & Co-founder', image: '/images/Team-Image-2-2.webp', social: 'https://x.com/' },
  { name: 'Bessie Cooper', role: 'Managing Director', image: '/images/Team-Image-4-2.webp', social: 'https://x.com/' },
  { name: 'Brooklyn Simmons', role: 'Lead Rooking Technician', image: '/images/Team-Image-4.webp', social: 'https://x.com/' },
  { name: 'Floyd Miles', role: 'Roofing Supervisor', image: '/images/Team-Image-6.webp', social: 'https://x.com/' },
  { name: 'Darlene Robertson', role: 'Logistics Manager', image: '/images/Team-Image-1-2.webp', social: 'https://x.com/' },
  { name: 'Guy Hawkins', role: 'Customer Service', image: '/images/Team-Image-3-2.webp', social: 'https://x.com/', mobile: false },
  { name: 'Jane Cooper', role: 'Quality Inspector', image: '/images/Team-Image-5.webp', social: 'https://x.com/' },
  { name: 'Leslie Alexander', role: 'Compliance Officer', image: '/images/Team-Image-7.webp', social: 'https://x.com/' },
];
