'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface SplashSectionProps {
  imageSrc: string
  eyebrow: string
  heading: string
  body: string
  ctaText?: string
  ctaHref?: string
}

export default function SplashSection({
  imageSrc,
  eyebrow,
  heading,
  body,
  ctaText,
  ctaHref = '/contact',
}: SplashSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight))
      setOffset((progress - 0.5) * 30)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="relative h-[420px]">
        <Image
          src={imageSrc}
          alt={heading}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ transform: `translateY(${offset}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-slate/60 via-brand-slate/35 to-brand-slate/60" />
      </div>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-brand-white animate-fade-up">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-white mb-3">{eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{heading}</h2>
            <p className="text-lg text-brand-white mb-6">{body}</p>
            {ctaText && (
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center bg-brand-primary text-brand-white px-6 py-3 rounded-full font-semibold hover:bg-brand-accent transition-colors"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
