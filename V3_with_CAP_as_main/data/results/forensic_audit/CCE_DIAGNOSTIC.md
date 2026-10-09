# Citation checker (CCE) diagnostic

Sources: `diagnostics.json` (`nli_sanity`, `case_resolution`, `evidence_coverage`),
`diagnostics_name_variants.json`, the existing stress-test and evidence-study files. No LLM was called
and the stress test was not re-run; the 20-citation coverage test re-scores 20 of its labelled citations
to see *where* the score comes from.

## 1. NLI sanity — the scoring code is correct

| Check | Result |
|---|---|
| Model | `cross-encoder/nli-deberta-v3-small`, max 512 tokens |
| Label map in the model config | 0 contradiction, 1 entailment, 2 neutral |
| Index the checker uses for entailment | 1 |
| Raw output of `predict` | logits (rows do not sum to 1) |
| Normalisation in the checker | one softmax; no double normalisation |
| Obvious entailment / contradiction / neutral pairs labelled correctly | 6 of 6 |
| Entailment probability, premise first (as the checker does) | 0.996, 0.000, 0.000, 0.991, 0.000, 0.000 |
| Same pairs with the order swapped | 0.003, 0.000, 0.000, 0.002, 0.000, 0.000 |

Label mapping, probability normalisation and premise/hypothesis order are **not** the cause of the low
acceptance rate.

## 2. Case resolution — citations reach the right opinion

- All 96 benchmark targets resolve to an opinion (reporter cite confirmed for the 71 that give one; 25 give none).
- By name alone, 95 of 96 resolve to the same opinion; *United States v. Jones* is ambiguous by name.
- One real case in five surface forms (plain, year suffix, cite suffix, `(cite) [CAP]` decoration, "vs.")
  resolves to the same opinion through `compute_ccs` each time. The bare surname "Gideon" is `UNVERIFIABLE`.
- Cost: a name that is not an exact catalog entry is fuzzy-matched against 313,611 names, up to 4.6 s per citation.

Resolution is **not** the cause either.

## 3. Evidence coverage — 20 correct citations from the labelled set

The checker reads the 3 passages of the opinion nearest to the holding in embedding space, cuts the joined
text at 8,000 characters, and scores 450-character windows.

| Quantity (20 correct citations) | Value |
|---|---|
| Accepted as deployed | 8 |
| Share of the opinion read | median 7.2% (range 1.9%–30.7%) |
| Characters cut off by the 8,000 limit | median 332, maximum 887 |
| Share of the holding's content words present in the text read | mean 87% |
| Snippet shown to the judge is the window that produced the score | 2 of 20 |
| The opinion's best-entailing passage was among the 3 read | 5 of 20 |
| Rejected (12): a passage elsewhere in the opinion scores ≥ 0.70 | 6 |
| Rejected (12): **no** passage of the whole opinion scores ≥ 0.70 | 6 |

Per citation (support as deployed → best score anywhere in the opinion):

| Case | Passages in opinion | Deployed support | Tier | Best anywhere | Best passage read? |
|---|---|---|---|---|---|
| United States v. Jacobsen | 31 | 0.008 | MISATTRIBUTED | 0.216 | no |
| Roper v. Simmons | 66 | 0.147 | MISATTRIBUTED | 0.942 | no |
| Terry v. Ohio | 32 | 0.949 | SUPPORTED | 0.977 | no |
| Miranda v. Arizona | 94 | 0.896 | SUPPORTED | 0.988 | no |
| Gideon v. Wainwright | 15 | 0.025 | MISATTRIBUTED | 0.023 | no |
| Brady v. Maryland | 10 | 0.968 | SUPPORTED | 0.968 | yes |
| Mapp v. Ohio | 38 | 0.031 | MISATTRIBUTED | 0.045 | yes |
| Strickland v. Washington | 43 | 0.658 | UNCERTAIN | 0.985 | no |
| Riley v. California | 34 | 0.979 | SUPPORTED | 0.983 | no |
| Carpenter v. United States | 99 | 0.066 | MISATTRIBUTED | 0.833 | no |
| Graham v. Florida | 64 | 0.013 | MISATTRIBUTED | 0.900 | no |
| Miller v. Alabama | 48 | 0.012 | MISATTRIBUTED | 0.987 | no |
| Katz v. United States | 24 | 0.767 | SUPPORTED | 0.902 | no |
| Batson v. Kentucky | 54 | 0.987 | SUPPORTED | 0.952 | yes |
| Daubert v. Merrell Dow | 19 | 0.009 | MISATTRIBUTED | 0.206 | no |
| Chevron v. NRDC | 26 | 0.976 | SUPPORTED | 0.918 | yes |
| New York Times v. Sullivan | 49 | 0.036 | MISATTRIBUTED | 0.214 | no |
| Citizens United v. FEC | 150 | 0.013 | MISATTRIBUTED | 0.836 | no |
| Brown v. Board of Education | 12 | 0.008 | MISATTRIBUTED | 0.015 | yes |
| District of Columbia v. Heller | 140 | 0.737 | SUPPORTED | 0.995 | no |

Two distinct failures, about equally frequent in this sample:

1. **The entailing passage exists and is not read** (*Roper*, *Carpenter*, *Graham*, *Miller*, *Citizens United*,
   *Strickland*). Dense similarity to the holding picks passages that share the holding's vocabulary (87% of its
   content words), not the passage that states it.
2. **No 450-character window of the opinion entails the reference holding** (*Gideon*, *Brown*, *Mapp*, *Jacobsen*,
   *Daubert*, *Sullivan*). The reference holding is a one-sentence synthesis; the opinion never states it in
   one place in words a general-domain NLI model accepts. *Gideon* and *Brown* score 0.02.

Reading more of the opinion repairs failure 1 and worsens false acceptance (whole opinion: 60 of 96 correct but
also 24 of 96 swapped holdings accepted). Failure 2 is not repairable by evidence selection at all.

## 4. Is there a threshold that works? No.

From the existing stress test (`support` of each labelled citation):

- Correct citations: mean support 0.283, **median 0.046**; 55 of 96 score below 0.10.
- Swapped holdings: mean 0.080, median 0.015.
- Area under the ROC curve, correct against swapped: **0.70**. For every passage selection in the evidence
  study the AUC lies between 0.69 and 0.74.

| Threshold | Correct accepted (of 96) | Swapped accepted (of 96) |
|---|---|---|
| 0.10 | 41 | 13 |
| 0.30 | 28 | 6 |
| 0.50 | 26 | 5 |
| 0.70 (deployed) | 22 | 5 |
| 0.75 (named in the judge prompt) | 20 | 4 |
| 0.90 | 14 | 2 |

Lowering the threshold from 0.70 to 0.10 gains 19 correct citations and admits 8 more swapped ones. The scores
are bimodal (near 0 or near 1), so the threshold barely matters; the model either fires on a window or it does not.

## 5. In live debates

Tiers assigned to the agents' own citations (from the run logs): Full run 580 citations — 225 supported
(38.8%), 52 uncertain, 287 misattributed (49.5%), 0 fabricated, 16 unverifiable. A3 run 833 citations —
335 supported (40.2%), 406 misattributed, 0 fabricated. The agents never produced a citation the checker
called fabricated; almost all of the checker's negative verdicts in live use are `MISATTRIBUTED`, the label
with a 72% false-positive rate on correct citations in the stress test.

## Conclusion

| Hypothesis | Verdict |
|---|---|
| Wrong label mapping, logits misused, wrong premise/hypothesis order | **Not a cause** (verified) |
| Citation resolved to the wrong case or not to an opinion | **Not a cause** (96 of 96) |
| Name variants fail | **Not a cause** in the checker (they do fail in the HR metric) |
| 8,000-character truncation | **Minor** (median 332 characters) |
| Three passages are too little of the opinion | **Contributor** (half of the sampled false rejections) |
| General-domain NLI on 450-character windows cannot decide "this opinion holds X" | **Root cause** (AUC 0.70 regardless of evidence; half of the sampled false rejections have no entailing window anywhere) |
| Threshold 0.70 / 0.75 too strict | **Not a cause**: no threshold separates the classes |
