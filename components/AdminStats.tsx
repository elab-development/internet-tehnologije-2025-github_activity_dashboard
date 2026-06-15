'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface StatsData {
  podcastsByCategory: { kategorija: string; broj: number }[]
  topPodcasts: { naziv: string; pretplatnici: number }[]
  totals: {
    totalUsers: number
    totalPodcasts: number
    totalEpisodes: number
    totalComments: number
  }
}

const tooltipStyle = {
  contentStyle: { backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' },
  labelStyle: { color: '#e4e4e7' },
  itemStyle: { color: '#818cf8' },
}

export function AdminStats() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-24" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const { totals, podcastsByCategory, topPodcasts } = data

  const statCards = [
    { label: 'Korisnici', value: totals.totalUsers, icon: '👤', color: 'text-indigo-400' },
    { label: 'Podkasti', value: totals.totalPodcasts, icon: '🎙️', color: 'text-emerald-400' },
    { label: 'Epizode', value: totals.totalEpisodes, icon: '🎵', color: 'text-amber-400' },
    { label: 'Komentari', value: totals.totalComments, icon: '💬', color: 'text-rose-400' },
  ]

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs font-semibold uppercase tracking-widest ${s.color}`}>{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <p className="text-sm font-medium text-zinc-300 mb-4">Podkasti po kategoriji</p>
          {podcastsByCategory.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-10">Nema podataka</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={podcastsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="kategorija" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="broj" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-zinc-300 mb-4">Top 5 podkasta po pretplatnicima</p>
          {topPodcasts.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-10">Nema podataka</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPodcasts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="naziv" tick={{ fill: '#a1a1aa', fontSize: 11 }} width={120} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="pretplatnici" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  )
}
