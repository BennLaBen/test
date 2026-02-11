'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface Crumb {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: Crumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-500">
      <Link href="/boutique" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
        <Home className="h-3 w-3" />
        <span className="hidden sm:inline">Catalogue</span>
      </Link>
      {items.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-gray-700" />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-blue-400 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-300">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
