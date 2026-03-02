# Site Functionality Report

Date: 2026-03-02

## Summary
This report lists current site functionality step by step, followed by what is still missing or recommended to make the system fully production-ready. No changes were made.

## Public Website (Step-by-step)
1. Home page with hero, services, portfolio preview, and CTAs.
2. Services, Portfolio, About, Bathroom/Shower pages.
3. Contact page with embedded Google Form and business details.
4. Floating CTA with Estimate + Book link.
5. SEO metadata, robots, sitemap.

## Estimate Portal (Step-by-step)
1. Public estimate page with hero CTA and explanation sidebar.
2. Multi-step estimate form:
   - Project info (name, email, phone, address).
   - Multi-area builder (floor/wall/backsplash/shower).
   - Extras (demolition, cement board, niches, bench, window).
   - Tile size and layout dropdowns.
   - Inline validation and disabled Next/Submit until valid.
3. Range calculation based on labor minimums with layout multipliers.
4. Submit to API route:
   - Validation
   - Calculation
   - Firestore write
   - SendGrid email send
5. Results page:
   - Shows range and breakdown
   - Works with session snapshot and server fetch fallback.

## Admin Portal (Step-by-step)
1. Admin login page (Firebase Auth).
2. Session cookie creation via Firebase Admin SDK.
3. Middleware blocks /admin/* unless session cookie is valid and role is admin.
4. Admin dashboard:
   - List requests
   - Pagination (10 per page)
   - Status updates and notes
   - Details view
   - Realtime updates (Firestore snapshot)

## Email Delivery (Step-by-step)
1. On estimate submit, API calls SendGrid.
2. Email subject: "Your Estimate Request Received".
3. Email body includes range and disclaimer.
4. Reply-To set via SENDGRID_REPLY_TO.

## What Is Missing / Suggested to Finish
### Email Delivery
- Verify SendGrid sender and domain to ensure delivery (SPF/DKIM).
- Add HTML template preview test and verify inbox deliverability.
- Consider CC/BCC to internal team for lead tracking.

### Security / Hardening
- Implement CSRF validation on any future admin POST routes.
- Add real rate limiting (Redis/Upstash) for multi-instance deployments.
- Add server-side logging of rate-limit events.

### Admin UX
- Add admin status filters (new, confirmed, closed).
- Add search by name/email.
- Add export (CSV) for leads.

### Results Page
- Optional signed token in URL for fetch-by-id security if needed.
- Optional expiration on result access window.

### Internationalization
- Localize estimate form labels and validation messages for /pt.
- Add /pt and /en versions of results page if desired.

### Observability
- Add email send status logging and alerting.
- Add server logs for API errors and Firestore write failures.

## Priority Items (to be fully "round")
1. Ensure SendGrid deliverability (domain verification + test emails).
2. Confirm estimate emails reach the client reliably.
3. Add production rate limiting and monitoring for /api/estimate.
4. Add admin filters/search for daily workflow.

## Notes
- The estimate must reach the client by email; ensure SendGrid setup is verified and tested end-to-end.
