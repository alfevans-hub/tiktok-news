import { NextResponse } from 'next/server'
import { fetchTopHeadlines } from '@/lib/news'
import { generateScript } from '@/lib/script'
import { assembleVideo } from '@/lib/video'
import { uploadVideo } from '@/lib/storage'
import { postToTikTok, buildCaption } from '@/lib/tiktok'
import { logPipelineStart, updatePipelineRun } from '@/lib/firebase'

/**
 * GET /api/cron/daily-video
 *
 * Triggered daily at 12:00 UTC by Vercel Cron.
 *
 * Pipeline:
 *   1. Fetch top 10 headlines + images from NewsAPI
 *   2. Generate script segments with Claude
 *   3. Assemble slideshow video — article images with text overlaid using sharp + FFmpeg
 *   4. Upload to Firebase Storage (TikTok needs a public URL)
 *   5. Post to TikTok
 *   6. Log to Firestore
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runPipeline()
}

export async function POST() {
  return runPipeline()
}

async function runPipeline() {
  const date = new Date().toISOString().split('T')[0]
  let runId: string | null = null

  try {
    runId = await logPipelineStart(date)
    console.log(`[Pipeline] Started. runId=${runId} date=${date}`)

    // ── Step 1: Headlines ────────────────────────────────────────────────────
    console.log('[Pipeline] Step 1: Fetching headlines...')
    const headlines = await fetchTopHeadlines()
    await updatePipelineRun(runId, { headlines })
    console.log(`[Pipeline] ${headlines.length} headlines fetched.`)

    // ── Step 2: Script ───────────────────────────────────────────────────────
    console.log('[Pipeline] Step 2: Generating script with Claude...')
    const segments = await generateScript(headlines)
    const script = segments.map((s) => s.voiceover).join(' ')
    await updatePipelineRun(runId, { script })
    console.log(`[Pipeline] Script ready (${segments.length} segments).`)

    // ── Step 3: Video assembly ───────────────────────────────────────────────
    console.log('[Pipeline] Step 3: Assembling video (sharp + FFmpeg)...')
    const videoBuffer = await assembleVideo(headlines, segments)
    console.log(`[Pipeline] Video assembled (${(videoBuffer.length / 1_000_000).toFixed(1)} MB).`)

    // ── Step 4: Upload ───────────────────────────────────────────────────────
    console.log('[Pipeline] Step 4: Uploading to Firebase Storage...')
    const videoUrl = await uploadVideo(videoBuffer, date)
    await updatePipelineRun(runId, { videoUrl })
    console.log(`[Pipeline] Video live at ${videoUrl}`)

    // ── Step 5: Post to TikTok ───────────────────────────────────────────────
    console.log('[Pipeline] Step 5: Posting to TikTok...')
    const caption = buildCaption(headlines)
    const tiktokPostId = await postToTikTok(videoUrl, caption)
    console.log(`[Pipeline] TikTok post ID: ${tiktokPostId}`)

    // ── Step 6: Done ─────────────────────────────────────────────────────────
    await updatePipelineRun(runId, { status: 'success', tiktokPostId })
    console.log('[Pipeline] ✅ Complete.')

    return NextResponse.json({ success: true, date, runId, tiktokPostId })

  } catch (error) {
    const err = error as Error
    console.error('[Pipeline] ❌ Failed:', err.message)

    if (runId) {
      await updatePipelineRun(runId, {
        status: 'failed',
        error: err.message,
      }).catch((e) => console.error('[Pipeline] Could not log failure:', e))
    }

    return NextResponse.json(
      { success: false, error: err.message, runId },
      { status: 500 }
    )
  }
}
