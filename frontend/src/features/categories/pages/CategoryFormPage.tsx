import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import type { AdminCategoryPayload } from '@/features/admin/services/adminService'
import { adminService } from '@/services'

type BackendErrorResponse = {
  message?: string
  error?: string
  validationErrors?: Record<string, string>
}

export function CategoryFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { categoryId } = useParams()
  const [form, setForm] = useState<AdminCategoryPayload>({ name: '', description: '' })
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    if (mode !== 'edit' || !categoryId) {
      return () => {
        isMounted = false
      }
    }

    adminService
      .getCategoryById(categoryId)
      .then((category) => {
        if (isMounted) {
          setForm({ name: category.name, description: category.description })
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessages(getErrorMessages(error, 'Unable to load category'))
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
  }, [categoryId, mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessages([])
    setIsSaving(true)

    try {
      if (mode === 'edit' && categoryId) {
        await adminService.updateCategory(categoryId, form)
      } else {
        await adminService.createCategory(form)
      }

      navigate('/admin/categories')
    } catch (error) {
      setErrorMessages(getErrorMessages(error, 'Unable to save category'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading category form" />
  }

  if (mode === 'edit' && !categoryId) {
    return <EmptyState title="Category not found" description="Missing category id for edit mode." />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title={mode === 'create' ? 'Create Category' : 'Edit Category'}
        description="Manage how songs are grouped across the catalog."
      />

      <form className="max-w-2xl rounded-lg border border-border bg-card/80 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-5">
          <Field
            label="Name"
            value={form.name}
            disabled={isSaving}
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
          />
          <label>
            <span className="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-border bg-secondary/70 px-4 py-3 text-sm text-foreground outline-none"
              value={form.description}
              disabled={isSaving}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
        </div>

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
            {isSaving ? 'Saving' : 'Save category'}
          </Button>
          <Button variant="secondary" type="button" disabled={isSaving} onClick={() => navigate('/admin/categories')}>
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

function Field({
  disabled,
  label,
  onChange,
  value,
}: {
  label: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
        value={value}
        required
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
