import { Headphones, LogIn } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { getAuthErrorMessage } from '@/features/auth/services/authService'
import { APP_NAME } from '@/lib/constants'

export function LoginPage() {
  const { isAuthenticated, isLoading, login, user } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/app/dashboard'} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const authenticatedUser = await login(form)
      navigate(authenticatedUser.role === 'ADMIN' ? '/admin/dashboard' : '/app/dashboard', {
        replace: true,
      })
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Headphones className="size-5 text-primary" aria-hidden="true" />
          <span>{APP_NAME}</span>
          <span>/</span>
          <span>Public</span>
        </div>

        <section className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm font-medium text-primary">Account access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Login</h1>
          <p className="mt-4 text-muted-foreground">Sign in with your Spotmyfy account.</p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
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

            {errorMessage ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <Button className="mt-2 w-full" type="submit" disabled={isSubmitting}>
              <LogIn className="size-4" aria-hidden="true" />
              {isSubmitting ? 'Logging in' : 'Login'}
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
