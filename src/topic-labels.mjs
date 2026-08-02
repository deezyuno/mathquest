/** @typedef {import('../types/curriculum.ts').CurriculumTopic} CurriculumTopic */

/** @type {Record<string, string>} */
export const TOPIC_LABELS = {
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

export const CURRICULUM_TOPICS = Object.keys(TOPIC_LABELS);

export function getTopicLabel(topic) {
  return TOPIC_LABELS[topic];
}
