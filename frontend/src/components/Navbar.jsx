'use client'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Navbar() {
  const pathname = usePathname()

  // 🎯 Déterminer le titre selon la page actuelle
  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/users') return 'Utilisateurs'
    return 'Gym Admin'
  }

  return (
    <header className="h-16 bg-[#0B0B0B] text-orange-400 shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center justify-between px-6 border-b border-orange-500/20 transition-all duration-300">
      {/* === Titre dynamique === */}
      <h2 className="text-2xl font-extrabold tracking-wide">
        {getTitle()}
      </h2>

      {/* === Profil admin === */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-white">Ziyed</span>
        <div className="relative w-15 h-15">
          <Image
            src="/ziyed.jpg"
            alt="Admin Avatar"
            fill
            className="rounded-full border border-orange-400 object-cover bg-black p-[2px] shadow-[0_0_10px_rgba(255,107,0,0.5)]"
          />
        </div>
      </div>
    </header>
  )
}
