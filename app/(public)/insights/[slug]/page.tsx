import React from "react";
import StructuredData from "@/components/seo/StructuredData";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { sanitizeRichHtml } from "@/lib/admin/sanitize";
import { Button, Badge } from "@/components/shared";
import { getPublishedInsightBySlug } from "@/lib/db/queries";
import { INSIGHT_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const insight = await getPublishedInsightBySlug(params.slug);
    if (insight) {
      return {
        title: insight.seoTitle || insight.title,
        description: insight.seoDescription || insight.excerpt || insight.title,
        openGraph: {
          type: "article",
          title: insight.seoTitle || insight.title,
          description: insight.seoDescription || insight.excerpt || insight.title,
          url: `/insights/${insight.slug}`,
          publishedTime: insight.publishedAt?.toISOString(),
          modifiedTime: insight.updatedAt?.toISOString(),
          ...(insight.featuredImage ? { images: [insight.featuredImage] } : {}),
        },
      };
    }
  } catch (error) {}
  return { title: "Insight" };
}

export default async function InsightDetailPage({ params }: Props) {
  let insight = null;
  try {
    insight = await getPublishedInsightBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!insight) {
    notFound();
  }

  const categoryLabel = INSIGHT_CATEGORIES.find(
    (c) => c.value === insight.category
  )?.label;

  return (
    <>
      <StructuredData
        data={generateArticleSchema({
          title: insight.title,
          description: insight.seoDescription || insight.excerpt || insight.title,
          url: `/insights/${insight.slug}`,
          publishedAt: insight.publishedAt || insight.createdAt,
          modifiedAt: insight.updatedAt,
          author: insight.author?.name || "VeyraTech",
          category: String(insight.category).replace(/_/g, " "),
        })}
      />
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
          { name: insight.title, url: `/insights/${insight.slug}` },
        ])}
      />
      {/* Back Navigation */}
      <section className="py-6 border-b border-white/10">
        <div className="container-custom">
          <Button href="/insights" variant="ghost" size="sm">
              <ArrowLeft size={16} />
              Back to Insights
            </Button>
        </div>
      </section>

      {/* Article Header */}
      <section className="section">
        <div className="container-custom">
          <article className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge variant="info">{categoryLabel}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              {insight.title}
            </h1>
            {insight.excerpt && (
              <p className="text-xl text-text-secondary mb-6 leading-relaxed">
                {insight.excerpt}
              </p>
            )}
            <div className="flex items-center gap-6 text-text-secondary pb-8 border-b border-white/10">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="font-medium">{insight.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{formatDate(insight.publishedAt!)}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Featured Image */}
      {insight.featuredImage && (
        <section>
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden">
                <img
                  src={insight.featuredImage}
                  alt={insight.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="section">
        <div className="container-custom">
          <article className="max-w-4xl mx-auto">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(insight.content) }}
            />
          </article>
        </div>
      </section>

      {/* Tags */}
      {insight.tags && insight.tags.length > 0 && (
        <section className="py-8 bg-primary-dark">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-secondary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Need Help With Your Technology Strategy?
            </h2>
            <p className="text-xl mb-8 text-text-secondary">
              Let's discuss how RoyalTech can help your organization.
            </p>
            <Button href="/book-consultation" variant="primary" size="lg">
                Book a Consultation
              </Button>
          </div>
        </div>
      </section>
    </>
  );
}
