import type { Metadata } from 'next'

import EstimatePageShell from '@/components/EstimatePageShell'

export const metadata: Metadata = {
  title: 'Estimativa de Mao de Obra',
  description:
    'Solicite uma estimativa preliminar de mao de obra para o seu projeto.',
}

export default function EstimatePtPage() {
  return (
    <EstimatePageShell
      eyebrow="Estimativa de Mao de Obra"
      title="Receba uma estimativa de mao de obra para seu projeto"
      description="Informe os detalhes do projeto para receber uma faixa de estimativa com base nos nossos valores minimos."
      redirectBase="/pt/estimate"
    />
  )
}
