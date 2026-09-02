import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-white">

      {/* CTA IMAGE SECTION */}
      <div className="relative">

        <div className="relative h-[420px] overflow-hidden">
          <Image
            src="/images/portfolio/shower-black-hex-mosaic.jpg"
            alt="Luxury flooring and tile installation"
            fill
            className="object-cover scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/95 via-brand-charcoal/80 to-brand-charcoal/95" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-2xl px-6">

            <p className="uppercase tracking-[0.4em] text-brand-accent text-sm mb-4">
              Premium Craftsmanship
            </p>

            <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
              Transform Your Space With Biaggio Flooring
            </h2>

            <Link
              href="/contact"
              className="inline-block bg-brand-primary text-white px-9 py-4 rounded-full font-semibold tracking-wide hover:bg-brand-accent transition duration-300 shadow-lg hover:shadow-xl"
            >
              Request Your Estimate
            </Link>

          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="container mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="space-y-5">

            <Image
              src="/logo/logo%20white.svg"
              alt="Biaggio Flooring"
              width={180}
              height={50}
            />

            <p className="text-sm text-brand-white/80 leading-relaxed">
              Luxury flooring installation and bathroom remodeling across Central Florida.
              Family-owned. Detail-driven. Built on trust.
            </p>

            <p className="text-sm text-brand-accent font-medium">
              Precision • Integrity • Reliability
            </p>

          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-lg font-semibold mb-5 tracking-wide">
              Navigation
            </h4>

            <ul className="space-y-3 text-brand-white/80">
              <li><Link href="/" className="hover:text-brand-accent transition">Home</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition">Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-brand-accent transition">Portfolio</Link></li>
              <li><Link href="/about" className="hover:text-brand-accent transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-brand-accent transition">Contact</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold mb-5 tracking-wide">
              Contact
            </h4>

            <ul className="space-y-3 text-brand-white/80">
              <li>Central Florida</li>
              <li>
                <a href="tel:3214425003" className="hover:text-brand-accent transition">
                  321 4425003
                </a>
              </li>
              <li>
                <a href="mailto:biaggioflooringllc@gmail.com" className="hover:text-brand-accent transition">
                  biaggioflooringllc@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/biaggioflooring/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-accent transition"
                >
                  Instagram: @biaggioflooring
                </a>
              </li>
            </ul>
          </div>

          {/* SERVICE AREAS */}
          <div>
            <h4 className="text-lg font-semibold mb-5 tracking-wide">
              Service Areas
            </h4>

            <ul className="space-y-3 text-brand-white/80">
              <li>Orlando</li>
              <li>Lake Nona</li>
              <li>Winter Park</li>
              <li>Celebration</li>
              <li>Greater Central Florida</li>
            </ul>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-brand-white/20 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-white/60">

          <p>
            © {new Date().getFullYear()} Biaggio Flooring. All rights reserved.
          </p>

          <p>
            Crafted with precision in Central Florida
          </p>

        </div>

      </div>

    </footer>
  )
}
