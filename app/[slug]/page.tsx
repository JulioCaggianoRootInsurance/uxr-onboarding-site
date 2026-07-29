import type { Metadata } from "next";
import { requireHandoffSession } from "@/auth";
import { notFound } from "next/navigation";
import { getHandoffPage } from "../handoff";
import { ArticlePage } from "../site-components";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getHandoffPage(slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.summary,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function HandoffArticle({ params }: PageProps) {
  const { slug } = await params;
  const page = getHandoffPage(slug);

  if (!page) notFound();

  await requireHandoffSession(`/${slug}`);

  return <ArticlePage page={page} />;
}
