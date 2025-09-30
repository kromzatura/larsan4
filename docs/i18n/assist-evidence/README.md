# Assist Translation Evidence Archive

Stores raw evaluation artifacts used for Gate 2 (Assist Translation Action Validation).

## Directory Structure
```
assist-evidence/
  raw/
    page-<slug>.md
    post-<slug>.md
    product-<slug>.md
  summaries/
    batch-1-summary.json
  glossary.md
  rubric.md (optional copy of evaluation table)
```

Create `raw/` for individual evaluation files using the template from `../assist-eval.md`.

## Naming Convention
Use `<type>-<slug>.md` for human-readable docs OR `<_id>.json` for machine aggregated form.

## Minimal Raw Markdown Template
```
Doc ID: <_id>
Type: <page|post|product>
Slug: <slug>
Source Locale: en
Target Locale: nl
Title (EN): ...
Assist Output (NL): ...
Manual Adjustments Needed: <Yes/No>
Adjustment Notes: ...
Scores:
  Accuracy: X
  Terminology: X
  Grammar: X
  Tone: X
  Formatting: X
Overall Accept? <Yes/No>
Evaluator: <name>
Timestamp: <ISO8601>
```

## Aggregation Guidance
After collecting minimum sample (5 per type):
1. Run (future) aggregation script or manually compute averages.
2. Store summary JSON in `summaries/batch-<n>-summary.json` with keys:
```
{
  "batch": 1,
  "samples": 15,
  "averages": {"accuracy": 4.1, ...},
  "decision": "GO",
  "notes": "Tone borderline on products; add glossary terms",
  "thresholds": {"minAverage":3.8, "minMetric":3.5}
}
```
3. Update `decision` field in `../assist-eval.md`.

## Version Control Guidance
- Commit all raw evaluation artifacts.
- Redact any sensitive internal-only notes prior to public release.

## Next Steps After GO
Proceed to Gate 3 schema localization tasks (adding hidden language field, slug validator, etc.).

## Next Steps After HOLD
Refine glossary, retry sample with at least 3 new documents per type.
