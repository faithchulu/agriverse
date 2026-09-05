"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircleIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../lib/auth/AuthContext";
import { usersApi } from "../../../lib/api/users";
import { extractErrorMessage } from "../../../lib/api/types";

interface ProfileState {
  fullName: string;
  email: string;
  phone: string;
  farmName: string;
  farmLocation: string;
  bio: string;
}

interface NotificationState {
  emailNotifications: boolean;
  saleAlerts: boolean;
  disputeAlerts: boolean;
  marketingUpdates: boolean;
}

const initialNotifications: NotificationState = {
  emailNotifications: true,
  saleAlerts: true,
  disputeAlerts: true,
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

export default function AccountView() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    email: "",
    phone: "",
    farmName: "",
    farmLocation: "",
    bio: "",
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const [notifications, setNotifications] =
    useState<NotificationState>(initialNotifications);
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

  useEffect(() => {
    if (!user?.farmerProfile) return;
    setProfile({
      fullName: user.farmerProfile.fullName,
      email: user.email,
      phone: user.farmerProfile.phone ?? "",
      farmName: user.farmerProfile.farmName ?? "",
      farmLocation: user.farmerProfile.farmLocation ?? "",
      bio: user.farmerProfile.bio ?? "",
    });
  }, [user]);

  function updateProfile<K extends keyof ProfileState>(
    key: K,
    value: ProfileState[K],
  ) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    setProfileError(null);
    setProfileStatus("saving");
    try {
      const updated = await usersApi.updateProfile(profile);
      updateUser(updated);
      if (updated.farmerProfile) {
        setProfile({
          fullName: updated.farmerProfile.fullName,
          email: updated.email,
          phone: updated.farmerProfile.phone ?? "",
          farmName: updated.farmerProfile.farmName ?? "",
          farmLocation: updated.farmerProfile.farmLocation ?? "",
          bio: updated.farmerProfile.bio ?? "",
        });
      }
      setProfileStatus("saved");
      setTimeout(() => setProfileStatus("idle"), 1500);
    } catch (err) {
      setProfileStatus("idle");
      setProfileError(extractErrorMessage(err));
    }
  }

  async function saveNotifications() {
    setNotificationsStatus("saving");
    // TODO: await axios.put("/api/farmer/notifications", notifications)
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
    setSecurityStatus("saving");
    try {
      await usersApi.changePassword(passwords.current, passwords.next);
      setSecurityStatus("saved");
      setPasswords({ current: "", next: "", confirm: "" });
      setTimeout(() => setSecurityStatus("idle"), 1500);
    } catch (err) {
      setSecurityStatus("idle");
      setSecurityError(extractErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      {profileError && (
        <p className="rounded-md border border-[#A32D2D]/30 bg-[#FCEBEB] px-4 py-3 text-sm text-[#A32D2D]">
          Could not save your profile: {profileError}
        </p>
      )}

      {/* Profile & farm details */}
      <section className="rounded-lg border border-[#8FBF9F]/30 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-4 text-sm font-semibold text-[#1B3A2B] dark:text-white">
          Profile &amp; farm details
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Full name
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => updateProfile("fullName", e.target.value)}
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
              Farm name
            </label>
            <input
              type="text"
              value={profile.farmName}
              onChange={(e) => updateProfile("farmName", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Farm location
            </label>
            <input
              type="text"
              value={profile.farmLocation}
              onChange={(e) => updateProfile("farmLocation", e.target.value)}
              className="w-full rounded-md border border-[#3B2F22]/20 px-3.5 py-2.5 text-sm text-[#1B3A2B] focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30 dark:border-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#1B3A2B] dark:text-white">
              Bio
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
            label="Sale alerts"
            description="Get notified when a dataset sells or a buyer shows interest."
            checked={notifications.saleAlerts}
            onChange={(v) =>
              setNotifications((prev) => ({ ...prev, saleAlerts: v }))
            }
          />
          <Toggle
            label="Dispute alerts"
            description="Get notified immediately if a buyer raises a dispute."
            checked={notifications.disputeAlerts}
            onChange={(v) =>
              setNotifications((prev) => ({ ...prev, disputeAlerts: v }))
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
            href="/farmer/wallet"
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
