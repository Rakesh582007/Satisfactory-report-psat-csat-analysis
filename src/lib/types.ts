/**
 * Core data model for the CSAT / PSAT satisfaction toolkit.
 *
 * Locked decisions (see README):
 * - Both surveys use a 1–7 Likert scale. `null` = NA / not answered.
 * - CSAT additionally carries NPS (0–10). NPS is never averaged with Likert.
 * - PII (respondent name, email) is NOT part of this model and must never be
 *   loaded into the app or sent to any LLM.
 */

// ---------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------

/** 1–7 Likert score. */
export type Likert = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Likert or NA. */
export type LikertOrNA = Likert | null;

/** 0–10 Net Promoter Score. */
export type NpsScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type NpsCategory = "Promoter" | "Passive" | "Detractor";

export const LIKERT_MIN = 1;
export const LIKERT_MAX = 7;
export const NPS_MIN = 0;
export const NPS_MAX = 10;

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

/** Calendar quarter, e.g. { year: 2025, quarter: 3 } = Q3 2025. */
export interface Quarter {
  year: number;
  quarter: 1 | 2 | 3 | 4;
}

/** Stable string key for a quarter, e.g. "2025-Q3". Used for sorting/grouping. */
export type QuarterKey = `${number}-Q${1 | 2 | 3 | 4}`;

export function quarterKey(q: Quarter): QuarterKey {
  return `${q.year}-Q${q.quarter}`;
}

// ---------------------------------------------------------------------------
// Organisation
// ---------------------------------------------------------------------------

export type Vertical =
  | "Retail & CPG"
  | "BFSI"
  | "Healthcare"
  | "Technology"
  | "Industrials"
  | "Telecom";

export interface Account {
  id: string;
  name: string;
  vertical: Vertical;
  location: string;
}

export interface Project {
  id: string;
  accountId: string;
  name: string;
  /** First quarter the project was active. */
  start: Quarter;
  /** Last quarter the project was active; undefined = still running. */
  end?: Quarter;
}

// ---------------------------------------------------------------------------
// Respondents
// ---------------------------------------------------------------------------

/**
 * Seniority band derived from the respondent's title.
 * Used by tier rules: account tier = worst tier among Senior respondents.
 */
export type Seniority = "Executive" | "Senior" | "Mid" | "Unknown";

/** Years of association with Tredence, as captured in the CSAT survey. */
export type YearsOfAssociation = "Less Than 1 Year" | "Greater Than 1 Year";

export interface Respondent {
  /** Opaque id. Never a name or email. */
  id: string;
  accountId: string;
  /** Job title as given, e.g. "CIO", "VP IT Support". May be empty if anonymous. */
  title: string;
  seniority: Seniority;
  anonymous: boolean;
}

// ---------------------------------------------------------------------------
// CSAT — annual customer satisfaction survey
// ---------------------------------------------------------------------------

/** The eight "last one year" satisfaction dimensions in the CSAT survey. */
export type CsatDimension =
  | "accountManagement"
  | "projectManagement"
  | "qualityOfDeliverables"
  | "deliveringOnCommitments"
  | "technicalExpertise"
  | "resourceManagement"
  | "domainUnderstanding"
  | "solutionEffectiveness";

export const CSAT_DIMENSIONS: readonly CsatDimension[] = [
  "accountManagement",
  "projectManagement",
  "qualityOfDeliverables",
  "deliveringOnCommitments",
  "technicalExpertise",
  "resourceManagement",
  "domainUnderstanding",
  "solutionEffectiveness",
] as const;

export const CSAT_DIMENSION_LABELS: Record<CsatDimension, string> = {
  accountManagement: "Account management",
  projectManagement: "Project management",
  qualityOfDeliverables: "Quality of deliverables",
  deliveringOnCommitments: "Delivering on commitments",
  technicalExpertise: "Technical expertise of the resources",
  resourceManagement: "Resource management",
  domainUnderstanding: "Deep understanding of your business domain",
  solutionEffectiveness: "Effectiveness of solutions delivered",
};

/** The five "views on the following" agreement statements. */
export interface CsatAgreement {
  verySatisfied: LikertOrNA;
  considerForFuture: LikertOrNA;
  bestValueForMoney: LikertOrNA;
  bringsInnovation: LikertOrNA;
  thoughtLeadership: LikertOrNA;
}

/** How the client predominantly sees Tredence. */
export type PartnershipType =
  | "Strategic Partner"
  | "Advisory Partner"
  | "Execution Partner"
  | "Skill Augmentation Partner";

/** Relative rating of Tredence's AI capability vs other partners. */
export type AiCapabilityRating =
  | "Better Than Most"
  | "Somewhat Better"
  | "Similar To Others"
  | "Somewhat Worse"
  | "No Experience With Others";

export interface CsatExpectation {
  expectation: string;
  fulfilment: LikertOrNA;
}

export interface CsatResponse {
  id: string;
  respondentId: string;
  accountId: string;
  /** Survey wave. CSAT is annual; the quarter marks when it was collected. */
  period: Quarter;
  modeOfSurvey: "Web/Email" | "Interview" | "Other";

  nps: NpsScore | null;
  npsCategory: NpsCategory | null;

  /** Free text: what value stood out. */
  valueStoodOut: string;
  /** Free text: what could Tredence do differently. */
  doDifferently: string;
  /** Free text: what could Tredence improve on. */
  improveOn: string;

  /** Top-3 expectations with fulfilment score each. */
  expectations: CsatExpectation[];

  agreement: CsatAgreement;

  partnership: PartnershipType | null;
  partnershipReason: string;

  dimensions: Record<CsatDimension, LikertOrNA>;

  aiCapability: AiCapabilityRating | null;
  aiFocusAreas: string;
  bestInClassFirm: string;
  bestInClassReason: string;
}

// ---------------------------------------------------------------------------
// PSAT — quarterly / milestone project satisfaction survey
// ---------------------------------------------------------------------------

/** The eight PSAT dimensions. `overall` is Q1 (met expectations / business value). */
export type PsatDimension =
  | "overall"
  | "qualityOfDelivery"
  | "projectManagement"
  | "adaptability"
  | "communication"
  | "businessImpact"
  | "technicalExpertise"
  | "domainExpertise";

export const PSAT_DIMENSIONS: readonly PsatDimension[] = [
  "overall",
  "qualityOfDelivery",
  "projectManagement",
  "adaptability",
  "communication",
  "businessImpact",
  "technicalExpertise",
  "domainExpertise",
] as const;

export const PSAT_DIMENSION_LABELS: Record<PsatDimension, string> = {
  overall: "Met expectations & delivered business value",
  qualityOfDelivery: "Quality of Delivery",
  projectManagement: "Project Management (resource, budget, schedule)",
  adaptability: "Adaptability / Agility",
  communication: "Communication",
  businessImpact: "Business Impact / Value (last-mile adoption)",
  technicalExpertise: "Technical Expertise (DS & DE)",
  domainExpertise: "Domain Expertise",
};

export interface PsatResponse {
  id: string;
  respondentId: string;
  accountId: string;
  projectId: string;
  period: Quarter;

  dimensions: Record<PsatDimension, LikertOrNA>;

  /** Free text: aspects valued most. */
  valuedMost: string;
  /** Free text: areas to improve. */
  improveOn: string;
  /** Free text: associates called out. Names are allowed here only in synthetic data. */
  calloutAssociates: string;
  /** Free text: additional comments. */
  additionalComments: string;
}

// ---------------------------------------------------------------------------
// Sentiment tiers (output of the rules engine)
// ---------------------------------------------------------------------------

export type Tier = "Advocate" | "Stable" | "Vulnerable" | "At-Risk";

/** Ordered worst → best. Account tier = worst tier among Senior/Executive respondents. */
export const TIER_ORDER: readonly Tier[] = [
  "At-Risk",
  "Vulnerable",
  "Stable",
  "Advocate",
] as const;

export const TIER_ACTION: Record<Tier, string> = {
  Advocate: "Upsell / cross-sell",
  Stable: "Propose innovation workshops",
  Vulnerable: "Delivery leadership intervention",
  "At-Risk": "Executive escalation",
};

export interface TierResult {
  tier: Tier;
  /** Human-readable rule that fired, e.g. "NPS ≤ 6". */
  reason: string;
}

// ---------------------------------------------------------------------------
// Dataset container
// ---------------------------------------------------------------------------

export interface Dataset {
  accounts: Account[];
  projects: Project[];
  respondents: Respondent[];
  csat: CsatResponse[];
  psat: PsatResponse[];
}
