import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import ffmpegStatic from 'ffmpeg-static'
import sharp from 'sharp'
import type { Article } from './news'
import type { ScriptSegment } from './script'

const TMP = '/tmp'
const WIDTH = 1080
const HEIGHT = 1920
const SECONDS_PER_SLIDE = 5  // each story shows for 5 seconds → 50 seconds total

/**
 * Builds a TikTok-ready MP4 from article images + script text.
 *
 * For each story:
 *   1. Download the article image (or use a dark fallback)
 *   2. Resize/crop to 1080×1920 with sharp
 *   3. Composite an SVG text overlay: headline at top, script at bottom
 *   4. FFmpeg encodes the still image into a 5-second H.264 clip
 *
 * Then all 10 clips are concatenated into one ~50-second video.
 */
export async function assembleVideo(
  articles: Article[],
  segments: ScriptSegment[]
): Promise<Buffer> {
  const runId = `run_${Date.now()}`

  try {
    const clipPaths: string[] = []

    for (let i = 0; i < articles.length; i++) {
      const imagePath = path.join(TMP, `${runId}_img_${i}.jpg`)
      const clipPath  = path.join(TMP, `${runId}_clip_${i}.mp4`)

      // Compose image + text overlay and write to disk
      await createSlide(articles[i], segments[i], imagePath)

      // Encode still image as a fixed-length video clip
      execFileSync(ffmpegStatic!, [
        '-y',
        '-loop', '1',
        '-i', imagePath,
        '-t', String(SECONDS_PER_SLIDE),
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-tune', 'stillimage',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        clipPath,
      ])

      clipPaths.push(clipPath)
    }

    // Write concat manifest and join all clips
    const concatPath  = path.join(TMP, `${runId}_concat.txt`)
    const outputPath  = path.join(TMP, `${runId}_output.mp4`)

    fs.writeFileSync(concatPath, clipPaths.map((p) => `file '${p}'`).join('\n'))

    execFileSync(ffmpegStatic!, [
      '-y', '-f', 'concat', '-safe', '0',
      '-i', concatPath,
      '-c', 'copy',
      outputPath,
    ])

    return fs.readFileSync(outputPath)

  } finally {
    cleanup(runId)
  }
}

// ── Slide composition ────────────────────────────────────────────────────────

async function createSlide(
  article: Article,
  segment: ScriptSegment,
  outputPath: string
): Promise<void> {
  // Download or create background image
  let base: Buffer
  if (article.urlToImage) {
    try {
      const res = await fetch(article.urlToImage, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      base = Buffer.from(await res.arrayBuffer())
    } catch {
      console.warn(`[Video] Image failed for story ${segment.storyNumber}, using fallback`)
      base = await darkBackground()
    }
  } else {
    base = await darkBackground()
  }

  // Resize and crop to TikTok portrait dimensions
  const resized = await sharp(base)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85 })
    .toBuffer()

  // Overlay headline + script text as SVG
  const overlay = Buffer.from(buildTextOverlay(article.title, segment.voiceover))

  await sharp(resized)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toFile(outputPath)
}

function darkBackground(): Promise<Buffer> {
  return sharp({
    create: {
      width: WIDTH, height: HEIGHT, channels: 3,
      background: { r: 26, g: 26, b: 46 },  // #1a1a2e
    },
  }).jpeg().toBuffer()
}

// ── SVG text overlay ─────────────────────────────────────────────────────────

function buildTextOverlay(headline: string, script: string): string {
  const headlineLines = wrap(headline, 32)
  const scriptLines   = wrap(script, 38)

  const HEAD_LINE_H = 58
  const SCRIPT_LINE_H = 52
  const PADDING = 40

  const headlineBoxH = headlineLines.length * HEAD_LINE_H + PADDING * 2
  const scriptBoxH   = scriptLines.length * SCRIPT_LINE_H + PADDING * 2
  const scriptBoxY   = HEIGHT - scriptBoxH - 30

  const headlineTags = headlineLines.map((line, i) =>
    `<text x="540" y="${PADDING + 10 + i * HEAD_LINE_H}"
      font-family="DejaVu Sans, Arial, Helvetica, sans-serif"
      font-size="46" font-weight="bold" fill="white"
      text-anchor="middle" dominant-baseline="hanging"
    >${xml(line)}</text>`
  ).join('')

  const scriptTags = scriptLines.map((line, i) =>
    `<text x="540" y="${scriptBoxY + PADDING + i * SCRIPT_LINE_H}"
      font-family="DejaVu Sans, Arial, Helvetica, sans-serif"
      font-size="40" fill="#f0f0f0"
      text-anchor="middle" dominant-baseline="hanging"
    >${xml(line)}</text>`
  ).join('')

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${WIDTH}" height="${headlineBoxH}" fill="rgba(0,0,0,0.68)"/>
  ${headlineTags}
  <rect x="0" y="${scriptBoxY}" width="${WIDTH}" height="${scriptBoxH}" fill="rgba(0,0,0,0.72)"/>
  ${scriptTags}
</svg>`
}

// Wrap text to a max number of characters per line
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

// Escape characters that would break inline SVG
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function cleanup(runId: string) {
  try {
    fs.readdirSync(TMP)
      .filter((f) => f.startsWith(runId))
      .forEach((f) => fs.unlinkSync(path.join(TMP, f)))
  } catch { /* non-fatal */ }
}
