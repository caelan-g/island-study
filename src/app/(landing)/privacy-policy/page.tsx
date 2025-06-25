export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 25/06/25</p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          Welcome to <strong>Islands</strong> (&quot;we&quot;, &quot;us&quot;,
          or &quot;our&quot;). This Privacy Policy explains how we collect, use,
          disclose, and safeguard your personal information when you use our
          app, <strong>Islands</strong>.
        </p>

        <p>
          By using Islands, you consent to the collection and use of information
          in accordance with this policy.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Account information: name, email address, password (encrypted)
          </li>
          <li>
            User-provided data: courses, study goals, study session data
            (duration, timestamps)
          </li>
          <li>
            App-generated data: island evolution progress, XP, and history
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Create and manage your account</li>
          <li>Track study sessions and progress</li>
          <li>Evolve your island based on your study activity</li>
          <li>Provide charts, statistics, and study history</li>
          <li>Improve app features and user experience</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">
          3. How We Store and Protect Your Data
        </h2>
        <p>
          We use <strong>Supabase</strong> to securely store your data. We take
          reasonable steps to protect your information, including:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Password hashing</li>
          <li>JWT authentication via Supabase Auth</li>
          <li>RLS (Row-Level Security) policies to restrict access</li>
          <li>Encrypted connections and role-based permissions</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">
          4. Accessing and Managing Your Data
        </h2>
        <p>You can:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access and update your profile via the app</li>
          <li>Delete your account at any time</li>
        </ul>
        <p>
          If you require help, contact us at{" "}
          <a href="mailto:support@island.app" className="underline">
            support@island.app
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-8">
          5. Sharing Your Information
        </h2>
        <p>
          We do not share your personal information with third parties, except
          as required by law or to maintain core functionality (e.g., Supabase
          as a data processor).
        </p>

        <h2 className="text-xl font-semibold mt-8">
          6. Data Breach Notification
        </h2>
        <p>
          If a data breach occurs that may cause serious harm, we will notify
          affected users and the Australian Office of the Information
          Commissioner (OAIC) in accordance with the Notifiable Data Breaches
          (NDB) scheme.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          7. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We encourage
          users to review it regularly. Continued use of Islands after changes
          means you accept the revised policy.
        </p>
      </section>
    </main>
  );
}
