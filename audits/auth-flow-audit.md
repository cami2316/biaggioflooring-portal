# Auth Flow Audit

Date: 2026-02-27

## Scope
- Firebase Auth (email/password)
- Role claim enforcement
- Admin portal access control
- Firestore security rules related to auth

## Auth Flow Summary
- Client sign-in handled with Firebase Auth (email/password) via the admin login UI.
- After sign-in, the client fetches token claims to determine admin access.
- Admin access is determined by a custom claim: role == "admin".

## Role Model
- Role is stored in Firebase custom claims (token.claims.role).
- Admin access requires role == "admin".

## Current User
- Determined at runtime by Firebase Auth state.
- Not persisted in the audit report to avoid exposing user data.

## Restricted Routes
- /admin
- /admin/dashboard

Access is gated in the client UI by checking the user session and role claim.

## Portal Protections
- Client-side checks in the admin dashboard for:
  - Signed-in user
  - role == "admin"
- Firestore rules restrict:
  - estimateRequests: read/update/delete only when role == "admin"
  - users: read/update/delete allowed for role == "admin" or self

## User Mapping
- The system expects a users collection in Firestore.
- Users can only create their own document (uid matching document id).
- Admins can read/update/delete any user document.

## Notes / Risks
- Route protection is currently client-side only; there is no middleware gate.
- Admin claims must be set via Firebase Admin SDK or CLI.
- If claims are missing, admin UI will display "Admin Access Required".

## Recommendations
- Add middleware to block /admin and /admin/dashboard at the edge for non-admin users.
- Ensure admin claims are documented and assigned during onboarding.
- Keep Firestore rules aligned with role claim enforcement.
