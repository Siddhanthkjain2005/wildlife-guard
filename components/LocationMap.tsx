'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function MapUpdater({ latitude, longitude }: { latitude: number, longitude:  number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView([latitude, longitude], 10, { animate: true })
  }, [latitude, longitude, map])
  
  return null
}

export default function LocationMap({ latitude, longitude }: { latitude:  number, longitude: number }) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={icon}>
        <Popup>
          <div className="text-center text-slate-900">
            <strong>Selected Location</strong><br />
            Lat: {latitude.toFixed(4)}<br />
            Lng: {longitude.toFixed(4)}
          </div>
        </Popup>
      </Marker>
      <MapUpdater latitude={latitude} longitude={longitude} />
    </MapContainer>
  )
}