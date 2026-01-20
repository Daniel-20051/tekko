// Wallet API Types

export interface Wallet {
  currency: string
  balance: string
  availableBalance: string
  lockedBalance: string
  pendingBalance: string
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
