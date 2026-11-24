"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LogOut, Search, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEditorStore } from "../editor/_components/store"

const Header = () => {
  const { data: session } = useSession()
  const { searchQuery, setSearchQuery } = useEditorStore()

  const HandleLogout = () => signOut({ callbackUrl: "/" })

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-4 sm:px-6 fixed top-0 left-[72px] right-0 z-10">
      <div className="flex-1 max-w-2xl mx-auto relative">
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-9 py-6 border-gray-200 bg-gray-50 focus-visible:ring-purple-300 focus-visible:border-purple-400"
          placeholder="Search your designs"
          aria-label="Search your designs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-5 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none cursor-pointer">
              <Avatar>
                <AvatarImage src={session?.user?.image || "/user.png"} alt={session?.user?.name || "User"} />
                <AvatarFallback>{session?.user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm hidden lg:block font-medium">{session?.user?.name || "User"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={HandleLogout} className="cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-bold">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
