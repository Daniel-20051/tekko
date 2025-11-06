import { apiClient } from '../lib/api-client'
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth'

// Login API call
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return response.data
}

// Register API call
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
  return response.data
}

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}

// Logout API call
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

