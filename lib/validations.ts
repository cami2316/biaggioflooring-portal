export type AreaType = 'floor' | 'wall' | 'backsplash' | 'shower'

export type EstimateAreaInput = {
  type: AreaType
  sqft: number
  material: string
  tileSize: string
  layout: string
  surface: 'floor' | 'wall' | ''
  showerType?: 'walk-in' | 'curb'
  extras: {
    demolition: boolean
    cementBoard: boolean
    bench: boolean
    niches: number
    window: boolean
  }
}

export type EstimateInput = {
  clientName: string
  email: string
  phone: string
  address: string
  areas: EstimateAreaInput[]
}

export type ValidationErrors = {
  fields: Record<string, string[]>
  areas: Array<Record<string, string[]>>
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^\d{10,11}$/

const addFieldError = (errors: ValidationErrors, field: string, message: string) => {
  if (!errors.fields[field]) {
    errors.fields[field] = []
  }
  errors.fields[field].push(message)
}

const addAreaError = (errors: ValidationErrors, index: number, field: string, message: string) => {
  if (!errors.areas[index]) {
    errors.areas[index] = {}
  }
  if (!errors.areas[index][field]) {
    errors.areas[index][field] = []
  }
  errors.areas[index][field].push(message)
}

export const validateEstimateInput = (data: EstimateInput) => {
  const errors: ValidationErrors = { fields: {}, areas: [] }

  const sanitizedPhone = (data.phone || '').replace(/\D/g, '')

  if (!data.clientName?.trim()) {
    addFieldError(errors, 'clientName', 'Name is required.')
  }

  if (!data.email?.trim() || !emailRegex.test(data.email.trim())) {
    addFieldError(errors, 'email', 'Valid email is required.')
  }

  if (!sanitizedPhone || !phoneRegex.test(sanitizedPhone)) {
    addFieldError(errors, 'phone', 'Phone must be numeric.')
  }

  if (!data.address?.trim()) {
    addFieldError(errors, 'address', 'Address is required.')
  }

  if (!Array.isArray(data.areas) || data.areas.length === 0) {
    addFieldError(errors, 'areas', 'At least one area is required.')
  } else {
    let hasPositiveSqft = false

    data.areas.forEach((area, index) => {
      if (!Number.isFinite(area.sqft) || area.sqft < 0) {
        addAreaError(errors, index, 'sqft', 'Square footage must be 0 or greater.')
        return
      }

      if (area.sqft > 0) {
        hasPositiveSqft = true
      }

      if (area.sqft <= 0) {
        return
      }

      if (!area.material?.trim()) {
        addAreaError(errors, index, 'material', 'Material is required.')
      }

      if (!area.tileSize?.trim()) {
        addAreaError(errors, index, 'tileSize', 'Tile size is required.')
      }

      if (!area.layout?.trim()) {
        addAreaError(errors, index, 'layout', 'Layout is required.')
      }

      if (area.type === 'shower') {
        if (!area.surface) {
          addAreaError(errors, index, 'surface', 'Shower surface is required.')
        }
        if (!area.showerType) {
          addAreaError(errors, index, 'showerType', 'Shower type is required.')
        }
      }
    })

    if (!hasPositiveSqft) {
      addFieldError(errors, 'areas', 'At least one area must have square footage greater than zero.')
    }
  }

  const isValid = Object.keys(errors.fields).length === 0
    && errors.areas.every((area) => !area || Object.keys(area).length === 0)

  return { isValid, errors }
}
