export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <article className="prose prose-slate md:col-span-3 bg-white p-8 ">
          <h1 className="text-2xl font-bold">Terms of Service — Islands</h1>
          <p className="text-sm text-slate-500">
            Last updated: November 6, 2025
          </p>
          <section id="intro">
            <p>
              Welcome to <strong>Islands</strong> (&quot;the App&quot;,
              &quot;we&quot;, &quot;us&quot;, &quot;our&quot;). These Terms of
              Service (&quot;Terms&quot;) govern your access to and use of
              Islands&apos; mobile and web applications, services, and content.
              By creating an account or using the App you agree to these Terms.
            </p>
          </section>

          <section id="about">
            <h2 className="text-xl font-semibold mt-4">1. About the App</h2>
            <p>
              Islands is a study-tracking and productivity application that
              allows users to log study sessions, set goals, and unlock evolving
              digital islands based on progress. The App may offer paid
              subscription plans and premium content.
            </p>
          </section>

          <section id="eligibility">
            <h2 className="text-xl font-semibold mt-4">2. Eligibility</h2>
            <p>
              You must be at least <strong>13 years old</strong> to use Islands.
              If you are under 18 you must have consent from a parent or legal
              guardian. By using the App you confirm you have the legal capacity
              to enter into this agreement.
            </p>
          </section>

          <section id="account">
            <h2 className="text-xl font-semibold mt-4">
              3. Account Registration
            </h2>
            <ul>
              <li>
                You must create an account using a valid email address via
                Supabase authentication.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                login credentials and for all activity under your account.
              </li>
              <li>
                Do not share, sell, or transfer your account to another person.
              </li>
              <li>
                We may suspend or terminate accounts that violate these Terms.
              </li>
            </ul>
          </section>

          <section id="subscriptions">
            <h2 className="text-xl font-semibold mt-4">
              4. Subscriptions &amp; Payments
            </h2>
            <p>
              <strong>Plans:</strong> Islands offers optional paid plans (prices
              in AUD):
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border-collapse border border-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">Plan</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Billing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Monthly</td>
                    <td className="p-3">AUD$7.99</td>
                    <td className="p-3">Automatic monthly renewal</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="p-3">6-Month</td>
                    <td className="p-3">AUD$39.99</td>
                    <td className="p-3">Billed every six months</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Lifetime</td>
                    <td className="p-3">AUD$99.99</td>
                    <td className="p-3">One-time purchase</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="p-3">Free trial</td>
                    <td className="p-3">30 days</td>
                    <td className="p-3">Available to new users</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-4">Billing &amp; Refunds</h3>
            <ul>
              <li>
                Payments are processed securely through Stripe. By purchasing a
                plan you authorise Stripe to charge your selected payment
                method.
              </li>
              <li>
                Subscriptions renew automatically unless cancelled at least{" "}
                <strong>24 hours</strong> before the end of the billing period.
              </li>
              <li>
                You may cancel your subscription at any time via account
                settings or the Stripe customer portal.
              </li>
              <li>
                Except where required by Australian Consumer Law, payments are
                non-refundable.
              </li>
              <li>
                We may change prices with reasonable notice; changes apply to
                future billing cycles.
              </li>
            </ul>
          </section>

          <section id="use">
            <h2 className="text-xl font-semibold mt-4">5. Use of the App</h2>
            <p>You agree to:</p>
            <ul>
              <li>
                Use Islands only for lawful personal study or productivity
                purposes.
              </li>
              <li>
                Not attempt to reverse-engineer, scrape, or disrupt the App or
                its backend systems.
              </li>
              <li>Not upload or transmit malware or malicious code.</li>
              <li>
                Not use the App in any way that infringes the rights of others.
              </li>
            </ul>
            <p>
              We may monitor use for compliance and suspend access if misuse is
              detected.
            </p>
          </section>

          <section id="data">
            <h2 className="text-xl font-semibold mt-4">
              6. Data &amp; Privacy
            </h2>
            <p>
              We collect and store personal information such as your email (via
              Supabase auth), study logs, goals, and subscription data. Please
              review our{" "}
              <a href="#" className="text-indigo-600">
                Privacy Policy
              </a>{" "}
              for details on how we collect, use and protect information.
            </p>
            <p>
              By using Islands, you consent to this data collection and
              processing. While we take reasonable measures to protect user
              data, we cannot guarantee absolute security. If you suspect
              unauthorised access, contact us immediately.
            </p>
          </section>

          <section id="ip">
            <h2 className="text-xl font-semibold mt-4">
              7. Intellectual Property
            </h2>
            <p>
              All App content, including code, design and the evolving island
              visuals, is owned by or licensed to Islands. You may not
              reproduce, distribute, or create derivative works without written
              permission. You retain ownership of content and personal data you
              input (such as study sessions and notes).
            </p>
          </section>

          <section id="ai">
            <h2 className="text-xl font-semibold mt-4">
              8. AI-Generated Content
            </h2>
            <p>
              Some visuals or rewards may be generated by artificial
              intelligence. These outputs are provided &quot;as-is&quot; for
              entertainment and motivation and may not always be unique or
              error-free.
            </p>
          </section>

          <section id="termination">
            <h2 className="text-xl font-semibold mt-4">9. Termination</h2>
            <p>
              You may delete your account at any time. We may suspend or
              terminate accounts that breach these Terms. Termination does not
              affect obligations or rights accrued before the termination date.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-xl font-semibold mt-4">
              10. Limitation of Liability
            </h2>
            <p>To the maximum extent permitted by law:</p>
            <ul>
              <li>
                Islands and its developers are not liable for indirect,
                incidental, or consequential damages arising from your use of
                the App.
              </li>
              <li>
                Our total liability under these Terms will not exceed the total
                amount you paid (if any) in the 12 months preceding the claim.
              </li>
              <li>
                Nothing in these Terms excludes rights under the Australian
                Consumer Law (ACL) that cannot be excluded.
              </li>
            </ul>
          </section>

          <section id="changes">
            <h2 className="text-xl font-semibold mt-4">
              11. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. The most current
              version will be posted within the App. Continued use after changes
              take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section id="law">
            <h2 className="text-xl font-semibold mt-4">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of{" "}
              <strong>New South Wales, Australia</strong>. You submit to the
              exclusive jurisdiction of the courts located in that state.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold mt-4">13. Contact</h2>
            <p>If you have questions or legal concerns contact us at:</p>
            <p className="font-medium">support@islandsapp.com.au</p>
          </section>

          <footer className="mt-8 text-sm text-slate-500">
            <p>
              © <span id="year"></span> Islands. All rights reserved.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
