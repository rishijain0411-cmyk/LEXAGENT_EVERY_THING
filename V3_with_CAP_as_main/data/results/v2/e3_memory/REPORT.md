# E3 — verdict cache on a workload with repeats

Verdicts stored by one full pass: 79 of 96 questions. A hit is correct only if the stored answer was written for the same benchmark case.

| Workload | Queries | Old rule (cosine > 0.92): hits / correct / wrong question | New rule (same question): hits / correct / wrong question |
|---|---|---|---|
| first pass distinct questions | 96 | 45 / 0 / 45 | 0 / 0 / 0 |
| exact repeats | 96 | 93 / 79 / 14 | 79 / 79 / 0 |
| format variants | 96 | 95 / 79 / 16 | 79 / 79 / 0 |
| paraphrases | 96 | 93 / 78 / 15 | 0 / 0 / 0 |

New rule through `AdaptiveMemory.lookup_verdict`: {'exact_repeats': 79, 'format_variants': 79, 'paraphrases': 0, 'wrong': 0}; agrees with the simulation: True.
Citations that failed the existence check in the first pass: 0. The re-hallucination rate needs citations that failed the existence check in the first pass. With none, there is nothing to repeat and the rate is undefined, not zero.
