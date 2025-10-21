'use client'
import { useState } from "react"
import { updateUser } from "@/services/usersService"
import { Image as ImageIcon, X } from "lucide-react"

export default function UpdateUserForm({ user, onUpdated, onCancel }) {
  const [form, setForm] = useState(user)
  const [preview, setPreview] = useState(user.photo || "")
  const [loading, setLoading] = useState(false)

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      handleChange("photo", reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUser(form._id, form)
      onUpdated?.()
    } catch (err) {
      alert(err?.message || "Erreur lors de la mise à jour.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-[#0B0B0B] text-white rounded-2xl shadow-[0_0_25px_rgba(255,107,0,0.4)]
        p-8 w-[90%] max-w-2xl border border-orange-500/30 animate-scaleIn">
        
        {/* === Bouton fermer === */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-orange-400 hover:text-orange-300 transition"
        >
          <X size={22} />
        </button>

        {/* === Titre === */}
        <h2 className="text-2xl font-extrabold text-orange-400 mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(255,107,0,0.6)]">
          ✏️ Modifier l’utilisateur
        </h2>

        {/* === Formulaire === */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Champs texte */}
          {[
            { name: "nom", label: "Nom" },
            { name: "prenom", label: "Prénom" },
            { name: "phone", label: "Téléphone" },
          ].map((input) => (
            <input
              key={input.name}
              placeholder={input.label}
              value={form[input.name] || ""}
              onChange={(e) => handleChange(input.name, e.target.value)}
              className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          ))}

          {/* Statut */}
          <select
            className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            value={form.statut || "en cours"}
            onChange={(e) => handleChange("statut", e.target.value)}
          >
            <option value="payé">Payé</option>
            <option value="non payé">Non payé</option>
            <option value="en cours">En cours</option>
          </select>

          {/* Dates */}
          <label className="flex flex-col text-sm text-gray-300">
            Date début
            <input
              type="date"
              className="bg-[#1a1a1a] mt-1 border border-orange-500/30 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              value={form.dateDebut?.split("T")[0] || ""}
              onChange={(e) => handleChange("dateDebut", e.target.value)}
            />
          </label>

          <label className="flex flex-col text-sm text-gray-300">
            Date fin
            <input
              type="date"
              className="bg-[#1a1a1a] mt-1 border border-orange-500/30 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              value={form.dateFin?.split("T")[0] || ""}
              onChange={(e) => handleChange("dateFin", e.target.value)}
            />
          </label>

          {/* Upload photo */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300 mb-2 block">Photo</label>
            <div className="flex items-center gap-4">
              <label
                className="cursor-pointer inline-flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20
                text-orange-400 px-4 py-2 rounded-lg border border-orange-500/30 transition-all duration-200"
              >
                <ImageIcon size={18} /> Changer
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="h-16 w-16 rounded-lg object-cover border border-orange-500/40 shadow-[0_0_10px_rgba(255,107,0,0.4)]"
                />
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700
                text-white font-semibold px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.4)]
                transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
