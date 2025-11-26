import axios from "axios";

// 🟢 Base URL dynamique : Render en prod, localhost en dev
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000", // fallback pour le dev local
  timeout: 0, // ⏱️ 15s pour éviter les erreurs 504
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Utilitaire : formater les dates (pour affichage)
const normalizeUser = (user) => ({
  ...user,
  dateDebut: user.dateDebut
    ? new Date(user.dateDebut).toISOString().split("T")[0]
    : "",
  dateFin: user.dateFin
    ? new Date(user.dateFin).toISOString().split("T")[0]
    : "",
});

/* ===========================
   🔹 LISTE DES UTILISATEURS
   =========================== */
export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    const users = Array.isArray(response.data)
      ? response.data.map(normalizeUser)
      : [];

    const expiredUsers = users.filter((u) => u.statut === "non payé");
    if (expiredUsers.length > 0) {
      console.info(
        `⚠️ ${expiredUsers.length} utilisateur(s) ont un statut "non payé".`
      );
    }

    return users;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des utilisateurs:", error);
    throw error;
  }
};

/* ===========================
   🔹 OBTENIR UN UTILISATEUR
   =========================== */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return normalizeUser(response.data);
  } catch (error) {
    console.error(`❌ Erreur utilisateur ${id}:`, error);
    throw error;
  }
};

/* ===========================
   🔹 CRÉER UN UTILISATEUR
   =========================== */
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return normalizeUser(response.data);
  } catch (error) {
    console.error("❌ Erreur création utilisateur:", error);
    throw error.response?.data || error;
  }
};

/* ===========================
   🔹 METTRE À JOUR UN UTILISATEUR
   =========================== */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return normalizeUser(response.data);
  } catch (error) {
    console.error("❌ Erreur mise à jour utilisateur:", error);
    throw error.response?.data || error;
  }
};

/* ===========================
   🔹 SUPPRIMER UN UTILISATEUR
   =========================== */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur suppression utilisateur:", error);
    throw error.response?.data || error;
  }
};

/* ===========================
   🔹 STATISTIQUES DASHBOARD
   =========================== */
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/users/dashboard-stats");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur statistiques dashboard:", error);
    throw error;
  }
};
