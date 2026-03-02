import Image from 'next/image'

import EstimateForm from '@/components/EstimateForm'
import Card from '@/components/ui/Card'

type EstimatePageShellProps = {
  eyebrow: string
  title: string
  description: string
  redirectBase?: string
}

const EstimatePageShell = ({
  eyebrow,
  title,
  description,
  redirectBase,
}: EstimatePageShellProps) => {
  return (
    <>
      <section className="relative py-20 sm:py-28 bg-brand-charcoal text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/projects/bath03.jpg"
            alt="Luxury remodeling project"
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/70 to-brand-charcoal/90" />
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl">
          <p className="uppercase tracking-[0.45em] text-brand-accent text-sm mb-5">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-white/90">
            {description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-white">
        <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-start">
          <div>
            <EstimateForm redirectBase={redirectBase} />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-brand-charcoal mb-3">
                How It Works
              </h2>
              <ul className="space-y-3 text-brand-charcoal">
                <li>✔ Add each area you want remodeled.</li>
                <li>✔ Include shower floor vs. wall for accurate labor minimums.</li>
                <li>✔ See the estimate range instantly.</li>
                <li>✔ We review and follow up within one business day.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brand-charcoal mb-3">
                Need Help Right Away?
              </h3>
              <p className="text-brand-charcoal/80">
                Call us at <a href="tel:3214425003" className="font-semibold text-brand-charcoal hover:text-brand-accent">321 4425003</a>
                or email <a href="mailto:biaggioflooringllc@gmail.com" className="font-semibold text-brand-charcoal hover:text-brand-accent">biaggioflooringllc@gmail.com</a>.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default EstimatePageShell
