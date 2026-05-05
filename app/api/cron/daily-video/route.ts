import { NextResponse } from 'next/server'
import { fetchTopHeadlines } from '@/lib/news'
import { generateScript } from '@/lib/script'
import { createSlides } from '@/lib/video'
import { uploadSlides } from '@/lib/storage'
import { postToTikTok, buildCaption } from '@/lib/tiktok'
import { logPipelineStart, updatePipelineRun } from '@/lib/firebase'

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

    // ── Step 3: Slides ───────────────────────────────────────────────────────
    console.log('[Pipeline] Step 3: Compositing slides with sharp...')
    const slideBuffers = await createSlides(headlines, segments)
    console.log(`[Pipeline] ${slideBuffers.length} slides created.`)

    // ── Step 4: Upload ───────────────────────────────────────────────────────
    console.log('[Pipeline] Step 4: Uploading slides to Firebase Storage...')
    const slideUrls = await uploadSlides(slideBuffers, date, runId)
    await updatePipelineRun(runId, { slideUrls })
    console.log(`[Pipeline] ${slideUrls.length} slides uploaded.`)

    // ── Step 5: Post to TikTok ───────────────────────────────────────────────
    console.log('[Pipeline] Step 5: Posting to TikTok as photo slideshow...')
    const caption = buildCaption(headlines)
    const tiktokPostId = await postToTikTok(slideUrls, caption)
    console.log(`[Pipeline] TikTok post ID: ${tiktokPostId}`)

    // ── Step 6: Done ─────────────────────────────────────────────────────────
    await updatePipelineRun(runId, { status: 'success', tiktokPostId })
    console.log('[Pipeline] Complete.')

    return NextResponse.json({ success: true, date, runId, tiktokPostId })

  } catch (error) {
    const err = error as Error
    console.error('[Pipeline] Failed:', err.message)

    if (runId) {
      await updatePipelineRun(runId, { status: 'failed', error: err.message })
        .catch((e) => console.error('[Pipeline] Could not log failure:', e))
    }

    return NextResponse.json({ success: false, error: err.message, runId }, { status: 500 })
  }
}
