"use client"

import React, { useEffect, useRef } from "react"

interface MapplsNativeMapProps {
  userPoints?: number
  onLocationVisit?: (locationId: string, points: number) => void
  visitedLocations?: string[]
}

export default function MapplsNativeMap({ 
  userPoints = 1250, 
  onLocationVisit,
  visitedLocations = [] 
}: MapplsNativeMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    console.log('📍 Loading direct Mappls HTML integration')
    
    // Listen for messages from the HTML iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'locationVisit') {
        console.log('🎉 Location visit from HTML:', event.data)
        onLocationVisit?.(event.data.locationId, event.data.points)
      } else if (event.data.type === 'mapReady') {
        console.log('✅ Mappls HTML map is ready!')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onLocationVisit])

  return (
    <div className="relative w-full h-screen">
      {/* Direct HTML Integration - Full Screen */}
      <iframe
        ref={iframeRef}
        src="/mappls-map.html"
        className="w-full h-full border-none"
        style={{ minHeight: "100vh" }}
        title="Xploraa Mappls Map"
        onLoad={() => {
          console.log('✅ Direct Mappls HTML loaded successfully!')
          // Send initial data to iframe
          setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({
                type: 'init',
                userPoints,
                visitedLocations
              }, '*')
            }
          }, 1000)
        }}
      />
    </div>
  )
}
