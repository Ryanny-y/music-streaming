import { UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { getAuthErrorMessages } from '@/features/auth/services/authService'

export function RegisterPage() {
  const { isAuthenticated, isLoading, register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessages, setErrorMessages] = useState<string[]>([])
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
    setErrorMessages([])

    if (form.password !== form.confirmPassword) {
      setErrorMessages(['Passwords do not match'])

      return
    }

    setIsSubmitting(true)

    try {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      })
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. You can now login.' },
      })
    } catch (error) {
      setErrorMessages(getAuthErrorMessages(error, 'Unable to create account'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[34rem] bg-background px-0 py-6 text-foreground">
      <div className="mx-auto max-w-md">
        <section className="rounded-lg border border-border bg-card/80 p-8 shadow-xl shadow-black/20">
          <p className="text-sm font-medium text-primary">New account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Create Account</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Create your Spotmyfy account, then sign in with your new credentials.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <Field
              label="Full name"
              value={form.fullName}
              disabled={isSubmitting}
              onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
            />
            <Field
              label="Username"
              value={form.username}
              disabled={isSubmitting}
              onChange={(value) => setForm((current) => ({ ...current, username: value }))}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              disabled={isSubmitting}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              disabled={isSubmitting}
              onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            />
            <Field
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              disabled={isSubmitting}
              onChange={(value) =>
                setForm((current) => ({ ...current, confirmPassword: value }))
              }
            />

            {errorMessages.length > 0 ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            ) : null}

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
  disabled?: boolean
  onChange: (value: string) => void
}

function Field({ disabled = false, label, onChange, type = 'text', value }: FieldProps) {
  return (
    <label>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        type={type}
        value={value}
        required
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
