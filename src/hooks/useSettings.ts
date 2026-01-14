import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as settingsApi from '../api/settings.api'
import * as authApi from '../api/auth.api'
import { useTokenStore } from '../store/token.store'

// Query key factory for settings-related queries
export const settingsKeys = {
  all: ['settings'] as const,
  securityStatus: () => [...settingsKeys.all, 'security-status'] as const,
  sessions: () => [...settingsKeys.all, 'sessions'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
}

// Hook to get security status
export const useSecurityStatus = () => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: settingsKeys.securityStatus(),
    queryFn: settingsApi.getSecurityStatus,
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
  })
}

// Hook to get profile
export const useProfile = () => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: settingsApi.getProfile,
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
  })
}

// Hook to get sessions
export const useSessions = () => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: settingsKeys.sessions(),
    queryFn: authApi.getSessions,
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
  })
}

// Hook to terminate a session
export const useTerminateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => authApi.terminateSession(sessionId),
    onSuccess: () => {
      // Invalidate and refetch sessions list
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() })
    },
  })
}

// Hook to update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() })
    },
  })
}
