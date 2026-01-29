// Bank types
export interface Bank {
  code: string
  name: string
  slug?: string
  longcode?: string
  gateway?: string | null
  active?: boolean
  institutionId?: string // UUID for the bank institution
  logo?: string // Logo URL for the bank
}

// Verify Account Types
export interface VerifyAccountRequest {
  accountNumber: string
  institutionId: string // Required - use institutionId directly
  bankCode?: string // Optional fallback for API compatibility
}

export interface Institution {
  id: string
  name: string
  logo?: string
}

export interface VerifyAccountData {
  verified: boolean
  accountNumber: string
  accountName: string
  institution: Institution
}

export interface VerifyAccountResponse {
  success: boolean
  message: string
  data: VerifyAccountData
}

export interface BanksData {
  banks: Bank[]
  count: number
}

export interface InstitutionsData {
  institutions: Array<{
    id: string
    name: string
    logo?: string
  }>
  count: number
}

export interface BanksResponse {
  success: boolean
  message?: string
  data: BanksData | InstitutionsData
}
