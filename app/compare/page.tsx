'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, Search, Loader2, ArrowRight } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'

export default function ComparePage() {
  const [reserves, setReserves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reserve1, setReserve1] = useState<any>(null)
  const [reserve2, setReserve2] = useState<any>(null)
  const [searchTerm1, setSearchTerm1] = useState('')
  const [searchTerm2, setSearchTerm2] = useState('')
  const [showDropdown1, setShowDropdown1] = useState(false)
  const [showDropdown2, setShowDropdown2] = useState(false)

  useEffect(() => {
    fetchReserves()
  }, [])

  const fetchReserves = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.reserves, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
      const result = await response.json()
      setReserves(result.reserves || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const filteredReserves1 = reserves.filter(r => 
    r.name. toLowerCase().includes(searchTerm1.toLowerCase()) ||
    r.state.toLowerCase().includes(searchTerm1.toLowerCase())
  )

  const filteredReserves2 = reserves.filter(r => 
    r.name.toLowerCase().includes(searchTerm2.toLowerCase()) ||
    r.state.toLowerCase().includes(searchTerm2.toLowerCase())
  )

  const getRiskColor = (level: string) => {
    if (level === 'High') return 'text-red-400 bg-red-500/20'
    if (level === 'Medium') return 'text-yellow-400 bg-yellow-500/20'
    return 'text-green-400 bg-green-500/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
      </div>
    )
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
              ⚖️ Compare Reserves
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Side-by-side comparison of wildlife reserves
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Reserve 1 */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Reserve 1</h3>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reserve..."
                value={searchTerm1}
                onChange={(e) => {
                  setSearchTerm1(e.target.value)
                  setShowDropdown1(true)
                }}
                onFocus={() => setShowDropdown1(true)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              {showDropdown1 && filteredReserves1.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl max-h-60 overflow-y-auto">
                  {filteredReserves1.slice(0, 10).map((reserve, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setReserve1(reserve)
                        setSearchTerm1(reserve.name)
                        setShowDropdown1(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-0"
                    >
                      <div className="text-white font-semibold">{reserve.name}</div>
                      <div className="text-slate-400 text-sm">{reserve.state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {reserve1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">State</div>
                  <div className="text-white font-bold">{reserve1.state}</div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">District</div>
                  <div className="text-white font-bold">{reserve1.district}</div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Avg Crimes (3yr)</div>
                  <div className="text-2xl font-black text-red-400">{reserve1.avg_crimes}</div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Risk Level</div>
                  <div className={`inline-block px-3 py-1 rounded-full font-bold ${getRiskColor(reserve1.risk_level)}`}>
                    {reserve1.risk_level}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Patrol Frequency</div>
                  <div className="text-white font-bold">{reserve1.patrol_frequency}</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Reserve 2 */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Reserve 2</h3>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reserve..."
                value={searchTerm2}
                onChange={(e) => {
                  setSearchTerm2(e.target.value)
                  setShowDropdown2(true)
                }}
                onFocus={() => setShowDropdown2(true)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              {showDropdown2 && filteredReserves2.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl max-h-60 overflow-y-auto">
                  {filteredReserves2.slice(0, 10).map((reserve, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setReserve2(reserve)
                        setSearchTerm2(reserve.name)
                        setShowDropdown2(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-0"
                    >
                      <div className="text-white font-semibold">{reserve.name}</div>
                      <div className="text-slate-400 text-sm">{reserve.state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {reserve2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">State</div>
                  <div className="text-white font-bold">{reserve2.state}</div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">District</div>
                  <div className="text-white font-bold">{reserve2.district}</div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Avg Crimes (3yr)</div>
                  <div className="text-2xl font-black text-red-400">{reserve2.avg_crimes}</div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Risk Level</div>
                  <div className={`inline-block px-3 py-1 rounded-full font-bold ${getRiskColor(reserve2.risk_level)}`}>
                    {reserve2.risk_level}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Patrol Frequency</div>
                  <div className="text-white font-bold">{reserve2.patrol_frequency}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Comparison Summary */}
        {reserve1 && reserve2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-6xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <GitCompare className="w-7 h-7 text-purple-400" />
              Comparison Summary
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-2">Higher Crime Rate</div>
                <div className="text-2xl font-black text-red-400">
                  {reserve1.avg_crimes > reserve2.avg_crimes ? reserve1.name : reserve2.name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-2">Crime Difference</div>
                <div className="text-2xl font-black text-orange-400">
                  {Math.abs(reserve1.avg_crimes - reserve2.avg_crimes).toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-2">Safer Reserve</div>
                <div className="text-2xl font-black text-green-400">
                  {reserve1.avg_crimes < reserve2.avg_crimes ? reserve1.name : reserve2.name}
                </div>
              </div>
            </div>
          </motion. div>
        )}
      </div>
    </div>
  )
}