import type { IconType } from "react-icons";
import {
  LuActivity,
  LuBaby,
  LuBatteryLow,
  LuBed,
  LuBone,
  LuBrain,
  LuCircle,
  LuDroplet,
  LuDroplets,
  LuFlame,
  LuFootprints,
  LuFrown,
  LuHeart,
  LuHouse,
  LuMeh,
  LuMoon,
  LuSmile,
  LuSun,
  LuTimer,
  LuUtensils,
  LuUtensilsCrossed,
  LuWaves,
  LuWind,
} from "react-icons/lu";
import {
  motherChangeBulletsForWeek,
  type MotherChangeIcon,
} from "@/lib/mother-change-bullets";

const icons: Record<MotherChangeIcon, IconType> = {
  activity: LuActivity,
  baby: LuBaby,
  battery: LuBatteryLow,
  bed: LuBed,
  bone: LuBone,
  brain: LuBrain,
  circle: LuCircle,
  droplet: LuDroplet,
  droplets: LuDroplets,
  flame: LuFlame,
  foot: LuFootprints,
  frown: LuFrown,
  heart: LuHeart,
  house: LuHouse,
  meh: LuMeh,
  moon: LuMoon,
  smile: LuSmile,
  sun: LuSun,
  timer: LuTimer,
  utensils: LuUtensils,
  utensilsOff: LuUtensilsCrossed,
  waves: LuWaves,
  wind: LuWind,
};

export function MotherChangeBullets({ week }: { week: number }) {
  const items = motherChangeBulletsForWeek(week);

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4">
      {items.map((item) => {
        const Icon = icons[item.icon];
        return (
          <li key={`${item.icon}-${item.label}`} className="flex min-w-0 items-center gap-2">
            <Icon className="h-5 w-5 shrink-0 text-[#4a5560]" aria-hidden="true" />
            <span className="font-bn text-sm font-medium leading-snug text-ink">{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
