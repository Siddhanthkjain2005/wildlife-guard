import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Wildlife Guard - Poaching Risk Prediction',
  description: 'AI-powered wildlife conservation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}