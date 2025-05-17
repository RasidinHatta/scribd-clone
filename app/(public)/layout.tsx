import { auth } from '@/auth';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import React from 'react';

const PublicLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = await auth()
    if (session?.user?.role === 'ADMIN') {
        return redirect("/admin");
    }
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 bg-background shadow-md">
                <Navbar />
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default PublicLayout;