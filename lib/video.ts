import sharp from 'sharp'
import type { Article } from './news'
import type { ScriptSegment } from './script'

const WIDTH = 1080
const HEIGHT = 1920

export async function createSlides(
  articles: Article[],
  segments: ScriptSegment[]
): Promise<Buffer[]> {
  const buffers: Buffer[] = []
  for (let i = 0; i < articles.length; i++) {
    buffers.push(await createSlide(articles[i], segments[i]))
  }
  return buffers
}

async function createSlide(article: Article, segment: ScriptSegment): Promise<Buffer> {
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
      console.warn(`[Slides] Image failed for story ${segment.storyNumber}, using fallback`)
      base = await darkBackground()
    }
  } else {
    base = await darkBackground()
  }

  const resized = await sharp(base)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85 })
    .toBuffer()

  const overlay = Buffer.from(buildTextOverlay(article.title, segment.voiceover))

  return sharp(resized)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toBuffer()
}

function darkBackground(): Promise<Buffer> {
  return sharp({
    create: {
      width: WIDTH, height: HEIGHT, channels: 3,
      background: { r: 26, g: 26, b: 46 },
    },
  }).jpeg().toBuffer()
}

function buildTextOverlay(headline: string, script: string): string {
  const headlineLines = wrap(headline, 32)
  const scriptLines   = wrap(script, 38)

  const HEAD_LINE_H   = 58
  const SCRIPT_LINE_H = 52
  const PADDING       = 40

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

function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
