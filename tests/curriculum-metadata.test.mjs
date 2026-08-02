import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  flattenTemplates,
  filterByTopic,
  selectTemplate,
  recordSelection,
  applyFormatFamilyDiversity,
  visibleTopicsForGrade,
} from "../src/curriculum-engine.mjs";
import { TOPIC_LABELS } from "../src/topic-labels.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CUR = path.join(__dirname, "..", "curriculum");

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(CUR, file), "utf8"));
}

function find(data, tid) {
  for (const skill of data.skills) {
    for (const t of skill.templates) {
      if (t.id === tid) return { ...t, skillId: skill.id, skillName: skill.name };
    }
  }
  return undefined;
}

describe("curriculum topic metadata regressions", () => {
  it("algebraic substitution is expressions_equations, not order_of_operations", () => {
    const g6 = load("6th.json");
    const mid6 = load("mid6th.json");
    assert.equal(find(g6, "exp_001").topic, "expressions_equations");
    assert.equal(find(g6, "exp_001").formatFamily, "algebraic_substitution_linear");
    assert.equal(find(mid6, "ee_012").topic, "expressions_equations");
    assert.equal(find(mid6, "ee_012").formatFamily, "algebraic_substitution_exponent");
    assert.equal(find(mid6, "ee_020").topic, "expressions_equations");
    assert.equal(find(mid6, "ee_020").formatFamily, "algebraic_substitution_linear");
    assert.notEqual(find(mid6, "ee_012").topic, "order_of_operations");
  });

  it("numeric exponent-precedence can be order_of_operations", () => {
    const g6 = load("6th.json");
    const t = find(g6, "exp_002");
    assert.equal(t.topic, "order_of_operations");
    assert.equal(t.formatFamily, "numeric_order_operations_exponents");
  });

  it("integer opposites/comparisons/temperature/number-line are integers", () => {
    const g6 = load("6th.json");
    const mid6 = load("mid6th.json");
    assert.equal(find(g6, "int_012").topic, "integers");
    assert.notEqual(find(g6, "int_012").topic, "fractions");
    assert.equal(find(mid6, "rn_001").topic, "integers");
    assert.notEqual(find(mid6, "rn_001").topic, "fractions");
    assert.equal(find(mid6, "rn_015").topic, "integers");
    assert.equal(find(mid6, "pn_001").topic, "integers");
    assert.equal(find(mid6, "pn_001").formatFamily, "integer_number_line");
  });

  it("decimal-only addition is percent_decimals, not fractions", () => {
    const g6 = load("6th.json");
    const mid6 = load("mid6th.json");
    const g5 = load("5th.json");
    assert.equal(find(g6, "int_007").topic, "percent_decimals");
    assert.equal(find(mid6, "rn_008").topic, "percent_decimals");
    assert.equal(find(g5, "dec_001").topic, "percent_decimals");
    assert.equal(find(g5, "dec_001").formatFamily, "decimal_addition");
  });

  it("simple marble probability is statistics_probability", () => {
    const g7 = load("7th.json");
    const t = find(g7, "prob_001");
    assert.equal(t.topic, "statistics_probability");
    assert.notEqual(t.topic, "geometry_measurement");
    assert.equal(t.formatFamily, "probability_simple");
  });

  it("quadrant identification is geometry_measurement", () => {
    const mid6 = load("mid6th.json");
    const t = find(mid6, "cp_003");
    assert.equal(t.topic, "geometry_measurement");
    assert.equal(t.formatFamily, "quadrant_identification");
  });

  it("standalone x^2 = n is expressions_equations, not geometry", () => {
    const mid7 = load("mid7th.json");
    const g8 = load("8th.json");
    assert.equal(find(mid7, "pp_005").topic, "expressions_equations");
    assert.equal(find(mid7, "pp_005").formatFamily, "quadratic_equation_positive_root");
    assert.equal(find(g8, "sn_002").topic, "expressions_equations");
    assert.notEqual(find(g8, "sn_002").topic, "geometry_measurement");
  });

  it("percent-discount and unit-rate are ratios_rates_proportions", () => {
    const mid7 = load("mid7th.json");
    const mid5 = load("mid5th.json");
    assert.equal(find(mid7, "pct_003").topic, "ratios_rates_proportions");
    assert.equal(find(mid7, "pct_003").formatFamily, "percent_discount");
    assert.equal(find(mid5, "ms_006").topic, "ratios_rates_proportions");
    assert.equal(find(mid5, "ms_006").formatFamily, "unit_rate");
  });

  it("inequality word problems are expressions_equations", () => {
    const g7 = load("7th.json");
    assert.equal(find(g7, "ee_007").topic, "expressions_equations");
    assert.equal(find(g7, "ee_007").formatFamily, "inequality_word_problem");
  });
});

describe("selection engine", () => {
  it("never returns undefined template for a populated topic", () => {
    const mid6 = load("mid6th.json");
    const flat = flattenTemplates(mid6);
    for (const topic of visibleTopicsForGrade(flat)) {
      const { template } = selectTemplate(mid6, {
        grade: "mid-6th",
        selectedTopic: topic,
        random: () => 0.1,
      });
      assert.ok(template);
      assert.ok(template.id);
      assert.ok((template.problem || "").trim().length > 0);
      if (topic !== "mixed_practice") {
        assert.equal(template.topic, topic);
      }
    }
  });

  it("filterByTopic uses template.topic only (not skill id)", () => {
    const mid6 = load("mid6th.json");
    const flat = flattenTemplates(mid6);
    const decimals = filterByTopic(flat, "percent_decimals");
    assert.ok(decimals.length >= 1);
    // rn_008 lives under rational_numbers skill but topic is percent_decimals
    assert.ok(decimals.some((t) => t.id === "rn_008"));
    assert.ok(decimals.every((t) => t.topic === "percent_decimals"));
  });

  it("format-family selection avoids three consecutive identical families when alternatives exist", () => {
    const candidates = [
      { id: "a", formatFamily: "fam_a", problem: "A", topic: "integers", skillId: "s1" },
      { id: "b", formatFamily: "fam_b", problem: "B", topic: "integers", skillId: "s1" },
      { id: "c", formatFamily: "fam_a", problem: "C", topic: "integers", skillId: "s1" },
    ];
    const recent = ["fam_a", "fam_a"];
    const filtered = applyFormatFamilyDiversity(candidates, recent);
    assert.ok(filtered.every((t) => t.formatFamily !== "fam_a"));
    assert.ok(filtered.some((t) => t.formatFamily === "fam_b"));
  });

  it("relaxes diversity instead of returning blank when only one family remains", () => {
    const curriculum = {
      grade: "test",
      skills: [
        {
          id: "only",
          name: "Only",
          templates: [
            {
              id: "t1",
              type: "COMPUTE",
              problem: "1+1",
              constraints: {},
              answer_type: "numeric",
              answer_formula: "2",
              topic: "integers",
              formatFamily: "only_family",
            },
            {
              id: "t2",
              type: "COMPUTE",
              problem: "2+2",
              constraints: {},
              answer_type: "numeric",
              answer_formula: "4",
              topic: "integers",
              formatFamily: "only_family",
            },
          ],
        },
      ],
    };
    const history = {
      recentTemplateIds: [],
      recentFormatFamilies: ["only_family", "only_family"],
      recentSkillIds: [],
    };
    const { template } = selectTemplate(curriculum, {
      grade: "test",
      selectedTopic: "integers",
      history,
      random: () => 0,
    });
    assert.ok(template);
    assert.ok(template.problem.trim());
  });

  it("recordSelection tracks format families", () => {
    let history = {
      recentTemplateIds: [],
      recentFormatFamilies: [],
      recentSkillIds: [],
    };
    const t = {
      id: "x",
      formatFamily: "fam",
      skillId: "s",
      problem: "p",
      topic: "integers",
    };
    history = recordSelection(history, t);
    assert.deepEqual(history.recentFormatFamilies, ["fam"]);
    assert.deepEqual(history.recentTemplateIds, ["x"]);
  });

  it("topic labels cover every canonical topic", () => {
    for (const key of Object.keys(TOPIC_LABELS)) {
      assert.ok(TOPIC_LABELS[key].length > 0);
    }
    assert.equal(TOPIC_LABELS.expressions_equations, "Expressions & Equations");
    assert.equal(TOPIC_LABELS.mixed_practice, "Mixed Practice");
  });
});
