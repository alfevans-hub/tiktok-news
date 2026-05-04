import React from 'react'
import sharp from 'sharp'
import satori from 'satori'
import type { Article } from './news'
import type { ScriptSegment } from './script'

const WIDTH = 1080
const HEIGHT = 1920

import fs from 'fs'
import path from 'path'

// Font lives in public/ — always included in the Vercel deployment
function getFont(): ArrayBuffer {
  const file = fs.readFileSync(path.join(process.cwd(), 'public/fonts/inter.woff'))
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

  const overlay = await buildTextOverlay(article.title, segment.voiceover)

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
  const font = getFont()

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
            background: 'rgba(0,0,0,0.70)',
            padding: '40px',
            color: 'white',
            fontSize: '46px',
            fontWeight: 'bold',
            lineHeight: 1.3,
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
      fonts: [{ name: 'Inter', data: font, weight: 400, style: 'normal' }],
    }
  )

  return Buffer.from(svg)
}
