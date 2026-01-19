'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle, CheckCircle, Clock, MapPin, X, Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.alerts, {
        headers: { 'ngrok-skip-browser-warning':   'true' }
      })
      const result = await response.json()
      setAlerts(result.alerts || [])
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="relative container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y:   0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-6 py-2 mb-6">
            <Bell className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-sm text-red-300 font-semibold">Live Monitoring Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              🚨 Alerts & Notifications
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Real-time monitoring of high-risk zones
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {alerts.map((alert, i) => (
            <motion. div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:   0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 ${
                alert.type === 'critical' ? 'border-red-500/50' : 'border-yellow-500/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  alert.type === 'critical' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    alert.type === 'critical' ?   'text-red-400' :  'text-yellow-400'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      alert.type === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>

                  <h4 className="text-white font-bold text-lg mb-1">{alert.message}</h4>
                  <p className="text-slate-400 text-sm flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" />
                    {alert.location}
                  </p>
                  
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span>Species:  {alert.species}</span>
                    <span>•</span>
                    <span>Patrol:  {alert.patrol_frequency}</span>
                    <span>•</span>
                    <span>Risk: {alert.risk_score}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedAlert(alert)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all"
                >
                  View Details
                </button>
              </div>
            </motion. div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Alert Details</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedAlert.type === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedAlert.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Location</div>
                  <div className="text-white font-bold text-lg">{selectedAlert.location}</div>
                  <div className="text-slate-500 text-sm">{selectedAlert.district}</div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Alert Message</div>
                  <div className="text-white">{selectedAlert.message}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">Risk Score</div>
                    <div className="text-3xl font-black text-red-400">{selectedAlert.risk_score}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">Species</div>
                    <div className="text-white font-bold text-lg">{selectedAlert.species}</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Patrol Frequency</div>
                  <div className="text-white font-bold">{selectedAlert.patrol_frequency}</div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Coordinates</div>
                  <div className="text-white font-mono text-sm">
                    {selectedAlert.coordinates.lat.toFixed(4)}, {selectedAlert.coordinates.lng.toFixed(4)}
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <h4 className="text-emerald-400 font-bold mb-2">Recommended Actions: </h4>
                  <ul className="space-y-1 text-emerald-100 text-sm">
                    <li>• Deploy immediate patrol response</li>
                    <li>• Activate surveillance cameras</li>
                    <li>• Notify local ranger stations</li>
                    <li>• Increase monitoring for 48 hours</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}