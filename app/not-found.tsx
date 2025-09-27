import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="max-w-md md:max-w-lg text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
                <Image
                    src="/background/catImage.png"
                    alt='cat'
                    width={500} // Fallback width for Next.js Image optimization
                    height={500} // Fallback height for Next.js Image optimization
                    className="mx-auto w-full max-w-[300px] md:max-w-[500px] h-auto mb-4" // Responsive sizing
                />
                <p className="text-base md:text-lg text-muted-foreground mb-8">
                    Oops! It looks like the page you're looking for has vanished or doesn't exist.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90 text-secondary px-6 py-3 md:px-8 md:py-4 rounded-lg transition-colors">
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage