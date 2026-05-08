import { UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'

export function RegisterPage() {
  const { isAuthenticated, isLoading, register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    await register(form)
    navigate('/app/dashboard', { replace: true })
  }

  return (
    <main className="min-h-[34rem] bg-background px-0 py-6 text-foreground">
      <div className="mx-auto max-w-md">
        <section className="rounded-lg border border-border bg-card/80 p-8 shadow-xl shadow-black/20">
          <p className="text-sm font-medium text-primary">Mock account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Create Account</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Create a local mock user for the MVP. Your session is stored in this browser.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <Field
              label="Full name"
              value={form.fullName}
              onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
            />
            <Field
              label="Username"
              value={form.username}
              onChange={(value) => setForm((current) => ({ ...current, username: value }))}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            />
            <Button className="mt-2 w-full" type="submit" disabled={isSubmitting}>
              <UserPlus className="size-4" aria-hidden="true" />
              {isSubmitting ? 'Creating' : 'Create Account'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}

type FieldProps = {
  label: string
  value: string
  type?: string
  onChange: (value: string) => void
}

function Field({ label, onChange, type = 'text', value }: FieldProps) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        type={type}
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
