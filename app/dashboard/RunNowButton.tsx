'use client'

import { useState } from 'react'

/**
 * Client component that POSTs to /api/run-pipeline and shows live status.
 * Separated into its own file because the parent dashboard/page.tsx is a Server Component.
 */
export default function RunNowButton() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleClick() {
    setState('running')
    setMessage('Pipeline started — this takes 5–10 minutes...')

    try {
      const res = await fetch('/api/run-pipeline', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        setState('done')
        setMessage(`Done! TikTok post ID: ${data.tiktokPostId}`)
      } else {
        setState('error')
        setMessage(`Failed: ${data.error}`)
      }
    } catch (e) {
      setState('error')
      setMessage('Network error — check console')
    }
  }

  const buttonStyles: Record<typeof state, string> = {
    idle:    'bg-violet-600 hover:bg-violet-700 text-white',
    running: 'bg-gray-400 text-white cursor-not-allowed',
    done:    'bg-emerald-600 text-white',
    error:   'bg-red-600 text-white',
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={handleClick}
        disabled={state === 'running'}
        className={`px-5 py-2.5 rounded font-semibold text-sm transition-colors ${buttonStyles[state]}`}
      >
        {state === 'running' ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Running pipeline…
          </span>
        ) : state === 'done' ? '✓ Done — refresh to see result' : '▶ Run Now'}
      </button>
      {message && (
        <p className={`text-sm ${state === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
