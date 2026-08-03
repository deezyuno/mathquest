#!/usr/bin/env node
/**
 * Validate curriculum topic / formatFamily / ccss_standard coverage.
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
const ROOT = path.join(__dirname, "..");
const CUR = path.join(ROOT, "curriculum");
const DATA = path.join(ROOT, "data");

const FILES = [
  ["5th", "5th.json"],
  ["mid-5th", "mid5th.json"],
  ["6th", "6th.json"],
  ["mid-6th", "mid6th.json"],
  ["7th", "7th.json"],
  ["mid-7th", "mid7th.json"],
  ["8th", "8th.json"],
];

const VALID_TOPICS = new Set(CURRICULUM_TOPICS);
const ALLOWED_ANSWER_TYPES = new Set([
  "numeric",
  "fraction",
  "fraction_simplified",
  "decimal",
  "decimal_1dp",
  "mixed_number",
  "unit_rate",
]);

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

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function findTemplate(data, tid) {
  for (const skill of data.skills) {
    for (const t of skill.templates) {
      if (t.id === tid) return t;
    }
  }
  return null;
}

function band(grade) {
  if (grade === "mid-5th") return "5th";
  if (grade === "mid-6th") return "6th";
  if (grade === "mid-7th") return "7th";
  return grade;
}

const catalog = loadJson(path.join(DATA, "ccss_leaf_standards.json"));
const validStds = new Set(catalog.map((s) => s.standard));
const exemptions = loadJson(path.join(ROOT, "curriculum-standard-exemptions.json"));
const exemptSet = new Set(exemptions.map((e) => e.standard));

const coverageByBand = new Map();
for (const [grade, file] of FILES) {
  const data = loadJson(path.join(CUR, file));
  if (data.grade !== grade) errors.push(`${file}: grade mismatch`);
  const ids = new Map();
  for (const skill of data.skills) {
    for (const t of skill.templates) {
      if (!t.topic) errors.push(`${grade}/${t.id}: missing topic`);
      else if (!VALID_TOPICS.has(t.topic)) {
        errors.push(`${grade}/${t.id}: invalid topic ${t.topic}`);
      }
      if (!t.formatFamily || !String(t.formatFamily).trim()) {
        errors.push(`${grade}/${t.id}: missing formatFamily`);
      }
      if (!t.ccss_standard) {
        errors.push(`${grade}/${t.id}: missing ccss_standard`);
      } else {
        const codes = Array.isArray(t.ccss_standard)
          ? t.ccss_standard
          : [t.ccss_standard];
        for (const c of codes) {
          if (!validStds.has(c)) {
            errors.push(`${grade}/${t.id}: invalid ccss_standard ${c}`);
          }
          const b = band(grade);
          if (!coverageByBand.has(b)) coverageByBand.set(b, new Map());
          const m = coverageByBand.get(b);
          if (!m.has(c)) m.set(c, []);
          m.get(c).push({ id: t.id, family: t.formatFamily });
        }
      }
      if (!(t.problem || "").trim()) {
        errors.push(`${grade}/${t.id}: blank problem`);
      }
      if (!t.answer_formula) {
        errors.push(`${grade}/${t.id}: missing answer_formula`);
      }
      if (t.answer_type && !ALLOWED_ANSWER_TYPES.has(t.answer_type)) {
        errors.push(`${grade}/${t.id}: unsupported answer_type ${t.answer_type}`);
      }
      if (ids.has(t.id)) errors.push(`${grade}: duplicate id ${t.id}`);
      ids.set(t.id, true);
    }
  }

  const flat = flattenTemplates(data);
  for (const topic of visibleTopicsForGrade(flat)) {
    if (topic === "mixed_practice") continue;
    if (filterByTopic(flat, topic).length === 0) {
      errors.push(`${grade}: visible topic ${topic} has zero templates`);
    }
  }

  for (const topic of visibleTopicsForGrade(flat)) {
    try {
      const { template } = selectTemplate(data, {
        grade,
        selectedTopic: topic,
        random: () => 0.42,
      });
      if (!template) errors.push(`${grade}/${topic}: undefined template`);
      if (!(template.problem || "").trim()) {
        errors.push(`${grade}/${topic}: blank selected prompt`);
      }
    } catch (e) {
      errors.push(`${grade}/${topic}: select failed: ${e.message}`);
    }
  }
}

// Official standard coverage (non-exempt must have >=1 template)
for (const meta of catalog) {
  if (!meta.keypadFriendly || exemptSet.has(meta.standard)) continue;
  const hits = coverageByBand.get(meta.grade)?.get(meta.standard) || [];
  if (hits.length === 0) {
    errors.push(
      `Official standard ${meta.standard} has zero coverage and is not exempted`
    );
  }
}

// Mid-6th Order of Operations requirements
{
  const mid6 = loadJson(path.join(CUR, "mid6th.json"));
  const oo = flattenTemplates(mid6).filter(
    (t) => t.topic === "order_of_operations"
  );
  if (oo.length < 8) {
    errors.push(`mid-6th order_of_operations has ${oo.length} templates; need >= 8`);
  }
  const fams = new Set(oo.map((t) => t.formatFamily));
  if (fams.size < 5) {
    errors.push(
      `mid-6th order_of_operations has ${fams.size} families; need >= 5`
    );
  }
  for (const t of oo) {
    if (/when\s+[a-z]\s*=/i.test(t.problem || "")) {
      errors.push(`${t.id}: algebraic substitution misfiled as OoO`);
    }
  }
}

for (const [grade, tid, expected] of REGRESSION) {
  const file = FILES.find(([g]) => g === grade)?.[1];
  const data = loadJson(path.join(CUR, file));
  const t = findTemplate(data, tid);
  if (!t) {
    errors.push(`Regression missing ${grade}/${tid}`);
    continue;
  }
  if (t.topic !== expected) {
    errors.push(`Regression ${grade}/${tid} topic=${t.topic} expected=${expected}`);
  }
}

// Exemptions must have reasons
for (const e of exemptions) {
  if (!e.reason || !String(e.reason).trim()) {
    errors.push(`Exemption ${e.standard} missing reason`);
  }
}

if (errors.length) {
  console.error(`validate:curriculum FAILED (${errors.length} errors)`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("validate:curriculum OK — standards coverage + metadata passed");
