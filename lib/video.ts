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
  const buffers: Buffer[] = [await createTitleSlide()]
  for (let i = 0; i < articles.length; i++) {
    buffers.push(await createSlide(articles[i], segments[i]))
  }
  return buffers
}

async function createTitleSlide(): Promise<Buffer> {
  const logoData = fs.readFileSync(path.join(process.cwd(), 'public', 'scoop-logo.png'))
  const logo = await sharp(logoData).resize(WIDTH, WIDTH).png().toBuffer()

  const bg = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: { r: 8, g: 10, b: 20 } },
  }).png().toBuffer()

  const withLogo = await sharp(bg)
    .composite([{ input: logo, top: 0, left: 0 }])
    .png()
    .toBuffer()

  const textOverlay = await buildTitleTextOverlay()

  return sharp(withLogo)
    .composite([{ input: textOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer()
}

async function buildTitleTextOverlay(): Promise<Buffer> {
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
          justifyContent: 'flex-end',
          alignItems: 'center',
          fontFamily: 'Inter',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            paddingBottom: '120px',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              color: '#ffffff',
              fontSize: '80px',
              fontWeight: 400,
              textAlign: 'center' as const,
            },
          },
          'TOP 10 STORIES'
        ),
        React.createElement(
          'div',
          {
            style: {
              color: '#c9a030',
              fontSize: '44px',
              fontWeight: 400,
              textAlign: 'center' as const,
              marginTop: '24px',
            },
          },
          'IN THE LAST 24 HOURS'
        )
      )
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: 'Inter', data: fontRegular, weight: 400, style: 'normal' as const }],
    }
  )

  return sharp(Buffer.from(svg)).png().toBuffer()
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

  const composited = await sharp(base)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 90 })
    .toBuffer()

  // Strip trailing source name e.g. "Headline - BBC News" → "Headline"
  const headline = article.title.replace(/\s[-–|]\s[\w\s.]+$/, '').trim()
  const overlay = await buildTextOverlay(headline, segment.voiceover)

  return sharp(composited)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
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
