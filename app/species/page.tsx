'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertTriangle, Shield } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'
import Image from 'next/image'

export default function SpeciesPage() {
  const [species, setSpecies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSpecies()
  }, [])

  const fetchSpecies = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.speciesRisk, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
      const result = await response.json()
      setSpecies(result.species_risk || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
      </div>
    )
  }

  // ✅ Emoji mapping
  const speciesEmojis: Record<string, string> = {
    Tiger: '🐅',
    Elephant: '🐘',
    Leopard: '🐆',
    Rhino: '🦏',
    Pangolin: '🦔',
    'Sloth Bear': '🐻',
    'Spotted Deer': '🦌',
    'Wild Dog': '🐕',
  }

  // ✅ Real Image mapping (LOCAL images from /public/animals/)
  const speciesImages: Record<string, string> = {
    Tiger: '/animals/tiger.jpg',
    Elephant: '/animals/elephant.jpg',
    Leopard: '/animals/leopard.jpg',
    Rhino: '/animals/rhino.jpg',
    Pangolin: '/animals/pangolin.jpg',
    'Sloth Bear': '/animals/sloth_bear.jpg',
    'Spotted Deer': '/animals/spotted_deer.jpg',
    'Wild Dog': '/animals/wild_dog.jpg',
    'Sambar': '/animals/sambar.jpg',
    'Star Tortoise': '/animals/startortoise.jpg',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="relative container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              🐾 Species Protection
            </span>
          </h1>
          <p className="text-xl text-slate-400">Risk analysis for endangered wildlife</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {species.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all"
            >
              {/* ✅ Animal Image */}
              <div className="relative w-full h-52">
                <Image
                  src={speciesImages[s.species] || '/animals/default.jpg'}
                  alt={s.species}
                  fill
                  className="object-cover"
                  priority={i < 3}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Emoji badge */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-lg px-3 py-2 rounded-xl text-2xl">
                  {speciesEmojis[s.species] || '🦁'}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">{s.species}</h3>

                <div className="space-y-3">
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">High Risk Incidents</div>
                    <div className="text-3xl font-black text-red-400">{s.high_risk_count}</div>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">Avg Crimes (3yr)</div>
                    <div className="text-2xl font-bold text-orange-400">{Number(s.avg_crimes).toFixed(1)}</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      s.high_risk_count > 10
                        ? 'bg-red-500/20 text-red-400'
                        : s.high_risk_count > 5
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {s.high_risk_count > 10 ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                    {s.high_risk_count > 10 ? 'Critical' : s.high_risk_count > 5 ? 'Moderate' : 'Protected'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
