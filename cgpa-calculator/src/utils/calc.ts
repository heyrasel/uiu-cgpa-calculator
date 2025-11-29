import type { Course, Settings, Trimester, PriorAggregate, RetakeEntry } from '../types'

function gradeToPoint(course: Course, settings: Settings): number | null {
  if (course.withdrawn && settings.withdrawIncomplete.W_excluded) return null
  if (course.incomplete && settings.withdrawIncomplete.I_excluded) return null
  if (course.passFail && settings.passFail.enabled) {
    if (course.gradeLetter === 'F' && settings.passFail.failCountsAsF) return 0
    // P does not affect CGPA
    return null
  }
  const letter = course.gradeLetter ?? undefined
  if (!letter) return null
  return settings.gradePoints[letter]
}

export function calcGPA(courses: Course[], settings: Settings) {
  let quality = 0
  let credits = 0
  for (const c of courses) {
    const gp = gradeToPoint(c, settings)
    if (gp === null) continue
    quality += gp * c.credits
    credits += c.credits
  }
  const gpa = credits > 0 ? quality / credits : 0
  return { gpa, credits }
}

export function groupByTrimester(courses: Course[]): Record<string, Course[]> {
  return courses.reduce((acc, c) => {
    (acc[c.trimesterId] ||= []).push(c)
    return acc
  }, {} as Record<string, Course[]>)
}

export function applyRetakes(courses: Course[]): Course[] {
  // keep latest attempt (by insertion order) per retakeGroupId if present
  const latestByGroup = new Map<string, Course>()
  const output: Course[] = []
  for (const c of courses) {
    if (c.retakeGroupId) {
      latestByGroup.set(c.retakeGroupId, c)
    } else {
      output.push(c)
    }
  }
  return [...output, ...latestByGroup.values()]
}

export function calcAll(trimesters: Trimester[], courses: Course[], settings: Settings, prior?: PriorAggregate) {
  const effective = applyRetakes(courses)
  const byTri = groupByTrimester(effective)
  const perTrimester = trimesters.map(t => {
    const list = byTri[t.id] || []
    const { gpa } = calcGPA(list, settings)
    return { trimesterId: t.id, index: t.index, gpa }
  })
  if (!prior) {
    const { gpa: cgpa } = calcGPA(effective, settings)
    return { perTrimester, cgpa }
  }
  // Build from prior aggregate
  let priorCredits = Math.max(0, prior.completedCredits || 0)
  let priorQuality = (prior.currentCGPA || 0) * priorCredits

  // Adjust prior for any declared retakes this trimester
  for (const c of effective) {
    if (c.isRetake && c.prevCredits && c.prevGradeLetter) {
      priorCredits -= c.prevCredits
      priorQuality -= settings.gradePoints[c.prevGradeLetter] * c.prevCredits
    }
  }

  // Current term contributions
  let termQuality = 0
  let termCredits = 0
  for (const c of effective) {
    const gp = gradeToPoint(c, settings)
    if (gp === null) continue
    termQuality += gp * c.credits
    termCredits += c.credits
  }

  const totalCredits = priorCredits + termCredits
  const totalQuality = priorQuality + termQuality
  const cgpa = totalCredits > 0 ? totalQuality / totalCredits : 0
  return { perTrimester, cgpa }
}

export function calcWithRetakes(prior: PriorAggregate, courses: Course[], retakes: RetakeEntry[], settings: Settings) {
  // Adjust prior with previous attempts
  let priorCredits = Math.max(0, prior.completedCredits || 0)
  let priorQuality = (prior.currentCGPA || 0) * priorCredits
  for (const r of retakes) {
    priorCredits -= r.credits
    priorQuality -= settings.gradePoints[r.prevGradeLetter] * r.credits
  }

  // Build term list including retake current attempts
  const retakeAsCourses: Course[] = retakes.map((r, i) => ({
    id: `retake_${i}`,
    code: '',
    credits: r.credits,
    gradeLetter: r.currentGradeLetter,
    trimesterId: 'current'
  }))
  const termList: Course[] = [...courses, ...retakeAsCourses]

  const { gpa: termGPA, credits: termCredits } = calcGPA(termList, settings)
  let termQuality = 0
  for (const c of termList) {
    const gp = gradeToPoint(c, settings)
    if (gp === null) continue
    termQuality += gp * c.credits
  }

  const totalCredits = priorCredits + termCredits
  const totalQuality = priorQuality + termQuality
  const newCGPA = totalCredits > 0 ? totalQuality / totalCredits : 0
  return { termGPA, termCredits, newCGPA }
}
