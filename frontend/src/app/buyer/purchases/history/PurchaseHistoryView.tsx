"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { paymentsApi, type Transaction } from "../../../../lib/api/payments";
import { extractErrorMessage } from "../../../../lib/api/types";
import ReviewModal from "../../../../components/Reviews/ReviewModal";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#FAEEDA] text-[#854F0B]",
  paid: "bg-[#E6F1FB] text-[#0C447C]",
  released: "bg-[#EAF3DE] text-[#2F5F3F]",
  disputed: "bg-[#FCEBEB] text-[#A32D2D]",
  refunded: "bg-[#3B2F22]/10 text-[#3B2F22]",
};

type SortOption = "newest" | "oldest" | "price-desc";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PurchaseHistoryView() {
  const [purchases, setPurchases] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Transaction | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    let cancelled = false;

    paymentsApi
      .myTransactions()
      .then((data) => {
        if (!cancelled) setPurchases(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(extractErrorMessage(err));
        setPurchases((prev) => prev ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!purchases) return [];

    let items = purchases.filter(
      (p) =>
        query.trim() === "" ||
        (p.datasetTitle ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (p.sellerName ?? "").toLowerCase().includes(query.toLowerCase()),
    );

    items = [...items].sort((a, b) => {
      if (sort === "price-desc") return b.amount - a.amount;
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === "oldest" ? -diff : diff;
    });

    return items;
  }, [purchases, query, sort]);

  const totalSpent = useMemo(
    () =>
      (purchases ?? [])
        .filter((p) => p.status !== "refunded")
        .reduce((sum, p) => sum + p.amount, 0),
    [purchases],
  );

  function openReview(purchase: Transaction) {
    if (purchase.status !== "released" || purchase.reviewId) return;
    setReviewTarget(purchase);
    setReviewRating(0);
    setReviewComment("");
  }

  function closeReview() {
    if (reviewingId) return;
    setReviewTarget(null);
  }

  async function submitReview() {
    if (!reviewTarget || reviewRating === 0) return;
    const purchase = reviewTarget;
    setReviewingId(purchase.id);
    setError(null);
    try {
      const review = await paymentsApi.review(
        purchase.id,
        reviewRating,
        reviewComment || undefined,
      );
      setPurchases(
        (prev) =>
          prev?.map((item) =>
            item.id === purchase.id ? { ...item, reviewId: review.id } : item,
          ) ?? prev,
      );
      setReviewTarget(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-[#A32D2D]/30 bg-[#FCEBEB] px-4 py-3 text-sm text-[#A32D2D]">
          Could not load purchase history: {error}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          Total spent to date
        </p>
        <p className="text-2xl font-semibold text-[#1B3A2B] dark:text-white">
          ZMW {totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg border border-[#8FBF9F]/30 bg-white dark:border-strokedark dark:bg-boxdark">
        {/* Search + sort */}
        <div className="flex flex-col gap-3 border-b border-[#3B2F22]/10 p-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-64">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B2F22]/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dataset or seller"
              className="w-full rounded-md border border-[#3B2F22]/20 py-2 pl-9 pr-3 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-[#3B2F22]/20 px-3 py-2 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price-desc">Highest price</option>
          </select>
        </div>

        {/* List */}
        <ul className="divide-y divide-[#3B2F22]/5 dark:divide-strokedark">
          {purchases === null && (
            <li className="px-4 py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2">
              Loading purchase history...
            </li>
          )}

          {filtered.map((purchase) => (
            <PurchaseRow
              key={purchase.id}
              purchase={purchase}
              onReview={() => openReview(purchase)}
            />
          ))}

          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-[#3B2F22]/50 dark:text-bodydark2">
              No purchases match your search.
            </li>
          )}
        </ul>
      </div>
      <ReviewModal
        open={reviewTarget !== null}
        title={reviewTarget?.datasetTitle ?? "Purchased dataset"}
        rating={reviewRating}
        comment={reviewComment}
        isSubmitting={reviewingId !== null}
        onRatingChange={setReviewRating}
        onCommentChange={setReviewComment}
        onClose={closeReview}
        onSubmit={submitReview}
      />
    </div>
  );
}

function PurchaseRow({
  purchase,
  onReview,
}: {
  purchase: Transaction;
  onReview: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#1B3A2B] dark:text-white">
          {purchase.datasetTitle ?? "Unknown dataset"}
        </p>
        <p className="mt-0.5 text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          {purchase.sellerName ?? "Unknown seller"} · {purchase.licenseType} ·{" "}
          {formatDate(purchase.date)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            STATUS_STYLES[purchase.status] ?? "bg-[#3B2F22]/10 text-[#3B2F22]"
          }`}
        >
          {purchase.status}
        </span>
        <span className="w-16 text-right text-sm font-semibold text-[#1B3A2B] dark:text-white">
          ZMW {purchase.amount.toFixed(2)}
        </span>
        {purchase.status === "released" && !purchase.reviewId && (
          <button
            type="button"
            title="Rate this farmer"
            onClick={onReview}
            className="rounded-md px-2 py-1 text-xs font-medium text-[#2F5F3F] hover:bg-[#EAF3DE] disabled:opacity-50"
          >
            Rate farmer
          </button>
        )}
        <button
          title="Receipt download will be available once billing integration is live"
          disabled
          className="cursor-not-allowed rounded-md p-1.5 text-[#3B2F22]/30"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
