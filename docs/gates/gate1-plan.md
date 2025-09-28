# Gate 1 Plan: Verify Translation Plugin Surface

Date: 2025-09-28

Objective: Confirm that the document internationalization plugin is correctly mounted and exposes translation UI/actions for the intended document types BEFORE introducing any new localized structural fields.

Scope:
- Sanity Studio loads without schema or runtime errors.
- Target document types show translation panel / actions: `page`, `post`, `product`, `productCategory`, `category`, `settings`, `navigation`.
- Non-target types (e.g., `faq`, `testimonial`, `team`) do NOT show translation UI.
- Assist plugin coexists (no conflicts in document edit view).

Exit Criteria:
1. Visual confirmation (screenshots) of translation UI on at least two target types.
2. Absence confirmation (screenshot or note) on one non-target type.
3. Recorded list of plugin `schemaTypes` vs actual registered document types (drift status: none expected).
4. No console errors in Studio load (manual check) OR documented if environment prevents runtime validation.

Artifacts To Produce:
- `docs/gates/gate1-verification.md` populated with evidence.
- Drift check script output (JSON or inline block).

Risks / Mitigations:
- Plugin misconfiguration: drift script will highlight missing/extra types.
- Future schema additions forgetting plugin list: add script to CI later.

Next Gate Prereq (Gate 2): Need Gate 1 completed so Assist translation quality can be evaluated on valid plugin-enabled docs.
