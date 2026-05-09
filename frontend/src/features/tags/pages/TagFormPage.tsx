import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import type { AdminTagPayload } from '@/features/admin/services/adminService'
import { adminService } from '@/services'

type BackendErrorResponse = {
  message?: string
  error?: string
  validationErrors?: Record<string, string>
}

export function TagFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { tagId } = useParams()
  const [form, setForm] = useState<AdminTagPayload>({ name: '' })
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    if (mode !== 'edit' || !tagId) {
      return () => {
        isMounted = false
      }
    }

    adminService
      .getTagById(tagId)
      .then((tag) => {
        if (isMounted) {
          setForm({ name: tag.name })
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessages(getErrorMessages(error, 'Unable to load tag'))
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
  }, [mode, tagId])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessages([])
    setIsSaving(true)

    try {
      if (mode === 'edit' && tagId) {
        await adminService.updateTag(tagId, form)
      } else {
        await adminService.createTag(form)
      }

      navigate('/admin/tags')
    } catch (error) {
      setErrorMessages(getErrorMessages(error, 'Unable to save tag'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading tag form" />
  }

  if (mode === 'edit' && !tagId) {
    return <EmptyState title="Tag not found" description="Missing tag id for edit mode." />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title={mode === 'create' ? 'Create Tag' : 'Edit Tag'}
        description="Manage labels used for song discovery."
      />

      <form className="max-w-xl rounded-lg border border-border bg-card/80 p-6" onSubmit={handleSubmit}>
        <label>
          <span className="text-sm font-medium text-muted-foreground">Name</span>
          <input
            className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
            value={form.name}
            required
            disabled={isSaving}
            onChange={(event) => setForm({ name: event.target.value })}
          />
        </label>

        {errorMessages.length > 0 ? (
          <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? 'Saving' : 'Save tag'}
          </Button>
          <Button variant="secondary" type="button" disabled={isSaving} onClick={() => navigate('/admin/tags')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function getErrorMessages(error: unknown, fallbackMessage: string): string[] {
  if (isAxiosError<BackendErrorResponse>(error)) {
    const validationErrors = error.response?.data?.validationErrors

    if (validationErrors) {
      return Object.values(validationErrors)
    }

    return [error.response?.data?.message ?? error.response?.data?.error ?? fallbackMessage]
  }

  return [error instanceof Error ? error.message : fallbackMessage]
}
