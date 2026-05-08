import { users } from '@/mocks/musicData'
import type { AuthCredentials, RegisterPayload, User } from '@/types'

import { mockMutate, mockResolve } from './mockApi'

const AUTH_STORAGE_KEY = 'spotmyfy.mockAuthenticatedUser'

function readStoredUser(): User | null {
  const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)

    return null
  }
}

function storeUser(user: User): void {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const user = users.find((item) => item.email.toLowerCase() === credentials.email.toLowerCase())

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials')
  }

  storeUser(user)

  return mockResolve(user)
}

export async function register(payload: RegisterPayload): Promise<User> {
  const user: User = {
    id: `user-${Date.now()}`,
    fullName: payload.fullName,
    username: payload.username,
    email: payload.email,
    role: 'USER',
    isActive: true,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  storeUser(user)

  return mockMutate(user)
}

export async function logout(): Promise<void> {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)

  return mockResolve(undefined)
}

export async function getCurrentUser(): Promise<User | null> {
  const storedUser = readStoredUser()
  const user = storedUser ? users.find((item) => item.id === storedUser.id) ?? storedUser : null

  return mockResolve(user)
}
