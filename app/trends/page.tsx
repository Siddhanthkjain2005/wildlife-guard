'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, BarChart3, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TrendsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrends()
  }, [])

  const fetchTrends = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.trends, {
        headers: { 'ngrok-skip-browser-warning':  'true' }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (! result.success) {
        throw new Error(result.error || 'Failed to fetch trends')
      }

      setData(result)
      setLoading(false)
    } catch (err:  any) {
      console.error('Trends fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Trends...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Failed to Load Trends</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchTrends}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { seasonal_trends, species_trends } = data

  // Prepare data for seasonal chart
  const seasonalChartData = seasonal_trends?. map((item: any) => ({
    season: item.season,
    'Average Crimes': item.avg_crimes,
    'High Risk Count': item.high_risk_count
  })) || []

  // Prepare species trends for line chart (top 5 species)
  const topSpecies = Object.keys(species_trends || {}).slice(0, 5)
  const speciesChartData = ['Summer', 'Winter', 'Dry', 'Wet']. map(season => {
    const dataPoint:  any = { season }
    topSpecies. forEach(species => {
      const speciesData = species_trends[species]?.find((s: any) => s.season === season)
      dataPoint[species] = speciesData?. avg_crimes || 0
    })
    return dataPoint
  })

  const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="relative container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity:  1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              📈 Trends & Patterns
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Historical patterns and seasonal analysis
          </p>
        </motion.div>

        <div className="grid gap-8 max-w-7xl mx-auto">
          {/* Seasonal Patterns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-purple-400" />
              Seasonal Patterns
            </h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={seasonalChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="season" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor:  '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="Average Crimes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="High Risk Count" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Species Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity:  1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-pink-400" />
              Species Risk by Season
            </h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={speciesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="season" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius:  '8px'
                  }}
                  labelStyle={{ color:  '#f1f5f9' }}
                />
                <Legend />
                {topSpecies.map((species, idx) => (
                  <Line 
                    key={species}
                    type="monotone" 
                    dataKey={species} 
                    stroke={colors[idx]} 
                    strokeWidth={3}
                    dot={{ fill:  colors[idx], r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            {seasonal_trends?.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity:  1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
              >
                <div className="text-slate-400 text-sm mb-2">{item.season}</div>
                <div className="text-3xl font-black text-white mb-1">
                  {item.avg_crimes. toFixed(1)}
                </div>
                <div className="text-sm text-slate-400">Avg Crimes</div>
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <span className="text-red-400 font-bold">{item.high_risk_count}</span>
                  <span className="text-slate-500 text-xs ml-1">high risk</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}