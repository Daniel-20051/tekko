// Swap API Types

export interface SwapPairsData {
  pairs: string[]
  count: number
}

export interface SwapPairsResponse {
  success: boolean
  message: string
  data: SwapPairsData
}

export interface SwapCalculateRequest {
  pair: string // e.g., "BTC-NGN"
  type: 'buy' | 'sell'
  amount: string
}

export interface SwapQuoteData {
  pair: string
  type: 'buy' | 'sell'
  fromCurrency: string
  toCurrency: string
  inputAmount: string
  outputAmount: string
  baseAmount: string
  price: string
  tradingFee: string
  tradingFeePercent: number
  spread: string
  quote: {
    bid: string
    ask: string
    timestamp: number
  }
}

export interface SwapCalculateResponse {
  success: boolean
  message: string
  data: SwapQuoteData
}

export interface SwapExecuteRequest {
  pair: string // e.g., "BTC-NGN"
  type: 'buy' | 'sell'
  amount: string
  pin: string // 4-digit transaction PIN
  twoFactorToken?: string // Optional, if 2FA is required
}

export interface SwapBalanceInfo {
  before: string
  after: string
}

export interface SwapExecuteData {
  swapId: number
  pair: string
  type: 'buy' | 'sell'
  fromCurrency: string
  toCurrency: string
  fromAmount: string
  toAmount: string
  price: string
  tradingFee: string
  sourceTransactionId: number
  destinationTransactionId: number
  balances: Record<string, SwapBalanceInfo>
  executedAt: string
}

export interface SwapExecuteResponse {
  success: boolean
  message: string
  data: SwapExecuteData
}
