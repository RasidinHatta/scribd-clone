import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SiteHeader } from "@/components/navigation/site-header";
import { ActiveThemeProvider } from "@/components/theme/active-theme"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  return (
    <SessionProvider >

      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ActiveThemeProvider>
    </SessionProvider>
  )
};

export default AdminLayout;