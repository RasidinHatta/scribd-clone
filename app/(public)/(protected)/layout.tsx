import { SessionWatcher } from '@/components/auth/SessionWatcher';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

const ProtectedLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <SessionProvider>
            <SessionWatcher />
            {children}
        </SessionProvider>
    );
};

export default ProtectedLayout;