import { Hash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader } from '@/components/common'
import { tagService } from '@/services'
import type { Tag } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load tags right now.'
}

export function PublicTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    tagService
      .getTags()
      .then((musicTags) => {
        if (isMounted) {
          setTags(musicTags)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setTags([])
          setErrorMessage(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Moods and moments"
        title="Tags"
        description="Jump into songs by mood, energy, or release type."
      />

      {isLoading ? (
        <LoadingState label="Loading tags" />
      ) : errorMessage ? (
        <EmptyState title="Could not load tags" description={errorMessage} />
      ) : tags.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <button
              className="group flex items-center justify-between rounded-lg border border-border bg-card/80 p-5 text-left shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-primary/60"
              key={tag.id}
              type="button"
              onClick={() => navigate(`/songs?tag=${encodeURIComponent(tag.name)}`)}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Hash className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-lg font-semibold text-foreground">{tag.name}</span>
                  <span className="text-sm text-muted-foreground">{tag.songCount} songs</span>
                </span>
              </span>
              <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition group-hover:border-primary/60 group-hover:text-primary">
                Browse
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="No tags yet" description="Tags will appear here once songs have been organized." />
      )}
    </div>
  )
}
