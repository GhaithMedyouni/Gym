'use client'
import { useEffect, useMemo, useState } from "react"
import { Search, UserPlus } from "lucide-react"
import { getUsers, deleteUser } from "@/services/usersService"
import AddUserForm from "./AddUserForm"
import UpdateUserForm from "./UpdateUserForm"
import TableUsers from "./TableUsers"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  // Charger les utilisateurs
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error("Erreur de chargement :", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 🔍 Filtrage combiné
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        u.nom?.toLowerCase().includes(q) ||
        u.prenom?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)

      const matchStatus =
        statusFilter === "tous" || u.statut === statusFilter

      const matchDate =
        (!startDate || new Date(u.dateDebut) >= new Date(startDate)) &&
        (!endDate || new Date(u.dateFin) <= new Date(endDate))

      return matchSearch && matchStatus && matchDate
    })
  }, [search, users, statusFilter, startDate, endDate])

  const handleAdded = async () => {
    await fetchUsers()
    setShowAdd(false)
  }

  const handleUpdated = async () => {
    await fetchUsers()
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (confirm("Supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id)
        setUsers(users.filter(u => u._id !== id))
        alert("Utilisateur supprimé ✔")
      } catch (err) {
        alert("Erreur lors de la suppression ❌")
      }
    }
  }


  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* ======= TITRE ======= */}
        <h1 className="text-3xl font-extrabold text-orange-400 mb-8 tracking-wide drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]">
          👥 Gestion des utilisateurs
        </h1>

        {/* ======= CONTROLS ======= */}
        <div className="bg-[#141414] border border-orange-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,107,0,0.3)] p-6 mb-10">
          {/* === Ligne 1 : Recherche + Ajouter === */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {/* 🔍 Barre de recherche */}
            <div className="flex items-center bg-[#1a1a1a] border border-orange-500/30 rounded-xl px-3 py-2 w-full md:w-[420px]
              shadow-[0_0_10px_rgba(255,107,0,0.2)] focus-within:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all duration-300">
              <Search size={18} className="text-orange-400 mr-2" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent flex-1 outline-none text-white placeholder:text-gray-400"
              />
            </div>

            {/* ➕ Bouton Ajouter */}
            <button
              onClick={() => {
                setShowAdd(true)
                setEditing(null)
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700
              text-white font-semibold flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.4)]
              transition-all duration-300 hover:scale-105"
            >
              <UserPlus size={18} /> Ajouter
            </button>
          </div>

          {/* === Ligne 2 : Filtres === */}
          <div className="flex flex-col md:flex-row justify-start items-center gap-6">
            {/* 🎯 Filtre par statut */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-300">Statut :</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="tous">Tous</option>
                <option value="payé">Payé</option>
                <option value="non payé">Non payé</option>
                <option value="en cours">En cours</option>
              </select>
            </div>

            {/* 📅 Filtre par période */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-300">Période :</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Du</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-2 py-1.5 text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                />
                <label className="text-sm text-gray-400">au</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-2 py-1.5 text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======= FORMULAIRES ======= */}
        {showAdd && (
          <AddUserForm
            onAdded={handleAdded}
            onCancel={() => setShowAdd(false)}
          />
        )}

        {editing && (
          <UpdateUserForm
            user={editing}
            onUpdated={handleUpdated}
            onCancel={() => setEditing(null)}
          />
        )}

        {/* ======= TABLE ======= */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center text-orange-400 py-10 animate-pulse">
              Chargement des utilisateurs...
            </div>
          ) : (
            <TableUsers
              users={filteredUsers}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}
