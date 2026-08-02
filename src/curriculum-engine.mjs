/**
 * Curriculum selection engine (JS runtime).
 * Runtime categorization uses ONLY template.topic.
 */
import { CURRICULUM_TOPICS, TOPIC_LABELS } from "./topic-labels.mjs";

const LOG_PREFIX = "[curriculum-engine]";

function log(...args) {
  console.warn(LOG_PREFIX, ...args);
}

export function flattenTemplates(curriculum) {
  const out = [];
  for (const skill of curriculum.skills ?? []) {
    for (const t of skill.templates ?? []) {
      out.push({
        ...t,
        skillId: skill.id,
        skillName: skill.name,
      });
    }
  }
  return out;
}

export function visibleTopicsForGrade(templates) {
  const present = new Set();
  for (const t of templates) {
    if (t.topic && t.topic !== "mixed_practice") present.add(t.topic);
  }
  return CURRICULUM_TOPICS.filter(
    (topic) => topic === "mixed_practice" || present.has(topic)
  );
}

export function filterByTopic(templates, selectedTopic) {
  if (selectedTopic === "mixed_practice") {
    return templates.filter((t) => (t.problem || "").trim().length > 0);
  }
  return templates.filter(
    (t) => t.topic === selectedTopic && (t.problem || "").trim().length > 0
  );
}

function countRecent(family, recent, window) {
  return recent.slice(-window).filter((f) => f === family).length;
}

function consecutiveTail(family, recent) {
  let n = 0;
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i] === family) n++;
    else break;
  }
  return n;
}

function leastRecentlyUsedScore(family, recent) {
  const idx = recent.lastIndexOf(family);
  if (idx === -1) return Number.POSITIVE_INFINITY;
  return recent.length - 1 - idx;
}

export function applyFormatFamilyDiversity(candidates, recentFormatFamilies) {
  const uniqueFamilies = new Set(candidates.map((c) => c.formatFamily));
  if (uniqueFamilies.size <= 1) {
    if (uniqueFamilies.size === 1) {
      log("topic contains only one formatFamily; diversity restriction skipped", {
        formatFamily: [...uniqueFamilies][0],
        candidateCount: candidates.length,
      });
    }
    return candidates;
  }

  return candidates.filter((c) => {
    const family = c.formatFamily;
    if (consecutiveTail(family, recentFormatFamilies) >= 2) return false;
    if (countRecent(family, recentFormatFamilies, 5) >= 2) return false;
    return true;
  });
}

function preferLeastRecentFamily(candidates, recentFormatFamilies) {
  const families = [...new Set(candidates.map((c) => c.formatFamily))];
  if (families.length <= 1) return candidates;
  let best = -1;
  const scores = new Map();
  for (const f of families) {
    const score = leastRecentlyUsedScore(f, recentFormatFamilies);
    scores.set(f, score);
    if (score > best) best = score;
  }
  const preferred = candidates.filter((c) => scores.get(c.formatFamily) === best);
  return preferred.length > 0 ? preferred : candidates;
}

function pickRandom(items, random) {
  const i = Math.floor(random() * items.length);
  return items[Math.max(0, Math.min(items.length - 1, i))];
}

export function selectTemplate(curriculum, options) {
  const random = options.random ?? Math.random;
  const recentTemplateWindow = options.recentTemplateWindow ?? 8;
  const recentSkillWindow = options.recentSkillWindow ?? 3;
  const history = options.history ?? {
    recentTemplateIds: [],
    recentFormatFamilies: [],
    recentSkillIds: [],
  };

  const all = flattenTemplates(curriculum);
  const availableTopics = [...new Set(all.map((t) => t.topic).filter(Boolean))];

  const pool = filterByTopic(all, options.selectedTopic);
  const availableTemplateIds = pool.map((t) => t.id);

  if (pool.length === 0) {
    const diagnostic = {
      grade: options.grade,
      selectedTopic: options.selectedTopic,
      availableTopics,
      availableTemplateIds,
      rejectedTemplateIds: all.map((t) => t.id),
      recentTemplateIds: history.recentTemplateIds,
      recentFormatFamilies: history.recentFormatFamilies,
    };
    log("eligibleTemplates.length === 0", diagnostic);
    throw new Error(
      `${LOG_PREFIX} no eligible templates for topic=${options.selectedTopic} grade=${options.grade}`
    );
  }

  const recentIds = new Set(
    history.recentTemplateIds.slice(-recentTemplateWindow)
  );
  const recentSkills = new Set(history.recentSkillIds.slice(-recentSkillWindow));

  let rejected = [];
  let candidates = pool.filter((t) => {
    if (recentIds.has(t.id)) {
      rejected.push(t.id);
      return false;
    }
    return true;
  });
  if (candidates.length === 0) {
    log("all topic templates recently used; relaxing template-id window");
    candidates = [...pool];
    rejected = [];
  }

  const skillFiltered = candidates.filter((t) => !recentSkills.has(t.skillId));
  if (skillFiltered.length > 0) candidates = skillFiltered;

  let relaxedDiversity = false;
  let diverse = applyFormatFamilyDiversity(
    candidates,
    history.recentFormatFamilies
  );
  if (diverse.length === 0) {
    log("format-family diversity removed every candidate; relaxing diversity only", {
      grade: options.grade,
      selectedTopic: options.selectedTopic,
      availableTopics,
      availableTemplateIds: candidates.map((t) => t.id),
      rejectedTemplateIds: rejected,
      recentTemplateIds: history.recentTemplateIds,
      recentFormatFamilies: history.recentFormatFamilies,
    });
    diverse = candidates;
    relaxedDiversity = true;
  }

  const preferred = preferLeastRecentFamily(
    diverse,
    history.recentFormatFamilies
  );
  const template = pickRandom(preferred, random);

  if (!template || !(template.problem || "").trim()) {
    log("selected template missing or blank prompt", {
      grade: options.grade,
      selectedTopic: options.selectedTopic,
      availableTopics,
      availableTemplateIds,
      rejectedTemplateIds: rejected,
      recentTemplateIds: history.recentTemplateIds,
      recentFormatFamilies: history.recentFormatFamilies,
    });
    throw new Error(`${LOG_PREFIX} blank or undefined template after selection`);
  }

  return { template, relaxedDiversity };
}

export function recordSelection(
  history,
  template,
  limits = { templates: 12, families: 12, skills: 8 }
) {
  return {
    recentTemplateIds: [...history.recentTemplateIds, template.id].slice(
      -limits.templates
    ),
    recentFormatFamilies: [
      ...history.recentFormatFamilies,
      template.formatFamily,
    ].slice(-limits.families),
    recentSkillIds: [...history.recentSkillIds, template.skillId].slice(
      -limits.skills
    ),
  };
}

export function topicLabel(topic) {
  return TOPIC_LABELS[topic];
}

export function assertTemplateMetadata(t) {
  if (!t.topic) throw new Error(`${LOG_PREFIX} template ${t.id} missing topic`);
  if (!t.formatFamily) {
    throw new Error(`${LOG_PREFIX} template ${t.id} missing formatFamily`);
  }
  if (!(t.problem || "").trim()) {
    throw new Error(`${LOG_PREFIX} template ${t.id} has blank problem`);
  }
}
