import { auth } from "@/auth"; // Adjust import if your auth helper is located elsewhere
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session) redirect("/"); // Redirect to homepage if already logged in

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-mdrounded-2xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
}
