import { createContext } from 'react'

import type { AuthCredentials, RegisterPayload, User } from '@/types'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: AuthCredentials) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
