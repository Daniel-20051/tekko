import { apiClient } from '../lib/api-client'
import type { GetWalletBalancesResponse, WalletBalancesData, GetSupportedCurrenciesResponse, SupportedCurrenciesData, GetSingleCurrencyBalanceResponse, SingleCurrencyBalance, CreateWalletRequest, CreateWalletResponse, CreateWalletData, GetCryptoBalancesResponse, CryptoBalancesData } from '../types/wallet'
import type { GetTransactionsResponse, TransactionsData, TransactionQueryParams } from '../types/transaction'

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
  const response = await apiClient.get<GetSingleCurrencyBalanceResponse>(`/wallet/${currency.toUpperCase()}/balance`)
  if (response.data.success) {
    return response.data.data
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

// Get transaction history
export const getTransactions = async (params?: TransactionQueryParams): Promise<TransactionsData> => {
  const response = await apiClient.get<GetTransactionsResponse>('/wallet/transactions', {
    params
  })
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch transactions')
}

// Create crypto wallet
export const createWallet = async (data: CreateWalletRequest): Promise<CreateWalletData> => {
  const response = await apiClient.post<CreateWalletResponse>('/api/v1/crypto/wallets/create', data)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to create wallet')
}

// Get crypto balances
export const getCryptoBalances = async (): Promise<CryptoBalancesData> => {
  const response = await apiClient.get<GetCryptoBalancesResponse>('/api/v1/crypto/balances')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch crypto balances')
}
