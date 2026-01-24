// KYC related types

// BVN Submission Request
export interface SubmitBvnRequest {
  bvn: string
}

// BVN Document Status
export interface BvnDocument {
  id: number
  status: 'pending' | 'approved' | 'rejected'
  verifiedBy?: 'redbiller' | 'manual'
  verifiedAt?: string
}

// BVN Submission Status
export interface BvnSubmission {
  id: number
  requestedLevel: number
  status: 'pending' | 'approved' | 'rejected'
}

// BVN Submission Success Response (Verified)
export interface SubmitBvnVerifiedSuccessResponse {
  success: true
  message: string
  data: {
    bvnVerified: true
    kycLevel: 2
    dailyLimit: number
    document: BvnDocument
    submission: BvnSubmission
    name?: string // Name extracted from BVN
  }
}

// BVN Submission Success Response (Pending)
export interface SubmitBvnPendingSuccessResponse {
  success: true
  message: string
  data: {
    bvnVerified: false
    document: BvnDocument
    submission: BvnSubmission
    name?: string // Name extracted from BVN
  }
}

// BVN Submission Error Response
export interface SubmitBvnErrorResponse {
  success: false
  error: string
  code?: string
  timestamp?: string
}

// Union type for BVN submission response
export type SubmitBvnResponse = SubmitBvnVerifiedSuccessResponse | SubmitBvnPendingSuccessResponse | SubmitBvnErrorResponse

// Customer Creation Request
export interface CreateCustomerRequest {
  firstName: string
  lastName: string
  middleName?: string
  phoneNumber: string
  dateOfBirth: string // Format: "YYYY-MM-DD"
  country?: string // ISO country code (e.g., "NGA"), defaults to "NGA" if Nigeria
  address: {
    line: string
    city: string
    state: string
  }
}

// Customer Creation Response
export interface CreateCustomerResponse {
  success: true
  message: string
  data: {
    customerReference: string
    redBillerData: any
  }
}