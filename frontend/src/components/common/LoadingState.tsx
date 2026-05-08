type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-lg border border-border bg-card/70">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="size-3 animate-pulse rounded-full bg-primary" />
        <span>{label}</span>
      </div>
    </div>
  )
}
