import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
}

export function StatCard({ description, icon, title, value }: StatCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card/80 p-5 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        {icon ? <div className="rounded-lg bg-primary/15 p-2 text-primary">{icon}</div> : null}
      </div>
      {description ? <p className="mt-4 text-sm text-muted-foreground">{description}</p> : null}
    </article>
  )
}
