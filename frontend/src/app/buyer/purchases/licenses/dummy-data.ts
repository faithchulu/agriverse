import type { License } from "../../../../types/Licensing";

// TODO: replace with `const { data } = await axios.get("/api/buyer/licenses")`
// once the backend endpoint exists. Shape should match the License type.
export const dummyLicenses: License[] = [
  {
    id: "lic_001",
    datasetTitle: "Maize soil moisture - Eastern Province, 2025",
    sellerName: "Mwansa Family Farm",
    licenseKind: "time-limited",
    grantedDate: "2026-07-06",
    expiryDate: "2026-08-06",
    state: "active",
  },
  {
    id: "lic_002",
    datasetTitle: "Sorghum drought resilience trial - Southern Province",
    sellerName: "Mwansa Family Farm",
    licenseKind: "research-only",
    grantedDate: "2026-05-15",
    state: "active",
  },
  {
    id: "lic_003",
    datasetTitle: "Wheat hybrid yield trial - Northern Plains",
    sellerName: "Green Acres Cooperative",
    licenseKind: "time-limited",
    grantedDate: "2026-05-01",
    expiryDate: "2026-06-01",
    state: "expired",
  },
  {
    id: "lic_004",
    datasetTitle: "Cassava root growth sensor data - Central Region",
    sellerName: "Green Acres Cooperative",
    licenseKind: "one-time",
    grantedDate: "2026-07-16",
    state: "used",
  },
  {
    id: "lic_005",
    datasetTitle: "Rice paddy nitrogen levels - Lowveld",
    sellerName: "Zambezi Valley Farms",
    licenseKind: "one-time",
    grantedDate: "2026-07-20",
    state: "active",
  },
];