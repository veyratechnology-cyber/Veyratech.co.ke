/**
 * Testimonials Data
 * Client testimonials and reviews
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  image?: string;
  rating: number; // 1-5
  quote: string;
  service: string;
  featured?: boolean;
  createdAt: Date;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Kamau',
    role: 'CEO',
    company: 'TechStart Kenya',
    industry: 'Technology',
    rating: 5,
    quote: 'VeyraTech transformed our entire business operations. Their AI strategy helped us reduce costs by 40% while improving customer satisfaction. Truly exceptional consultants who understand the Kenyan market.',
    service: 'AI Strategy',
    featured: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Wanjiru',
    role: 'Operations Director',
    company: 'Retail Plus Ltd',
    industry: 'Retail',
    rating: 5,
    quote: 'The digital transformation project exceeded all our expectations. VeyraTech\'s team was professional, responsive, and delivered results ahead of schedule. Our inventory management is now seamless across all 50+ stores.',
    service: 'Digital Transformation',
    featured: true,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Dr. James Odhiambo',
    role: 'Hospital Administrator',
    company: 'HealthCare Network',
    industry: 'Healthcare',
    rating: 5,
    quote: 'Implementing the AI-powered patient management system was the best decision we made. Patient processing time dropped by 50%, and our staff can now focus on providing better care instead of paperwork.',
    service: 'Healthcare AI',
    featured: true,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Mary Njoki',
    role: 'COO',
    company: 'Manufacturing Kenya Ltd',
    industry: 'Manufacturing',
    rating: 5,
    quote: 'VeyraTech helped us automate our production line with IoT sensors and real-time analytics. Production errors decreased by 60%, and we achieved ROI in just 8 months. Highly recommended!',
    service: 'Business Automation',
    featured: false,
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    name: 'Peter Mwangi',
    role: 'IT Manager',
    company: 'Financial Services Group',
    industry: 'Finance',
    rating: 4,
    quote: 'Great experience working with VeyraTech on our customer service automation project. The chatbot handles 70% of queries automatically, freeing up our team for complex issues. Professional service throughout.',
    service: 'AI Implementation',
    featured: false,
    createdAt: new Date('2024-05-12'),
  },
  {
    id: '6',
    name: 'Grace Akinyi',
    role: 'Business Development Manager',
    company: 'AgriTech Solutions',
    industry: 'Agriculture',
    rating: 5,
    quote: 'The consultation sessions provided incredible value. VeyraTech helped us identify the right technology solutions for our scale and budget. Their understanding of both technology and agriculture in Kenya is impressive.',
    service: 'Technology Consulting',
    featured: false,
    createdAt: new Date('2024-06-08'),
  },
];

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter(t => t.featured);
}

export function getTestimonialsByService(service: string): Testimonial[] {
  return testimonials.filter(t => t.service.toLowerCase().includes(service.toLowerCase()));
}

export function getTestimonialsByIndustry(industry: string): Testimonial[] {
  return testimonials.filter(t => t.industry === industry);
}

export function getAverageRating(): number {
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}

export function getAllTestimonials(): Testimonial[] {
  return testimonials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
