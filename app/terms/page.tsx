export default function TermsOfService() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-2">Scoop Geopolitical</p>
      <p className="text-sm text-gray-500 mb-10">Last updated: 6 May 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          By accessing or using Scoop Geopolitical ("Scoop", "we", "our", or "us"), including
          our website at{' '}
          <a href="https://scoop-daily.vercel.app" className="text-blue-600 hover:underline">
            https://scoop-daily.vercel.app
          </a>{' '}
          and any content published through our TikTok account, you agree to be bound by these
          Terms of Service. If you do not agree, please do not use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
        <p className="text-gray-700 leading-relaxed">
          Scoop Geopolitical is an automated news aggregation and summarisation service. We
          use artificial intelligence to generate short-form news summaries from publicly
          available sources, which are then published as daily content on TikTok.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          Scoop is a read-only publishing service. We do not offer interactive features,
          user accounts, or the ability to submit content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Content and Accuracy</h2>
        <p className="text-gray-700 leading-relaxed">
          All content published by Scoop is derived from publicly available news sources and
          summarised using AI. While we aim to provide accurate and timely information:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
          <li>We do not guarantee the accuracy, completeness, or timeliness of any content.</li>
          <li>AI-generated summaries may contain errors or omissions.</li>
          <li>Content is provided for general informational purposes only.</li>
          <li>You should always refer to original news sources for full context.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed">
          The Scoop Geopolitical name, logo, branding, and original content format are the
          property of Scoop Geopolitical. Underlying news content is sourced from third-party
          publishers and remains their intellectual property. We do not claim ownership of
          any third-party news content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Prohibited Use</h2>
        <p className="text-gray-700 leading-relaxed">You agree not to:</p>
        <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
          <li>Use our content for commercial purposes without prior written consent.</li>
          <li>Reproduce, redistribute, or repost our content without attribution.</li>
          <li>Attempt to interfere with or disrupt our website or pipeline.</li>
          <li>Use our service in any way that violates applicable laws or regulations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
        <p className="text-gray-700 leading-relaxed">
          To the fullest extent permitted by law, Scoop Geopolitical shall not be liable for
          any direct, indirect, incidental, or consequential damages arising from your use of,
          or reliance on, any content we publish. The service is provided "as is" without
          warranties of any kind, express or implied.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Third-Party Platforms</h2>
        <p className="text-gray-700 leading-relaxed">
          Our content is distributed via TikTok. Use of TikTok is subject to TikTok's own
          Terms of Service and Privacy Policy. We are not responsible for TikTok's platform
          policies or any changes they make to content availability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          We reserve the right to modify these Terms at any time. Updated terms will be posted
          on this page with a revised date. Continued use of the service after changes are
          posted constitutes your acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
        <p className="text-gray-700 leading-relaxed">
          These Terms shall be governed by and construed in accordance with the laws of England
          and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts
          of England and Wales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          If you have any questions about these Terms, please contact us at:
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
        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
      </p>
    </main>
  )
}
