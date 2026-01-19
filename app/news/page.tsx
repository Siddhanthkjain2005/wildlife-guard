'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, ExternalLink, Calendar, Loader2, AlertCircle, RefreshCw, TrendingUp, Award, Clock } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/config'

interface Article {
  id: number
  title: string
  summary:  string  // ✅ Changed from description
  source: string
  url: string
  published_at: string  // ✅ Changed from published_date
  fetched_at: string
  confidence_score:  number  // ✅ Added
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.articles, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setArticles(result. articles)
      } else {
        setError(result.error || 'Failed to fetch articles')
      }

      setLoading(false)
    } catch (err:  any) {
      console.error('Articles fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400 bg-green-500/20'
    if (score >= 0.6) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-orange-400 bg-orange-500/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Failed to Load Articles</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchArticles}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto"
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
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full px-6 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300 font-semibold">Latest Updates</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              📰 Wildlife News
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Top {articles.length} curated articles on wildlife poaching and conservation
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto space-y-6">
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl">
              <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white text-2xl font-bold mb-2">No Articles Found</h3>
              <p className="text-slate-400">Check back later for updates</p>
            </div>
          ) : (
            articles. map((article, i) => (
              <motion. div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all group"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {article.title}
                      </h2>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                        <span>•</span>
                        <span className="font-semibold text-purple-400">{article.source}</span>
                      </div>
                    </div>

                    {/* Confidence Score Badge */}
                    {article.confidence_score && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getConfidenceColor(article.confidence_score)}`}>
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-bold">{(article.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    {article.summary || 'No summary available. '}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>Fetched: {formatDate(article.fetched_at)}</span>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-sm transition-all"
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}