import type { Transaction } from "../../../../types/Transaction";

// TODO: replace with `const { data } = await axios.get("/api/farmer/transactions")`
// once the backend endpoint exists. Shape should match the Transaction type.
export const dummyTransactions: Transaction[] = [
  {
    id: "txn_001",
    buyerName: "GreenGrain Research Co.",
    datasetTitle: "Hybrid wheat yield records - Northern Plains",
    licenseType: "One-time download",
    amount: 250,
    status: "released",
    date: "2026-05-19",
  },
  {
    id: "txn_002",
    buyerName: "AgriSeed Labs",
    datasetTitle: "Maize soil moisture - Eastern Province, 2025",
    licenseType: "Time-limited access",
    amount: 120,
    status: "paid",
    date: "2026-07-05",
  },
  {
    id: "txn_003",
    buyerName: "Kalundu Agri University",
    datasetTitle: "Soybean pest incidence log - Copperbelt",
    licenseType: "Research use only",
    amount: 75,
    status: "pending",
    date: "2026-07-18",
  },
  {
    id: "txn_004",
    buyerName: "Highveld Seed Traders",
    datasetTitle: "Cassava root growth sensor data - Central Region",
    licenseType: "One-time download",
    amount: 60,
    status: "disputed",
    date: "2026-07-12",
  },
  {
    id: "txn_005",
    buyerName: "FarmTech Analytics",
    datasetTitle: "Sorghum drought resilience trial - Southern Province",
    licenseType: "Time-limited access",
    amount: 180,
    status: "refunded",
    date: "2026-04-25",
  },
  {
    id: "txn_006",
    buyerName: "GreenGrain Research Co.",
    datasetTitle: "Maize soil moisture - Eastern Province, 2025",
    licenseType: "Research use only",
    amount: 120,
    status: "released",
    date: "2026-06-10",
  },
];