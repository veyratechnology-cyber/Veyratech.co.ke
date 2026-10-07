"use client";

/**
 * Testimonial Carousel Component
 * Display client testimonials with auto-rotation
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/shared';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '@/lib/testimonials/data';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  interval?: number;
}

export default function TestimonialCarousel({
  testimonials,
  autoRotate = true,
  interval = 5000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <Card className="bg-gradient-to-br from-primary-dark to-primary border-secondary/20">
        <CardContent className="p-8 md:p-12">
          {/* Quote Icon */}
          <Quote className="text-secondary/20 mb-6" size={48} />

          {/* Rating */}
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < currentTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl text-text-primary mb-8 leading-relaxed">
            "{currentTestimonial.quote}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4">
            {currentTestimonial.image ? (
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-secondary font-bold text-lg">
                  {currentTestimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
            )}
            <div>
              <div className="font-semibold text-text-primary">
                {currentTestimonial.name}
              </div>
              <div className="text-sm text-text-secondary">
                {currentTestimonial.role} at {currentTestimonial.company}
              </div>
              <div className="text-xs text-text-muted">
                {currentTestimonial.service} • {currentTestimonial.industry}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary-dark border border-border rounded-full p-3 hover:bg-secondary hover:border-secondary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary-dark border border-border rounded-full p-3 hover:bg-secondary hover:border-secondary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-secondary w-8'
                    : 'bg-border hover:bg-secondary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Testimonial Grid Component
 */
interface TestimonialGridProps {
  testimonials: Testimonial[];
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="h-full">
          <CardContent className="p-6 flex flex-col h-full">
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-text-primary mb-6 flex-1 line-clamp-4">
              "{testimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-secondary font-bold text-sm">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-text-primary text-sm truncate">
                  {testimonial.name}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
