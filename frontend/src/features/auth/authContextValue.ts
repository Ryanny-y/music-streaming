import { createContext } from 'react'

import type { ApiUserRole, RegisterPayload, User } from '@/types'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  loginAsRole: (role: ApiUserRole) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
