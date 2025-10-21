'use client';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ URL dynamique : backend Render en prod, localhost en dev
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Envoi la requête vers ton backend Render
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      // ✅ Stocke le token dans les cookies
      Cookies.set('token', res.data.access_token, { expires: 1 }); // expire dans 1 jour
      router.push('/dashboard');
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);

      // Gestion des messages d’erreur
      if (err.response) {
        if (err.response.status === 401) {
          setError('Nom d’utilisateur ou mot de passe incorrect.');
        } else {
          setError(`Erreur serveur (${err.response.status})`);
        }
      } else {
        setError('Serveur injoignable. Réessaye plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        {/* 🏋️ Logo */}
        <div className="flex items-center justify-center mb-6">
          <Dumbbell size={32} className="text-orange-500 mr-2" />
          <h1 className="text-3xl font-extrabold text-gray-800">Gym Admin</h1>
        </div>

        <p className="text-gray-500 text-center mb-8">
          Connectez-vous à votre espace d’administration
        </p>

        {/* 🔐 Formulaire de connexion */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
              placeholder="Entrez votre nom d’utilisateur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
              placeholder="Entrez votre mot de passe"
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
            } text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-200`}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* 📅 Footer */}
        <p className="text-gray-400 text-center text-sm mt-6">
          © {new Date().getFullYear()} Gym Admin. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
