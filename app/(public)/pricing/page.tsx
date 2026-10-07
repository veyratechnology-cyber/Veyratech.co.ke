"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/shared';
import { Check, ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import { packages } from '@/lib/pricing/packages';

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<'consultation' | 'ai' | 'support'>('consultation');

  const categories = [
    { id: 'consultation' as const, label: 'Consultation Packages', icon: Zap },
    { id: 'ai' as const, label: 'AI Solutions', icon: TrendingUp },
    { id: 'support' as const, label: 'Support & Maintenance', icon: Shield },
  ];

  const currentPackages = packages[selectedCategory];

  return (
    <div className="py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-sora font-bold text-text-primary mb-6">
          Transparent Pricing
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          Choose the package that fits your needs. All prices in Kenyan Shillings (KSH).
        </p>
      </div>

      {/* Category Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === id
                  ? 'bg-primary text-white'
                  : 'bg-background-dark text-text-secondary hover:bg-background-light'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentPackages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden ${
                index === 1 ? 'border-primary border-2 transform md:scale-105' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="mb-4">
                  <div className="text-4xl mb-2">{pkg.icon}</div>
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <p className="text-text-secondary text-sm">{pkg.description}</p>
                </div>
                <div className="mt-6">
                  <div className="text-4xl font-bold text-text-primary">
                    KSH {pkg.price.toLocaleString()}
                  </div>
                  <div className="text-text-secondary text-sm mt-1">{pkg.billing}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href="/book-consultation" className="block">
                  <Button
                    className={`w-full group ${
                      index === 1 ? 'bg-primary hover:bg-primary/90' : ''
                    }`}
                    variant={index === 1 ? 'primary' : 'outline'}
                  >
                    {pkg.cta}
                    <ArrowRight
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                      size={18}
                    />
                  </Button>
                </Link>

                {pkg.highlight && (
                  <p className="text-xs text-center text-primary font-semibold">
                    {pkg.highlight}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-3xl font-sora font-bold text-text-primary text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-text-secondary">
                We accept M-Pesa, bank transfers, and credit/debit cards. All prices include 16% VAT.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                Can I switch packages later?
              </h3>
              <p className="text-text-secondary">
                Yes! You can upgrade or adjust your package at any time. We'll pro-rate any payments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                Do you offer custom packages?
              </h3>
              <p className="text-text-secondary">
                Absolutely. If none of our packages fit your needs, book a consultation and we'll create a custom solution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                What's included in the free consultation?
              </h3>
              <p className="text-text-secondary">
                A 45-minute video call with our experts to discuss your challenges, explore solutions, and receive a preliminary roadmap. No commitment required.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-12">
            <h2 className="text-3xl font-sora font-bold text-text-primary mb-4">
              Not Sure Which Package to Choose?
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Book a free consultation and we'll help you find the perfect solution
            </p>
            <Link href="/book-consultation">
              <Button size="lg">
                Book Free Consultation
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
