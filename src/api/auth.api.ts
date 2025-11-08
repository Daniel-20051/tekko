import { apiClient } from '../lib/api-client'
import type { LoginCredentials, RegisterCredentials, RegisterResponse, LoginResponse, User } from '../types/auth'

// Login API call
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  
  
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
 
    return response.data
  } catch (error) {
    throw error
  }
}

// Register API call
export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register', credentials)
  return response.data
}

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}

// Refresh token API call
// Backend validates HttpOnly refresh cookie and returns new access token
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {})
  return response.data
}

// Logout API call
// Backend clears the HttpOnly refresh cookie
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

