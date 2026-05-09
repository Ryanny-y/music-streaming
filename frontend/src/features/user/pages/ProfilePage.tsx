import { BadgeCheck, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

import { EmptyState, LoadingState, PageHeader, StatCard } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { userService } from '@/services'
import type { UpdateProfilePayload, User } from '@/types'

const emptyForm: UpdateProfilePayload = {
  fullName: '',
  username: '',
  email: '',
}

function toProfileForm(user: User): UpdateProfilePayload {
  return {
    fullName: user.fullName,
    username: user.username,
    email: user.email,
  }
}

export function ProfilePage() {
  const { updateUser, user } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [form, setForm] = useState<UpdateProfilePayload>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setErrorMessages([])

    userService
      .getProfile()
      .then((currentProfile) => {
        if (!isMounted) {
          return
        }

        setProfile(currentProfile)
        setForm(toProfileForm(currentProfile))
        updateUser(currentProfile)
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setErrorMessages(userService.getUserValidationMessages(error, 'Unable to load profile.'))
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [updateUser])

  if (isLoading) {
    return <LoadingState label="Loading profile" />
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSavedMessage('')
    setErrorMessages([])

    try {
      const updatedProfile = await userService.updateProfile(profile?.id ?? user?.id ?? '', form)

      setProfile(updatedProfile)
      setForm(toProfileForm(updatedProfile))
      updateUser(updatedProfile)
      setSavedMessage('Profile saved.')
    } catch (error: unknown) {
      setErrorMessages(userService.getUserValidationMessages(error, 'Unable to save profile.'))
    } finally {
      setIsSaving(false)
    }
  }

  if (!profile) {
    return (
      <EmptyState
        title="Could not load profile"
        description={errorMessages[0] ?? 'Your profile is unavailable right now.'}
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="View and edit your account profile."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Role" value={profile.role} icon={<BadgeCheck className="size-5" />} />
        <StatCard title="Status" value={profile.isActive ? 'Active' : 'Inactive'} />
        <StatCard title="Joined" value={formatDate(profile.createdAt)} />
      </section>

      <section className="rounded-lg border border-border bg-card/80 p-6">
        {errorMessages.length > 0 ? (
          <div className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {errorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Full name"
            value={form.fullName ?? ''}
            onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
          />
          <Field
            label="Username"
            value={form.username ?? ''}
            onChange={(value) => setForm((current) => ({ ...current, username: value }))}
          />
          <Field
            className="md:col-span-2"
            label="Email"
            type="email"
            value={form.email ?? ''}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? 'Saving' : 'Save profile'}
          </Button>
          {savedMessage ? <p className="text-sm text-primary">{savedMessage}</p> : null}
        </div>
      </section>
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  type?: string
  className?: string
  onChange: (value: string) => void
}

function Field({ className, label, onChange, type = 'text', value }: FieldProps) {
  return (
    <label className={className}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
