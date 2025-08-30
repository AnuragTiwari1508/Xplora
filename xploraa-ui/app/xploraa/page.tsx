"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Trophy, Crown, Gift, Leaf, Users } from "lucide-react"
import { AROverlay } from "@/components/xploraa/ar-overlay"
import { SpinWheel } from "@/components/xploraa/spin-wheel"
import { ScratchCard } from "@/components/xploraa/scratch-card"
import { Leaderboard } from "@/components/xploraa/leaderboard"
import { BadgesShowcase } from "@/components/xploraa/badges"
import { Streaks } from "@/components/xploraa/streaks"
import { SeasonalSpecials } from "@/components/xploraa/seasonal-specials"
import { TouristMode } from "@/components/xploraa/tourist-mode"
import { BottomNav } from "@/components/xploraa/bottom-nav"

export default function XploraaPage() {
  const [showWheel, setShowWheel] = useState(false)
  const [showScratch, setShowScratch] = useState(false)
  const [tab, setTab] = useState("community")

  return (
    <main className="mx-auto max-w-md min-h-[100dvh] bg-white text-gray-900 flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-balance">Xploraa</h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-600">Level 7</Badge>
            <Button size="icon" variant="outline" aria-label="Profile">
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <section className="flex-1 overflow-y-auto pb-24">
        <Tabs value={tab} className="w-full">
          <TabsContent value="community" className="m-0">
            {/* Feed card resembling reference style */}
            <article className="p-4">
              <div className="rounded-2xl border shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Nearby event at BeanCraft Café</p>
                    <p className="text-xs text-gray-500">2 hours ago • 1.2 km</p>
                  </div>
                  <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                    Treasure live
                  </Badge>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <AROverlay />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="mr-2 h-4 w-4" /> Check-in
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowWheel(true)}>
                    <Gift className="mr-2 h-4 w-4" /> Spin
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowScratch(true)}>
                    <Crown className="mr-2 h-4 w-4" /> Scratch
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-teal-600" />
                  <span>3 new records in your circle</span>
                </div>
              </div>
            </article>

            <div className="px-4 space-y-6">
              <Leaderboard />
              <BadgesShowcase />
              <Streaks />
              <SeasonalSpecials />
              <TouristMode />
            </div>
          </TabsContent>

          <TabsContent value="map" className="m-0">
            <div className="p-4 space-y-4">
              <div className="rounded-2xl border shadow-sm overflow-hidden">
                <AROverlay />
              </div>
              <div className="rounded-xl bg-teal-50 border p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Eco Walk Challenge</p>
                  <p className="text-xs text-gray-600">Walk 3 km today to earn Green Points</p>
                </div>
                <Badge className="bg-teal-600">
                  <Leaf className="mr-1 h-4 w-4" /> +50
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="m-0">
            <div className="p-4 space-y-4">
              <div className="rounded-2xl border shadow-sm p-4">
                <h3 className="font-semibold mb-2">Your Rewards</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-sm">20% off at BeanCraft</span>
                    <Badge variant="secondary">Active</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Free pastry after 5 visits</span>
                    <Badge variant="secondary">Progress 3/5</Badge>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border shadow-sm p-4">
                <h3 className="font-semibold mb-2">Titles</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-teal-600">Coffee King</Badge>
                  <Badge variant="outline">Book Explorer</Badge>
                  <Badge variant="outline">Trail Tactician</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <BottomNav />

      {/* Bottom sheets */}
      {showWheel && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200 mb-3" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Spin the Wheel</h2>
              <Button variant="ghost" onClick={() => setShowWheel(false)}>
                Close
              </Button>
            </div>
            <SpinWheel onFinish={() => setShowWheel(false)} />
          </div>
        </div>
      )}

      {showScratch && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200 mb-3" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Scratch to reveal</h2>
              <Button variant="ghost" onClick={() => setShowScratch(false)}>
                Close
              </Button>
            </div>
            <ScratchCard prizeText="20% OFF at BeanCraft" onReveal={() => setShowScratch(false)} />
          </div>
        </div>
      )}
    </main>
  )
}
