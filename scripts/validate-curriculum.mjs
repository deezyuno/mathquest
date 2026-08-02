#!/usr/bin/env node
/**
 * Validate curriculum topic / formatFamily metadata across all seven grades.
 * Usage: node scripts/validate-curriculum.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CURRICULUM_TOPICS } from "../src/topic-labels.mjs";
import {
  flattenTemplates,
  filterByTopic,
  selectTemplate,
  visibleTopicsForGrade,
} from "../src/curriculum-engine.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CUR = path.join(__dirname, "..", "curriculum");

const FILES = [
  ["5th", "5th.json"],
  ["mid-5th", "mid5th.json"],
  ["6th", "6th.json"],
  ["mid-6th", "mid6th.json"],
  ["7th", "7th.json"],
  ["mid-7th", "mid7th.json"],
  ["8th", "8th.json"],
];

const VALID = new Set(CURRICULUM_TOPICS);

/** Known regression expectations: [grade, templateId, expectedTopic] */
const REGRESSION = [
  ["6th", "exp_001", "expressions_equations"],
  ["6th", "exp_002", "order_of_operations"],
  ["mid-6th", "ee_012", "expressions_equations"],
  ["mid-6th", "ee_020", "expressions_equations"],
  ["6th", "int_012", "integers"],
  ["mid-6th", "rn_001", "integers"],
  ["mid-6th", "rn_015", "integers"],
  ["mid-6th", "pn_001", "integers"],
  ["6th", "int_007", "percent_decimals"],
  ["mid-6th", "rn_008", "percent_decimals"],
  ["7th", "prob_001", "statistics_probability"],
  ["mid-6th", "cp_003", "geometry_measurement"],
  ["mid-7th", "pp_005", "expressions_equations"],
  ["8th", "sn_002", "expressions_equations"],
  ["mid-7th", "pct_003", "ratios_rates_proportions"],
  ["mid-5th", "ms_006", "ratios_rates_proportions"],
  ["7th", "ee_007", "expressions_equations"],
];

const errors = [];

function findTemplate(data, tid) {
  for (const skill of data.skills) {
    for (const t of skill.templates) {
      if (t.id === tid) return t;
    }
  }
  return null;
}

for (const [grade, file] of FILES) {
  const full = path.join(CUR, file);
  if (!fs.existsSync(full)) {
    errors.push(`Missing file ${file}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  if (data.grade !== grade) {
    errors.push(`${file}: grade field ${data.grade} !== ${grade}`);
  }

  const ids = new Map();
  const topicCounts = new Map();

  for (const skill of data.skills) {
    for (const t of skill.templates) {
      if (!t.topic) errors.push(`${grade}/${t.id}: missing topic`);
      else if (!VALID.has(t.topic)) {
        errors.push(`${grade}/${t.id}: invalid topic ${t.topic}`);
      }
      if (!t.formatFamily || !String(t.formatFamily).trim()) {
        errors.push(`${grade}/${t.id}: missing formatFamily`);
      }
      if (!(t.problem || "").trim()) {
        errors.push(`${grade}/${t.id}: blank problem prompt`);
      }
      if (ids.has(t.id)) {
        errors.push(`${grade}: duplicate template id ${t.id}`);
      }
      ids.set(t.id, true);
      topicCounts.set(t.topic, (topicCounts.get(t.topic) || 0) + 1);
    }
  }

  const flat = flattenTemplates(data);
  for (const topic of visibleTopicsForGrade(flat)) {
    if (topic === "mixed_practice") continue;
    const n = filterByTopic(flat, topic).length;
    if (n === 0) {
      errors.push(`${grade}: visible topic ${topic} has zero templates`);
    }
  }

  // Smoke: select each visible topic once
  for (const topic of visibleTopicsForGrade(flat)) {
    try {
      const { template } = selectTemplate(data, {
        grade,
        selectedTopic: topic,
        random: () => 0.42,
      });
      if (!template) errors.push(`${grade}/${topic}: select returned undefined`);
      if (!(template.problem || "").trim()) {
        errors.push(`${grade}/${topic}: select returned blank prompt`);
      }
    } catch (e) {
      errors.push(`${grade}/${topic}: select failed: ${e.message}`);
    }
  }
}

for (const [grade, tid, expected] of REGRESSION) {
  const file = FILES.find(([g]) => g === grade)?.[1];
  const data = JSON.parse(fs.readFileSync(path.join(CUR, file), "utf8"));
  const t = findTemplate(data, tid);
  if (!t) {
    errors.push(`Regression: ${grade}/${tid} not found`);
    continue;
  }
  if (t.topic !== expected) {
    errors.push(
      `Regression: ${grade}/${tid} topic=${t.topic} expected=${expected}`
    );
  }
  // Algebraic substitution must not be order_of_operations
  if (
    expected === "expressions_equations" &&
    (tid.startsWith("ee_") || tid.startsWith("exp_"))
  ) {
    if (t.topic === "order_of_operations" && tid !== "exp_002") {
      errors.push(`Regression: ${grade}/${tid} wrongly in order_of_operations`);
    }
  }
}

if (errors.length) {
  console.error(`validate:curriculum FAILED (${errors.length} errors)`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("validate:curriculum OK — all seven grades passed");
