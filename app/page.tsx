import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#08090f', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1a1a2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/scoop-logo.png" alt="Scoop" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>Scoop Geopolitical</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#aaaaaa' }}>
          <a href="#about" style={{ color: '#aaaaaa', textDecoration: 'none' }}>About</a>
          <a href="#how-it-works" style={{ color: '#aaaaaa', textDecoration: 'none' }}>How It Works</a>
          <a href="#contact" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 20px 80px' }}>
        <img src="/scoop-logo.png" alt="Scoop Geopolitical" style={{ width: 120, height: 120, borderRadius: 24, marginBottom: 32, boxShadow: '0 0 60px rgba(201,160,48,0.3)' }} />
        <h1 style={{ fontSize: 52, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.1 }}>
          The World's News,<br />
          <span style={{ color: '#c9a030' }}>Daily on TikTok</span>
        </h1>
        <p style={{ fontSize: 20, color: '#aaaaaa', maxWidth: 560, lineHeight: 1.7, margin: '0 0 40px' }}>
          Scoop Geopolitical delivers AI-powered geopolitical news summaries to TikTok every day — keeping you informed in under a minute.
        </p>
        <a
          href="https://www.tiktok.com/@scoopgeopolitical"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: '#c9a030', color: '#08090f', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}
        >
          Follow on TikTok
        </a>
      </section>

      {/* About */}
      <section id="about" style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px', borderTop: '1px solid #1a1a2e' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>About Scoop</h2>
        <p style={{ fontSize: 17, color: '#bbbbbb', lineHeight: 1.8, textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
          Scoop Geopolitical is an automated news service that aggregates the top geopolitical stories from trusted sources worldwide. Using AI, we summarise the most important events of the last 24 hours and publish them as daily short-form video content on TikTok — making global news accessible, fast, and easy to digest.
        </p>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px', borderTop: '1px solid #1a1a2e' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 48, textAlign: 'center' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { step: '01', title: 'Aggregate', desc: 'We pull the top geopolitical headlines from trusted news sources every day at 12:00 UTC.' },
            { step: '02', title: 'Summarise', desc: 'AI condenses each story into a clear, concise summary — no fluff, just the facts.' },
            { step: '03', title: 'Publish', desc: 'The summaries are formatted into a slideshow and posted directly to TikTok automatically.' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ background: '#0f1020', border: '1px solid #1a1a2e', borderRadius: 16, padding: 32 }}>
              <div style={{ color: '#c9a030', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>{step}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
              <p style={{ color: '#aaaaaa', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px', borderTop: '1px solid #1a1a2e', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Contact</h2>
        <p style={{ color: '#aaaaaa', fontSize: 17, marginBottom: 12 }}>
          For enquiries, partnerships, or support, reach us at:
        </p>
        <a href="mailto:alf.evans@icloud.com" style={{ color: '#c9a030', fontSize: 17, textDecoration: 'none' }}>
          alf.evans@icloud.com
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a2e', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ color: '#555', fontSize: 14 }}>© 2026 Scoop Geopolitical. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
          <Link href="/privacy" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>

    </main>
  )
}
