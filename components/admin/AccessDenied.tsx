'use client';

import { useEffect, useState } from 'react';

const AccessDenied = () => {
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            if (typeof window !== 'undefined') {
                window.history.back();
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-md text-center">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2 text-gray-700">You do not have permission to view this page.</p>
                <p className="mt-4 text-gray-600">Returning to the previous page in {seconds} seconds...</p>
            </div>
        </div>
    );
};

export default AccessDenied;
