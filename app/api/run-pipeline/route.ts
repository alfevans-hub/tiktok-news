/**
 * POST /api/run-pipeline
 *
 * Manual pipeline trigger used by the dashboard "Run Now" button.
 * Delegates to the same pipeline logic as the cron endpoint,
 * but without requiring the CRON_SECRET header.
 *
 * In production you'd want to protect this with a session check.
 * For now it's fine since this dashboard is internal-only.
 */
export { POST } from '@/app/api/cron/daily-video/route'
