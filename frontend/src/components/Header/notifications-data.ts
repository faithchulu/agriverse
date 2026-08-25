import {
  BanknotesIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

// Heroicons v2 exports icons as ForwardRefExoticComponent, not a plain
// ComponentType — this alias matches their real shape (same fix as
// components/Sidebar/navConfig.ts and components/CardDataStats.tsx).
type HeroIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>
>;

export interface HeaderNotification {
  id: string;
  icon: HeroIcon;
  text: string;
  time: string;
}

// TODO: replace with `const { data } = await axios.get("/api/notifications")`
export const farmerNotifications: HeaderNotification[] = [
  {
    id: "n1",
    icon: BanknotesIcon,
    text: "AgriSeed Labs purchased your Maize soil moisture dataset",
    time: "2 hours ago",
  },
  {
    id: "n2",
    icon: ExclamationTriangleIcon,
    text: "Highveld Seed Traders raised a dispute on Cassava root growth data",
    time: "5 hours ago",
  },
  {
    id: "n3",
    icon: StarIcon,
    text: "Kalundu Agri University left a 5-star review",
    time: "1 day ago",
  },
  {
    id: "n4",
    icon: BanknotesIcon,
    text: "Payout of $250.00 was completed",
    time: "2 days ago",
  },
];

export const buyerNotifications: HeaderNotification[] = [
  {
    id: "n1",
    icon: BanknotesIcon,
    text: "Your purchase of Rice paddy nitrogen levels is confirmed",
    time: "3 hours ago",
  },
  {
    id: "n2",
    icon: ClockIcon,
    text: "Maize soil moisture access expires in 11 days",
    time: "2 days ago",
  },
  {
    id: "n3",
    icon: ExclamationTriangleIcon,
    text: "Your dispute on Rice paddy nitrogen levels is under review",
    time: "1 day ago",
  },
  {
    id: "n4",
    icon: SparklesIcon,
    text: "New dataset matching your interests: Groundnut soil nutrient survey",
    time: "3 days ago",
  },
];