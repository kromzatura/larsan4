# Addendum: Inclusion of `faq` and `specification` in Translation Scope

Date: 2025-09-28

Decision: Extend `documentInternationalization` `schemaTypes` to include `faq` and `specification`.

Rationale:
1. FAQ content is reusable across multiple pages and may benefit from future dedicated FAQ route + structured data (FAQPage schema). Document-level translation enables whole-set Assist translation & review.
2. Specification documents are structured product-centric data likely to be reused (product comparisons, exports). Maintaining per-locale spec docs preserves clean diffing and version control.
3. Avoids premature introduction of localized inline arrays for complex multi-field content, reducing editorial friction.
4. Aligns with Gate 3 objective to keep structural localization changes focused on alt text & pricing objects, not repackaging FAQ/spec content later.

Implications:
- Drift script updated; unmanaged set shrinks by two.
- Gate 2 verification MAY optionally include sample FAQ/spec translations if time permits, otherwise validated at Gate 3 entry.

Next Review Point:
- Reassess remaining unmanaged docs (`team`, `testimonial`, `banner`, etc.) after initial localized objects are stable.
