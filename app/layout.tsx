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
    default: "UXR Internship Handoff",
    template: "%s · Julio Caggiano",
  },
  description:
    "A private Root UX Research internship handoff.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "UXR Internship Handoff",
    description: "A private Root research handoff.",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "UXR Internship Handoff",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UXR Internship Handoff",
    description: "A private Root research handoff.",
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
