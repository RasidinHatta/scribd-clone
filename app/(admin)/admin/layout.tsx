import Navbar from '@/components/admin/Navbar';
import SideMenu from '@/components/admin/SideMenu';
import { ActiveThemeProvider } from '@/components/theme/active-theme';
import { cookies } from 'next/headers';

const NAVBAR_HEIGHT = 64; // px

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");
  return (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      {/* Sticky Navbar at the top */}
      <div
        className="border-b sticky top-0 z-50 bg-background"
        style={{ height: NAVBAR_HEIGHT }}
      >
        <Navbar />
      </div>
      <div className="flex">
        {/* Sticky SideMenu on the left */}
        <div
          className="sticky overflow-auto"
          style={{
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            minWidth: '200px', // optional: set a min-width for your side menu
          }}
        >
          <SideMenu />
        </div>
        {/* Main content area */}
        <div className="w-full px-4 pt-8">{children}</div>
      </div>
    </ActiveThemeProvider>
  );
};

export default AdminLayout;