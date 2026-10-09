# Standard measures

Written 2026-10-07T16:50:24. 96 questions. Mean over the finished seeds of each configuration.
Support is judged by `tasksource/deberta-base-long-nli` at threshold 0.2695 (validated: True). BERTScore: roberta-large. ROUGE-L F1, rouge-score with stemming.

| Measure | baseline_r7_4x300 | baseline_r7_8x500 | f1_ledger_Full | f2_final_Full | f3_retrieval_Full |
|---|---|---|---|---|---|
| Seeds | 1 | 1 | 1 | 1 | 1 |
| Retrieval Hit@1 (%) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Retrieval Hit@4 (%) | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 |
| Retrieval Hit@8 (%) | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 |
| Retrieval MRR@8 | 0.250 | 0.250 | 0.250 | 0.250 | 0.250 |
| Target opinion in the generator's context (%) | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 |
| Authority accuracy: answer rests on the target (%) | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 |
| Answers citing a non-existent case (%) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Citations to non-existent cases (% of citations) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Citation precision (%) | 100.0 | 100.0 | 50.0 | 50.0 | 100.0 |
| Citation recall (% of answer sentences) | 100.0 | 20.0 | 50.0 | 33.3 | 100.0 |
| Citations per answer | 2.500 | 0.500 | 1.000 | 1.000 | 1.500 |
| Answers grounded (%) | 100.0 | 50.0 | 50.0 | 50.0 | 100.0 |
| Answers misgrounded (%) | 0.0 | 0.0 | 50.0 | 50.0 | 0.0 |
| Answers without authority (%) | 0.0 | 50.0 | 0.0 | 0.0 | 0.0 |
| Citation recall, per answer (%) | 100.0 | 50.0 | 50.0 | 25.0 | 100.0 |
| ROUGE-L F1 | 0.409 | 0.255 | 0.197 | 0.283 | 0.263 |
| BERTScore F1 | 0.913 | 0.885 | 0.863 | 0.872 | 0.864 |
| Token F1 | 0.409 | 0.271 | 0.230 | 0.282 | 0.263 |
| Seconds per question | 3.7 | 5.0 | 44.2 | 44.9 | 99.8 |
| Generator calls per question | 1.0 | 1.0 | 4.0 | 4.0 | 10.0 |

## Paired differences (A minus B, per question; seeds averaged within a question)

### f2_final_Full vs baseline_r7_4x300
Seeds: {'f2_final_Full': ['seed0'], 'baseline_r7_4x300': ['seed0']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.5000 | 0.5000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| Answers grounded (%) | 0.5000 | 1.0000 | -0.5000 | [-1.000, +0.000] | 1.0000 | no |
| Answers misgrounded (%) | 0.5000 | 0.0000 | +0.5000 | [+0.000, +1.000] | 1.0000 | no |
| Answers without authority (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| Citation recall, per answer (%) | 0.2500 | 1.0000 | -0.7500 | [-1.000, -0.500] | 0.4959 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2834 | 0.4094 | -0.1260 | [-0.210, -0.042] | 0.4959 | no |
| BERTScore F1 | 0.8715 | 0.9126 | -0.0410 | [-0.063, -0.019] | 0.4959 | no |
| Token F1 | 0.2825 | 0.4094 | -0.1269 | [-0.181, -0.073] | 0.4959 | no |

### f2_final_Full vs baseline_r7_8x500
Seeds: {'f2_final_Full': ['seed0'], 'baseline_r7_8x500': ['seed0']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.5000 | 0.5000 | +0.0000 | [-1.000, +1.000] | 1.0000 | no |
| Answers grounded (%) | 0.5000 | 0.5000 | +0.0000 | [-1.000, +1.000] | 1.0000 | no |
| Answers misgrounded (%) | 0.5000 | 0.0000 | +0.5000 | [+0.000, +1.000] | 1.0000 | no |
| Answers without authority (%) | 0.0000 | 0.5000 | -0.5000 | [-1.000, +0.000] | 1.0000 | no |
| Citation recall, per answer (%) | 0.2500 | 0.5000 | -0.2500 | [-1.000, +0.500] | 1.0000 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2834 | 0.2554 | +0.0280 | [-0.042, +0.098] | 1.0000 | no |
| BERTScore F1 | 0.8715 | 0.8853 | -0.0138 | [-0.019, -0.008] | 0.4959 | no |
| Token F1 | 0.2825 | 0.2714 | +0.0111 | [-0.073, +0.095] | 1.0000 | no |
