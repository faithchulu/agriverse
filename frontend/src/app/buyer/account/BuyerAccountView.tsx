"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  WalletIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface ProfileState {
  contactName: string;
  organizationName: string;
  organizationType: string;
  email: string;
  phone: string;
  bio: string;
}

interface NotificationState {
  emailNotifications: boolean;
  purchaseConfirmations: boolean;
  licenseExpiryAlerts: boolean;
  disputeUpdates: boolean;
  marketingUpdates: boolean;
}

const ORG_TYPES = [
  "Research institution",
  "Seed company",
  "Agribusiness",
  "Government agency",
  "Other",
];

const initialProfile: ProfileState = {
  contactName: "Dr. Lweendo Banda",
  organizationName: "Kalundu Agri University",
  organizationType: "Research institution",
  email: "l.banda@kalunduagri.edu",
  phone: "+260 96 555 2314",
  bio: "Soil science research group studying nitrogen retention across smallholder farms.",
};

const initialNotifications: NotificationState = {
  emailNotifications: true,
  purchaseConfirmations: true,
  licenseExpiryAlerts: true,
  disputeUpdates: true,
  marketingUpdates: false,
};

function SaveButton({
  status,
  onClick,
}: {
  status: "idle" | "saving" | "saved";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "saving"}
      className="flex items-center gap-1.5 rounded-md bg-[#2F5F3F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B3A2B] disabled:opacity-60"
    >
      {status === "saved" && <CheckCircleIcon className="h-4 w-4" />}
      {status === "saving"
        ? "Saving…"
        : status === "saved"
          ? "Saved"
          : "Save changes"}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#1B3A2B] dark:text-white">
          {label}
        </p>
        <p className="text-xs text-[#3B2F22]/50 dark:text-bodydark2">
          {description}
        </p>
      </div>
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-[#2F5F3F]" : "bg-[#3B2F22]/20"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </label>
  );
}

export default function BuyerAccountView() {
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [profileStatus, setProfileStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const [notifications, setNotifications] = useState<NotificationState>(
    initialNotifications,
  );
  const [notificationsStatus, setNotificationsStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [securityStatus, setSecurityStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [securityError, setSecurityError] = useState<string | null>(null);

  function updateProfile<K extends keyof ProfileState>(
    key: K,
    value: ProfileState[K],
  ) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    setProfileStatus("saving");
    // TODO: await axios.put("/api/buyer/profile", profile)
    await new Promise((resolve) => setTimeout(resolve, 600));
    setProfileStatus("saved");
    setTimeout(() => setProfileStatus("idle"), 1500);
  }

  async function saveNotifications() {
    setNotificationsStatus("saving");
    // TODO: await axios.put("/api/buyer/notifications", notifications)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setNotificationsStatus("saved");
    setTimeout(() => setNotificationsStatus("idle"), 1500);
  }

  async function saveSecurity() {
    setSecurityError(null);

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setSecurityError("Fill in all three password fields.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setSecurityError("New password and confirmation don't match.");
      return;
    }

    setSecurityStatus("saving");
    // TODO: await axios.put("/api/buyer/security/password", passwords)
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSecurityStatus("saved");
    setPasswords({ current: "", next: "", confirm: "" });
    setTimeout(() => setSecurityStatus("idle"), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Profile & organization details */}
      <section className="rounded-lg border border-[#8FBF9F]/30 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1B3A2B] dark:text-white">
            Profile &amp; organization details
          </h2>
          <span className="flex items-center gap-1.5 rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#2F5F3F]">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Verified buyer
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Contact name
            </label>
            <input
              type="text"
              value={profile.contactName}
              onChange={(e) => updateProfile("contactName", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => updateProfile("email", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => updateProfile("phone", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Organization type
            </label>
            <select
              value={profile.organizationType}
              onChange={(e) =>
                updateProfile("organizationType", e.target.value)
              }
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            >
              {ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Organization name
            </label>
            <input
              type="text"
              value={profile.organizationName}
              onChange={(e) =>
                updateProfile("organizationName", e.target.value)
              }
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              About your work
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => updateProfile("bio", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-[#3B2F22]/10 pt-5 dark:border-strokedark">
          <SaveButton status={profileStatus} onClick={saveProfile} />
        </div>
      </section>

      {/* Notification preferences */}
      <section className="rounded-lg border border-[#8FBF9F]/30 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-2 text-sm font-semibold text-[#1B3A2B] dark:text-white">
          Notification preferences
        </h2>

        <div className="divide-y divide-[#3B2F22]/5 dark:divide-strokedark">
          <Toggle
            label="Email notifications"
            description="General account and platform updates."
            checked={notifications.emailNotifications}
            onChange={(v) =>
              setNotifications((prev) => ({
                ...prev,
                emailNotifications: v,
              }))
            }
          />
          <Toggle
            label="Purchase confirmations"
            description="Get notified when a purchase completes and access is granted."
            checked={notifications.purchaseConfirmations}
            onChange={(v) =>
              setNotifications((prev) => ({
                ...prev,
                purchaseConfirmations: v,
              }))
            }
          />
          <Toggle
            label="License expiry alerts"
            description="Get notified before a time-limited license runs out."
            checked={notifications.licenseExpiryAlerts}
            onChange={(v) =>
              setNotifications((prev) => ({
                ...prev,
                licenseExpiryAlerts: v,
              }))
            }
          />
          <Toggle
            label="Dispute updates"
            description="Get notified on any change to a dispute you have raised."
            checked={notifications.disputeUpdates}
            onChange={(v) =>
              setNotifications((prev) => ({ ...prev, disputeUpdates: v }))
            }
          />
          <Toggle
            label="Marketing updates"
            description="Occasional news about new AgriVerse features."
            checked={notifications.marketingUpdates}
            onChange={(v) =>
              setNotifications((prev) => ({
                ...prev,
                marketingUpdates: v,
              }))
            }
          />
        </div>

        <div className="mt-5 flex justify-end border-t border-[#3B2F22]/10 pt-5 dark:border-strokedark">
          <SaveButton
            status={notificationsStatus}
            onClick={saveNotifications}
          />
        </div>
      </section>

      {/* Security */}
      <section className="rounded-lg border border-[#8FBF9F]/30 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-4 text-sm font-semibold text-[#1B3A2B] dark:text-white">
          Security
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Current password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, current: e.target.value }))
              }
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              New password
            </label>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, next: e.target.value }))
              }
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Confirm new password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm: e.target.value }))
              }
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        {securityError && (
          <p className="mt-3 text-sm text-[#B4442E]">{securityError}</p>
        )}

        <div className="mt-5 flex items-center justify-between rounded-md bg-[#EAF3DE] px-4 py-3 dark:bg-form-input">
          <div className="flex items-center gap-2 text-sm text-[#1B3A2B] dark:text-white">
            <WalletIcon className="h-4 w-4 text-[#2F5F3F]" />
            Linked wallet: not connected
          </div>
          <Link
            href="/buyer/wallet"
            className="text-sm font-medium text-[#2F5F3F] underline-offset-4 hover:underline"
          >
            Manage in Wallet
          </Link>
        </div>

        <div className="mt-5 flex justify-end border-t border-[#3B2F22]/10 pt-5 dark:border-strokedark">
          <SaveButton status={securityStatus} onClick={saveSecurity} />
        </div>
      </section>
    </div>
  );
}