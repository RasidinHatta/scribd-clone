import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/toast/ToastProvider";
import AutoLogout from "@/components/auth/AutoLogout";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
