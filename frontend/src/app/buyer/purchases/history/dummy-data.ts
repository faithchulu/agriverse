import type { Purchase } from "../../../../types/Purchase";

// TODO: replace with `const { data } = await axios.get("/api/buyer/purchases")`
// once the backend endpoint exists. Shape should match the Purchase type.
export const dummyPurchases: Purchase[] = [
  {
    id: "pur_001",
    datasetTitle: "Maize soil moisture - Eastern Province, 2025",
    sellerName: "Mwansa Family Farm",
    licenseType: "Time-limited access",
    price: 120,
    purchaseDate: "2026-07-06",
    status: "completed",
  },
  {
    id: "pur_002",
    datasetTitle: "Sorghum drought resilience trial - Southern Province",
    sellerName: "Mwansa Family Farm",
    licenseType: "Research use only",
    price: 180,
    purchaseDate: "2026-05-15",
    status: "completed",
  },
  {
    id: "pur_003",
    datasetTitle: "Wheat hybrid yield trial - Northern Plains",
    sellerName: "Green Acres Cooperative",
    licenseType: "Time-limited access",
    price: 250,
    purchaseDate: "2026-05-01",
    status: "refunded",
  },
  {
    id: "pur_004",
    datasetTitle: "Cassava root growth sensor data - Central Region",
    sellerName: "Green Acres Cooperative",
    licenseType: "One-time download",
    price: 60,
    purchaseDate: "2026-07-16",
    status: "completed",
  },
  {
    id: "pur_005",
    datasetTitle: "Rice paddy nitrogen levels - Lowveld",
    sellerName: "Zambezi Valley Farms",
    licenseType: "One-time download",
    price: 90,
    purchaseDate: "2026-07-20",
    status: "completed",
  },
];