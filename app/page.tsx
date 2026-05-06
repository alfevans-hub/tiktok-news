import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#08090f', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '40px 20px', textAlign: 'center' }}>
      <img src="/scoop-logo.png" alt="Scoop Geopolitical" style={{ width: 200, height: 200, borderRadius: 16, marginBottom: 32 }} />
      <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 12px' }}>Scoop Geopolitical</h1>
      <p style={{ fontSize: 18, color: '#aaaaaa', maxWidth: 480, lineHeight: 1.6, margin: '0 0 32px' }}>
        Daily automated geopolitical news summaries — delivered to TikTok every day at 12:00 UTC.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/privacy" style={{ color: '#c9a030', textDecoration: 'none', fontSize: 14 }}>Privacy Policy</Link>
        <Link href="/terms" style={{ color: '#c9a030', textDecoration: 'none', fontSize: 14 }}>Terms of Service</Link>
      </div>
    </main>
  )
}
