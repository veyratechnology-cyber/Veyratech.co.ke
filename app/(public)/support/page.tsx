"use client";

import React, { useState } from "react";
import { Button, Input, Textarea, Alert } from "@/components/shared";
import { Mail, Phone, Clock, CheckCircle, Send } from "lucide-react";

/**
 * Client Support Page
 * For existing VeyraTech clients to get help
 */
export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    priority: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: `[SUPPORT - ${formData.priority.toUpperCase()}] ${formData.subject}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Support request submitted! We'll respond based on the priority level.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
          priority: "normal",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: "Failed to submit request. Please email us directly at support@veyratech.co.ke",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please email us at support@veyratech.co.ke",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              Client Support
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              We're here to help! Get support for your VeyraTech services and projects.
            </p>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-sora font-bold text-center mb-12">
              Our Response Times
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-primary rounded-xl p-6 border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-red-500" size={28} />
                </div>
                <h3 className="font-sora font-bold text-lg mb-2">Critical</h3>
                <p className="text-text-primary text-2xl font-bold mb-2">2-4 hours</p>
                <p className="text-text-muted text-sm">System down, data loss</p>
              </div>

              <div className="bg-primary rounded-xl p-6 border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-orange-500" size={28} />
                </div>
                <h3 className="font-sora font-bold text-lg mb-2">High</h3>
                <p className="text-text-primary text-2xl font-bold mb-2">Same day</p>
                <p className="text-text-muted text-sm">Major functionality broken</p>
              </div>

              <div className="bg-primary rounded-xl p-6 border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-secondary" size={28} />
                </div>
                <h3 className="font-sora font-bold text-lg mb-2">Normal</h3>
                <p className="text-text-primary text-2xl font-bold mb-2">24 hours</p>
                <p className="text-text-muted text-sm">General questions, minor issues</p>
              </div>

              <div className="bg-primary rounded-xl p-6 border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-blue-500" size={28} />
                </div>
                <h3 className="font-sora font-bold text-lg mb-2">Low</h3>
                <p className="text-text-primary text-2xl font-bold mb-2">48 hours</p>
                <p className="text-text-muted text-sm">Feature requests, enhancements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-sora font-bold mb-6">
                  Get Support
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Mail className="text-secondary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <a
                        href="mailto:support@veyratech.co.ke"
                        className="text-secondary hover:underline block mb-1"
                      >
                        support@veyratech.co.ke
                      </a>
                      <p className="text-text-muted text-sm">For technical issues and questions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Phone className="text-secondary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Phone Support</h3>
                      <a
                        href="tel:+254745247211"
                        className="text-secondary hover:underline block mb-1"
                      >
                        +254 745 247 211
                      </a>
                      <p className="text-text-muted text-sm">Mon-Fri, 9 AM - 6 PM EAT</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary-dark rounded-xl border border-border">
                  <h3 className="font-sora font-semibold mb-3">
                    Before You Contact Us
                  </h3>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <span>Check if the issue is resolved by refreshing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <span>Include error messages or screenshots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <span>Describe steps to reproduce the issue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <span>Include relevant URLs or project names</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support Form */}
              <div className="lg:col-span-2">
                <div className="bg-primary-dark rounded-xl p-8 shadow-sm border border-border">
                  <h2 className="text-2xl font-sora font-bold mb-6">
                    Submit Support Request
                  </h2>

                  {submitStatus && (
                    <div className="mb-6">
                      <Alert
                        type={submitStatus.type}
                        message={submitStatus.message}
                        dismissible
                        onDismiss={() => setSubmitStatus(null)}
                      />
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                      <Input
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                      />
                      <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      >
                        <option value="low">Low - Feature request or enhancement</option>
                        <option value="normal">Normal - General question or minor issue</option>
                        <option value="high">High - Major functionality broken</option>
                        <option value="critical">Critical - System down or data loss</option>
                      </select>
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief description of your issue"
                    />

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Describe Your Issue
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Please provide as much detail as possible, including:
- What you were trying to do
- What happened instead
- Any error messages
- Steps to reproduce the issue"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send size={20} />
                          Submit Support Request
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
