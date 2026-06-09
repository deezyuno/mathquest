import schema from "./curriculum_schema_v2.json";

/**
 * Validate a generated math problem against curriculum rules.
 * Returns: { valid: boolean, reason?: string }
 */

export function validateProblem(problem, grade) {
  const rules = schema.global_rules;
  const gradeRules = rules.grade_purity_rules[grade];

  if (!gradeRules) {
    return { valid: false, reason: "Invalid grade" };
  }

  const text = problem.toLowerCase();

  // -----------------------------
  // HARD REJECTION RULES
  // -----------------------------

  if (rules.hard_rejection_rules.includes("if_problem_has_only_integer_arithmetic_in_7th_or_above_reject")) {
    const is7thPlus = ["7th", "mid-7th", "8th"].includes(grade);

    const hasOnlyIntegers =
      /^[0-9+\-*/()\s]+$/.test(text) &&
      !text.includes("x") &&
      !text.includes("=") &&
      !text.includes("%");

    if (is7thPlus && hasOnlyIntegers) {
      return {
        valid: false,
        reason: "7th+ grade cannot contain integer-only arithmetic"
      };
    }
  }

  if (rules.hard_rejection_rules.includes("if_fraction_operations_appear_outside_6th_grade_or_contextual_use_reject")) {
    const fractionOps = text.includes("/") || text.includes("fraction");

    const allowedFractionGrades = ["6th", "mid-6th"];

    if (fractionOps && !allowedFractionGrades.includes(grade)) {
      return {
        valid: false,
        reason: "Fractions not allowed in this grade context"
      };
    }
  }

  if (rules.hard_rejection_rules.includes("if_no_variable_or_real_world_context_in_7th_or_above_reject_if_skill_requires_it")) {
    const requiresContextGrades = ["7th", "mid-7th", "8th"];

    const hasVariableOrContext =
      text.includes("x") ||
      text.includes("=") ||
      text.includes("%") ||
      text.includes("rate") ||
      text.includes("cost") ||
      text.includes("percent");

    if (requiresContextGrades.includes(grade) && !hasVariableOrContext) {
      return {
        valid: false,
        reason: "Missing variable or real-world context for grade level"
      };
    }
  }

  // -----------------------------
  // GRADE PURITY CHECK (light guardrail)
  // -----------------------------

  const allowed = gradeRules.join(" ").toLowerCase();

  const forbiddenPatterns = [
    { pattern: "fraction", allowedGrade: ["6th", "mid-6th"] },
    { pattern: "integer", allowedGrade: ["5th", "mid-5th", "6th", "mid-6th"] }
  ];

  for (const rule of forbiddenPatterns) {
    if (text.includes(rule.pattern) && !rule.allowedGrade.includes(grade)) {
      return {
        valid: false,
        reason: `Pattern '${rule.pattern}' not allowed in ${grade}`
      };
    }
  }

  // -----------------------------
  // PASS
  // -----------------------------

  return { valid: true };
}

/**
 * Wrapper for generator pipelines
 */
export function validateOrReject(problem, grade) {
  const result = validateProblem(problem, grade);
  if (!result.valid) {
    throw new Error(result.reason);
  }
  return true;
}
