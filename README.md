# UIU CGPA Calculator

A modern, mobile-friendly CGPA calculator tailored to UIU's grading scheme. Built with React + TypeScript + Vite, Zustand for state, and Tailwind for styling. Deployed on Vercel.

## Features
- Prior summary: completed credits + current CGPA
- This trimester courses: credits + grade (dropdowns)
- Optional retake courses: credits, previous grade, current grade
- Accurate GPA and CGPA (weighted average). Retakes replace prior attempt in overall CGPA
- Vibrant UI, mobile card views, results popup

## Tech Stack
- React 18, TypeScript, Vite 4
- TailwindCSS, Lucide Icons
- Zustand (persist to LocalStorage)

## Local Development
```bash
# from the project subfolder
cd cgpa-calculator
npm install
npm run dev
```
Open http://127.0.0.1:5173

## Build
```bash
npm run build
npm run preview
```

## Deployment (Vercel)
This repo has the app in the `cgpa-calculator` subfolder.

- Root Directory: `cgpa-calculator`
- Build Command: `npm run build`
- Output Directory: `dist`

Two ways:
1. Dashboard: Import repo → Select Root Directory → (Vite/Other) → Deploy
2. CLI:
```bash
npm i -g vercel
vercel         # preview
vercel --prod  # production
```

## UIU Grading
- See `src/grades.ts` for grade points and ranges.
- Default minimum graduation CGPA: 2.00

## Notes
- Node 16/npm 8 compatible (Vite 4). Vercel uses newer Node automatically.
- Data is stored locally in the browser; no backend.

## License
MIT
