import { Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { LoadingState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { TagPayload } from '@/types'

export function TagFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { tagId } = useParams()
  const [form, setForm] = useState<TagPayload>({ name: '' })
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== 'edit' || !tagId) {
      setIsLoading(false)
      return
    }

    adminService
      .getTags()
      .then((tags) => {
        const tag = tags.find((item) => item.id === tagId)
        if (tag) {
          setForm({ name: tag.name })
        }
      })
      .finally(() => setIsLoading(false))
  }, [mode, tagId])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    if (mode === 'edit' && tagId) {
      await adminService.updateTag(tagId, form)
    } else {
      await adminService.createTag(form)
    }

    navigate('/admin/tags')
  }

  if (isLoading) {
    return <LoadingState label="Loading tag form" />
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
            onChange={(event) => setForm({ name: event.target.value })}
          />
        </label>
        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? 'Saving' : 'Save tag'}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/tags')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
