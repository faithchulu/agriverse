import AuthGate from "@/components/Auth/AuthGate";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGate requiredRole="FARMER">{children}</AuthGate>;
}