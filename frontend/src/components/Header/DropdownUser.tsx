"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCircleIcon,
  QuestionMarkCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { ROLE_STORAGE_KEY, type Role } from "@/components/Sidebar/navConfig";

const ROLE_PROFILE: Record<Role, { name: string; title: string }> = {
  farmer: { name: "Chanda Mwansa", title: "Farmer" },
  buyer: { name: "Dr. Lweendo Banda", title: "Buyer" },
};

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState<Role>("farmer");
  const router = useRouter();

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (stored === "farmer" || stored === "buyer") setRole(stored);
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const { name, title } = ROLE_PROFILE[role];
  const accountHref = `/${role}/account`;
  const helpHref = `/${role}/help`;

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-[#1B3A2B] dark:text-white">
            {name}
          </span>
          <span className="block text-xs text-[#3B2F22]/50 dark:text-bodydark2">
            {title}
          </span>
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F5F3F] text-sm font-semibold text-white">
          {initials(name)}
        </span>

        <ChevronDownIcon className="hidden h-4 w-4 text-[#3B2F22]/50 sm:block" />
      </button>

      <div
        ref={dropdown}
        className={`absolute right-0 mt-4 flex w-56 flex-col rounded-lg border border-[#8FBF9F]/30 bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-1 border-b border-[#3B2F22]/10 p-3 dark:border-strokedark">
          <li>
            <Link
              href={accountHref}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#3B2F22]/80 hover:bg-[#EAF3DE] hover:text-[#1B3A2B] dark:text-bodydark2"
            >
              <UserCircleIcon className="h-5 w-5" />
              My Account
            </Link>
          </li>
          <li>
            <Link
              href={helpHref}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#3B2F22]/80 hover:bg-[#EAF3DE] hover:text-[#1B3A2B] dark:text-bodydark2"
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              Help
            </Link>
          </li>
        </ul>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-[#3B2F22]/80 hover:text-[#A32D2D] dark:text-bodydark2"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default DropdownUser;