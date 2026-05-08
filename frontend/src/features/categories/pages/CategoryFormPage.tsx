import { Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { LoadingState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { CategoryPayload } from '@/types'

export function CategoryFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { categoryId } = useParams()
  const [form, setForm] = useState<CategoryPayload>({ name: '', description: '' })
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== 'edit' || !categoryId) {
      return
    }

    adminService
      .getCategories()
      .then((categories) => {
        const category = categories.find((item) => item.id === categoryId)
        if (category) {
          setForm({ name: category.name, description: category.description })
        }
      })
      .finally(() => setIsLoading(false))
  }, [categoryId, mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    if (mode === 'edit' && categoryId) {
      await adminService.updateCategory(categoryId, form)
    } else {
      await adminService.createCategory(form)
    }

    navigate('/admin/categories')
  }

  if (isLoading) {
    return <LoadingState label="Loading category form" />
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
          <Field label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <label>
            <span className="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-border bg-secondary/70 px-4 py-3 text-sm text-foreground outline-none"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? 'Saving' : 'Save category'}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/categories')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, onChange, value }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
