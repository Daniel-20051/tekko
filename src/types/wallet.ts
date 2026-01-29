// Wallet API Types

export interface Wallet {
  id: number
  userId: number
  currency: string
  balance: string
  formattedBalance: string
  availableBalance: string
  lockedBalance: string
  fiatValue: {
    NGN: string
    USD: string
  }
  pricePerUnit: {
    NGN: string
    USD: string
  }
  priceStale: boolean
  createdAt: string
  updatedAt: string
}

export interface PortfolioTotal {
  NGN: string
  USD: string
}

export interface WalletBalancesData {
  wallets: Wallet[]
  portfolioTotal: PortfolioTotal
}

export interface GetWalletBalancesResponse {
  success: boolean
  message: string
  data: WalletBalancesData
}

// Single Currency Balance Types
export interface WalletBalance {
  id: number | null  // null if wallet doesn't exist yet
  currency: string
  balance: string
  availableBalance: string
  lockedBalance: string
  formattedBalance: string
  fiatValue: {
    NGN: string
    USD: string
  }
  pricePerUnit: {
    NGN: string
    USD: string
  }
  priceStale: boolean
}

export interface SingleCurrencyBalance {
  wallet: WalletBalance
}

// New API response format
export interface CryptoBalanceResponse {
  currency: string
  balance: string
  availableBalance: string
  lockedBalance: string
  pendingBalance: string
  valueUSD: string
}

export interface GetSingleCurrencyBalanceResponse {
  success: boolean
  message?: string
  data: CryptoBalanceResponse
}

// Create Wallet Types
export interface CreateWalletRequest {
  currency: string
}

export interface CreateWalletData {
  walletId: number
  currency: string
  network: string
  balance: string
  createdAt: string
}

export interface CreateWalletResponse {
  success: boolean
  data: CreateWalletData
  message: string
}

// Supported Currencies Types
export interface SupportedCurrency {
  code: string
  name: string
  symbol: string
  networks: string[]
  minDeposit: string
  minWithdraw: string
  withdrawFee: string
}

export interface SupportedCurrenciesData {
  currencies: SupportedCurrency[]
}

export interface GetSupportedCurrenciesResponse {
  success: boolean
  message: string
  data: SupportedCurrenciesData
}

// Crypto Balances Types
export interface CryptoBalance {
  currency: string
  balance: string
  availableBalance: string
  lockedBalance: string
  pendingBalance: string
  valueUSD: string
}

export interface CryptoBalancesData {
  balances: CryptoBalance[]
  totalValueUSD: string
}

export interface GetCryptoBalancesResponse {
  success: boolean
  message?: string
  data: CryptoBalancesData
}

// Deposit Address Types
export interface DepositAddressInfo {
  address: string
  network: string | null
  createdAt: string
}

export interface DepositAddressData {
  address: DepositAddressInfo
  qrCode?: string
  memo?: string | null
  warnings?: string[]
  currency?: string
  network?: string
}

export interface GetDepositAddressResponse {
  success: boolean
  message?: string
  data: DepositAddressData
}

// Withdrawal Types
export interface WithdrawRequest {
  currency: string
  amount: string
  toAddress: string
  pin: string
}

export interface WithdrawData {
  withdrawalId: number
  currency: string
  amount: string
  fee: string
  totalDeducted: string
  toAddress: string
  status: string
  estimatedCompletion: string
  createdAt: string
}

export interface WithdrawResponse {
  success: boolean
  message?: string
  data: WithdrawData
}

// NGN Withdrawal Types
export interface NGNWithdrawalFeesRequest {
  currency: string
  amount: string
}

export interface NGNWithdrawalFeesData {
  amount: string
  fees: {
    total: string
    userCharge: string
    platformProfit: string
  }
  totalRequired: string
  netAmount: string
}

export interface NGNWithdrawalFeesResponse {
  success: boolean
  data: NGNWithdrawalFeesData
}

export interface NGNWithdrawalRequest {
  currency: string
  amount: string
  destinationAddress: string
  transferPin: string
  twoFactorToken?: string
  bankDetails: {
    accountNumber: string
    institutionId?: string // Preferred - from verification step
    bankCode?: string // Fallback
  }
}

export interface NGNWithdrawalData {
  transactionId: number
  status: string
  amount: string
  fees: {
    total: string
    userCharge: string
  }
  totalDeducted: string
  netAmount: string
  newBalance: string
  reference?: string // Legacy field
  externalReference: string
  verifiedAccountName: string
  estimatedProcessingTime?: string
  message?: string
  estimatedCompletion: string
  createdAt: string
}

export interface NGNWithdrawalResponse {
  success: boolean
  message?: string
  error?: string
  data: NGNWithdrawalData
}

// Deposit Account Types (for Fiat/NGN)
export interface DepositAccountKycData {
  firstName: string
  lastName: string
  middleName?: string
  phoneNumber: string // Format: 234 + phone number
  dateOfBirth: string // YYYY-MM-DD
  address: {
    line: string
    city: string
    state: string
  }
}

export interface DepositAccountRequest {
  currency: string
  kycData?: DepositAccountKycData
}

export interface DepositAccountData {
  currency: string
  bank: string
  accountNumber: string
  accountName: string
  instructions: string
}

export interface DepositAccountResponse {
  success: boolean
  message?: string
  data: DepositAccountData
}

export interface DepositAccountErrorResponse {
  success: false
  error: 'KYC_REQUIRED' | 'ACCOUNT_NOT_AVAILABLE'
  message: string
  code?: string
  required?: {
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    address: {
      line: string
      city: string
      state: string
    }
  }
}
