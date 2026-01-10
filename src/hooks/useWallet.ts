import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTokenStore } from '../store/token.store'
import * as walletApi from '../api/wallet.api'
import type { TransactionQueryParams } from '../types/transaction'
import type { CreateWalletRequest } from '../types/wallet'

// Query keys for wallet-related queries
export const walletKeys = {
  all: ['wallet'] as const,
  balances: () => [...walletKeys.all, 'balances'] as const,
  singleBalance: (currency: string) => [...walletKeys.all, 'balance', currency] as const,
  supportedCurrencies: () => [...walletKeys.all, 'supported-currencies'] as const,
  transactions: (params?: TransactionQueryParams) => [...walletKeys.all, 'transactions', params] as const,
}

// Hook to get wallet balances
export const useWalletBalances = () => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: walletKeys.balances(),
    queryFn: walletApi.getWalletBalances,
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds (balances change frequently)
    refetchInterval: 60000, // Auto-refetch every 60 seconds to keep balances up to date
  })
}

// Hook to get single currency balance
export const useSingleCurrencyBalance = (currency: string) => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: walletKeys.singleBalance(currency),
    queryFn: () => walletApi.getSingleCurrencyBalance(currency),
    enabled: !!accessToken && !!currency, // Only fetch if token exists and currency is provided
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Auto-refetch every 60 seconds
  })
}

// Hook to get supported currencies
export const useSupportedCurrencies = () => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: walletKeys.supportedCurrencies(),
    queryFn: walletApi.getSupportedCurrencies,
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
    staleTime: 300000, // Consider data fresh for 5 minutes (supported currencies rarely change)
  })
}

// Hook to get transaction history
export const useTransactions = (params?: TransactionQueryParams) => {
  const accessToken = useTokenStore((state) => state.accessToken)
  
  return useQuery({
    queryKey: walletKeys.transactions(params),
    queryFn: () => walletApi.getTransactions(params),
    enabled: !!accessToken, // Only fetch if token exists in memory
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Auto-refetch every 60 seconds
  })
}

// Hook to create a wallet
export const useCreateWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletApi.createWallet(data),
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch wallet data
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
      queryClient.invalidateQueries({ queryKey: walletKeys.singleBalance(data.currency) })
      queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
    },
  })
}
