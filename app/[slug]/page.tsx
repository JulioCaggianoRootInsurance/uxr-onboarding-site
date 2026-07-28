import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOnboardingPage, onboardingPages } from "../onboarding";
import { ArticlePage } from "../site-components";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return onboardingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getOnboardingPage(slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.summary,
  };
}

export default async function OnboardingArticle({ params }: PageProps) {
  const { slug } = await params;
  const page = getOnboardingPage(slug);

  if (!page) notFound();

  return <ArticlePage page={page} />;
}
