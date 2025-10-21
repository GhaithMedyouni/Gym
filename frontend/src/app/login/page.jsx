'use client'

import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ URL dynamique (local ou Render)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      })

      // ✅ Enregistre le token
      Cookies.set('token', res.data.access_token, { expires: 1 })
      router.push('/dashboard')
    } catch (err) {
      console.error('❌ Erreur login:', err)
      setError('Identifiants invalides ou serveur injoignable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* 🌆 Dégradé orange-noir dynamique */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2C1B00] to-[#FF6B00] opacity-40 animate-pulse"></div>

      {/* Halo orange lumineux */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500 rounded-full blur-[180px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400 rounded-full blur-[200px] opacity-20"></div>

      {/* 🧱 Conteneur principal */}
      <div className="relative z-10 bg-[#111111]/90 backdrop-blur-sm rounded-2xl shadow-[0_0_25px_rgba(255,107,0,0.4)] p-8 w-full max-w-md border border-orange-500/30">
        {/* 🏋️ Logo + titre */}
        <div className="flex flex-col items-center justify-center mb-6">
          <Image
            src="/logo.png"
            alt="DiazGym Logo"
            width={100}
            height={100}
            className="mb-2"
            priority
          />
          <h1 className="text-3xl font-extrabold text-orange-400 tracking-wide">
            DiazGym Admin
          </h1>
        </div>

        <p className="text-gray-400 text-center mb-8">
          Connectez-vous à votre espace d’administration
        </p>

        {/* 🔐 Formulaire */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-orange-500/50 bg-transparent text-white rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
              placeholder="Votre nom d’utilisateur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-orange-500/50 bg-transparent text-white rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? 'bg-orange-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white font-semibold py-2 rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.5)] transition-all duration-200`}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* 🧾 Footer */}
        <p className="text-gray-500 text-center text-sm mt-6">
          © {new Date().getFullYear()} DiazGym. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
