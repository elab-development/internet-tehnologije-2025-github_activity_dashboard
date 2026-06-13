import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import { randomUUID } from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Fajl nije priložen' }, { status: 400 })
  }

  const allowedTypes = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/mp4',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Nepodržan format fajla' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name) || '.mp3'
  const filename = `${randomUUID()}${ext}`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  }))

  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
  return NextResponse.json({ url })
}
