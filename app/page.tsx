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
      <HomeAuthUpgrade>
        <HomePageForGuest />
      </HomeAuthUpgrade>
    </div>
  );
}
