# Standard measures

Written 2026-10-08T01:09:48. 96 questions. Mean over the finished seeds of each configuration.
Support is judged by `tasksource/deberta-base-long-nli` at threshold 0.2695 (validated: True). BERTScore: roberta-large. ROUGE-L F1, rouge-score with stemming.

| Measure | baseline_4x300 | baseline_8x500 | baseline_r7_4x300 | baseline_r7_8x500 | e0_legacy_checker_no_memory | e4_repaired_A1 | e4_repaired_A2 | e4_repaired_A3 | e4_repaired_A4 | e4_repaired_Full | f1_ledger_Full | f2_final_Full | f3_retrieval_Full |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Seeds | 3 | 3 | 3 | 3 | 3 | 1 | 1 | 1 | 1 | 2 | 1 | 3 | 1 |
| Retrieval Hit@1 (%) | 30.2 | 30.2 | 62.5 | 62.5 | 30.2 | 30.2 | 30.2 | 30.2 | 30.2 | 30.2 | 30.2 | 62.5 | 62.5 |
| Retrieval Hit@4 (%) | 64.6 | 64.6 | 80.2 | 80.2 | 64.6 | 64.6 | 64.6 | 64.6 | 64.6 | 64.6 | 64.6 | 80.2 | 80.2 |
| Retrieval Hit@8 (%) | 79.2 | 79.2 | 85.4 | 85.4 | 79.2 | 79.2 | 79.2 | 79.2 | 79.2 | 79.2 | 79.2 | 85.4 | 85.4 |
| Retrieval MRR@8 | 0.487 | 0.487 | 0.704 | 0.704 | 0.487 | 0.487 | 0.487 | 0.487 | 0.487 | 0.487 | 0.487 | 0.704 | 0.704 |
| Target opinion in the generator's context (%) | 64.6 | 79.2 | 80.2 | 85.4 | 79.2 | 79.2 | 79.2 | 79.2 | 79.2 | 79.2 | 79.2 | 85.4 | 85.4 |
| Authority accuracy: answer rests on the target (%) | 60.8 | 34.7 | 75.0 | 30.6 | 34.4 | 70.8 | 65.6 | 65.6 | 62.5 | 63.0 | 57.3 | 62.5 | 64.6 |
| Answers citing a non-existent case (%) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Citations to non-existent cases (% of citations) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Citation precision (%) | 79.0 | 79.9 | 79.1 | 76.0 | 66.2 | 69.2 | 65.8 | 72.3 | 68.7 | 69.7 | 74.0 | 66.1 | 74.4 |
| Citation recall (% of answer sentences) | 63.1 | 30.2 | 63.4 | 21.0 | 38.8 | 67.7 | 67.3 | 64.0 | 63.0 | 64.1 | 66.0 | 64.8 | 75.2 |
| Citations per answer | 1.243 | 0.604 | 1.611 | 0.486 | 0.622 | 1.083 | 1.167 | 0.979 | 1.031 | 1.036 | 1.042 | 1.163 | 1.219 |
| Answers grounded (%) | 65.6 | 33.0 | 62.8 | 24.3 | 37.5 | 61.5 | 60.4 | 60.4 | 59.4 | 58.3 | 61.5 | 54.2 | 62.5 |
| Answers misgrounded (%) | 21.9 | 10.4 | 26.0 | 6.6 | 19.4 | 29.2 | 32.3 | 24.0 | 29.2 | 27.6 | 25.0 | 34.4 | 27.1 |
| Answers without authority (%) | 12.5 | 56.6 | 11.1 | 69.1 | 43.1 | 9.4 | 7.3 | 15.6 | 11.5 | 14.1 | 13.5 | 11.5 | 10.4 |
| Citation recall, per answer (%) | 72.6 | 36.2 | 73.1 | 25.3 | 38.7 | 68.8 | 66.7 | 63.7 | 62.5 | 63.8 | 67.2 | 64.4 | 75.0 |
| ROUGE-L F1 | 0.324 | 0.328 | 0.332 | 0.334 | 0.246 | 0.248 | 0.248 | 0.249 | 0.246 | 0.256 | 0.256 | 0.263 | 0.259 |
| BERTScore F1 | 0.893 | 0.894 | 0.896 | 0.893 | 0.874 | 0.871 | 0.874 | 0.873 | 0.874 | 0.875 | 0.876 | 0.877 | 0.872 |
| Token F1 | 0.391 | 0.396 | 0.398 | 0.397 | 0.308 | 0.305 | 0.320 | 0.311 | 0.311 | 0.315 | 0.325 | 0.331 | 0.314 |
| Seconds per question | 3.5 | 3.2 | 3.1 | 3.2 | 115.9 | 35.9 | 112.7 | 115.5 | 41.8 | 114.9 | 40.2 | 42.9 | 114.6 |
| Generator calls per question | 1.0 | 1.0 | 1.0 | 1.0 | 10.0 | 4.5 | 10.0 | 10.0 | 4.0 | 10.0 | 4.0 | 4.0 | 10.0 |

## Paired differences (A minus B, per question; seeds averaged within a question)

### f2_final_Full vs baseline_r7_4x300
Seeds: {'f2_final_Full': ['seed0', 'seed1', 'seed2'], 'baseline_r7_4x300': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6250 | 0.7500 | -0.1250 | [-0.222, -0.028] | 0.0174 | yes |
| Answers grounded (%) | 0.5417 | 0.6285 | -0.0868 | [-0.198, +0.028] | 0.1466 | no |
| Answers misgrounded (%) | 0.3438 | 0.2604 | +0.0833 | [-0.024, +0.188] | 0.1370 | no |
| Answers without authority (%) | 0.1146 | 0.1111 | +0.0035 | [-0.073, +0.076] | 1.0000 | no |
| Citation recall, per answer (%) | 0.6441 | 0.7309 | -0.0868 | [-0.182, +0.011] | 0.0841 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2630 | 0.3321 | -0.0692 | [-0.098, -0.041] | 0.0002 | yes |
| BERTScore F1 | 0.8769 | 0.8956 | -0.0187 | [-0.024, -0.014] | 0.0001 | yes |
| Token F1 | 0.3307 | 0.3979 | -0.0672 | [-0.091, -0.044] | 0.0001 | yes |

### f2_final_Full vs baseline_r7_8x500
Seeds: {'f2_final_Full': ['seed0', 'seed1', 'seed2'], 'baseline_r7_8x500': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6250 | 0.3056 | +0.3194 | [+0.212, +0.424] | 0.0001 | yes |
| Answers grounded (%) | 0.5417 | 0.2431 | +0.2986 | [+0.194, +0.396] | 0.0001 | yes |
| Answers misgrounded (%) | 0.3438 | 0.0660 | +0.2778 | [+0.201, +0.354] | 0.0001 | yes |
| Answers without authority (%) | 0.1146 | 0.6910 | -0.5764 | [-0.667, -0.479] | 0.0001 | yes |
| Citation recall, per answer (%) | 0.6441 | 0.2535 | +0.3906 | [+0.292, +0.486] | 0.0001 | yes |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2630 | 0.3340 | -0.0710 | [-0.097, -0.046] | 0.0001 | yes |
| BERTScore F1 | 0.8769 | 0.8934 | -0.0165 | [-0.022, -0.012] | 0.0001 | yes |
| Token F1 | 0.3307 | 0.3970 | -0.0663 | [-0.088, -0.045] | 0.0001 | yes |

### f2_final_Full vs baseline_4x300
Seeds: {'f2_final_Full': ['seed0', 'seed1', 'seed2'], 'baseline_4x300': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6250 | 0.6076 | +0.0174 | [-0.087, +0.125] | 0.7973 | no |
| Answers grounded (%) | 0.5417 | 0.6562 | -0.1146 | [-0.219, -0.007] | 0.0396 | yes |
| Answers misgrounded (%) | 0.3438 | 0.2188 | +0.1250 | [+0.031, +0.219] | 0.0119 | yes |
| Answers without authority (%) | 0.1146 | 0.1250 | -0.0104 | [-0.087, +0.062] | 0.8590 | no |
| Citation recall, per answer (%) | 0.6441 | 0.7257 | -0.0816 | [-0.175, +0.014] | 0.1020 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2630 | 0.3242 | -0.0612 | [-0.090, -0.033] | 0.0001 | yes |
| BERTScore F1 | 0.8769 | 0.8933 | -0.0164 | [-0.022, -0.011] | 0.0001 | yes |
| Token F1 | 0.3307 | 0.3911 | -0.0604 | [-0.086, -0.034] | 0.0001 | yes |

### f2_final_Full vs e4_repaired_Full
Seeds: {'f2_final_Full': ['seed0', 'seed1', 'seed2'], 'e4_repaired_Full': ['seed0', 'seed1']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6250 | 0.6302 | -0.0052 | [-0.102, +0.094] | 0.9456 | no |
| Answers grounded (%) | 0.5417 | 0.5833 | -0.0417 | [-0.134, +0.054] | 0.4131 | no |
| Answers misgrounded (%) | 0.3438 | 0.2760 | +0.0677 | [-0.017, +0.153] | 0.1347 | no |
| Answers without authority (%) | 0.1146 | 0.1406 | -0.0260 | [-0.094, +0.040] | 0.4833 | no |
| Citation recall, per answer (%) | 0.6441 | 0.6380 | +0.0061 | [-0.080, +0.095] | 0.9058 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2630 | 0.2565 | +0.0065 | [-0.014, +0.027] | 0.5349 | no |
| BERTScore F1 | 0.8769 | 0.8747 | +0.0021 | [-0.002, +0.006] | 0.2784 | no |
| Token F1 | 0.3307 | 0.3149 | +0.0157 | [-0.002, +0.034] | 0.0915 | no |

### f2_final_Full vs e0_legacy_checker_no_memory
Seeds: {'f2_final_Full': ['seed0', 'seed1', 'seed2'], 'e0_legacy_checker_no_memory': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6250 | 0.3438 | +0.2812 | [+0.191, +0.375] | 0.0001 | yes |
| Answers grounded (%) | 0.5417 | 0.3750 | +0.1667 | [+0.080, +0.254] | 0.0005 | yes |
| Answers misgrounded (%) | 0.3438 | 0.1944 | +0.1493 | [+0.066, +0.233] | 0.0014 | yes |
| Answers without authority (%) | 0.1146 | 0.4306 | -0.3160 | [-0.389, -0.246] | 0.0001 | yes |
| Citation recall, per answer (%) | 0.6441 | 0.3872 | +0.2569 | [+0.174, +0.340] | 0.0001 | yes |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2630 | 0.2459 | +0.0171 | [-0.001, +0.035] | 0.0695 | no |
| BERTScore F1 | 0.8769 | 0.8735 | +0.0033 | [-0.000, +0.007] | 0.0858 | no |
| Token F1 | 0.3307 | 0.3076 | +0.0231 | [+0.006, +0.041] | 0.0106 | yes |

### e4_repaired_Full vs baseline_4x300
Seeds: {'e4_repaired_Full': ['seed0', 'seed1'], 'baseline_4x300': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6302 | 0.6076 | +0.0226 | [-0.071, +0.115] | 0.6653 | no |
| Answers grounded (%) | 0.5833 | 0.6562 | -0.0729 | [-0.188, +0.047] | 0.2410 | no |
| Answers misgrounded (%) | 0.2760 | 0.2188 | +0.0573 | [-0.043, +0.158] | 0.2916 | no |
| Answers without authority (%) | 0.1406 | 0.1250 | +0.0156 | [-0.066, +0.094] | 0.7393 | no |
| Citation recall, per answer (%) | 0.6380 | 0.7257 | -0.0877 | [-0.201, +0.026] | 0.1389 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2565 | 0.3242 | -0.0677 | [-0.095, -0.041] | 0.0001 | yes |
| BERTScore F1 | 0.8747 | 0.8933 | -0.0186 | [-0.024, -0.013] | 0.0001 | yes |
| Token F1 | 0.3149 | 0.3911 | -0.0762 | [-0.102, -0.050] | 0.0001 | yes |

### e4_repaired_Full vs baseline_8x500
Seeds: {'e4_repaired_Full': ['seed0', 'seed1'], 'baseline_8x500': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6302 | 0.3472 | +0.2830 | [+0.181, +0.385] | 0.0001 | yes |
| Answers grounded (%) | 0.5833 | 0.3299 | +0.2535 | [+0.149, +0.358] | 0.0001 | yes |
| Answers misgrounded (%) | 0.2760 | 0.1042 | +0.1719 | [+0.085, +0.257] | 0.0004 | yes |
| Answers without authority (%) | 0.1406 | 0.5660 | -0.4253 | [-0.526, -0.326] | 0.0001 | yes |
| Citation recall, per answer (%) | 0.6380 | 0.3623 | +0.2758 | [+0.165, +0.390] | 0.0002 | yes |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2565 | 0.3285 | -0.0720 | [-0.098, -0.046] | 0.0001 | yes |
| BERTScore F1 | 0.8747 | 0.8940 | -0.0193 | [-0.025, -0.014] | 0.0001 | yes |
| Token F1 | 0.3149 | 0.3958 | -0.0809 | [-0.105, -0.057] | 0.0001 | yes |

### e4_repaired_Full vs e0_legacy_checker_no_memory
Seeds: {'e4_repaired_Full': ['seed0', 'seed1'], 'e0_legacy_checker_no_memory': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6302 | 0.3438 | +0.2865 | [+0.200, +0.373] | 0.0001 | yes |
| Answers grounded (%) | 0.5833 | 0.3750 | +0.2083 | [+0.116, +0.300] | 0.0002 | yes |
| Answers misgrounded (%) | 0.2760 | 0.1944 | +0.0816 | [+0.007, +0.158] | 0.0397 | yes |
| Answers without authority (%) | 0.1406 | 0.4306 | -0.2899 | [-0.368, -0.212] | 0.0001 | yes |
| Citation recall, per answer (%) | 0.6380 | 0.3872 | +0.2509 | [+0.163, +0.343] | 0.0001 | yes |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2565 | 0.2459 | +0.0106 | [-0.003, +0.025] | 0.1417 | no |
| BERTScore F1 | 0.8747 | 0.8735 | +0.0012 | [-0.002, +0.004] | 0.4191 | no |
| Token F1 | 0.3149 | 0.3076 | +0.0073 | [-0.007, +0.022] | 0.3297 | no |

### e0_legacy_checker_no_memory vs baseline_4x300
Seeds: {'e0_legacy_checker_no_memory': ['seed0', 'seed1', 'seed2'], 'baseline_4x300': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.3438 | 0.6076 | -0.2639 | [-0.358, -0.170] | 0.0001 | yes |
| Answers grounded (%) | 0.3750 | 0.6562 | -0.2813 | [-0.385, -0.177] | 0.0001 | yes |
| Answers misgrounded (%) | 0.1944 | 0.2188 | -0.0243 | [-0.118, +0.066] | 0.6579 | no |
| Answers without authority (%) | 0.4306 | 0.1250 | +0.3056 | [+0.226, +0.385] | 0.0001 | yes |
| Citation recall, per answer (%) | 0.3872 | 0.7257 | -0.3385 | [-0.434, -0.241] | 0.0001 | yes |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2459 | 0.3242 | -0.0783 | [-0.107, -0.050] | 0.0001 | yes |
| BERTScore F1 | 0.8735 | 0.8933 | -0.0198 | [-0.026, -0.014] | 0.0001 | yes |
| Token F1 | 0.3076 | 0.3911 | -0.0835 | [-0.112, -0.056] | 0.0001 | yes |

### f1_ledger_Full vs e4_repaired_Full
Seeds: {'f1_ledger_Full': ['seed0'], 'e4_repaired_Full': ['seed0', 'seed1']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.5729 | 0.6302 | -0.0573 | [-0.151, +0.031] | 0.2736 | no |
| Answers grounded (%) | 0.6146 | 0.5833 | +0.0312 | [-0.073, +0.130] | 0.6138 | no |
| Answers misgrounded (%) | 0.2500 | 0.2760 | -0.0260 | [-0.125, +0.073] | 0.6784 | no |
| Answers without authority (%) | 0.1354 | 0.1406 | -0.0052 | [-0.073, +0.068] | 1.0000 | no |
| Citation recall, per answer (%) | 0.6719 | 0.6380 | +0.0339 | [-0.062, +0.128] | 0.5216 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2558 | 0.2565 | -0.0006 | [-0.019, +0.018] | 0.9471 | no |
| BERTScore F1 | 0.8763 | 0.8747 | +0.0016 | [-0.002, +0.005] | 0.4292 | no |
| Token F1 | 0.3247 | 0.3149 | +0.0098 | [-0.012, +0.031] | 0.3635 | no |

### f3_retrieval_Full vs e4_repaired_Full
Seeds: {'f3_retrieval_Full': ['seed0'], 'e4_repaired_Full': ['seed0', 'seed1']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.6458 | 0.6302 | +0.0156 | [-0.104, +0.135] | 0.8578 | no |
| Answers grounded (%) | 0.6250 | 0.5833 | +0.0417 | [-0.073, +0.151] | 0.5223 | no |
| Answers misgrounded (%) | 0.2708 | 0.2760 | -0.0052 | [-0.099, +0.094] | 1.0000 | no |
| Answers without authority (%) | 0.1042 | 0.1406 | -0.0365 | [-0.120, +0.047] | 0.4602 | no |
| Citation recall, per answer (%) | 0.7500 | 0.6380 | +0.1120 | [+0.013, +0.211] | 0.0364 | yes |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.2593 | 0.2565 | +0.0028 | [-0.021, +0.027] | 0.8250 | no |
| BERTScore F1 | 0.8716 | 0.8747 | -0.0031 | [-0.008, +0.002] | 0.1958 | no |
| Token F1 | 0.3140 | 0.3149 | -0.0010 | [-0.024, +0.022] | 0.9351 | no |

### baseline_r7_4x300 vs baseline_4x300
Seeds: {'baseline_r7_4x300': ['seed0', 'seed1', 'seed2'], 'baseline_4x300': ['seed0', 'seed1', 'seed2']}

| Measure | A | B | Difference | 95% interval | p | Significant |
|---|---|---|---|---|---|---|
| Authority accuracy: answer rests on the target (%) | 0.7500 | 0.6076 | +0.1424 | [+0.042, +0.246] | 0.0094 | yes |
| Answers grounded (%) | 0.6285 | 0.6562 | -0.0278 | [-0.129, +0.073] | 0.6400 | no |
| Answers misgrounded (%) | 0.2604 | 0.2188 | +0.0417 | [-0.056, +0.139] | 0.4454 | no |
| Answers without authority (%) | 0.1111 | 0.1250 | -0.0139 | [-0.087, +0.059] | 0.7855 | no |
| Citation recall, per answer (%) | 0.7309 | 0.7257 | +0.0052 | [-0.076, +0.085] | 0.9122 | no |
| Answers citing a non-existent case (%) | 0.0000 | 0.0000 | +0.0000 | [+0.000, +0.000] | 1.0000 | no |
| ROUGE-L F1 | 0.3321 | 0.3242 | +0.0080 | [-0.007, +0.024] | 0.3378 | no |
| BERTScore F1 | 0.8956 | 0.8933 | +0.0023 | [-0.001, +0.005] | 0.1614 | no |
| Token F1 | 0.3979 | 0.3911 | +0.0068 | [-0.009, +0.023] | 0.4139 | no |
