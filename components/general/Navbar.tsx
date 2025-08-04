import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ModeToggle } from '../theme/ModeToggle'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../ui/sheet'
import { SignOutButton } from '../auth/SignOutButton'
import { auth } from '@/auth'
import UserAvatar from '../user/UserAvatar'
import SearchBar from './SearchBar'

/**
 * Navbar Component
 * 
 * The main navigation bar that appears at the top of every page.
 * Features responsive design with:
 * - Mobile hamburger menu (on small screens)
 * - Desktop navigation (on larger screens)
 * - Search functionality
 * - User authentication controls
 * - Theme toggle
 * 
 * Behavior:
 * - Shows different navigation items based on user role/permissions
 * - Displays authentication buttons when user is logged out
 * - Shows user avatar and dropdown when logged in
 */
const Navbar = async () => {
    // Get current session data
    const session = await auth()
    // Check if user has permission to upload documents
    const canUpload = session?.user?.role.createDocument

    return (
        <header className="border-b">
            {/* Main container */}
            <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
                {/* Left section: Logo and Mobile Menu */}
                <div className="flex items-center">
                    {/* Mobile hamburger menu (only visible on small screens) */}
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

                        {/* Mobile menu content */}
                        <SheetContent side="left" className="w-64 p-4 flex flex-col">
                            <SheetHeader>
                                {/* App logo */}
                                <Link
                                    href="/"
                                    className="font-bold text-lg transition-transform transform hover:scale-105 hover:text-primary"
                                >
                                    <SheetTitle>[S][A]</SheetTitle>
                                </Link>
                                {/* Navigation links */}
                                <Link
                                    href="/community"
                                    className="text-lg transition-transform transform hover:scale-105 hover:text-primary"
                                >
                                    Community
                                </Link>
                                {/* Conditional link based on user permissions */}
                                {canUpload && (
                                    <Link
                                        href="/my-documents"
                                        className="text-lg transition-transform transform hover:scale-105 hover:text-primary"
                                    >
                                        MyDocument
                                    </Link>
                                )}
                            </SheetHeader>

                            {/* Spacer to push bottom content down */}
                            <div className="flex-grow" />

                            {/* Bottom section of mobile menu */}
                            <div className="space-y-4">
                                {/* Upload button (conditional) */}
                                {canUpload && (
                                    <Button className="w-full justify-start" asChild>
                                        <Link href="/upload">Upload</Link>
                                    </Button>
                                )}

                                {/* User controls */}
                                <div className="flex items-center justify-between">
                                    {session ? (
                                        // Logged-in user menu
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
                                        // Logged-out buttons
                                        <>
                                            <Button asChild variant="outline">
                                                <Link href="/login">Login</Link>
                                            </Button>
                                            <Button asChild variant="default" className='text-secondary'>
                                                <Link href="/register">Register</Link>
                                            </Button>
                                        </>
                                    )}
                                    {/* Theme toggle */}
                                    <div className="ml-2 scale-90">
                                        <ModeToggle />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop logo and navigation links (hidden on mobile) */}
                    <div className='flex gap-4'>
                        <Link
                            href="/"
                            className="font-bold text-lg transition-transform transform hover:scale-105 hover:text-primary"
                        >
                            [S][A]
                        </Link>
                        <Link
                            href="/community"
                            className="text-lg transition-transform transform hover:scale-105 hover:text-primary hidden md:inline"
                        >
                            Community
                        </Link>
                        {canUpload && (
                            <Link
                                href="/my-documents"
                                className="text-lg transition-transform transform hover:scale-105 hover:text-primary hidden md:inline"
                            >
                                MyDocument
                            </Link>
                        )}
                    </div>
                </div>

                {/* Middle section: SearchBar (always visible) */}
                <div className="flex-1">
                    <SearchBar />
                </div>

                {/* Right section: Desktop Navigation (hidden on mobile) */}
                <nav className="hidden md:flex items-center space-x-4">
                    {/* Conditional upload button */}
                    {canUpload && (
                        <Button asChild className='text-secondary'>
                            <Link href="/upload">Upload</Link>
                        </Button>
                    )}
                    
                    {/* User controls */}
                    {session ? (
                        // Logged-in user dropdown
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
                        // Logged-out buttons
                        <>
                            <Button asChild variant="outline">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild variant="default" className='text-secondary'>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                    {/* Theme toggle */}
                    <ModeToggle />
                </nav>
            </div>
        </header>
    )
}

export default Navbar