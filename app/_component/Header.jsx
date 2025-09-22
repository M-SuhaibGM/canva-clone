"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LogOut, Search } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

const Header = () => {
  const { data: session } = useSession()

  const HandleLogout = async () => {
    await signOut()

  }
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center  px-6 fixed top-0 left-[72px] right-0 z-10">
      <div className="flex-1 max-w-2xl mx-auto relative">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5 " />
        <Input
          className="pl-10 py-6 border-gray-200 bg-gray-50 focus:visible:ring-pu "
          placeholder="Search your Projects and Canva's"
        />

      </div>
      <div className="flex item-center gap-5 ml-4 ">
        <div className="flex items-center gap-1 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session?.user?.image ||"/user.png"  } alt={session?.user?.name} />
                </Avatar>
                <span className=" text-sm hidden lg:block font-medium">{session?.user?.name || "User"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={HandleLogout} >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="font-bold">Logout</span>
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header