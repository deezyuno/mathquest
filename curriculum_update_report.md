# Curriculum Update Report

- Branch: `curriculum-dedupe-and-variety`
- Backup folder: `c:/Users/Admin/Documents/mathquest/mathquest/curriculum_backup_before_dedupe`
- Files changed:
  - `curriculum/5th.json`
  - `curriculum/mid5th.json`
  - `curriculum/6th.json`
  - `curriculum/mid6th.json`
  - `curriculum/7th.json`
  - `curriculum/mid7th.json`
  - `curriculum/8th.json`
  - `curriculum_update_report.md`

## Aggregate counts

- Total templates reviewed: 535
- Templates rewritten (IDs with any template-field change): 239
- Exact duplicates removed: 44
- Near-duplicates replaced: 195
- Formulas corrected/updated: 181
- Constraints corrected/updated: 177
- Grade-level progression issues corrected: 42
- Validation errors remaining: 0

## Final validation summary

- JSON parse: PASS for all 7 curriculum files
- Duplicate IDs: PASS
- Exact duplicate problem text within file: PASS (`within_exact_extra=0`)
- Exact duplicate problem text across adjacent grades: PASS (`cross_adjacent_patterns=0`)
- Incompatible answer types for keypad: PASS (`incompatible_count=0`)
- Missing formulas: PASS (`missing_formula=0`)
- Variable/constraint consistency: PASS (`var_issue_rows=0`)
- Zero-divisor risks: PASS (`zero_divisor_risks=0`)

## Per-file concise summary

### 5th.json
- Replaced duplicate/near-duplicate stems across whole-number, fraction, geometry, coordinate, and measurement skills.
- Fixed critical decimal/fraction formulas (`dec_005`, `dec_006`, `dec_009`, `fmd_010`).
- Converted keypad-incompatible comparison/symbol/two-value templates to numeric outputs.
- Templates changed: 33

### mid5th.json
- Replaced cross-grade clones and within-file duplicate templates while preserving IDs.
- Corrected broken formulas (`fm_005`, `ms_002`, `ms_003`) and missing-variable constraints.
- Converted comparison templates to numeric outputs.
- Templates changed: 25

### 6th.json
- Replaced repeated equation/compute variants with distinct contexts and solution patterns.
- Fixed formula/constraint defects (including divisor safety and invalid references).
- Converted non-numeric keypad-incompatible templates to numeric outputs.
- Templates changed: 25

### mid6th.json
- Removed heavy overlap with 6th and within-file repeats while preserving skill intent.
- Fixed multiple critical formula/constraint issues (`ee_002`, `int_012`, `sp_010`, `sp_012`, division safeguards).
- Converted all incompatible answer types to numeric-compatible forms.
- Templates changed: 74

### 7th.json
- Replaced exact/near duplicate rational/proportional/equation stems with distinct numeric tasks.
- Corrected broken formulas/constraints (`rn_009`, `ee_008`, `geo_007`, `prob_003`, `prob_005`, `si_002`, `prob_010`).
- Upgraded repeated lower-grade carryover items.
- Templates changed: 22

### mid7th.json
- Removed exact duplicate percent templates and strengthened multi-step equation/composite geometry variety.
- Fixed placeholder/formula mismatches.
- Converted incompatible answer structures to numeric outputs.
- Templates changed: 30

### 8th.json
- Replaced exact/near duplicates across functions, systems, scientific notation, and geometry.
- Fixed missing constraints/formulas and converted comparison/two-value answers to numeric outputs.
- Strengthened distinction from mid-7th preview-style items.
- Templates changed: 30
