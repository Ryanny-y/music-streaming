import { BadgeCheck, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

import { LoadingState, PageHeader, StatCard } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { userService } from '@/services'
import type { UpdateProfilePayload } from '@/types'

export function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState<UpdateProfilePayload>({})
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      })
    }
  }, [user])

  if (!user) {
    return <LoadingState label="Loading profile" />
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSavedMessage('')

    await userService.updateProfile(user.id, form)
    setSavedMessage('Profile saved with mock data.')
    setIsSaving(false)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="View and edit your mock user profile."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Role" value={user.role} icon={<BadgeCheck className="size-5" />} />
        <StatCard title="Status" value={user.isActive ? 'Active' : 'Inactive'} />
        <StatCard title="Joined" value={formatDate(user.createdAt)} />
      </section>

      <section className="rounded-lg border border-border bg-card/80 p-6">
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
