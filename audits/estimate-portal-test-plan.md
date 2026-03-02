# Estimate Portal Test Plan

Date: 2026-02-27

## Scope
- Estimate form UX and validations
- Multi-area builder behavior
- Pricing and calculation logic
- Firestore write pipeline
- Admin protections and actions
- Email notifications via SendGrid

## Form Validations
- Name is required.
- Email must match regex validation.
- Phone must be numeric.
- Address is required.
- Square footage must be numeric and >= 1.
- Layout/pattern is required.
- Inline error messages show for invalid fields.
- Next/Submit buttons remain disabled when current step is invalid.

## Multi-Area Add/Remove
- Add another area and verify defaults are applied.
- Remove an area and confirm it is removed from the form state.
- Verify step validation still passes with remaining areas.
- Ensure submission contains all areas in correct order.

## Calculation Accuracy
- Verify base rates for floor, wall, shower (floor/wall) are used.
- Verify extras are included (demolition, cement board, niches, bench, window).
- Verify diagonal and herringbone layout multipliers are applied.
- Confirm low == total and high == total * 1.12.
- Verify result display matches calculated range.

## Firestore Writes
- Submit a valid estimate and confirm document exists in estimateRequests.
- Check that estimatedLow and estimatedHigh are populated.
- Verify createdAt and status are set.
- Confirm areas and extras are stored correctly.

## Protected Routes
- Non-authenticated user cannot view admin list (shows access message).
- Authenticated user without role == admin cannot access admin content.
- Authenticated admin can view estimate list and details.

## Admin Actions
- View details for a request.
- Update status to confirmed, site visit scheduled, and closed.
- Add notes and save.
- Verify updates persist in Firestore.

## Email Notifications
- Submit estimate and confirm SendGrid email is sent.
- Verify subject: "Your Estimate Request Received".
- Verify body includes range and disclaimer.
- Confirm reply-to address matches SENDGRID_REPLY_TO.
- If email fails, submission still succeeds with email status indicated in API response.

## Regression Checklist
- Form still renders on /estimate and i18n routes.
- Results page renders with snapshot data.
- Admin pagination works (10 per page).
