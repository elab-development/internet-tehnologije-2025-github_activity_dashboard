import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import path from 'path'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const allowedTypes = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/mp4',
  'audio/webm',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
]

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  const contentType = searchParams.get('contentType')

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'Nedostaju parametri' }, { status: 400 })
  }

  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json({ error: 'Nepodržan format fajla' }, { status: 400 })
  }

  const ext = path.extname(filename) || '.bin'
  const key = `${randomUUID()}${ext}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return NextResponse.json({ presignedUrl, fileUrl })
}
