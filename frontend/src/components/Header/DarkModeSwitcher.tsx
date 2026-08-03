"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import useColorMode from "@/hooks/useColorMode";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          colorMode === "dark" ? "bg-[#2F5F3F]" : "bg-[#3B2F22]/15"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "light" ? "dark" : "light");
            }
          }}
          className="absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            colorMode === "dark" && "!right-[3px] !translate-x-full"
          }`}
        >
          <span className="dark:hidden">
            <SunIcon className="h-4 w-4 text-[#D9A441]" />
          </span>
          <span className="hidden dark:inline-block">
            <MoonIcon className="h-4 w-4 text-[#2F5F3F]" />
          </span>
        </span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;