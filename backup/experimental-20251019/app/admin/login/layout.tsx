import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ადმინ პანელი - Lumina Estate",
  description: "ადმინისტრატორის პანელი - Lumina Estate",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-login-layout">
      {children}
    </div>
  );
} 