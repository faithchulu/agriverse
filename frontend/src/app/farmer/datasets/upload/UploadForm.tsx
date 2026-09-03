"use client";

import { useRef, useState } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { datasetsApi } from "../../../../lib/api/datasets";
import { extractErrorMessage } from "../../../../lib/api/types";
import type { LicenseType } from "../../../../types/Licensing"

const CROP_TYPES = [
  "Maize",
  "Wheat",
  "Rice",
  "Soybean",
  "Cassava",
  "Sorghum",
  "Other",
];

const LICENSE_TYPES = [
  { value: "one-time", label: "One-time download" },
  { value: "time-limited", label: "Time-limited access" },
  { value: "research-only", label: "Research use only" },
];

interface FormState {
  title: string;
  cropType: string;
  region: string;
  dateFrom: string;
  dateTo: string;
  samplingMethod: string;
  description: string;
  licenseType: string;
  price: string;
}

const initialState: FormState = {
  title: "",
  cropType: "",
  region: "",
  dateFrom: "",
  dateTo: "",
  samplingMethod: "",
  description: "",
  licenseType: "",
  price: "",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent, asDraft: boolean) {
    e.preventDefault();
    setError(null);
    setStatus("saving");

    if (!file) {
      setError("Select a dataset file before submitting.");
      setStatus("idle");
      return;
    }

    try {
      await datasetsApi.create({
        title: form.title,
        cropType: form.cropType,
        region: form.region,
        sampleDateFrom: form.dateFrom || undefined,
        sampleDateTo: form.dateTo || undefined,
        samplingMethod: form.samplingMethod || undefined,
        description: form.description || undefined,
        licenseType: form.licenseType as LicenseType,
        price: Number(form.price),
        status: asDraft ? "draft" : "live",
        file,
      });
      setStatus("saved");
    } catch (err) {
      setError(extractErrorMessage(err));
      setStatus("idle");
    }
  }

  if (status === "saved") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-[#8FBF9F]/40 bg-[#EAF3DE] px-6 py-10 text-center dark:bg-boxdark">
        <CheckCircleIcon className="h-10 w-10 text-[#2F5F3F]" />
        <p className="font-medium text-[#1B3A2B] dark:text-white">
          Dataset saved
        </p>
        <p className="max-w-sm text-sm text-[#3B2F22]/60 dark:text-bodydark2">
          <span className="font-medium text-[#1B3A2B] dark:text-white">
            {form.title || "Untitled dataset"}
          </span>{" "}
          has been added to your
          listings. You can edit or publish it from the listings page.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initialState);
            setFile(null);
            setError(null);
            setStatus("idle");
          }}
          className="mt-2 rounded-md bg-[#2F5F3F] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B3A2B]"
        >
          Upload another dataset
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e, false)}
      className="space-y-6 rounded-lg border border-[#8FBF9F]/30 bg-white p-6 dark:border-strokedark dark:bg-boxdark"
    >
      {/* File drop zone */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1B3A2B] dark:text-white">
          Dataset file
        </label>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
              isDragging
                ? "border-[#2F5F3F] bg-[#EAF3DE]"
                : "border-[#3B2F22]/20 hover:border-[#2F5F3F]/60"
            }`}
          >
            <CloudArrowUpIcon className="h-8 w-8 text-[#2F5F3F]" />
            <p className="text-sm font-medium text-[#1B3A2B] dark:text-white">
              Drag a file here, or click to browse
            </p>
            <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
              CSV or JSON, up to 50MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-[#8FBF9F]/40 bg-[#EAF3DE] px-4 py-3">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-6 w-6 text-[#2F5F3F]" />
              <div>
                <p className="text-sm font-medium text-[#1B3A2B]">
                  {file.name}
                </p>
                <p className="text-xs text-[#3B2F22]/50">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-[#3B2F22]/50 hover:text-[#B4442E]"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Dataset details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Dataset title
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Maize soil moisture — Eastern Province, 2025"
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Crop type
          </label>
          <select
            required
            value={form.cropType}
            onChange={(e) => update("cropType", e.target.value)}
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="" disabled>
              Select crop type
            </option>
            {CROP_TYPES.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Region
          </label>
          <input
            type="text"
            required
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            placeholder="e.g. Eastern Province"
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Sample date from
          </label>
          <input
            type="date"
            required
            value={form.dateFrom}
            onChange={(e) => update("dateFrom", e.target.value)}
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Sample date to
          </label>
          <input
            type="date"
            required
            value={form.dateTo}
            onChange={(e) => update("dateTo", e.target.value)}
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Sampling method
          </label>
          <input
            type="text"
            value={form.samplingMethod}
            onChange={(e) => update("samplingMethod", e.target.value)}
            placeholder="e.g. Weekly probe readings at 15cm depth"
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What's in this dataset, and why would a buyer want it?"
            className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
      </div>

      {/* Licensing & pricing */}
      <div className="border-t border-[#3B2F22]/10 pt-5 dark:border-strokedark">
        <h2 className="mb-4 text-sm font-semibold text-[#1B3A2B] dark:text-white">
          Licensing &amp; price
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              License type
            </label>
            <select
              required
              value={form.licenseType}
              onChange={(e) => update("licenseType", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            >
              <option value="" disabled>
                Select license type
              </option>
              {LICENSE_TYPES.map((lt) => (
                <option key={lt.value} value={lt.value}>
                  {lt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Price (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#B4442E]">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#3B2F22]/10 pt-5 sm:flex-row sm:justify-end dark:border-strokedark">
        <button
          type="button"
          disabled={status === "saving"}
          onClick={(e) => handleSubmit(e as any, true)}
          className="rounded-md border border-[#2F5F3F] px-5 py-2.5 text-sm font-medium text-[#2F5F3F] hover:bg-[#EAF3DE] disabled:opacity-60 dark:text-white"
        >
          Save as draft
        </button>
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-md bg-[#2F5F3F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Publish listing"}
        </button>
      </div>
    </form>
  );
}