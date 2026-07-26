import React from "react";

type InterestAction = "viewed" | "purchased" | "saved" | "inquired";

interface BuyerInterest {
  id: string;
  buyerName: string;
  action: InterestAction;
  datasetTitle: string;
  minutesAgo: number;
  isNew: boolean;
}

// TODO: replace with `const { data } = await axios.get("/api/farmer/buyer-interest")`
const interestFeed: BuyerInterest[] = [
  {
    id: "int_001",
    buyerName: "GreenGrain Research Co.",
    action: "purchased",
    datasetTitle: "Maize soil moisture",
    minutesAgo: 18,
    isNew: true,
  },
  {
    id: "int_002",
    buyerName: "AgriSeed Labs",
    action: "viewed",
    datasetTitle: "Soybean pest incidence log",
    minutesAgo: 45,
    isNew: true,
  },
  {
    id: "int_003",
    buyerName: "Kalundu Agri University",
    action: "saved",
    datasetTitle: "Cassava root growth data",
    minutesAgo: 120,
    isNew: false,
  },
  {
    id: "int_004",
    buyerName: "Highveld Seed Traders",
    action: "inquired",
    datasetTitle: "Sorghum drought trial",
    minutesAgo: 340,
    isNew: false,
  },
  {
    id: "int_005",
    buyerName: "FarmTech Analytics",
    action: "viewed",
    datasetTitle: "Hybrid wheat yield records",
    minutesAgo: 480,
    isNew: false,
  },
];

const ACTION_LABEL: Record<InterestAction, string> = {
  viewed: "viewed",
  purchased: "purchased",
  saved: "saved",
  inquired: "asked about",
};

const ACTION_DOT: Record<InterestAction, string> = {
  viewed: "bg-[#8FBF9F]",
  purchased: "bg-[#2F5F3F]",
  saved: "bg-[#D9A441]",
  inquired: "bg-[#0C447C]",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTimeAgo(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

const RecentBuyerInterest: React.FC = () => {
  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-[#1B3A2B] dark:text-white">
        Recent buyer interest
      </h4>

      <div>
        {interestFeed.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-7.5 py-3 hover:bg-[#EAF3DE]/60 dark:hover:bg-meta-4"
          >
            <div className="relative h-11 w-11 shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3DE] text-xs font-semibold text-[#2F5F3F] dark:bg-[#2F5F3F]/30 dark:text-[#8FBF9F]">
                {initials(item.buyerName)}
              </div>
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-boxdark ${
                  ACTION_DOT[item.action]
                }`}
              />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-[#1B3A2B] dark:text-white">
                  {item.buyerName}
                </h5>
                <p className="text-xs text-[#3B2F22]/60 dark:text-bodydark2">
                  {ACTION_LABEL[item.action]} "{item.datasetTitle}"
                  <span className="text-[#3B2F22]/40"> · {formatTimeAgo(item.minutesAgo)}</span>
                </p>
              </div>
              {item.isNew && (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F5F3F]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBuyerInterest;
