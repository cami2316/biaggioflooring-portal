import Image from 'next/image'
import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Biaggio Flooring - Request Free Estimate',
  description:
    'Request a free flooring or bathroom remodeling estimate in Central Florida. Professional consultation and clear project planning.',
}

export default function Contact() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-28 bg-brand-slate text-white overflow-hidden">

        <div className="absolute inset-0">
          <Image
            src="/images/projects/bath04.jpg"
            alt="Luxury remodeling consultation"
            fill
            className="object-cover scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-brand-slate/70 via-brand-slate/45 to-brand-slate/70" />
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl">
          <p className="uppercase tracking-[0.45em] text-brand-accent text-sm mb-5">
            Contact
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Request Your Free Remodeling Estimate
          </h1>

          <p className="text-lg text-white/90">
            Tell us about your project. Our team will review your request and guide you through next steps with clarity and transparency.
          </p>
        </div>

      </section>

      {/* MAIN SECTION */}
      <section className="relative py-20 bg-brand-white overflow-hidden">

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 relative">

          {/* LEFT CONTENT */}
          <div className="space-y-10">

            {/* INTRO */}
            <div>
              <h2 className="text-3xl font-semibold text-brand-charcoal mb-4">
                Speak With Our Remodeling Team
              </h2>

              <p className="text-brand-charcoal text-lg">
                We respond within one business day with consultation details,
                project recommendations, and scheduling availability.
              </p>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-6">

              <div>
                <p className="uppercase tracking-widest text-sm text-brand-charcoal/70">
                  Phone
                </p>

                <a
                  href="tel:3214425003"
                  className="text-xl font-semibold text-brand-charcoal hover:text-brand-accent transition"
                >
                  321 4425003
                </a>

                <p className="text-sm text-brand-charcoal/70">
                  Mon–Fri 8AM–6PM • Sat 9AM–4PM
                </p>
              </div>

              <div>
                <p className="uppercase tracking-widest text-sm text-brand-charcoal/70">
                  Email
                </p>

                <a
                  href="mailto:biaggioflooringllc@gmail.com"
                  className="text-xl font-semibold text-brand-charcoal hover:text-brand-accent transition"
                >
                  biaggioflooringllc@gmail.com
                </a>
              </div>

              <div>
                <p className="uppercase tracking-widest text-sm text-brand-charcoal/70">
                  Service Area
                </p>

                <p className="text-xl font-semibold text-brand-charcoal">
                  Central Florida
                </p>
              </div>

            </div>

            {/* PROCESS SECTION */}
            <div className="rounded-3xl border border-brand-charcoal/10 p-7 shadow-premium">

              <h3 className="text-lg font-semibold text-brand-charcoal mb-4">
                What Happens Next?
              </h3>

              <ul className="space-y-3 text-brand-charcoal">
                <li>✔ Review of your project details</li>
                <li>✔ Consultation scheduling</li>
                <li>✔ Material and layout discussion</li>
                <li>✔ Written estimate and timeline</li>
              </ul>

            </div>

            {/* TRUST BOX */}
            <div className="rounded-3xl bg-brand-white p-6 border border-brand-charcoal/10 shadow-premium">

              <h3 className="text-lg font-semibold text-brand-charcoal mb-4">
                Why Homeowners Choose Biaggio
              </h3>

              <ul className="space-y-2 text-brand-charcoal">
                <li>Free in-home consultation</li>
                <li>Transparent written estimates</li>
                <li>Licensed & insured professionals</li>
                <li>Clean installation standards</li>
              </ul>

            </div>

            {/* IMAGE */}
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/flooring/floor 03.jpg"
                alt="Premium flooring installation"
                fill
                className="object-cover"
              />
            </div>

          </div>

          {/* FORM */}
          <div>
            <ContactForm />
          </div>

        </div>
      </section>
    </>
  )
}
