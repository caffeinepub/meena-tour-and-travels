# Meena Tour and Travels

## Current State
Site has booking modal (BookingModal.tsx) and contact form in App.tsx. Forms send data via formsubmit.co email. No WhatsApp integration exists.

## Requested Changes (Diff)

### Add
- Floating WhatsApp button (bottom-right corner, always visible) with both numbers: Gaurav (9990104748) and Shyam Lal Meena (9868901253) — customer can choose which to contact
- After BookingModal form submission success, show WhatsApp buttons to send booking details to either number
- In contact form (App.tsx), after submit, show WhatsApp buttons to send message details to either number
- WhatsApp pre-filled message should include all form fields the customer filled

### Modify
- BookingModal: after setSuccess(true), show two WhatsApp buttons with pre-filled booking summary message
- Contact form handleFormSubmit: show WhatsApp option after form submit

### Remove
- Nothing removed

## Implementation Plan
1. Create WhatsAppButton floating component
2. Update BookingModal to show WhatsApp share buttons on success
3. Update App.tsx contact form to show WhatsApp buttons after submit
4. Add floating WhatsApp widget to App.tsx
