// Transaction API Types

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'fee' | 'manual_credit' | string
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type Currency = 'BTC' | 'ETH' | 'USDT' | 'NGN' | 'USD'

export interface Transaction {
  id: number
  type: TransactionType
  currency: Currency
  amount: string
  fee: string
  status: TransactionStatus
  network?: string
  address?: string
  txHash?: string
  confirmations?: number
  requiredConfirmations?: number
  // Legacy fields for backward compatibility
  blockchainTxId?: string | null
  blockchainConfirmations?: number
  balanceBefore: string
  balanceAfter: string
  metadata?: {
    network?: string
    fromAddress?: string
    toAddress?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt?: string
  completedAt: string | null
}

export interface TransactionPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface TransactionsData {
  transactions: Transaction[]
  pagination: TransactionPagination
}

export interface GetTransactionsResponse {
  success: boolean
  data: TransactionsData
  message: string
}

export interface TransactionQueryParams {
  currency?: Currency
  type?: TransactionType
  status?: TransactionStatus
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface GetSingleTransactionResponse {
  success: boolean
  data: {
    transaction: {
      id: number
      userId: number
      type: string
      currency: Currency
      amount: string
      fee: string
      platformProfit?: string
      status: TransactionStatus
      fromWalletId?: number | null
      toWalletId?: number | null
      externalReference?: string | null
      txHash?: string | null
      externalAddress?: string | null
      bankDetails?: any
      metadata?: string | {
        network?: string
        fromAddress?: string
        toAddress?: string
        note?: string
        admin?: string
        [key: string]: any
      }
      errorMessage?: string | null
      idempotencyKey?: string | null
      balanceBefore: string
      balanceAfter: string
      createdAt: string
      updatedAt: string
      completedAt: string | null
    }
  }
  message: string
}
