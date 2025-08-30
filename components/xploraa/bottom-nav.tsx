"use client"

import { Home, Search, Gift, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Tab = "home" | "community" | "leaderboard" | "games" | "profile"

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const items = [
    { key: "home" as const, icon: Home, label: "Home" },
    { key: "community" as const, icon: Users, label: "Community" },
    { key: "games" as const, icon: Gift, label: "Games" },
    { key: "leaderboard" as const, icon: Search, label: "Leaderboard" },
    { key: "profile" as const, icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-background/80 backdrop-blur border-t border-border/60">
      <div className="mx-auto max-w-md px-4 py-2 pb-safe">
        <div className="grid grid-cols-5 gap-2 items-center">
          {items.slice(0, 2).map((item) => (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={cn(
                "flex flex-col items-center text-xs py-1 transition-colors",
                active === item.key ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
          {/* Center raised action button */}
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              onClick={() => onChange("games")}
              aria-label="Games and rewards"
            >
              <Gift className="h-5 w-5" />
            </Button>
          </div>
          {items.slice(3).map((item) => (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={cn(
                "flex flex-col items-center text-xs py-1 transition-colors",
                active === item.key ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
