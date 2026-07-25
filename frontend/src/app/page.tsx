import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { LoginForm } from "./LoginForm";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "AgriVerse Marketplace",
  description: "Sign in to AgriVerse — the marketplace for agricultural data.",
};

function CropTag({
  label,
  value,
  bars,
  className,
}: {
  label: string;
  value: string;
  bars: number[];
  className?: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      {/* string */}
      <div className="mx-auto h-6 w-px bg-[#3B2F22]/40" />
      <div className="relative rounded-sm border border-dashed border-[#3B2F22]/30 bg-[#F0E6D2] px-3.5 py-2.5 shadow-[0_6px_16px_rgba(20,38,28,0.25)]">
        {/* punch hole */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#8FBF9F] ring-2 ring-[#F0E6D2]" />
        <p className="font-body text-[10px] font-medium uppercase tracking-wide text-[#3B2F22]/60">
          {label}
        </p>
        <p className="font-display mt-0.5 text-lg leading-none text-[#1B3A2B]">
          {value}
        </p>
        <div className="mt-2 flex h-6 items-end gap-[3px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-[1px] bg-[#D9A441]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      className={`${fraunces.variable} ${inter.variable} flex min-h-screen bg-[#FAF7EE] font-[family-name:var(--font-body)]`}
    >
      {/* Left: field illustration */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-b from-[#8FBF9F] via-[#4F8A62] to-[#1B3A2B] lg:block">
        {/* sun */}
        <div className="absolute right-16 top-16 h-24 w-24 rounded-full bg-[#F5E3AE]/90 blur-[2px]" />

        {/* decentralized network motif, top-left */}
        <svg
          className="absolute left-10 top-10 h-16 w-20 opacity-70"
          viewBox="0 0 80 60"
          fill="none"
        >
          <circle cx="10" cy="10" r="3" fill="#FAF7EE" />
          <circle cx="40" cy="6" r="3" fill="#FAF7EE" />
          <circle cx="68" cy="20" r="3" fill="#FAF7EE" />
          <circle cx="24" cy="34" r="3" fill="#FAF7EE" />
          <line x1="10" y1="10" x2="40" y2="6" stroke="#FAF7EE" strokeWidth="0.75" strokeDasharray="2 2" />
          <line x1="40" y1="6" x2="68" y2="20" stroke="#FAF7EE" strokeWidth="0.75" strokeDasharray="2 2" />
          <line x1="10" y1="10" x2="24" y2="34" stroke="#FAF7EE" strokeWidth="0.75" strokeDasharray="2 2" />
          <line x1="24" y1="34" x2="68" y2="20" stroke="#FAF7EE" strokeWidth="0.75" strokeDasharray="2 2" />
        </svg>

        {/* crop rows */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg, rgba(20,38,28,0.16) 0px, rgba(20,38,28,0.16) 3px, transparent 3px, transparent 26px)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[#14261C]/30" />

        {/* crop tags */}
        <CropTag
          label="Soil moisture"
          value="68%"
          bars={[40, 65, 50, 80, 60]}
          className="left-[14%] top-[30%] w-32 -rotate-2"
        />
        <CropTag
          label="Yield forecast"
          value="+12%"
          bars={[30, 45, 55, 70, 90]}
          className="left-[52%] top-[46%] w-32 rotate-3"
        />
        <CropTag
          label="Listings live"
          value="1,204"
          bars={[70, 55, 60, 75, 65]}
          className="left-[32%] top-[62%] w-32 -rotate-1"
        />

        {/* wordmark, bottom-left */}
        <div className="absolute bottom-10 left-10 right-10">
          <p className="font-display text-3xl text-[#FAF7EE]">AgriVerse</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#FAF7EE]/75">
            Your soil data, your yields, your terms — shared and sold on
            your say-so.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex w-full items-center justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <p className="font-display text-2xl text-[#1B3A2B]">AgriVerse</p>
          </div>

          <h1 className="font-display text-2xl text-[#1B3A2B]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#3B2F22]/60">
            Sign in to manage your listings and purchases.
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-[#3B2F22]/60">
            New to AgriVerse?{" "}
            <a
              href="/signup"
              className="font-medium text-[#2F5F3F] underline-offset-4 hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}