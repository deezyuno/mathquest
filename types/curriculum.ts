/**
 * Canonical curriculum topic keys used for visible section filtering.
 * `template.topic` is the runtime source of truth — do not infer from skill IDs.
 */
export type CurriculumTopic =
  | "add_subtract_multiply"
  | "division"
  | "fractions"
  | "integers"
  | "percent_decimals"
  | "number_sense_place_value"
  | "ratios_rates_proportions"
  | "expressions_equations"
  | "order_of_operations"
  | "geometry_measurement"
  | "statistics_probability"
  | "functions_linear_relationships"
  | "mixed_practice";

export const CURRICULUM_TOPICS: readonly CurriculumTopic[] = [
  "add_subtract_multiply",
  "division",
  "fractions",
  "integers",
  "percent_decimals",
  "number_sense_place_value",
  "ratios_rates_proportions",
  "expressions_equations",
  "order_of_operations",
  "geometry_measurement",
  "statistics_probability",
  "functions_linear_relationships",
  "mixed_practice",
] as const;

/** Structural problem family for anti-repetition (stable snake_case). */
export type FormatFamily = string;

export type TemplateType =
  | "COMPUTE"
  | "APPLY"
  | "REVERSE"
  | "IDENTIFY"
  | "ERROR_ANALYSIS"
  | "COMPARE"
  | "REPRESENT";

export type AnswerType =
  | "numeric"
  | "fraction"
  | "fraction_simplified"
  | "decimal"
  | "decimal_1dp"
  | "mixed_number"
  | "unit_rate"
  | string;

/**
 * Problem template. `topic` and `formatFamily` are required metadata.
 */
export interface ProblemTemplate {
  id: string;
  type: TemplateType | string;
  problem: string;
  constraints: Record<string, [number, number] | unknown>;
  answer_type: AnswerType;
  answer_formula: string;
  /** Visible curriculum section — authoritative at runtime. */
  topic: CurriculumTopic;
  /** Structural format for diversity / anti-repetition. */
  formatFamily: FormatFamily;
  generation_note?: string;
  context?: string;
  constraints_note?: string;
  ccss_preview?: string;
}

export interface CurriculumSkill {
  id: string;
  name: string;
  ccss?: string;
  ccss_preview?: string;
  level: "solidify" | "preview" | string;
  note?: string;
  templates: ProblemTemplate[];
}

export interface GradeCurriculum {
  grade: string;
  description?: string;
  ccss_primary?: string[];
  ccss_preview?: string[];
  skills: CurriculumSkill[];
}

/** Flattened template with parent skill retained for analytics only. */
export interface FlatTemplate extends ProblemTemplate {
  skillId: string;
  skillName: string;
}
