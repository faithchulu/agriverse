import {
  BanknotesIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export type NotificationType =
  | "sale"
  | "dispute"
  | "review"
  | "payout"
  | "expiry"
  | "recommendation";

export interface HeaderNotification {
  id: string;
  type: NotificationType;
  text: string;
  time: string;
}

// Maps notification types to icons and optional styles
export const NOTIFICATION_STYLES: Record<
  NotificationType,
  {
    icon: typeof BanknotesIcon;
    bg: string;
    fg: string;
  }
> = {
  sale: {
    icon: BanknotesIcon,
    bg: "bg-[#EAF3DE]",
    fg: "text-[#2F5F3F]",
  },
  payout: {
    icon: BanknotesIcon,
    bg: "bg-[#FAEEDA]",
    fg: "text-[#854F0B]",
  },
  dispute: {
    icon: ExclamationTriangleIcon,
    bg: "bg-[#FCEBEB]",
    fg: "text-[#A32D2D]",
  },
  review: {
    icon: StarIcon,
    bg: "bg-[#FAEEDA]",
    fg: "text-[#854F0B]",
  },
  expiry: {
    icon: ClockIcon,
    bg: "bg-[#E6F1FB]",
    fg: "text-[#0C447C]",
  },
  recommendation: {
    icon: SparklesIcon,
    bg: "bg-[#EAF3DE]",
    fg: "text-[#2F5F3F]",
  },
};

// TODO: replace with `const { data } = await axios.get("/api/notifications")`
export const farmerNotifications: HeaderNotification[] = [
  {
    id: "n1",
    type: "sale",
    text: "AgriSeed Labs purchased your Maize soil moisture dataset",
    time: "2 hours ago",
  },
  {
    id: "n2",
    type: "dispute",
    text: "Highveld Seed Traders raised a dispute on Cassava root growth data",
    time: "5 hours ago",
  },
  {
    id: "n3",
    type: "review",
    text: "Kalundu Agri University left a 5-star review",
    time: "1 day ago",
  },
  {
    id: "n4",
    type: "payout",
    text: "Payout of $250.00 was completed",
    time: "2 days ago",
  },
];

export const buyerNotifications: HeaderNotification[] = [
  {
    id: "n1",
    type: "sale",
    text: "Your purchase of Rice paddy nitrogen levels is confirmed",
    time: "3 hours ago",
  },
  {
    id: "n2",
    type: "expiry",
    text: "Maize soil moisture access expires in 11 days",
    time: "2 days ago",
  },
  {
    id: "n3",
    type: "dispute",
    text: "Your dispute on Rice paddy nitrogen levels is under review",
    time: "1 day ago",
  },
  {
    id: "n4",
    type: "recommendation",
    text: "New dataset matching your interests: Groundnut soil nutrient survey",
    time: "3 days ago",
  },
];