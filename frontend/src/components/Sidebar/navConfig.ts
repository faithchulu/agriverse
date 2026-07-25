import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import {
  HomeIcon,
  CircleStackIcon,
  BanknotesIcon,
  StarIcon,
  WalletIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

export type Role = "farmer" | "buyer";

export const ROLE_STORAGE_KEY = "agriverse_demo_role";

// Heroicons v2 exports icons as ForwardRefExoticComponent, not a plain
// ComponentType — this alias matches their real shape so TS stops
// complaining about the `ref` prop.
export type HeroIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>
>;

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  icon: HeroIcon;
  children?: NavChild[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const farmerNav: NavSection[] = [
  {
    title: "Farmer tools",
    items: [
      { label: "Dashboard", href: "/farmer/dashboard", icon: HomeIcon },
      {
        label: "My data",
        icon: CircleStackIcon,
        children: [
          { label: "Upload dataset", href: "/farmer/datasets/upload" },
          { label: "My listings", href: "/farmer/datasets/listings" },
        ],
      },
      {
        label: "Sales",
        icon: BanknotesIcon,
        children: [
          { label: "Transaction history", href: "/farmer/sales/transactions" },
          { label: "Payouts", href: "/farmer/sales/payouts" },
        ],
      },
      { label: "Reputation", href: "/farmer/reputation", icon: StarIcon },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Wallet", href: "/farmer/wallet", icon: WalletIcon },
      { label: "Account", href: "/farmer/account", icon: UserCircleIcon },
      { label: "Help", href: "/farmer/help", icon: QuestionMarkCircleIcon },
    ],
  },
];

export const buyerNav: NavSection[] = [
  {
    title: "Buyer tools",
    items: [
      { label: "Dashboard", href: "/buyer/dashboard", icon: HomeIcon },
      {
        label: "Marketplace",
        href: "/buyer/marketplace",
        icon: ShoppingBagIcon,
      },
      {
        label: "My purchases",
        icon: ArchiveBoxIcon,
        children: [
          { label: "Purchase history", href: "/buyer/purchases/history" },
          { label: "Active licenses", href: "/buyer/purchases/licenses" },
        ],
      },
      {
        label: "Transactions",
        href: "/buyer/transactions",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Wallet", href: "/buyer/wallet", icon: WalletIcon },
      { label: "Account", href: "/buyer/account", icon: UserCircleIcon },
      { label: "Help", href: "/buyer/help", icon: QuestionMarkCircleIcon },
    ],
  },
];

export function getNavForRole(role: Role): NavSection[] {
  return role === "farmer" ? farmerNav : buyerNav;
}