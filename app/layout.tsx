import type { Metadata } from "next";
import "./globals.css";

const deploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: {
    default: "Root UX Research Onboarding",
    template: "%s · Root UX Research",
  },
  description:
    "The onboarding playbook and operating manual for Root UX Research.",
  openGraph: {
    title: "Root UX Research Onboarding",
    description:
      "The onboarding playbook and operating manual for Root UX Research.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Root UX Research Onboarding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Root UX Research Onboarding",
    description:
      "The onboarding playbook and operating manual for Root UX Research.",
    images: ["/og.png"],
  },
};

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
