'use client'

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function MapUpdater({ hotspots }: { hotspots: any[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (hotspots.length > 0) {
      map.setView([22, 78], 5)
    }
  }, [hotspots, map])
  
  return null
}

export default function HotspotMap({ hotspots }: { hotspots: any[] }) {
  const [isMounted, setIsMounted] = useState(false)

  // Fix Leaflet icon issue - INSIDE the component
  useEffect(() => {
    setIsMounted(true)
    
    // Fix default marker icons
    delete (L. Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow. png',
    })
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800">
        <p className="text-slate-400">Loading map...</p>
      </div>
    )
  }

  const getColor = (riskLevel: string) => {
    if (riskLevel === 'High') return '#ef4444'    // red
    if (riskLevel === 'Medium') return '#eab308'  // yellow
    if (riskLevel === 'Low') return '#22c55e'     // green
    return '#94a3b8'
  }
  

  const getRadius = (risk: number) => {
    return Math. max(8, Math.min(30, (risk / 100) * 35))
  }

  return (
    <MapContainer
      center={[22, 78]}
      zoom={5}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {hotspots.map((spot, i) => (
        <CircleMarker
          key={`${spot.name}-${i}`}
          center={[spot.lat, spot. lng]}
          radius={getRadius(spot.risk)}
          fillColor={getColor(spot.risk_level)}

          color="#fff"
          weight={2}
          opacity={0.9}
          fillOpacity={0.7}
        >
          <Popup>
            <div className="text-slate-900 p-2 min-w-[200px]">
              <div className="font-bold text-lg mb-2 text-slate-800">{spot.name}</div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">State:</span>
                  <span className="font-semibold">{spot.state}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">District:</span>
                  <span className="font-semibold">{spot.district}</span>
                </div>
                
                <div className="border-t border-slate-300 my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Risk Score:</span>
                  <span className={`font-bold text-lg ${
                    spot.risk > 70 ? 'text-red-600' :  
                    spot.risk > 40 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {spot.risk}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Risk Level:</span>
                  <span className="font-semibold">{spot.risk_level || 'Unknown'}</span>
                </div>
                
                <div className="border-t border-slate-300 my-2"></div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Incidents (1yr):</span>
                  <span className="font-semibold text-orange-600">{spot.incidents_1yr}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Incidents (3yr):</span>
                  <span className="font-semibold text-red-600">{spot.incidents_3yr}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Patrol: </span>
                  <span className="font-semibold">{spot.patrol_frequency}</span>
                </div>

                <div className="border-t border-slate-300 my-2"></div>

                <div className="text-xs text-slate-500">
                  📍 {spot.lat.toFixed(4)}°, {spot.lng.toFixed(4)}°
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      
      <MapUpdater hotspots={hotspots} />
    </MapContainer>
  )
}