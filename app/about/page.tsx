import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Biaggio Flooring - Family Owned Remodeling Experts',
  description:
    'Family-owned flooring and bathroom remodeling company serving Central Florida with precision craftsmanship and trusted service.',
}

const values = [
  {
    title: 'Precision Craftsmanship',
    description:
      'Every layout, cut, and installation follows strict alignment and finish standards.',
  },
  {
    title: 'Client Relationships',
    description:
      'We treat every home with respect, clear communication, and professional care.',
  },
  {
    title: 'Transparent Pricing',
    description:
      'Detailed written estimates and honest guidance before any project begins.',
  },
]

const stats = [
  { value: '15+', label: 'Years Serving Central Florida' },
  { value: '500+', label: 'Completed Projects' },
  { value: 'Licensed', label: '& Insured' },
  { value: '5-Star', label: 'Client Satisfaction' },
]

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-charcoal text-white py-28">

        <div className="absolute inset-0">
          <Image
            src="/images/bathrooms/bath2.jpg"
            alt="Tile installation craftsmanship"
            fill
            priority
            className="object-cover scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/70 to-brand-charcoal/90" />
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl">
          <p className="uppercase tracking-[0.4em] text-brand-accent text-sm mb-5">
            Our Story
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Built on Craftsmanship. Grown Through Trust.
          </h1>

          <p className="text-lg text-white/90">
            Biaggio Flooring is a family-owned remodeling company dedicated to
            delivering refined flooring and bathroom transformations across
            Central Florida.
          </p>
        </div>

      </section>

      {/* STORY SECTION */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">

          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-6">
              More Than Installation. We Build Confidence.
            </h2>

            <div className="space-y-5 text-brand-charcoal text-lg">

              <p>
                For over 15 years, Biaggio Flooring has helped homeowners
                transform their spaces through precision installation and
                professional remodeling standards.
              </p>

              <p>
                Our company was built on one simple principle: your home deserves
                workmanship that lasts. Every project is approached with detailed
                planning, proper waterproofing techniques, and premium finish
                standards.
              </p>

              <p>
                We understand remodeling is a personal investment. That’s why we
                focus on communication, scheduling clarity, and respect for your
                home from preparation to final walkthrough.
              </p>

            </div>

          </div>

          <div className="relative h-[440px] rounded-[36px] overflow-hidden shadow-xl">
            <Image
              src="/images/flooring/floor 2.jpg"
              alt="Premium hardwood flooring installation"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-brand-white">

        <div className="container mx-auto px-4">

          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal text-sm mb-3">
              Core Values
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
              The Standards Behind Every Project
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-3xl border border-brand-charcoal/10 shadow-premium"
              >
                <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                  {value.title}
                </h3>

                <p className="text-brand-charcoal">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* WORK GALLERY */}
      <section className="py-20 bg-brand-white">

        <div className="container mx-auto px-4">

          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal text-sm mb-3">
              Our Work
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
              Craftsmanship Across Central Florida
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/portfolio/bathroom-glass-hex-backsplash-vanity.jpg', alt: 'Glass hex tile vanity backsplash' },
              { src: '/images/portfolio/kitchen-backsplash-brick-tile-2.jpg', alt: 'Kitchen with brick-pattern tile backsplash' },
              { src: '/images/bathrooms/bath.jpg', alt: 'Modern bathroom remodel with custom tile' },
              { src: '/images/portfolio/shower-gray-tile-linear-drain.jpg', alt: 'Gray tile shower with linear drain' },
              { src: '/images/portfolio/kitchen-backsplash-branded-logo.jpg', alt: 'Kitchen tile backsplash detail' },
              { src: '/images/portfolio/kitchen-hexagon-backsplash-outlet.jpg', alt: 'Hexagon tile kitchen backsplash' },
              { src: '/images/bathrooms/bath04.jpg', alt: 'Custom tile installation with premium finish' },
              { src: '/images/portfolio/bathroom-dual-shower-freestanding-tub.jpg', alt: 'Dual shower with freestanding tub' },
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

      {/* STATS */}
      <section className="py-20 bg-brand-charcoal text-white">

        <div className="container mx-auto px-4">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">

            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-semibold text-brand-accent mb-2">
                  {stat.value}
                </p>

                <p className="uppercase tracking-[0.2em] text-sm">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* DIFFERENCE SECTION */}
      <section className="py-20 bg-brand-white">

        <div className="container mx-auto px-4 max-w-4xl text-center">

          <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-6">
            The Biaggio Difference
          </h2>

          <p className="text-lg text-brand-charcoal mb-8">
            Our clients choose us because we combine craftsmanship with
            professionalism. We guide homeowners through design decisions,
            material selections, and installation planning so the final result
            meets both aesthetic and structural standards.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-brand-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-accent transition-colors"
          >
            Schedule Consultation
          </Link>

        </div>

      </section>
    </>
  )
}
