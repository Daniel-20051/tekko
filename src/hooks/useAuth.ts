import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import * as authApi from '../api/auth.api'
import type { LoginCredentials, RegisterCredentials } from '../types/auth'

// Query key factory for auth-related queries
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
}

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('authToken'), // Only fetch if token exists
    retry: false,
  })
}

// Hook for login mutation
export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store auth token
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      
      // Navigate to dashboard
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Hook for register mutation
export const useRegister = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: (data) => {
      // Store auth token
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      
      // Navigate to dashboard
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

// Hook for logout mutation
export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth data
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      
      // Clear all queries
      queryClient.clear()
      
      // Navigate to login
      navigate({ to: '/' })
    },
  })
}

