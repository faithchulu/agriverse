import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SignupForm } from "./SignupForm";

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
  description: "Create your AgriVerse account.",
};

export default function SignupPage() {
  return (
    <main
      className={`${fraunces.variable} ${inter.variable} flex min-h-screen bg-[#FAF7EE] font-[family-name:var(--font-body)]`}
    >
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-b from-[#8FBF9F] via-[#4F8A62] to-[#1B3A2B] lg:block">
        <div className="absolute right-16 top-16 h-24 w-24 rounded-full bg-[#F5E3AE]/90 blur-[2px]" />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg, rgba(20,38,28,0.16) 0px, rgba(20,38,28,0.16) 3px, transparent 3px, transparent 26px)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[#14261C]/30" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="font-display text-3xl text-[#FAF7EE]">AgriVerse</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#FAF7EE]/75">
            Join as a farmer to sell your data, or a buyer to license it -
            your call.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <p className="font-display text-2xl text-[#1B3A2B]">AgriVerse</p>
          </div>

          <h1 className="font-display text-2xl text-[#1B3A2B]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#3B2F22]/60">
            A couple of details and you are in.
          </p>

          <SignupForm />

          <p className="mt-8 text-center text-sm text-[#3B2F22]/60">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#2F5F3F] underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}