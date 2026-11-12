import React from "react";
import { Button, Card, CardContent } from "@/components/shared";
import { Star, ExternalLink, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials",
  description: "See what our clients say about VeyraTech's technology consulting services. Real reviews from businesses across Kenya.",
  keywords: ["VeyraTech reviews", "VeyraTech testimonials", "technology consulting reviews Kenya"],
};

export default function ReviewsPage() {
  const organizationSchema = generateOrganizationSchema();

  // Testimonials removed - will be added when real client reviews are available
  const testimonials: any[] = [];

  const reviewStats = {
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? "fill-secondary text-secondary" : "text-border"}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData data={organizationSchema} />

      {/* Hero Section */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6 text-text-primary">
              What Our Clients Say
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              We're building our review collection. Check back soon for client testimonials.
            </p>
            
            {/* Overall Rating - Hidden until reviews available */}
            <div className="inline-flex flex-col items-center bg-primary-dark rounded-xl p-6 border border-border">
              <div className="text-text-secondary">
                No reviews yet
              </div>
              <div className="text-text-muted mt-2">
                Be our first reviewer!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Distribution */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-sora font-bold mb-6 text-center text-text-primary">
              Rating Distribution
            </h2>
            <div className="space-y-3">
              {[
                { stars: 5, count: reviewStats.fiveStars },
                { stars: 4, count: reviewStats.fourStars },
                { stars: 3, count: reviewStats.threeStars },
                { stars: 2, count: reviewStats.twoStars },
                { stars: 1, count: reviewStats.oneStars },
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-20">
                    <span className="text-text-primary font-semibold">{item.stars}</span>
                    <Star size={16} className="fill-secondary text-secondary" />
                  </div>
                  <div className="flex-1 bg-primary rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full"
                      style={{
                        width: `${(item.count / reviewStats.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-text-muted w-12 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Hidden until available */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-sora font-bold mb-8 text-text-primary">
              Client Testimonials Coming Soon
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              We're currently gathering feedback from our clients. Check back soon to see what they have to say about working with VeyraTech.
            </p>
            <Button href="/contact" variant="primary" size="lg">
                Work With Us
              </Button>
          </div>
        </div>
      </section>

      {/* Google Reviews CTA */}
      <section className="section bg-secondary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Worked with VeyraTech?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              We'd love to hear about your experience. Leave us a review on Google!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://g.page/r/YOUR_GOOGLE_BUSINESS_REVIEW_LINK/review"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="bg-white text-secondary hover:bg-gray-100">
                  Leave a Google Review
                  <ExternalLink size={20} />
                </Button>
              </a>
              <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-primary-dark">
                  Contact Us
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-sora font-bold mb-8 text-text-primary">
              Why Clients Choose VeyraTech
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-sora font-bold text-secondary mb-2">98%</div>
                  <div className="text-text-secondary">Client Satisfaction Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-sora font-bold text-secondary mb-2">50+</div>
                  <div className="text-text-secondary">Businesses Transformed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-sora font-bold text-secondary mb-2">3x</div>
                  <div className="text-text-secondary">Average ROI</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
