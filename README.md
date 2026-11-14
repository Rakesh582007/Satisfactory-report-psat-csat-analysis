# Satisfaction Toolkit — CSAT / PSAT Analysis & Trend Engine

Companion toolkit to **DEXTER** (Delivery Excellence Transforming Enterprise Resilience).
Turns annual **CSAT** and quarterly **PSAT** survey responses into a four-tier
*Client Sentiment Meter*, maps PSAT delivery signals onto CSAT outcomes, and
tracks per-account trends across waves.

> Status: scaffold + data model only. No UI, no data yet.

## Why two surveys

| | PSAT | CSAT |
|---|---|---|
| Cadence | Quarterly / per milestone | Annual |
| Filled by | Client stakeholders on a project | Client stakeholders on the account |
| Purpose | Corrective — fix delivery mid-flight | Strategic — shape the relationship |

A good PSAT record followed by a CSAT dip tells you the problem is *not* delivery —
it is account-side. A bad PSAT that is acted on should show up as a recovered CSAT.
This toolkit makes that comparison explicit.

## Locked decisions

- Both surveys are **1–7 Likert**; `null` = NA. CSAT also carries **NPS 0–10**. NPS is never averaged with Likert.
- **Tiers are rule-based, not LLM-assigned.** Thresholds live in `src/lib/tiers.ts`. The LLM is used only for free-text theme extraction.
- **Account tier = worst tier among Executive/Senior respondents**, not the average.
- PSAT → CSAT dimension mapping lives in `src/lib/mapping.ts`. **Communication → Project management.** Account management has no PSAT counterpart.
- Data is **synthetic**: 5 accounts × 2 years (8 PSAT waves, 2 CSAT waves), scripted to five scenarios.
- **PII never enters the repo or an LLM call.** Real exports go in `data/real/` which is git-ignored. This repo is public.
- Stack: Next.js (App Router, TypeScript), Tailwind 4, Recharts, JSON data, pure-TS scoring/trend module, Gemini behind a route handler only.

## Sentiment tiers

| Tier | Meaning | Action |
|---|---|---|
| Advocate | High NPS, high satisfaction, sees Tredence as Strategic/Advisory partner | Upsell / cross-sell |
| Stable | Delivery solid, low innovation signal | Innovation workshops |
| Vulnerable | Execution friction — resource mgmt, quality, commitments | Delivery leadership intervention |
| At-Risk | Low NPS or unhappy senior stakeholder | Executive escalation |

## Layout

```
src/lib/types.ts     data model (accounts, respondents, CSAT, PSAT, tiers)
src/lib/mapping.ts   PSAT → CSAT dimension mapping
src/lib/tiers.ts     tier rule thresholds
data/synthetic/      generated datasets (committed)
data/real/           real exports (git-ignored, never commit)
```

## Running

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Roadmap

1. ~~Scaffold + data model~~
2. Synthetic generator + 5 scenario datasets
3. Scoring module (tier rules, dimension averages, NA handling)
4. Trend engine (per-account deltas, slopes, PSAT→CSAT gap attribution)
5. UI: portfolio → account drill-down → gap explainer
6. Gemini theme extraction on free text
