import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Biaggio Flooring.',
}

export default function PrivacyPolicyEn() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div>
          <p className="uppercase tracking-[0.4em] text-brand-charcoal/60 text-sm mb-2">
            Privacy Policy
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
            Privacy Policy
          </h1>
        </div>

        <div className="space-y-5 text-brand-charcoal/80">
          <p>
            We collect data submitted through the estimate form, including name,
            email, phone, address, and project details, to process your request
            and provide follow-up.
          </p>
          <p>
            Estimate requests are stored in the estimateRequests collection for
            internal tracking, scheduling, and project communication.
          </p>
          <p>
            We may use essential cookies to keep the experience stable and improve
            the site.
          </p>
          <p>
            Email and phone are required so we can confirm and respond to your
            request.
          </p>
          <p>
            We may collect logs and anonymized analytics to understand portal usage
            and improve our service.
          </p>
          <p>
            The estimate provided is a preliminary labor-only range, non-binding,
            and subject to on-site verification.
          </p>
        </div>
      </div>
    </section>
  )
}
