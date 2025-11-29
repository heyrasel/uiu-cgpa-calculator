export type GradeLetter = 'A'|'A-'|'B+'|'B'|'B-'|'C+'|'C'|'C-'|'D+'|'D'|'F'

export type NumericBand = { min: number; max: number; grade: GradeLetter }

export type RetakePolicy = 'replace_last'

export type Course = {
  id: string
  code: string
  title?: string
  credits: number
  gradeLetter?: GradeLetter
  numericGrade?: number
  trimesterId: string
  passFail?: boolean
  withdrawn?: boolean
  incomplete?: boolean
  retakeGroupId?: string
  // Simplified retake adjustment when using prior aggregates
  isRetake?: boolean
  prevGradeLetter?: GradeLetter
  prevCredits?: number
}

export type Trimester = { id: string; index: number; year?: number }

export type Settings = {
  gradePoints: Record<GradeLetter, number>
  numericToLetter: NumericBand[]
  retakePolicy: RetakePolicy
  passFail: { enabled: boolean; passAffectsCGPA: boolean; failCountsAsF: boolean }
  withdrawIncomplete: { W_excluded: boolean; I_excluded: boolean }
  scale: { maxCGPA: number; minGraduate: number; roundTo: number }
}

export type PriorAggregate = {
  completedCredits: number
  currentCGPA: number
}

export type RetakeEntry = {
  id: string
  credits: number
  prevGradeLetter: GradeLetter
  currentGradeLetter: GradeLetter
}
