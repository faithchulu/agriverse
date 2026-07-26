import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

// Heroicons v2 exports icons as ForwardRefExoticComponent, not a plain
// ComponentType — this alias matches their real shape (same fix as
// components/Sidebar/navConfig.ts).
type HeroIcon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  icon: HeroIcon;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  icon: Icon,
}) => {
  return (
    <div className="rounded-lg border border-[#8FBF9F]/30 bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3DE] dark:bg-[#2F5F3F]/30">
        <Icon className="h-5 w-5 text-[#2F5F3F] dark:text-[#8FBF9F]" />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-[#1B3A2B] dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium text-[#3B2F22]/60 dark:text-bodydark2">
            {title}
          </span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp ? "text-[#2F5F3F]" : ""
          } ${levelDown ? "text-[#A32D2D]" : ""}`}
        >
          {rate}
          {levelUp && <ArrowTrendingUpIcon className="h-3.5 w-3.5" />}
          {levelDown && <ArrowTrendingDownIcon className="h-3.5 w-3.5" />}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;