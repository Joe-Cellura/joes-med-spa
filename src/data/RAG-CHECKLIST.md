# RAG Checklist — Virtual Assistant Training Standards

This checklist defines the minimum required knowledge base 
coverage for every client demo before outreach.

---

## 1. Core Business Identity
Every assistant must know:
- Business name
- Founder / practitioner name and credentials
- Location and address
- Phone number
- Email
- Booking link or process
- Hours of operation
- Year founded / years in business

Test questions:
- Who owns this business?
- Where are you located?
- How do I contact you?
- How long have you been in business?

---

## 2. Services Catalog
For every service, capture:
- Service name
- Short description
- What it treats / ideal candidate
- Expected benefits
- Downtime
- Number of sessions typically needed
- Related or alternative services

Test questions:
- What helps with acne scars?
- Do you treat redness?
- What is your most popular service?

---

## 3. Pricing Data
For each service, capture:
- Single session price
- Package pricing
- Area-specific pricing if applicable
- Consultation fee if any
- Promotional pricing if current

Test questions:
- How much does [service] cost?
- Do you offer packages?
- Is there a consultation fee?

---

## 4. Technology / Devices
For each device or platform, capture:
- Device name
- What it treats
- Skin tone compatibility
- Pain / comfort level
- Differentiators from competing technology

Test questions:
- What technology do you use?
- Is it safe for darker skin?
- Does it hurt?

---

## 5. FAQs / Objections
Must cover:
- Does it hurt?
- Is it safe?
- Is there downtime?
- How many sessions do I need?
- How should I prepare?
- What should I avoid after treatment?
- How soon will I see results?

---

## 6. Booking / Conversion Flow
Capture:
- Consultation process
- Booking URL or method
- Whether consultation is required first
- What happens during a consultation
- Lead handoff path

---

## 7. About / Brand Voice
Capture:
- Founder story
- Practitioner credentials and style
- Unique selling points
- What makes them different
- Brand tone and personality

---

## 8. Proof Points / Results
Capture:
- What concerns have been treated successfully
- Typical number of sessions for results
- Representative outcomes language

---

## 9. Policies
Capture:
- Cancellation policy
- Rescheduling policy
- Deposit requirements
- Refund policy
- Age restrictions
- Payment methods

---

## 10. Promotions
Capture:
- Current offers and discounts
- Applicable services
- Expiration dates
- Conditions

Note: Promotions should be updated regularly and 
separated from core knowledge to avoid stale data.

---

## Pre-Launch Test Suite (run before every outreach)

### Identity
- Who owns the business?
- Where are you located?
- How do I contact you?
- How long have you been in business?

### Services
- What helps with acne scars?
- Do you treat dark spots?
- What is best for redness?

### Pricing
- How much is [most popular service]?
- Do you offer packages?

### Technology
- What technology do you use?
- Is it safe for dark skin?
- Does it hurt?

### Booking
- I want to book an appointment
- Do I need a consultation first?

### Trust
- What makes you different?
- Who performs the treatments?

### Edge Cases
- How long have you been in business?
- I am not sure which treatment I need

---

## Minimum Viable RAG Scorecard

Must pass before outreach:
- [ ] Answers service questions accurately
- [ ] Answers pricing questions accurately
- [ ] Answers technology questions accurately
- [ ] Answers basic business identity questions
- [ ] Handles booking intent cleanly
- [ ] Does not hard-fail with robotic fallback
- [ ] Bridges gracefully when info is missing

Nice to have:
- [ ] Asks one clarifying question when appropriate
- [ ] Sounds human and on-brand
- [ ] References provider name naturally
- [ ] Suggests best next step confidently

---

## Required Knowledge Files Per Client

Minimum:
- clinic-overview.txt (includes history and identity)
- consultation-process.txt
- booking-guidance.txt
- faq.txt
- team.txt
- services/ (one file per service)
- blog/ (minimum 3 articles)

Recommended additions:
- technology.txt (devices and platforms)
- policies.txt (cancellation, deposits, refunds)
- promotions.txt (current offers)
- proof-points.txt (results and outcomes language)
