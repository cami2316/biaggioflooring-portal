import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'

import { calculateLaborRange, type LaborRange } from '@/lib/pricing'
import type { EstimateInput } from '@/lib/validations'

const firebaseConfig = {
  apiKey: "AIzaSyBwTKL0tx2F3qqsk7w00l8jOxBAt5wGAQo",
  authDomain: "biaggioflooring.firebaseapp.com",
  projectId: "biaggioflooring",
  storageBucket: "biaggioflooring.firebasestorage.app",
  messagingSenderId: "997632061572",
  appId: "1:997632061572:web:16eb10f9e60d5f0cd992d1",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

export async function saveEstimateRequest(
  data: EstimateInput,
  range?: LaborRange
): Promise<string> {
  const resolvedRange = range ?? calculateLaborRange(data)

  const docRef = await addDoc(collection(db, 'estimateRequests'), {
    ...data,
    estimatedLow: resolvedRange.min,
    estimatedHigh: resolvedRange.max,
    createdAt: serverTimestamp(),
    status: 'new',
  })

  return docRef.id
}
