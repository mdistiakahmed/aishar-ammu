import type { Metadata } from "next";
import { HomeAuthUpgrade } from "@/components/homepage/HomeAuthUpgrade";
import { HomePageForGuest } from "@/components/homepage/HomePageForGuest";
import { brand, tagline } from "@/lib/constants";

export const metadata: Metadata = {
  title: brand,
  description: `${tagline}. Educational care reading for pregnancy, mother, and baby. Not medical advice.`,
};

export default function Home() {
  return (
    <div id="home">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/blur-mother-child.PNG')" }}
      />
      <div className="relative z-10">
        <HomeAuthUpgrade>
          <HomePageForGuest />
        </HomeAuthUpgrade>
      </div>
    </div>
  );
}
