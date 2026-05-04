import Anthropic from '@anthropic-ai/sdk'
import type { Article } from './news'

export interface ScriptSegment {
  storyNumber: number
  headline: string   // the original headline title
  voiceover: string  // the 2-3 sentence TikTok script for this story
}

/**
 * Sends the 10 headlines to Claude and gets back a TikTok voiceover script.
 * Returns an array of segments — one per story — each with a punchy 2-3 sentence script.
 * Total runtime when read aloud is approximately 60 seconds.
 */
export async function generateScript(articles: Article[]): Promise<ScriptSegment[]> {
  const client = new Anthropic()

  // Format headlines into a numbered list for the prompt
  const headlineList = articles
    .map((a, i) => `${i + 1}. ${a.title} (${a.source}) — ${a.description}`)
    .join('\n')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You are a TikTok news presenter writing punchy, engaging voiceover scripts for a 60-second daily news video.

Rules:
- Conversational tone — like you're texting a friend who missed the news
- Present tense, active voice
- Hook each story in the first sentence
- No filler words ("So...", "Well...", "Basically...")
- 2-3 sentences per story maximum
- Keep total read time to ~60 seconds across all 10 stories

Output ONLY valid JSON — an array of 10 objects. No markdown, no explanation, just JSON.
Schema: [{ "storyNumber": 1, "headline": "original title", "voiceover": "your script" }, ...]`,

    messages: [
      {
        role: 'user',
        content: `Write the TikTok voiceover script for these 10 news stories:\n\n${headlineList}`,
      },
    ],
  })

  const rawText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  // Strip any accidental markdown code fences Claude might add
  const cleaned = rawText.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()

  const segments = JSON.parse(cleaned) as ScriptSegment[]

  if (!Array.isArray(segments) || segments.length === 0) {
    throw new Error('Claude returned an unexpected script format')
  }

  return segments
}

/**
 * Joins all segment voiceovers into a single string for HeyGen.
 * Adds a natural pause marker between stories.
 */
export function joinSegments(segments: ScriptSegment[]): string {
  return segments.map((s) => s.voiceover).join('  ')
}
