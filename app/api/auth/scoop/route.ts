export async function GET() {
  const params = new URLSearchParams({
    client_key: 'sbawl8wkei321nmmwf',
    scope: 'video.publish',
    response_type: 'code',
    redirect_uri: 'https://scoopgeopolitical.vercel.app/api/auth/scoop/callback',
    state: 'sandbox',
  })

  return Response.redirect(
    `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  )
}
