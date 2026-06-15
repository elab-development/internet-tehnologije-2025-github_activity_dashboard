import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export function extractS3Key(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const expectedHostname = `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
    if (urlObj.hostname !== expectedHostname) return null
    return urlObj.pathname.slice(1)
  } catch {
    return null
  }
}

export async function deleteFromS3(url: string): Promise<void> {
  const key = extractS3Key(url)
  if (!key) return
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    }))
  } catch (e) {
    console.error('S3 delete failed for key:', key, e)
    // best-effort - ne bacamo grešku, ne blokiramo user flow
  }
}

export async function deleteMultipleFromS3(urls: (string | null)[]): Promise<void> {
  const validUrls = urls.filter(Boolean) as string[]
  await Promise.allSettled(validUrls.map(url => deleteFromS3(url)))
}
