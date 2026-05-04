import { getStorage } from 'firebase-admin/storage'
import { initFirebaseAdmin } from './firebase'

export async function uploadSlides(buffers: Buffer[], date: string): Promise<string[]> {
  initFirebaseAdmin()

  const bucket = getStorage().bucket()
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET!
  const urls: string[] = []

  for (let i = 0; i < buffers.length; i++) {
    const filename = `slides/${date}/slide_${i}.jpg`
    const file = bucket.file(filename)

    await file.save(buffers[i], {
      contentType: 'image/jpeg',
      public: true,
      metadata: { cacheControl: 'public, max-age=31536000' },
    })

    urls.push(`https://storage.googleapis.com/${bucketName}/${filename}`)
  }

  return urls
}
