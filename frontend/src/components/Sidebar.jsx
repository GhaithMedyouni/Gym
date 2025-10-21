'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Users, LogOut, Dumbbell, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)

  // ✅ Détection automatique des tailles d’écran
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ✅ Fermer la sidebar en cliquant à l’extérieur sur mobile
  useEffect(() => {
    if (!isMobile) return
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.sidebar') && open) setOpen(false)
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [open, isMobile])

  return (
    <>
      {/* === Bouton mobile flottant === */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all duration-300"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* === Sidebar principale === */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full bg-[#0B0B0B] text-white flex flex-col justify-between
          shadow-[0_0_25px_rgba(255,107,0,0.3)] border-r border-orange-500/20 transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobile ? (open ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          z-40`}
      >
        {/* === Header === */}
        <div className="p-4 flex flex-col items-center relative">
          {/* Bouton collapse (uniquement desktop) */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="self-end text-orange-400 hover:text-orange-300 mb-4 transition"
              title={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
            >
              {collapsed ? <Menu size={24} /> : <X size={24} />}
            </button>
          )}

          {/* Logo + titre */}
          {!collapsed && (
            <>
              <Image
                src="/logo.png"
                alt="Gym Logo"
                width={70}
                height={70}
                className="mb-3 drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]"
                priority
              />
              <h1 className="text-lg font-extrabold text-orange-400 tracking-wide mb-8 text-center">
                DiazGym
              </h1>
            </>
          )}
        </div>

        {/* === Menu === */}
        <nav className="flex flex-col gap-2 text-base font-medium px-3">
          {[
            { icon: Dumbbell, label: 'Dashboard', route: '/dashboard' },
            { icon: Users, label: 'Users', route: '/users' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                router.push(item.route)
                if (isMobile) setOpen(false)
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 
                hover:bg-orange-500 hover:text-black transition-all duration-200 
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* === Footer / Logout === */}
        <div
          className={`p-4 border-t border-orange-500/10 ${
            collapsed ? 'flex justify-center' : ''
          }`}
        >
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-200 transition-colors duration-200"
          >
            <LogOut size={18} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* === Overlay sombre sur mobile === */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  )
}
