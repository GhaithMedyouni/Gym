'use client'
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getDashboardStats } from "@/services/usersService"
import { Users, CheckCircle, Clock, XCircle } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        console.error("Erreur Dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0B0B] text-orange-400 text-lg animate-pulse">
        Chargement du tableau de bord...
      </div>
    )
  }

  const chartData = stats.labels.map((label, index) => ({
    name: label,
    Inscriptions: stats.inscritsParMois[index],
  }))

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-4 sm:p-6 md:p-8 transition-all duration-300">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-400 mb-8 drop-shadow-[0_0_10px_rgba(255,107,0,0.6)] text-center sm:text-left">
        📊 Tableau de bord
      </h1>

      {/* === Cartes principales === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-10">
        {[
          {
            title: "Tous les membres",
            value: stats.total,
            color: "text-orange-400",
            bg: "from-[#1A1A1A] to-[#2C1B00]",
            border: "border-orange-500/30",
            shadow: "shadow-[0_0_20px_rgba(255,107,0,0.3)]",
            Icon: Users,
          },
          {
            title: "Membres payés",
            value: stats.payes,
            color: "text-green-400",
            bg: "from-[#102914] to-[#0B0B0B]",
            border: "border-green-500/30",
            shadow: "shadow-[0_0_20px_rgba(0,255,100,0.3)]",
            Icon: CheckCircle,
          },
          {
            title: "Membres en cours",
            value: stats.enCours,
            color: "text-amber-400",
            bg: "from-[#2A1F00] to-[#0B0B0B]",
            border: "border-amber-500/30",
            shadow: "shadow-[0_0_20px_rgba(255,191,0,0.3)]",
            Icon: Clock,
          },
          {
            title: "Membres non payés",
            value: stats.nonPayes,
            color: "text-red-400",
            bg: "from-[#290808] to-[#0B0B0B]",
            border: "border-red-500/30",
            shadow: "shadow-[0_0_20px_rgba(255,0,0,0.3)]",
            Icon: XCircle,
          },
        ].map((item, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${item.bg} border ${item.border} ${item.shadow}
            hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all duration-300`}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-sm sm:text-base">{item.title}</h3>
                <p className={`text-2xl sm:text-3xl font-bold ${item.color}`}>{item.value}</p>
              </div>
              <item.Icon size={36} className={item.color} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* === Graphique Inscriptions === */}
      <Card className="bg-[#121212] border border-orange-500/30 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-orange-400 mb-4 text-center sm:text-left">
            📈 Nouvelles inscriptions par mois
          </h3>
          <div className="w-full h-64 sm:h-80 md:h-[400px]">
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#aaa" tick={{ fontSize: 12 }} />
                <YAxis stroke="#aaa" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #FF6B00',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
                <Line
                  type="monotone"
                  dataKey="Inscriptions"
                  stroke="#FF6B00"
                  strokeWidth={3}
                  dot={{ r: 3.5, fill: '#FF6B00' }}
                  activeDot={{ r: 7, fill: '#FFA94D' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
