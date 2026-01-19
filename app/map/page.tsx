'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Filter, Loader2, AlertCircle, RefreshCw, Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import { API_ENDPOINTS } from '@/lib/config'

const HotspotMap = dynamic(() => import('@/components/HotspotMap'), { ssr: false })

export default function MapPage() {
  const [hotspots, setHotspots] = useState<any[]>([])
  const [riskCounts, setRiskCounts] = useState({ high: 0, medium: 0, low: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchHotspots()
  }, [])

  const fetchHotspots = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.hotspots, {
        headers: {
          'ngrok-skip-browser-warning':  'true'
        }
      })

      if (!response. ok) {
        throw new Error(`HTTP error! status: ${response. status}`)
      }

      const result = await response.json()
      
      if (! result.success) {
        throw new Error(result.error || 'Failed to fetch hotspots')
      }

      setHotspots(result.hotspots)
      setRiskCounts(result.risk_counts || { high: 0, medium:  0, low: 0 })
      setLoading(false)
    } catch (err:  any) {
      console.error('Hotspots fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const filteredHotspots = hotspots.filter(spot => {
    if (filter === 'all') return true
    if (filter === 'high') return spot.risk_level === 'High'
    if (filter === 'medium') return spot.risk_level === 'Medium'
    if (filter === 'low') return spot.risk_level === 'Low'
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Hotspot Data...</p>
          <p className="text-slate-400 text-sm mt-2">Fetching 15 key locations from backend</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Failed to Load Map Data</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchHotspots}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-semibold flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-6 py-2 mb-6">
            <MapPin className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-sm text-red-300 font-semibold">
              {riskCounts.high} High • {riskCounts.medium} Medium • {riskCounts. low} Low Risk Zones
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              🗺️ Poaching Hotspot Map
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Showing 5 high, 5 medium, and 5 low risk zones across India
          </p>
        </motion.div>

        {/* Filters & Stats */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 flex-wrap justify-center"
          >
            {[
              { id: 'all', label: 'All Zones', count: hotspots.length, color: 'from-purple-500 to-pink-500' },
              { id: 'high', label: 'High Risk', count: riskCounts.high, color: 'from-red-500 to-orange-500' },
              { id: 'medium', label: 'Medium Risk', count: riskCounts.medium, color: 'from-yellow-500 to-orange-500' },
              { id: 'low', label: 'Low Risk', count: riskCounts.low, color: 'from-green-500 to-emerald-500' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  filter === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {item.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === item. id ?  'bg-white/20' : 'bg-white/10'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x:  0 }}
            onClick={fetchHotspots}
            className="px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </motion. button>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity:  1, scale: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 mb-8"
          style={{ height: '70vh' }}
        >
          <HotspotMap hotspots={filteredHotspots} />
        </motion. div>

        {/* Legend & Hotspot Lists */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* High Risk Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              High Risk Zones ({riskCounts.high})
            </h3>
            <div className="space-y-2">
              {hotspots. filter(h => h.risk_level === 'High').map((spot, i) => (
                <div key={i} className="bg-slate-800/30 rounded-lg p-3 text-sm">
                  <div className="text-white font-semibold">{spot.name}</div>
                  <div className="text-slate-400 text-xs">{spot.state}</div>
                  <div className="text-red-400 font-bold text-lg mt-1">{spot.risk}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Medium Risk Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              Medium Risk Zones ({riskCounts. medium})
            </h3>
            <div className="space-y-2">
              {hotspots.filter(h => h.risk_level === 'Medium').map((spot, i) => (
                <div key={i} className="bg-slate-800/30 rounded-lg p-3 text-sm">
                  <div className="text-white font-semibold">{spot.name}</div>
                  <div className="text-slate-400 text-xs">{spot.state}</div>
                  <div className="text-yellow-400 font-bold text-lg mt-1">{spot.risk}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Risk Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              Low Risk Zones ({riskCounts.low})
            </h3>
            <div className="space-y-2">
              {hotspots.filter(h => h.risk_level === 'Low').map((spot, i) => (
                <div key={i} className="bg-slate-800/30 rounded-lg p-3 text-sm">
                  <div className="text-white font-semibold">{spot.name}</div>
                  <div className="text-slate-400 text-xs">{spot.state}</div>
                  <div className="text-green-400 font-bold text-lg mt-1">{spot. risk}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info Card */}
        <motion. div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold mb-2">About This Map</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                This map displays 15 strategically selected wildlife reserves across India:  5 high-risk zones requiring immediate intervention, 
                5 medium-risk zones needing enhanced monitoring, and 5 low-risk zones with standard protocols. 
                Risk scores are calculated using ML analysis of historical poaching data, patrol frequency, and environmental factors.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}