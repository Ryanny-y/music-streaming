import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

type TagBadgeProps = ComponentPropsWithoutRef<'button'> & {
  label: string
}

export function TagBadge({ className, label, type = 'button', ...props }: TagBadgeProps) {
  return (
    <button
      className={cn(
        'inline-flex h-7 items-center rounded-full border border-border bg-secondary/80 px-3 text-xs font-medium text-secondary-foreground transition hover:border-primary/70 hover:text-primary',
        className,
      )}
      type={type}
      {...props}
    >
      {label}
    </button>
  )
}
