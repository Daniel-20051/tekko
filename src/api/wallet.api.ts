import { apiClient } from '../lib/api-client'
import type { GetWalletBalancesResponse, WalletBalancesData, GetSupportedCurrenciesResponse, SupportedCurrenciesData, GetSingleCurrencyBalanceResponse, SingleCurrencyBalance, CreateWalletRequest, CreateWalletResponse, CreateWalletData, GetDepositAddressResponse, DepositAddressData, WithdrawRequest, WithdrawResponse, WithdrawData, DepositAccountRequest, DepositAccountResponse, DepositAccountData, DepositAccountErrorResponse, NGNWithdrawalFeesRequest, NGNWithdrawalFeesResponse, NGNWithdrawalFeesData, NGNWithdrawalRequest, NGNWithdrawalResponse, NGNWithdrawalData } from '../types/wallet'
import type { GetTransactionsResponse, TransactionsData, TransactionQueryParams, GetSingleTransactionResponse, Transaction, TransactionType } from '../types/transaction'

// Get all wallet balances (Fiat + Crypto)
export const getWalletBalances = async (): Promise<WalletBalancesData> => {
  const response = await apiClient.get<GetWalletBalancesResponse>('/wallet/')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch wallet balances')
}

// Get single currency balance
export const getSingleCurrencyBalance = async (currency: string): Promise<SingleCurrencyBalance> => {
  const response = await apiClient.get<GetSingleCurrencyBalanceResponse>(`/api/v1/crypto/balance/${currency.toUpperCase()}`)
  if (response.data.success) {
    // Transform the new API response format to match the expected structure
    const apiData = response.data.data
    return {
      wallet: {
        id: null, // New API doesn't return id
        currency: apiData.currency,
        balance: apiData.balance,
        availableBalance: apiData.availableBalance,
        lockedBalance: apiData.lockedBalance,
        formattedBalance: parseFloat(apiData.balance).toFixed(8),
        fiatValue: {
          NGN: '0.00', // New API doesn't return NGN, only USD
          USD: apiData.valueUSD || '0.00'
        },
        pricePerUnit: {
          NGN: '0.00',
          USD: '0.00' // Would need to calculate from balance and valueUSD if needed
        },
        priceStale: false
      }
    }
  }
  throw new Error('Failed to fetch currency balance')
}

// Get supported currencies
export const getSupportedCurrencies = async (): Promise<SupportedCurrenciesData> => {
  const response = await apiClient.get<GetSupportedCurrenciesResponse>('/api/v1/crypto/supported')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch supported currencies')
}

// Get transaction history (old endpoint)
export const getTransactions = async (params?: TransactionQueryParams): Promise<TransactionsData> => {
  const response = await apiClient.get<GetTransactionsResponse>('/api/v1/crypto/transactions', {
    params
  })
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch transactions')
}

// Get transaction history (new endpoint)
export const getWalletTransactions = async (params?: TransactionQueryParams): Promise<TransactionsData> => {
  const response = await apiClient.get<GetTransactionsResponse>('/wallet/transactions', {
    params
  })
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch transactions')
}

// Get single transaction details
export const getSingleTransaction = async (transactionId: string): Promise<Transaction> => {
  const response = await apiClient.get<GetSingleTransactionResponse>(`/wallet/transactions/${transactionId}`)
  if (response.data.success) {
    const apiTransaction = response.data.data.transaction
    
    // Parse metadata if it's a string
    let parsedMetadata: Transaction['metadata'] = undefined
    if (apiTransaction.metadata) {
      if (typeof apiTransaction.metadata === 'string') {
        try {
          parsedMetadata = JSON.parse(apiTransaction.metadata)
        } catch {
          parsedMetadata = {}
        }
      } else {
        parsedMetadata = apiTransaction.metadata
      }
    }
    
    // Map API response to Transaction type
    return {
      id: apiTransaction.id,
      type: apiTransaction.type as TransactionType,
      currency: apiTransaction.currency,
      amount: apiTransaction.amount,
      fee: apiTransaction.fee,
      status: apiTransaction.status,
      txHash: apiTransaction.txHash || undefined,
      blockchainTxId: apiTransaction.txHash || null,
      balanceBefore: apiTransaction.balanceBefore,
      balanceAfter: apiTransaction.balanceAfter,
      metadata: parsedMetadata,
      network: parsedMetadata?.network,
      address: apiTransaction.externalAddress || undefined,
      createdAt: apiTransaction.createdAt,
      updatedAt: apiTransaction.updatedAt,
      completedAt: apiTransaction.completedAt,
      blockchainConfirmations: undefined,
      confirmations: undefined,
      requiredConfirmations: undefined
    }
  }
  throw new Error(response.data.message || 'Failed to fetch transaction details')
}

// Create crypto wallet
export const createWallet = async (data: CreateWalletRequest): Promise<CreateWalletData> => {
  const response = await apiClient.post<CreateWalletResponse>('/api/v1/crypto/wallets/create', data)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to create wallet')
}

// Get deposit address
export const getDepositAddress = async (currency: string): Promise<DepositAddressData> => {
  const response = await apiClient.get<GetDepositAddressResponse>(`/api/v1/crypto/deposit-address/${currency.toUpperCase()}`)
  if (response.data.success) {
    return response.data.data
  }
  // Handle error response format - check for 'error' field first
  const errorResponse = response.data as any
  const errorMessage = errorResponse.error || errorResponse.message || 'Failed to fetch deposit address'
  // Remove "Redbiller" from error messages and clean up
  let cleanErrorMessage = errorMessage.replace(/redbiller/gi, '').trim()
  // If message contains "service temporarily unavailable", standardize it
  if (cleanErrorMessage.toLowerCase().includes('service temporarily unavailable')) {
    cleanErrorMessage = 'Service temporarily unavailable. Please try again later.'
  }
  throw new Error(cleanErrorMessage || 'Service temporarily unavailable. Please try again later.')
}

// Withdraw crypto
export const withdrawCrypto = async (data: WithdrawRequest): Promise<WithdrawData> => {
  const response = await apiClient.post<WithdrawResponse>('/api/v1/crypto/withdraw', data)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to initiate withdrawal')
}

// Calculate NGN withdrawal fees
export const calculateNGNWithdrawalFees = async (data: NGNWithdrawalFeesRequest): Promise<NGNWithdrawalFeesData> => {
  const response = await apiClient.post<NGNWithdrawalFeesResponse>('/api/v1/wallet/withdrawal/fees', data)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error('Failed to calculate withdrawal fees')
}

// Process NGN withdrawal
export const withdrawNGN = async (data: NGNWithdrawalRequest): Promise<NGNWithdrawalData> => {
  const response = await apiClient.post<NGNWithdrawalResponse>('/api/v1/wallet/withdrawal', data)
  if (response.data.success) {
    return response.data.data
  }
  // Handle error response format
  const errorResponse = response.data as any
  const errorMessage = errorResponse.error || errorResponse.message || 'Failed to initiate withdrawal'
  throw new Error(errorMessage)
}

// Get deposit account (for Fiat/NGN)
export const getDepositAccount = async (data: DepositAccountRequest): Promise<DepositAccountData> => {
  const response = await apiClient.post<DepositAccountResponse | DepositAccountErrorResponse>('/api/v1/wallet/deposit/account', data)
  if (response.data.success) {
    return (response.data as DepositAccountResponse).data
  }
  // Handle KYC required error
  const errorResponse = response.data as DepositAccountErrorResponse
  if (errorResponse.error === 'KYC_REQUIRED') {
    const error = new Error(errorResponse.message || 'KYC information required')
    ;(error as any).kycRequired = true
    ;(error as any).required = errorResponse.required
    throw error
  }
  throw new Error(errorResponse.message || 'Failed to get deposit account')
}
