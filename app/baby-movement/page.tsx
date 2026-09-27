import type { Metadata } from "next";
import { BabyMovementTracker } from "./BabyMovementTracker";

export const metadata: Metadata = {
  title: "Baby Movement Tracker",
  description: "Count sets of baby movement and keep a daily tally in this browser.",
};

export default function BabyMovementPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <BabyMovementTracker />
    </article>
  );
}
