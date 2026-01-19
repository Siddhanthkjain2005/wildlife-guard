'use client'

import { Github, Twitter, Mail, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wildlife Guard
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered wildlife protection through advanced poaching risk prediction and real-time monitoring.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/predict" className="text-slate-400 hover:text-purple-400 transition-colors">Predict Risk</a></li>
              <li><a href="/map" className="text-slate-400 hover: text-purple-400 transition-colors">Interactive Map</a></li>
              <li><a href="/analytics" className="text-slate-400 hover:text-purple-400 transition-colors">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
            <div className="flex gap-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-slate-800 p-3 rounded-lg hover: bg-purple-500/20 transition-colors"
              >
                <Github className="w-5 h-5 text-slate-400" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-slate-800 p-3 rounded-lg hover:bg-purple-500/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-slate-400" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-slate-800 p-3 rounded-lg hover:bg-purple-500/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-slate-400" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" /> for Wildlife Conservation • 2025
          </p>
        </div>
      </div>
    </footer>
  )
}