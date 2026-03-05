import Image from 'next/image'
import Link from 'next/link'
import SplashSection from '@/components/SplashSection'

const trustStats = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Completed Projects' },
  { value: 'Licensed', label: '& Insured' },
  { value: '5-Star', label: 'Customer Rating' },
]

const serviceHighlights = [
  {
    title: 'Flooring Installation',
    description:
      'Hardwood, LVP, laminate, and tile installed with precision and long-lasting performance.',
    image: '/images/flooring/floor1.jpg',
    alt: 'Premium hardwood flooring installation',
  },
  {
    title: 'Bathroom Remodeling',
    description:
      'Luxury showers, tile walls, and functional layouts designed for modern living.',
    image: '/images/bathrooms/bath.jpg',
    alt: 'Modern bathroom remodeling with custom tile',
  },
  {
    title: 'Custom Tile Work',
    description:
      'Decorative accents, backsplashes, and statement feature walls that elevate your space.',
    image: '/images/bathrooms/bath04.jpg',
    alt: 'Custom tile installation with premium finish',
  },
]

const portfolioPreview = [
  {
    title: 'Luxury Shower Detail',
    image: '/images/projects/bath04.jpg',
  },
  {
    title: 'Warm Hardwood Finish',
    image: '/images/projects/floor1.jpg',
  },
  {
    title: 'Tile Accent Feature',
    image: '/images/projects/bath03.jpg',
  },
]

const differentiators = [
  'Family owned and relationship focused',
  'Premium craftsmanship on every detail',
  'Transparent pricing and written estimates',
  'Reliable scheduling with clear timelines',
  'Detail-focused installation standards',
]

const HomePage = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-brand-charcoal text-brand-white">

        <div className="absolute inset-0">
          <Image
            src="/images/hero/place_1.jpg"
            alt="Luxury home interior with premium flooring"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/70 to-brand-charcoal/90" />
        </div>

        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-3xl">

            <p className="uppercase tracking-[0.45em] text-brand-accent text-sm mb-6">
              Central Florida Remodeling
            </p>

            <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
              Precision Flooring & Bathroom Remodeling Designed To Last
            </h1>

            <p className="text-lg text-brand-white/90 mb-10 max-w-xl">
              Premium installations delivered with refined craftsmanship,
              clear communication, and dependable scheduling.
            </p>

            <div className="flex flex-wrap gap-4">

              <Link
                href="/contact"
                className="bg-brand-primary px-9 py-4 rounded-full font-semibold hover:bg-brand-accent transition shadow-lg"
              >
                Request Free Estimate
              </Link>

              <Link
                href="/portfolio"
                className="border border-brand-white px-9 py-4 rounded-full font-semibold hover:border-brand-accent hover:text-brand-accent transition"
              >
                View Portfolio
              </Link>

              <Link
                href="/book"
                className="border border-brand-accent text-brand-accent px-9 py-4 rounded-full font-semibold hover:bg-brand-accent hover:text-brand-charcoal transition"
              >
                View the Book
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* SPLASH */}
      <SplashSection
        imageSrc="/images/bathrooms/bath2.jpg"
        eyebrow="Luxury Remodeling"
        heading="Trusted by Central Florida Homeowners"
        body="We deliver refined finishes, clean installs, and a streamlined process that respects your home and timeline."
        ctaText="Schedule Consultation"
      />

      {/* TRUST STATS */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl p-8 text-center shadow-xl border border-brand-charcoal/10"
              >
                <div className="text-4xl font-semibold text-brand-primary mb-3">
                  {stat.value}
                </div>

                <p className="uppercase tracking-widest text-sm text-brand-charcoal/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4">

          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-3">
              Services
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-4">
              Premium Remodeling Services
            </h2>

            <p className="text-lg text-brand-charcoal max-w-2xl mx-auto">
              Expert installation, refined materials, and a process built on clarity and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {serviceHighlights.map((service) => (
              <div
                key={service.title}
                className="group rounded-3xl overflow-hidden bg-brand-white shadow-xl hover:shadow-2xl transition duration-500"
              >
                <div className="relative h-56">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                    {service.title}
                  </h3>

                  <p className="text-brand-charcoal mb-5">
                    {service.description}
                  </p>

                  <Link
                    href="/services"
                    className="text-brand-primary font-semibold hover:text-brand-accent transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* SPLASH */}
      <SplashSection
        imageSrc="/images/flooring/floor 2.jpg"
        eyebrow="Crafted Floors"
        heading="Precision Installation. Refined Finishes."
        body="From hardwood to luxury tile, we deliver floors that define the space and elevate everyday living."
        ctaText="Explore Services"
        ctaHref="/services"
      />

      {/* PORTFOLIO */}
      <section className="py-20 bg-brand-white">

        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-3">
              Portfolio
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-4">
              Featured Projects
            </h2>

            <p className="text-lg text-brand-charcoal max-w-2xl mx-auto">
              Signature projects showcasing our installation standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {portfolioPreview.map((project) => (
              <div
                key={project.title}
                className="group relative overflow-hidden rounded-3xl shadow-lg"
              >
                <div className="relative h-72">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                </div>

                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition">
                  <h3 className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex bg-brand-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-brand-accent transition"
            >
              View Full Portfolio
            </Link>
          </div>

        </div>
      </section>

      {/* FINAL SPLASH */}
      <SplashSection
        imageSrc="/images/projects/bath04.jpg"
        eyebrow="Precision Remodeling"
        heading="Elevate Your Home with Biaggio Flooring"
        body="Schedule a complimentary consultation and receive a detailed estimate tailored to your space."
        ctaText="Request Free Estimate"
      />

      {/* WHY CHOOSE */}
      <section className="py-20 bg-brand-white">

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-3">
              Why Choose Us
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal mb-6">
              Trusted Craftsmanship, Clear Communication
            </h2>

            <p className="text-lg text-brand-charcoal mb-8">
              We guide every project with transparency, detailed planning, and a commitment to premium finishes.
            </p>

            <ul className="space-y-4">
              {differentiators.map((item) => (
                <li key={item} className="flex gap-3 text-brand-charcoal">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[420px] rounded-[36px] overflow-hidden shadow-xl">
            <Image
              src="/images/bathrooms/bath03.jpg"
              alt="Luxury shower with precision tile work"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>
    </>
  )
}

export default HomePage
