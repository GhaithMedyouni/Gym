'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Users, LogOut, Dumbbell, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Sidebar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.sidebar') && !e.target.closest('.menu-button')) {
        setOpen(false)
      }
    }
    
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [open])

  const handleNavigation = (route) => {
    router.push(route)
    setOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="menu-button fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full bg-[#0B0B0B] text-white flex flex-col justify-between
          shadow-[0_0_25px_rgba(255,107,0,0.3)] border-r border-orange-500/20 transition-all duration-300 ease-in-out z-40
          w-64 md:w-20 lg:w-64
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="pt-16 md:pt-4 p-4 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Gym Logo"
            width={70}
            height={70}
            className="mb-3 drop-shadow-[0_0_10px_rgba(255,107,0,0.5)] md:w-12 md:h-12 lg:w-[70px] lg:h-[70px]"
            priority
          />
          <h1 className="text-lg font-extrabold text-orange-400 tracking-wide mb-6 text-center md:hidden lg:block">
            DiazGym
          </h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-3">
          {[
            { icon: Dumbbell, label: 'Dashboard', route: '/dashboard' },
            { icon: Users, label: 'Users', route: '/users' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.route)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 
                hover:bg-orange-500 hover:text-black transition-all duration-200
                md:justify-center lg:justify-start"
              title={item.label}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="md:hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-orange-500/10">
          <button
            onClick={() => handleNavigation('/login')}
            className="flex items-center gap-3 w-full text-orange-400 hover:text-orange-200 transition-colors duration-200
              md:justify-center lg:justify-start"
            title="Déconnexion"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="md:hidden lg:block">Déconnexion</span>
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}