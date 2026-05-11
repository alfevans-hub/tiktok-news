export async function GET() {
  const testUrls = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
  ]

  const body = {
    media_type: 'PHOTO',
    post_mode: 'DIRECT_POST',
    post_info: {
      title: 'Test post',
      privacy_level: 'SELF_ONLY',
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      auto_add_music: false,
    },
    source_info: {
      source: 'PULL_FROM_URL',
      photo_images: testUrls,
      photo_cover_index: 0,
    },
  }

  const res = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return new Response(JSON.stringify({ status: res.status, body, response: data }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
