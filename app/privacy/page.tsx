export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-2">Scoop Geopolitical</p>
      <p className="text-sm text-gray-500 mb-10">Last updated: 6 May 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to Scoop Geopolitical ("Scoop", "we", "our", or "us"). We are committed to
          protecting your privacy. This Privacy Policy explains what information we collect,
          how we use it, and your rights in relation to it.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          This policy applies to the Scoop Geopolitical application and website located at{' '}
          <a href="https://scoop-daily.vercel.app" className="text-blue-600 hover:underline">
            https://scoop-daily.vercel.app
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop Geopolitical is an automated news content service. We do not require users to
          register, create accounts, or provide any personal information to use or view our content.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          We do not knowingly collect, store, or process any personally identifiable information
          from viewers or visitors to our content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Information</h2>
        <p className="text-gray-700 leading-relaxed">
          As we do not collect personal data from end users, we do not use, sell, share, or
          otherwise process such data. Our service operates on publicly available news content
          only.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. TikTok API</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop Geopolitical uses the TikTok Content Posting API to publish automated news
          summaries to a single authorised TikTok account. We access only the minimum permissions
          required to post content. We do not access, collect, store, or share the personal data
          of any TikTok users.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          TikTok's own privacy policy applies to any data processed through their platform.
          You can view TikTok's Privacy Policy at{' '}
          <a
            href="https://www.tiktok.com/legal/privacy-policy"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            tiktok.com/legal/privacy-policy
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
        <p className="text-gray-700 leading-relaxed">
          We use the following third-party services solely to operate our automated pipeline.
          None of these services receive personal data from end users:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
          <li>NewsAPI — to retrieve publicly available news headlines</li>
          <li>Anthropic Claude — to generate AI-powered news summaries</li>
          <li>Google Firebase — to store generated content and operational logs</li>
          <li>Vercel — to host this website</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
        <p className="text-gray-700 leading-relaxed">
          This website does not use cookies or any tracking technologies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Children's Privacy</h2>
        <p className="text-gray-700 leading-relaxed">
          Our service does not target or knowingly collect information from children under the
          age of 13. If you believe a child has provided us with personal information, please
          contact us and we will take steps to delete it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be posted on
          this page with an updated date. We encourage you to review this page periodically.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          <strong>Email:</strong>{' '}
          <a href="mailto:alf.evans@icloud.com" className="text-blue-600 hover:underline">
            alf.evans@icloud.com
          </a>
          <br />
          <strong>Website:</strong>{' '}
          <a href="https://scoop-daily.vercel.app" className="text-blue-600 hover:underline">
            https://scoop-daily.vercel.app
          </a>
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8 border-t pt-6">
        See also our{' '}
        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
      </p>
    </main>
  )
}
