// Pumbility formula, multipliers, and title thresholds for Pump It Up Phoenix 2.
// These values are specific to Phoenix 2 and will need updating for future versions.

export type ChartType = 'S' | 'D'
export type Grade = [name: string, multiplier: number]
export type Plate = [name: string, multiplier: number]
export type Title = [name: string, pumbility: number]

export const grades: Grade[] = [
  ['SSS+', 1.50], ['SSS', 1.49], ['SS+', 1.48], ['SS', 1.47],
  ['S+', 1.46], ['S', 1.45], ['AAA+', 1.43], ['AAA', 1.41],
  ['AA+', 1.39], ['AA', 1.37], ['A+', 1.35],
]

export const gradeMultipliers: Record<string, number> = Object.fromEntries(grades)

/** Phoenix 1 letter grade boundaries by score (out of 1,000,000), ascending. Kept for reference. */
export const phx1GradeBoundaries: [minScore: number, name: string][] = [
  [995000, 'SSS+'],
  [990000, 'SSS'],
  [985000, 'SS+'],
  [980000, 'SS'],
  [975000, 'S+'],
  [970000, 'S'],
  [960000, 'AAA+'],
  [950000, 'AAA'],
  [925000, 'AA+'],
  [900000, 'AA'],
  [825000, 'A+'],
  [750000, 'A'],
  [650000, 'B'],
  [550000, 'C'],
  [450000, 'D'],
  [0, 'F'],
]

/**
 * Phoenix 2 letter grade boundaries by score (out of 1,000,000), ascending.
 * The 900k-950k range was redrawn in Phoenix 2 (A+/AA/AA+ tiers now span
 * 900-920/920-940/940-950k instead of Phoenix 1's single 900k AA cutoff);
 * everything from AAA (950k) up is unchanged from Phoenix 1.
 */
export const phx2GradeBoundaries: [minScore: number, name: string][] = [
  [995000, 'SSS+'],
  [990000, 'SSS'],
  [985000, 'SS+'],
  [980000, 'SS'],
  [975000, 'S+'],
  [970000, 'S'],
  [960000, 'AAA+'],
  [950000, 'AAA'],
  [940000, 'AA+'],
  [920000, 'AA'],
  [900000, 'A+'],
  [750000, 'A'],
]

/**
 * Recomputes the Phoenix 2 letter grade from a raw score. Scores below the
 * lowest Phoenix 2 boundary (750k, below which grades are unchanged from
 * Phoenix 1) fall back to the grade already recorded for the score.
 */
export function phx2GradeForScore(score: number, fallbackGrade: string): string {
  for (const [minScore, name] of phx2GradeBoundaries) {
    if (score >= minScore) return name
  }
  return fallbackGrade
}

/** Plate multipliers, keyed by in-game plate name. UG differs between Single and Double. */
export const platesByName: Record<string, Record<ChartType, number>> = {
  'Perfect Game': { S: 0.020, D: 0.020 },
  'Ultimate Game': { S: 0.017, D: 0.016 },
  'Extreme Game': { S: 0.014, D: 0.014 },
  'Superb Game': { S: 0.008, D: 0.008 },
  'Marvelous Game': { S: 0.006, D: 0.006 },
  'Talented Game': { S: 0.004, D: 0.004 },
  'Fair Game': { S: 0.002, D: 0.002 },
  'Rough Game': { S: 0.000, D: 0.000 },
}

/** Short plate codes (PG/UG/EG/...) paired with in-game plate names, in display order. */
export const plateCodesByName: [code: string, name: string][] = [
  ['PG', 'Perfect Game'],
  ['UG', 'Ultimate Game'],
  ['EG', 'Extreme Game'],
  ['SG', 'Superb Game'],
  ['MG', 'Marvelous Game'],
  ['TG', 'Talented Game'],
  ['FG', 'Fair Game'],
  ['RG', 'Rough Game'],
]

export function platesFor(chartType: ChartType): Plate[] {
  return plateCodesByName.map(([code, name]) => [code, platesByName[name][chartType]])
}

export const titlesByType: Record<ChartType, Title[]> = {
  S: [
    ['Intermediate Lv. 1', 5000], ['Intermediate Lv. 2', 6000], ['Intermediate Lv. 3', 7000],
    ['Intermediate Lv. 4', 8000], ['Intermediate Lv. 5', 9000], ['Intermediate Lv. 6', 10000],
    ['Intermediate Lv. 7', 11000], ['Intermediate Lv. 8', 12000], ['Intermediate Lv. 9', 13000],
    ['Intermediate Lv. 10', 14000],
    ['Advanced Lv. 1', 15000], ['Advanced Lv. 2', 15250], ['Advanced Lv. 3', 15500],
    ['Advanced Lv. 4', 15750], ['Advanced Lv. 5', 16000], ['Advanced Lv. 6', 16250],
    ['Advanced Lv. 7', 16500], ['Advanced Lv. 8', 16750], ['Advanced Lv. 9', 17000],
    ['Advanced Lv. 10', 17250],
    ['Expert Lv. 1', 17500], ['Expert Lv. 2', 17700], ['Expert Lv. 3', 17900],
    ['Expert Lv. 4', 18100], ['Expert Lv. 5', 18300], ['Expert Lv. 6', 18500],
    ['Expert Lv. 7', 18600], ['Expert Lv. 8', 18700], ['Expert Lv. 9', 18800],
    ['Expert Lv. 10', 18900],
    ['Master', 19000],
  ],
  D: [
    ['Intermediate Lv. 1', 5000], ['Intermediate Lv. 2', 6000], ['Intermediate Lv. 3', 7000],
    ['Intermediate Lv. 4', 8000], ['Intermediate Lv. 5', 9000], ['Intermediate Lv. 6', 10000],
    ['Intermediate Lv. 7', 11000], ['Intermediate Lv. 8', 12000], ['Intermediate Lv. 9', 13000],
    ['Intermediate Lv. 10', 14000],
    ['Advanced Lv. 1', 15000], ['Advanced Lv. 2', 15300], ['Advanced Lv. 3', 15600],
    ['Advanced Lv. 4', 15900], ['Advanced Lv. 5', 16200], ['Advanced Lv. 6', 16500],
    ['Advanced Lv. 7', 16800], ['Advanced Lv. 8', 17100], ['Advanced Lv. 9', 17400],
    ['Advanced Lv. 10', 17700],
    ['Expert Lv. 1', 18000], ['Expert Lv. 2', 18200], ['Expert Lv. 3', 18400],
    ['Expert Lv. 4', 18600], ['Expert Lv. 5', 18800], ['Expert Lv. 6', 19000],
    ['Expert Lv. 7', 19100], ['Expert Lv. 8', 19200], ['Expert Lv. 9', 19300],
    ['Expert Lv. 10', 19400],
    ['Master', 19500],
  ],
}

export function levelBaseFor(levelNumber: number): number {
  return 130 + 5 * Math.min(levelNumber, 24) + 10 * Math.max(0, levelNumber - 24)
}

export function pumbilityFor(levelNumber: number, gradeMultiplier: number, plateMultiplier: number): number {
  return levelBaseFor(levelNumber) * (gradeMultiplier + plateMultiplier)
}

/** Highest title reached for a given total pumbility, or undefined if below the first tier. */
export function titleReached(chartType: ChartType, totalPumbility: number): Title | undefined {
  const titles = titlesByType[chartType]
  let reached: Title | undefined
  for (const title of titles) {
    if (totalPumbility >= title[1]) reached = title
    else break
  }
  return reached
}
