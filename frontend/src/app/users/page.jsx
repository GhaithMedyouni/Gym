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

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        u.nom?.toLowerCase().includes(q) ||
        u.prenom?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)

      const matchStatus = statusFilter === "tous" || u.statut === statusFilter
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
    <div className="text-white px-4 py-6 md:pl-24 md:pr-6 lg:pl-72 lg:pr-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-400 mb-6 md:mb-8 tracking-wide drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]">
        👥 Gestion des utilisateurs
      </h1>

      {/* Controls */}
      <div className="bg-[#141414] border border-orange-500/20 rounded-xl md:rounded-2xl shadow-[0_0_25px_rgba(255,107,0,0.3)] p-4 md:p-6 mb-6 md:mb-10">
        {/* Search + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center bg-[#1a1a1a] border border-orange-500/30 rounded-lg md:rounded-xl px-3 py-2 w-full sm:flex-1 md:max-w-md shadow-[0_0_10px_rgba(255,107,0,0.2)] focus-within:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all duration-300">
            <Search size={18} className="text-orange-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder:text-gray-400 text-sm md:text-base"
            />
          </div>

          <button
            onClick={() => {
              setShowAdd(true)
              setEditing(null)
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700
              text-white font-semibold flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-lg md:rounded-xl 
              shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all duration-300 hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            <UserPlus size={18} /> Ajouter
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs md:text-sm font-semibold text-gray-300 whitespace-nowrap">Statut :</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 flex-1 sm:flex-initial"
            >
              <option value="tous">Tous</option>
              <option value="payé">Payé</option>
              <option value="non payé">Non payé</option>
              <option value="en cours">En cours</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs md:text-sm font-semibold text-gray-300 whitespace-nowrap">Période :</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs md:text-sm text-gray-400">Du</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-2 py-1.5 text-xs md:text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 flex-1 sm:flex-initial"
              />
              <label className="text-xs md:text-sm text-gray-400">au</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-2 py-1.5 text-xs md:text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 flex-1 sm:flex-initial"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showAdd && (
        <AddUserForm onAdded={handleAdded} onCancel={() => setShowAdd(false)} />
      )}

      {editing && (
        <UpdateUserForm user={editing} onUpdated={handleUpdated} onCancel={() => setEditing(null)} />
      )}

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center text-orange-400 py-10 animate-pulse">
            Chargement des utilisateurs...
          </div>
        ) : (
          <TableUsers users={filteredUsers} onEdit={setEditing} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}