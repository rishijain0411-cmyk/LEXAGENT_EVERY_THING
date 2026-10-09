# Repair plan (proposed — nothing here has been implemented or run)

Principle: the smallest changes that remove a measured failure. Each repair names the failure it addresses and
the experiment that would have to follow. The aim is a system whose results can be interpreted, not one that
scores higher. Existing result files stay as they are; new runs write new files.

Order matters: R1–R3 are prerequisites for any new end-to-end number. R4–R6 change the architecture and should
each be evaluated separately.

---

## R1. Make every run reproducible and inspectable (prerequisite for everything else)

| | |
|---|---|
| **Failure addressed** | No seed; scorecards only; ablations saved three means; cache hits invisible; the root cause had to be reconstructed from an INFO log |
| **Files** | `experiments/run_25_cases_benchmark.py` (`run_lexagent_benchmark`, `run_single_agent_rag_baseline`), `experiments/run_ablation.py`, `config.py` |
| **Logic** | (a) Call `config.set_random_seed(seed)` at the start of every runner and before every case; accept `--seed`. (b) Save one JSON record per case with: question, `memory_cache_hit`, for every round the retrieved passage ids, each agent's raw output and parsed citations, the full citation-check report (tier, existence, support, the window that scored), the controller decision and reason, the judge's raw output, the verified/uncertain/rejected lists, the final answer. (c) Save the same per-case scorecards for every ablation variant. (d) Write the configuration, the benchmark hash, the git commit and the memory namespace into each result file. (e) New runs write to a new, timestamped file; never over an existing one |
| **Why** | Every "UNDETERMINED" in the root-cause analysis is undetermined because this was not saved |
| **New experiment** | none by itself |

## R2. Verdict cache: stop answering different questions

| | |
|---|---|
| **Failure addressed** | 29–37 of 96 debates per run skipped; all citation-free answers; the confidence and recall gaps |
| **Files** | `src/novel/adaptive_memory.py` (`check_cache`, `store_verdict`), `src/graph/lexagent_graph.py` (`_route_after_memory_check`), `config.py` (`MEMORY_CACHE_THRESHOLD`) |
| **Logic** | Minimal and safe: a cache hit requires the **same question** — exact match on a normalised question string (case, whitespace, punctuation), i.e. the hash `store_verdict` already computes as the document id. Similarity may propose a candidate but must never return an answer on its own. The cache is **off by default in every evaluation run** (`use_memory_cache=False`), because a benchmark of distinct questions has nothing to cache. A cache hit must be recorded in the result and must restore the stored citations and confidence, not only the answer text |
| **Why** | Legal-BERT gives distinct legal questions a median cosine of 0.876 and up to 0.962; no threshold on that embedding separates "same question" from "same area of law" |
| **New experiment** | E1 |

## R3. Fix the comparison and the metrics before measuring again

| | |
|---|---|
| **Failure addressed** | Precision that is recall ÷ citations; similarity that cannot see a wrong answer; string-match hallucination rate; unequal retrieval input and budget |
| **Files** | `experiments/run_25_cases_benchmark.py` (`evaluate_single_case`, baseline), a new `src/evaluation/` module that replaces the unused ones |
| **Logic** | Report five separate quantities per citation and per answer: **(1) existence** — the citation resolves to a report in the case catalog (`CaseCatalog.resolve`), replacing fuzzy string matching; **(2) citation correctness** — name and reporter cite agree (`cite_status`); **(3) holding support** — judged against the opinion by a method validated in R4, never by the component under test alone; **(4) relevance** — precision against a *set* of acceptable authorities per question (requires annotating the benchmark; until then report "target cited" and citation count side by side and drop the word "precision"); **(5) unsupported claims** — claims in the final answer with no cited authority. Keep answer similarity only as a secondary number, computed with a sentence-embedding model and reported with its floor (score of a random other holding) and of the question echo. Score skipped debates as a separate category. Baseline: same dense query string as the debate; report results for both a 4×300 and an 8×500 character context so the budget is not confounded with the architecture |
| **Why** | Two of the four headline gaps are properties of the metrics |
| **New experiment** | E1; plus an annotation task for (4) |

## R4. Make verification reliable before its verdicts control anything

| | |
|---|---|
| **Failure addressed** | 72% of correct citations labelled misattributed; AUC 0.70; a single label for "holding is wrong" and "model did not fire" |
| **Files** | `src/novel/cce.py` (`_opinion_passages`, `_compute_support`, `compute_ccs`), `config.py` |
| **Logic** | (a) **Separate the outputs**: return `existence` (EXISTS / NOT_FOUND / NOT_IN_CORPUS) and `support` (SUPPORTED / NOT_SHOWN / CONTRADICTED) as two fields; rename `MISATTRIBUTED` to `NOT_SHOWN` unless the model outputs contradiction. (b) **Evidence**: rank passages by fusion of lexical and dense similarity, read whole passages instead of cutting at 8,000 characters, and return the scoring window as the evidence snippet. (c) **Validation gate**: before the verifier is allowed to influence the judge, the controller or memory, it must reach a stated quality on a held-out labelled set (for example AUC ≥ 0.90 for correct against swapped holdings, and a threshold chosen on a development split). The labelled citations already exist; split them once, development and test. (d) Candidate support models to compare under that gate: a larger NLI model, an NLI model with a long input window, a legal-domain entailment model, and the generator itself asked a yes/no question over the retrieved passage |
| **Why** | The scoring code is correct; the model cannot do the task. Until one can, the honest behaviour is to report "existence verified, support not shown" and let nothing downstream treat that as an error |
| **New experiment** | E2 |

## R5. Stop verifier negatives from becoming instructions (memory)

| | |
|---|---|
| **Failure addressed** | Avoid list in 95 of 96 debates, 27 of 28 names real, target of the question on its own avoid list |
| **Files** | `src/novel/adaptive_memory.py` (`update_risk_index`, `get_high_risk_citations`), `src/agents/prompts.py` |
| **Logic** | Write a risk entry only for an **existence failure** (citation does not resolve; or cite belongs to another case), never for a support verdict. Key entries by the normalised case name and look them up by the names in the *current* retrieved context, not by question-embedding neighbourhood; apply a relevance condition. Present them to the agents as information ("previously could not be found in the corpus") and never as a list to avoid. Memory stays optional: with it disabled the system must behave identically except for speed |
| **Why** | Memory should accelerate, not act as an authority; a wrong verdict must not outlive the debate that produced it |
| **New experiment** | E3 |

## R6. Give the judge evidence, keep what was verified, and let the controller stop

| | |
|---|---|
| **Failure addressed** | Judge sees tiers and 100 characters; verification of earlier rounds discarded (17 of 66 debates); controller never stops; one weak citation forces a round |
| **Files** | `src/agents/judge_agent.py`, `src/agents/prompts.py` (`USER_JUDGE`), `src/novel/ddc.py` (`decide`), `src/novel/cce.py` (`run_on_state`), `src/agents/state.py`, `src/graph/lexagent_graph.py` (`retrieve_node`) |
| **Logic** | (a) **Accumulate**: keep a per-debate ledger of citations keyed by resolved report; each round adds to it and keeps the best support verdict and its evidence window; retrieved passages accumulate too. (b) **Judge input**: for each ledger entry the case, the asserted holding, the existence result, the support result and the evidence window; the judge may rely on an entry whose existence is verified and must state when support was not shown — the program no longer deletes citations from the judge's list, it annotates them. (c) **Confidence**: report the components (existence rate, support rate, self-rating) instead of one blended number. (d) **Controller**: continue only if the last round added a new passage or a new verified citation and a gap remains; never because of the minimum score when a supported citation exists; do not use the defense's self-reported strength as a sufficient condition. (e) Record the reflection queries and the passages of every round |
| **Why** | Addresses "extra rounds do not improve results" at its three measured causes |
| **New experiment** | E4 |

## R7. Retrieval (independent of the debate question, affects both systems)

| | |
|---|---|
| **Failure addressed** | Target absent for 20.8% of questions; dense retriever finds it in 40.6% |
| **Files** | `src/retrieval/dense_retriever.py`, `src/retrieval/bm25_retriever.py`, `src/retrieval/hybrid_retriever.py`, `runs/build_db.py` |
| **Logic** | Replace Legal-BERT mean pooling with an embedding model trained for retrieval (requires re-embedding the corpus into a **new** collection; the existing index is kept). Tokenise BM25 queries and documents on word characters. Limit the fused list to at most two passages per case. Do not append the jurisdiction string to the dense query |
| **Why** | Raises the ceiling for every variant; not a cause of the debate-versus-baseline gap, so lowest priority |
| **New experiment** | E5 (retrieval only, no LLM) |

---

## Experiments required after the repairs (none has been run)

| | Experiment | Purpose | Minimum design |
|---|---|---|---|
| **E0** | Re-measure the *current* debate without the cache, with traces | The one measurement the existing data cannot give: debate against baseline on all 96 questions. Uses R1 + cache off only; no architectural change | Full graph with `memory_check`/`memory_store` disabled (the existing A3 configuration) and the baseline with the same dense query; per-case traces; 3 seeds each |
| **E1** | Debate against baseline under the repaired metrics | Replaces the current headline table | R1–R3; baseline at both context sizes; 3 seeds; paired tests per metric |
| **E2** | Verifier validation | Decide which support model, if any, passes the gate | Development / test split of the labelled citations; AUC, accepted correct, accepted swapped, per candidate; no LLM debate involved |
| **E3** | Memory, repaired, on a workload that has repeats | The current benchmark has no repeated question, so it cannot show a benefit of memory | A second pass over the benchmark and a set of paraphrased repeats; report cache precision (hits that are the same question) and re-hallucination rate |
| **E4** | Ablations with per-case output | Full, A1–A4 under R1–R6, same seeds across variants, paired per-case statistics | 3 seeds; report intervals, not single means |
| **E5** | Retrieval | Target-in-top-k for candidate embedders and tokenisation | Retrieval only |

E0 is cheap, needs no architectural decision, and answers the central question. It should be run first and
reported whatever it shows.

## What should not be done

- Do not tune thresholds (`0.70`, `0.75`, `0.92`, `0.45`) on the 96 benchmark questions and then report on the same questions.
- Do not drop the 34 skipped cases from the existing result and present the remainder as the result.
- Do not replace the current result files; add new ones and keep both in the manifest.
