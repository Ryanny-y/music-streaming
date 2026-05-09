import { isAxiosError } from 'axios'

import { api, unwrapResponse } from '@/lib/api'
import type { AuthCredentials, RegisterPayload, User } from '@/types'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const AUTH_USER_KEY = 'authUser'

type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

type BackendErrorResponse = {
  message?: string
  error?: string
  validationErrors?: Record<string, string>
}

function storeAuthSession(authResponse: AuthResponse): User {
  localStorage.setItem(ACCESS_TOKEN_KEY, authResponse.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authResponse.user))

  return authResponse.user
}

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem(AUTH_USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)

    return null
  }
}

export function storeAuthUser(user: User): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getAuthErrorMessage(error: unknown): string {
  if (isAxiosError<BackendErrorResponse>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? 'Unable to login'
  }

  return error instanceof Error ? error.message : 'Unable to login'
}

export function getAuthErrorMessages(error: unknown, fallbackMessage: string): string[] {
  if (isAxiosError<BackendErrorResponse>(error)) {
    const validationErrors = error.response?.data?.validationErrors

    if (validationErrors) {
      return Object.values(validationErrors)
    }

    return [error.response?.data?.message ?? error.response?.data?.error ?? fallbackMessage]
  }

  return [error instanceof Error ? error.message : fallbackMessage]
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<AuthResponse>('/auth/login', {
    email: credentials.email,
    usernameOrEmail: credentials.email,
    password: credentials.password,
  })
  const authResponse = unwrapResponse<AuthResponse>(response)

  if (!('accessToken' in authResponse) || !authResponse.user) {
    throw new Error('Login response did not include authentication details')
  }

  return storeAuthSession(authResponse)
}

export async function register(payload: RegisterPayload): Promise<User> {
  const response = await api.post<AuthResponse>('/auth/register', {
    fullName: payload.fullName,
    username: payload.username,
    email: payload.email,
    password: payload.password,
  })
  const authResponse = unwrapResponse<AuthResponse>(response)

  if (!('user' in authResponse) || !authResponse.user) {
    throw new Error('Registration response did not include user details')
  }

  return authResponse.user
}

export async function logout(): Promise<void> {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export async function getCurrentUser(): Promise<User | null> {
  if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
    return null
  }

  return readStoredUser()
}
