import type { Transaction } from "../../../types/BuyerTransaction";

// TODO: replace with `const { data } = await axios.get("/api/buyer/transactions")`
// once the backend endpoint exists. Shape should match the Transaction type.
export const dummyTransactions: Transaction[] = [
  {
    id: "btxn_001",
    sellerName: "Mwansa Family Farm",
    datasetTitle: "Maize soil moisture - Eastern Province, 2025",
    licenseType: "Time-limited access",
    amount: 120,
    status: "released",
    date: "2026-07-06",
  },
  {
    id: "btxn_002",
    sellerName: "Green Acres Cooperative",
    datasetTitle: "Cassava root growth sensor data - Central Region",
    licenseType: "One-time download",
    amount: 60,
    status: "paid",
    date: "2026-07-15",
  },
  {
    id: "btxn_003",
    sellerName: "Kalunga Farms",
    datasetTitle: "Soybean pest incidence log - Copperbelt",
    licenseType: "Research use only",
    amount: 75,
    status: "pending",
    date: "2026-07-19",
  },
  {
    id: "btxn_004",
    sellerName: "Zambezi Valley Farms",
    datasetTitle: "Rice paddy nitrogen levels - Lowveld",
    licenseType: "One-time download",
    amount: 90,
    status: "disputed",
    date: "2026-07-11",
  },
  {
    id: "btxn_005",
    sellerName: "Green Acres Cooperative",
    datasetTitle: "Wheat hybrid yield trial - Northern Plains",
    licenseType: "Time-limited access",
    amount: 250,
    status: "refunded",
    date: "2026-06-20",
  },
  {
    id: "btxn_006",
    sellerName: "Mwansa Family Farm",
    datasetTitle: "Sorghum drought resilience trial - Southern Province",
    licenseType: "Research use only",
    amount: 180,
    status: "released",
    date: "2026-05-15",
  },
];