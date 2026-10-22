import React from 'react';
import { Card, CardContent } from '@/components/shared';
import { HelpCircle } from 'lucide-react';
import StructuredData from '@/components/seo/StructuredData';
import { generateFAQSchema } from '@/lib/seo/structured-data';

const faqs = [
  {
    question: 'How much does a consultation cost?',
    answer: 'Initial consultation sessions cost KSH 15,000. This investment includes a comprehensive analysis of your business needs, detailed recommendations, and a custom action plan. Follow-up implementation work is quoted separately based on your specific requirements.'
  },
  {
    question: 'What happens after I book a consultation?',
    answer: 'After booking, you\'ll receive a confirmation email with meeting details. We\'ll send a brief questionnaire to understand your needs better. On the scheduled date, we\'ll have a detailed discussion about your challenges and opportunities, followed by specific recommendations.'
  },
  {
    question: 'Can we meet in person or only online?',
    answer: 'We offer both options! You can choose Google Meet for remote consultations, phone calls, or in-person meetings at our Nairobi office. Select your preference when booking.'
  },
  {
    question: 'How long does a consultation session last?',
    answer: 'Standard consultation sessions run for 60-90 minutes. This gives us enough time to understand your business, discuss challenges in detail, and develop actionable recommendations.'
  },
  {
    question: 'Do you work with businesses outside Nairobi?',
    answer: 'Yes! While we\'re based in Nairobi, Kenya, we work with businesses across East Africa and internationally. Remote consultations via Google Meet make it easy to work together regardless of location.'
  },
  {
    question: 'What industries do you specialize in?',
    answer: 'We work across multiple industries including Professional Services, Technology & Software, Financial Services, Healthcare, Manufacturing, Retail & E-commerce, Education, Real Estate, Hospitality, and Non-profit organizations.'
  },
  {
    question: 'How do I pay for the consultation?',
    answer: 'After your consultation is confirmed, we\'ll send you an invoice with payment instructions. We accept M-Pesa, bank transfers, and other local payment methods. Payment is typically required before the scheduled session.'
  },
  {
    question: 'What if I need to reschedule?',
    answer: 'We understand schedules change. Please contact us at least 24 hours before your appointment to reschedule without any penalty. You can reach us via email or phone.'
  }
];

export default function BookingFAQ() {
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData data={faqSchema} />

      {/* FAQ Section */}
      <section className="py-12 bg-primary-dark">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <HelpCircle className="text-secondary" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-text-secondary">
              Everything you need to know about booking a consultation
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-primary">
                <CardContent className="p-6">
                  <h3 className="font-sora font-semibold text-xl text-text-primary mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <p className="text-lg text-text-primary mb-2">
                  Still have questions?
                </p>
                <p className="text-text-secondary mb-4">
                  Contact us at{' '}
                  <a href="mailto:hello@veyratech.co.ke" className="text-secondary hover:underline">
                    hello@veyratech.co.ke
                  </a>
                  {' '}or call{' '}
                  <a href="tel:+254712345678" className="text-secondary hover:underline">
                    +254 712 345 678
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
