import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}

const adminUIDs = [
  '1lcxB21JqRSkcqCMjN7tCFC1BtS2',
  '3SJs6CHsa7aBi1rmnYYpEDBFhS23',
]

async function applyAdminClaims() {
  for (const uid of adminUIDs) {
    await admin.auth().setCustomUserClaims(uid, { admin: true })
    console.log('Admin claim applied to:', uid)
  }

  console.log('All admin claims successfully applied')
  process.exit(0)
}

applyAdminClaims().catch((error) => {
  console.error('Failed to set admin claims:', error)
  process.exit(1)
})
