import LicenseSplitChart from "./LicenseSplitChart";
import type { LicenseSplitItem } from "../../lib/api/analytics";

// Same chart as the farmer side's LicenseSplitChart — just a different
// title for the buyer's "purchases by license type" view. Kept as a
// separate named component so BuyerDashboard's imports read clearly,
// but there's no duplicated chart/loading/empty-state logic.
export default function PurchaseLicenseSplitChart({
  data,
}: {
  data: LicenseSplitItem[] | null;
}) {
  return <LicenseSplitChart title="Purchases by license type" data={data} />;
}