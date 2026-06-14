import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { UserStatusButton } from '@/components/UserStatusButton'
import { UserRoleButton } from '@/components/UserRoleButton'
import { AdminStats } from '@/components/AdminStats'

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-indigo-900/60 text-indigo-300 border border-indigo-800',
  KREATOR: 'bg-amber-900/40 text-amber-300 border border-amber-800',
  SLUSALAC: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
}

const statusBadge: Record<string, string> = {
  AKTIVAN: 'bg-emerald-900/40 text-emerald-300 border border-emerald-800',
  SUSPENDOVAN: 'bg-red-900/40 text-red-300 border border-red-800',
  OBRISAN: 'bg-zinc-800 text-zinc-500 border border-zinc-700',
}

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  KREATOR: 'Kreator',
  SLUSALAC: 'Slušalac',
}

const statusLabel: Record<string, string> = {
  AKTIVAN: 'Aktivan',
  SUSPENDOVAN: 'Suspendovan',
  OBRISAN: 'Obrisan',
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      ime: true,
      email: true,
      role: true,
      statusNaloga: true,
      datumRegistracije: true,
    },
    orderBy: { datumRegistracije: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Upravljanje korisnicima</h1>
        <p className="mt-1.5 text-zinc-400">{users.length} registrovanih korisnika</p>
      </div>

      <AdminStats />

      <div className="border-t border-zinc-800 my-8" />

      <h2 className="text-xl font-semibold text-zinc-100 mb-4">Korisnici</h2>

      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-200 truncate">{user.ime}</p>
              <p className="text-sm text-zinc-500 truncate">{user.email}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge[user.role] ?? roleBadge.SLUSALAC}`}>
                {roleLabel[user.role] ?? user.role}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[user.statusNaloga] ?? statusBadge.AKTIVAN}`}>
                {statusLabel[user.statusNaloga] ?? user.statusNaloga}
              </span>
              <UserRoleButton userId={user.id} currentRole={user.role} />
              {user.statusNaloga !== 'OBRISAN' && (
                <UserStatusButton userId={user.id} statusNaloga={user.statusNaloga as any} />
              )}
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm">Nema registrovanih korisnika.</p>
          </div>
        )}
      </div>
    </div>
  )
}
