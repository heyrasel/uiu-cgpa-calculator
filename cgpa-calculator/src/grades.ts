import type { GradeLetter, NumericBand, Settings } from './types'

export const defaultGradePoints: Record<GradeLetter, number> = {
  'A': 4.0, 'A-': 3.67, 'B+': 3.33, 'B': 3.0, 'B-': 2.67,
  'C+': 2.33, 'C': 2.0, 'C-': 1.67, 'D+': 1.33, 'D': 1.0, 'F': 0.0
}

export const defaultBands: NumericBand[] = [
  { min: 90, max: 100, grade: 'A' },
  { min: 86, max: 89, grade: 'A-' },
  { min: 82, max: 85, grade: 'B+' },
  { min: 78, max: 81, grade: 'B' },
  { min: 74, max: 77, grade: 'B-' },
  { min: 70, max: 73, grade: 'C+' },
  { min: 66, max: 69, grade: 'C' },
  { min: 62, max: 65, grade: 'C-' },
  { min: 58, max: 61, grade: 'D+' },
  { min: 55, max: 57, grade: 'D' },
  { min: 0, max: 54, grade: 'F' },
]

export const defaultSettings: Settings = {
  gradePoints: defaultGradePoints,
  numericToLetter: defaultBands,
  retakePolicy: 'replace_last',
  passFail: { enabled: true, passAffectsCGPA: false, failCountsAsF: true },
  withdrawIncomplete: { W_excluded: true, I_excluded: true },
  scale: { maxCGPA: 4.0, minGraduate: 2.0, roundTo: 2 }
}

export function toLetterFromNumeric(n: number, bands: NumericBand[] = defaultBands): GradeLetter {
  const band = bands.find(b => n >= b.min && n <= b.max)
  return band ? band.grade : 'F'
}
