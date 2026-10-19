"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Textarea, Select, Alert } from "@/components/shared";
import { ArrowRight, ArrowLeft, Check, Calendar, CreditCard, Loader2 } from "lucide-react";
import { packages, PricingPackage } from "@/lib/pricing/packages";
import { INDUSTRIES, CONSULTATION_TYPES, MEETING_TYPES } from "@/lib/constants";

// Multi-Step Booking Form State
interface BookingFormData {
  // Step 1: Package Selection
  packageId: string;
  packageCategory: 'consultation' | 'ai' | 'support';
  quotedAmount: number;
  
  // Step 2: Personal Information
  name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  
  // Step 3: Business Information
  industry: string;
  businessChallenge: string;
  consultationTypes: string[];
  
  // Step 4: Meeting Details
  meetingType: 'GOOGLE_MEET' | 'PHONE' | 'IN_PERSON';
  preferredDate: string;
  preferredTime: string;
  meetingLocation: string;
  
  // Step 5: Payment Method
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'INVOICE_LATER';
  mpesaPhone: string;
}

const STEPS = [
  { id: 1, title: 'Select Package', icon: '📦' },
  { id: 2, title: 'Your Information', icon: '👤' },
  { id: 3, title: 'Business Needs', icon: '💼' },
  { id: 4, title: 'Schedule Meeting', icon: '📅' },
  { id: 5, title: 'Payment', icon: '💳' },
  { id: 6, title: 'Confirmation', icon: '✅' },
];

export default function MultiStepBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BookingFormData>({
    packageId: '',
    packageCategory: 'consultation',
    quotedAmount: 0,
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    businessChallenge: '',
    consultationTypes: [],
    meetingType: 'GOOGLE_MEET',
    preferredDate: '',
    preferredTime: '',
    meetingLocation: '',
    paymentMethod: 'MPESA',
    mpesaPhone: '',
  });

  // Load package from URL params (if coming from pricing page)
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam) {
      // Find package in all categories
      let foundPackage: PricingPackage | undefined;
      let foundCategory: 'consultation' | 'ai' | 'support' | undefined;
      
      for (const [category, pkgs] of Object.entries(packages)) {
        const pkg = pkgs.find((p: PricingPackage) => p.id === packageParam);
        if (pkg) {
          foundPackage = pkg;
          foundCategory = category as 'consultation' | 'ai' | 'support';
          break;
        }
      }
      
      if (foundPackage && foundCategory) {
        setFormData(prev => ({
          ...prev,
          packageId: foundPackage!.id,
          packageCategory: foundCategory!,
          quotedAmount: foundPackage!.price,
        }));
      }
    }
    
    // Load saved progress from localStorage
    const saved = localStorage.getItem('booking-progress');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setFormData(savedData.formData);
        setCurrentStep(savedData.step);
      } catch (e) {
        console.error('Failed to load saved progress', e);
      }
    }
  }, [searchParams]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('booking-progress', JSON.stringify({
      formData,
      step: currentStep,
      timestamp: Date.now(),
    }));
  }, [formData, currentStep]);

  const updateField = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!formData.packageId) {
          setError('Please select a package');
          return false;
        }
        break;
      case 2:
        if (!formData.name || !formData.email || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      case 3:
        if (!formData.businessChallenge || formData.businessChallenge.length < 20) {
          setError('Please describe your business challenge (at least 20 characters)');
          return false;
        }
        break;
      case 4:
        if (!formData.preferredDate || !formData.preferredTime) {
          setError('Please select your preferred meeting date and time');
          return false;
        }
        if (formData.meetingType === 'IN_PERSON' && !formData.meetingLocation) {
          setError('Please specify the meeting location for in-person meetings');
          return false;
        }
        break;
      case 5:
        if (formData.paymentMethod === 'MPESA' && !formData.mpesaPhone) {
          setError('Please enter your M-Pesa phone number');
          return false;
        }
        break;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit booking with payment information
      const response = await fetch('/api/consultations/book-with-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear saved progress
        localStorage.removeItem('booking-progress');
        
        // Move to confirmation step
        setCurrentStep(6);
        
        // If M-Pesa payment initiated, show STK push message
        if (data.paymentInitiated && formData.paymentMethod === 'MPESA') {
          setError(null);
        }
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push(`/book-consultation/success?id=${data.consultationId}`);
        }, 2000);
      } else {
        setError(data.error || 'Failed to complete booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setError('An unexpected error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPackage = formData.packageId
    ? packages[formData.packageCategory].find(p => p.id === formData.packageId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-primary-dark py-12">
      <div className="container-custom max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                      currentStep > step.id
                        ? 'bg-success text-white'
                        : currentStep === step.id
                        ? 'bg-secondary text-white ring-4 ring-secondary/30'
                        : 'bg-background-light text-text-muted'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={24} /> : step.icon}
                  </div>
                  <p className={`text-xs mt-2 text-center ${
                    currentStep >= step.id ? 'text-text-primary font-medium' : 'text-text-muted'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-success' : 'bg-background-light'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} dismissible onDismiss={() => setError(null)} />
        )}

        {/* Step Content */}
        <div className="bg-primary rounded-xl shadow-2xl p-8">
          {currentStep === 1 && <Step1PackageSelection formData={formData} updateField={updateField} />}
          {currentStep === 2 && <Step2PersonalInfo formData={formData} updateField={updateField} />}
          {currentStep === 3 && <Step3BusinessInfo formData={formData} updateField={updateField} />}
          {currentStep === 4 && <Step4MeetingSchedule formData={formData} updateField={updateField} />}
          {currentStep === 5 && <Step5Payment formData={formData} updateField={updateField} selectedPackage={selectedPackage} />}
          {currentStep === 6 && <Step6Confirmation />}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1 || isSubmitting}
              size="lg"
            >
              <ArrowLeft size={20} />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button variant="primary" onClick={nextStep} size="lg">
                Continue
                <ArrowRight size={20} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Booking
                    <Check size={20} />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Step 1: Package Selection
function Step1PackageSelection({
  formData,
  updateField,
}: {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: any) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<'consultation' | 'ai' | 'support'>(
    formData.packageCategory
  );

  const categories = [
    { id: 'consultation' as const, label: 'Consultation', icon: '💡' },
    { id: 'ai' as const, label: 'AI Solutions', icon: '🤖' },
    { id: 'support' as const, label: 'Support', icon: '🛠️' },
  ];

  const handlePackageSelect = (packageId: string, price: number) => {
    updateField('packageId', packageId);
    updateField('packageCategory', selectedCategory);
    updateField('quotedAmount', price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Select Your Package
        </h2>
        <p className="text-text-secondary">
          Choose the package that best fits your needs. You can customize later.
        </p>
      </div>

      {/* Category Selector */}
      <div className="flex gap-3">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              selectedCategory === cat.id
                ? 'border-secondary bg-secondary/10 text-secondary'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div className="font-semibold">{cat.label}</div>
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages[selectedCategory].map(pkg => (
          <button
            key={pkg.id}
            onClick={() => handlePackageSelect(pkg.id, pkg.price)}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              formData.packageId === pkg.id
                ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/30'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <div className="text-3xl mb-2">{pkg.icon}</div>
            <h3 className="text-lg font-bold text-text-primary mb-1">{pkg.name}</h3>
            <p className="text-sm text-text-secondary mb-3">{pkg.description}</p>
            <div className="text-2xl font-bold text-secondary">
              KSH {pkg.price.toLocaleString()}
            </div>
            <div className="text-xs text-text-muted">{pkg.billing}</div>
            
            {formData.packageId === pkg.id && (
              <div className="mt-3 flex items-center gap-2 text-success">
                <Check size={16} />
                <span className="text-sm font-medium">Selected</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 bg-background-secondary rounded-lg">
        <p className="text-sm text-text-secondary">
          💡 <strong>Need something custom?</strong> Select the package closest to your needs,
          and we'll discuss customization options during the consultation.
        </p>
      </div>
    </div>
  );
}

// Step 2: Personal Information
function Step2PersonalInfo({
  formData,
  updateField,
}: {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Your Information
        </h2>
        <p className="text-text-secondary">
          Let us know how to reach you. All fields marked with * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name *"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
          placeholder="John Doe"
        />
        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
          placeholder="john@company.com"
        />
        <Input
          label="Phone Number *"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          required
          placeholder="+254 712 345 678"
        />
        <Input
          label="Company Name"
          value={formData.company}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder="Your Company Ltd"
        />
        <div className="md:col-span-2">
          <Input
            label="Job Title"
            value={formData.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            placeholder="CEO, CTO, Operations Manager, etc."
          />
        </div>
      </div>
    </div>
  );
}

// Step 3: Business Information
function Step3BusinessInfo({
  formData,
  updateField,
}: {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: any) => void;
}) {
  const toggleConsultationType = (type: string) => {
    const current = formData.consultationTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateField('consultationTypes', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Tell Us About Your Business
        </h2>
        <p className="text-text-secondary">
          Help us understand your challenges so we can provide the best solution.
        </p>
      </div>

      <Select
        label="Industry (Optional)"
        value={formData.industry}
        onChange={(e) => updateField('industry', e.target.value)}
        options={[
          { value: '', label: 'Select your industry' },
          ...INDUSTRIES.map(i => ({ value: i.value, label: i.label })),
        ]}
      />

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Areas of Interest (Optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CONSULTATION_TYPES.slice(0, 9).map(type => (
            <button
              key={type.value}
              onClick={() => toggleConsultationType(type.value)}
              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                formData.consultationTypes.includes(type.value)
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
                  : 'border-border hover:border-secondary/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="What's Your Main Challenge? *"
        value={formData.businessChallenge}
        onChange={(e) => updateField('businessChallenge', e.target.value)}
        required
        rows={5}
        placeholder="Describe the business challenge you're facing or what you're hoping to achieve..."
      />

      <div className="p-4 bg-background-secondary rounded-lg">
        <p className="text-sm text-text-secondary">
          🔒 <strong>Your information is confidential.</strong> We take privacy seriously and
          will never share your business information without your permission.
        </p>
      </div>
    </div>
  );
}

// Step 4: Meeting Schedule
function Step4MeetingSchedule({
  formData,
  updateField,
}: {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: any) => void;
}) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Schedule Your Meeting
        </h2>
        <p className="text-text-secondary">
          Choose when and how you'd like to meet with our team.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Meeting Format *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MEETING_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => updateField('meetingType', type.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                formData.meetingType === type.value
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
                  : 'border-border hover:border-secondary/50'
              }`}
            >
              <div className="text-2xl mb-2">
                {type.value === 'GOOGLE_MEET' && '📹'}
                {type.value === 'PHONE' && '📞'}
                {type.value === 'IN_PERSON' && '🏢'}
              </div>
              <div className="font-semibold">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Preferred Date *"
          type="date"
          value={formData.preferredDate}
          onChange={(e) => updateField('preferredDate', e.target.value)}
          required
          min={today}
        />
        <Input
          label="Preferred Time *"
          type="time"
          value={formData.preferredTime}
          onChange={(e) => updateField('preferredTime', e.target.value)}
          required
        />
      </div>

      {formData.meetingType === 'IN_PERSON' && (
        <Textarea
          label="Meeting Location *"
          value={formData.meetingLocation}
          onChange={(e) => updateField('meetingLocation', e.target.value)}
          required
          rows={3}
          placeholder="Enter your preferred location (e.g., Your office address, Coffee shop, etc.)"
        />
      )}

      <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-secondary">
        <p className="text-sm text-text-primary">
          <strong>📅 Flexible scheduling:</strong> If your preferred time isn't available,
          we'll find the next best slot and confirm with you via email.
        </p>
      </div>
    </div>
  );
}

// Step 5: Payment
function Step5Payment({
  formData,
  updateField,
  selectedPackage,
}: {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: any) => void;
  selectedPackage: PricingPackage | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Payment & Review
        </h2>
        <p className="text-text-secondary">
          Review your booking details and choose your payment method.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="p-6 bg-background-secondary rounded-lg">
        <h3 className="text-lg font-bold text-text-primary mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">Package:</span>
            <span className="font-semibold text-text-primary">{selectedPackage?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Meeting Type:</span>
            <span className="font-semibold text-text-primary">
              {formData.meetingType === 'GOOGLE_MEET' && 'Google Meet'}
              {formData.meetingType === 'PHONE' && 'Phone Call'}
              {formData.meetingType === 'IN_PERSON' && 'In-Person'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Date & Time:</span>
            <span className="font-semibold text-text-primary">
              {new Date(`${formData.preferredDate}T${formData.preferredTime}`).toLocaleString('en-KE', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
          <div className="border-t border-border pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-text-primary">Total Amount:</span>
              <span className="text-2xl font-bold text-secondary">
                KSH {formData.quotedAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">Includes 16% VAT</p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Payment Method *
        </label>
        <div className="space-y-3">
          <button
            onClick={() => updateField('paymentMethod', 'MPESA')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.paymentMethod === 'MPESA'
                ? 'border-secondary bg-secondary/10'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-semibold text-text-primary">M-Pesa</div>
                  <div className="text-sm text-text-secondary">Pay instantly with M-Pesa STK Push</div>
                </div>
              </div>
              {formData.paymentMethod === 'MPESA' && (
                <Check size={20} className="text-secondary" />
              )}
            </div>
          </button>

          <button
            onClick={() => updateField('paymentMethod', 'BANK_TRANSFER')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.paymentMethod === 'BANK_TRANSFER'
                ? 'border-secondary bg-secondary/10'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏦</div>
                <div>
                  <div className="font-semibold text-text-primary">Bank Transfer</div>
                  <div className="text-sm text-text-secondary">Pay via bank transfer (details in invoice)</div>
                </div>
              </div>
              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <Check size={20} className="text-secondary" />
              )}
            </div>
          </button>

          <button
            onClick={() => updateField('paymentMethod', 'INVOICE_LATER')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.paymentMethod === 'INVOICE_LATER'
                ? 'border-secondary bg-secondary/10'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📄</div>
                <div>
                  <div className="font-semibold text-text-primary">Invoice Me Later</div>
                  <div className="text-sm text-text-secondary">Receive invoice via email, pay within 30 days</div>
                </div>
              </div>
              {formData.paymentMethod === 'INVOICE_LATER' && (
                <Check size={20} className="text-secondary" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* M-Pesa Phone Input */}
      {formData.paymentMethod === 'MPESA' && (
        <Input
          label="M-Pesa Phone Number *"
          type="tel"
          value={formData.mpesaPhone}
          onChange={(e) => updateField('mpesaPhone', e.target.value)}
          required
          placeholder="+254 712 345 678"
          helperText="You'll receive an STK push prompt on this number"
        />
      )}

      <div className="p-4 bg-background-secondary rounded-lg">
        <p className="text-sm text-text-secondary">
          <strong>🔒 Secure Payment:</strong> All transactions are encrypted and secure.
          {formData.paymentMethod === 'MPESA' &&
            ' You will receive a payment prompt on your phone to complete the transaction.'}
          {formData.paymentMethod === 'BANK_TRANSFER' &&
            ' Bank details will be provided in your invoice email.'}
          {formData.paymentMethod === 'INVOICE_LATER' &&
            ' Payment is due within 30 days of invoice date.'}
        </p>
      </div>
    </div>
  );
}

// Step 6: Confirmation
function Step6Confirmation() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
        <Check size={48} className="text-success" />
      </div>
      <h2 className="text-3xl font-sora font-bold text-text-primary mb-4">
        Booking Confirmed!
      </h2>
      <p className="text-lg text-text-secondary mb-6">
        Thank you for booking with VeyraTech. You will receive a confirmation email shortly.
      </p>
      <div className="inline-flex items-center gap-2 text-secondary">
        <Loader2 className="animate-spin" size={20} />
        <span>Redirecting to confirmation page...</span>
      </div>
    </div>
  );
}
