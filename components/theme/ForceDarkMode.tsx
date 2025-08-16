'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export const ForceDarkMode = ({ children }: { children: React.ReactNode }) => {
    const { setTheme } = useTheme()

    useEffect(() => {
        setTheme('dark')
    }, [setTheme])

    return <>{children}</>
}