import { initializeApp, cert, getApps, type App } from 'firebase-admin/app'
import { getFirestore, Timestamp, type FieldValue } from 'firebase-admin/firestore'
import type { Article } from './news'

const COLLECTION = 'pipeline_runs'

export type PipelineStatus = 'running' | 'success' | 'failed'

export interface PipelineRun {
  id: string
  date: string
  status: PipelineStatus
  headlines: Pick<Article, 'title' | 'source' | 'url'>[]
  script: string
  slideUrls: string[] | null
  tiktokPostId: string | null
  error: string | null
  failedStep: string | null
  createdAt: Timestamp
}

/**
 * Initialises Firebase Admin once per process lifetime.
 * Exported so lib/storage.ts can reuse the same app instance.
 * Includes storageBucket so getStorage().bucket() works without arguments.
 */
export function initFirebaseAdmin(): App {
  if (getApps().length > 0) return getApps()[0]!

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // Vercel stores multiline env values with literal \n — convert them back
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

function db() {
  initFirebaseAdmin()
  return getFirestore()
}

/**
 * Creates a new pipeline run document with status 'running' and returns its ID.
 * Call this at the very start of the pipeline so every run is logged,
 * even ones that fail immediately.
 */
export async function logPipelineStart(date: string): Promise<string> {
  const ref = await db().collection(COLLECTION).add({
    date,
    status: 'running' as PipelineStatus,
    headlines: [],
    script: '',
    slideUrls: null,
    tiktokPostId: null,
    error: null,
    failedStep: null,
    createdAt: Timestamp.now(),
  })
  return ref.id
}

/**
 * Partially updates an existing pipeline run document.
 * Call this after each step to checkpoint progress.
 */
export async function updatePipelineRun(
  runId: string,
  data: Partial<Omit<PipelineRun, 'id' | 'createdAt'>>
): Promise<void> {
  await db().collection(COLLECTION).doc(runId).update(data as Record<string, unknown>)
}

/**
 * Fetches the most recent `limit` pipeline run documents, newest first.
 * Used by the dashboard to display run history.
 */
export async function getRecentRuns(limit = 7): Promise<PipelineRun[]> {
  const snapshot = await db()
    .collection(COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PipelineRun, 'id'>),
  }))
}
