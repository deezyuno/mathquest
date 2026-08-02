# Curriculum topic & formatFamily metadata

## Runtime contract

Every problem template declares:

```json
{
  "topic": "expressions_equations",
  "formatFamily": "algebraic_substitution_linear"
}
```

**`template.topic` is the only authoritative category for section filtering.**

Do not categorize from:

- `skill.id`
- prompt keyword heuristics
- exponent / decimal / coordinate detection

Skills remain for organization, balancing, logging, and analytics.

## Selection flow

```
load grade → flatten templates → filter by template.topic
→ choose eligible template → apply formatFamily diversity → generate
```

Use `src/curriculum-engine.mjs` (typed mirror: `src/curriculum-engine.ts`).

## Commands

```bash
npm run validate:curriculum
npm test
npm run audit:topics
```

## App integration

Wire the host app (Lovable/React) to:

1. Load grade JSON from this repo (GitHub raw or bundled).
2. Call `filterByTopic` / `selectTemplate` from `curriculum-engine`.
3. Render section chips via `TOPIC_LABELS` / `visibleTopicsForGrade`.
4. Remove any `SKILL_SECTION_REGISTRY` / `resolveSection` / prompt-inference path from the **normal** generation flow.

Migration-time classification lived in the one-off `_migrate_topic_metadata.py` helper outside the packaged runtime and must not run during problem generation.
