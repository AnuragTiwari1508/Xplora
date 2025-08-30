"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const SEGMENTS = [
  { label: "5 pts", color: "#FDE68A" },
  { label: "10 pts", color: "#BBF7D0" },
  { label: "Coupon", color: "#A7F3D0" },
  { label: "Try Again", color: "#E5E7EB" },
  { label: "20 pts", color: "#99F6E4" },
  { label: "Jackpot!", color: "#34D399" },
]

export function SpinWheel({ onFinish }: { onFinish?: () => void }) {
  const [spinning, setSpinning] = useState(false)
  const [angle, setAngle] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  function spin() {
    if (spinning) return
    const turns = 6 + Math.random() * 4
    const final = angle + turns * 360
    setSpinning(true)
    setAngle(final)
    setTimeout(() => {
      setSpinning(false)
      onFinish?.()
    }, 3000)
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="relative h-56 w-56">
        <div
          ref={wheelRef}
          className="absolute inset-0 rounded-full border shadow"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: spinning ? "transform 3s cubic-bezier(0.22, 0.61, 0.36, 1)" : "none",
            background: `conic-gradient(
              ${SEGMENTS.map((s, i) => `${s.color} ${(i * (100 / SEGMENTS.length)).toFixed(2)}% ${((i + 1) * (100 / SEGMENTS.length)).toFixed(2)}%`).join(", ")}
            )`,
          }}
          aria-label="Rewards wheel"
        />
        {/* labels */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-gray-500">Xploraa</div>
            <div className="text-sm font-semibold">Spin to win</div>
          </div>
        </div>
        {/* pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-[14px] border-transparent border-b-teal-600" />
      </div>
      <Button onClick={spin} className="bg-teal-600 hover:bg-teal-700" aria-disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
    </div>
  )
}
