#!/usr/bin/env node
/**
 * Generate curriculum-topic-audit.json from current curriculum files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CUR = path.join(__dirname, "..", "curriculum");
const OUT = path.join(__dirname, "..", "curriculum-topic-audit.json");
const AMBIG = path.join(__dirname, "..", "curriculum-ambiguous-classifications.json");

const FILES = [
  "5th.json",
  "mid5th.json",
  "6th.json",
  "mid6th.json",
  "7th.json",
  "mid7th.json",
  "8th.json",
];

let ambiguous = [];
if (fs.existsSync(AMBIG)) {
  ambiguous = JSON.parse(fs.readFileSync(AMBIG, "utf8"));
}

const report = [];
for (const file of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(CUR, file), "utf8"));
  const topics = {};
  for (const skill of data.skills) {
    for (const t of skill.templates) {
      const topic = t.topic;
      if (!topics[topic]) {
        topics[topic] = {
          templateCount: 0,
          formatFamilyCount: 0,
          templateIds: [],
          formatFamilies: {},
        };
      }
      const b = topics[topic];
      b.templateCount += 1;
      b.templateIds.push(t.id);
      b.formatFamilies[t.formatFamily] =
        (b.formatFamilies[t.formatFamily] || 0) + 1;
    }
  }
  for (const b of Object.values(topics)) {
    b.formatFamilyCount = Object.keys(b.formatFamilies).length;
  }
  const low = Object.entries(topics)
    .filter(([, b]) => b.formatFamilyCount < 3)
    .map(([k]) => k);
  report.push({
    grade: data.grade,
    topics,
    topicsWithFewerThanThreeFormatFamilies: low,
    mixedPracticeTemplateIds: topics.mixed_practice?.templateIds || [],
    ambiguousClassifications: ambiguous.filter((a) => a.grade === data.grade),
  });
}

fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log("Wrote", OUT);
