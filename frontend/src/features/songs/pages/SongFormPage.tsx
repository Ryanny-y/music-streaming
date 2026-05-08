import { Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { LoadingState, PageHeader, TagBadge } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { Category, Song, SongPayload, SongStatus, Tag } from '@/types'

const emptySong: SongPayload = {
  title: '',
  artist: '',
  album: '',
  description: '',
  lyrics: '',
  audioUrl: '',
  coverImageUrl: '',
  duration: 180,
  releaseDate: new Date().toISOString().slice(0, 10),
  categoryId: '',
  categoryName: '',
  tags: [],
  status: 'UNPUBLISHED',
}

export function SongFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { songId } = useParams()
  const [form, setForm] = useState<SongPayload>(emptySong)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([adminService.getCategories(), adminService.getTags(), adminService.getSongs()])
      .then(([categoryList, tagList, songList]) => {
        setCategories(categoryList)
        setTags(tagList)

        if (mode === 'edit' && songId) {
          const song = songList.find((item) => item.id === songId)
          if (song) {
            setForm(toPayload(song))
          }
        } else if (categoryList[0]) {
          setForm((current) => ({
            ...current,
            categoryId: categoryList[0].id,
            categoryName: categoryList[0].name,
          }))
        }
      })
      .finally(() => setIsLoading(false))
  }, [mode, songId])

  const title = mode === 'create' ? 'Create Song' : 'Edit Song'
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId],
  )

  const updateField = <K extends keyof SongPayload>(key: K, value: SongPayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleTag = (tagName: string) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tagName)
        ? current.tags.filter((tag) => tag !== tagName)
        : [...current.tags, tagName],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const payload = {
      ...form,
      categoryName: selectedCategory?.name ?? form.categoryName,
    }

    if (mode === 'edit' && songId) {
      await adminService.updateSong(songId, payload)
    } else {
      await adminService.createSong(payload)
    }

    navigate('/admin/songs')
  }

  if (isLoading) {
    return <LoadingState label="Loading song form" />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title={title}
        description="Manage metadata, media references, publication state, and lyrics."
      />

      <form className="rounded-lg border border-border bg-card/80 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" value={form.title} onChange={(value) => updateField('title', value)} required />
          <Field label="Artist" value={form.artist} onChange={(value) => updateField('artist', value)} required />
          <Field label="Album" value={form.album} onChange={(value) => updateField('album', value)} required />
          <Field
            label="Release date"
            type="date"
            value={form.releaseDate}
            onChange={(value) => updateField('releaseDate', value)}
          />
          <Field
            label="Duration seconds"
            type="number"
            value={String(form.duration)}
            onChange={(value) => updateField('duration', Number(value))}
          />
          <label>
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as SongStatus)}
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="UNPUBLISHED">UNPUBLISHED</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-muted-foreground">Category</span>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
              value={form.categoryId}
              onChange={(event) => {
                const category = categories.find((item) => item.id === event.target.value)
                updateField('categoryId', event.target.value)
                updateField('categoryName', category?.name ?? '')
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Audio URL" value={form.audioUrl} onChange={(value) => updateField('audioUrl', value)} />
          <Field label="Cover image URL" value={form.coverImageUrl} onChange={(value) => updateField('coverImageUrl', value)} />
          <FileField label="Audio file input UI" />
          <FileField label="Cover image input UI" />
          <TextArea label="Description" value={form.description} onChange={(value) => updateField('description', value)} />
          <TextArea label="Lyrics" value={form.lyrics} onChange={(value) => updateField('lyrics', value)} />
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                label={tag.name}
                className={form.tags.includes(tag.name) ? 'border-primary bg-primary/15 text-primary' : undefined}
                onClick={() => toggleTag(tag.name)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? 'Saving' : title}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/songs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function toPayload(song: Song): SongPayload {
  return {
    title: song.title,
    artist: song.artist,
    album: song.album,
    description: song.description,
    lyrics: song.lyrics,
    audioUrl: song.audioUrl,
    coverImageUrl: song.coverImageUrl,
    duration: song.duration,
    releaseDate: song.releaseDate,
    categoryId: song.categoryId,
    categoryName: song.categoryName,
    tags: song.tags,
    status: song.status,
  }
}

function Field({ label, onChange, required = false, type = 'text', value }: { label: string; value: string; type?: string; required?: boolean; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none" type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function TextArea({ label, onChange, value }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="md:col-span-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <textarea className="mt-2 min-h-32 w-full rounded-lg border border-border bg-secondary/70 px-4 py-3 text-sm text-foreground outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function FileField({ label }: { label: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input className="mt-2 block w-full rounded-lg border border-border bg-secondary/70 px-4 py-2 text-sm text-muted-foreground" type="file" />
    </label>
  )
}
