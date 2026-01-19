'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  href: string
  delay?: number
}

export default function FeatureCard({ icon, title, description, href, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y:  50 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group"
    >
      <Link href={href}>
        <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/20">
          {/* Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-cyan-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:via-cyan-500/10 group-hover:to-teal-500/10 transition-all duration-500" />
          
          <div className="relative flex flex-col items-center text-center h-full">
            {/* Icon Container */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-5 rounded-2xl mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300">
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
              {description}
            </p>
            
            {/* Arrow Button */}
            <motion.div 
              className="flex items-center gap-2 text-emerald-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              Explore
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}