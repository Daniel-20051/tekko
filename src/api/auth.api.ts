import { apiClient } from '../lib/api-client'
import type { LoginCredentials, RegisterCredentials, RegisterResponse, LoginResponse, User, VerifyEmailCredentials, VerifyEmailResponse, ResendVerificationCredentials, ResendVerificationResponse, ForgotPasswordCredentials, ForgotPasswordResponse, ResetPasswordCredentials, ResetPasswordResponse, ChangePasswordCredentials, ChangePasswordResponse, RefreshTokenResponse, GetCurrentUserResponse, GetSessionsResponse, SessionData, PinStatusResponse, PinStatusData, CreatePinCredentials, CreatePinResponse, RequestPinOtpResponse, VerifyDeviceCredentials, VerifyDeviceResponse } from '../types/auth'

// Login API call
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}

// Register API call
export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register', credentials)
  return response.data
}

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<GetCurrentUserResponse>('/auth/me')
  if (response.data.success) {
    return response.data.data.user
  }
  throw new Error(response.data.error || 'Failed to fetch current user')
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

// Logout from all devices API call
export const logoutAll = async (): Promise<void> => {
  await apiClient.post('/auth/logout-all')
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

// Forgot password API call
export const forgotPassword = async (credentials: ForgotPasswordCredentials): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>('/auth/password/forgot', credentials)
  return response.data
}

// Reset password API call
export const resetPassword = async (credentials: ResetPasswordCredentials): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>('/auth/password/reset', credentials)
  return response.data
}

// Change password API call
export const changePassword = async (credentials: ChangePasswordCredentials): Promise<ChangePasswordResponse> => {
  const response = await apiClient.post<ChangePasswordResponse>('/auth/password/change', credentials)
  return response.data
}

// Get sessions API call
export const getSessions = async (): Promise<SessionData[]> => {
  const response = await apiClient.get<GetSessionsResponse>('/auth/sessions')
  if (response.data.success) {
    return response.data.data.sessions
  }
  throw new Error(response.data.error || 'Failed to fetch sessions')
}

// Terminate session API call
export const terminateSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`/auth/sessions/${sessionId}`)
}

// Get PIN status API call
export const getPinStatus = async (): Promise<PinStatusData> => {
  const response = await apiClient.get<PinStatusResponse>('/auth/pin/status')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.error || 'Failed to fetch PIN status')
}

// Request PIN OTP API call
export const requestPinOtp = async (): Promise<RequestPinOtpResponse> => {
  const response = await apiClient.post<RequestPinOtpResponse>('/auth/pin/create/request-otp', {})
  return response.data
}

// Create PIN API call
export const createPin = async (credentials: CreatePinCredentials): Promise<CreatePinResponse> => {
  const response = await apiClient.post<CreatePinResponse>('/auth/pin/create', credentials)
  return response.data
}

// Verify device API call
export const verifyDevice = async (credentials: VerifyDeviceCredentials): Promise<VerifyDeviceResponse> => {
  const response = await apiClient.post<VerifyDeviceResponse>('/auth/verify-device', credentials)
  return response.data
}

