import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const fallbackDeploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const requestHost =
    forwardedHost ?? requestHeaders.get("host")?.split(",")[0]?.trim();
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol ??
    (requestHost?.startsWith("localhost") ||
    requestHost?.startsWith("127.0.0.1")
      ? "http"
      : "https");

  let metadataOrigin = fallbackDeploymentUrl;
  if (requestHost) {
    try {
      metadataOrigin = new URL(`${protocol}://${requestHost}`).origin;
    } catch {
      metadataOrigin = fallbackDeploymentUrl;
    }
  }

  const socialImageUrl = new URL("/og.png", metadataOrigin).toString();

  return {
    metadataBase: new URL(metadataOrigin),
    title: {
      default: "UXR Internship Handoff",
      template: "%s · Julio Caggiano",
    },
    description: "A private Root UX Research internship handoff.",
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    openGraph: {
      title: "UX Research Internship Handoff",
      description: "A private Root research handoff.",
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: "UX Research Internship Handoff",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "UX Research Internship Handoff",
      description: "A private Root research handoff.",
      images: [socialImageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
