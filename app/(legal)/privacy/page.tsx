export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-4">
          <strong>Effective Date:</strong> March 25, 2025
        </p>

        <p className="mb-4">
          Osprey Chat is committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. What We Collect</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <strong>Google Account Info</strong>: Name, email (must end in{' '}
            <code>@go.stockton.edu</code>)
          </li>
          <li>
            <strong>Profile Info</strong>: Profile picture, unique user ID
          </li>
          <li>
            <strong>Messages</strong>: Messages you send in chats
          </li>
          <li>
            <strong>Device Info</strong>: Basic browser/device data for security
            and analytics
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          2. How We Use Your Info
        </h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>To authenticate your login</li>
          <li>To connect you with courses or clubs</li>
          <li>To display your profile in chat rooms</li>
          <li>To secure the app and improve performance</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          3. Who Can See Your Info
        </h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Messages are visible to users in the same chat room.</li>
          <li>
            We do <strong>not</strong> sell or share your personal data with
            third parties.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Storage</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Data is stored securely using Supabase.</li>
          <li>
            We use access controls and follow basic best practices to protect
            your data.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            You can request access to your data or ask us to delete your
            account.
          </li>
          <li>You can stop using the app at any time.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes</h2>
        <p className="mb-4">
          We may update this policy. You&apos;ll be notified in the app if we
          make major changes.
        </p>

        <p className="mt-6 text-sm font-medium">
          <strong>Contact:</strong>{' '}
          <a
            href="mailto:support@ospreychat.com"
            className="text-blue-600 hover:underline"
          >
            support@osprey.chat
          </a>
        </p>
      </div>
    </div>
  )
}
