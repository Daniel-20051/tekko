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




// Union type for register response (can be success or error)
export type RegisterResponse = RegisterSuccessResponse | ErrorResponse

export type LoginResponse = LoginSuccessResponse | Login2FAResponse | ErrorResponse


export interface User {
  id: number
  email: string
  role: string
  status?: string
  twoFactorEnabled?: boolean
  emailVerified?: boolean

}

