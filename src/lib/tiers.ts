import type { CsatDimension, PartnershipType, PsatDimension, Seniority } from "./types";

/**
 * Tier rule constants. Logic lives in the scoring module (step 3); this file
 * only holds the thresholds so they can be audited and tuned in one place.
 *
 * All Likert thresholds are on the 1–7 scale. NPS thresholds are on 0–10.
 * Rules are evaluated top-down, first match wins: At-Risk → Vulnerable → Advocate → Stable.
 */

// ---------------------------------------------------------------------------
// CSAT rules
// ---------------------------------------------------------------------------

export const CSAT_RULES = {
  atRisk: {
    /** NPS ≤ this → At-Risk. */
    npsMax: 6,
    /** OR: overall "very satisfied" ≤ this AND respondent seniority is executive. */
    verySatisfiedMax: 3,
    seniorityTrigger: ["Executive"] as readonly Seniority[],
  },
  vulnerable: {
    /** NPS in [min, max] (Passive band). */
    npsMin: 7,
    npsMax: 8,
    /** AND any of these dimensions ≤ dimMax. */
    dimensions: [
      "resourceManagement",
      "qualityOfDeliverables",
      "deliveringOnCommitments",
    ] as readonly CsatDimension[],
    dimMax: 4,
  },
  advocate: {
    /** NPS ≥ this. */
    npsMin: 9,
    /** AND partnership is one of these. */
    partnerships: ["Strategic Partner", "Advisory Partner"] as readonly PartnershipType[],
    /** AND mean of the 8 dimensions ≥ this. */
    meanDimMin: 6,
  },
} as const;

// ---------------------------------------------------------------------------
// PSAT rules (no NPS available)
// ---------------------------------------------------------------------------

export const PSAT_RULES = {
  atRisk: {
    /** overall (Q1) ≤ this → At-Risk. */
    overallMax: 3,
    /** OR: count of dimensions ≤ lowDimMax is ≥ lowDimCount. */
    lowDimMax: 3,
    lowDimCount: 2,
  },
  vulnerable: {
    /** Any of these dimensions ≤ dimMax. */
    dimensions: ["projectManagement", "qualityOfDelivery", "communication"] as readonly PsatDimension[],
    dimMax: 4,
  },
  advocate: {
    /** overall ≥ this. */
    overallMin: 6,
    /** AND min of all dimensions ≥ this. */
    minDimMin: 5,
  },
} as const;

// ---------------------------------------------------------------------------
// Account roll-up
// ---------------------------------------------------------------------------

/**
 * Seniority bands whose respondents decide the account tier.
 * Account tier = worst tier among these; averages hide the one unhappy CIO.
 * If an account has no respondents in these bands, fall back to all respondents.
 */
export const ACCOUNT_TIER_SENIORITY: readonly Seniority[] = ["Executive", "Senior"] as const;

// ---------------------------------------------------------------------------
// NPS category bands (standard)
// ---------------------------------------------------------------------------

export const NPS_BANDS = {
  promoterMin: 9,
  passiveMin: 7,
  // < passiveMin → Detractor
} as const;
