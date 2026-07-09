# Pumbility Formula Reference

Documentation of the Pump It Up (PIU) pumbility calculation, used to determine
Advanced/Expert title progress. Pumbility is drawn from a player's top 50
chart scores.

## Level Base

```
levelBase = 130 + 5 * MIN(levelNumber, 24) + 10 * MAX(0, levelNumber - 24)
```

- Increments by 5 per level from level 1 up through S23/D24.
- Increments by 10 per level from S24/D25 onward.
- `levelNumber` is the chart's numeric level (the number after the S/D
  prefix), regardless of Single/Double.

## Grade Multipliers

| Grade | Multiplier |
|-------|-----------|
| SSS+  | 1.50 |
| SSS   | 1.49 |
| SS+   | 1.48 |
| SS    | 1.47 |
| S+    | 1.46 |
| S     | 1.45 |
| AAA+  | 1.43 |
| AAA   | 1.41 |
| AA+   | 1.39 |
| AA    | 1.37 |
| A+    | 1.35 |

## Plate Bonus Multipliers

Applied as a bonus added on top of the grade-multiplied base (see formula
below). UG has separate values for Single (S) vs Double (D) charts.

| Plate | Multiplier |
|-------|-----------|
| PG    | 0.020 |
| UG (S)| 0.017 |
| UG (D)| 0.016 |
| EG    | 0.014 |
| SG    | 0.008 |
| MG    | 0.006 |
| TG    | 0.004 |
| FG    | 0.002 |
| RG    | 0.000 |

## Pumbility Formula

```
pumbility = levelBase * gradeMultiplier + levelBase * plateMultiplier
          = levelBase * (gradeMultiplier + plateMultiplier)
```

## Worked Examples

**SSS+ PG on D16:**
```
levelBase = 130 + 5*16       = 210
gradeBonus = 210 * 1.5       = 315
plateBonus = 210 * 0.02      = 4.2
pumbility  = 315 + 4.2       = 319.2
```

**SSS+ UG on S24:**

> Note: the 5-per-level increment applies through level 24 (S23/D24), and
> the 10-per-level increment begins at level 25 (S24/D25) — independent of
> Single/Double. So an S24 chart's level base uses one 10-point step above
> the level-24 base.
```
levelBase  = 130 + 5*24 + 10*1 = 260
gradeBonus = 260 * 1.5         = 390
plateBonus = 260 * 0.017       = 4.42
pumbility  = 390 + 4.42        = 394.42
```

## Passes Needed for a Target Pumbility

Assuming all 50 counted charts are the same level/grade/plate (worst case /
raw-pass estimate):

```
passesNeeded = CEILING(targetPumbility / pumbility, 1)
```

Capped at 50, since only the top 50 chart scores count toward pumbility.

**Example — raw RG A+ passes on D20 for Advanced Lv. 1 (15,000 pumbility):**
```
levelBase  = 130 + 5*20 = 230
pumbility  = 230 * (1.35 + 0) = 310.5
passes     = CEILING(15000 / 310.5) = 49  -> capped at 50 (all D20 charts)
```

## Title Thresholds (reference)

| Title | Pumbility |
|-------|-----------|
| Advanced Lv. 1 | 15,000 |
| Expert Lv. 1   | 18,000 |

*(Add further tiers here as needed.)*
