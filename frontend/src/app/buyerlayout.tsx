import AuthGate from "@/components/Auth/AuthGate";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGate requiredRole="BUYER">{children}</AuthGate>;
}