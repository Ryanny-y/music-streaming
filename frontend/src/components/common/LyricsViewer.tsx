type LyricsViewerProps = {
  lyrics: string
  title?: string
}

export function LyricsViewer({ lyrics, title = 'Lyrics' }: LyricsViewerProps) {
  const lines = lyrics.split(/\r?\n| \/ /).filter(Boolean)

  return (
    <section className="rounded-lg border border-border bg-card/80 p-6">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <div className="mt-6 space-y-3 text-lg leading-8 text-muted-foreground">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
    </section>
  )
}
