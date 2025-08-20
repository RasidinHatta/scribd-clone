import { auth } from '@/auth'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { SignOutButton } from '../auth/SignOutButton'
import { ModeToggle } from '../theme/ModeToggle'
import { Button } from '../ui/button'
import UserAvatar from '../user/UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ThemeSelector } from '../theme/theme-selector'

const Navbar = async () => {
  const session = await auth()
  
  const AuthButtons = () => (
    <>
      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild variant="default">
        <Link href="/register">Register</Link>
      </Button>
    </>
  )

  const UserMenu = () => (
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
  )

  const ThemeControls = () => (
    <div className="flex items-center gap-2">
      <ThemeSelector />
      <ModeToggle />
    </div>
  )

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left: Logo and Mobile Menu */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
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
                  <div className="ml-2 scale-90">
                    <ThemeControls />
                  </div>
                  {session ? <UserMenu /> : <AuthButtons />}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex gap-4">SAMS</div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <ThemeControls />
          {session ? <UserMenu /> : <AuthButtons />}
        </nav>
      </div>
    </header>
  )
}

export default Navbar