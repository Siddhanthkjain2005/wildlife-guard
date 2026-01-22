'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  Target, 
  MapPin, 
  BarChart3, 
  TrendingUp, 
  Heart,
  Bell,
  GitCompare,
  FileText,
  Info,
  ArrowRight,
  Newspaper
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      href: '/predict',
      title: 'Risk Prediction',
      description: 'AI-powered poaching risk assessment using Random Forest ML',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      href: '/map',
      title: 'Hotspot Map',
      description: 'Interactive visualization of 15 high-risk wildlife zones',
      icon: MapPin,
      color: 'from-red-500 to-orange-500',
      gradient: 'from-red-500/20 to-orange-500/20'
    },
    {
      href: '/analytics',
      title:  'Analytics Dashboard',
      description: 'Feature importance and comprehensive risk statistics',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      gradient:  'from-blue-500/20 to-cyan-500/20'
    },
    {
      href: '/news',  // ✅ ADD THIS ENTIRE BLOCK
      title: 'Wildlife News',
      description: 'Latest curated articles on poaching and conservation',
      icon:  Newspaper,
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-500/20 to-red-500/20'
    },
    {
      href: '/trends',
      title: 'Trends & Patterns',
      description: 'Seasonal analysis and historical poaching patterns',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      gradient:  'from-green-500/20 to-emerald-500/20'
    },
    {
      href: '/species',
      title: 'Species Protection',
      description: 'Risk analysis for endangered wildlife species',
      icon: Heart,
      color: 'from-yellow-500 to-orange-500',
      gradient:  'from-yellow-500/20 to-orange-500/20'
    },
    {
      href: '/alerts',
      title: 'Live Alerts',
      description: 'Real-time monitoring and prediction-based notifications',
      icon: Bell,
      color: 'from-red-500 to-pink-500',
      gradient: 'from-red-500/20 to-pink-500/20'
    },
    {
      href: '/compare',
      title: 'Compare Reserves',
      description: 'Side-by-side comparison of wildlife reserves',
      icon: GitCompare,
      color: 'from-indigo-500 to-purple-500',
      gradient: 'from-indigo-500/20 to-purple-500/20'
    },
    {
      href: '/reports',
      title: 'Reports & Exports',
      description: 'Download comprehensive analysis reports',
      icon: FileText,
      color: 'from-teal-500 to-cyan-500',
      gradient: 'from-teal-500/20 to-cyan-500/20'
    },
    {
      href: '/about',
      title: 'About & Help',
      description: 'Learn about the platform and how to use it',
      icon: Info,
      color:  'from-slate-500 to-slate-600',
      gradient: 'from-slate-500/20 to-slate-600/20'
    }
  ]

  const stats = [
    { label: 'ML Accuracy', value: '98%', icon: Target },
    { label: 'Wildlife Reserves', value: '150+', icon: MapPin },
    { label: 'Data Points', value: '5,000+', icon: BarChart3 },
    { label:  'Species Tracked', value: '10', icon: Heart }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl shadow-purple-500/50">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Wildlife Guard
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-semibold">
            AI-Powered Wildlife Protection Platform
          </p>

          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Leveraging machine learning to predict and prevent wildlife poaching across India's protected reserves. 
            Real-time monitoring, intelligent analytics, and data-driven insights for conservation efforts.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all"
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />

              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid - ALL PAGES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Explore All Features
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-slate-800 rounded-3xl p-8 h-full hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden`}>
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative">
                      <div className={`inline-block p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-slate-400 leading-relaxed mb-4">
                        {feature.description}
                      </p>

                      <div className="flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-12">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Start? 
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Use our ML-powered prediction tool to assess poaching risk in any wildlife reserve across India
            </p>
            <Link href="/predict">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold px-12 py-5 rounded-2xl text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all inline-flex items-center gap-3"
              >
                <Target className="w-6 h-6" />
                Make a Prediction
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion. div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20 text-center"
        >
          <div className="inline-block bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl px-8 py-4">
            <div className="text-slate-500 text-sm mb-3">Powered By</div>
            <div className="flex items-center gap-6 flex-wrap justify-center text-slate-400 text-sm font-semibold">
              <span>🤖 Random Forest ML</span>
              <span>•</span>
              <span>⚛️ Next.js 15</span>
              <span>•</span>
              <span>🐍 Python FastAPI</span>
              <span>•</span>
              <span>🗺️ Leaflet Maps</span>
              <span>•</span>
              <span>📊 Recharts</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
