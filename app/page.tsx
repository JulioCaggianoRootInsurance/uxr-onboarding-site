import type { Metadata } from "next";
import { requireHandoffSession } from "@/auth";
import { HomePage } from "./site-components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Julio Caggiano · UX Research Internship Handoff",
  description:
    "A private, manager-facing record of Julio Caggiano’s UX Research internship work.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "UX Research Internship Handoff",
    description: "A private Root research handoff.",
    images: ["/og.png"],
  },
};

export default async function Home() {
  await requireHandoffSession("/");
  return <HomePage />;
}
