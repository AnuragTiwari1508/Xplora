"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
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
import { User, Trophy, Settings, LogOut, Star } from "lucide-react"

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  userPoints: number
  onNavigate: (tab: string) => void
  isDarkMode?: boolean
}

export default function UserMenu({ user, userPoints, onNavigate, isDarkMode = false }: UserMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 p-1 h-auto rounded-full ${
            isDarkMode 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Avatar className="h-8 w-8 ring-2 ring-gradient-to-r ring-blue-500">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm">
              {user.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-left">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {user.name || "Explorer"}
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className={`text-xs font-bold ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  {userPoints.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={`w-56 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
      >
        <DropdownMenuLabel className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name || "Explorer"}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                <Star className="h-3 w-3 text-white" />
                <span className="text-xs font-bold text-white">
                  {userPoints.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className={isDarkMode ? 'border-gray-700' : 'border-gray-200'} />
        
        <DropdownMenuItem 
          onClick={() => onNavigate("profile")}
          className={`cursor-pointer ${
            isDarkMode 
              ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' 
              : 'text-slate-700 hover:bg-gray-100 focus:bg-gray-100'
          }`}
        >
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onNavigate("leaderboard")}
          className={`cursor-pointer ${
            isDarkMode 
              ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' 
              : 'text-slate-700 hover:bg-gray-100 focus:bg-gray-100'
          }`}
        >
          <Trophy className="mr-2 h-4 w-4" />
          <span>Leaderboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`cursor-pointer ${
            isDarkMode 
              ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' 
              : 'text-slate-700 hover:bg-gray-100 focus:bg-gray-100'
          }`}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={isDarkMode ? 'border-gray-700' : 'border-gray-200'} />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className={`cursor-pointer ${
            isDarkMode 
              ? 'text-red-400 hover:bg-gray-700 focus:bg-gray-700' 
              : 'text-red-600 hover:bg-red-50 focus:bg-red-50'
          }`}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
