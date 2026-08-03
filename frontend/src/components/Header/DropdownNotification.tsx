"use client";

import { useEffect, useRef, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  ROLE_STORAGE_KEY,
  type Role,
} from "@/components/Sidebar/navConfig";
import { farmerNotifications, buyerNotifications, NOTIFICATION_STYLES } from "./notifications-data";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [role, setRole] = useState<Role>("farmer");

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

  const notifications =
    role === "farmer" ? farmerNotifications : buyerNotifications;

  return (
    <li className="relative">
      <button
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-[#8FBF9F]/40 bg-[#EAF3DE] text-[#2F5F3F] hover:text-[#1B3A2B] dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span
          className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-[#A32D2D] ${
            notifying === false ? "hidden" : "inline"
          }`}
        >
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[#A32D2D] opacity-75"></span>
        </span>

        <BellIcon className="h-4.5 w-4.5" />
      </button>

      <div
        ref={dropdown}
        className={`absolute -right-27 mt-2.5 flex w-75 flex-col rounded-lg border border-[#8FBF9F]/30 bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-[#1B3A2B] dark:text-white">
            Notifications
          </h5>
        </div>

        <ul className="flex h-auto flex-col overflow-y-auto">
          {notifications.map((n) => {
            const { icon: Icon, bg, fg } = NOTIFICATION_STYLES[n.type];
            return (
              <li key={n.id}>
                <div className="flex gap-3 border-t border-[#3B2F22]/10 px-4.5 py-3 hover:bg-[#EAF3DE]/60 dark:border-strokedark dark:hover:bg-meta-4">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bg}`}
                  >
                    <Icon className={`h-4 w-4 ${fg}`} />
                  </span>
                  <div>
                    <p className="text-sm text-[#1B3A2B] dark:text-white">
                      {n.text}
                    </p>
                    <p className="mt-0.5 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
                      {n.time}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
};

export default DropdownNotification;