# Estimate Portal Fix Report

Date: 2026-03-03

## Summary
Fixed the estimate portal to allow a single area submission, removed dependency on post-submit refetch for confirmation, and aligned pricing/validation/email rules with the latest requirements.

## Files Updated (3 bullets each)

### components/EstimateForm.tsx
- Allow a single filled area without needing to add extra areas.
- Enforce material, shower surface, and shower type when sqft > 0.
- Add query params on redirect and a gentle warning for 0 sqft areas.

### app/estimate/[id]/page.tsx
- Render confirmation without refetching estimate data.
- Show only the total range (when provided) and success messaging.
- Remove any error message about missing estimate details.

### lib/pricing.ts
- Update layout multiplier logic (herringbone +0.75 only).
- Add fixed pricing for shower type (walk-in/curb).
- Remove silent fallback to ceramic for wall/backsplash/shower wall.

### lib/validations.ts
- Sanitize phone before validation and accept 10-11 digits.
- Require material for filled areas and shower surface/type for showers.
- Keep zero-sqft areas allowed while requiring at least one positive area.

### lib/email.ts
- Client email includes spam warning and confirmation language.
- Internal email includes shower type in project details.
- No test email is triggered from the estimate flow.

### audits/pricing-reference-report.md
- Updated to match the new layout and shower type pricing.
- Includes revised extras and range multiplier.
- Serves as the single source for review.

## Manual Test Steps
1. **Case A (single area)**
   - Fill one area with sqft > 0 and material.
   - Ensure you can submit without adding another area.

2. **Case B (shower)**
   - Choose Shower, select Surface and Shower Type.
   - Submit successfully.

3. **Email checks**
   - Client receives confirmation with SPAM warning.
   - Internal receives full details (areas, extras, shower type).
   - No test email is sent on submit.

4. **Confirmation screen**
   - Always shows "Estimate Submitted" and spam notice.
   - Shows range if min/max are provided in query.

## Commands
- npm run build
- npm run lint (note: fails due to project directory error)

## Notes
- Lint currently fails with: "Invalid project directory provided, no such directory: /Users/migraciosa/biaggioflooring/lint".
