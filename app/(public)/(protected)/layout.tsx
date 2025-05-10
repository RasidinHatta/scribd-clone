import { auth } from '@/auth';
import AutoLogout from '@/components/auth/AutoLogout';
import { redirect } from 'next/navigation';
import React from 'react';

const ProtectedLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = await auth()
    if (!session) return redirect("/login")
    return (
        <main>
            <AutoLogout timeout={20 * 1000} />
            {children}
        </main>
    );
};

export default ProtectedLayout;