"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Users, Trophy, Gamepad2, User, MapPin, Megaphone, BookOpen, Newspaper, Star, Map, Gift, Zap, UserPlus } from "lucide-react"
import Starfield from "./starfield"
import AROverlay from "./ar-overlay"
import BottomNav from "./bottom-nav"
import { GameMap } from "./game-map"
import MapplsNativeMap from "./mappls-native-map"
import { UserProfile } from "./user-profile"
import SpinWheel from "./spin-wheel"
import ScratchCard from "./scratch-card"
import AuthModal from "./auth-modal"
import UserMenu from "./user-menu"
import { gameLocations, achievements } from "@/lib/mappls-config"

type Tab = "home" | "map" | "community" | "leaderboard" | "games" | "profile"

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "map", label: "Map", icon: Map },
  { key: "community", label: "Community", icon: Users },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
  { key: "games", label: "Games", icon: Gamepad2 },
  { key: "profile", label: "Profile", icon: User },
]

export default function XploraaAppShell() {
  const { data: session, status } = useSession()
  const [active, setActive] = useState<Tab>("home")
  const [userPoints, setUserPoints] = useState(1250)
  const [visitedLocations, setVisitedLocations] = useState<string[]>(["cafe-1", "landmark-1"])
  const [userStreak, setUserStreak] = useState(6)
  const [totalCoupons, setTotalCoupons] = useState(8)
  const [isDarkMode, setIsDarkMode] = useState(false) // Dark mode toggle state
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Handle location visits from the game map
  const handleLocationVisit = (locationId: string, points: number) => {
    if (!visitedLocations.includes(locationId)) {
      setVisitedLocations(prev => [...prev, locationId])
      setUserPoints(prev => prev + points)
      setTotalCoupons(prev => prev + 1)
      
      // Update streak logic (simplified)
      setUserStreak(prev => prev + 1)
    }
  }

  // User stats for profile
  const userStats = {
    totalPoints: userPoints,
    visitedLocations: visitedLocations,
    streak: userStreak,
    totalCoupons: totalCoupons,
    favoriteCategory: "cafe",
    joinDate: "Jan 2024",
    totalDistance: 12.5
  }

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background: Dynamic gradient */}
      <div className={`absolute inset-0 -z-10 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'
      }`} />
      <Starfield className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300 ${
        isDarkMode ? 'opacity-40' : 'opacity-20'
      }`} />

      {/* Layout: sidebar on md+, topbar + content */}
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar (desktop) - Theme aware */}
        <aside className={`hidden w-64 flex-none border-r backdrop-blur-lg shadow-lg md:block ${
          isDarkMode 
            ? 'border-gray-700 bg-gray-800/95' 
            : 'border-slate-200 bg-white/90'
        }`}>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 ring-2 ${
                  isDarkMode ? 'ring-blue-400' : 'ring-blue-200'
                }`} />
                <span className={`font-bold text-xl tracking-wide ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>Xploraa</span>
              </div>
              <p className={`mt-2 text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>Explore. Play. Earn.</p>
            </div>
            <nav className="grid gap-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    active === key 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105" 
                      : isDarkMode 
                        ? "hover:bg-gray-700 text-gray-300 hover:text-white hover:scale-102"
                        : "hover:bg-slate-100 text-slate-700 hover:text-slate-900 hover:scale-102",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </nav>
            
            {/* User Stats in Sidebar - Dark theme */}
            <div className="mt-8 space-y-3">
              <div className="rounded-xl border-2 border-emerald-600 p-4 bg-gradient-to-r from-emerald-900/50 to-green-900/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-full">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wide">Locations Visited</p>
                    <p className="text-lg font-bold text-emerald-100">{visitedLocations.length} / {gameLocations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border-2 border-amber-600 p-4 bg-gradient-to-r from-amber-900/50 to-orange-900/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-full">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-300 font-semibold uppercase tracking-wide">Points Earned</p>
                    <p className="text-lg font-bold text-amber-100">{userPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border-2 border-rose-600 p-4 bg-gradient-to-r from-rose-900/50 to-pink-900/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500 rounded-full">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-rose-300 font-semibold uppercase tracking-wide">Current Streak</p>
                    <p className="text-lg font-bold text-rose-100">{userStreak} days 🔥</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar - Theme aware */}
          <header className={`sticky top-0 z-10 border-b backdrop-blur-lg shadow-lg ${
            isDarkMode 
              ? 'border-gray-700 bg-gray-800/95' 
              : 'border-slate-200 bg-white/90'
          }`}>
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-8">
              <div className="flex items-center gap-3 md:hidden">
                <div className={`h-6 w-6 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 ring-2 ${
                  isDarkMode ? 'ring-blue-400' : 'ring-blue-200'
                }`} />
                <span className={`font-bold text-base ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>Xploraa</span>
              </div>
              <div className="hidden md:block">
                <span className={`text-pretty font-bold text-2xl ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {active === "map" && "🗺️ Interactive Map Explorer"}
                  {active === "profile" && "👤 Your Gaming Profile"}
                  {active === "home" && "🏠 Discover Your City"}
                  {active === "community" && "👥 Explorer Community"}
                  {active === "leaderboard" && "🏆 Top Explorers"}
                  {active === "games" && "🎮 Reward Games"}
                </span>
                <span className="ml-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 px-3 py-1 text-xs text-white font-semibold shadow-lg">
                  Adventure Edition
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } transition-colors duration-200`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </Button>
                
                {/* Authentication Section */}
                {session?.user ? (
                  <UserMenu 
                    user={session.user} 
                    userPoints={userPoints}
                    onNavigate={(tab) => setActive(tab as Tab)}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowAuthModal(true)}
                    className={`border ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 hover:from-purple-800/80 hover:to-blue-800/80 border-purple-500 text-purple-200' 
                        : 'bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 border-purple-300 text-purple-800'
                    }`}
                  >
                    <UserPlus className={`mr-2 h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className="font-bold">Login</span>
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg border-0"
                  onClick={() => setActive("map")}
                >
                  🚀 Start Exploring
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className={cn(
            "mx-auto w-full flex-1",
            active === "map" ? "max-w-full px-0 py-0" : "max-w-4xl px-4 py-6 md:px-8"
          )}>
            {active === "home" && <HomeSection userStats={userStats} onNavigate={setActive} isDarkMode={isDarkMode} />}
            {active === "map" && (
              <div className="h-screen w-full">
                {/* Use only your HTML MapPLS integration */}
                <MapplsNativeMap
                  userPoints={userPoints}
                  onLocationVisit={handleLocationVisit}
                  visitedLocations={visitedLocations}
                />
              </div>
            )}
            {active === "community" && <CommunitySection isDarkMode={isDarkMode} />}
            {active === "leaderboard" && <LeaderboardSection userPoints={userPoints} isDarkMode={isDarkMode} />}
            {active === "games" && <GamesSection userPoints={userPoints} totalCoupons={totalCoupons} onPointsUpdate={setUserPoints} isDarkMode={isDarkMode} />}
            {active === "profile" && (
              <UserProfile 
                userStats={userStats}
                onEditProfile={() => console.log("Edit profile")}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav active={active} onChange={setActive} />
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}

// Home: Theme aware
function HomeSection({ userStats, onNavigate, isDarkMode }: { userStats: any; onNavigate: (tab: Tab) => void; isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner - Theme aware */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white border-purple-500">
        {/* Background Image with 60% opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(/arcade-background.png)' }}
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/40" />
        <CardContent className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Welcome back, Explorer! 🎮</h1>
              <p className="text-white/95 mb-4 drop-shadow-md">Ready to discover amazing places around you?</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-white">{userStats.totalPoints} XP</span>
                </div>
                <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-white">{userStats.streak} day streak</span>
                </div>
              </div>
            </div>
            <div className="text-4xl drop-shadow-lg">🗺️</div>
          </div>
        </CardContent>
      </Card>

      <TilesGrid onNavigate={onNavigate} isDarkMode={isDarkMode} />
      <section className="grid gap-6 md:grid-cols-2">
        <ScheduleCard isDarkMode={isDarkMode} />
        <AROverlay />
      </section>
    </div>
  )
}

function TilesGrid({ onNavigate, isDarkMode }: { onNavigate: (tab: Tab) => void; isDarkMode: boolean }) {
  const tiles = useMemo(
    () => [
      { 
        title: "🏆 Leaderboard", 
        desc: "See top explorers", 
        accent: "text-yellow-400", 
        bg: isDarkMode ? "from-yellow-900/40 to-orange-900/40" : "from-yellow-50 to-orange-50", 
        border: isDarkMode ? "border-yellow-600" : "border-yellow-200", 
        tab: "leaderboard" as Tab 
      },
      { 
        title: "🗺️ Explore Map", 
        desc: "Find nearby rewards", 
        accent: "text-blue-400", 
        bg: isDarkMode ? "from-blue-900/40 to-indigo-900/40" : "from-blue-50 to-indigo-50", 
        border: isDarkMode ? "border-blue-600" : "border-blue-200", 
        tab: "map" as Tab 
      },
      { 
        title: "👥 Community", 
        desc: "Join explorers", 
        accent: "text-purple-400", 
        bg: isDarkMode ? "from-purple-900/40 to-pink-900/40" : "from-purple-50 to-pink-50", 
        border: isDarkMode ? "border-purple-600" : "border-purple-200", 
        tab: "community" as Tab 
      },
      { 
        title: "🎮 Play Games", 
        desc: "Spin & win rewards", 
        accent: "text-green-400", 
        bg: isDarkMode ? "from-green-900/40 to-emerald-900/40" : "from-green-50 to-emerald-50", 
        border: isDarkMode ? "border-green-600" : "border-green-200", 
        tab: "games" as Tab 
      },
      { 
        title: "🏅 Achievements", 
        desc: "Track progress", 
        accent: "text-indigo-400", 
        bg: isDarkMode ? "from-indigo-900/40 to-purple-900/40" : "from-indigo-50 to-purple-50", 
        border: isDarkMode ? "border-indigo-600" : "border-indigo-200", 
        tab: "profile" as Tab 
      },
      { 
        title: "🎁 Rewards", 
        desc: "Claim coupons", 
        accent: "text-red-400", 
        bg: isDarkMode ? "from-red-900/40 to-pink-900/40" : "from-red-50 to-pink-50", 
        border: isDarkMode ? "border-red-600" : "border-red-200", 
        tab: "profile" as Tab 
      },
    ],
    [isDarkMode],
  )
  
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className={`text-pretty font-serif text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🚀 Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.title} className={`bg-gradient-to-r ${t.bg} border ${t.border} shadow-lg backdrop-blur hover:shadow-xl transition-all cursor-pointer hover:scale-105`} onClick={() => onNavigate(t.tab)}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.title}</CardTitle>
              <CardDescription className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{t.desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="secondary" size="sm" className={`w-full font-medium border-none ${
                isDarkMode 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}>
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ScheduleCard({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <Card className={`shadow-lg backdrop-blur ${
      isDarkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/90 border-slate-200'
    }`}>
      <CardHeader>
        <CardTitle className={`text-sm flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          📅 Today's Adventures
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-300' : 'text-slate-600'}>Recommended for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`flex items-center justify-between rounded-md border p-3 ${
          isDarkMode 
            ? 'border-green-600 bg-green-900/30' 
            : 'border-green-200 bg-green-50'
        }`}>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>☕ Visit Coffee Culture</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>0.8 km away • 100 XP + 10% OFF coupon</p>
          </div>
          <Button size="sm" variant="outline" className={
            isDarkMode 
              ? 'bg-green-800/50 border-green-500 text-green-300 hover:bg-green-700/70' 
              : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
          }>
            Navigate
          </Button>
        </div>
        <div className={`flex items-center justify-between rounded-md border p-3 ${
          isDarkMode 
            ? 'border-blue-600 bg-blue-900/30' 
            : 'border-blue-200 bg-blue-50'
        }`}>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🏛️ Explore Historic Palace</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>1.2 km away • 250 XP + Heritage Hunter badge</p>
          </div>
          <Button size="sm" variant="outline" className={
            isDarkMode 
              ? 'bg-blue-800/50 border-blue-500 text-blue-300 hover:bg-blue-700/70' 
              : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
          }>
            View
          </Button>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Avatar className={`h-6 w-6 ring-2 ${isDarkMode ? 'ring-gray-600' : 'ring-slate-300'}`}>
            <AvatarImage src="/diverse-user-avatars.png" alt="A" />
            <AvatarFallback className={
              isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-slate-100 text-slate-800'
            }>A</AvatarFallback>
          </Avatar>
          <Avatar className={`h-6 w-6 ring-2 ${isDarkMode ? 'ring-gray-600' : 'ring-slate-300'}`}>
            <AvatarImage src="/diverse-user-avatars.png" alt="B" />
            <AvatarFallback className={
              isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-slate-100 text-slate-800'
            }>B</AvatarFallback>
          </Avatar>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>2 friends are exploring nearby! 👋</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Community - Dark theme
function CommunitySection({ isDarkMode }: { isDarkMode: boolean }) {
  const communityPosts = [
    { user: "Aarav K.", location: "Coffee Culture", activity: "Earned Coffee Explorer badge", points: 300, time: "2h ago", avatar: "/diverse-professional-profiles.png" },
    { user: "Priya S.", location: "Rajwada Palace", activity: "Completed heritage trail", points: 500, time: "4h ago", avatar: "/diverse-user-avatars.png" },
    { user: "Rahul M.", location: "Phoenix Mall", activity: "Shopping spree reward unlocked", points: 180, time: "6h ago", avatar: "/diverse-avatars.png" },
  ]

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-purple-600">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            🌟 Community Highlights
          </CardTitle>
          <CardDescription className="text-gray-300">See what fellow explorers are up to!</CardDescription>
        </CardHeader>
      </Card>

      {communityPosts.map((post, i) => (
        <Card key={i} className="bg-gray-800/70 border-gray-700 shadow-lg backdrop-blur hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-purple-400">
                <AvatarImage src={post.avatar} alt="profile" />
                <AvatarFallback className="bg-purple-700 text-purple-200">{post.user[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-bold text-white">{post.user}</CardTitle>
                <CardDescription className="text-xs text-gray-300">{post.time} • {post.location}</CardDescription>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-800/60 to-orange-800/60 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs font-bold text-orange-300">+{post.points}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-200">
              🎉 {post.activity}! 
              <span className="font-semibold text-purple-400 ml-1">+{post.points} XP earned</span>
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="bg-purple-800/50 text-purple-300 hover:bg-purple-700/70 border-purple-600">
                👏 Celebrate
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                💬 Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Dark Leaderboard
function LeaderboardSection({ userPoints, isDarkMode }: { userPoints: number; isDarkMode: boolean }) {
  const leaderboardData = [
    { rank: 1, name: "Aarav Sharma", pts: 2840, title: "Local Legend", streak: 12, badge: "👑" },
    { rank: 2, name: "Priya Gupta", pts: 2650, title: "Explorer Elite", streak: 8, badge: "🏆" },
    { rank: 3, name: "Rahul Verma", pts: 2430, title: "Adventure King", streak: 15, badge: "🥉" },
    { rank: 4, name: "Sneha Patel", pts: 2210, title: "Trail Blazer", streak: 6, badge: "🌟" },
    { rank: 5, name: "You", pts: userPoints, title: "Rising Star", streak: 6, badge: "🚀" },
  ]

  return (
    <div className="space-y-6">
      {/* Weekly Challenge - Dark */}
      <Card className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white border-yellow-500">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">🏆 Weekly Challenge</h2>
          <p className="text-white/90 mb-3">Visit 10 different locations to win the "Explorer Elite" badge!</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${(5/10) * 100}%` }}></div>
            </div>
            <span className="font-bold">5/10</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/70 border-gray-700 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              🏆 Leaderboard
            </span>
            <span className="text-sm font-normal text-gray-300">This Week</span>
          </CardTitle>
          <CardDescription className="text-gray-300">Top explorers in your area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboardData.map((player) => (
            <div key={player.rank} className={`flex items-center justify-between rounded-lg p-4 border transition-all ${
              player.name === "You" 
                ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-purple-500 shadow-md" 
                : "bg-gray-700/50 border-gray-600 hover:bg-gray-600/50"
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{player.badge}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-sm font-bold text-white">
                    {player.rank}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{player.name}</p>
                  <p className="text-xs text-gray-300">{player.title} • {player.streak} day streak 🔥</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-400">{player.pts.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Dark Games Section
function GamesSection({ userPoints, totalCoupons, onPointsUpdate, isDarkMode }: { userPoints: number; totalCoupons: number; onPointsUpdate: (points: number) => void; isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      {/* Rewards Summary - Dark */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-green-500">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">🎮 Your Rewards Hub</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{userPoints.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCoupons}</div>
              <div className="text-white/80 text-sm">Coupons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-white/80 text-sm">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Spin Wheel - Dark */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-600">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              🎡 Daily Spin Wheel
            </CardTitle>
            <CardDescription className="text-gray-300">Free spin every 24 hours!</CardDescription>
          </CardHeader>
          <CardContent>
            <SpinWheel onReward={(reward) => {
              onPointsUpdate(userPoints + reward.points)
            }} />
          </CardContent>
        </Card>

        {/* Scratch Card - Dark */}
        <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-600">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              🎫 Scratch & Win
            </CardTitle>
            <CardDescription className="text-gray-300">Scratch to reveal prizes!</CardDescription>
          </CardHeader>
          <CardContent>
            <ScratchCard onReveal={(prize) => {
              onPointsUpdate(userPoints + prize.points)
            }} />
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges - Dark */}
      <Card className="bg-gray-800/70 border-gray-700 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            🎯 Daily Challenges
          </CardTitle>
          <CardDescription className="text-gray-300">Complete these to earn bonus rewards!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { task: "Visit 2 cafes", progress: 1, total: 2, reward: "150 XP + Coffee Lover badge", completed: false },
            { task: "Take 5 photos at landmarks", progress: 3, total: 5, reward: "200 XP + Photography Pro badge", completed: false },
            { task: "Check in during peak hours", progress: 1, total: 1, reward: "100 XP + Early Bird coupon", completed: true },
          ].map((challenge, i) => (
            <div key={i} className={`p-3 rounded-lg border ${challenge.completed ? 'bg-green-900/30 border-green-600' : 'bg-gray-700/50 border-gray-600'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">{challenge.task}</p>
                <div className="text-sm">
                  {challenge.completed ? (
                    <span className="text-green-400 font-bold">✅ Completed</span>
                  ) : (
                    <span className="text-gray-300">{challenge.progress}/{challenge.total}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-600 rounded-full h-2 mr-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-300">🎁 {challenge.reward}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
