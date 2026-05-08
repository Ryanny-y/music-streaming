import { Search } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

type SearchBarProps = Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> & {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ className, value, onChange, placeholder = 'Search music', ...props }: SearchBarProps) {
  return (
    <label className={cn('relative block w-full', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        className="h-11 w-full rounded-full border border-border bg-secondary/70 px-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </label>
  )
}
