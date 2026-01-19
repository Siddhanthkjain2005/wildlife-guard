'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, MapPin, Shield, AlertCircle, Activity, Loader2, RefreshCw } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.analytics, {
        headers: {
          'ngrok-skip-browser-warning':  'true'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response. status}`)
      }

      const result = await response.json()
      
      if (! result.success) {
        throw new Error(result.error || 'Failed to fetch analytics')
      }

      setData(result)
      setLoading(false)
    } catch (err:  any) {
      console.error('Analytics fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Real-Time Analytics...</p>
          <p className="text-slate-400 text-sm mt-2">Fetching data from ML model</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Failed to Load Analytics</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-semibold flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { stats, feature_importance, top_risk_states } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-6 py-2 mb-6">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm text-green-300 font-semibold">Live Data from Backend</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              📊 Analytics Dashboard
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real-time insights from Random Forest ML model
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Areas Analyzed', value: stats.total_predictions. toLocaleString(), icon: Activity, color: 'from-blue-500 to-cyan-500' },
            { label: 'High Risk Zones', value: stats.high_risk_areas, icon: AlertCircle, color: 'from-red-500 to-orange-500' },
            { label: 'Medium Risk Zones', value: stats.medium_risk_areas, icon: TrendingUp, color: 'from-yellow-500 to-orange-500' },
            { label: 'Low Risk Zones', value: stats.low_risk_areas, icon: Shield, color:  'from-green-500 to-emerald-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
            >
              <div className={`inline-block p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Feature Importance */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity:  1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-purple-400" />
                  Model Feature Importance
                </h3>
                <p className="text-slate-400 text-sm mt-2">
                  From your trained Random Forest Classifier
                </p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              {feature_importance. slice(0, 10).map((item:  any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity:  0, x: -20 }}
                  animate={{ opacity:  1, x: 0 }}
                  transition={{ delay:  0.1 + i * 0.05 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 font-medium text-sm">{item.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-bold text-sm">{(item.importance * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 h-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs">
                💡 <strong>Note:</strong> Feature importance values show which factors have the most influence on poaching risk predictions. 
              </p>
            </div>
          </motion.div>

          {/* Top Risk States */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x:  0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-red-400" />
              High Risk States
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Based on historical poaching data analysis
            </p>
            
            <div className="space-y-4">
              {top_risk_states.map((state: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                        i === 1 ? 'bg-slate-400/20 text-slate-300' :
                        i === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-white font-semibold text-lg">{state.state}</span>
                    </div>
                    <span className={`text-2xl font-black ${
                      state.score > 70 ? 'text-red-400' : 
                      state.score > 50 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {state.score}
                    </span>
                  </div>
                  <div className="bg-slate-700/50 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${state.score}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      className={`h-full ${
                        state.score > 70 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                        state.score > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Model Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity:  1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-8 max-w-7xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7 text-purple-400" />
            Model Information
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-slate-400 text-sm mb-1">Model Type</div>
              <div className="text-white font-bold text-lg">Random Forest</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Model Accuracy</div>
              <div className="text-emerald-400 font-bold text-lg">{(stats.model_accuracy * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Training Samples</div>
              <div className="text-purple-400 font-bold text-lg">{stats.training_samples. toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Avg Risk Score</div>
              <div className="text-pink-400 font-bold text-lg">{stats.average_risk_score.toFixed(1)}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}