import { useMemo, useState } from 'react'
import { useApp } from './store'
import { calcAll, calcGPA, calcWithRetakes } from './utils/calc'
import { Calculator, Trash2 } from 'lucide-react'

export default function App() {
  const { courses, settings, reset, prior, setPrior, addCourse, updateCourse, deleteCourse, retakes, addRetake, updateRetake, deleteRetake } = useApp()
  const [showResult, setShowResult] = useState<{ termGPA: number; newCGPA: number; totalCompletedCredits: number } | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const termStats = useMemo(() => calcGPA(courses, settings), [courses, settings])
  const termGPA = termStats.gpa
  const termCredits = termStats.credits
  const computed = useMemo(() => calcAll([{ id: 'current', index: 1 }], courses, settings, prior), [courses, settings, prior])
  const newCGPA = computed.cgpa

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-fuchsia-50 to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl opacity-40 bg-fuchsia-300 dark:bg-fuchsia-700" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-40 bg-blue-300 dark:bg-blue-700" />

      <div className="relative max-w-5xl mx-auto p-6 space-y-6">
        <header className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur border shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"><Calculator size={18} /></span>
            <h1 className="text-2xl font-bold">CGPA Calculator</h1>
          </div>
          <button className="px-3 py-1.5 rounded-md border border-transparent bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition" onClick={() => { setShowResult(null); setOpenModal(false); reset() }}>Reset</button>
        </header>

      <section className="rounded-2xl border bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Prior Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">Completed Credits</label>
            <input type="number" className="w-full border rounded px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" value={prior.completedCredits}
              onChange={e => setPrior({ completedCredits: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm block mb-1">Current CGPA</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" value={prior.currentCGPA}
              onChange={e => setPrior({ currentCGPA: Number(e.target.value) })} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Enter your completed credits and current CGPA before this trimester.</p>
      </section>

      <section className="rounded-2xl border bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">This Trimester Courses</h2>
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-1 pr-2">Credits</th>
                <th className="py-1 pr-2">Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-t border-gray-200/60 dark:border-gray-700/60">
                  <td className="py-1 pr-2">
                    <select className="w-28 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={c.credits}
                      onChange={e => updateCourse(c.id, { credits: Number(e.target.value) })}>
                      {[1,2,3,4,5].map(v => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </td>
                  <td className="py-1 pr-2">
                    <select className="w-28 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={c.gradeLetter ?? ''}
                      onChange={e => updateCourse(c.id, { gradeLetter: e.target.value as any })}>
                      <option value="">Select</option>
                      {['A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                    </select>
                  </td>
                  <td className="py-1 pr-2 text-right">
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-sm hover:shadow transition"
                      onClick={() => deleteCourse(c.id)}
                      title="Delete course"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden space-y-2">
          {courses.map(c => (
            <div key={c.id} className="rounded-xl border p-3 bg-white/90 dark:bg-gray-800/90">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Course</div>
                <button
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white bg-gradient-to-r from-rose-600 to-orange-600 shadow-sm"
                  onClick={() => deleteCourse(c.id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-gray-600">Credits
                  <select className="mt-1 w-full bg-transparent border rounded px-2 py-2" value={c.credits}
                    onChange={e => updateCourse(c.id, { credits: Number(e.target.value) })}>
                    {[1,2,3,4,5].map(v => (<option key={v} value={v}>{v}</option>))}
                  </select>
                </label>
                <label className="text-xs text-gray-600">Grade
                  <select className="mt-1 w-full bg-transparent border rounded px-2 py-2" value={c.gradeLetter ?? ''}
                    onChange={e => updateCourse(c.id, { gradeLetter: e.target.value as any })}>
                    <option value="">Select</option>
                    {['A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm px-3 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow hover:shadow-md transition"
          onClick={() => addCourse({ code: '', credits: 3, gradeLetter: undefined, trimesterId: 'current' })}>
          Add Course
        </button>
      </section>

      <section className="rounded-2xl border bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Retake Courses (optional)</h2>
          <button className="px-3 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow hover:shadow-md transition" onClick={() => addRetake({ credits: 3, prevGradeLetter: 'C', currentGradeLetter: 'B' })}>Add Retake Course</button>
        </div>
        {retakes.length > 0 && (
          <>
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300">
                  <th className="py-1 pr-2">Credits</th>
                  <th className="py-1 pr-2">Previous Grade</th>
                  <th className="py-1 pr-2">Current Grade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {retakes.map(r => (
                  <tr key={r.id} className="border-t border-gray-200/60 dark:border-gray-700/60">
                    <td className="py-1 pr-2">
                      <select className="w-28 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={r.credits}
                        onChange={e => updateRetake(r.id, { credits: Number(e.target.value) })}>
                        {[1,2,3,4,5].map(v => (<option key={v} value={v}>{v}</option>))}
                      </select>
                    </td>
                    <td className="py-1 pr-2">
                      <select className="w-28 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={r.prevGradeLetter}
                        onChange={e => updateRetake(r.id, { prevGradeLetter: e.target.value as any })}>
                        {['A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                      </select>
                    </td>
                    <td className="py-1 pr-2">
                      <select className="w-28 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={r.currentGradeLetter}
                        onChange={e => updateRetake(r.id, { currentGradeLetter: e.target.value as any })}>
                        {['A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                      </select>
                    </td>
                    <td className="py-1 pr-2 text-right">
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-sm hover:shadow transition"
                        onClick={() => deleteRetake(r.id)}
                        title="Delete retake"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-2">
              {retakes.map(r => (
                <div key={r.id} className="rounded-xl border p-3 bg-white/90 dark:bg-gray-800/90">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Retake</div>
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white bg-gradient-to-r from-rose-600 to-orange-600 shadow-sm"
                      onClick={() => deleteRetake(r.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="text-xs text-gray-600">Credits
                      <select className="mt-1 w-full bg-transparent border rounded px-2 py-2" value={r.credits}
                        onChange={e => updateRetake(r.id, { credits: Number(e.target.value) })}>
                        {[1,2,3,4,5].map(v => (<option key={v} value={v}>{v}</option>))}
                      </select>
                    </label>
                    <label className="text-xs text-gray-600">Prev Grade
                      <select className="mt-1 w-full bg-transparent border rounded px-2 py-2" value={r.prevGradeLetter}
                        onChange={e => updateRetake(r.id, { prevGradeLetter: e.target.value as any })}>
                        {['A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                      </select>
                    </label>
                    <label className="text-xs text-gray-600">Current Grade
                      <select className="mt-1 w-full bg-transparent border rounded px-2 py-2" value={r.currentGradeLetter}
                        onChange={e => updateRetake(r.id, { currentGradeLetter: e.target.value as any })}>
                        {['A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-2xl border bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-md bg-emerald-600 text-white shadow hover:shadow-md hover:bg-emerald-700 transition"
            onClick={() => {
              const r = calcWithRetakes(prior, courses, retakes, settings)
              setShowResult({ termGPA: r.termGPA, newCGPA: r.newCGPA, totalCompletedCredits: (prior.completedCredits || 0) + r.termCredits })
              setOpenModal(true)
            }}
          >
            Calculate
          </button>
          {showResult && (
            <div className="text-sm space-x-6">
              <span>Trimester GPA: <strong>{showResult.termGPA.toFixed(settings.scale.roundTo)}</strong></span>
              <span>Overall CGPA: <strong>{showResult.newCGPA.toFixed(settings.scale.roundTo)}</strong></span>
              <span>Total Completed Credits: <strong>{showResult.totalCompletedCredits}</strong></span>
            </div>
          )}
        </div>
      </section>

      <footer className="text-xs text-gray-500 pt-6">
        Weighted average based on UIU grading scheme.
      </footer>

      </div>

      {openModal && showResult && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenModal(false)}></div>
          <div className="relative z-10 w-full sm:max-w-2xl mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 max-h-[90vh]">
            <div className="p-5 text-white overflow-auto max-h-[90vh]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Result Summary</h3>
                <button className="rounded-full bg-white/20 hover:bg-white/30 px-3 py-1" onClick={() => setOpenModal(false)}>Close</button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-xs opacity-90">Prior Completed Credits</div>
                  <div className="text-2xl font-semibold">{prior.completedCredits}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-xs opacity-90">Prior CGPA</div>
                  <div className="text-2xl font-semibold">{prior.currentCGPA.toFixed(settings.scale.roundTo)}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-xs opacity-90">This Trimester Credits</div>
                  <div className="text-2xl font-semibold">{courses.reduce((s,c)=>s+(c.gradeLetter?c.credits:0),0) + retakes.reduce((s,r)=>s+r.credits,0)}</div>
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white text-gray-900 p-4">
                  <div className="font-semibold mb-2">Courses</div>
                  <ul className="text-sm space-y-1 max-h-40 overflow-auto">
                    {courses.map((c,i)=> (
                      <li key={i} className="flex justify-between"><span>Credits: {c.credits}</span><span>Grade: {c.gradeLetter ?? '-'}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-white text-gray-900 p-4">
                  <div className="font-semibold mb-2">Retakes</div>
                  {retakes.length === 0 ? <div className="text-sm text-gray-600">None</div> : (
                    <ul className="text-sm space-y-1 max-h-40 overflow-auto">
                      {retakes.map((r,i)=> (
                        <li key={i} className="flex justify-between"><span>Credits: {r.credits}</span><span>{r.prevGradeLetter} → {r.currentGradeLetter}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-white/10 p-3 text-center">
                  <div className="text-xs opacity-90">Trimester GPA</div>
                  <div className="text-2xl font-bold">{showResult.termGPA.toFixed(settings.scale.roundTo)}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3 text-center">
                  <div className="text-xs opacity-90">Overall CGPA</div>
                  <div className="text-2xl font-bold">{showResult.newCGPA.toFixed(settings.scale.roundTo)}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3 text-center">
                  <div className="text-xs opacity-90">Total Completed Credits</div>
                  <div className="text-2xl font-bold">{showResult.totalCompletedCredits}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
