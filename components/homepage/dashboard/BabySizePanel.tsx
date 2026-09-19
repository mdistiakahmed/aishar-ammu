"use client";

import { useState } from "react";
import {
  babySizeAge,
  babySizeImageSrc,
  formatBabyAge,
  getBabySizeWeek,
  produceWithArticle,
} from "@/lib/baby-size";
import type { PregnancySnapshot } from "@/lib/pregnancy";
import { PanelCard } from "@/components/homepage/dashboard/PanelCard";

export function BabySizePanel({ snapshot }: { snapshot: PregnancySnapshot }) {
  const { week, day } = babySizeAge(snapshot.week, snapshot.day);
  const size = getBabySizeWeek(week);
  const age = formatBabyAge(week, day);
  const produce = produceWithArticle(size.produceName);

  return (
    <PanelCard eyebrow="Size" title={age}>
      <p className="mt-2 text-sm leading-6 text-rose-900/75">
        About the size of {produce} this week. Educational comparison only, not a scan measurement.
      </p>
      <ProduceImage imageName={size.imageName} produceName={produce} />
    </PanelCard>
  );
}

function ProduceImage({ imageName, produceName }: { imageName: string; produceName: string }) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="mt-4 flex min-h-40 items-center justify-center rounded-2xl border border-rose-100 bg-petal px-4 py-5">
      {missing ? (
        <p className="text-center text-sm text-rose-900/70">
          Image coming soon
          <span className="mt-1 block font-medium text-rose-950">{imageName}</span>
        </p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={babySizeImageSrc(imageName)}
          alt={`About the size of ${produceName}`}
          className="max-h-40 w-full object-contain"
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
