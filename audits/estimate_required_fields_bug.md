# Estimate Required Fields Bug Audit

Date: 2026-03-05

## Reproduction Steps
1. Go to `/estimate`.
2. Fill Step 1 (Name, Email, Phone, Address).
3. In Step 2, fill one area with `sqft > 0`, material, tile size, and layout.
4. Go to Step 3 and click submit.

## Expected Behavior
- One valid area should be enough to submit.
- Submit should proceed and redirect to confirmation.

## Observed Behavior
- Step 3 shows: "Complete all required fields to see your estimate." and blocks submit.

## Root Cause
- The Review step message is driven by `isEstimateReady`, which previously did not require tile size and layout, while the form still allowed empty values or inconsistent validation. This led to state mismatches where UI indicated completion but review could still flag missing fields.
- Some validations ran only in `trigger('areas')` while `isEstimateReady` used different conditions, causing confusion when a single area was filled.

## Fix Plan
- Enforce `tileSize` and `layout` as required when `sqft > 0`.
- Align `step1Valid` and `isEstimateReady` with the same required fields.
- Keep single-area submission valid without requiring "Add Area".

## Evidence (Code References)
- Validation gate: `step1Valid` and `isEstimateReady` in [components/EstimateForm.tsx](components/EstimateForm.tsx)
- Backend validation: [lib/validations.ts](lib/validations.ts)

## Manual Test (Minimum)
- Case A: One floor area with sqft 100, material, tile size, layout → submit OK.
- Case B: Shower with surface + shower type → submit OK.

## Notes
- No test email is triggered in submit flow; only internal + client emails are sent.
- Lint still fails due to project directory error: `.../lint`.
