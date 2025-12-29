import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useTokenStore } from '../store/token.store'
import { useLoadingStore } from '../store/loading.store'
import { showRefreshLoader, removeRefreshLoader } from '../utils/loader-utils'
import type { RefreshTokenResponse } from '../types/auth'

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies (refresh token) in requests
})

// Track if refresh is in progress
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}> = []

// Process queued requests after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - adds auth token from Zustand store to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handles 401 errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Don't attempt refresh for auth endpoints (login, register, refresh, logout, password reset, password change, verify-device)
    // These endpoints should handle their own errors
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh') ||
                           originalRequest?.url?.includes('/auth/logout') ||
                           originalRequest?.url?.includes('/auth/logout-all') ||
                           originalRequest?.url?.includes('/auth/password/forgot') ||
                           originalRequest?.url?.includes('/auth/password/reset') ||
                           originalRequest?.url?.includes('/auth/password/change') ||
                           originalRequest?.url?.includes('/auth/verify-device') ||
                           originalRequest?.url?.includes('/auth/pin/create') ||
                           originalRequest?.url?.includes('/auth/pin/change') ||
                           originalRequest?.url?.includes('/auth/2fa/setup') ||
                           originalRequest?.url?.includes('/auth/2fa/enable') ||
                           originalRequest?.url?.includes('/auth/2fa/disable')

    // Handle 401 Unauthorized - attempt token refresh
    // Skip refresh for auth endpoints and if already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      // Show loader immediately by injecting into DOM
      showRefreshLoader()
      // Also set loading state for React components
      useLoadingStore.getState().setRefreshingToken(true)

      try {
        // Call refresh endpoint (browser automatically includes HttpOnly refresh cookie)
        // Use axios directly to avoid interceptor loop
        const response = await axios.post<RefreshTokenResponse>(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        // Extract accessToken from nested response structure
        if (!response.data.success) {
          throw new Error('Refresh token failed')
        }
        
        const accessToken = response.data.data.accessToken

        if (!accessToken) {
          throw new Error('No access token received from refresh endpoint')
        }

        // Update token in Zustand store
        useTokenStore.getState().setAccessToken(accessToken)

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Process queued requests
        processQueue(null, accessToken)

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear token and process queue with error
        useTokenStore.getState().clearAccessToken()
        processQueue(refreshError as AxiosError, null)

        // Redirect to login if not already there
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
        // Remove loader from DOM and clear loading state
        removeRefreshLoader()
        useLoadingStore.getState().setRefreshingToken(false)
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      return Promise.reject(new Error('Request timed out. Please try again.'))
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }

    // Handle other errors
    const errorMessage =
      (error.response?.data as { error?: string; message?: string })?.error ||
      (error.response?.data as { error?: string; message?: string })?.message ||
      error.message ||
      'An error occurred'

    return Promise.reject(new Error(errorMessage))
  }
)
