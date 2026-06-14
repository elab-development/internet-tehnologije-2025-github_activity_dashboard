jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

import { getServerSession } from 'next-auth'

export const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

export function mockSession(role: 'SLUSALAC' | 'KREATOR' | 'ADMIN', id = 'user-123') {
  mockGetServerSession.mockResolvedValue({
    user: { id, email: 'test@test.com', name: 'Test User', role },
    expires: '2099-01-01',
  } as any)
}

export function mockNoSession() {
  mockGetServerSession.mockResolvedValue(null)
}
