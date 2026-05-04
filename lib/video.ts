import React from 'react'
import sharp from 'sharp'
import satori from 'satori'
import type { Article } from './news'
import type { ScriptSegment } from './script'

const WIDTH = 1080
const HEIGHT = 1920

import fs from 'fs'
import path from 'path'

function loadFont(filename: string): ArrayBuffer {
  const file = fs.readFileSync(path.join(process.cwd(), 'public/fonts', filename))
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer
}

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

  // Strip trailing source name e.g. "Headline - BBC News" → "Headline"
  const headline = article.title.replace(/\s[-–|]\s[\w\s.]+$/, '').trim()
  const overlay = await buildTextOverlay(headline, segment.voiceover)

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

async function buildTextOverlay(headline: string, script: string): Promise<Buffer> {
  const fontRegular = loadFont('inter.woff')

  const svg = await satori(
    React.createElement(
      'div',
      {
        style: {
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'space-between',
          fontFamily: 'Inter',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            background: '#0d0d0d',
            padding: '44px 40px',
            color: '#ffffff',
            fontSize: '64px',
            fontWeight: 400,
            lineHeight: 1.25,
          },
        },
        headline
      ),
      React.createElement(
        'div',
        {
          style: {
            background: 'rgba(0,0,0,0.74)',
            padding: '40px',
            color: '#f0f0f0',
            fontSize: '38px',
            lineHeight: 1.4,
          },
        },
        script
      )
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' as const },
      ],
    }
  )

  return sharp(Buffer.from(svg)).png().toBuffer()
}
