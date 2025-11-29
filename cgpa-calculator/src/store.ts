import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Course, Settings, Trimester, PriorAggregate, RetakeEntry } from './types'
import { defaultSettings } from './grades'

export type AppState = {
  settings: Settings
  trimesters: Trimester[]
  courses: Course[]
  prior: PriorAggregate
  retakes: RetakeEntry[]
  addTrimester: () => void
  addCourse: (c: Omit<Course, 'id'>) => void
  updateCourse: (id: string, patch: Partial<Course>) => void
  deleteCourse: (id: string) => void
  setPrior: (p: Partial<PriorAggregate>) => void
  addRetake: (r: Omit<RetakeEntry, 'id'>) => void
  updateRetake: (id: string, patch: Partial<RetakeEntry>) => void
  deleteRetake: (id: string) => void
  reset: () => void
}

let counter = 0
const uuid = () => `${Date.now()}_${counter++}`

export const useApp = create<AppState>()(persist((set, get) => ({
  settings: defaultSettings,
  trimesters: [{ id: uuid(), index: 1 }],
  courses: [],
  prior: { completedCredits: 0, currentCGPA: 0 },
  retakes: [],
  addTrimester: () => set(s => ({ trimesters: [...s.trimesters, { id: uuid(), index: s.trimesters.length + 1 }] })),
  addCourse: (c) => set(s => ({ courses: [...s.courses, { id: uuid(), ...c }] })),
  updateCourse: (id, patch) => set(s => ({ courses: s.courses.map(x => x.id === id ? { ...x, ...patch } : x) })),
  deleteCourse: (id) => set(s => ({ courses: s.courses.filter(x => x.id !== id) })),
  setPrior: (p) => set(s => ({ prior: { ...s.prior, ...p } })),
  addRetake: (r) => set(s => ({ retakes: [...s.retakes, { id: uuid(), ...r }] })),
  updateRetake: (id, patch) => set(s => ({ retakes: s.retakes.map(x => x.id === id ? { ...x, ...patch } : x) })),
  deleteRetake: (id) => set(s => ({ retakes: s.retakes.filter(x => x.id !== id) })),
  reset: () => set({ settings: defaultSettings, trimesters: [{ id: uuid(), index: 1 }], courses: [], retakes: [], prior: { completedCredits: 0, currentCGPA: 0 } })
}), { name: 'cgpa-calculator' }))
