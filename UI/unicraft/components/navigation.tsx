"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, User, LogOut, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface NavigationProps {
  userType?: "student" | "tutor" | "admin"
  userName?: string
  userInitials?: string
}

export function Navigation({ userType, userName, userInitials }: NavigationProps) {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  const getProfileLink = () => {
    return "/profile"
  }

  const handleLogout = async () => {
    await logout()
  }

  const isAuthPage = pathname === "/signin" || pathname === "/signup"

  if (isAuthPage) {
    return (
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo-blue.png" 
              alt="UniCraft" 
              width={200} 
              height={60}
              className="w-36 h-14"
            />
          </Link>
        </div>
      </header>
    )
  }

  const isHomePage = pathname === "/"

  if (isHomePage) {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="UniCraft" 
              width={200} 
              height={60}
              className="w-36 h-14"
            />
          </Link>
          <div className="flex items-center gap-4 relative z-50">
            <Link href="/find-mentor" className="relative z-50">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 px-6 py-2 cursor-pointer relative z-50"
              >
                Find your Mentor
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/find-mentor" className="relative z-50">
                  <Button
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 cursor-pointer relative z-50"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 cursor-pointer relative z-50"
                >
                  Logout
                </Button>
              </div>
                    ) : (
                      <Link href="/signin" className="relative z-50">
                        <Button
                          variant="outline"
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 cursor-pointer relative z-50"
                        >
                          Sign In
                        </Button>
                      </Link>
                    )}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="UniCraft" 
              width={200} 
              height={60}
              className="w-20 h-14"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/find-mentor"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/find-mentor" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Find Mentors
            </Link>
            {isAuthenticated && (
              <Link
                href="/bookings"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/bookings" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                My Bookings
              </Link>
            )}
            {(user?.user_type === "admin" || userType === "admin") && (
              <Link
                href="/profile/admin"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/profile/admin" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={userName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user ? `${user.first_name} ${user.last_name}` : userName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user?.user_type || userType}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={getProfileLink()}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/find-mentor">
                  <Search className="mr-2 h-4 w-4" />
                  <span>Find Mentors</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
