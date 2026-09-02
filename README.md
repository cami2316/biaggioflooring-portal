# Biaggio Flooring Website

A modern, responsive, SEO-optimized website for Biaggio Flooring - a Central Florida flooring and bathroom remodeling company with 15+ years of experience.

## Features

- **Modern Next.js Architecture**: Built with Next.js 14 and TypeScript for optimal performance and SEO
- **Responsive Design**: Mobile-first design that looks great on all devices
- **SEO Optimized**: Metadata, semantic HTML, and fast loading times
- **Brand Colors**: Custom color scheme (#46C038, #4FF233, black, white)
- **Professional Typography**: Clean, readable fonts throughout

## Pages

- **Home**: Hero section, services overview, and conversion-focused CTAs
- **Services**: Detailed flooring services (hardwood, laminate, vinyl, tile, carpet)
- **Bathroom & Shower**: Complete bathroom and shower remodeling services
- **Portfolio**: Finished projects gallery with image placeholders
- **About**: Company history and 15+ years of experience
- **Contact**: Contact form and business information

## Components

- **Header**: Responsive navigation with mobile menu
- **Footer**: Site links and contact information
- **Gallery**: Reusable image gallery component
- **ContactForm**: Fully functional contact form with validation
- **Image Placeholders**: SVG placeholders for future images

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cami2316/biaggioflooring.git
cd biaggioflooring
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel, Netlify, or any hosting platform

## Customization

### Brand Colors

Colors are defined in `tailwind.config.js`:
- Primary Green: #46C038
- Light Green: #4FF233

### Adding Images

Replace image placeholders in the `public/images` directory with actual project photos.

## License

© 2026 Biaggio Flooring. All rights reserved.

## Deploy notes (2026-09-02)
- Supabase env vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) configured in Vercel.
- ICS_SECRET / NEXT_PUBLIC_ICS_TOKEN configured for the calendar feed.
- Triggering redeploy to verify the build succeeds.

<!-- redeploy trigger 2026-09-02T12:06:47Z -->
