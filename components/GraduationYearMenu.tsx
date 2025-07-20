'use client'

import { useState } from 'react'

export default function GraduationYearMenu() {
  const startYear = 2025
  const endYear = 2032
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  )
  const [year, setYear] = useState<string | null>(null)

  return (
    <div className="mt-2">
      <select
        value={year ?? ''}
        onChange={(e) => setYear(e.target.value || null)}
        className="w-full p-2 border border-border rounded-md bg-background text-foreground"
      >
        <option value="" disabled></option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {year && year !== '' && (
        <button
          onClick={() => setYear(null)}
          className="text-xs mt-1 ml-1 text-muted-foreground"
        >
          Clear
        </button>
      )}
    </div>
  )
}
