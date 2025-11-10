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

export type LoginResponse = LoginSuccessResponse | Login2FAResponse | ErrorResponse

export type VerifyEmailResponse = VerifyEmailSuccessResponse | ErrorResponse

export type ResendVerificationResponse = ResendVerificationSuccessResponse | ErrorResponse

export type RefreshTokenResponse = RefreshTokenSuccessResponse | ErrorResponse


export interface User {
  id: number
  email: string
  role: string
  status?: string
  twoFactorEnabled?: boolean
  emailVerified?: boolean

}

