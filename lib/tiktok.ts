import type { Article } from './news'

const TIKTOK_API = 'https://open.tiktokapis.com/v2'

const POLL_INTERVAL_MS = 10_000
const MAX_POLL_ATTEMPTS = 30  // 30 × 10s = 5 minutes max

/**
 * Posts a video to TikTok using the Content Posting API (PULL_FROM_URL method).
 * TikTok will fetch the video directly from the HeyGen URL — no file upload needed.
 * Returns the publish_id which acts as the post identifier.
 */
export async function postToTikTok(
  videoUrl: string,
  caption: string
): Promise<string> {
  const publishId = await initVideoPost(videoUrl, caption)
  console.log(`[TikTok] Post initialised. publish_id=${publishId}. Polling for completion...`)
  await pollUntilPublished(publishId)
  return publishId
}

async function initVideoPost(videoUrl: string, caption: string): Promise<string> {
  const res = await fetch(`${TIKTOK_API}/post/publish/video/init/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_info: {
        title: caption,
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        // Use the first frame as the cover thumbnail
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        // TikTok will pull the video from this URL (must be publicly accessible)
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
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
      console.warn(`[TikTok] Poll attempt ${attempt} failed with ${res.status}, retrying...`)
      continue
    }

    const data = await res.json()
    const status = data.data?.status as string

    console.log(`[TikTok] Poll ${attempt}/${MAX_POLL_ATTEMPTS}: status=${status}`)

    if (status === 'PUBLISH_COMPLETE') return
    if (status === 'FAILED') {
      throw new Error(`TikTok publish failed: ${JSON.stringify(data.data)}`)
    }
    // status is 'PROCESSING_UPLOAD' or 'PROCESSING_VIDEO' — keep polling
  }

  throw new Error(`TikTok polling timed out after ${(MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS) / 60000} minutes`)
}

/**
 * Builds the TikTok post caption with relevant hashtags.
 * Kept under 2200 characters (TikTok's caption limit).
 */
export function buildCaption(articles: Article[]): string {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `Top 10 news stories for ${date} 📰 #news #dailynews #breakingnews #newsupdate #todaysnews #worldnews #fyp #viral`
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
