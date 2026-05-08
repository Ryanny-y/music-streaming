import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

import { users } from '@/mocks/musicData'
import { authService } from '@/services'
import type { ApiUserRole, User } from '@/types'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  loginAsRole: (role: ApiUserRole) => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USERS_BY_ROLE: Record<ApiUserRole, string> = {
  USER: 'user-sam',
  ADMIN: 'user-admin',
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    authService.getCurrentUser().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const loginAsRole = useCallback(async (role: ApiUserRole) => {
    const mockUser = users.find((item) => item.id === MOCK_USERS_BY_ROLE[role])

    if (!mockUser) {
      throw new Error('Mock user not found')
    }

    const authenticatedUser = await authService.login({
      email: mockUser.email,
      password: 'password',
    })

    setUser(authenticatedUser)

    return authenticatedUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      loginAsRole,
      logout,
    }),
    [isLoading, loginAsRole, logout, user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
