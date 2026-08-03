"use client";

import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Sidebar toggle */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-md border border-[#8FBF9F]/40 bg-white p-1.5 text-[#2F5F3F] shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-white lg:hidden"
          >
            {props.sidebarOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>

          <Link className="flex flex-shrink-0 items-center gap-2 lg:hidden" href="/">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9A441] text-sm font-bold text-[#1B3A2B]">
              A
            </span>
          </Link>
        </div>

        {/* Spacer where the search bar used to sit — keeps the right-hand
            cluster pinned right on wider screens */}
        <div className="hidden sm:block" />

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
          </ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;