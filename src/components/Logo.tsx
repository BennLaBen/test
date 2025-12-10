'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  href?: string
}

export function Logo({ size = 'medium', href = '/' }: LogoProps) {
  const sizes = {
    small: { height: 50, width: 180 },
    medium: { height: 70, width: 250 },
    large: { height: 90, width: 320 }
  }

  const currentSize = sizes[size]

  const LogoContent = () => (
    <div className="relative" style={{ height: currentSize.height, width: currentSize.width }}>
      <Image
        src="/logo sans fond et nom.png"
        alt="LLEDO Industries Logo"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-transform hover:scale-105 flex-shrink-0">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
