import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

import type { AuthCredentials, RegisterPayload, User } from '@/types'

import { AuthContext, type AuthContextValue } from './authContextValue'
import * as authService from './services/authService'

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

  const login = useCallback(async (credentials: AuthCredentials) => {
    const authenticatedUser = await authService.login(credentials)

    setUser(authenticatedUser)

    return authenticatedUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const registeredUser = await authService.register(payload)

    return registeredUser
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
