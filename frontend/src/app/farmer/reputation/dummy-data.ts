import type { Review, Dispute } from "../../../types/Dispute";

// TODO: replace with `const { data } = await axios.get("/api/farmer/reputation")`
// once the backend endpoint exists.
export const dummyReviews: Review[] = [
  {
    id: "rev_001",
    buyerName: "GreenGrain Research Co.",
    datasetTitle: "Hybrid wheat yield records — Northern Plains",
    rating: 5,
    comment:
      "Clean, well-documented data. Sampling method was exactly as described.",
    date: "2026-05-22",
  },
  {
    id: "rev_002",
    buyerName: "AgriSeed Labs",
    datasetTitle: "Maize soil moisture — Eastern Province, 2025",
    rating: 4,
    comment: "Good dataset, would have liked a bit more metadata on sensor calibration.",
    date: "2026-07-08",
  },
  {
    id: "rev_003",
    buyerName: "Kalundu Agri University",
    datasetTitle: "Soybean pest incidence log — Copperbelt",
    rating: 5,
    comment: "Exactly what our research team needed. Fast delivery too.",
    date: "2026-06-14",
  },
  {
    id: "rev_004",
    buyerName: "Highveld Seed Traders",
    datasetTitle: "Cassava root growth sensor data — Central Region",
    rating: 3,
    comment: "Data was fine but a few gaps in the date range that weren't flagged upfront.",
    date: "2026-07-14",
  },
];

export const dummyDisputes: Dispute[] = [
  {
    id: "dsp_001",
    buyerName: "Highveld Seed Traders",
    datasetTitle: "Cassava root growth sensor data — Central Region",
    reason: "Buyer flagged missing entries for two weeks in the sample range.",
    status: "open",
    date: "2026-07-13",
  },
  {
    id: "dsp_002",
    buyerName: "FarmTech Analytics",
    datasetTitle: "Sorghum drought resilience trial — Southern Province",
    reason: "Buyer claimed the data didn't match the listed sampling method.",
    status: "resolved",
    date: "2026-04-24",
  },
];

// Rating counts, index 0 = five-star, index 4 = one-star
export const ratingBreakdown = [18, 6, 2, 1, 0];