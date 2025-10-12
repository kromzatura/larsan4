# Phase 0 Alignment — Meeting Notes

- **Purpose:** Confirm Phase 0 scope, success metrics, and approvals for ML-02 foundation work.
- **Participants:** Product lead, Engineering lead, Content lead, QA lead.
- **Date/Time:** Completed (see notes below)

## Agenda

1. **Recap of ML-02 objectives** (5 min)
   - Review high-level goals and constraints captured in the foundation plan.
2. **Locale decisions review** (10 min)
   - Walk through `frontend/lib/i18n/config.ts` and document any changes in Supported/Fallback locales.
3. **Routing strategy overview** (10 min)
   - Present ADR-001 decisions and capture outstanding questions (cookies, API routes, analytics impact).
4. **Risk register walkthrough** (10 min)
   - Validate current risk entries, owners, and mitigation steps.
5. **Success metrics & reporting cadence** (5 min)
   - Agree on status dashboard owner and update frequency.
6. **Next steps** (5 min)
   - Assign action items, confirm meeting notes distribution, and schedule follow-up sync.

## Decisions & Notes

- Stakeholders approved the Phase 0 scope and success metrics as drafted.
- Locale cookie name confirmed as `next-lang`, expiring after 30 days; opt-out policy unchanged.
- API routes will remain locale-neutral in Phase 1; revisit once localized responses are required.
- Analytics dashboard updates assigned to the product analytics owner; weekly status cadence agreed.
- Risk register owner: Product Manager (to update dashboard with outcomes each Friday).

## Pre-reads

- [Action Plan — ML-02](../ML-02-foundation.md)
- [ADR-001 — Locale Routing Strategy](../ADR-001-locale-routing.md)
- [Risk Register](../risk-register.md)
