import { apiClient } from '../lib/api-client'
import type { LoginCredentials, RegisterCredentials, RegisterResponse, LoginResponse, User, VerifyEmailCredentials, VerifyEmailResponse, ResendVerificationCredentials, ResendVerificationResponse, RefreshTokenResponse } from '../types/auth'

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
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {})
  
  // Extract accessToken from nested response structure
  if (response.data.success && response.data.data?.accessToken) {
    return { accessToken: response.data.data.accessToken }
  }
  
  throw new Error('Invalid refresh token response')
}

// Logout API call
// Backend clears the HttpOnly refresh cookie
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

// Verify email API call
export const verifyEmail = async (credentials: VerifyEmailCredentials): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post<VerifyEmailResponse>('/auth/verify-email', credentials)
  return response.data
}

// Resend verification email API call
export const resendVerification = async (credentials: ResendVerificationCredentials): Promise<ResendVerificationResponse> => {
  const response = await apiClient.post<ResendVerificationResponse>('/auth/resend-verification', credentials)
  return response.data
}

