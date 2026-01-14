import { apiClient } from '../lib/api-client'
import type { SecurityStatusResponse, SecurityStatusData, ProfileResponse, User, UpdateProfileRequest, UpdateProfileResponse } from '../types/auth'

// Get security status API call
export const getSecurityStatus = async (): Promise<SecurityStatusData> => {
  const response = await apiClient.get<SecurityStatusResponse>('/settings/security')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.error || 'Failed to fetch security status')
}

// Get profile API call
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ProfileResponse>('/settings/profile')
  if (response.data.success) {
    return response.data.data.user
  }
  throw new Error(response.data.error || 'Failed to fetch profile')
}

// Update profile API call
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await apiClient.put<UpdateProfileResponse>('/settings/profile', data)
  if (response.data.success) {
    return response.data.data.user
  }
  throw new Error(response.data.error || 'Failed to update profile')
}
