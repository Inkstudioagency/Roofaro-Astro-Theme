/** Testimonials slider (Home + About). Quotes include their quotation marks, as in the design. */
export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      '“Following the storm, we anticipated that replacing our roof would be a daunting task. However, PeakShield took care of every detail, from conducting the inspection to assisting with insurance claims. The outcome not only met but truly surpassed our expectations.”',
    name: 'Kristin Watson',
    location: 'Homeowner',
    rating: '5.0',
    image: '/images/Testimonial-Image-3-1.webp',
  },
  {
    quote:
      '"What truly stood out to me was their unwavering honesty throughout the entire process. There were absolutely no hidden costs or unexpected surprises—just a commitment to professional craftsmanship that was evident from the very beginning to the final touches."',
    name: 'Andre Mitchell',
    location: 'Property Manager',
    rating: '5.0',
    image: '/images/Testimonial-Image-1-1.webp',
  },
  {
    quote:
      '"The team showed up right on time as promised, took the time to explain every detail of the process clearly, and remarkably completed the installation ahead of schedule. Our home now feels more secure and protected than ever before!"',
    name: 'Michael Anderson',
    location: 'Business Owner',
    rating: '5.0',
    image: '/images/Testimonial-Image-2-1.webp',
  },
];
