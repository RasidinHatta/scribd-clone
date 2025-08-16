import { ForceDarkMode } from '@/components/theme/ForceDarkMode'
import React, { Suspense } from 'react'
import Image from 'next/image'

const AuthLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <section className='w-full relative h-screen dark'>
            {/* Background with optimized Next.js Image */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <picture>
                    <source srcSet="/background/authBackground.avif" type="image/avif" />
                    <source srcSet="/background/authBackground.webp" type="image/webp" />
                    <Image
                        src="/background/authBackground.jpg"
                        alt="Abstract background"
                        className="h-full w-full object-cover"
                        fill
                        priority={false}
                        quality={80}
                        sizes="100vw"
                    />
                </picture>
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
            </div>

            {/* Centered content with proper min-height */}
            <div className="h-screen flex items-center justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <ForceDarkMode>
                        {children}
                    </ForceDarkMode>
                </Suspense>
            </div>
        </section>
    )
}

export default AuthLayout