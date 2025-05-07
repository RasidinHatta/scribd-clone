import { auth } from '@/auth';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import React from 'react';

const ProtectedLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = await auth()
    if(!session) return redirect("/login")
    return (
        <main>{children}</main>
    );
};

export default ProtectedLayout;