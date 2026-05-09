import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const AUTH_USER_KEY = 'authUser'

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type WrappedResponse<T> = {
  success?: boolean
  message?: string
  data?: T
}

type AuthTokens = {
  accessToken?: string
  refreshToken?: string
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export function resolveBackendUrl(path: string): string {
  if (!path || /^(blob:|data:|https?:\/\/)/i.test(path)) {
    return path
  }

  return new URL(path, API_BASE_URL).toString()
}

function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

function redirectToLogin(): void {
  window.location.assign('/login')
}

export function unwrapResponse<T>(response: AxiosResponse<T | WrappedResponse<T>>): T {
  const responseData = response.data

  if (
    responseData &&
    typeof responseData === 'object' &&
    'data' in responseData &&
    responseData.data !== undefined
  ) {
    return responseData.data
  }

  return responseData as T
}

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      clearAuthStorage()
      redirectToLogin()

      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const refreshResponse = await axios.post<AuthTokens | WrappedResponse<AuthTokens>>(
        '/auth/refresh-token',
        { refreshToken },
        { baseURL: API_BASE_URL },
      )
      const refreshedAuth = unwrapResponse<AuthTokens>(refreshResponse)

      if (!('accessToken' in refreshedAuth) || !refreshedAuth.accessToken) {
        throw new Error('Refresh response did not include an access token')
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, refreshedAuth.accessToken)

      if (refreshedAuth.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshedAuth.refreshToken)
      }

      originalRequest.headers.Authorization = `Bearer ${refreshedAuth.accessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      clearAuthStorage()
      redirectToLogin()

      return Promise.reject(refreshError)
    }
  },
)
