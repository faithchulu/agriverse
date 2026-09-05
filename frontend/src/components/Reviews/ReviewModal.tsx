"use client";

import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function ReviewModal({
  open,
  title,
  rating,
  comment,
  isSubmitting,
  onRatingChange,
  onCommentChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14261C]/45 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="w-full max-w-md rounded-lg border border-[#8FBF9F]/30 bg-white p-6 shadow-xl dark:border-strokedark dark:bg-boxdark"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="review-modal-title"
              className="text-lg font-semibold text-[#1B3A2B] dark:text-white"
            >
              Rate farmer
            </h2>
            <p className="mt-1 text-sm text-[#3B2F22]/60 dark:text-bodydark2">
              {title}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close review dialog"
            onClick={onClose}
            className="rounded-md p-1 text-[#3B2F22]/50 hover:bg-[#EAF3DE] hover:text-[#1B3A2B]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-[#1B3A2B] dark:text-white">
            Your rating
          </p>
          <div
            className="mt-2 flex gap-1"
            aria-label="Choose a rating from one to five stars"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                aria-pressed={rating === value}
                onClick={() => onRatingChange(value)}
                className="rounded-md p-1 hover:bg-[#FAEEDA]"
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    value <= rating ? "text-[#D9A441]" : "text-[#3B2F22]/15"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <label className="mt-5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
          Comment{" "}
          <span className="font-normal text-[#3B2F22]/50">(optional)</span>
          <textarea
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Share your experience with this dataset and farmer"
            className="mt-2 w-full resize-none rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm font-normal text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#3B2F22]/15 px-4 py-2 text-sm font-medium text-[#3B2F22]/70 hover:bg-[#EAF3DE]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={rating === 0 || isSubmitting}
            className="rounded-md bg-[#2F5F3F] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
