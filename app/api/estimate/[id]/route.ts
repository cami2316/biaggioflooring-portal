import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { adminDb } from '@/lib/firebaseAdmin'
import { calculateLaborBreakdown } from '@/lib/pricing'
import type { EstimateInput } from '@/lib/validations'

const toEstimateInput = (data: FirebaseFirestore.DocumentData): EstimateInput => {
  return {
    clientName: data.clientName ?? 'Client',
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    areas: Array.isArray(data.areas) ? data.areas : [],
  }
}

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const docRef = adminDb.collection('estimateRequests').doc(id)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Estimate not found.' }, { status: 404 })
    }

    const data = snapshot.data() ?? {}
    const input = toEstimateInput(data)
    const breakdown = calculateLaborBreakdown(input)

    return NextResponse.json({
      id: snapshot.id,
      clientName: data.clientName ?? 'Client',
      low: data.estimatedLow ?? breakdown.min,
      high: data.estimatedHigh ?? breakdown.max,
      breakdown,
    })
  } catch (error) {
    console.error('Failed to fetch estimate:', error)
    return NextResponse.json({ error: 'Unable to fetch estimate.' }, { status: 500 })
  }
}
