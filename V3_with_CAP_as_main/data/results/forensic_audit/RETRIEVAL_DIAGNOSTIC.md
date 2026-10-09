# Retrieval diagnostic

**What was run.** No run saved its retrieved passages, so retrieval traces do not exist. Retrieval is
deterministic and needs no language model, so it was recomputed for the 96 benchmark questions with the same
index, embedder and retriever code (`diagnostics.json → retrieval`). No answer was regenerated. This reproduces
(a) the passages the baseline received and (b) the passages the debate's first round received. Later debate rounds
retrieved with reflection queries appended; those queries were not saved and are not reproduced.

"Target retrieved" means a retrieved passage belongs to the opinion the benchmark's target decision resolves to.

## Is the target opinion retrieved?

| Retrieved list | Target at rank 1 | In top 4 | In top 8 | Absent |
|---|---|---|---|---|
| Debate, first round (8 fused passages) | 29 (30.2%) | 63 (65.6%) | 76 (79.2%) | 20 (20.8%) |
| Baseline prompt (first 4 fused passages) | — | 64 (66.7%) | — | 32 (33.3%) |
| Dense retriever alone (Legal-BERT, top 4) | — | 39 (40.6%) | — | — |
| BM25 alone (top 4) | — | 74 (77.1%) | — | — |

- For one question in five the target opinion is not among the passages at all; no downstream component can
  cite it from evidence.
- BM25 finds the target almost twice as often as the dense retriever. Legal-BERT is a masked-language model,
  not a retrieval model; mean-pooled, it places all legal text close together (the same property that breaks
  the verdict cache).
- The fused top 8 contain a median of 5 distinct cases; a median of 3 passages come from the single most
  frequent case. Chunks of one case take several of the eight places.
- No question names a party of its target decision (0 of 96): the benchmark does not leak the answer into the query.

## Do the two systems get the same evidence? No.

| | Debate (first round) | Baseline |
|---|---|---|
| Dense query | question + `" US_Federal"` | question only |
| Passages given to the generator | up to 8, 500 characters each | 4, 300 characters each |
| Further retrieval | 4 counter-passages for the defense; new retrieval in rounds 2 and 3 | none |
| Identical passage list | 10 of 96 questions; median 6 of 8 passages shared | |

The corpus, the embedding model, the index and the fusion are the same. The retrieval *input* and the evidence
*budget* are not. The comparison in the paper draft is therefore not "same retrieval, different architecture".
The budget favours the debate; it does not explain a result in the baseline's favour.

## Does retrieval decide who cites the target?

| Condition | Target cited |
|---|---|
| Baseline, target in its 4 passages | 53 of 64 (82.8%) |
| Baseline, target not in its 4 passages | 4 of 32 (12.5%) |
| Debate (debated cases), target retrieved in round one | 41 of 44 (93.2%) |
| Debate (debated cases), target not retrieved in round one | 9 of 18 (50.0%) |

Citing the target depends strongly on retrieving it, for both systems. When round one misses the target, the
debate still cites it in half the cases — through the defense's counter-retrieval, the later rounds or the
model's own knowledge (the runs do not record which). This is the one place where the multi-agent design
shows an advantage in the existing data.

## Which cases were skipped by the verdict cache?

| Subset of the benchmark run | Target retrievable in round one |
|---|---|
| 62 debated cases | 44 (71.0%) |
| 34 skipped cases | 32 (94.1%) |

The cache removed the cases that were easiest for retrieval. The debated subset is harder than the benchmark
as a whole for both systems (baseline authority recall: 51.6% on the debated cases, 73.5% on the skipped ones).
The paired comparison on that subset (debate 80.6%, baseline 51.6%) is valid for those 62 cases; it must not be
extrapolated to all 96, where the debate was never run on the easy third.

## Answers to the audit questions

| Question | Answer |
|---|---|
| Share of targets retrieved in top-k | top 1: 30.2%; top 4: 65.6%; top 8: 79.2%; none: 20.8% |
| Are the top-k values too small? | Top 8 gains 13 targets over top 4; 20 remain missing at 8. The limiting factor is the dense retriever, which contributes 4 of the 8 places and finds the target in 40.6% of cases |
| Does RRF favour duplicate chunks of one case? | It does not prevent them: median 3 of 8 passages from one case |
| Adjacent but non-holding material? | Cannot be judged without a passage-level relevance label; the citation-checker sample suggests yes (passages share 87% of a holding's words yet do not state it) |
| Does the question contain enough to retrieve the target? | BM25 retrieves it for 77% without any party name in the question |
| Same corpus and embedding for the baseline? | Yes |
| Same retrieval budget and input? | **No** (table above) |
| Is retrieval the cause of the debate-versus-baseline gap? | **No.** Both systems share the same ceiling; the debate has the larger budget. Retrieval limits both |
