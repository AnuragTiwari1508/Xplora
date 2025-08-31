"use client"

import { useEffect } from "react"

export default function MapplsMapPage() {
  useEffect(() => {
    // Redirect to the HTML file
    window.location.href = '/mappls-map.html'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-12 text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🗺️ Loading Mappls Map</h1>
        <p className="text-gray-600">Redirecting to direct HTML integration...</p>
      </div>
    </div>
  )
}
