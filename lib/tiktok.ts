import type { Article } from './news'

const TIKTOK_API = 'https://open.tiktokapis.com/v2'

const POLL_INTERVAL_MS  = 5_000
const MAX_POLL_ATTEMPTS = 12  // 12 × 5s = 1 minute max (photos publish quickly)

export async function postToTikTok(photoUrls: string[], caption: string): Promise<string> {
  const publishId = await initPhotoPost(photoUrls, caption)
  console.log(`[TikTok] Photo post initialised. publish_id=${publishId}. Polling...`)
  await pollUntilPublished(publishId)
  return publishId
}

async function initPhotoPost(photoUrls: string[], caption: string): Promise<string> {
  console.log(`[TikTok] Posting ${photoUrls.length} photos. First URL: ${photoUrls[0]}`)
  const res = await fetch(`${TIKTOK_API}/post/publish/content/init/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      media_type: 'PHOTO',
      post_mode: 'DIRECT_POST',
      post_info: {
        title: caption,
        privacy_level: process.env.TIKTOK_PRIVACY_LEVEL ?? 'SELF_ONLY',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        photo_images: photoUrls,
        photo_cover_index: 0,
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`TikTok init failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  const publishId = data.data?.publish_id as string | undefined

  if (!publishId) {
    throw new Error(`TikTok response missing publish_id: ${JSON.stringify(data)}`)
  }

  return publishId
}

async function pollUntilPublished(publishId: string): Promise<void> {
  for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS)

    const res = await fetch(`${TIKTOK_API}/post/publish/status/fetch/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id: publishId }),
    })

    if (!res.ok) {
      console.warn(`[TikTok] Poll ${attempt} failed (${res.status}), retrying...`)
      continue
    }

    const data = await res.json()
    const status = data.data?.status as string
    console.log(`[TikTok] Poll ${attempt}/${MAX_POLL_ATTEMPTS}: status=${status}`)

    if (status === 'PUBLISH_COMPLETE') return
    if (status === 'FAILED') throw new Error(`TikTok publish failed: ${JSON.stringify(data.data)}`)
  }

  throw new Error('TikTok polling timed out')
}

export function buildCaption(articles: Article[]): string {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return `Top 10 news stories for ${date} 📰 #news #dailynews #breakingnews #newsupdate #todaysnews #worldnews #fyp #viral`
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
