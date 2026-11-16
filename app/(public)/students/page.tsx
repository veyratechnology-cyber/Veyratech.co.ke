import Link from "next/link";
import { GraduationCap, Users, Award, CheckCircle, ArrowRight, Laptop, Clock, Target } from "lucide-react";

export const metadata = {
  title: "Learning & Mentorship | VeyraTech",
  description: "Join VeyraTech Learning & Mentorship programme. Learn software development with hands-on projects, personalized mentorship, and practical skills.",
};

export default function StudentsPage() {
  const programmes = [
    {
      id: "web-dev-fundamentals",
      name: "Web Development Fundamentals",
      duration: "12 weeks",
      level: "Beginner",
      description: "Master HTML, CSS, JavaScript, and modern web development. Build real-world projects and launch your tech career.",
      objectives: [
        "Build responsive websites from scratch",
        "Master JavaScript and modern frameworks",
        "Create interactive web applications",
        "Deploy projects to production",
      ],
    },
  ];

  const benefits = [
    {
      icon: <Laptop className="w-8 h-8" />,
      title: "Hands-On Learning",
      description: "Build real projects, not just theory. Every module includes practical assignments.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Mentorship",
      description: "Get one-on-one guidance from experienced developers who care about your success.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Schedule",
      description: "Learn at your own pace with self-paced modules and scheduled mentorship sessions.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Career-Focused",
      description: "Develop skills that employers actually want. Build a portfolio that gets you hired.",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Apply",
      description: "Fill out our simple application form. Tell us about yourself and your goals.",
    },
    {
      step: "2",
      title: "Review",
      description: "Our team reviews your application within 3-5 business days.",
    },
    {
      step: "3",
      title: "Admission",
      description: "If accepted, you'll receive an email with account activation instructions.",
    },
    {
      step: "4",
      title: "Start Learning",
      description: "Activate your account, set your password, and begin your learning journey immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-text-primary py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <GraduationCap className="w-16 h-16 text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              VeyraTech Learning &<br />Mentorship Programme
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8">
              Learn software development with hands-on projects, personalized mentorship, and practical skills that launch careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/students/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/students/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-lg border-2 border-text-primary/20 transition-colors"
              >
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose VeyraTech Learning?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We combine expert instruction, practical projects, and personalized mentorship to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-xl border border-border hover:border-secondary/50 transition-colors"
              >
                <div className="text-secondary mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Available Programmes
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Comprehensive learning paths designed to take you from beginner to professional.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {programmes.map((programme) => (
              <div
                key={programme.id}
                className="bg-background-light p-8 rounded-xl border border-border"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                      {programme.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                        <Clock className="w-4 h-4 mr-1" />
                        {programme.duration}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-text-primary rounded-full">
                        {programme.level}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-text-secondary mb-6">{programme.description}</p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-text-primary mb-3">
                    What You'll Learn:
                  </h4>
                  <ul className="space-y-2">
                    {programme.objectives.map((objective, index) => (
                      <li
                        key={index}
                        className="flex items-start text-text-secondary"
                      >
                        <CheckCircle className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/students/apply"
                  className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors"
                >
                  Apply for This Programme
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How to Apply
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Our application process is simple and straightforward. Here's what to expect.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 text-white text-2xl font-bold rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/students/apply"
              className="inline-flex items-center px-8 py-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Start Your Application
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-background-light p-6 rounded-lg border border-border">
              <summary className="font-semibold text-text-primary cursor-pointer">
                Is there any cost to join?
              </summary>
              <p className="mt-4 text-text-secondary">
                No! This programme is completely free. We believe in making quality tech education accessible to everyone.
              </p>
            </details>

            <details className="bg-background-light p-6 rounded-lg border border-border">
              <summary className="font-semibold text-text-primary cursor-pointer">
                Do I need prior programming experience?
              </summary>
              <p className="mt-4 text-text-secondary">
                No prior experience required for beginner programmes. We start from the fundamentals and build up your skills progressively.
              </p>
            </details>

            <details className="bg-background-light p-6 rounded-lg border border-border">
              <summary className="font-semibold text-text-primary cursor-pointer">
                What equipment do I need?
              </summary>
              <p className="mt-4 text-text-secondary">
                You need a laptop or desktop computer with internet access. We'll guide you through installing all necessary software (all free).
              </p>
            </details>

            <details className="bg-background-light p-6 rounded-lg border border-border">
              <summary className="font-semibold text-text-primary cursor-pointer">
                How much time should I dedicate per week?
              </summary>
              <p className="mt-4 text-text-secondary">
                We recommend 10-15 hours per week for optimal progress. This includes studying lessons, working on assignments, and mentorship sessions.
              </p>
            </details>

            <details className="bg-background-light p-6 rounded-lg border border-border">
              <summary className="font-semibold text-text-primary cursor-pointer">
                Will I receive a certificate?
              </summary>
              <p className="mt-4 text-text-secondary">
                Yes! Upon successfully completing the programme, you'll receive a VeyraTech certificate of completion.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-text-primary">
        <div className="container mx-auto px-6 text-center">
          <Award className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Join hundreds of students learning to code with VeyraTech. Your future in tech starts here.
          </p>
          <Link
            href="/students/apply"
            className="inline-flex items-center px-8 py-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Apply Now - It's Free!
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
