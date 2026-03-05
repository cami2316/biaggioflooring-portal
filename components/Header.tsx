'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Book', href: '/book' },
    { name: 'Estimate', href: '/estimate' },
    { name: 'Contact', href: '/contact' },
    { name: 'Admin', href: '/admin' },
  ]

  return (
    <header
      className={`
        fixed w-full top-0 z-50 transition-all duration-500
        ${isScrolled
          ? 'bg-brand-charcoal/90 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'}
      `}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="relative flex items-center">
          <Image
            src="/logo/logo%20white.svg"
            alt="Biaggio Flooring"
            width={isScrolled ? 140 : 160}
            height={50}
            className="transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10">

          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`
                  relative font-medium tracking-wide transition
                  ${pathname === link.href
                    ? 'text-brand-accent'
                    : 'text-white hover:text-brand-accent'}
                `}
              >
                {link.name}

                {/* Active underline */}
                {pathname === link.href && (
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-brand-accent" />
                )}
              </Link>
            </li>
          ))}

          {/* CTA */}
          <Link
            href="/estimate"
            className="
              ml-4
              bg-brand-primary
              text-white
              px-6 py-3
              rounded-full
              font-semibold
              tracking-wide
              hover:bg-brand-accent
              transition-all
              shadow-md hover:shadow-xl
            "
          >
            Request Estimate
          </Link>

        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isMenuOpen
              ? <path d="M6 18L18 6M6 6l12 12" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden absolute w-full bg-brand-charcoal backdrop-blur-lg
          transition-all duration-500 overflow-hidden
          ${isMenuOpen ? 'max-h-[400px] py-6' : 'max-h-0'}
        `}
      >
        <ul className="flex flex-col items-center gap-6">

          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-lg hover:text-brand-accent transition"
              >
                {link.name}
              </Link>
            </li>
          ))}

          <Link
            href="/estimate"
            onClick={() => setIsMenuOpen(false)}
            className="
              bg-brand-primary
              text-white
              px-8 py-3
              rounded-full
              font-semibold
              hover:bg-brand-accent
              transition
            "
          >
            Request Estimate
          </Link>

        </ul>
      </div>
    </header>
  )
}
