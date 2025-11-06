export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10 prose prose-slate bg-white ">
      <header>
        <h1 className="text-2xl font-bold">Privacy Policy — Islands</h1>
        <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>
        <p>
          Effective: This Privacy Policy explains how <strong>Islands</strong>{" "}
          ("we", "us", "our") collects, uses, discloses and protects personal
          information from users of our mobile and web applications (the "App").
          If you have questions or want to exercise your privacy rights, contact
          us at{" "}
          <a href="mailto:contact@islands.study" className="text-neutral-600">
            contact@islands.study
          </a>
          .
        </p>
      </header>

      <section id="what-we-collect">
        <h2 className="text-xl font-semibold mt-4">What we collect</h2>
        <p>
          We collect the minimum personal information necessary to provide the
          App and improve the service. This includes:
        </p>
        <ul>
          <li>
            <strong>Account information:</strong> email address (via Supabase
            authentication), display name (if provided), and your user
            identifier.
          </li>
          <li>
            <strong>Study data:</strong> study sessions (course ID, start/end
            timestamps, descriptions), goals, island progress, XP/level data.
          </li>
          <li>
            <strong>Subscription metadata:</strong> subscription status and
            related metadata stored in our database (we store Stripe customer ID
            and Stripe subscription ID for reference).{" "}
            <em>
              Payment card details are <strong>not</strong> collected or stored
              by us
            </em>{" "}
            — see <strong>Third-party services</strong> below.
          </li>
          <li>
            <strong>Usage data & logs:</strong> non-identifying analytics and
            logs (e.g., feature usage, crash reports, timestamps) to maintain
            and improve the App.
          </li>
          <li>
            <strong>AI generation data:</strong> inputs sent to our image
            generation system (Retrodiffusion) and resulting pixel-art outputs
            used in the App.
          </li>
        </ul>
      </section>

      <section id="how-we-use">
        <h2 className="text-xl font-semibold mt-4">How we use your data</h2>
        <p>We use personal information for the following purposes:</p>
        <ul>
          <li>
            To provide, maintain and operate the App and its features (accounts,
            progress tracking, unlocking islands, subscriptions).
          </li>
          <li>
            To process and manage subscriptions, billing metadata and free
            trials (billing handled by Stripe; we store non-sensitive
            identifiers).
          </li>
          <li>
            To communicate with you about your account, billing, updates, and
            support requests.
          </li>
          <li>
            To analyze and improve the App through aggregated analytics and
            usage data.
          </li>
          <li>
            To comply with legal obligations and protect our rights and users.
          </li>
        </ul>
      </section>

      <section id="third-parties">
        <h2 className="text-xl font-semibold mt-4">
          Third-party services & processors
        </h2>
        <p>
          We rely on a small set of third-party service providers to operate
          Islands. When we share data with these providers we require that they
          process your data only as necessary to provide their services and in
          accordance with their privacy/security obligations.
        </p>

        <ul>
          <li>
            <strong>Supabase</strong> — authentication and primary database
            storage (emails, user records, sessions, island and course data).
          </li>
          <li>
            <strong>Stripe</strong> — payment processing.{" "}
            <em>We do not collect or store your full payment card details</em>.
            Stripe handles card storage, charging and refunds according to
            Stripe’s privacy and security practices.
          </li>
          <li>
            <strong>Retrodiffusion</strong> — AI pixel-art generation. Inputs
            used to generate images (for example prompts and/or configuration)
            are sent to the generator; generated images are stored and presented
            in the App.
          </li>
        </ul>
        <p>
          We may use other service providers (e.g., hosting, logging) in the
          future and will update this policy accordingly.
        </p>
      </section>

      <section id="retention">
        <h2 className="text-xl font-semibold mt-4">Data retention</h2>
        <p>
          We retain personal information for as long as necessary to provide the
          App, comply with legal obligations, resolve disputes, and enforce our
          agreements. If you delete your account or request deletion, we will
          delete data in accordance with our deletion procedures and applicable
          law — note that some data may remain in backups for a limited period.
        </p>
      </section>

      <section id="security">
        <h2 className="text-xl font-semibold mt-4">Security</h2>
        <p>
          We implement reasonable organisational, administrative and technical
          safeguards to protect your personal information (for example, access
          controls, encryption in transit, and secure hosting practices).
          However, no system is completely secure — we cannot guarantee absolute
          protection. If we become aware of a data breach affecting your
          personal information we will notify you and any regulator as required
          by applicable law.
        </p>
      </section>

      <section id="your-rights">
        <h2 className="text-xl font-semibold mt-4">Your rights</h2>
        <p>
          Depending on your jurisdiction and subject to applicable law, you may
          have rights including:
        </p>
        <ul>
          <li>
            <strong>Access:</strong> request a copy of the personal information
            we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> request correction of inaccurate or
            incomplete personal information.
          </li>
          <li>
            <strong>Deletion:</strong> request deletion of your personal
            information.
          </li>
          <li>
            <strong>Portability:</strong> request a machine-readable copy of
            data you provided.
          </li>
          <li>
            <strong>Restriction/Objection:</strong> in some cases object to
            processing or request restriction.
          </li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:contact@islands.study" className="text-indigo-600">
            contact@islands.study
          </a>
          . We may require identity verification and will respond within a
          reasonable period required by law.
        </p>
      </section>

      <section id="children">
        <h2 className="text-xl font-semibold mt-4">Children</h2>
        <p>
          Islands is not designed for children under 13. If you are under 18 you
          must have parental or guardian consent to use the App. If we learn we
          have collected personal information from a child under the applicable
          minimum age without verifiable parental consent, we will take steps to
          delete that information.
        </p>
      </section>

      <section id="cookies-analytics">
        <h2 className="text-xl font-semibold mt-4">Cookies & analytics</h2>
        <p>
          We use minimal analytics to understand feature usage and improve
          Islands. These analytics are aggregated and do not identify individual
          users. We do not use invasive tracking technologies. You may opt out
          of non-essential analytics where the App provides such controls, or by
          contacting us.
        </p>
      </section>

      <section id="ai-generated">
        <h2 className="text-xl font-semibold mt-4">AI-generated content</h2>
        <p>
          The App uses Retrodiffusion to produce pixel-art island visuals.
          Prompts or configuration you provide to generate images may be
          processed by the generator. Generated outputs are provided
          &ldquo;as-is&rdquo; for entertainment and motivational purposes. We do
          not guarantee uniqueness or absence of errors in AI outputs.
        </p>
        <p>
          If AI-generated content raises any concerns (copyright, offensive
          outputs, etc.) please contact us at{" "}
          <a href="mailto:contact@islands.study" className="text-indigo-600">
            contact@islands.study
          </a>{" "}
          so we can investigate and remove or modify content where appropriate.
        </p>
      </section>

      <section id="international">
        <h2 className="text-xl font-semibold mt-4">Cross-border transfers</h2>
        <p>
          To operate the App we may transfer personal information to service
          providers located in other countries. When transfers occur we take
          reasonable steps to ensure your information remains protected, for
          example by using service providers with recognised security practices
          and contractual safeguards.
        </p>
      </section>

      <section id="changes">
        <h2 className="text-xl font-semibold mt-4">Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we make
          material changes we will post the new policy and update the
          &ldquo;Last updated&rdquo; date. Continued use of the App after
          updates constitutes acceptance of the revised policy.
        </p>
      </section>

      <section id="governing-law">
        <h2 className="text-xl font-semibold mt-4">Governing law</h2>
        <p>
          This Privacy Policy is governed by the laws of{" "}
          <strong>New South Wales, Australia</strong>. To the extent permitted
          by law, you agree to the exclusive jurisdiction of the courts in that
          jurisdiction.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-xl font-semibold mt-4">Contact</h2>
        <p>
          For privacy inquiries, data access requests, deletion requests, or
          questions about this policy, contact:
        </p>
        <p className="font-medium">
          <a href="mailto:contact@islands.study" className="text-indigo-600">
            contact@islands.study
          </a>
        </p>
        <p className="text-sm text-slate-500 mt-2">
          If you have a complaint about our handling of your information you may
          also contact the Australian Information Commissioner or your local
          data protection authority.
        </p>
      </section>

      <footer className="mt-6 text-sm text-slate-500">
        <p>Islands — © {new Date().getFullYear()}. All rights reserved.</p>
      </footer>
    </main>
  );
}
