import type { Metadata } from "next";
import { HomePage } from "./site-components";

export const metadata: Metadata = {
  title: "Root UX Research Onboarding",
  description:
    "The onboarding playbook and operating manual for Root UX Research.",
  openGraph: {
    title: "Root UX Research Onboarding",
    description:
      "A practical guide to the people, practices, programs, and resources behind research at Root.",
    images: ["/og.png"],
  },
};

export default function Home() {
  return <HomePage />;
}
