# Code audit

Scope: code inspection only. Every statement names the file and function it rests on. Numbers quoted
here come from `analysis_existing_results.json` and `diagnostics.json` in this folder; no experiment
was re-run. Verdict labels: **DEFECT** (the code does something other than what the design intends),
**DESIGN LIMIT** (the code does what was written, and that limits the result), **OK** (checked, no problem).

## A. Citation Confidence Engine — `src/novel/cce.py`

| Question | Finding | Verdict |
|---|---|---|
| Is the actual opinion reconstructed correctly? | It is not reconstructed. `_opinion_passages` asks ChromaDB for the 3 passages of the resolved report nearest to the holding's embedding (`where parent_doc_id == report.doc_id`) and joins them with spaces. Opinions in the test set average 61 passages, so 3 passages are 7.6% of an opinion on average (20-citation sample: median 7.2%). | DESIGN LIMIT |
| Is only the resolved case used? | Yes. With a case catalog, evidence comes only from the report the citation resolved to. All 96 benchmark targets resolve to an opinion. The name-matching path in `_compute_support` runs only when no catalog exists. | OK |
| Is the first 8,000 characters an unintended truncation? | Partly. `_compute_support` scores windows over `min(len(text), LEXAGENT_CCE_SCAN_LIMIT=8000)`. Three 450-word passages are usually a little longer than 8,000 characters, so the tail of the third passage is silently dropped: median 332 characters, maximum 887 in the sample. Small, but unintended. | DEFECT (minor) |
| Is the evidence snippet representative? | No. `evidence_snippet = opinion_text[:200]`, i.e. the start of the first selected passage, whatever window produced the score. In the sample it was the scoring window in 2 of 20 citations. The judge is shown the first 100 characters of this snippet (`judge_agent._format_ccs_report`). | DEFECT |
| Premise / hypothesis order | `pairs = [[w, citation.holding] for w in windows]`: opinion window is the premise, holding the hypothesis. Correct; swapping the order collapses entailment from 0.99 to 0.003 on test pairs. | OK |
| NLI label mapping | `_get_entailment_index` reads `label2id` from the model config: `{0: contradiction, 1: entailment, 2: neutral}`, index 1 used. 6 of 6 obvious pairs labelled correctly. | OK |
| Is the score a probability? | `CrossEncoder.predict` returns logits (rows do not sum to 1, values outside [0, 1]); the code applies one softmax and takes the entailment column. Correct; no double normalisation. | OK |
| Max over windows | `support_score = max(probs)`. The chance that some window exceeds the threshold grows with the number of windows: with ~24 windows 5 of 96 swapped holdings pass, with the whole opinion (~484 windows) 24 of 96 pass. The policy trades recall against false acceptance through evidence size, not through the threshold. | DESIGN LIMIT |
| Is 0.75 empirically justified? | No. `TAU_ACCEPTANCE_THRESHOLD = 0.70` (tier), `CCS_VERIFIED_THRESHOLD = 0.75` (judge prompt) and `CCS_UNCERTAIN_THRESHOLD = 0.40` are constants in `config.py`; nothing in the repository derives them. The two "verified" thresholds also disagree: a citation with support 0.72 is `SUPPORTED` in code while the judge prompt calls it uncertain. On the labelled citations the area under the ROC curve is 0.70, so no threshold separates correct from swapped holdings (see `STATISTICAL_VALIDATION.md`). | DEFECT (inconsistent) + DESIGN LIMIT |
| Is existence conflated with support? | Not inside the CCE: existence `E` and support `S` are computed separately and the tiers differ (`FABRICATED`/`UNVERIFIABLE` vs `MISATTRIBUTED`/`UNCERTAIN`/`SUPPORTED`). Downstream they are conflated: `CCS = E × S` is the only number the controller and the judge prompt use, the judge's code accepts only `SUPPORTED`, and `adaptive_memory.update_risk_index` files `FABRICATED`, `MISATTRIBUTED` and `UNVERIFIABLE` under one "high risk" label. | DEFECT (downstream) |
| Do equivalent name variants fail? | Not in `compute_ccs`. One real case cited as `Gideon v. Wainwright`, `… (1963)`, `…, 372 U.S. 335`, `… (372 U.S. 335) [CAP]` and `Gideon vs. Wainwright` resolved to the same opinion every time (`diagnostics_name_variants.json`). `_compute_existence` alone would pick a wrong fuzzy candidate for a year-suffixed name; the catalog resolution that follows corrects it. A name that is not an exact catalog entry is compared with all 313,611 known names by fuzzy matching: up to 4.6 s per citation. | OK (slow) |

Other observations:
- A textbook statement of *Gideon*'s holding scores `S = 0.016` and is labelled `MISATTRIBUTED`. The label asserts that the holding is wrong; the evidence only shows that the entailment model did not fire.
- `run_on_state` scores only the citations of the current round and returns a new report; nothing from earlier rounds is kept (see D).

## B. Judge — `src/agents/judge_agent.py`, `src/agents/prompts.py`

- **What the judge sees** (`judge_node`): the question; the debate history reduced to the first 400 characters of each argument (`_format_debate_history` drops the citations and their holdings); one line per citation of the *final round* — `id: CCS=x.xx [TIER] — first 100 characters of the snippet`; the reflection gaps. It never receives a retrieved passage or the window that produced a score. **DESIGN LIMIT**: it cannot inspect a rejected citation independently.
- **Prompt** (`SYSTEM_JUDGE`): "Base your verdict ONLY on verified citations (CCS >= 0.75) … If verified evidence is insufficient, state that clearly and set confidence to 0.0."
- **Code overrides the model**: a citation the judge names is kept only if its tier in the final-round report is `SUPPORTED` (token-overlap name match); otherwise `Rejecting judge citation … not verified by CCE`. Logged rejections: 29 in 27 of 66 debates (Full), 47 in 39 of 96 (A3). The rejected names include the target decision of the very question (`Gideon v. Wainwright`, `Strickland v. Washington`, `Carpenter v. United States`, `Graham v. Florida`). **DEFECT in effect**: verifier false negatives remove correct authority.
- **Confidence** is a formula, not a model estimate: `0.7 × mean CCS of verified + 0.3 × self-rating` if something is verified; `min(self-rating, 0.35)` if only uncertain citations exist; `min(self-rating, 0.20)` otherwise. It therefore measures "did the final round contain a `SUPPORTED` citation the judge named". Debated cases of the benchmark run: 35 at ≥ 0.70, 26 at ≤ 0.20, 1 between; of the 26 low ones, 21 had cited the target decision.
- `final_answer = legal_holding or verdict` of the judge's JSON; the fallback sentence "Insufficient evidence for a verified answer." was never the recorded answer (0 of 96).

## C. Adaptive memory — `src/novel/adaptive_memory.py`

**C1. The verdict cache returns answers written for other questions. DEFECT — the largest single effect found.**
- `check_cache` embeds the question with the system embedder (Legal-BERT, mean pooled) and returns the stored answer of the nearest stored question if cosine distance < `1 − MEMORY_CACHE_THRESHOLD = 0.08`.
- `memory_check_node` then sets `final_answer = cached`; `lexagent_graph._route_after_memory_check` routes to `END`. No retrieval, no debate, no citation, confidence left at its initial 0.0.
- Legal-BERT places all legal questions close together: the 96 distinct benchmark questions have median pairwise cosine 0.876 and maximum 0.962; 151 of 4,560 pairs (3.3%) are at or above 0.92, and 48 questions have an earlier question above the threshold. A threshold of 0.9625 would be needed for zero collisions on this benchmark alone.
- Logged hits per run: Full 30, A1 34, A2 37, A4 29 of 96; benchmark run 34 (by signature). All 30 hits of the Full run were reproduced from the question embeddings (logged distance = recomputed distance) and **none** pairs two questions with the same target decision: e.g. the thermal-imaging question (*Kyllo*) received the answer stored for the public-telephone question (*Katz*).
- `memory_store_node` stores a verdict only if the judge verified a citation with confidence > 0, so which questions become cache keys depends on the stochastic outcome of earlier debates: 26 cases were skipped in both existing full-configuration runs, 12 in only one.

**C2. Risk index.** `update_risk_index` stores every citation whose tier is `FABRICATED`, `MISATTRIBUTED`, `UNVERIFIABLE` (or the obsolete `LIKELY_FAKE`), with no independent check. `get_high_risk_citations` returns the 5 entries nearest to the *question* embedding (entries are keyed by the embedding of a *case name*) whose mean CCS < 0.45; it applies **no relevance threshold**. Result: 95 of 96 debates of the Full run were handed an avoid list; 27 of the 28 distinct names are real decisions in the corpus, 3 are benchmark targets, and in two cases the list contained the target decision of the question being asked (*Miller v. Alabama*, *Vernonia School District 47J v. Acton*). The prosecutor and defense prompts present the list as "High-Risk Citations to AVOID". **DEFECT**: verifier false negatives become instructions.

**C3. Isolation.** Each benchmark run uses `bench_<time>`, each ablation variant `ablation_<run id>_<variant>`; a fresh namespace starts with 0 verdicts and 0 risk entries, and two namespaces in one store do not see each other (tested in a temporary store). The stored-verdict counts in the project store equal the counts reconstructed from the logs (Full 36, A1 41, A4 37, A2 50). **OK.** The default namespace `""` used by `experiments/bootstrap.load_lexagent_components` (smoke tests) is shared and persistent: 1 verdict, 2 risk entries today.

**C4. Does A3 differ only by memory?** `run_ablation.build_ablation_graph` removes `memory_check` and `memory_store` and starts at `retrieve`; everything else is the full graph. A3 is therefore the only existing run of the debate with no cache and no avoid list. **OK.**

## D. Debate rounds and controller — `src/novel/ddc.py`, `src/graph/lexagent_graph.py`, agents

- **The controller never stops early in the full system.** Every debated case ran exactly 3 rounds: 62 of 62 (benchmark), 66 of 66 (Full), 96 of 96 (A3). `decide` continues when `strong_challenge and has_gaps`; the defense's self-reported `challenge_strength` exceeds 0.5 and the reflection agent lists at least one gap in every round, so the rule is always true. Without a defense (A1) the rule can end a debate: rounds were 1/2/3 in 30/9/23 debates. **DEFECT in effect**: the "dynamic" controller is a constant.
- **Weak-citation rule**: `weak_citations = avg_ccs < 0.60 or min_ccs < 0.40`. One unsupported citation forces another round although a supported one is in hand: 97 continuations in the Full run happened with a `SUPPORTED` citation present.
- **Each round overwrites the previous one.** `prosecutor_node` and the defense node return fresh `prosecutor_citations` / `defense_citations`; `make_cce_node` returns a fresh `citation_confidence_report`; `_make_retrieve_node` returns fresh `retrieved_passages`. Only `debate_history` accumulates, and the judge gets it without citations. A citation verified in round 1 is gone unless the agent repeats it with a holding that passes again: a supported citation existed in an earlier round but not in the final round in 17 of 66 debates (Full) and 28 of 96 (A3). **DEFECT.**
- **Does another round retrieve new evidence?** `retrieve_node` appends the first two reflection queries to the question and retrieves 8 passages again. Whether they are new is not recorded by any run. The count of debates whose first round had a supported citation (51) is higher than for the final round (47); the mean CCS does not rise (0.450 → 0.447 Full; 0.475 → 0.406 A3). The rounds do not improve the evidence state.
- **Defense evidence**: `_retrieve_disjoint_counter_evidence` excludes the prosecutor's passages by id and by the first 80 characters, as designed. **OK.** Logged evidence overlap was 0.0 in the rounds inspected.
- **Is A4 equal to Full except for the rounds?** Yes for the graph (`ddc → judge` directly); the cache is still active (29 skipped). One side effect: the controller still increments `debate_round` when it says CONTINUE, so A4 scorecards would report 2 rounds for a one-round debate (`debate_rounds = debate_round + 1`). Cosmetic.

## E. Retrieval — `src/retrieval/*.py`, baseline in `experiments/run_25_cases_benchmark.py`

- **Not the same retrieval input.** `DenseRetriever.retrieve` embeds `f"{query} {jurisdiction}"`. The debate passes `"US_Federal"`, the baseline calls `hybrid.retrieve(case["query"])` with no jurisdiction. The two passage lists are identical for 10 of 96 questions (median 6 of 8 passages shared). **DEFECT (comparability).**
- **Not the same budget.** Debate prosecutor: up to 8 passages × 500 characters (`_format_passages`), plus 4 further passages for the defense, per round. Baseline: 4 passages × 300 characters, once.
- **Dense retrieval is weak.** The target opinion is among the dense top 4 for 39 of 96 questions (40.6%); among the BM25 top 4 for 74 (77.1%). Fused: rank 1 for 29, top 4 for 63, top 8 for 76; absent for 20 (20.8%). Legal-BERT is not trained for query–passage similarity.
- **BM25 tokenisation** is `query.lower().split()`: punctuation stays attached ("warrant?"), no stop-word handling.
- **Duplicates**: RRF merges by chunk id; several chunks of one case can fill the list (median 3 of 8 passages from the most frequent case; median 5 distinct cases).
- **Question leakage**: 0 of 96 questions name a party of the target decision. **OK.**
- Corpus, embedding model and index are the same for both systems. **OK.**

## F. Evaluation — see `METRIC_AUDIT.md`

## G. Experiment hygiene

- **No seed is ever set.** `config.set_random_seed` exists and is called by no runner; generation samples at temperature 0.1. Runs are not reproducible, which is why the same configuration scored 1.39% and 0.26% fabricated names.
- **Serialisation.** The benchmark and the baseline save scorecards only (no answer, citations, passages, citation-check report, judge output, cache-hit flag). The ablation saves one mean per measure and variant. The debates of five variants cannot be re-examined except through the INFO log.
- **Two metric implementations.** `src/evaluation/{hallucination_rate,citation_accuracy,evaluator}.py` are not imported by any experiment runner; the reported numbers come from `evaluate_single_case` in `experiments/run_25_cases_benchmark.py`.
- **Ablation switches** (already repaired before this audit): `use_cce`, `use_defense`, `use_memory` were not declared in `LexAgentState`, so LangGraph dropped them; the first A2 run is invalid and preserved.
