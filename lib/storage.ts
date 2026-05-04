import { getStorage } from 'firebase-admin/storage'
import { initFirebaseAdmin } from './firebase'

/**
 * Uploads the assembled MP4 video to Firebase Storage and returns a public URL.
 * TikTok's PULL_FROM_URL method requires the video to be publicly accessible —
 * Firebase Storage's public URL satisfies that.
 */
export async function uploadVideo(buffer: Buffer, date: string): Promise<string> {
  initFirebaseAdmin()

  const bucket = getStorage().bucket()
  const filename = `videos/${date}.mp4`
  const file = bucket.file(filename)

  await file.save(buffer, {
    contentType: 'video/mp4',
    public: true,
    metadata: { cacheControl: 'public, max-age=31536000' },
  })

  // Public URL format for Firebase Storage
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET!
  return `https://storage.googleapis.com/${bucketName}/${filename}`
}
