import type { Metadata } from "next";
import { LandingClient } from "@/components/landing/LandingClient";

export const metadata: Metadata = {
  title: "Moodly · Landing",
  description: "Moodly 居家靈感與設計摘要",
};

export default function LandingPage() {
  return <LandingClient />;
}
