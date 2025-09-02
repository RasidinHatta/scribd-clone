import React from 'react'
import { Card, CardContent } from '../ui/card'
import AuthHeader from './AuthHeader'
import AuthFooter from './AuthFooter'
import Link from 'next/link'
import Image from 'next/image'

interface CardWrapperProps {
    children: React.ReactNode
    agreement?: boolean
    headerLabel: string
    description: string
    label?: string
    href?: string
    question?: string
    admin?: boolean
}

const AuthCardWrapper = ({
    children,
    agreement = false,
    headerLabel,
    description,
    label,
    href,
    question,
    admin = false
}: CardWrapperProps) => {
    const imageBackGround = admin
        ? "/background/adminAuthBackground.avif"
        : "/background/authBackground.avif";
    return (
        <>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="flex flex-col gap-6 p-6 md:p-8">
                        <AuthHeader headerLabel={headerLabel} description={description} />
                        {children}
                        <AuthFooter label={label} href={href} question={question} />
                    </div>
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src={imageBackGround}
                            alt="Authentication Background"
                            fill
                            className="absolute inset-0 object-cover"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>

            {agreement && (
                <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                    By clicking continue, you agree to our{" "}
                    <Link href="/terms">Terms of Service</Link> and{" "}
                    <Link href="/privacy">Privacy Policy</Link>.
                </div>
            )}
        </>
    )
}

export default AuthCardWrapper