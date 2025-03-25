export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-4">
          <strong>Effective Date:</strong> March 25, 2025
        </p>

        <p className="mb-4">
          By using Osprey Chat, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. Eligibility</h2>
        <p className="mb-4">
          You must be a current student at Stockton University with a valid <code>@go.stockton.edu</code> email address to use Osprey Chat.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. Use of the App</h2>
        <p className="mb-2">You agree to:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Follow all applicable laws and university rules.</li>
          <li>Not harass, abuse, threaten, or impersonate others.</li>
          <li>Not upload or share illegal, harmful, or offensive content.</li>
          <li>Not spam or abuse the platform in any way.</li>
        </ul>
        <p className="mb-4">
          We reserve the right to remove content or users that violate these rules.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. User Content</h2>
        <p className="mb-2">You are responsible for the content you post in Osprey Chat.</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>You retain ownership of your messages.</li>
          <li>By using the app, you give us permission to store and display your messages to users in the same chat rooms.</li>
          <li>We do not moderate messages in real time.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Termination</h2>
        <p className="mb-4">
          We may suspend or delete accounts at our discretion for violations of these terms or any misuse of the platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Disclaimer of Affiliation</h2>
        <p className="mb-4">
          Osprey Chat is an <strong>independent, student-built platform</strong>.
          <br />
          It is <strong>not affiliated with, endorsed by, or operated by Stockton University</strong> in any official capacity.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
        <p className="mb-2">
          Osprey Chat is provided <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind.
        </p>
        <p className="mb-2">We are not liable for:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Any damages or losses caused by use of the app</li>
          <li>Outages, bugs, or errors</li>
          <li>User content or behavior</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">7. Changes to the Terms</h2>
        <p className="mb-4">
          We may update these terms at any time. Major changes will be announced in the app. Continued use after changes means you accept the updated terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">8. No Warranty</h2>
        <p className="mb-4">
          Osprey Chat is provided &ldquo;as is&rdquo; without warranties, express or implied. We do not guarantee uninterrupted access, security, or that the app will be error-free.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact</h2>
        <p className="mb-4">
          For support, questions, or legal inquiries, contact us at:
          <br />
          <strong>
            <a href="mailto:support@osprey.chat" className="text-blue-600 hover:underline">
              support@osprey.chat
            </a>
          </strong>
        </p>
      </div>
    </div>
  )
}
