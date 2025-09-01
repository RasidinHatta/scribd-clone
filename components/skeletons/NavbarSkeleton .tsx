import { Skeleton } from "@/components/ui/skeleton"

const NavbarSkeleton = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left section: Logo + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger (only visible on small screens) */}
          <Skeleton className="h-9 w-9 rounded-md md:hidden" />

          {/* Logo */}
          <Skeleton className="h-8 w-24 rounded-md" />

          {/* Desktop nav links */}
          <Skeleton className="h-6 w-20 hidden md:block" /> {/* Community */}
          <Skeleton className="h-6 w-28 hidden md:block" /> {/* MyDocument */}
        </div>

        {/* Middle section: SearchBar */}
        <div className="flex-1">
          <Skeleton className="h-9 w-full max-w-md rounded-md" />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Desktop buttons */}
          <Skeleton className="h-9 w-20 rounded-md hidden md:block" /> {/* Upload/Login */}
          <Skeleton className="h-9 w-20 rounded-md hidden md:block" /> {/* Register */}
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar/User */}
          <Skeleton className="h-6 w-6 rounded-md" /> {/* Theme toggle */}
        </div>
      </div>
    </header>
  )
}

export default NavbarSkeleton