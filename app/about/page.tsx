'use client'

import { motion } from 'framer-motion'
import { Info, Users, Target, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="relative container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y:  0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md: text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              ℹ️ About Wildlife Guard
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            AI-powered wildlife conservation through predictive analytics
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              desc: 'To protect endangered wildlife by predicting and preventing poaching activities using cutting-edge machine learning technology.'
            },
            {
              icon:  Zap,
              title: 'Technology',
              desc: 'Random Forest Classifier trained on 5,000+ data points analyzing environmental factors, patrol frequency, and historical crime patterns.'
            },
            {
              icon: Users,
              title: 'Team',
              desc: 'Developed by conservationists, data scientists, and wildlife protection agencies working together to save endangered species.'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:  0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}