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

async function setAdmins() {
  for (const uid of adminUIDs) {
    await admin.auth().setCustomUserClaims(uid, {
      role: 'admin',
      admin: true,
    })
    console.log('Admin claim added to:', uid)
  }

  console.log('All admin claims applied successfully')
  process.exit(0)
}

setAdmins().catch((error) => {
  console.error('Failed to set admin claims:', error)
  process.exit(1)
})
