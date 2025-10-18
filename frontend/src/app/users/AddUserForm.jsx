'use client'
import { useState } from "react"
import { createUser } from "@/services/usersService"
import { Image as ImageIcon, X } from "lucide-react"

export default function AddUserForm({ onAdded, onCancel }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    phone: "",
    dateDebut: "",
    dateFin: "",
    statut: "en cours",
    photo: "",
  })
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
        setForm((p) => ({ ...p, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createUser(form)
      onAdded?.()
    } catch (err) {
      alert(err?.message || "Erreur lors de l’ajout.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-2xl border border-gray-100 animate-scaleIn">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-orange-700 mb-6">
          ➕ Ajouter un utilisateur
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" placeholder="Nom" value={form.nom} onChange={(e) => handleChange("nom", e.target.value)} required />
          <input className="input" placeholder="Prénom" value={form.prenom} onChange={(e) => handleChange("prenom", e.target.value)} required />
          <input className="input" placeholder="Téléphone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}  />
          <select className="input" value={form.statut} onChange={(e) => handleChange("statut", e.target.value)}>
            <option value="payé">Payé</option>
            <option value="non payé">Non payé</option>
            <option value="en cours">En cours</option>
          </select>

          <label className="label">Date début
            <input type="date" className="input mt-1" value={form.dateDebut} onChange={(e) => handleChange("dateDebut", e.target.value)} required />
          </label>

          <label className="label">Date fin
            <input type="date" className="input mt-1" value={form.dateFin} onChange={(e) => handleChange("dateFin", e.target.value)} required />
          </label>

          {/* Upload photo */}
          <div className="md:col-span-2">
            <label className="label">Photo</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border">
                <ImageIcon size={18} /> Importer
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
              {preview && <img src={preview} alt="preview" className="h-16 w-16 rounded-lg object-cover border" />}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
            <button type="submit"  disabled={loading} className={`bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700
              text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
