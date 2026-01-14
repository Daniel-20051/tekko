// Authentication related types
export interface LoginCredentials {
  email: string
  password: string
  twoFactorToken?: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

// Success response structure
export interface RegisterSuccessResponse {
  success: true
  message: string
  data: {
    user: User
  }
}

export interface LoginSuccessResponse {
  success: true
  message: string
  data: {
    accessToken: string
    refreshToken?: string
    user: User
  }
}

// Error response structure
export interface ErrorResponse {
  success: false
  error: string
  code: string
  timestamp: string
}

// 2FA required response structure
export interface Login2FAResponse {
  success: true
  requires2FA: true
  message: string
}

// Device verification required response structure
export interface LoginDeviceVerificationResponse {
  success: true
  requiresDeviceVerification: true
  message: string
  deviceName: string
}

// Verify email request
export interface VerifyEmailCredentials {
  token: string
}

// Verify email success response structure
export interface VerifyEmailSuccessResponse {
  success: true
  message: string
  data: {
    success: true
    message: string
  }
}

// Resend verification email request
export interface ResendVerificationCredentials {
  email: string
}

// Resend verification email success response structure
export interface ResendVerificationSuccessResponse {
  success: true
  message: string
  data: {
    success: true
    message: string
  }
}

// Forgot password request
export interface ForgotPasswordCredentials {
  email: string
}

// Forgot password success response structure
export interface ForgotPasswordSuccessResponse {
  success: true
  message: string
  data: {
    success: true
    message: string
  }
}

// Reset password request
export interface ResetPasswordCredentials {
  token: string
  newPassword: string
}

// Reset password success response structure
export interface ResetPasswordSuccessResponse {
  success: true
  message: string
  data: {
    success: true
    message: string
  }
}

// Change password request
export interface ChangePasswordCredentials {
  currentPassword: string
  newPassword: string
}

// Change password success response structure
export interface ChangePasswordSuccessResponse {
  success: true
  message: string
  data: {
    success: true
    message: string
  }
}

// Refresh token success response structure
export interface RefreshTokenSuccessResponse {
  success: true
  message: string
  data: {
    accessToken: string
    user: User
  }
}

// Union type for register response (can be success or error)
export type RegisterResponse = RegisterSuccessResponse | ErrorResponse

export type LoginResponse = LoginSuccessResponse | Login2FAResponse | LoginDeviceVerificationResponse | ErrorResponse

export type VerifyEmailResponse = VerifyEmailSuccessResponse | ErrorResponse

export type ResendVerificationResponse = ResendVerificationSuccessResponse | ErrorResponse

export type ForgotPasswordResponse = ForgotPasswordSuccessResponse | ErrorResponse

export type ResetPasswordResponse = ResetPasswordSuccessResponse | ErrorResponse

export type ChangePasswordResponse = ChangePasswordSuccessResponse | ErrorResponse

export type RefreshTokenResponse = RefreshTokenSuccessResponse | ErrorResponse

// Get current user success response structure
export interface GetCurrentUserSuccessResponse {
  success: true
  message: string
  data: {
    user: User
  }
}

export type GetCurrentUserResponse = GetCurrentUserSuccessResponse | ErrorResponse

export interface User {
  id: number
  email: string
  phoneNumber: string | null
  phoneVerified: boolean
  emailVerified: boolean
  kycLevel: string
  role: string
  status: string
  name: string | null
  profileImage: string | null
  createdAt: string
  lastLoginAt: string | null
  lastLoginIp: string | null
  twoFactorEnabled?: boolean
}

// Profile response structure
export interface ProfileSuccessResponse {
  success: true
  message: string
  data: {
    user: User
  }
}

export type ProfileResponse = ProfileSuccessResponse | ErrorResponse

// Update profile request
export interface UpdateProfileRequest {
  phoneNumber?: string
}

// Update profile response
export interface UpdateProfileSuccessResponse {
  success: true
  message: string
  data: {
    user: User
  }
}

export type UpdateProfileResponse = UpdateProfileSuccessResponse | ErrorResponse

// 2FA Setup response
export interface TwoFactorSetupSuccessResponse {
  success: true
  message: string
  data: {
    secret: string // 32-character base32 string
    qrCode: string // data URL image
    otpauthUrl: string // for manual entry
  }
}

export type TwoFactorSetupResponse = TwoFactorSetupSuccessResponse | ErrorResponse

// 2FA Enable request
export interface TwoFactorEnableCredentials {
  token: string // 6-digit code from authenticator app
}

// 2FA Enable response
export interface TwoFactorEnableSuccessResponse {
  success: true
  message: string
  data: {
    backupCodes: string[] // 10 backup codes, 8-character alphanumeric each
  }
}

export type TwoFactorEnableResponse = TwoFactorEnableSuccessResponse | ErrorResponse

// 2FA Disable request
export interface TwoFactorDisableCredentials {
  password: string
  twoFactorToken: string
}

// 2FA Disable response
export interface TwoFactorDisableSuccessResponse {
  success: true
  message: string
}

export type TwoFactorDisableResponse = TwoFactorDisableSuccessResponse | ErrorResponse

// Google OAuth URL response
export interface GoogleOAuthUrlSuccessResponse {
  success: true
  message: string
  data: {
    authUrl: string
    state: string
  }
}

export type GoogleOAuthUrlResponse = GoogleOAuthUrlSuccessResponse | ErrorResponse

// Google OAuth callback request
export interface GoogleOAuthCallbackCredentials {
  code: string
  state: string
}

// Google OAuth callback success response
export interface GoogleOAuthCallbackSuccessResponse {
  success: true
  message: string
  data: {
    accessToken: string
    refreshToken?: string
    user: User
  }
}

// Google OAuth callback device verification response
export interface GoogleOAuthCallbackDeviceVerificationResponse {
  success: true
  message: string
  data: {
    requiresDeviceVerification: true
    deviceName: string
  }
}

export type GoogleOAuthCallbackResponse = GoogleOAuthCallbackSuccessResponse | GoogleOAuthCallbackDeviceVerificationResponse | ErrorResponse

// Link Google account request
export interface LinkGoogleAccountCredentials {
  password: string
  code: string
  state: string
}

// Link Google account response
export interface LinkGoogleAccountSuccessResponse {
  success: true
  message: string
  data: {
    accessToken: string
    refreshToken?: string
    user: User
  }
}

export type LinkGoogleAccountResponse = LinkGoogleAccountSuccessResponse | ErrorResponse

// Security status response
export interface SecurityStatusData {
  twoFactorEnabled: boolean
  twoFactorSetupStarted: boolean
  pinSet: boolean
  emailVerified: boolean
  phoneVerified: boolean
  lastLogin: {
    at: string
    ip: string
  }
  activeSessions: number
}

export interface SecurityStatusSuccessResponse {
  success: true
  message: string
  data: SecurityStatusData
}

export type SecurityStatusResponse = SecurityStatusSuccessResponse | ErrorResponse

// Session data from API
export interface SessionData {
  id: string
  userId: number
  refreshToken: string
  isActive: boolean
  ipAddress: string
  userAgent: string
  device: string
  browser: string
  os: string
  country: string
  city: string
  lastActive: string
  createdAt: string
  expiresAt: string
}

// Get sessions success response structure
export interface GetSessionsSuccessResponse {
  success: true
  message: string
  data: {
    sessions: SessionData[]
  }
}

export type GetSessionsResponse = GetSessionsSuccessResponse | ErrorResponse

// PIN status response
export interface PinStatusData {
  hasPin: boolean
  message: string
}

export interface PinStatusSuccessResponse {
  success: true
  data: PinStatusData
}

export type PinStatusResponse = PinStatusSuccessResponse | ErrorResponse

// Request PIN OTP
export interface RequestPinOtpSuccessResponse {
  success: true
  message: string
}

export type RequestPinOtpResponse = RequestPinOtpSuccessResponse | ErrorResponse

// Create PIN request
export interface CreatePinCredentials {
  pin: string
  otp: string
}

// Change PIN request
export interface ChangePinCredentials {
  newPin: string
  otp: string
}

export interface CreatePinSuccessResponse {
  success: true
  message: string
  data: {
    success: true
    message: string
  }
}

export type CreatePinResponse = CreatePinSuccessResponse | ErrorResponse

// Device verification request
export interface VerifyDeviceCredentials {
  email: string
  verificationCode: string
}

// Device verification success response structure
export interface VerifyDeviceSuccessResponse {
  success: true
  message: string
  data: {
    accessToken: string
    refreshToken?: string
    user: User
  }
}

export type VerifyDeviceResponse = VerifyDeviceSuccessResponse | ErrorResponse

