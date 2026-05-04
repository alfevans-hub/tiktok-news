export async function GET() {
  const params = new URLSearchParams({
    client_key: 'sbawl8wkei321nmmwf',
    scope: 'user.info.basic,video.publish',
    response_type: 'code',
    redirect_uri: 'https://tiktok-news-xi.vercel.app/api/auth/tiktok/callback',
    state: 'sandbox',
  })

  return Response.redirect(
    `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  )
}
