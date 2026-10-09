# E5 — retrieval only

96 questions, 528,283 passages. "Found" = a passage of the target opinion is in the list.

## Single retrievers

| Retriever | Top 1 | Top 4 | Top 8 | Top 20 |
|---|---|---|---|---|
| legal-bert, question + jurisdiction (the debate's query) | 18 | 39 | 46 | 61 |
| legal-bert, question only (the earlier baseline's query) | 20 | 41 | 52 | 64 |
| bm25, whitespace tokens (the system's) | 50 | 74 | 80 | 87 |
| bm25, word tokens | 54 | 76 | 81 | 90 |
| bge-base-en-v1.5 (retrieval-trained) | 52 | 73 | 77 | 88 |
| all-MiniLM-L6-v2 (retrieval-trained) | 47 | 68 | 73 | 85 |

## Fused lists of 8 passages (what a debate round receives)

| Dense | Lexical | Depth each | Per-case limit | Target rank 1 | In top 4 | In top 8 | Distinct cases |
|---|---|---|---|---|---|---|---|
| bge-base-en-v1.5 (retrieval-trained) | bm25, word tokens | 20 | none | 61 | 73 | 84 | 3.8 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, word tokens | 20 | 2 | 61 | 73 | 84 | 5.67 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, whitespace tokens (the system's) | 8 | 2 | 58 | 75 | 83 | 5.08 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, whitespace tokens (the system's) | 20 | 2 | 62 | 74 | 83 | 5.78 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, word tokens | 20 | 2 | 54 | 73 | 83 | 5.75 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, word tokens | 4 | 2 | 50 | 72 | 83 | 4.03 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, word tokens | 8 | 2 | 51 | 72 | 83 | 5.04 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, word tokens | 4 | none | 50 | 71 | 83 | 4.03 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, word tokens | 8 | 2 | 58 | 77 | 82 | 4.96 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, whitespace tokens (the system's) | 4 | 2 | 57 | 75 | 82 | 3.82 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, whitespace tokens (the system's) | 8 | none | 58 | 75 | 82 | 4.04 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, whitespace tokens (the system's) | 4 | none | 57 | 74 | 82 | 3.82 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, whitespace tokens (the system's) | 20 | none | 62 | 73 | 82 | 3.84 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, word tokens | 8 | none | 51 | 71 | 82 | 4.2 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, word tokens | 20 | none | 54 | 71 | 82 | 4.04 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, word tokens | 4 | none | 56 | 76 | 81 | 3.61 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, word tokens | 4 | 2 | 56 | 76 | 81 | 3.61 |
| bge-base-en-v1.5 (retrieval-trained) | bm25, word tokens | 8 | none | 58 | 76 | 81 | 3.99 |
| legal-bert, question only (the earlier baseline's query) | bm25, word tokens | 8 | 2 | 36 | 69 | 81 | 6.18 |
| legal-bert, question only (the earlier baseline's query) | bm25, word tokens | 20 | 2 | 47 | 72 | 80 | 6.36 |
| legal-bert, question only (the earlier baseline's query) | bm25, word tokens | 8 | none | 36 | 69 | 80 | 5.26 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, whitespace tokens (the system's) | 4 | 2 | 49 | 69 | 80 | 4.15 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, whitespace tokens (the system's) | 8 | 2 | 51 | 69 | 80 | 5.2 |
| legal-bert, question only (the earlier baseline's query) | bm25, word tokens | 4 | none | 28 | 68 | 80 | 5.08 |
| legal-bert, question only (the earlier baseline's query) | bm25, word tokens | 4 | 2 | 28 | 68 | 80 | 5.08 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, whitespace tokens (the system's) | 4 | none | 49 | 68 | 80 | 4.15 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, whitespace tokens (the system's) | 8 | none | 51 | 68 | 80 | 4.3 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, word tokens | 8 | 2 | 37 | 69 | 79 | 6.34 |
| legal-bert, question only (the earlier baseline's query) | bm25, whitespace tokens (the system's) | 20 | none | 47 | 68 | 79 | 5.07 |
| legal-bert, question only (the earlier baseline's query) | bm25, whitespace tokens (the system's) | 20 | 2 | 47 | 68 | 79 | 6.4 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, whitespace tokens (the system's) | 20 | 2 | 52 | 65 | 79 | 5.82 |
| legal-bert, question only (the earlier baseline's query) | bm25, word tokens | 20 | none | 47 | 72 | 78 | 5.0 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, word tokens | 20 | 2 | 47 | 71 | 78 | 6.45 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, word tokens | 8 | none | 37 | 69 | 78 | 5.35 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, word tokens | 4 | none | 29 | 68 | 78 | 5.14 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, word tokens | 4 | 2 | 29 | 68 | 78 | 5.14 |
| legal-bert, question only (the earlier baseline's query) | bm25, whitespace tokens (the system's) | 8 | 2 | 37 | 65 | 78 | 6.2 |
| all-MiniLM-L6-v2 (retrieval-trained) | bm25, whitespace tokens (the system's) | 20 | none | 52 | 65 | 78 | 4.07 |
| legal-bert, question only (the earlier baseline's query) | bm25, whitespace tokens (the system's) | 4 | 2 | 27 | 64 | 78 | 5.12 |
| legal-bert, question only (the earlier baseline's query) | bm25, whitespace tokens (the system's) | 8 | none | 37 | 64 | 78 | 5.3 |
| legal-bert, question only (the earlier baseline's query) | bm25, whitespace tokens (the system's) | 4 | none | 27 | 63 | 78 | 5.12 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, word tokens | 20 | none | 47 | 70 | 77 | 5.09 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, whitespace tokens (the system's) | 20 | 2 | 46 | 65 | 77 | 6.46 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, whitespace tokens (the system's) | 20 | none | 46 | 64 | 77 | 5.2 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, whitespace tokens (the system's) | 4 | 2 | 29 | 63 | 76 | 5.17 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, whitespace tokens (the system's) | 8 | 2 | 35 | 63 | 76 | 6.34 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, whitespace tokens (the system's) | 4 | none | 29 | 62 | 76 | 5.17 |
| legal-bert, question + jurisdiction (the debate's query) | bm25, whitespace tokens (the system's) | 8 | none | 35 | 62 | 76 | 5.36 |

Selecting the best configuration on these 96 questions and reporting it on the same questions is optimistic; treat the ranking of configurations as the finding, not the best number.
