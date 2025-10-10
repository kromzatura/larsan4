# ML-02 Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R-001 | Locale decisions drift without a single source of truth | Team ships conflicting locale configs | Medium | Publish ADR-001 and i18n config; review quarterly | Engineering Lead | Open |
| R-002 | English parity regresses during `/[lang]/` scaffold rollout | Production outage or SEO loss | High | Establish regression test plan; run smoke tests after each scaffold change | QA Lead | Open |
| R-003 | Stakeholder alignment slips, delaying schema migration | Schedule slippage | Medium | Schedule standing check-ins; document decisions in shared dashboard | Product Manager | Mitigated (owner assigned, weekly updates scheduled) |
