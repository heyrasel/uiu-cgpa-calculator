import { useMemo } from 'react'
import type { Trimester } from '../types'
import { useApp } from '../store'
import { calcGPA } from '../utils/calc'

export default function TrimesterCard({ trimester }: { trimester: Trimester }) {
  const { courses, settings, addCourse, deleteCourse, updateCourse } = useApp()
  const list = useMemo(() => courses.filter(c => c.trimesterId === trimester.id), [courses, trimester.id])
  const { gpa } = useMemo(() => calcGPA(list, settings), [list, settings])

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Trimester {trimester.index}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">GPA: {gpa.toFixed(settings.scale.roundTo)}</div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="py-1 pr-2">Code</th>
              <th className="py-1 pr-2">Credits</th>
              <th className="py-1 pr-2">Grade</th>
              <th className="py-1 pr-2">PF</th>
              <th className="py-1 pr-2">W</th>
              <th className="py-1 pr-2">I</th>
              <th className="py-1 pr-2">Retake Group</th>
              <th className="py-1 pr-2">Retake?</th>
              <th className="py-1 pr-2">Prev Grade</th>
              <th className="py-1 pr-2">Prev Credits</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id} className="border-t border-gray-200/60 dark:border-gray-700/60">
                <td className="py-1 pr-2">
                  <input className="w-full bg-transparent border rounded px-2 py-1" value={c.code}
                    onChange={e => updateCourse(c.id, { code: e.target.value })} />
                </td>
                <td className="py-1 pr-2">
                  <input type="number" className="w-20 bg-transparent border rounded px-2 py-1" value={c.credits}
                    onChange={e => updateCourse(c.id, { credits: Number(e.target.value) })} />
                </td>
                <td className="py-1 pr-2">
                  <input className="w-20 bg-transparent border rounded px-2 py-1" placeholder="A/B+/..." value={c.gradeLetter ?? ''}
                    onChange={e => updateCourse(c.id, { gradeLetter: e.target.value as any })} />
                </td>
                <td className="py-1 pr-2 text-center">
                  <input type="checkbox" checked={!!c.passFail} onChange={e => updateCourse(c.id, { passFail: e.target.checked })} />
                </td>
                <td className="py-1 pr-2 text-center">
                  <input type="checkbox" checked={!!c.withdrawn} onChange={e => updateCourse(c.id, { withdrawn: e.target.checked })} />
                </td>
                <td className="py-1 pr-2 text-center">
                  <input type="checkbox" checked={!!c.incomplete} onChange={e => updateCourse(c.id, { incomplete: e.target.checked })} />
                </td>
                <td className="py-1 pr-2">
                  <input className="w-28 bg-transparent border rounded px-2 py-1" placeholder="Group ID" value={c.retakeGroupId ?? ''}
                    onChange={e => updateCourse(c.id, { retakeGroupId: e.target.value || undefined })} />
                </td>
                <td className="py-1 pr-2 text-center">
                  <input type="checkbox" checked={!!c.isRetake} onChange={e => updateCourse(c.id, { isRetake: e.target.checked })} />
                </td>
                <td className="py-1 pr-2">
                  <input className="w-20 bg-transparent border rounded px-2 py-1" placeholder="A/B+/..." value={c.prevGradeLetter ?? ''}
                    onChange={e => updateCourse(c.id, { prevGradeLetter: e.target.value as any })} />
                </td>
                <td className="py-1 pr-2">
                  <input type="number" className="w-20 bg-transparent border rounded px-2 py-1" value={c.prevCredits ?? ''}
                    onChange={e => updateCourse(c.id, { prevCredits: e.target.value ? Number(e.target.value) : undefined })} />
                </td>
                <td className="py-1 pr-2 text-right">
                  <button className="text-red-600 hover:underline" onClick={() => deleteCourse(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-3 text-sm px-3 py-1 rounded bg-blue-600 text-white"
        onClick={() => addCourse({ code: '', credits: 3, trimesterId: trimester.id })}>
        Add Course
      </button>
    </div>
  )
}
