import Navbar from '@/components/admin/Navbar';
import SideMenu from '@/components/admin/SideMenu';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="border-b">
                <Navbar />
            </div>
            <div className="flex">
                <SideMenu />
                <div className="w-full px-4 pt-8">{children}</div>
            </div>
        </>
    );
};

export default AdminLayout;
