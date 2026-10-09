# Representative cases

All from existing outputs; nothing was re-run. Three kinds of evidence are available per case, and they come
from **different runs** of the same configuration:

- **Benchmark scorecard** (benchmark run): recall, precision, similarity, confidence, citation count. No text.
- **Ablation log, Full variant** and **A3 variant**: per round, how many citations were checked and how many
  were supported; controller decisions; names the judge was barred from using; cache hits. No text.
- **UI transcript** (`ui/sample_transcript.json`): the only debate whose full trace was saved.

Round notation: `(citations checked, supported, mean CCS)`. Retrieval rank is the rank of the target opinion
among the passages for the plain question (recomputed; "—" = not among the 8).

---

## 1. Fully traced debate: verified in round 1, lost by round 3 (UI transcript)

**Question** — May law enforcement search the digital contents of a cell phone seized from an arrestee without a warrant? (target *Riley v. California*)

| Stage | What happened |
|---|---|
| Round 1, citation check | *Riley v. California* **SUPPORTED** (0.80), *Chimel v. California* SUPPORTED (0.93); defense: *Riley* UNCERTAIN (0.63), *Chambers v. Maroney* UNCERTAIN (0.53) |
| Round 1, controller | CONTINUE — "Defense challenge_strength=0.75 with 1 gaps" (a correct, supported answer was already in hand) |
| Round 2, citation check | *Riley* now **MISATTRIBUTED** (0.10) — same case, holding re-worded; *Paulino v. United States* SUPPORTED (0.98) |
| Round 2, controller | CONTINUE — "avg_CCS=0.38, min_CCS=0.06 with 1 unresolved gap" |
| Round 3, citation check | *Carpenter* MISATTRIBUTED (0.03), *Riley* MISATTRIBUTED (0.01); defense: *Doyle v. Ohio* SUPPORTED, *Chambers v. Maroney* SUPPORTED |
| Round 3, controller | TERMINATE — maximum rounds |
| Judge | saw only the round-3 report; wrote that *Riley* "has a low CCS score, indicating potential misattribution". Verified citations: none. **Confidence 0.00** |
| Final answer | correct in substance ("*Riley* … establishes that a search incident to an arrest does not extend to … a cell phone") |

Shows: the controller continuing with a verified answer in hand; round 1's verification discarded; the same
citation flipping from supported to misattributed with the wording of the holding; a correct answer reported
with zero confidence.

## 2. Debate wins: target cited although retrieval missed it — #5 *Gideon v. Wainwright*

| | Debate (benchmark run) | Baseline |
|---|---|---|
| Target retrieved (rank) | — | — |
| Citations / target cited | 4 / **yes** | 1 / no |
| Confidence | 0.95 | (constant) |
| Answer similarity | 0.929 | 0.901 |
| Authority precision | 0.25 | 0.00 |

Same case in the ablation Full run: rounds (3, 2, 0.57) → (4, 0, 0.27) → (4, 1, 0.35); the judge named
*Gideon v. Wainwright* and was barred from using it. In A3: (2, 0, 0.06) → (3, 2, 0.65) → (4, 2, 0.48).
The debate reaches the right authority without round-one retrieval; its precision is 0.25 only because four
cases were cited; and whether the judge may rely on *Gideon* varies from run to run.

## 3. Debate wins — #6 *Brady v. Maryland*

Target at rank 8 for the debate, rank 7 (outside the 4-passage prompt) for the baseline. Debate: 4 citations,
target cited, confidence 0.82. Baseline: 1 citation, not the target. Ablation Full: (4, 2, 0.46) → (3, 1, 0.30)
→ (4, 3, 0.68), verdict stored. The larger evidence budget, not the debate as such, may explain this win.

## 4. Baseline wins because the debate never ran — #8 *Strickland v. Washington*

| | Debate (benchmark run) | Baseline |
|---|---|---|
| Target retrieved (rank) | 4 | 4 (in prompt) |
| What happened | **cache hit: debate skipped** | answered, cited *Strickland* |
| Citations / confidence | 0 / 0.00 | 1 |
| Authority recall / precision | 0 / 0 | 1 / 1.00 |
| Answer similarity | 0.849 (answer written for another question) | 0.967 |

In the ablation Full run the same question *was* debated: (3, 2, 0.63) → (4, 2, 0.52) → (3, 1, 0.38), verdict
stored. One of the 12 cases skipped in one run and debated in the other.

## 5. Baseline wins because the debate never ran — #10 *Carpenter v. United States*

Target at rank 1. Benchmark run: skipped by the cache (0 citations, confidence 0.00, similarity 0.941); baseline
cites *Carpenter* (precision 1.00, similarity 0.959). Ablation Full, debated: (3, 1, 0.62) → (2, 0, 0.12) →
(3, 1, 0.55); the judge named *Carpenter v. United States* and was barred from using it.

## 6. A cached answer for another question scores above a correct answer — #23 *Kyllo v. United States*

Target at rank 1. Benchmark run: skipped; the returned text was written for an earlier question. In the
ablation Full run the hit is logged at distance 0.057 and traced to question #13 (public-telephone privacy,
*Katz*). Scorecard: no citation, confidence 0.00, **answer similarity 0.952**. Baseline: cites *Kyllo*,
answer similarity 0.946. The similarity metric ranks the wrong-question answer above the baseline's.

## 7. The only debated case the baseline wins on recall — #62 *Planned Parenthood v. Casey*

Target not retrieved for the debate's first round (baseline list rank 7, outside its prompt). Debate: 4
citations, none is the target, all checked citations misattributed (MAR 1.0), confidence 0.00, similarity 0.938.
Baseline: cites *Casey* from its own knowledge (1 citation), similarity 0.898. Of 62 debated cases this is the
single one where only the baseline cites the target; the reverse holds in 19.

## 8. Citation false rejections (stress test, correct citation labelled MISATTRIBUTED)

| Citation with its reference holding | Support | Best window anywhere in the opinion |
|---|---|---|
| *Gideon v. Wainwright* | 0.025 | 0.023 — no passage entails it |
| *United States v. Jacobsen* | 0.008 | 0.216 |
| *Carpenter v. United States* | 0.066 | 0.833 in passage 87 of 99, not among the 3 read |
| *Miller v. Alabama* | 0.012 | 0.987 in passage 1 of 48, not read |

69 of 96 correct citations are rejected this way.

## 9. Citation false acceptances (stress test, swapped holding labelled SUPPORTED)

*Furman v. Georgia* 0.971, *Meritor Savings Bank v. Vinson* 0.931, *Katz v. United States* 0.883, *Loving v.
Virginia* 0.797, *Batson v. Kentucky* 0.729 — each paired with the holding of a different benchmark case and
accepted. 5 of 96.

## 10. Memory tells the agents to avoid the right case — #12 *Miller v. Alabama*

Ablation Full: the avoid list handed to the prosecutor and the defense for this question was `Hiibel v. Sixth
Judicial District Court`, `Argersinger v. Hamlin`, `Elkins v. United States`, `Ring v. Arizona`, **`Miller v.
Alabama`** — five real cases, one of them the target decision of this very question. Rounds:
(3, 1, 0.32) → (4, 2, 0.44) → (2, 0, 0.09); the judge was barred from *Graham v. Florida*; no verdict stored.
In A3 (no memory) the same question went (3, 1, 0.33) → (3, 2, 0.85) → (4, 3, 0.85). Benchmark run: 3 citations,
target not cited, confidence 0.20. One case; suggestive, not proof of an effect.

## 11. Rounds destroy a verified state — #1 *United States v. Jacobsen*

Ablation Full: (2, **1**, 0.49) → CONTINUE → (3, 1, 0.38) → CONTINUE → (2, **0**, 0.03) → TERMINATE; the judge
was barred from *United States v. Chadwick*; no verdict stored. Round 1 had a supported citation; the final
round had none. This pattern occurs in 17 of 66 debates of that run and 28 of 96 in A3.

## 12. Correct authority, low confidence — #7 *Mapp v. Ohio*

Target not retrieved in round one. Debate (benchmark run): 4 citations, **target cited**, confidence 0.20.
Baseline: no citation at all. Ablation Full: (3, 0, 0.02) → (3, 0, 0.19) → (2, 0, 0.09): the checker supported
nothing in any round (the reference holding of *Mapp* scores 0.03 in the stress test and 0.045 at best anywhere
in the opinion). 21 of the 26 low-confidence debated cases of the benchmark run had cited the target.

---

## What the cases show together

| Mechanism | Cases |
|---|---|
| Debate skipped by a verdict-cache collision | 4, 5, 6 |
| Verified citation lost between rounds; controller continues regardless | 1, 11 |
| Judge barred from the correct authority by a checker false negative | 1, 2, 5, 12 |
| Authority precision punished for citing more | 2, 3 |
| Answer similarity blind to wrong-question answers | 6 |
| Checker false rejection / false acceptance | 8, 9 |
| Avoid list naming the target | 10 |
| Outcome differs between runs of the same configuration | 2, 4, 5 |
| A genuine debate loss | 7 |
