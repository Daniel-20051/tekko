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

export interface GetSingleCurrencyBalanceResponse {
  success: boolean
  message?: string
  data: SingleCurrencyBalance
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
