"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = React.useCallback(() => {
        if (typeof window === "undefined") return

        const switchTheme = () => {
            setTheme(theme === "light" ? "dark" : "light")
        }

        if (!document.startViewTransition) {
            switchTheme()
            return
        }

        document.startViewTransition(switchTheme)
    }, [theme, setTheme])

    return (
        <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="w-9 p-0 h-9 relative group"
            name="Theme Toggle Button"
        >
            <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Theme Toggle </span>
        </Button>
    )
}