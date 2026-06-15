export async function uploadFile(file: File): Promise<string> {
  const res = await fetch(
    `/api/upload/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`,
    { credentials: 'include' }
  )

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Greška pri generisanju upload URL-a')
  }

  const { presignedUrl, fileUrl } = await res.json()

  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  if (!uploadRes.ok) {
    throw new Error('Greška pri upload-u na S3')
  }

  return fileUrl
}
