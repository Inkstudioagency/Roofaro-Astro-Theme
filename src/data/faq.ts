/** FAQ shown on Home, About and Service detail pages (also emitted as FAQPage JSON-LD on Home). */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'What type of clients do you work with?',
    answer:
      "We work with homeowners, property managers, commercial businesses, and construction partners across residential and commercial projects. Whether you need a repair, a full replacement, or new installation, we tailor our process to your property's needs.",
  },
  {
    question: 'What roofing services do you offer?',
    answer:
      'We provide complete residential roofing solutions including new roof installation, roof replacement, leak repairs, storm damage restoration, preventive inspections, gutter systems, and ongoing maintenance services.',
  },
  {
    question: 'How long does a project take to complete?',
    answer:
      'Project timelines vary based on the size, materials, and complexity of the roof. Most residential roofing projects are completed within 2–5 days, while larger or custom projects may require additional time.',
  },
  {
    question: 'What is your design process?',
    answer:
      "Our process begins with a detailed roof inspection, followed by a personalized recommendation based on your property's needs. Once materials and scope are approved, our specialists complete installation with precision, followed by a final quality inspection.",
  },
  {
    question: 'Do you provide development services too?',
    answer:
      'Yes. Beyond installation, we provide structural repairs, ventilation improvements, gutter integration, insulation upgrades, and long-term maintenance solutions to ensure complete roof performance.',
  },
  {
    question: 'Can you redesign my existing app or website?',
    answer:
      'Absolutely. Whether your current roof has aging materials, storm damage, poor drainage, or outdated design, we can upgrade, restore, or completely replace your existing roofing system for better protection and curb appeal.',
  },
];
