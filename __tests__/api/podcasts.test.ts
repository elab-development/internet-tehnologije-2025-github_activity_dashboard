import { mockPrisma } from '../mocks/prisma'
import { mockSession, mockNoSession } from '../mocks/auth'
import { GET, POST } from '@/app/api/podcasts/route'
import { createRequest } from '../helpers'

describe('GET /api/podcasts', () => {
  beforeEach(() => jest.clearAllMocks())

  it('vraća listu podkasta', async () => {
    const mockPodcasts = [
      {
        id: '1',
        naziv: 'Test Podcast',
        opis: 'Opis',
        kategorija: 'TEHNOLOGIJA',
        creator: { id: 'u1', ime: 'Autor' },
        _count: { episodes: 2, subscriptions: 5 },
      },
    ]
    mockPrisma.podcast.findMany.mockResolvedValue(mockPodcasts)

    const req = createRequest('GET')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].naziv).toBe('Test Podcast')
  })

  it('filtrira po kategoriji', async () => {
    mockPrisma.podcast.findMany.mockResolvedValue([])

    const req = createRequest('GET', undefined, { kategorija: 'TEHNOLOGIJA' })
    await GET(req)

    expect(mockPrisma.podcast.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ kategorija: 'TEHNOLOGIJA' }),
      })
    )
  })

  it('pretražuje po nazivu', async () => {
    mockPrisma.podcast.findMany.mockResolvedValue([])

    const req = createRequest('GET', undefined, { search: 'tech' })
    await GET(req)

    expect(mockPrisma.podcast.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ naziv: expect.objectContaining({ contains: 'tech' }) }),
          ]),
        }),
      })
    )
  })
})

describe('POST /api/podcasts', () => {
  beforeEach(() => jest.clearAllMocks())

  it('vraća 401 ako nije ulogovan', async () => {
    mockNoSession()
    const req = createRequest('POST', { naziv: 'Test', opis: 'Opis', kategorija: 'TEHNOLOGIJA' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('vraća 403 ako nije KREATOR', async () => {
    mockSession('SLUSALAC')
    const req = createRequest('POST', { naziv: 'Test', opis: 'Opis', kategorija: 'TEHNOLOGIJA' })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('kreira podcast ako je KREATOR', async () => {
    mockSession('KREATOR', 'creator-123')
    const newPodcast = {
      id: 'p1',
      naziv: 'Novi Podcast',
      opis: 'Opis',
      kategorija: 'TEHNOLOGIJA',
      creatorId: 'creator-123',
    }
    mockPrisma.podcast.create.mockResolvedValue(newPodcast)

    const req = createRequest('POST', { naziv: 'Novi Podcast', opis: 'Opis', kategorija: 'TEHNOLOGIJA' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.naziv).toBe('Novi Podcast')
  })

  it('vraća 400 ako nedostaju polja', async () => {
    mockSession('KREATOR')
    const req = createRequest('POST', { naziv: 'Samo naziv' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
