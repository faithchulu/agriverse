import TopPartiesTable from "../../../components/Dashboard/TopPartiesTable";
import type { TopParty } from "../../../lib/api/analytics";

export default function TopSellersTable({ sellers }: { sellers: TopParty[] | null }) {
  return (
    <TopPartiesTable
      title="Sellers you buy from most"
      partyLabel="Seller"
      emptyMessage="No purchases yet — once you buy a dataset, sellers will show up here."
      parties={sellers}
    />
  );
}