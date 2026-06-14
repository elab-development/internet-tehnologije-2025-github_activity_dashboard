export function createRequest(method: string, body?: any, searchParams?: Record<string, string>) {
  const url = new URL(
    `http://localhost:3000/api/test${searchParams ? '?' + new URLSearchParams(searchParams).toString() : ''}`
  )
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}
