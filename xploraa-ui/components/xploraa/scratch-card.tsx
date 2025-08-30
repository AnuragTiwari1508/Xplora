"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export function ScratchCard({ prizeText, onReveal }: { prizeText: string; onReveal?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    // cover layer
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx.fillStyle = "#D1D5DB"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#9CA3AF"
    ctx.font = "bold 16px sans-serif"
    ctx.fillText("Scratch here", 16, 28)
    // image settings to avoid CORS when drawing images onto canvas in future
    const img = new Image()
    img.crossOrigin = "anonymous"
  }, [])

  function scratch(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 16, 0, Math.PI * 2)
    ctx.fill()
    checkReveal()
  }

  function checkReveal() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let cleared = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) cleared++
    }
    const ratio = cleared / (pixels.length / 4)
    if (ratio > 0.6 && !revealed) {
      setRevealed(true)
      onReveal?.()
    }
  }

  return (
    <div className="rounded-2xl border shadow-sm p-4">
      <div className="relative h-28 rounded-xl bg-teal-50 flex items-center justify-center">
        <p className="text-lg font-semibold text-teal-700">{prizeText}</p>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none rounded-xl"
          onPointerDown={scratch}
          onPointerMove={(e) => e.buttons === 1 && scratch(e)}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">Reveal at least 60% to claim.</p>
    </div>
  )
}
