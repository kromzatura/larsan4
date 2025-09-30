# Assist Translation Evaluation

Purpose: Qualitatively evaluate Sanity Assist generated translations vs manual baseline before expanding locale rollout.

## Scope
- Document types: `page`, `post`, `product` (representative variety).
- Locales: Source `en` -> Target `nl`.

## Sampling Method
1. Select 5 recently updated documents per type (15 total).
2. For each, generate Dutch translation using Assist bulk or per-field actions.
3. Record evaluation metrics below.

## Evaluation Rubric (1-5)
| Metric | 1 (Poor) | 3 (Adequate) | 5 (Excellent) |
|--------|----------|--------------|---------------|
| Accuracy | Major meaning shifts | Minor wording differences | Faithful & precise |
| Terminology | Inconsistent key terms | Some inconsistencies | Consistently correct domain terms |
| Grammar/Fluency | Frequent errors | Occasional minor errors | Native-level fluency |
| Brand Tone | Off-tone | Neutral / Generic | Matches style guide |
| Formatting | Broken structure | Minor fixes needed | Preserved perfectly |

## Data Capture Template
```
Doc ID: <_id>
Type: <page|post|product>
Title (EN): ...
Assist Output (NL): ...
Manual Adjustments Needed: <Yes/No>
Adjustment Notes: ...
Scores: Accuracy X / Terminology X / Grammar X / Tone X / Formatting X
Overall Accept? <Yes/No>
```

## Aggregation
After scoring 15 docs:
- Compute average per metric.
- Threshold Recommendation:
  - Proceed if ALL averages >=3.8 and no metric <3.5.
  - If any metric <3.5, refine glossary + retry sample.

## Glossary / Terminology Notes
- Add emerging required canonical terms here (EN -> NL).

## Risk Log
| Risk | Impact | Mitigation |
|------|--------|------------|
| Inconsistent product feature terms | Medium | Establish glossary early; enforce via review checklist |
| Tone drift for marketing pages | High | Provide brand writing samples in Assist prompt context |
| Over-reliance on AI for nuanced legal text | High | Mandatory human review for legal pages |

## Decision
- Date:
- Evaluators:
- Outcome: <GO / HOLD>
- Follow-ups:

## Follow-up Actions (if HOLD)
| Issue | Action | Owner | Due |
|-------|--------|-------|-----|
| Low terminology score | Build glossary & retry | | |
| Formatting inconsistencies | File Assist feedback | | |

## Storage
Retain filled templates in `docs/i18n/assist-evidence/` for audit.
