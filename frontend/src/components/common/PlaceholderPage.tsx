import { Music } from 'lucide-react'

import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

type PlaceholderPageProps = {
  title: string
  section: 'Public' | 'User' | 'Admin'
  className?: string
}

export function PlaceholderPage({ title, section, className }: PlaceholderPageProps) {
  return (
    <main className={cn('min-h-screen bg-background px-6 py-10 text-foreground', className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Music className="size-5 text-primary" aria-hidden="true" />
          <span>{APP_NAME}</span>
          <span>/</span>
          <span>{section}</span>
        </div>
        <section className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm font-medium text-primary">{section} route</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">{title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Placeholder page for the music streaming MVP.
          </p>
        </section>
      </div>
    </main>
  )
}
