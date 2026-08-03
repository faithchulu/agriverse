"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { faqCategories } from "./faq-data";

const QUICK_LINKS = [
  { label: "Browse the marketplace", href: "/buyer/marketplace" },
  { label: "My purchase history", href: "/buyer/purchases/history" },
  { label: "My active licenses", href: "/buyer/purchases/licenses" },
];

const ISSUE_CATEGORIES = [
  "Payment or billing",
  "Dispute with a seller",
  "Technical issue",
  "Something else",
];

function FaqAccordion() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {faqCategories.map((category) => (
        <div key={category.title}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#3B2F22]/50 dark:text-bodydark2">
            {category.title}
          </h3>
          <div className="divide-y divide-[#3B2F22]/5 rounded-lg border border-[#8FBF9F]/30 bg-white dark:divide-strokedark dark:border-strokedark dark:bg-boxdark">
            {category.items.map((item) => {
              const key = `${category.title}__${item.question}`;
              const open = openKey === key;
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium text-[#1B3A2B] dark:text-white">
                      {item.question}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 shrink-0 text-[#3B2F22]/50 transition-transform ${
                        open && "rotate-180"
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="px-4 pb-4 text-sm text-[#3B2F22]/70 dark:text-bodydark2">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportForm() {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // TODO: await axios.post("/api/support/tickets", { category, subject, message })
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[#8FBF9F]/40 bg-[#EAF3DE] px-6 py-8 text-center">
        <CheckCircleIcon className="h-8 w-8 text-[#2F5F3F]" />
        <p className="font-medium text-[#1B3A2B]">Request sent</p>
        <p className="max-w-sm text-sm text-[#3B2F22]/60">
          We've logged your issue and will follow up by email.
        </p>
        <button
          type="button"
          onClick={() => {
            setCategory("");
            setSubject("");
            setMessage("");
            setStatus("idle");
          }}
          className="mt-1 text-sm font-medium text-[#2F5F3F] underline-offset-4 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
          Category
        </label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
        >
          <option value="" disabled>
            Select a category
          </option>
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
          Subject
        </label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of the issue"
          className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
          Message
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What happened, and what would help?"
          className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-[#2F5F3F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send request"}
        </button>
      </div>
    </form>
  );
}

export default function BuyerHelpView() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <FaqAccordion />
      </div>

      <div className="space-y-6">
        {/* Quick links */}
        <div className="rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-3 text-sm font-semibold text-[#1B3A2B] dark:text-white">
            Quick links
          </h2>
          <ul className="space-y-1">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm text-[#3B2F22]/70 hover:bg-[#EAF3DE] hover:text-[#1B3A2B] dark:text-bodydark2"
                >
                  {link.label}
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support form */}
        <div className="rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex items-center gap-2">
            <LifebuoyIcon className="h-5 w-5 text-[#2F5F3F]" />
            <h2 className="text-sm font-semibold text-[#1B3A2B] dark:text-white">
              Raise an issue
            </h2>
          </div>
          <SupportForm />
        </div>
      </div>
    </div>
  );
}