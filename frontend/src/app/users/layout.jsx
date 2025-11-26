'use client'
import { Sidebar } from '../../components/Sidebar'
import { Navbar } from '../../components/Navbar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Sidebar - fixed position, responsive width */}
      <Sidebar />

      {/* Navbar - fixed at top, adjusts for sidebar */}
      <Navbar />

      {/* Main Content - adjusts for both navbar (pt-16) and sidebar */}
      <main className="min-h-screen pt-16">
        {children}
      </main>
    </div>
  )
}