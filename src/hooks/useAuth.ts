import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import * as authApi from '../api/auth.api'
import type { LoginCredentials, RegisterCredentials, VerifyEmailCredentials, ResendVerificationCredentials } from '../types/auth'
import { useTokenStore } from '../store/token.store'

// Query key factory for auth-related queries
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
}

// Hook to get current user
export const useCurrentUser = () => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
  })
}

// Hook for login mutation
export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      
      return authApi.login(credentials)
    },
    onSuccess: (data) => {
      // Check if 2FA is required - don't navigate, let component handle it
      if (data.success && 'requires2FA' in data && data.requires2FA) {
        return
      }
      
      // Check if response is success with data (full login success)
      if (data.success && 'data' in data) {
        // Store access token in memory only (Zustand)
        // Refresh token is set as HttpOnly cookie by backend
        useTokenStore.getState().setAccessToken(data.data.accessToken)
        
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
        
        // Navigate to dashboard
        console.log('[useAuth] Navigating to dashboard')
        navigate({ to: '/dashboard' })
      } 
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Hook for register mutation
export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => {
     
      return authApi.register(credentials)
    },
    onSuccess: () => {
    
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
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
      // Clear access token from memory
      useTokenStore.getState().clearAccessToken()
      
      // Backend clears HttpOnly refresh cookie
      
      // Clear all queries
      queryClient.clear()
      
      // Navigate to login
      navigate({ to: '/' })
    },
    onError: () => {
      // Even if logout API call fails, clear client-side state
      useTokenStore.getState().clearAccessToken()
      queryClient.clear()
      navigate({ to: '/' })
    },
  })
}

// Hook to refresh token (used for initial session restore)
export const useRefreshToken = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // Store new access token in memory
      useTokenStore.getState().setAccessToken(data.accessToken)
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
    onError: () => {
      // Refresh failed - clear token (no valid session)
      useTokenStore.getState().clearAccessToken()
    },
  })
}

// Hook for verify email mutation
export const useVerifyEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: VerifyEmailCredentials) => {
      return authApi.verifyEmail(credentials)
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      }
    },
    onError: (error) => {
      console.error('Email verification failed:', error)
    },
  })
}

// Hook for resend verification email mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: (credentials: ResendVerificationCredentials) => {
      return authApi.resendVerification(credentials)
    },
    onError: (error) => {
      console.error('Resend verification failed:', error)
    },
  })
}

