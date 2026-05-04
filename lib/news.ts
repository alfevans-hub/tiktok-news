export interface Article {
  title: string
  description: string
  source: string
  url: string
  urlToImage: string | null  // featured image from the article — used as video background
}

/**
 * Fetches the top 10 English-language headlines from NewsAPI,
 * sorted by relevancy. Filters out removed/deleted articles.
 */
export async function fetchTopHeadlines(): Promise<Article[]> {
  const url = new URL('https://newsapi.org/v2/top-headlines')
  url.searchParams.set('language', 'en')
  url.searchParams.set('pageSize', '20') // fetch 20 so we have buffer after filtering
  url.searchParams.set('sortBy', 'relevancy')
  url.searchParams.set('apiKey', process.env.NEWSAPI_KEY!)

  const res = await fetch(url.toString(), {
    // Always fetch fresh — never use Next.js cache for this
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`NewsAPI request failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  if (data.status !== 'ok') {
    throw new Error(`NewsAPI error: ${data.message || data.code}`)
  }

  return (data.articles as any[])
    // Remove articles that have been taken down or have no useful content
    .filter(
      (a) =>
        a.title &&
        a.description &&
        !a.title.includes('[Removed]') &&
        a.description !== '[Removed]'
    )
    .slice(0, 10)
    .map((a) => ({
      title: a.title.trim(),
      description: a.description.trim(),
      source: a.source?.name || 'Unknown',
      url: a.url,
      urlToImage: a.urlToImage ?? null,
    }))
}
