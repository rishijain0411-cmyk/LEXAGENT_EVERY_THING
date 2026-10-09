# Memory diagnostic

Sources: `diagnostics.json` (`memory_contamination`, `cache_collisions`), `analysis_existing_results.json`
(`benchmark_cache_signature`, `ablation_logs`, `confidence_decomposition`), the run logs. The tests used a
temporary store; the project's memory store was only listed.

## 1. Namespaces are isolated; a fresh one is empty

| Test (temporary store) | Result |
|---|---|
| Fresh namespace: stored verdicts / risk entries | 0 / 0 |
| Avoid list returned by an empty memory | empty |
| Second namespace in the same store after the first was written to | 0 / 0, avoid list empty |
| Risk entries after one simulated debate (5 citations: 1 supported, 1 uncertain, 1 misattributed, 1 fabricated, 1 unverifiable) | 3 — the misattributed, the fabricated and the unverifiable one |

Project store, listed read-only: every run has its own namespace and its stored-verdict count equals the count
reconstructed from that run's log.

| Namespace | Verdicts | Risk entries | Run |
|---|---|---|---|
| `bench_1791224095` | 35 | 89 | full benchmark run |
| `ablation_1791231448_Full` | 36 | 97 | ablation, full system |
| `ablation_1791231448_A1` | 41 | 15 | ablation, no defense |
| `ablation_1791231448_A2` | 0 | 0 | first A2 run (**invalid**): nothing was ever verified |
| `ablation_1791231448_A3` | 0 | 0 | ablation, no memory (namespace created, never used) |
| `ablation_1791231448_A4` | 37 | 87 | ablation, one round |
| `ablation_1791265160_A2` | 50 | 0 | corrected A2 (no checker, so no risk entries) |
| `ui_chat` | 0 | 2 | the recorded UI debate |
| (no namespace) | 1 | 2 | default namespace used by smoke tests; shared and persistent |

**Experiments did not contaminate each other.** The contamination is *inside* each run, from one benchmark
question to the next.

## 2. The verdict cache answers different questions with a stored answer

Rule (`AdaptiveMemory.check_cache`): return the stored answer if the cosine similarity between the new question
and a stored question, under the system embedder, exceeds 0.92.

Similarity of the 96 distinct benchmark questions under that embedder:

| | Value |
|---|---|
| Median / mean pairwise cosine | 0.876 / 0.873 |
| Minimum / maximum | 0.764 / 0.962 |
| Pairs at or above 0.92 | 151 of 4,560 (3.3%) |
| Questions with an earlier question at or above 0.92 | 48 of 95 |
| Threshold needed for no collision on this benchmark | 0.9625 |

What happened in the existing runs:

| Run | Debates skipped by a cache hit | Debated |
|---|---|---|
| Benchmark run (identified by signature: confidence 0.0, 1 round, 0 citations) | 34 | 62 |
| Ablation Full | 30 | 66 |
| Ablation A1 (no defense) | 34 | 62 |
| Ablation A2 corrected (no checker) | 37 | 59 |
| Ablation A3 (no memory) | 0 | 96 |
| Ablation A4 (one round) | 29 | 67 |

- In the benchmark file the three sets "confidence 0.0 and one round and no citation", "one round" and "no
  citation" are the same 34 cases. **Every citation-free LexAgent answer is a skipped debate.** Among the 62
  debated cases there is no citation-free answer (the baseline has 9 on those cases).
- All 30 hits of the Full ablation run are reproduced from the question embeddings: the logged distance equals
  the distance to the nearest earlier question that stored a verdict, for 30 of 30. **None** of the 30 pairs
  shares a target decision. Examples (question asked ← question whose answer was returned):

| Asked | Answer returned was written for | Distance |
|---|---|---|
| #23 Fourth Amendment — thermal imaging of homes (*Kyllo*) | #13 Fourth Amendment — public telephone privacy (*Katz*) | 0.057 |
| #32 Separation of powers — presidential power | #22 Commerce Clause — limits on federal power | 0.069 |
| #36 Fourteenth Amendment — interracial marriage | #21 Constitutional privacy — contraception | 0.076 |
| #38 First Amendment — incitement | #31 Equal protection — racial classification | 0.069 |
| #39 Establishment Clause — three-prong test | #30 First Amendment — obscenity standard | 0.068 |
| #64 Fourth Amendment — student-athlete drug testing | #37 First Amendment — student symbolic speech | 0.075 |

- Constructed look-alikes: 3 of 5 legally distinct question pairs were answered from the cache (cell-phone search
  vs car search, 0.948; appointed counsel vs jury trial for petty offences, 0.952; juvenile death penalty vs
  juvenile life without parole, 0.973).
- Which questions become cache keys depends on which earlier debates ended with a verified citation, which is
  stochastic: 26 cases were skipped in both full-configuration runs, 12 in exactly one.

## 3. What a skipped debate looks like in the results

`memory_check_node` copies the cached text into `final_answer`; the graph ends. The scorecard then records:
no citation (so authority recall 0 and precision 0), confidence 0.0, one "round", and an answer-similarity
score for an answer to another question.

| Benchmark run, the 34 skipped cases | LexAgent | Baseline on the same cases |
|---|---|---|
| Authority recall | 0.0% | 73.5% |
| Authority precision | 0.0% | 63.2% |
| Answer similarity | 0.909 | 0.949 |
| Target opinion retrievable in round one | — | 94.1% (32 of 34) |

The skipped cases were the *easy* ones for retrieval (94% against 71% for the debated cases).

## 4. "Removing memory improves confidence" is arithmetic

The saved mean confidence divides by 96 and a skipped debate contributes 0.0.

| Run | Saved mean confidence | Skipped | Mean confidence of the debates that ran |
|---|---|---|---|
| Benchmark run | 0.369 | 34 | 0.571 |
| Ablation Full | 0.387 | 30 | 0.562 |
| Ablation A3 (no memory) | 0.566 | 0 | 0.566 |
| Ablation A4 (one round) | 0.395 | 29 | 0.565 |
| Ablation A1 (no defense) | 0.434 | 34 | 0.673 |
| Ablation A2 (no checker) | 0.485 | 37 | 0.789 |

With and without memory, a debate that runs ends at the same mean confidence (0.56–0.57). The 0.39 → 0.57
difference is the removal of the zeros.

## 5. The avoid list

| Finding | Evidence |
|---|---|
| Written without validation | any `MISATTRIBUTED`, `UNVERIFIABLE` or `FABRICATED` verdict becomes a risk entry (test above; code) |
| No relevance filter | a question about the Takings Clause received all three entries from a Fourth Amendment debate (distances 0.22–0.27) |
| Reaches almost every debate | 95 of 96 cases in the Full run, 81 in A1, 95 in A4 |
| Consists of real cases | 27 of 28 distinct names exist in the corpus; 3 are benchmark targets |
| Can name the right answer as a case to avoid | *Miller v. Alabama* was on the list given to the *Miller* question; *Vernonia v. Acton* on the list for the *Vernonia* question |
| Measurable effect on confidence | none: debated-case confidence is 0.56 with the list and 0.57 without |
| Measurable effect on which cases are cited | **cannot be determined** — no run saved its citations |

## Answers to the audit questions

| Question | Answer |
|---|---|
| Cross-question contamination? | **Yes**, through the verdict cache (29–37 of 96 answers per run) and the avoid list (95 of 96 debates) |
| Does it persist between benchmark cases? | Yes, by design, within a run |
| Risk entries from false-negative verdicts? | Yes; 27 of 28 listed names are real cases |
| `MISATTRIBUTED` treated as high risk without validation? | Yes |
| Can memory suppress valid citations? | It instructs agents to avoid them, including the target; the size of the effect is unmeasured |
| Cached answer for a similar but different question? | **Yes — 30 of 30 logged hits in the Full run** |
| Namespace isolated per experiment? | Yes |
| Risk index empty at the start of each ablation run? | Yes |
| Does A3 differ only by memory? | Yes |
