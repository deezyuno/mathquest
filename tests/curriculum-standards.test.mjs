import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(CUR, file), "utf8"));
}

function find(data, tid) {
  for (const skill of data.skills) {
    for (const t of skill.templates) {
      if (t.id === tid) return { ...t, skillId: skill.id };
    }
  }
  return undefined;
}

describe("CCSS coverage", () => {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(DATA, "ccss_leaf_standards.json"), "utf8")
  );
  const exemptions = JSON.parse(
    fs.readFileSync(path.join(ROOT, "curriculum-standard-exemptions.json"), "utf8")
  );
  const coverage = JSON.parse(
    fs.readFileSync(path.join(ROOT, "curriculum-standards-coverage.json"), "utf8")
  );
  const exempt = new Set(exemptions.map((e) => e.standard));

  it("every Grade 5–8 official standard is covered or explicitly exempted", () => {
    assert.equal(catalog.length, 107);
    for (const meta of catalog) {
      const row = coverage.find((r) => r.standard === meta.standard);
      assert.ok(row, `missing coverage row for ${meta.standard}`);
      if (exempt.has(meta.standard)) {
        assert.equal(meta.keypadFriendly, false);
        continue;
      }
      assert.notEqual(
        row.coverageStatus,
        "missing",
        `${meta.standard} missing and not exempted`
      );
      assert.ok(row.templateCount >= 1, `${meta.standard} needs templates`);
    }
  });

  it("exemptions include specific reasons", () => {
    assert.ok(exemptions.length >= 1);
    for (const e of exemptions) {
      assert.ok(e.reason && e.reason.length > 10, e.standard);
    }
  });

  it("audit report matches curriculum template counts", () => {
    const audit = JSON.parse(
      fs.readFileSync(path.join(ROOT, "curriculum-topic-audit.json"), "utf8")
    );
    for (const entry of audit) {
      const file =
        {
          "5th": "5th.json",
          "mid-5th": "mid5th.json",
          "6th": "6th.json",
          "mid-6th": "mid6th.json",
          "7th": "7th.json",
          "mid-7th": "mid7th.json",
          "8th": "8th.json",
        }[entry.grade];
      const data = load(file);
      const n = data.skills.reduce((a, s) => a + s.templates.length, 0);
      const audited = Object.values(entry.topics).reduce(
        (a, t) => a + t.templateCount,
        0
      );
      assert.equal(audited, n, `${entry.grade} audit mismatch`);
    }
  });
});

describe("mid-grade balance and OoO", () => {
  it("mid-6th contains Order of Operations with >=8 templates and >=5 families", () => {
    const mid6 = load("mid6th.json");
    const oo = flattenTemplates(mid6).filter(
      (t) => t.topic === "order_of_operations"
    );
    assert.ok(oo.length >= 8, `got ${oo.length}`);
    const fams = new Set(oo.map((t) => t.formatFamily));
    assert.ok(fams.size >= 5, `families ${fams.size}`);
    for (const t of oo) {
      assert.ok(!/when\s+[a-z]\s*=/i.test(t.problem));
    }
  });

  it("algebraic substitution is not classified as Order of Operations", () => {
    const mid6 = load("mid6th.json");
    assert.equal(find(mid6, "ee_012").topic, "expressions_equations");
    assert.equal(find(mid6, "ee_020").topic, "expressions_equations");
    const g6 = load("6th.json");
    assert.equal(find(g6, "exp_001").topic, "expressions_equations");
    assert.equal(find(g6, "exp_002").topic, "order_of_operations");
  });

  it("mid grades include adjacent-grade preview without dropping primary topics", () => {
    const mid5 = load("mid5th.json");
    const mid6 = load("mid6th.json");
    const mid7 = load("mid7th.json");
    const m5topics = new Set(flattenTemplates(mid5).map((t) => t.topic));
    const m6topics = new Set(flattenTemplates(mid6).map((t) => t.topic));
    const m7topics = new Set(flattenTemplates(mid7).map((t) => t.topic));
    assert.ok(m5topics.has("fractions"));
    assert.ok(m5topics.has("ratios_rates_proportions") || m5topics.has("integers"));
    assert.ok(m6topics.has("order_of_operations"));
    assert.ok(m6topics.has("ratios_rates_proportions"));
    assert.ok(m6topics.has("integers"));
    assert.ok(m7topics.has("ratios_rates_proportions"));
    assert.ok(m7topics.has("expressions_equations"));
  });
});

describe("template metadata integrity", () => {
  const files = [
    "5th.json",
    "mid5th.json",
    "6th.json",
    "mid6th.json",
    "7th.json",
    "mid7th.json",
    "8th.json",
  ];
  const allowedAnswers = new Set([
    "numeric",
    "fraction",
    "fraction_simplified",
    "decimal",
    "decimal_1dp",
    "mixed_number",
    "unit_rate",
  ]);
  const catalog = JSON.parse(
    fs.readFileSync(path.join(DATA, "ccss_leaf_standards.json"), "utf8")
  );
  const validStds = new Set(catalog.map((s) => s.standard));

  it("every template has valid topic, formatFamily, and ccss_standard", () => {
    for (const file of files) {
      const data = load(file);
      for (const skill of data.skills) {
        for (const t of skill.templates) {
          assert.ok(t.topic, `${file}/${t.id}`);
          assert.ok(t.formatFamily, `${file}/${t.id}`);
          assert.ok(t.ccss_standard, `${file}/${t.id}`);
          const codes = Array.isArray(t.ccss_standard)
            ? t.ccss_standard
            : [t.ccss_standard];
          for (const c of codes) assert.ok(validStds.has(c), `${t.id} ${c}`);
          assert.ok(allowedAnswers.has(t.answer_type), `${t.id} ${t.answer_type}`);
          assert.ok((t.problem || "").trim());
          assert.ok(t.answer_formula);
        }
      }
    }
  });

  it("no category-selection path returns undefined/blank", () => {
    for (const file of files) {
      const data = load(file);
      const flat = flattenTemplates(data);
      for (const topic of visibleTopicsForGrade(flat)) {
        const { template } = selectTemplate(data, {
          grade: data.grade,
          selectedTopic: topic,
          random: () => 0.3,
        });
        assert.ok(template);
        assert.ok(template.id);
        assert.ok((template.problem || "").trim());
        if (topic !== "mixed_practice") {
          assert.equal(template.topic, topic);
        }
      }
    }
  });

  it("topic filtering uses template.topic only", () => {
    const mid6 = load("mid6th.json");
    const oo = filterByTopic(flattenTemplates(mid6), "order_of_operations");
    assert.ok(oo.length >= 8);
    assert.ok(oo.every((t) => t.topic === "order_of_operations"));
  });
});
