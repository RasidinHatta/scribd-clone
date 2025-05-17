import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ModeToggle } from './theme/ModeToggle'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from './ui/sheet'
import SearchBar from './SearchBar'
import { SignOutButton } from './auth/SignOutButton'
import { auth } from '@/auth'
import UserAvatar from './user/UserAvatar'

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
                                <Link
                                    href="/"
                                    className="font-bold text-lg transition-transform transform hover:scale-105 hover:text-primary"
                                >
                                    <SheetTitle>SAMS</SheetTitle>
                                </Link>
                                <Link
                                    href="/community"
                                    className="text-lg transition-transform transform hover:scale-105 hover:text-primary"
                                >
                                    Community
                                </Link>
                            </SheetHeader>

                            <div className="flex-grow" />

                            {/* Bottom Section */}
                            <div className="space-y-4">
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/upload">Upload</Link>
                                </Button>

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
                                                        <Link href="/profile">Profile</Link>
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
                                    <div className="ml-2 scale-90">
                                        <ModeToggle />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className='flex gap-4'>
                        <Link
                            href="/"
                            className="font-bold text-lg transition-transform transform hover:scale-105 hover:text-primary"
                        >
                            SAMS
                        </Link>
                        <Link
                            href="/community"
                            className="text-lg transition-transform transform hover:scale-105 hover:text-primary hidden md:inline"
                        >
                            Community
                        </Link>
                    </div>
                </div>

                {/* Middle: SearchBar - always visible */}
                <div className="flex-1">
                    <SearchBar />
                </div>

                {/* Right: Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-4">
                    <Button asChild variant="ghost">
                        <Link href="/upload">Upload</Link>
                    </Button>

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
                                        <Link href="/profile">Profile</Link>
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
                </nav>
            </div>
        </header>
    )
}

export default Navbar