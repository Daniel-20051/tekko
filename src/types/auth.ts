// Authentication related types
export interface LoginCredentials {
  email: string
  password: string
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




// Union type for register response (can be success or error)
export type RegisterResponse = RegisterSuccessResponse | ErrorResponse

export type LoginResponse = LoginSuccessResponse | ErrorResponse


export interface User {
  id: number
  email: string
  role: string
  status?: string
  twoFactorEnabled?: boolean
  emailVerified?: boolean

}

