"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type RegisterInput } from "../../lib/auth/AuthContext";
import { extractErrorMessage } from "../../lib/api/types";

const ORG_TYPES = [
  "Research institution",
  "Seed company",
  "Agribusiness",
  "Government agency",
  "Other",
];

type FormRole = "farmer" | "buyer";

export function SignupForm() {
  const [role, setRole] = useState<FormRole>("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState(ORG_TYPES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const input: RegisterInput =
      role === "farmer"
        ? { role: "farmer", email, password, fullName, farmName, farmLocation }
        : { role: "buyer", email, password, contactName, organizationName, organizationType };

    try {
      const user = await register(input);
      router.push(user.role === "FARMER" ? "/farmer/dashboard" : "/buyer/dashboard");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-[#3B2F22]/20 bg-white px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30";
  const labelClass = "block text-sm font-medium text-[#1B3A2B]";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="flex items-center gap-1.5 rounded-md bg-[#EAF3DE] p-1">
        <button
          type="button"
          onClick={() => setRole("farmer")}
          className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
            role === "farmer" ? "bg-[#2F5F3F] text-white" : "text-[#2F5F3F]/70 hover:text-[#1B3A2B]"
          }`}
        >
          I am a Farmer
        </button>
        <button
          type="button"
          onClick={() => setRole("buyer")}
          className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
            role === "buyer" ? "bg-[#2F5F3F] text-white" : "text-[#2F5F3F]/70 hover:text-[#1B3A2B]"
          }`}
        >
          I am a Buyer
        </button>
      </div>

      {role === "farmer" ? (
        <>
          <div>
            <label className={labelClass}>Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Chanda Mwansa"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Farm name</label>
            <input
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Mwansa Family Farm"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Farm location</label>
            <input
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              placeholder="Eastern Province, Zambia"
              className={inputClass}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className={labelClass}>Contact name</label>
            <input
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Dr. Lweendo Banda"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Organization name</label>
            <input
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Kalundu Agri University"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Organization type</label>
            <select
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              className={inputClass}
            >
              {ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#B4442E]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#2F5F3F] py-2.5 text-sm font-medium text-[#FAF7EE] transition-colors hover:bg-[#1B3A2B] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/40 focus:ring-offset-2 disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}