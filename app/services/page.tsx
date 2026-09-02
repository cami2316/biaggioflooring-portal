import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Flooring Installation & Bathroom Remodeling',
  description:
    'Professional flooring installation, bathroom remodeling, and custom tile work in Central Florida.',
}

export default function Services() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-28 bg-brand-slate text-white overflow-hidden">

        <div className="absolute inset-0">
          <Image
            src="/images/hero/place_1.jpg"
            alt="Luxury remodeling services"
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-slate/70 via-brand-slate/45 to-brand-slate/70" />
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl">
          <p className="uppercase tracking-[0.45em] text-brand-accent text-sm mb-5">
            Our Services
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Precision Remodeling Designed Around Your Space
          </h1>

          <p className="text-lg text-white/90">
            From flooring installations to full bathroom transformations, we deliver premium craftsmanship with dependable timelines.
          </p>
        </div>
      </section>

      {/* FLOORING */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-4">
              Flooring Installation
            </p>

            <h2 className="text-3xl font-semibold text-brand-charcoal mb-6">
              Floors Engineered for Durability & Style
            </h2>

            <p className="text-brand-charcoal mb-8">
              We install premium flooring systems designed to enhance aesthetics while ensuring long-term performance in Central Florida homes.
            </p>

            <ul className="space-y-4">
              {[
                'Hardwood Flooring',
                'Luxury Vinyl Plank (LVP)',
                'Tile Flooring',
                'Laminate Flooring',
                'Stone Flooring',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-brand-charcoal">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[440px] rounded-[36px] overflow-hidden shadow-premium">
            <Image
              src="/images/flooring/floor1.jpg"
              alt="Luxury hardwood flooring installation"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* BATHROOM */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

          <div className="relative h-[440px] rounded-[36px] overflow-hidden shadow-premium order-2 lg:order-1">
            <Image
              src="/images/bathrooms/bath.jpg"
              alt="Bathroom remodeling with custom tile shower"
              fill
              className="object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-4">
              Bathroom Remodeling
            </p>

            <h2 className="text-3xl font-semibold text-brand-charcoal mb-6">
              Luxury Bathrooms Designed for Everyday Living
            </h2>

            <p className="text-brand-charcoal mb-8">
              Waterproofing systems, precise tile alignment, and modern layouts designed for durability and elegance.
            </p>

            <ul className="space-y-4">
              {[
                'Custom Walk-In Showers',
                'Tile Walls & Floors',
                'Shower Niches & Benches',
                'Glass Enclosure Preparation',
                'Luxury Tile Designs',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-brand-charcoal">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* TILE WORK */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-4">
              Custom Tile & Decorative Work
            </p>

            <h2 className="text-3xl font-semibold text-brand-charcoal mb-6">
              Statement Details That Define Your Space
            </h2>

            <p className="text-brand-charcoal mb-8">
              From artistic backsplashes to custom entry medallions, our decorative tile installations deliver refined finishes.
            </p>

            <ul className="space-y-4">
              {[
                'Backsplashes',
                'Feature Walls',
                'Entry Medallions',
                'Custom Layout Designs',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-brand-charcoal">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[440px] rounded-[36px] overflow-hidden shadow-premium">
            <Image
              src="/images/bathrooms/bath04.jpg"
              alt="Decorative tile installation"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* KITCHEN */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

          <div className="relative h-[440px] rounded-[36px] overflow-hidden shadow-premium order-2 lg:order-1">
            <Image
              src="/images/portfolio/kitchen-backsplash-brick-tile.jpg"
              alt="Kitchen remodel with custom brick-pattern tile backsplash"
              fill
              className="object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-4">
              Kitchen Remodeling
            </p>

            <h2 className="text-3xl font-semibold text-brand-charcoal mb-6">
              Kitchens Built for Everyday Living
            </h2>

            <p className="text-brand-charcoal mb-8">
              Custom cabinetry, countertops, and tile work designed to bring function and refined style together.
            </p>

            <ul className="space-y-4">
              {[
                'Custom Cabinetry',
                'Countertops & Backsplashes',
                'Tile & Stone Flooring',
                'Lighting & Fixture Upgrades',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-brand-charcoal">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* RECENT WORK GALLERY */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4">

          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.35em] text-brand-charcoal mb-3">
              Recent Work
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
              A Closer Look at Our Craftsmanship
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/portfolio/shower-moroccan-tile-niche.jpg', alt: 'Moroccan tile shower niche detail' },
              { src: '/images/portfolio/shower-subway-tile-wall.jpg', alt: 'Subway tile shower wall installation' },
              { src: '/images/flooring/floor 2.jpg', alt: 'Premium hardwood flooring detail' },
              { src: '/images/portfolio/laundry-room-patterned-floor-tile.jpg', alt: 'Laundry room patterned tile flooring' },
              { src: '/images/portfolio/flooring-plank-hallway.jpg', alt: 'Plank flooring installed in hallway' },
              { src: '/images/portfolio/kitchen-navy-vertical-tile-backsplash.jpg', alt: 'Navy vertical tile kitchen backsplash' },
              { src: '/images/bathrooms/bath03.jpg', alt: 'Custom walk-in shower installation' },
              { src: '/images/portfolio/bathroom-before-after.jpg', alt: 'Bathroom remodel before and after' },
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

      {/* CTA */}
      <section className="py-24 bg-brand-slate text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">

          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Transform Your Space?
          </h2>

          <p className="text-lg text-white/80 mb-10">
            Schedule a free consultation and receive a personalized remodeling estimate.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-brand-primary px-10 py-4 rounded-full font-semibold hover:bg-brand-accent transition shadow-lg"
          >
            Request Free Estimate
          </Link>

        </div>
      </section>
    </>
  )
}
