import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

const AuthLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <section className='w-full relative'>
            {/* Background grid */}
            <div className="absolute inset-0 -z-10 w-full h-full bg-[linear-gradient(135deg,_#ff6ec4,_#7873f5,_#4ade80),_repeating-linear-gradient(to_right,_rgba(0,0,0,0.1)_0px,_rgba(0,0,0,0.1)_2px,_transparent_2px,_transparent_40px),_repeating-linear-gradient(to_bottom,_rgba(0,0,0,0.1)_0px,_rgba(0,0,0,0.1)_2px,_transparent_2px,_transparent_40px)] bg-[size:auto,_40px_40px,_40px_40px]">
            </div>
            {/* Centered content */}
            <div className="h-screen flex items-center justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </div>
        </section>
    )
}

export default AuthLayout