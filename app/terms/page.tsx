export default function TermsOfService() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 6 May 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
        <p className="text-gray-700 leading-relaxed">
          These Terms of Service govern your use of Scoop, an automated news content service.
          By accessing or using Scoop, you agree to these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop is an automated pipeline that fetches publicly available news headlines,
          generates summaries, and publishes daily news content to TikTok. The service
          operates autonomously and does not offer interactive features to end users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Content</h2>
        <p className="text-gray-700 leading-relaxed">
          All content published by Scoop is derived from publicly available news sources.
          We do not claim ownership of underlying news articles. Summaries are generated
          for informational purposes only and may not be fully accurate. Users should
          refer to original sources for complete information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed">
          The Scoop name, branding, and generated content format are the property of
          Scoop. News content originates from third-party publishers and remains their
          intellectual property.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop provides news summaries for informational purposes only. We are not liable
          for any inaccuracies in published content or for any decisions made based on
          that content. The service is provided &quot;as is&quot; without warranties of any kind.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update these Terms at any time. Continued use of the service after
          changes are posted constitutes acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
        <p className="text-gray-700 leading-relaxed">
          For any questions regarding these Terms, please contact us at{' '}
          <a href="mailto:alf.evans@icloud.com" className="text-blue-600 hover:underline">
            alf.evans@icloud.com
          </a>.
        </p>
      </section>
    </main>
  )
}
