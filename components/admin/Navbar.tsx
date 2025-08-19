import { auth } from '@/auth'
import Link from 'next/link'
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Menu } from 'lucide-react'
import { SignOutButton } from '../auth/SignOutButton'
import { ModeToggle } from '../theme/ModeToggle'
import { Button } from '../ui/button'
import UserAvatar from '../user/UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ThemeSelector } from '../theme/theme-selector'

const Navbar = async () => {
    const session = await auth()
    return (
        <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
                {/* Left: Logo and Mobile Menu */}
                <div className="flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden mr-2"
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-64 p-4 flex flex-col">
                            <SheetHeader>
                                <SheetTitle>SAMS</SheetTitle>
                            </SheetHeader>

                            <div className="flex-grow" />

                            {/* Bottom Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    {session ? (
                                        <>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                        <UserAvatar />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin/profile">Profile</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <SignOutButton />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    ) : (
                                        <>
                                            <Button asChild variant="outline">
                                                <Link href="/login">Login</Link>
                                            </Button>
                                            <Button asChild variant="default">
                                                <Link href="/register">Register</Link>
                                            </Button>
                                        </>
                                    )}
                                    <div className="ml-2 scale-90 gap-2">
                                        <ModeToggle />
                                        <ThemeSelector />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className='flex gap-4'>
                        SAMS
                    </div>
                </div>
                <nav className="hidden md:flex items-center space-x-4">
                    {session ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <UserAvatar />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <SignOutButton />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild variant="default">
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                    <ModeToggle />
                    <ThemeSelector />
                </nav>
            </div>
        </header>
    )
}

export default Navbar