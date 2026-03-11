# Admin Login Audit

Date: 2026-03-05

## Scope
Login Page → Form handler → Firebase Auth call → Admin validation → Redirect to dashboard.

## Findings (P0)

### 1) Admin route protection redirects to a non-existent path
**Severity:** P0

**Evidence**
- Middleware redirects unauthenticated users to `/login`.
- The actual login route is `/auth`.

Files:
- [middleware.ts](middleware.ts)
- [app/auth/page.tsx](app/auth/page.tsx)

**Impact**
Users are sent to a missing page and cannot reach the login form through protected routes.

**Recommendation**
Update the redirect target to `/auth` and align cookie name (see Finding 2).

---

### 2) Session cookie name mismatch blocks admin access
**Severity:** P0

**Evidence**
- Login API sets cookie `__session`.
- Middleware checks cookie `session`.

Files:
- [app/api/session/login/route.ts](app/api/session/login/route.ts)
- [middleware.ts](middleware.ts)

**Impact**
Even after successful login, the admin area is treated as unauthenticated and redirects away.

**Recommendation**
Check for `__session` in middleware or update login API to set `session` consistently.

---

### 3) Admin claim validation can block login after Firebase sign-in
**Severity:** P0

**Evidence**
- Firebase sign-in is called in `handleSubmit`.
- Admin validation happens in `/api/session/login` and returns 403 if `decoded.admin !== true`.
- The UI shows a generic "Sign-in failed" for any failure in the catch block.

Files:
- [components/AuthForm.tsx](components/AuthForm.tsx)
- [app/api/session/login/route.ts](app/api/session/login/route.ts)

**Impact**
If the admin claim is missing or token is stale, login fails with a generic message.

**Recommendation**
Keep the admin claim check but surface the actual error message or HTTP status to the UI.
Also force token refresh after applying claims (logout + login). A full error log already exists.

---

## Verification of Firebase Auth Call
- `signInWithEmailAndPassword(auth, email.trim(), password)` is executed in `handleSubmit`.
- No pre-validation blocks are present before the Firebase Auth call.

File:
- [components/AuthForm.tsx](components/AuthForm.tsx)

## Firebase Initialization
- Client Firebase is initialized once in [lib/firebase.ts](lib/firebase.ts).
- Admin SDK is initialized once in [lib/firebaseAdmin.ts](lib/firebaseAdmin.ts).
- Client config is hardcoded, not using `NEXT_PUBLIC_FIREBASE_*` variables.
  This can cause project mismatch if the deployed project differs.

## Project Confirmation
- Client config uses `projectId: "biaggioflooring"` in [lib/firebase.ts](lib/firebase.ts).
- No runtime log exists to confirm the project on the login page.

## Admin Claim Read
- Frontend currently checks `token.claims.admin === true` after login in [components/AuthForm.tsx](components/AuthForm.tsx).
- Backend checks `decoded.admin === true` in [app/api/session/login/route.ts](app/api/session/login/route.ts).

## Redirect Flow
- Login success redirects to `/admin/dashboard`.
- Middleware redirects to `/login` for missing session.

## Recommended Fixes (Ordered)
1. Change middleware redirect target to `/auth`.
2. Align cookie name between middleware and login API (`__session` vs `session`).
3. Improve error handling to show when admin claim is missing (403) vs Firebase Auth error.
4. Optionally log project id on `/auth` for easier environment verification.

## Notes
- The user-facing message "Sign-in failed" can represent either Auth failure or admin claim failure.
- Token refresh is required after applying custom claims.
