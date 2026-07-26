import React from "react";
import {
  BanknotesIcon,
  ExclamationTriangleIcon,
  StarIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

type ActivityType = "sale" | "payout" | "dispute" | "review" | "upload";

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timeAgo: string;
}

// TODO: replace with `const { data } = await axios.get("/api/farmer/activity")`
const activity: ActivityItem[] = [
  {
    id: "act_001",
    type: "sale",
    description:
      "AgriSeed Labs purchased \"Maize soil moisture - Eastern Province\"",
    timeAgo: "2 hours ago",
  },
  {
    id: "act_002",
    type: "dispute",
    description:
      "Highveld Seed Traders raised a dispute on \"Cassava root growth sensor data\"",
    timeAgo: "5 hours ago",
  },
  {
    id: "act_003",
    type: "review",
    description: "Kalundu Agri University left a 5-star review",
    timeAgo: "1 day ago",
  },
  {
    id: "act_004",
    type: "payout",
    description: "Payout of $250.00 was completed",
    timeAgo: "2 days ago",
  },
  {
    id: "act_005",
    type: "upload",
    description: "You published \"Soybean pest incidence log - Copperbelt\"",
    timeAgo: "3 days ago",
  },
];

const STYLES: Record<
  ActivityType,
  { icon: typeof BanknotesIcon; bg: string; fg: string }
> = {
  sale: { icon: BanknotesIcon, bg: "bg-[#EAF3DE]", fg: "text-[#2F5F3F]" },
  payout: { icon: BanknotesIcon, bg: "bg-[#FAEEDA]", fg: "text-[#854F0B]" },
  dispute: {
    icon: ExclamationTriangleIcon,
    bg: "bg-[#FCEBEB]",
    fg: "text-[#A32D2D]",
  },
  review: { icon: StarIcon, bg: "bg-[#FAEEDA]", fg: "text-[#854F0B]" },
  upload: { icon: CloudArrowUpIcon, bg: "bg-[#E6F1FB]", fg: "text-[#0C447C]" },
};

const RecentActivity: React.FC = () => {
  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-7.5 py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-4 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Recent activity
      </h4>

      <ul className="flex flex-col gap-4">
        {activity.map((item) => {
          const { icon: Icon, bg, fg } = STYLES[item.type];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}
              >
                <Icon className={`h-4.5 w-4.5 ${fg}`} />
              </span>
              <div>
                <p className="text-sm text-[#1B3A2B] dark:text-white">
                  {item.description}
                </p>
                <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                  {item.timeAgo}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentActivity;
