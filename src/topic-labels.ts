import type { CurriculumTopic } from "../types/curriculum.js";

/** Visible UI labels for canonical topic keys. */
export const TOPIC_LABELS: Record<CurriculumTopic, string> = {
  add_subtract_multiply: "Addition, Subtraction & Multiplication",
  division: "Division",
  fractions: "Fractions",
  integers: "Integers",
  percent_decimals: "Percent & Decimals",
  number_sense_place_value: "Number Sense / Place Value",
  ratios_rates_proportions: "Ratios, Rates & Proportions",
  expressions_equations: "Expressions & Equations",
  order_of_operations: "Order of Operations",
  geometry_measurement: "Geometry & Measurement",
  statistics_probability: "Statistics & Probability",
  functions_linear_relationships: "Functions & Linear Relationships",
  mixed_practice: "Mixed Practice",
};

export function getTopicLabel(topic: CurriculumTopic): string {
  return TOPIC_LABELS[topic];
}
