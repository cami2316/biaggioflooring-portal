import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bathroom & Shower Remodeling - Biaggio Flooring',
  description:
    'Luxury bathroom and shower remodeling in Central Florida. Custom tile, waterproof systems, and premium craftsmanship.',
}

export default function BathroomShower() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-28 bg-brand-slate text-white">

        <div className="absolute inset-0">
          <Image
            src="/images/bathrooms/bath2.jpg"
            alt="Luxury custom bathroom remodel"
            fill
            priority
            className="object-cover scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-brand-slate/70 via-brand-slate/45 to-brand-slate/70" />
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl">
          <p className="uppercase tracking-[0.45em] text-brand-accent text-sm mb-5">
            Bathroom Remodeling
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Luxury Bathroom & Shower Remodeling
          </h1>

          <p className="text-lg text-white/90">
            We design and build refined bathrooms with precision waterproofing,
            premium tile installation, and timeless finishes.
          </p>
        </div>
      </section>

      {/* MAIN SERVICES */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4 space-y-24">

          {/* FULL BATH REMODEL */}
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div>
              <h2 className="text-3xl font-semibold text-brand-charcoal mb-5">
                Complete Bathroom Transformations
              </h2>

              <p className="text-brand-charcoal text-lg mb-6">
                From demolition to final finish, our team delivers bathrooms
                designed for comfort, durability, and long-term performance.
              </p>

              <ul className="space-y-3 text-brand-charcoal">
                <li>✔ Custom bathroom design planning</li>
                <li>✔ Plumbing & fixture installation</li>
                <li>✔ Waterproof shower systems</li>
                <li>✔ Tile flooring and wall installation</li>
                <li>✔ Vanity and cabinetry installation</li>
                <li>✔ Lighting and finish upgrades</li>
              </ul>

            </div>

            <div className="relative h-[420px] rounded-[36px] overflow-hidden shadow-xl">
              <Image
                src="/images/bathrooms/bath.jpg"
                alt="Full bathroom remodel with custom tile"
                fill
                className="object-cover"
              />
            </div>

          </div>

          {/* SHOWER SPECIALTY */}
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div className="order-2 lg:order-1 relative h-[420px] rounded-[36px] overflow-hidden shadow-xl">
              <Image
                src="/images/bathrooms/bath03.jpg"
                alt="Custom walk-in shower installation"
                fill
                className="object-cover"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-semibold text-brand-charcoal mb-5">
                Custom Shower Installation
              </h2>

              <p className="text-brand-charcoal text-lg mb-6">
                Our shower systems are engineered for durability and built with
                precision tile layouts and waterproofing standards.
              </p>

              <ul className="space-y-3 text-brand-charcoal">
                <li>✔ Walk-in shower conversions</li>
                <li>✔ Frameless glass preparation</li>
                <li>✔ Custom tile and stone layouts</li>
                <li>✔ Shower niches and built-in benches</li>
                <li>✔ Modern plumbing fixtures</li>
              </ul>

            </div>

          </div>

        </div>
      </section>

      {/* SHOWER & BATH GALLERY */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4">

          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-3">
              Gallery
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
              Showers & Bathrooms We've Built
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/portfolio/shower-rainhead-hex-niche.jpg', alt: 'Rainhead shower with hexagon tile niche' },
              { src: '/images/portfolio/shower-navy-subway-niche.jpg', alt: 'Navy subway tile shower with niche' },
              { src: '/images/portfolio/shower-gold-star-mosaic-niche.jpg', alt: 'Shower niche with gold star mosaic accent' },
              { src: '/images/portfolio/shower-two-tone-tile-pebble-floor.jpg', alt: 'Two-tone tile shower with pebble floor' },
              { src: '/images/portfolio/shower-marble-with-window-niche.jpg', alt: 'Marble shower with window and niche' },
              { src: '/images/portfolio/shower-pebble-stone-floor.jpg', alt: 'Shower with natural pebble stone floor' },
              { src: '/images/portfolio/bathroom-geometric-mosaic-corner-niche.jpg', alt: 'Bathroom with geometric mosaic corner niche' },
              { src: '/images/portfolio/shower-marble-herringbone-gold-accent.jpg', alt: 'Marble herringbone shower with gold accent trim' },
            ].map((photo) => (
              <div key={photo.src} className="group relative h-40 md:h-48 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-12">
            Why Homeowners Trust Biaggio Flooring
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="p-8 rounded-3xl border border-brand-charcoal/10 shadow-premium">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Waterproofing Expertise
              </h3>
              <p className="text-brand-charcoal">
                Proper shower waterproofing ensures durability and prevents
                costly long-term damage.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-brand-charcoal/10 shadow-premium">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Premium Tile Craftsmanship
              </h3>
              <p className="text-brand-charcoal">
                Every layout is measured, aligned, and installed with precision.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-brand-charcoal/10 shadow-premium">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Clear Project Communication
              </h3>
              <p className="text-brand-charcoal">
                Transparent estimates and clear scheduling keep homeowners
                confident through every stage.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-20 bg-brand-slate text-white">

        <div className="container mx-auto px-4 max-w-5xl text-center">

          <h2 className="text-3xl md:text-4xl font-semibold mb-12">
            Our Remodeling Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-sm">

            <div>
              <p className="text-brand-accent font-semibold mb-2">01</p>
              <p>Consultation & Design Planning</p>
            </div>

            <div>
              <p className="text-brand-accent font-semibold mb-2">02</p>
              <p>Material Selection & Layout Planning</p>
            </div>

            <div>
              <p className="text-brand-accent font-semibold mb-2">03</p>
              <p>Professional Installation</p>
            </div>

            <div>
              <p className="text-brand-accent font-semibold mb-2">04</p>
              <p>Final Walkthrough & Quality Review</p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-6">
            Ready to Upgrade Your Bathroom?
          </h2>

          <p className="text-lg text-brand-charcoal mb-8 max-w-2xl mx-auto">
            Schedule a consultation and receive a detailed remodeling estimate
            tailored to your home.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-brand-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-accent transition-colors"
          >
            Schedule Free Consultation
          </Link>

        </div>
      </section>
    </>
  )
}
