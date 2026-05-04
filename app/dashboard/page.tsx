import { getRecentRuns } from '@/lib/firebase'
import type { PipelineRun } from '@/lib/firebase'
import RunNowButton from './RunNowButton'

// Always fetch fresh data — don't cache the dashboard
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let runs: PipelineRun[] = []
  let fetchError: string | null = null

  try {
    runs = await getRecentRuns(7)
  } catch (e) {
    fetchError = (e as Error).message
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TikTok News Pipeline</h1>
            <p className="text-gray-500 text-sm mt-1">Runs daily at 12:00 UTC · Last 7 days shown</p>
          </div>
          <RunNowButton />
        </div>

        {/* Firebase error */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-red-700 text-sm">
            Could not load run history: {fetchError}
          </div>
        )}

        {/* Empty state */}
        {!fetchError && runs.length === 0 && (
          <div className="bg-white border border-gray-200 rounded p-8 text-center text-gray-500">
            No pipeline runs yet. Click &ldquo;Run Now&rdquo; to trigger the first one.
          </div>
        )}

        {/* Run list */}
        <div className="space-y-4">
          {runs.map((run) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RunCard({ run }: { run: PipelineRun }) {
  const formattedDate = new Date(run.date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <StatusBadge status={run.status} />
          <span className="font-semibold text-gray-800">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {run.tiktokPostId && (
            <span className="text-gray-500">
              Post ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{run.tiktokPostId}</code>
            </span>
          )}
          {run.slideUrls && run.slideUrls.length > 0 && (
            <span className="text-gray-500">{run.slideUrls.length} slides uploaded</span>
          )}
        </div>
      </div>

      {/* Script preview */}
      {run.script && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Script</p>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{run.script}</p>
        </div>
      )}

      {/* Headlines */}
      {run.headlines.length > 0 && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Headlines ({run.headlines.length})
          </p>
          <ul className="space-y-1">
            {run.headlines.slice(0, 5).map((h, i) => (
              <li key={i} className="text-sm text-gray-600 truncate">
                <span className="text-gray-400 mr-2">{i + 1}.</span>
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600">
                  {h.title}
                </a>
                <span className="text-gray-400 ml-1">— {h.source}</span>
              </li>
            ))}
            {run.headlines.length > 5 && (
              <li className="text-xs text-gray-400">+{run.headlines.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      {/* Slides */}
      {run.slideUrls && run.slideUrls.length > 0 && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Slides ({run.slideUrls.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {run.slideUrls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Slide ${i + 1}`}
                  className="h-40 w-auto rounded border border-gray-200 hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {run.error && (
        <div className="px-5 py-3 bg-red-50">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Error</p>
          <p className="text-sm text-red-700 font-mono">{run.error}</p>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: PipelineRun['status'] }) {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    failed:  'bg-red-100 text-red-700',
    running: 'bg-amber-100 text-amber-700',
  }
  const labels = { success: '✓ Success', failed: '✗ Failed', running: '⟳ Running' }

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
