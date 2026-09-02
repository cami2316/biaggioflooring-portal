import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Gallery from '@/components/Gallery'

export const metadata: Metadata = {
  title: 'Portfolio - Finished Flooring & Bathroom Projects',
  description:
    'Explore Biaggio Flooring’s completed remodeling and flooring projects across Central Florida.',
}

export default function Portfolio() {

  const portfolioItems = [
    // --- Original portfolio photos (kept) ---
    {
      id: 1,
      title: 'Warm Hardwood Living Space',
      category: 'Flooring' as const,
      imageSrc: '/images/flooring/floor1.jpg',
      alt: 'Hardwood floor installation',
    },
    {
      id: 2,
      title: 'Contemporary Plank Flooring',
      category: 'Flooring' as const,
      imageSrc: '/images/flooring/floor 2.jpg',
      alt: 'Luxury vinyl plank flooring',
    },
    {
      id: 3,
      title: 'Statement Tile Floor',
      category: 'Flooring' as const,
      imageSrc: '/images/flooring/floor 03.jpg',
      alt: 'Decorative tile flooring',
    },
    {
      id: 4,
      title: 'Custom Shower Installation',
      category: 'Bathrooms' as const,
      imageSrc: '/images/bathrooms/bath.jpg',
      alt: 'Luxury shower remodel',
    },
    {
      id: 5,
      title: 'Spa Inspired Bathroom',
      category: 'Bathrooms' as const,
      imageSrc: '/images/bathrooms/bath2.jpg',
      alt: 'Bathroom remodel with premium finishes',
    },
    {
      id: 6,
      title: 'Modern Tile Statement Wall',
      category: 'Bathrooms' as const,
      imageSrc: '/images/bathrooms/bath03.jpg',
      alt: 'Tile wall installation',
    },
    {
      id: 7,
      title: 'Luxury Shower Niche Detail',
      category: 'Bathrooms' as const,
      imageSrc: '/images/bathrooms/bath04.jpg',
      alt: 'Custom shower niche',
    },
    {
      id: 8,
      title: 'Completed Flooring Project',
      category: 'Projects' as const,
      imageSrc: '/images/projects/floor1.jpg',
      alt: 'Finished flooring project',
    },
    {
      id: 9,
      title: 'Finished Bathroom Remodel',
      category: 'Projects' as const,
      imageSrc: '/images/projects/bath.jpg',
      alt: 'Completed bathroom remodel',
    },
    {
      id: 10,
      title: 'Custom Tile Installation Project',
      category: 'Projects' as const,
      imageSrc: '/images/projects/bath04.jpg',
      alt: 'Custom tile project',
    },
    // --- New photos added from recent job site photos ---
    {
      id: 11,
      title: 'Herringbone Tile Staircase',
      category: 'Flooring' as const,
      imageSrc: '/images/portfolio/staircase-herringbone-tile.jpg',
      alt: 'Herringbone pattern tile staircase risers with wood treads',
    },
    {
      id: 12,
      title: 'Modern Kitchen Backsplash',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-backsplash-brick-tile.jpg',
      alt: 'Gray and blue brick-pattern kitchen backsplash tile',
    },
    {
      id: 13,
      title: 'Kitchen Backsplash & Granite Counters',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-cabinets-granite.jpg',
      alt: 'Kitchen with subway tile backsplash and granite countertops',
    },
    {
      id: 14,
      title: 'Marble Hexagon Backsplash',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-hex-backsplash-marble.jpg',
      alt: 'Hexagon marble tile backsplash with marble countertop',
    },
    {
      id: 15,
      title: 'Classic Subway Tile Backsplash',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-backsplash-brick-tile-2.jpg',
      alt: 'Kitchen brick-pattern tile backsplash installation',
    },
    {
      id: 16,
      title: 'Moroccan-Inspired Shower Niche',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-moroccan-tile-niche.jpg',
      alt: 'Shower with Moroccan-pattern tile accent niche',
    },
    {
      id: 17,
      title: 'Subway Tile Shower Wall',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-subway-tile-wall.jpg',
      alt: 'Subway tile shower wall with chrome fixture',
    },
    {
      id: 18,
      title: 'Rain Shower With Hex Mosaic Niche',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-rainhead-hex-niche.jpg',
      alt: 'Rain shower head with hexagon mosaic tile niche',
    },
    {
      id: 19,
      title: 'Navy Subway Tile Shower Niche',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-navy-subway-niche.jpg',
      alt: 'Deep blue subway tile shower wall with niche',
    },
    {
      id: 20,
      title: 'Black Hexagon Mosaic Accent Wall',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-black-hex-mosaic.jpg',
      alt: 'Black hexagon mosaic tile accent wall with marble surround',
    },
    {
      id: 21,
      title: 'Bathroom Remodel — Before & After',
      category: 'Projects' as const,
      imageSrc: '/images/portfolio/bathroom-before-after.jpg',
      alt: 'Bathroom before and after full remodel comparison',
    },
    {
      id: 22,
      title: 'Travertine Fireplace Surround',
      category: 'Projects' as const,
      imageSrc: '/images/portfolio/fireplace-travertine-surround.jpg',
      alt: 'Travertine tile fireplace surround installation',
    },
    {
      id: 23,
      title: 'Gold-Trimmed Star Mosaic Niche',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-gold-star-mosaic-niche.jpg',
      alt: 'Gold-trimmed geometric star mosaic shower niche',
    },
    {
      id: 24,
      title: 'Dual Rain Shower With Freestanding Tub',
      category: 'Projects' as const,
      imageSrc: '/images/portfolio/bathroom-dual-shower-freestanding-tub.jpg',
      alt: 'Luxury primary bathroom with dual rain showers and freestanding tub',
    },
    {
      id: 25,
      title: 'Two-Tone Shower With Pebble Floor',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-two-tone-tile-pebble-floor.jpg',
      alt: 'Two-tone tile shower with pebble mosaic floor',
    },
    {
      id: 26,
      title: 'Glass Hexagon Backsplash & Double Vanity',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/bathroom-glass-hex-backsplash-vanity.jpg',
      alt: 'Glass hexagon mosaic backsplash with double vanity sinks',
    },
    {
      id: 27,
      title: 'Wood-Look Plank Tile Hallway',
      category: 'Flooring' as const,
      imageSrc: '/images/portfolio/flooring-plank-hallway.jpg',
      alt: 'Wood-look plank tile flooring in hallway',
    },
    {
      id: 28,
      title: 'Marble Herringbone Shower With Gold Accent',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-marble-herringbone-gold-accent.jpg',
      alt: 'Marble tile shower with vertical gold mosaic accent strip',
    },
    {
      id: 29,
      title: 'Navy Vertical Tile Kitchen Backsplash',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-navy-vertical-tile-backsplash.jpg',
      alt: 'Deep navy vertical tile kitchen backsplash',
    },
    {
      id: 30,
      title: 'Front Entry Marble Tile & Curved Steps',
      category: 'Projects' as const,
      imageSrc: '/images/portfolio/entry-marble-tile-curved-steps.jpg',
      alt: 'Front entry geometric marble tile with curved mosaic-edge steps',
    },
    {
      id: 31,
      title: 'Marble Shower With Window Niche',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-marble-with-window-niche.jpg',
      alt: 'Marble tile shower with natural light window and niche',
    },
    {
      id: 32,
      title: 'Frameless Glass Shower, Large-Format Tile',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-frameless-glass-gray-tile.jpg',
      alt: 'Frameless glass shower door with large-format gray tile',
    },
    {
      id: 33,
      title: 'Gray Tile Shower With Linear Drain',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-gray-tile-linear-drain.jpg',
      alt: 'Gray large-format tile shower with linear drain',
    },
    {
      id: 34,
      title: 'Woven Metallic Tile Backsplash',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-backsplash-branded-logo.jpg',
      alt: 'Woven metallic mosaic tile backsplash over granite counter',
    },
    {
      id: 35,
      title: 'Hexagon Tile Backsplash',
      category: 'Kitchen' as const,
      imageSrc: '/images/portfolio/kitchen-hexagon-backsplash-outlet.jpg',
      alt: 'Large hexagon tile kitchen backsplash',
    },
    {
      id: 36,
      title: 'Vaulted Ceiling Room With Marble Flooring',
      category: 'Projects' as const,
      imageSrc: '/images/portfolio/vaulted-ceiling-marble-floor-room.jpg',
      alt: 'Vaulted ceiling room with arched windows and marble tile flooring',
    },
    {
      id: 37,
      title: 'Patterned Tile Laundry Room Floor',
      category: 'Flooring' as const,
      imageSrc: '/images/portfolio/laundry-room-patterned-floor-tile.jpg',
      alt: 'Black and white patterned tile laundry room floor',
    },
    {
      id: 38,
      title: 'Geometric Mosaic Corner Accent',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/bathroom-geometric-mosaic-corner-niche.jpg',
      alt: 'Geometric black and white mosaic tile corner accent with niche',
    },
    {
      id: 39,
      title: 'Pebble Stone Shower Floor',
      category: 'Bathrooms' as const,
      imageSrc: '/images/portfolio/shower-pebble-stone-floor.jpg',
      alt: 'Natural pebble stone mosaic shower floor',
    },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative py-28 bg-brand-charcoal text-white overflow-hidden">

        <div className="absolute inset-0">
          <Image
            src="/images/portfolio/staircase-herringbone-tile.jpg"
            alt="Luxury remodeling portfolio"
            fill
            className="object-cover scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/70 to-brand-charcoal/90" />
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl">
          <p className="uppercase tracking-[0.45em] text-brand-accent text-sm mb-5">
            Portfolio
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Spaces Transformed Through Craftsmanship
          </h1>

          <p className="text-lg text-white/90">
            Explore finished projects that showcase our installation standards,
            design precision, and commitment to premium results.
          </p>
        </div>

      </section>

      {/* INTRO */}
      <section className="py-20 bg-brand-white text-center">

        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-semibold text-brand-charcoal mb-6">
            Signature Project Gallery
          </h2>

          <p className="text-lg text-brand-charcoal">
            Browse our completed flooring installations and bathroom remodels.
            Each project reflects careful planning, premium materials, and refined finishing.
          </p>
        </div>

      </section>

      {/* GALLERY */}
      <section className="pb-20 bg-brand-white">
        <div className="container mx-auto px-4">
          <Gallery items={portfolioItems} />
        </div>
      </section>

      {/* DIFFERENTIATOR SECTION */}
      <section className="py-20 bg-brand-white">

        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">

          {[
            { value: '500+', label: 'Projects Completed' },
            { value: '15+', label: 'Years Experience' },
            { value: 'Licensed', label: '& Insured' },
            { value: '5-Star', label: 'Client Reviews' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl p-8 shadow-premium border border-brand-charcoal/10"
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

      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-brand-charcoal text-white text-center">

        <div className="container mx-auto px-4 max-w-2xl">

          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready To Start Your Own Transformation?
          </h2>

          <p className="text-lg text-white/80 mb-10">
            Schedule a complimentary consultation and receive a detailed remodeling estimate tailored to your home.
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
