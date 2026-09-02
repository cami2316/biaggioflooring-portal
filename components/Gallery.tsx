'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

interface GalleryItem {
  id: number
  title: string
  category: 'Flooring' | 'Bathrooms' | 'Kitchen' | 'Projects'
  imageSrc: string
  alt: string
}

interface GalleryProps {
  items: GalleryItem[]
}

export default function Gallery({ items }: GalleryProps) {

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null)

  // Freeze scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeItem ? 'hidden' : 'auto'
  }, [activeItem])

  // Close modal with ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveItem(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const categories = useMemo(() => {
    const available = Array.from(new Set(items.map((item) => item.category)))
    return ['All', ...available]
  }, [items])

  const filteredItems = useMemo(() => {
    return activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory)
  }, [items, activeCategory])

  return (
    <div className="space-y-10">

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition
              ${activeCategory === category
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-white text-brand-charcoal border border-brand-charcoal hover:border-brand-accent hover:text-brand-accent'}
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition duration-500"
          >

            <div className="relative h-80">

              <Image
                src={item.imageSrc}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Glass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 backdrop-blur-[2px]" />

              {/* Floating Text */}
              <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500">
                <p className="text-xs uppercase tracking-widest text-brand-accent">
                  {item.category}
                </p>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>

            </div>

          </button>
        ))}

      </div>

      {/* LIGHTBOX MODAL */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-brand-charcoal/90 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn"
        >

          <div className="max-w-6xl w-full">

            {/* Modal Header */}
            <div className="flex justify-between items-center text-white mb-6">
              <div>
                <p className="uppercase text-sm tracking-widest text-brand-accent">
                  {activeItem.category}
                </p>
                <h3 className="text-3xl font-semibold">{activeItem.title}</h3>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="border border-white px-5 py-2 rounded-full hover:border-brand-accent hover:text-brand-accent transition"
              >
                Close
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={activeItem.imageSrc}
                alt={activeItem.alt}
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
