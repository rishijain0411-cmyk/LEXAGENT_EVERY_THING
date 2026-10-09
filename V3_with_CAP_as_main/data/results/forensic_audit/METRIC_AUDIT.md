# Metric audit

All reported benchmark numbers are produced by `evaluate_single_case` in
`experiments/run_25_cases_benchmark.py` (lines 83–193) and averaged over cases. The modules in
`src/evaluation/` are not used by the benchmark, baseline or ablation runners.

Notation: `C` = set of distinct case names in `prosecutor_citations ∪ defense_citations ∪
judge_verified_citations` of the **final state** (final round only; earlier rounds are overwritten).
For the baseline `C` is the citation list of its single answer.

| Metric | Exact definition in code | What it actually measures | Verdict |
|---|---|---|---|
| Fabricated-name rate / hallucination rate (`hr`) | share of names in `C` whose best `fuzz.ratio` against the 313,611 known names is < 85 | string mismatch between a cited name **as written** and the catalog | **Over- and under-counts.** A real case written with a year or cite fails: 4 of the 6 names flagged across both systems are real decisions written with extra text (all 3 of the baseline's, 1 of the debate's); the other 2, both from the debate, are not reported decisions. An invented name close to a real one passes. Unaffected by the citation checker. |
| `cfr` / `oor` | `hr` split by a hard-coded list of 19 landmark names (`known_scotus_registry`) | whether a flagged name resembles one of 19 names | Not meaningful on a 593-volume corpus; `oor` is 0 by construction. |
| Authority recall (`ar`) | 1 if any name in `C` has `fuzz.ratio ≥ 80` with the single `target_case`, else 0 | whether the one target decision was cited by anyone in the final round | Sound as "target cited". A debate skipped by the cache has `C = ∅`, so `ar = 0`. |
| Authority precision (`ap`) | `ar / |C|` — verified identical on all 192 scorecards | 1 ÷ number of citations when the target is cited | **Not a precision of relevant authorities.** Every additional citation lowers it, including correct and relevant ones. |
| Answer similarity (`ass`, saved also as `cas`) | cosine of Legal-BERT embeddings of `final_answer[:500]` and `ground_truth_holding[:500]` | closeness in Legal-BERT space | **Cannot distinguish a right answer from an answer to another question** (below). |
| Misattribution rate (`mar`) | share of entries in the final-round citation-check report with tier `MISATTRIBUTED` | how often the checker *said* misattributed | It is the checker's opinion, and the checker labels 69 of 96 correct citations `MISATTRIBUTED`. Not a rate of real misattribution. |
| Holding-attribution accuracy (`haa`) | share of entries in that report with tier `SUPPORTED` | the checker's acceptance rate | Misnamed: no ground truth enters. |
| Unsupported-claim rate (`ucr`) | `len(structured_output.rejected_citations) / (|C| + that length)` | how many citations the judge model *listed* as rejected | Self-reported by the LLM; independent of the programmatic rejections. |
| Debate convergence (`dcr_status`) | `CONVERGED` if the defense conceded or confidence ≥ 0.70 | whether the final round had a `SUPPORTED` citation the judge named | Restates the confidence formula. |
| `debate_rounds` | `debate_round + 1` | rounds, except: a skipped debate reports 1 | "1 round" in the benchmark file means "no debate". |
| `judge_confidence` | see `CODE_AUDIT.md` B | formula over checker tiers; 0.0 for a skipped debate; constant 0.70 for the baseline | Not comparable across systems. |

## Authority precision is a function of citation count

| System | Citations in the answer | Answers | Target cited (AR) | AP |
|---|---|---|---|---|
| Baseline | 0 | 13 | 0.00 | 0.00 |
| Baseline | 1 | 50 | 0.68 | 0.68 |
| Baseline | 2 | 31 | 0.71 | 0.35 |
| Baseline | 3 | 2 | 0.50 | 0.17 |
| LexAgent | 0 (skipped debates) | 34 | 0.00 | 0.00 |
| LexAgent | 1 | 2 | 1.00 | 1.00 |
| LexAgent | 2 | 25 | 0.84 | 0.42 |
| LexAgent | 3 | 21 | 0.76 | 0.25 |
| LexAgent | 4 or more | 14 | 0.79 | 0.19 |

At every citation count above zero the debate cites the target at least as often as the baseline, and
its AP is lower only because it cites more. The debate pools the prosecutor's and the defense's
citations, and the defense is instructed to bring counter-authority; the baseline is one agent asked
for "relevant case names". The headline "21.4% against 47.2%" compares citation counts, not precision.

## Answer similarity has a floor of 0.88 and cannot see wrong-question answers

Legal-BERT cosine on the same 96 reference holdings (`diagnostics.json → answer_similarity_metric`):

| "Answer" scored against the reference holding | Mean | Median |
|---|---|---|
| The reference holding of a **different** case | 0.876 | 0.882 |
| The fixed sentence "Insufficient evidence for a verified answer." | 0.802 | 0.804 |
| **The question itself** | 0.931 | 0.935 |
| LexAgent, skipped debates (answer written for another question), n = 34 | 0.909 | 0.919 |
| LexAgent, debated cases, n = 62 | 0.921 | 0.927 |
| Baseline, all cases | 0.940 | 0.944 |

- The whole scale in use runs from about 0.88 (unrelated legal text) to 1.0. The reported gap between
  the systems (0.023) is one fifth of that range.
- Repeating the question scores 0.931, above the debate's 0.916 and near the baseline's 0.940. A short
  direct answer that reuses the question's vocabulary is rewarded.
- An answer written for a different question scores 0.909 on average, 0.012 below a debated answer. In
  case #23 (*Kyllo*, thermal imaging) the debate system returned a cached answer written for another
  question and scored 0.952, higher than the baseline's 0.946 on the same case.
- The metric is statistically stable (the gap is significant) and semantically uninformative. It must
  not be read as answer correctness.

## Fabricated-name rate is a handful of events

Benchmark run: 3 flagged names among 172 citations. Baseline: 3 among 118. Ablation runs: between 0 and
3 flagged names each. Per-case rates are 0 for 93 of 96 cases and 1/2 or 1/3 for the others; the mean
moves by 0.5 percentage points per flagged name. See `STATISTICAL_VALIDATION.md` for why no difference
in this metric is distinguishable from noise.

## What the current metrics do not measure

1. Whether the **final answer is legally correct**.
2. Whether a cited case **exists** (as opposed to matching a string).
3. Whether a cited case is **relevant** to the question (only one target per question is known).
4. Whether the **holding attributed** to a citation is correct, by anything other than the checker under test.
5. Whether a claim in the answer is **unsupported**.
6. Whether the answer was **produced for this question** (no cache-hit flag is saved).
