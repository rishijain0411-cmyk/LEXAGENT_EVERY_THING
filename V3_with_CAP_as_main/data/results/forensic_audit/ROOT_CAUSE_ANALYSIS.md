# Root-cause analysis

Why does the full system score below the single-agent baseline? The audit tested eight candidate causes
against the code, the saved outputs and the run logs. Labels: **ROOT CAUSE**, **LIKELY CONTRIBUTOR**,
**MINOR CONTRIBUTOR**, **NOT A CAUSE**, and **UNDETERMINED** where the existing data cannot decide.

## Verdict on the eight hypotheses

| # | Hypothesis | Verdict | Decisive evidence |
|---|---|---|---|
| 5 | Adaptive-memory contamination | **ROOT CAUSE** | The verdict cache skipped 34 of 96 debates in the benchmark run and returned answers written for other questions. All 34 citation-free answers, all 34 "one-round" debates and 34 of the 47 results with confidence below 0.05 are these skipped debates |
| 6 | Evaluation metric design | **ROOT CAUSE** (of two of the four headline gaps) | Authority precision is `recall ÷ number of citations`; answer similarity has a floor of 0.88 and scores a wrong-question answer 0.91 |
| 3 | Citation-verifier false negatives | **ROOT CAUSE** of low confidence; **NOT A CAUSE** of the recall or precision gap | 69 of 96 correct citations labelled misattributed; AUC 0.70; the verdicts gate the judge, the controller and the memory but do not remove citations from the recall count |
| 4 | Judge over-rejection | **LIKELY CONTRIBUTOR** to low confidence | The program bars the judge from every citation not `SUPPORTED` in the final round (29 names in 27 of 66 debates), including the target decision; the judge has no passage to check independently |
| 8 | Interaction of components | **ROOT CAUSE** of "more rounds do not help" | Controller always continues; each round overwrites citations and verification; the verifier's negatives feed all three downstream components |
| 7 | Run-to-run stochasticity | **ROOT CAUSE** of every fabricated-name difference; **CONTRIBUTOR** elsewhere | No seed is set; 0–3 flagged names per run; 12 cases are skipped in one run and debated in the other |
| 2 | Retrieval quality | **NOT A CAUSE** of the gap; a ceiling for both systems | Same corpus and index; the debate has the larger budget; target absent from the passages for 20.8% of questions |
| 1 | Genuine weakness of the multi-agent architecture | **NOT SUPPORTED by the data; UNDETERMINED on the full benchmark** | Where a debate ran, it cited the target more often than the baseline on the same cases (80.6% vs 51.6%, p = 0.0002). No cache-free run saved per-case output, so the comparison on all 96 cases cannot be made |

## The six specific questions

### 1. Why is the baseline's answer similarity higher? (0.940 against 0.916)

| Cause | Label | Evidence |
|---|---|---|
| The metric does not measure answer correctness | **ROOT CAUSE** | Reference holding of a different case: 0.876. The question itself as the answer: 0.931. A cached answer to another question: 0.909 (case #23: 0.952, above the baseline's correct answer). The whole gap is 0.023 on a usable range of about 0.12 |
| 34 answers were written for other questions | **LIKELY CONTRIBUTOR** | On those 34 cases the gap is 0.039; on the 62 debated cases 0.014 |
| The debate's answer is the judge's ruling, the baseline's a direct answer in the question's words | **LIKELY CONTRIBUTOR (unverified)** | `final_answer = legal_holding or verdict`; echoing the question scores 0.931. No answer text was saved, so this cannot be confirmed |
| The baseline answers better | **UNDETERMINED** | The gap on debated cases remains significant (−0.014, 95% CI [−0.024, −0.004]), but the metric cannot say whether that is quality or phrasing |

### 2. Why is the baseline's authority precision much higher? (47.2% against 21.4%)

| Cause | Label | Evidence |
|---|---|---|
| The metric is `recall ÷ citations` | **ROOT CAUSE** | Identity holds on all 192 scorecards. Debate: 2.77 citations per debated answer (two agents, the defense told to bring counter-authority). Baseline: 1.27. At equal citation counts the debate's precision is equal or higher |
| 34 skipped debates score 0 | **LIKELY CONTRIBUTOR** | Baseline precision on those cases: 63.2% |
| The debate cites less relevant authority | **UNDETERMINED** | Only one target per question is known; the relevance of the other citations was never judged. On debated cases the difference is not significant (33.1% vs 38.4%, p = 0.25) |

### 3. Why does LexAgent produce many citation-free answers? (34 against 13)

| Cause | Label | Evidence |
|---|---|---|
| Verdict-cache collisions | **ROOT CAUSE — complete** | The 34 citation-free cases are exactly the 34 skipped debates. Among the 62 debated cases the debate has 0 citation-free answers; the baseline has 9 |
| The verifier withholds citations | **NOT A CAUSE** | Recall counts the prosecutor's and defense's citations whatever the verifier says |

Mechanism: `adaptive_memory.check_cache` (cosine > 0.92 on Legal-BERT question embeddings, which place distinct
legal questions at a median of 0.876 and up to 0.962) → `memory_check_node` sets `final_answer` to the stored
text → `lexagent_graph._route_after_memory_check` ends the run.

### 4. Why does the CCE accept only 22.9% of correct citations?

| Cause | Label | Evidence |
|---|---|---|
| A general-domain NLI model on 450-character windows cannot decide whether an opinion holds a proposition | **ROOT CAUSE** | AUC 0.70 for correct against swapped holdings, 0.69–0.74 for every evidence selection; median support of correct citations 0.046; in 6 of 12 sampled rejections no window of the entire opinion entails the holding |
| Three passages are 7% of an opinion and are chosen by topical similarity | **LIKELY CONTRIBUTOR** | In the other 6 of 12 sampled rejections an entailing passage exists and was not read |
| Reference holdings are abstract one-sentence syntheses | **LIKELY CONTRIBUTOR** | The agents' own holdings are accepted 39–40% of the time in live debates, against 22.9% for reference holdings |
| 8,000-character cut | **MINOR CONTRIBUTOR** | median 332 characters lost |
| Threshold too strict | **NOT A CAUSE** | 0.10 instead of 0.70 gains 19 correct and admits 8 swapped |
| Label map, softmax, premise order, case resolution, name variants | **NOT A CAUSE** | all verified |

### 5. Why does removing memory improve confidence? (0.39 → 0.57)

| Cause | Label | Evidence |
|---|---|---|
| Skipped debates are averaged in as confidence 0.0 | **ROOT CAUSE — complete** | Mean confidence of debates that actually ran: 0.562 with memory (Full), 0.566 without (A3), 0.565 with one round (A4), 0.571 in the benchmark run. `0.387 × 96 / 66 = 0.562` |
| The avoid list suppresses good citations | **NOT A CAUSE of the confidence change**; effect on citations **UNDETERMINED** | Debated-case confidence is identical with and without the list. The list reached 95 of 96 debates and 27 of its 28 names are real cases; what it did to the citations was not recorded |

The explanation given in the current paper draft (risk index fed by false negatives) is not what produced this number.

### 6. Why do extra rounds not improve results?

| Cause | Label | Evidence |
|---|---|---|
| The controller never ends a debate early | **ROOT CAUSE** | 3 rounds in 62/62, 66/66 and 96/96 debated cases. The defense reports a challenge strength above 0.5 and the reflection agent finds a gap in every round, so `strong_challenge and has_gaps` is always true. Without a defense (A1) debates do end after 1 or 2 rounds (39 of 62) |
| Each round overwrites the last | **ROOT CAUSE** | Citations, the verification report and the passages are replaced; the judge sees only the final round. A supported citation existed earlier and not at the end in 17 of 66 (Full) and 28 of 96 (A3) debates |
| Rounds do not improve the evidence | **ROOT CAUSE** | Debates with a supported citation: 51 after round 1, 47 after round 3 (Full); 74 → 66 (A3). Mean CCS 0.450 → 0.447 (Full), 0.475 → 0.406 (A3) |
| One unsupported citation forces a round | **LIKELY CONTRIBUTOR** | `min_ccs < 0.40`; 97 continuations with a supported citation in hand |
| Reflection queries cause query drift | **UNDETERMINED** | Later-round queries and passages were not saved |

One round (A4) reaches the same debated-case confidence (0.565) in a third of the generation.

## Causal picture

```
Legal-BERT question embeddings are all close ──► verdict cache fires on different questions
        │                                         └─► 29–37 of 96 debates skipped per run
        │                                              └─► no citations, confidence 0.0, wrong-question answer
        │                                                   └─► recall, precision, "citation-free", mean confidence
        └─► dense retrieval finds the target in 41% (BM25: 77%) ─► ceiling for both systems

NLI verifier (AUC 0.70) ──► 72% of correct citations "misattributed"
        ├─► judge barred from correct authority ─► confidence ≤ 0.20 in 26 of 62 debates (21 had cited the target)
        ├─► controller sees "weak citations"   ─► always another round ─► round overwrites round ─► verification lost
        └─► memory files real cases as risk    ─► avoid list in 95 of 96 debates (effect unmeasured)

Metrics: precision = recall ÷ citations;  similarity blind to wrong-question answers;  no seed, no saved traces
```

## What the existing data can and cannot say about the architecture

**Can say.** On the 62 questions where a debate ran in the benchmark run, the debate cited the target decision
in 80.6% and the baseline in 51.6% (paired, 19 against 1 discordant cases, p = 0.00004). When round-one retrieval
missed the target, the debate still cited it in 9 of 18 cases; the baseline, when the target was not among its 4 passages, in 4 of 32. The debate never produced
a citation-free answer. Its fabricated-name rate is indistinguishable from the baseline's.

**Cannot say.** Whether that holds on all 96 questions: the 34 skipped cases were the easy ones for retrieval,
and the debate was never run on them in that run. The cache-free run that exists (A3) saved only three means.
Whether the debate's answers are better or worse: no answer text was saved and the similarity metric cannot tell.
Whether the extra citations are relevant: never judged.

**Conclusion.** The poor headline result is produced by an implementation defect in the memory (verdict-cache
collisions), by two metrics that do not measure what their names say, and by an unreliable verifier whose
verdicts steer three other components. It is **not** evidence that multi-agent debate is weaker than a single
agent, and it is not yet evidence that it is stronger.

## Statements in the current paper draft that this audit contradicts (the paper was not edited)

| Draft statement | What the audit found |
|---|---|
| The debate "returns an answer without any citation in 34 of 96 cases" because the verifier withholds citations | The 34 are debates skipped by the verdict cache |
| "34 ended after one round and 62 ran the maximum" | No debate ended after one round; 34 did not run |
| Removing memory raises confidence because the risk index is fed by false negatives | Arithmetic of the skipped debates; debated-case confidence is unchanged |
| The baseline attains higher authority precision | True of the number; the number is recall ÷ citation count |
| The baseline attains higher answer similarity | True of the number; the metric scores a wrong-question answer 0.91 |
| "Same generator, same hybrid retriever" baseline | Different dense query and a smaller evidence budget |
| The controller "decides whether a further round is required" | It continued in every round of every debate |
| Confidence is bimodal because of the verifier's recall | 34 of the 47 results below 0.05 are skipped debates |
