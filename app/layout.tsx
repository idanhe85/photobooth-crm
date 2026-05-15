import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'PhotoDUDE CRM',
  description: 'Lead management for The PhotoDUDE NL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="antialiased bg-navy min-h-screen">
        <Sidebar />
        <main className="md:ml-56 pt-14 md:pt-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
