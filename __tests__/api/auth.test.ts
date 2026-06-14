import { mockPrisma } from '../mocks/prisma'
import { POST } from '@/app/api/auth/register/route'
import { createRequest } from '../helpers'

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}))

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks())

  it('kreira novog korisnika', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue({
      id: 'u1',
      ime: 'Test',
      email: 'test@test.com',
      role: 'SLUSALAC',
    })

    const req = createRequest('POST', { ime: 'Test', email: 'test@test.com', password: 'pass123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.email).toBe('test@test.com')
  })

  it('vraća 409 ako email već postoji', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'test@test.com' })

    const req = createRequest('POST', { ime: 'Test', email: 'test@test.com', password: 'pass123' })
    const res = await POST(req)

    expect(res.status).toBe(409)
  })

  it('vraća 400 ako nedostaju polja', async () => {
    const req = createRequest('POST', { email: 'test@test.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
