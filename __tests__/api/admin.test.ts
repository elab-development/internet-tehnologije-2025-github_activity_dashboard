import { mockPrisma } from '../mocks/prisma'
import { mockSession, mockNoSession } from '../mocks/auth'
import { GET } from '@/app/api/admin/stats/route'
import { GET as GET_USERS } from '@/app/api/users/route'
import { createRequest } from '../helpers'

describe('GET /api/admin/stats', () => {
  beforeEach(() => jest.clearAllMocks())

  it('vraća 403 ako nije ADMIN', async () => {
    mockSession('KREATOR')
    const req = createRequest('GET')
    const res = await GET(req as any)
    expect(res.status).toBe(403)
  })

  it('vraća 403 ako nije ulogovan', async () => {
    mockNoSession()
    const req = createRequest('GET')
    const res = await GET(req as any)
    expect(res.status).toBe(403)
  })

  it('vraća statistike za ADMIN', async () => {
    mockSession('ADMIN')
    mockPrisma.podcast.groupBy.mockResolvedValue([
      { kategorija: 'TEHNOLOGIJA', _count: { id: 3 } },
    ])
    mockPrisma.podcast.findMany.mockResolvedValue([])
    mockPrisma.user.count.mockResolvedValue(10)
    mockPrisma.podcast.count.mockResolvedValue(5)
    mockPrisma.episode.count.mockResolvedValue(20)
    mockPrisma.comment.count.mockResolvedValue(50)

    const req = createRequest('GET')
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveProperty('totals')
    expect(data.totals.totalUsers).toBe(10)
  })
})

describe('GET /api/users', () => {
  beforeEach(() => jest.clearAllMocks())

  it('vraća 403 ako nije ADMIN', async () => {
    mockSession('SLUSALAC')
    const req = createRequest('GET')
    const res = await GET_USERS(req as any)
    expect(res.status).toBe(403)
  })

  it('vraća listu korisnika za ADMIN', async () => {
    mockSession('ADMIN')
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: 'u1',
        ime: 'Test',
        email: 'test@test.com',
        role: 'SLUSALAC',
        statusNaloga: 'AKTIVAN',
        datumRegistracije: new Date(),
      },
    ])

    const req = createRequest('GET')
    const res = await GET_USERS(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
  })
})
