import TopPartiesTable from "../../../components/Dashboard/TopPartiesTable";
import type { TopParty } from "../../../lib/api/analytics";

export default function TopBuyersTable({
  buyers,
}: {
  buyers: TopParty[] | null;
}) {
  return (
    <TopPartiesTable
      title="Top buyers"
      partyLabel="Buyer"
      emptyMessage="No sales yet — once a listing is purchased, your top buyers will show up here."
      parties={buyers}
    />
  );
}
