'use client'

import { Zap } from 'lucide-react'

interface SpecsTableProps {
  specs: Record<string, string>
  columns?: 1 | 2
}

export function SpecsTable({ specs, columns = 2 }: SpecsTableProps) {
  const entries = Object.entries(specs)

  return (
    <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700 backdrop-blur-sm">
      <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4" />
        Spécifications techniques
      </h3>
      <div className={`grid gap-y-5 gap-x-8 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col border-l-2 border-blue-500/20 pl-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{key}</span>
            <span className="text-sm font-bold text-white font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
