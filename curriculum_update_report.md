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

## Review Fix Pass

### Files modified
- `5th.json`
- `6th.json`
- `7th.json`
- `8th.json`
- `mid5th.json`
- `mid6th.json`
- `mid7th.json`

### Template IDs modified
- `5th.json` `fas_003`
- `5th.json` `fas_004`
- `5th.json` `fas_008`
- `5th.json` `fas_011`
- `5th.json` `fmd_008`
- `mid5th.json` `fm_007`
- `6th.json` `rp_010`
- `6th.json` `eq_010`
- `mid6th.json` `rn_010`
- `mid6th.json` `rr_005`
- `mid6th.json` `pr_005`
- `mid6th.json` `ee_008`
- `mid6th.json` `cp_007`
- `mid6th.json` `ee_009`
- `7th.json` `rn_011`
- `7th.json` `ee_008`
- `mid7th.json` `pl_001`
- `mid7th.json` `pp_001`
- `8th.json` `sn_009`
- `8th.json` `sys_004`
- `8th.json` `sys_005`

### Defects corrected
- `fas_003`: numerator-only penalty; restore fraction answer
- `fas_004`: numerator-only penalty; possible negative remainder
- `fas_008`: numerator-only penalty
- `fas_011`: numerator-only penalty; how-much-greater must be positive
- `fmd_008`: numerator-only penalty; how-much-greater must be positive
- `fm_007`: numerator-only penalty; how-much-greater must be positive
- `rp_010`: corrupted ${...} placeholders
- `eq_010`: possible negative floor
- `rn_010`: numerator-only penalty; signed how-much-greater
- `rr_005`: corrupted ${...} placeholders; Enter |...| proxy answer
- `pr_005`: corrupted ${...} placeholders; Enter |...| proxy answer
- `ee_008`: possible negative length
- `cp_007`: how-much-greater could be negative
- `ee_009`: whole-ticket constraint only in note
- `rn_011`: numerator-only penalty
- `ee_008`: width validity only in constraints_note
- `pl_001`: story/formula mismatch
- `pp_001`: claimed right triangle without enforcing triples
- `sn_009`: messy non-integer standard form
- `sys_004`: invalid money/systems solutions possible from ranges alone
- `sys_005`: impossible mixture values possible from ranges alone

### Formulas corrected
- `fas_003` → `(a * d + c * b) / (b * d)`
- `fas_004` → `(a * d - c * b) / (b * d)`
- `fas_008` → `(a - c) / b`
- `fas_011` → `(a - c) / b`
- `fmd_008` → `(a * (c - d)) / b`
- `fm_007` → `((a * c + b) - (d * c + e)) / c`
- `rp_010` → `b / a`
- `eq_010` → `b - a`
- `rn_010` → `(a * d - c * b) / (b * d)`
- `rr_005` → `abs(b / a - d / c)`
- `pr_005` → `abs(b / a - d / c)`
- `ee_008` → `a / 2 - b`
- `cp_007` → `a - c`
- `ee_009` → `(c + b) / a`
- `rn_011` → `(a * d + c * b) / (b * d)`
- `ee_008` → `(p - 2 * a) / 6`
- `pl_001` → `(c - b) / a`
- `pp_001` → `a*a + b*b - c*c`
- `sn_009` → `(a / b) * pow(10, c - d)`
- `sys_004` → `(r - b * c) / (a - b)`
- `sys_005` → `c * (d - b) / (a - b)`

### Constraints corrected
- `fas_003` → `{'a': [1, 5], 'b': [2, 8], 'c': [1, 5], 'd': [2, 8]}`
- `fas_004` → `{'a': [5, 8], 'b': [4, 6], 'c': [1, 2], 'd': [7, 10]}`
- `fas_008` → `{'a': [5, 9], 'b': [6, 12], 'c': [1, 4]}`
- `fas_011` → `{'a': [5, 9], 'b': [2, 12], 'c': [1, 4]}`
- `fmd_008` → `{'a': [1, 3], 'b': [4, 8], 'c': [4, 8], 'd': [1, 3]}`
- `fm_007` → `{'a': [4, 6], 'b': [4, 7], 'c': [6, 8], 'd': [1, 2], 'e': [1, 3]}`
- `rp_010` → `{'a': [4, 12], 'b': [12, 48]}`
- `eq_010` → `{'a': [5, 20], 'b': [25, 60]}`
- `rn_010` → `{'a': [5, 9], 'b': [2, 4], 'c': [1, 2], 'd': [5, 9]}`
- `rr_005` → `{'a': [2, 8], 'b': [4, 24], 'c': [2, 8], 'd': [4, 24]}`
- `pr_005` → `{'a': [2, 8], 'b': [5, 24], 'c': [2, 8], 'd': [5, 24]}`
- `ee_008` → `{'a': [40, 80], 'b': [3, 15]}`
- `cp_007` → `{'a': [1, 8], 'b': [-8, 8], 'c': [-8, 0], 'd': [-8, 8]}`
- `rn_011` → `{'a': [1, 9], 'b': [2, 9], 'c': [1, 9], 'd': [2, 9]}`
- `ee_008` → `{'a': [2, 10], 'p': [48, 120]}`
- `pl_001` → `{'a': [1, 3], 'b': [20, 60], 'c': [80, 180]}`
- `pp_001` → `{'a': [3, 15], 'b': [4, 15], 'c': [5, 25]}`
- `sn_009` → `{'a': [2, 9], 'b': [1, 1], 'c': [4, 8], 'd': [1, 3]}`
- `sys_004` → `{'a': [10, 15], 'b': [4, 8], 'c': [20, 40], 'r': [200, 500]}`
- `sys_005` → `{'a': [10, 30], 'b': [50, 80], 'c': [10, 20], 'd': [35, 45]}`

### Validation
- Templates validated: 21
- Generated examples tested: 2100
- Total validation failures encountered during iteration: 0
- Confirmation: every modified template passed 100 generated test cases.
- Repository validation: zero errors, zero warnings.
