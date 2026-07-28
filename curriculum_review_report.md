# Curriculum Review Report
Primary reference: [Common Core State Standards for Mathematics](https://www.thecorestandards.org/Math/)
Working outputs: `*_updated.json` (original curriculum JSON files unchanged).

## Final summary

- Templates reviewed: 535
- Templates modified: 15
- Mathematical fixes: 6
- Wording improvements: 4
- CCSS corrections: 9
- Remaining MEDIUM issues: 2
- Remaining LOW issues: 3
- Remaining HIGH open (should be 0): 0
- Validation errors: 0
- Schema parity with originals: PASS

### Letter grade by file

| File | Grade | Templates | Modified | MEDIUM | LOW |
|------|-------|----------:|---------:|-------:|----:|
| `5th_updated.json` | **A** | 79 | 6 | 1 | 0 |
| `mid5th_updated.json` | **A** | 49 | 0 | 0 | 0 |
| `6th_updated.json` | **A** | 80 | 0 | 0 | 1 |
| `mid6th_updated.json` | **A** | 138 | 6 | 1 | 2 |
| `7th_updated.json` | **A** | 68 | 0 | 0 | 0 |
| `mid7th_updated.json` | **A** | 56 | 2 | 0 | 0 |
| `8th_updated.json` | **A** | 65 | 1 | 0 | 0 |

## Confidence & category rules
- HIGH: clear CCSS/math violation — fix/rewrite content; keep ID, skill, CCSS, type, schema.
- MEDIUM / LOW: document only; do not modify.
- Never move templates, change CCSS fields, rename skills, add/remove templates, or alter schema.

## Fixed HIGH issues

### Issue 1

File: `5th_updated.json`

Template ID: `gv_003`

Skill: `geometry_volume`

Assigned CCSS: `5.MD.C.3, 5.MD.C.4, 5.MD.C.5, 5.G.B.3`

Confidence: HIGH

Category: Wrong Skill

Reason:

Map-scale distance item did not assess 5.MD.C volume. Assigned CCSS: 5.MD.C.3–5 / 5.G.B.3. Former content aligned to 7.G.A.1.

Recommendation:

Rewrote as storage-box volume (L×W×H).

Status: FIXED

### Issue 2

File: `5th_updated.json`

Template ID: `gv_006`

Skill: `geometry_volume`

Assigned CCSS: `5.MD.C.3, 5.MD.C.4, 5.MD.C.5, 5.G.B.3`

Confidence: HIGH

Category: Wrong Skill

Reason:

Square perimeter is not 5.MD.C volume. Assigned CCSS: 5.MD.C.3–5 / 5.G.B.3. Former content ~3.MD/4.MD perimeter.

Recommendation:

Rewrote as cube volume a³.

Status: FIXED

### Issue 3

File: `5th_updated.json`

Template ID: `gv_007`

Skill: `geometry_volume`

Assigned CCSS: `5.MD.C.3, 5.MD.C.4, 5.MD.C.5, 5.G.B.3`

Confidence: HIGH

Category: Wrong Skill

Reason:

Triangle angle-sum is not 5.MD.C volume (belongs with 4.MD.C / 7.G.B.5). Assigned CCSS: 5.MD.C.3–5 / 5.G.B.3.

Recommendation:

Rewrote as V = B × h for a rectangular prism.

Status: FIXED

### Issue 4

File: `5th_updated.json`

Template ID: `gv_009`

Skill: `geometry_volume`

Assigned CCSS: `5.MD.C.3, 5.MD.C.4, 5.MD.C.5, 5.G.B.3`

Confidence: HIGH

Category: Wrong Skill

Reason:

Rectangle perimeter is not 5.MD.C volume. Assigned CCSS: 5.MD.C.3–5 / 5.G.B.3. Former content ~3–4.MD perimeter.

Recommendation:

Rewrote as rectangular-prism volume L×W×H.

Status: FIXED

### Issue 5

File: `mid6th_updated.json`

Template ID: `ee_004`

Skill: `expressions_and_equations`

Assigned CCSS: `6.EE.A.1, 6.EE.A.2, 6.EE.B.5, 6.EE.B.7`

Confidence: HIGH

Category: Above Grade Level

Reason:

Two-step ax+b=c exceeds 6.EE.B.7 (one-step px=q / x+p=q); is 7.EE.B.4.

Recommendation:

Rewrote as one-step {a}x = {c}.

Status: FIXED

### Issue 6

File: `mid6th_updated.json`

Template ID: `ee_006`

Skill: `expressions_and_equations`

Assigned CCSS: `6.EE.A.1, 6.EE.A.2, 6.EE.B.5, 6.EE.B.7`

Confidence: HIGH

Category: Above Grade Level

Reason:

Two-step ax−b=c is 7.EE.B.4, not 6.EE.B.7.

Recommendation:

Rewrote as one-step x − {b} = {c}.

Status: FIXED

### Issue 7

File: `mid6th_updated.json`

Template ID: `ee_009`

Skill: `expressions_and_equations`

Assigned CCSS: `6.EE.A.1, 6.EE.A.2, 6.EE.B.5, 6.EE.B.7`

Confidence: HIGH

Category: Above Grade Level

Reason:

Ticket story forced two-step ax−b=c (7.EE.B.4) under 6.EE.B.7.

Recommendation:

Rewrote as one-step unit-price × quantity = total.

Status: FIXED

### Issue 8

File: `mid6th_updated.json`

Template ID: `ee_010`

Skill: `expressions_and_equations`

Assigned CCSS: `6.EE.A.1, 6.EE.A.2, 6.EE.B.5, 6.EE.B.7`

Confidence: HIGH

Category: Above Grade Level

Reason:

Error analysis of two-step ax+b=c is 7.EE.B.4 content under 6.EE.B.7.

Recommendation:

Rewrote as one-step x+p=q error analysis (wrong subtraction order).

Status: FIXED

### Issue 9

File: `mid6th_updated.json`

Template ID: `ee_014`

Skill: `expressions_and_equations`

Assigned CCSS: `6.EE.A.1, 6.EE.A.2, 6.EE.B.5, 6.EE.B.7`

Confidence: HIGH

Category: Above Grade Level

Reason:

Membership story used ax+b=c (7.EE.B.4) under 6.EE.B.7.

Recommendation:

Rewrote as one-step monthly rate × months = total.

Status: FIXED

### Issue 10

File: `mid6th_updated.json`

Template ID: `cp_007`

Skill: `coordinate_plane`

Assigned CCSS: `6.NS.C.6, 6.NS.C.8`

Confidence: HIGH

Category: Pedagogical Concern

Reason:

How-much-greater question used a signed difference that can be negative.

Recommendation:

Wrapped difference in abs().

Status: FIXED

### Issue 11

File: `5th_updated.json`

Template ID: `pv_001`

Skill: `place_value_and_powers`

Assigned CCSS: `5.NBT.A.1, 5.NBT.A.2, 5.NBT.A.3`

Confidence: HIGH

Category: Pedagogical Concern

Reason:

answer_formula used 10^b. In JS-style evaluators ^ is bitwise XOR, not exponentiation; peer templates already use pow(10, b).

Recommendation:

Changed formula to a * pow(10, b).

Status: FIXED

### Issue 12

File: `5th_updated.json`

Template ID: `pv_002`

Skill: `place_value_and_powers`

Assigned CCSS: `5.NBT.A.1, 5.NBT.A.2, 5.NBT.A.3`

Confidence: HIGH

Category: Pedagogical Concern

Reason:

answer_formula used 10^b (XOR risk). Assigned CCSS 5.NBT.A.2 expects correct powers-of-ten scaling.

Recommendation:

Changed formula to a / pow(10, b).

Status: FIXED

### Issue 13

File: `mid7th_updated.json`

Template ID: `pc_002`

Skill: `probability_compound`

Assigned CCSS: `7.SP.C.8`

Confidence: HIGH

Category: Pedagogical Concern

Reason:

(a/(a+b))^2 used ^ (XOR risk) and returned a float poorly suited to fraction_simplified answers.

Recommendation:

Changed formula to (a*a)/((a+b)*(a+b)).

Status: FIXED

### Issue 14

File: `mid7th_updated.json`

Template ID: `pc_004`

Skill: `probability_compound`

Assigned CCSS: `7.SP.C.8`

Confidence: HIGH

Category: Pedagogical Concern

Reason:

(a/100)^2 used ^ (XOR risk) for independent-event probability.

Recommendation:

Changed formula to pow(a/100, 2).

Status: FIXED

### Issue 15

File: `8th_updated.json`

Template ID: `pt_005`

Skill: `pythagorean_theorem`

Assigned CCSS: `8.G.B.7, 8.G.B.8`

Confidence: HIGH

Category: Pedagogical Concern

Reason:

Distance formula used (c-a)^2 with ^ (XOR risk).

Recommendation:

Changed formula to sqrt(pow(c-a, 2)+pow(d-b, 2)).

Status: FIXED

## Remaining MEDIUM issues

### Issue M1

File: `mid6th_updated.json`

Template ID: `ee_012`

Skill: `expressions_and_equations`

Assigned CCSS: `6.EE.A.1, 6.EE.A.2, 6.EE.B.5, 6.EE.B.7`

Confidence: MEDIUM

Category: Above Grade Level

Reason:

Evaluates a·x² with a note that x² means x·x. 6.EE.A.1 covers whole-number exponents, but the template’s ccss_preview tags 7.EE.A and squares are less typical for mid-6 equation focus.

Recommendation:

Human review: keep as 6.EE.A.1 exponent intro, or swap to linear expression evaluation.

Status: DOCUMENTED

### Issue M2

File: `5th_updated.json`

Template ID: `gv_001`

Skill: `geometry_volume`

Assigned CCSS: `5.MD.C.3, 5.MD.C.4, 5.MD.C.5, 5.G.B.3`

Confidence: MEDIUM

Category: CCSS Mismatch

Reason:

Skill CCSS string includes 5.G.B.3 (2-D figure hierarchy), but templates assess volume packing (5.MD.C). Items are fine for 5.MD.C; the bundled 5.G.B.3 tag is unused. CCSS field must not be changed per rules.

Recommendation:

Human decision later: split skills or add a hierarchy item; do not auto-edit CCSS.

Status: DOCUMENTED

## Remaining LOW issues

### Issue L1

File: `6th_updated.json`

Template ID: `int_007`

Skill: `integer_operations`

Assigned CCSS: `6.NS.C.5, 6.NS.C.6`

Confidence: LOW

Category: Pedagogical Concern

Reason:

Descent rate × hours with formula -a*b applies a signed product. 6.NS.C.5–6 emphasize understanding/ordering negatives; signed multiplication is typically 7.NS.A.2.

Recommendation:

Optional: ask for meters descended as a positive total (a*b), or keep signed change after human review.

Status: DOCUMENTED

### Issue L2

File: `mid6th_updated.json`

Template ID: `int_005`

Skill: `integer_operations`

Assigned CCSS: `6.NS.C.5, 6.NS.C.6`

Confidence: LOW

Category: Pedagogical Concern

Reason:

Debt write-off as -a*b is signed multiplication; borderline between 6.NS.C.5 direction language and 7.NS.A.2.

Recommendation:

Human review only; do not auto-edit.

Status: DOCUMENTED

### Issue L3

File: `mid6th_updated.json`

Template ID: `int_006`

Skill: `integer_operations`

Assigned CCSS: `6.NS.C.5, 6.NS.C.6`

Confidence: LOW

Category: Pedagogical Concern

Reason:

Temperature drop × hours with -a*b is the same signed-product borderline case.

Recommendation:

Human review only; do not auto-edit.

Status: DOCUMENTED

## Validation

All `*_updated.json` files parse as JSON. Every template retains `id`, `type`, `problem`, `constraints`, `answer_type`, `answer_formula`. Template IDs, skill IDs, skill CCSS strings, and per-template key sets match the originals. No templates were added or removed. No `^` exponent operators remain in answer formulas.

Formula sampling (pow/abs/sqrt-safe eval): no systematic failures.
