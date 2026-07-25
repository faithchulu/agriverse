import type { Payout } from "../../../../types/Payout";

// TODO: replace with `const { data } = await axios.get("/api/farmer/payouts")`
// once the backend endpoint (and real wallet/bank integration) exists.
export const dummyPayouts: Payout[] = [
  {
    id: "pyt_001",
    date: "2026-06-20",
    amount: 250,
    method: "Bank transfer",
    status: "completed",
    reference: "REF-88213",
  },
  {
    id: "pyt_002",
    date: "2026-06-12",
    amount: 120,
    method: "Mobile money",
    status: "completed",
    reference: "REF-77410",
  },
  {
    id: "pyt_003",
    date: "2026-05-02",
    amount: 90,
    method: "Bank transfer",
    status: "failed",
    reference: "REF-65120",
  },
];

// Simulated wallet snapshot — will come from the same payouts/balance
// endpoint once it exists.
export const initialAvailableBalance = 195;