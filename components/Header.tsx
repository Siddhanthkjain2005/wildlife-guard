'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/predict', label: 'Predict' },
    { href: '/map', label: 'Map' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/trends', label: 'Trends' },
    { href: '/species', label: 'Species' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/compare', label: 'Compare' },
    { href: '/reports', label: 'Reports' },
    { href: '/news', label: 'News' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wildlife Guard
            </span>
          </Link>

          <ul className="hidden lg:flex gap-6 overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors whitespace-nowrap ${
                    pathname === item.href ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}