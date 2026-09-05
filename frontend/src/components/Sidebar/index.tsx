"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { getNavForRole } from "./navConfig";
import { useAuth } from "../../lib/auth/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

function isChildActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Real role from the logged-in user. AuthGate (app/farmer/layout.tsx,
  // app/buyer/layout.tsx) guarantees `user` is set and matches the current
  // section before this ever renders, so this fallback is just for the
  // brief instant before that check resolves.
  const role = user?.role === "BUYER" ? "buyer" : "farmer";

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const navSections = getNavForRole(role);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gradient-to-b from-[#1B3A2B] to-[#14261C] duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9A441] text-sm font-bold text-[#1B3A2B]">
            A
          </span>
          <span className="font-display text-lg font-semibold text-[#FAF7EE]">
            AgriVerse
          </span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block text-[#EAF6EC]/70 hover:text-white lg:hidden"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-6 lg:px-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-[#8FBF9F]/70">
                {section.title.toUpperCase()}
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  if (item.children) {
                    const active = item.children.some((c) =>
                      isChildActive(c.href, pathname),
                    );

                    return (
                      <SidebarLinkGroup
                        key={item.label}
                        activeCondition={active}
                      >
                        {(handleClick, open) => (
                          <React.Fragment>
                            <Link
                              href="#"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-[#EAF6EC]/80 duration-200 ease-in-out hover:bg-[#2F5F3F] hover:text-white ${
                                active && "bg-[#2F5F3F] text-white"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <Icon className="h-5 w-5 shrink-0" />
                              {item.label}
                              <ChevronDownIcon
                                className={`absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform ${
                                  open && "rotate-180"
                                }`}
                              />
                            </Link>

                            <div
                              className={`translate transform overflow-hidden ${
                                !open && "hidden"
                              }`}
                            >
                              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                {item.children!.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-[#EAF6EC]/60 duration-200 ease-in-out hover:text-white ${
                                        isChildActive(child.href, pathname) &&
                                        "text-white"
                                      }`}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </React.Fragment>
                        )}
                      </SidebarLinkGroup>
                    );
                  }

                  const active = item.href
                    ? isChildActive(item.href, pathname)
                    : false;

                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href ?? "#"}
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-[#EAF6EC]/80 duration-200 ease-in-out hover:bg-[#2F5F3F] hover:text-white ${
                          active && "bg-[#2F5F3F] text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#8FBF9F]/20 px-4 py-4 lg:px-6">
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="group flex w-full items-center gap-2.5 rounded-md px-4 py-2 font-medium text-[#EAF6EC]/80 transition-colors hover:bg-[#2F5F3F] hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
