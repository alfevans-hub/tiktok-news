export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return new Response(`Auth failed: ${error ?? 'no code'}`, { status: 400 })
  }

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: 'sbawl8wkei321nmmwf',
      client_secret: 'rzY7Kln3gfqltRzvaw6bPTtWOHc7RNh7',
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://scoopgeopolitical.vercel.app/api/auth/scoop/callback',
    }),
  })

  const data = await res.json()

  return new Response(
    `<pre style="font-size:16px;padding:40px">${JSON.stringify(data, null, 2)}</pre>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
