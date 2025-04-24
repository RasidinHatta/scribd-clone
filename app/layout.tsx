import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/toast/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAMS",
  description: "A document sharing platform with community discussions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider />
            <Navbar />
            <main>{children}</main>

            {/* ✅ Footer must be inside <body> */}
            <footer className="bg-muted-foreground text-background text-center py-8">
              <p className="text-sm">&copy; 2025 SAMS. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Use</a>
                <a href="#" className="hover:underline">Support</a>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
  );
}
