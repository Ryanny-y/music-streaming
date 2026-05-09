import { Hash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader } from '@/components/common'
import { tagService } from '@/services'
import type { Tag } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load tags right now.'
}

export function AppTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setErrorMessage(null)

    tagService
      .getTags()
      .then((tagList) => {
        if (isMounted) {
          setTags(tagList)
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setTags([])
        setErrorMessage(getErrorMessage(error))
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
      <PageHeader eyebrow="Browse" title="Tags" description="Find music by mood, energy, and listening intent." />

      {isLoading ? (
        <LoadingState label="Loading tags" />
      ) : errorMessage ? (
        <EmptyState title="Could not load tags" description={errorMessage} />
      ) : tags.length === 0 ? (
        <EmptyState title="No tags found" description="Tags will appear here once added." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tags.map((tag) => (
            <button
              className="flex items-center justify-between rounded-lg border border-border bg-card/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/60"
              key={tag.id}
              type="button"
              onClick={() => navigate(`/app/tags/${tag.id}`)}
            >
              <span className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Hash className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{tag.name}</span>
                  <span className="text-sm text-muted-foreground">{tag.songCount} songs</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
