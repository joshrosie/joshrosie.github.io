# Flywheel results: captions and data notes

## 1. The scores improve
Crystalite's reported metastable–unique–novel (MSUN) rate increases from 22.60% to 29.34% and 35.06% over two Flywheel rounds. Raw and deduplicated synthetic-data controls use the same training-set size as round 1. The darker bars additionally exclude outputs matching each model's accumulated synthetic training additions. All percentages are over valid evaluated samples; “metastable” denotes the benchmark's computational energy-above-hull criterion. These are surrogate-model estimates, not experimental confirmations. Strictly stable, train-novel SUN stayed near 1.5% across rounds (1.50%, 1.58%, 1.54%).

Source: thesis Tables 4.4–4.6, PDF pages 37–38.

| Model | Reported MSUN (%) | Excluding regenerated training structures (%) |
|---|---:|---:|
| Crystalite baseline | 22.60 | 22.60 |
| Raw synthetic data | 24.19 | 20.91 |
| Deduplicated synthetic data | 24.29 | 22.91 |
| Flywheel round 1 | 29.34 | 26.10 |
| Flywheel round 2 | 35.06 | 30.75 |

## 2. The chemistry shifts
Lanthanide-bearing structures become more frequent in the curated training additions: 35.5% in the original MP-20 dataset, 46.0% in S₀, and 51.5% in S₁. The curated additions also shift toward compositions containing more distinct elements. S₀ contains accepted outputs from the baseline generator and is added before training round 1; S₁ contains accepted outputs from the round-1 generator and is added before training round 2. These are not distributions of the full cumulative training sets or raw, unfiltered generator outputs. Composition-size percentages are approximate values reported in the thesis, and only selected arities are shown.

Source: thesis Section 4.5 and Figures 4.8–4.9, PDF pages 38–40.

| Dataset | Contains a lanthanide (%) | 3 elements (%) | 4 elements (%) | 5 elements (%) |
|---|---:|---:|---:|---:|
| MP-20 | 35.5 | 58 | 18 | 2.5 |
| S₀ | 46.0 | 52 | 26 | 4.5 |
| S₁ | 51.5 | 44 | 34 | 8 |

## 3. The scores improve?
To investigate substitutional novelty, every lanthanide site in candidates and MP-20 references is relabelled as La while lattice parameters, fractional coordinates and other species remain unchanged. Structural matching is rerun at LeMat's matching tolerances. The composition illustration is schematic: equal anonymized formulas alone do not imply equal structures. Each round's reported MSUN is partitioned in order into regenerated synthetic training examples, additional matches exposed only by lanthanide anonymization, and the remainder. The final remainder is 28.01% of valid samples at round 2. Baseline and control models were not subjected to the same anonymization check, so no identically filtered baseline comparison is shown. Matching uses MP-20 as the anonymization reference, whereas LeMat judges novelty against LeMat-Bulk; the all-lanthanides-to-La mapping can also merge chemically distinct cases. The remaining category is specific to this test and is not proof of experimentally new crystal frameworks. Components and totals are independently rounded and can differ by 0.01 percentage points.

Source: thesis Table 4.7 and Appendix H, PDF pages 40 and 79–80.

| Model | Remaining MSUN (pp) | Lanthanide substitutions (pp) | Regeneration (pp) | Reported MSUN (%) |
|---|---:|---:|---:|---:|
| Flywheel round 1 | 23.90 | 2.20 | 3.24 | 29.34 |
| Flywheel round 2 | 28.01 | 2.74 | 4.32 | 35.06 |

All figures use thesis-reported values. PNG versions are ready to embed; SVG versions preserve editable text and vectors.
