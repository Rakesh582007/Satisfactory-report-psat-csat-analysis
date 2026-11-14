import type { CsatDimension, PsatDimension } from "./types";

/**
 * PSAT → CSAT dimension mapping.
 *
 * This is the backbone of the "PSAT was green, why did CSAT dip?" analysis:
 * a PSAT dimension can only be compared against the CSAT dimension(s) it maps to.
 *
 * Locked decisions:
 * - Communication maps to Project management (NOT Account management).
 * - Adaptability → Delivering on commitments is a loose mapping; flagged `strength: "loose"`.
 * - PSAT `overall` (Q1) maps to the CSAT agreement statements, not a dimension —
 *   handled separately in the scoring module.
 */

export type MappingStrength = "strong" | "loose";

export interface DimensionMapping {
  psat: PsatDimension;
  csat: CsatDimension[];
  strength: MappingStrength;
  note?: string;
}

export const PSAT_TO_CSAT: readonly DimensionMapping[] = [
  {
    psat: "qualityOfDelivery",
    csat: ["qualityOfDeliverables"],
    strength: "strong",
  },
  {
    psat: "projectManagement",
    csat: ["projectManagement", "resourceManagement"],
    strength: "strong",
  },
  {
    psat: "communication",
    csat: ["projectManagement"],
    strength: "strong",
    note: "Communication is treated as a project-management responsibility.",
  },
  {
    psat: "technicalExpertise",
    csat: ["technicalExpertise"],
    strength: "strong",
  },
  {
    psat: "domainExpertise",
    csat: ["domainUnderstanding"],
    strength: "strong",
  },
  {
    psat: "businessImpact",
    csat: ["solutionEffectiveness"],
    strength: "strong",
  },
  {
    psat: "adaptability",
    csat: ["deliveringOnCommitments"],
    strength: "loose",
    note: "Agility and commitment-keeping are related but not identical.",
  },
] as const;

/**
 * CSAT dimensions that have NO PSAT counterpart.
 * A dip here cannot be attributed to delivery — it is account-side.
 */
export const CSAT_ONLY_DIMENSIONS: readonly CsatDimension[] = [
  "accountManagement",
] as const;

/** Reverse lookup: which PSAT dimensions feed a given CSAT dimension. */
export function psatSourcesFor(csat: CsatDimension): PsatDimension[] {
  return PSAT_TO_CSAT.filter((m) => m.csat.includes(csat)).map((m) => m.psat);
}

/** Forward lookup: which CSAT dimensions a PSAT dimension predicts. */
export function csatTargetsFor(psat: PsatDimension): CsatDimension[] {
  return PSAT_TO_CSAT.find((m) => m.psat === psat)?.csat ?? [];
}
