import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  if (filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: 'Nevažeće ime fajla' }, { status: 400 })
  }

  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  try {
    const file = await readFile(filepath)
    const ext = path.extname(filename).toLowerCase()
    const contentType =
      ext === '.mp3' ? 'audio/mpeg' :
      ext === '.wav' ? 'audio/wav' :
      ext === '.ogg' ? 'audio/ogg' :
      ext === '.m4a' ? 'audio/mp4' :
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.webp' ? 'image/webp' :
      ext === '.gif' ? 'image/gif' :
      'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Fajl nije pronađen' }, { status: 404 })
  }
}
