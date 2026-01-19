'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Loader2, CheckCircle } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  const handleDownload = async (reportType: string, reportName: string) => {
    try {
      setDownloading(reportType)
      setDownloadSuccess(null)

      // Fetch data based on report type
      let data:  any = {}
      
      if (reportType === 'analytics') {
        const response = await fetch(API_ENDPOINTS.analytics, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        data = await response.json()
      } else if (reportType === 'hotspots') {
        const response = await fetch(API_ENDPOINTS.hotspots, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        data = await response.json()
      } else if (reportType === 'species') {
        const response = await fetch(API_ENDPOINTS.speciesRisk, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        data = await response.json()
      }

      // Generate report content
      const reportContent = generateReportText(reportType, data)
      
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document. createElement('a')
      a.href = url
      a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setDownloadSuccess(reportType)
      setTimeout(() => setDownloadSuccess(null), 3000)
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download report. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const generateReportText = (type: string, data: any) => {
    const date = new Date().toLocaleDateString()
    let content = `WILDLIFE POACHING RISK REPORT\nGenerated: ${date}\n${'='.repeat(60)}\n\n`

    if (type === 'analytics' && data.stats) {
      content += `ANALYTICS REPORT\n\n`
      content += `Total Areas: ${data.stats.total_predictions}\n`
      content += `High Risk Areas: ${data.stats. high_risk_areas}\n`
      content += `Medium Risk Areas: ${data.stats. medium_risk_areas}\n`
      content += `Low Risk Areas: ${data.stats.low_risk_areas}\n\n`
      
      content += `TOP RISK STATES:\n`
      data.top_risk_states?. forEach((state:  any, i: number) => {
        content += `${i + 1}. ${state. state} - Score: ${state.score}\n`
      })
      
      content += `\nTOP FEATURES:\n`
      data.feature_importance?.slice(0, 10).forEach((item: any, i: number) => {
        content += `${i + 1}. ${item. feature} - ${(item.importance * 100).toFixed(2)}%\n`
      })
    } else if (type === 'hotspots' && data.hotspots) {
      content += `HOTSPOT LOCATIONS REPORT\n\n`
      content += `Total Hotspots: ${data. total_count}\n`
      content += `High Risk:  ${data.risk_counts?. high || 0}\n`
      content += `Medium Risk: ${data.risk_counts?.medium || 0}\n`
      content += `Low Risk: ${data.risk_counts?.low || 0}\n\n`
      
      content += `HOTSPOT DETAILS:\n`
      data.hotspots?.forEach((spot: any, i: number) => {
        content += `\n${i + 1}.  ${spot.name}\n`
        content += `   State: ${spot.state}\n`
        content += `   District: ${spot.district}\n`
        content += `   Risk Score: ${spot.risk}\n`
        content += `   Risk Level: ${spot.risk_level}\n`
        content += `   Incidents (3yr): ${spot.incidents_3yr}\n`
      })
    } else if (type === 'species' && data. species_risk) {
      content += `SPECIES PROTECTION REPORT\n\n`
      
      data.species_risk?.forEach((species: any, i: number) => {
        content += `\n${i + 1}. ${species.species}\n`
        content += `   High Risk Count: ${species.high_risk_count}\n`
        content += `   Avg Crimes: ${species.avg_crimes}\n`
        content += `   Locations: ${species.location_count}\n`
      })
    }

    content += `\n${'='.repeat(60)}\nEnd of Report\n`
    return content
  }

  const reports = [
    { 
      id: 'analytics',
      title: 'Analytics Report', 
      desc: 'Complete analytics with feature importance', 
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'hotspots',
      title: 'Hotspots Report', 
      desc:  'All high-risk zone locations', 
      icon: FileText,
      color: 'from-red-500 to-orange-500'
    },
    { 
      id: 'species',
      title: 'Species Report', 
      desc: 'Species protection status', 
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id:  'custom',
      title: 'Custom Report', 
      desc: 'Coming soon... ', 
      icon: Download,
      color: 'from-blue-500 to-cyan-500',
      disabled: true
    },
  ]

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
              📚 Reports & Exports
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Download comprehensive analysis reports
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {reports.map((report, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => !report.disabled && handleDownload(report.id, report.title)}
              disabled={downloading === report.id || report.disabled}
              className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-left group transition-all ${
                report.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  :  'hover:border-purple-500/50 cursor-pointer'
              }`}
            >
              <div className={`bg-gradient-to-br ${report.color} p-4 rounded-2xl inline-block mb-4`}>
                {downloading === report.id ?  (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : downloadSuccess === report.id ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <report.icon className="w-8 h-8 text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {report.title}
              </h3>
              <p className="text-slate-400 mb-4">{report.desc}</p>
              
              {downloadSuccess === report.id ?  (
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Downloaded Successfully! 
                </div>
              ) : downloading === report.id ? (
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Report...
                </div>
              ) : (
                <div className={`flex items-center gap-2 font-semibold ${
                  report.disabled ? 'text-slate-500' : 'text-purple-400'
                }`}>
                  <Download className="w-4 h-4" />
                  {report.disabled ?  'Coming Soon' : 'Download Report'}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}