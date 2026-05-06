export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 6 May 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop is an automated news content service that publishes daily news summaries to TikTok.
          This Privacy Policy explains how we handle information in connection with our application.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop does not collect, store, or process any personal data from end users.
          The application is fully automated and does not require users to create accounts,
          log in, or provide any personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. TikTok Integration</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop uses the TikTok Content Posting API solely to publish automated news content.
          We access only the permissions necessary to post content on behalf of the authorised account.
          We do not access, store, or share any TikTok user data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
        <p className="text-gray-700 leading-relaxed">
          We use the following third-party services to operate our pipeline:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
          <li>NewsAPI — to retrieve publicly available news headlines</li>
          <li>Anthropic Claude — to generate news summaries</li>
          <li>Google Firebase — to store generated content and logs</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-3">
          None of these services receive personal data from end users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
        <p className="text-gray-700 leading-relaxed">
          Generated news content and pipeline logs are stored in Firebase for operational purposes.
          No personal data is retained.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
        <p className="text-gray-700 leading-relaxed">
          For any questions regarding this Privacy Policy, please contact us at{' '}
          <a href="mailto:alf.evans@icloud.com" className="text-blue-600 hover:underline">
            alf.evans@icloud.com
          </a>.
        </p>
      </section>
    </main>
  )
}
