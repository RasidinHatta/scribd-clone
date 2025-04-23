"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ModeToggle } from './theme/ModeToggle'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger
} from './ui/sheet'
import SearchBar from './SearchBar'
import { SignOut } from './auth/SignOut'

const Navbar = () => {
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
                                <Link href="/" className="font-bold text-lg">
                                    SAMS
                                </Link>
                            </SheetHeader>

                            <div className="flex-grow" />

                            {/* Bottom Section */}
                            <div className="space-y-4">
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/upload">Upload</Link>
                                </Button>

                                <div className="flex items-center justify-between">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="px-2 py-1.5 flex items-center space-x-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <span>Account</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="start" side="top">
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile">Profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin">Admin</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500">
                                                <SignOut />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div className="ml-2 scale-90">
                                        <ModeToggle />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="font-bold text-lg">
                        SAMS
                    </Link>
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem asChild>
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin">Admin</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                                <SignOut />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ModeToggle />
                </nav>
            </div>
        </header>
    )
}

export default Navbar