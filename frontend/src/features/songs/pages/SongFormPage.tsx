import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, TagBadge } from '@/components/common'
import { Button } from '@/components/ui'
import type { AdminSongPayload } from '@/features/admin/services/adminService'
import { adminService } from '@/services'
import type { Category, Song, SongStatus, Tag } from '@/types'

type SongFormState = AdminSongPayload

type BackendErrorResponse = {
  message?: string
  error?: string
  validationErrors?: Record<string, string>
}

const emptySong: SongFormState = {
  title: '',
  artist: '',
  album: '',
  description: '',
  lyrics: '',
  duration: '03:00',
  releaseDate: new Date().toISOString().slice(0, 10),
  categoryId: '',
  tagIds: [],
  status: 'UNPUBLISHED',
}

export function SongFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { songId } = useParams()
  const [form, setForm] = useState<SongFormState>(emptySong)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadForm = async () => {
      const [categoryList, tagList, song] = await Promise.all([
        adminService.getCategories(),
        adminService.getTags(),
        mode === 'edit' && songId ? adminService.getSongById(songId) : Promise.resolve(null),
      ])

      if (!isMounted) {
        return
      }

      setCategories(categoryList)
      setTags(tagList)

      if (song) {
        setForm(toFormState(song, tagList))
      } else {
        setForm((current) => ({
          ...current,
          categoryId: current.categoryId || categoryList[0]?.id || '',
        }))
      }
    }

    loadForm()
      .catch((error) => {
        if (isMounted) {
          setErrorMessages(getErrorMessages(error, 'Unable to load song form'))
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
  }, [mode, songId])

  const title = mode === 'create' ? 'Create Song' : 'Edit Song'

  const updateField = <K extends keyof SongFormState>(key: K, value: SongFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleTag = (tagId: string) => {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter((currentTagId) => currentTagId !== tagId)
        : [...current.tagIds, tagId],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessages([])
    setIsSaving(true)

    try {
      const savedSong =
        mode === 'edit' && songId
          ? await adminService.updateSong(songId, form)
          : await adminService.createSong(form)

      if (audioFile) {
        await adminService.uploadSongAudio(savedSong.id, audioFile)
      }

      if (coverFile) {
        await adminService.uploadSongCover(savedSong.id, coverFile)
      }

      navigate('/admin/songs')
    } catch (error) {
      setErrorMessages(getErrorMessages(error, 'Unable to save song'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading song form" />
  }

  if (mode === 'edit' && !songId) {
    return <EmptyState title="Song not found" description="Missing song id for edit mode." />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title={title}
        description="Manage metadata, media uploads, publication state, and lyrics."
      />

      <form className="rounded-lg border border-border bg-card/80 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" value={form.title} onChange={(value) => updateField('title', value)} required />
          <Field label="Artist" value={form.artist} onChange={(value) => updateField('artist', value)} required />
          <Field label="Album" value={form.album} onChange={(value) => updateField('album', value)} />
          <Field
            label="Release date"
            type="date"
            value={form.releaseDate}
            onChange={(value) => updateField('releaseDate', value)}
          />
          <Field
            label="Duration"
            value={form.duration}
            onChange={(value) => updateField('duration', value)}
            placeholder="03:30"
          />
          <label>
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
              value={form.status}
              disabled={isSaving}
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
              disabled={isSaving}
              onChange={(event) => updateField('categoryId', event.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <FileField
            label="Audio file"
            accept="audio/*"
            disabled={isSaving}
            onChange={setAudioFile}
          />
          <FileField
            label="Cover image"
            accept="image/*"
            disabled={isSaving}
            onChange={setCoverFile}
          />
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
                className={form.tagIds.includes(tag.id) ? 'border-primary bg-primary/15 text-primary' : undefined}
                disabled={isSaving}
                onClick={() => toggleTag(tag.id)}
              />
            ))}
          </div>
        </div>

        {errorMessages.length > 0 ? (
          <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex gap-3">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? (audioFile || coverFile ? 'Saving and uploading' : 'Saving') : title}
          </Button>
          <Button variant="secondary" type="button" disabled={isSaving} onClick={() => navigate('/admin/songs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function toFormState(song: Song, tags: Tag[]): SongFormState {
  return {
    title: song.title,
    artist: song.artist,
    album: song.album,
    description: song.description,
    lyrics: song.lyrics,
    duration: formatDuration(song.duration),
    releaseDate: song.releaseDate,
    categoryId: song.categoryId,
    tagIds: tags.filter((tag) => song.tags.includes(tag.name)).map((tag) => tag.id),
    status: song.status,
  }
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

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Field({
  label,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value,
}: {
  label: string
  value: string
  type?: string
  placeholder?: string
  required?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function TextArea({ label, onChange, value }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="md:col-span-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <textarea
        className="mt-2 min-h-32 w-full rounded-lg border border-border bg-secondary/70 px-4 py-3 text-sm text-foreground outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function FileField({
  accept,
  disabled,
  label,
  onChange,
}: {
  accept: string
  disabled: boolean
  label: string
  onChange: (file: File | null) => void
}) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 block w-full rounded-lg border border-border bg-secondary/70 px-4 py-2 text-sm text-muted-foreground"
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  )
}
