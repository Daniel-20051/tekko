// Transaction API Types

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'fee'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type Currency = 'BTC' | 'ETH' | 'USDT' | 'NGN' | 'USD'

export interface Transaction {
  id: number
  type: TransactionType
  currency: Currency
  amount: string
  fee: string
  status: TransactionStatus
  blockchainTxId: string | null
  blockchainConfirmations: number
  balanceBefore: string
  balanceAfter: string
  metadata: {
    network?: string
    fromAddress?: string
    toAddress?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
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
