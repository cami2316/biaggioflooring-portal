import type { EstimateInput } from '@/lib/validations'

export type LaborRange = {
  min: number
  max: number
}

export type LaborBreakdown = {
  totalSqft: number
  baseTotal: number
  extrasTotal: number
  min: number
  max: number
}

export const ESTIMATE_DISCLAIMER =
  'Preliminary labor estimate only. Final price requires on-site evaluation.'

const pricing = {
  floor: {
    ceramic: 4.2,
    porcelain: 4.5,
    marble: 6,
  },
  wall: {
    base: 10,
  },
  shower: {
    floorWithCompactedPan: 35,
    wallBase: 12,
  },
  extras: {
    demolitionPerSqft: 1.75,
    cementBoardPerSqft: 3,
    niche: 200,
    bench: 450,
    window: 300,
  },
}

const layoutMultipliers: Record<string, number> = {
  diagonal: 0.75,
  herringbone: 1.5,
}

const roundToTwo = (value: number) => Math.round(value * 100) / 100

const getBaseRate = (area: EstimateInput['areas'][number]) => {
  if (area.type === 'floor') {
    const rate = pricing.floor[area.material as keyof typeof pricing.floor]
    return rate ?? 0
  }

  if (area.type === 'wall' || area.type === 'backsplash') {
    return pricing.wall.base
  }

  if (area.type === 'shower') {
    return area.surface === 'floor'
      ? pricing.shower.floorWithCompactedPan
      : pricing.shower.wallBase
  }

  return 0
}

const applyLayoutMultiplier = (rate: number, layout: string) => {
  if (!layout) {
    return rate
  }

  const normalized = layout.trim().toLowerCase()
  const isDiagonal = normalized.includes('diagonal')
  const isHerringbone = normalized.includes('herringbone')
  const layoutAdd = (isDiagonal ? layoutMultipliers.diagonal : 0)
    + (isHerringbone ? layoutMultipliers.herringbone : 0)

  return rate + layoutAdd
}

const calculateBreakdown = (input: EstimateInput): LaborBreakdown => {
  let total = 0
  let baseTotal = 0
  let extrasTotal = 0
  let totalSqft = 0

  for (const area of input.areas) {
    const sqft = Number.isFinite(area.sqft) ? area.sqft : 0
    if (sqft <= 0) {
      continue
    }

    totalSqft += sqft

    const baseRate = applyLayoutMultiplier(getBaseRate(area), area.layout)
    let extras = 0

    if (area.extras.demolition) {
      extras += sqft * pricing.extras.demolitionPerSqft
    }
    if (area.extras.cementBoard) {
      extras += sqft * pricing.extras.cementBoardPerSqft
    }

    const niches = Number.isFinite(area.extras.niches) ? area.extras.niches : 0
    if (niches > 0) {
      extras += niches * pricing.extras.niche
    }

    if (area.extras.bench) {
      extras += pricing.extras.bench
    }

    if (area.extras.window) {
      extras += pricing.extras.window
    }

    const baseArea = sqft * baseRate
    baseTotal += baseArea
    extrasTotal += extras
    total += baseArea + extras
  }

  const min = roundToTwo(total)
  const max = roundToTwo(total * 1.12)

  return {
    totalSqft: roundToTwo(totalSqft),
    baseTotal: roundToTwo(baseTotal),
    extrasTotal: roundToTwo(extrasTotal),
    min,
    max,
  }
}

export const calculateLaborRange = (input: EstimateInput): LaborRange => {
  const { min, max } = calculateBreakdown(input)
  return { min, max }
}

export const calculateLaborBreakdown = (input: EstimateInput): LaborBreakdown => {
  return calculateBreakdown(input)
}
