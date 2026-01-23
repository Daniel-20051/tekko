import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import * as marketApi from '../api/market.api'
import type { RealtimePriceData } from '../types/market'
import { websocketService } from '../lib/websocket'

// Query key factory for market-related queries
export const marketKeys = {
  all: ['market'] as const,
  prices: () => [...marketKeys.all, 'prices'] as const,
  realtime: (coin?: string) => coin 
    ? [...marketKeys.all, 'realtime', coin] as const
    : [...marketKeys.all, 'realtime'] as const,
  overview: () => [...marketKeys.all, 'overview'] as const,
  coin: (coin: string) => [...marketKeys.all, 'coin', coin] as const,
  history: (coin: string, days: number | string, vsCurrency: string) => 
    [...marketKeys.all, 'history', coin, days, vsCurrency] as const,
  health: () => [...marketKeys.all, 'health'] as const,
}

// Hook to get current prices
export const usePrices = () => {
  return useQuery({
    queryKey: marketKeys.prices(),
    queryFn: marketApi.getPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider stale after 25 seconds
  })
}

// Hook to get real-time price (single coin)
export const useRealtimePrice = (coin: string) => {
  return useQuery({
    queryKey: marketKeys.realtime(coin),
    queryFn: () => marketApi.getRealtimePrice(coin),
    refetchInterval: 1000, // Refetch every second
    staleTime: 500, // Consider stale after 500ms
  })
}

// Hook to get all real-time prices (one-time initial fetch, then rely on WebSocket)
// This is only used for initial data before WebSocket connects
export const useAllRealtimePrices = (enabled: boolean = false) => {
  return useQuery({
    queryKey: marketKeys.realtime(),
    queryFn: marketApi.getAllRealtimePrices,
    enabled, // Only fetch when explicitly enabled (e.g., initial load)
    refetchInterval: false, // No polling - WebSocket handles updates
    staleTime: Infinity, // Don't refetch - WebSocket is the source of truth
  })
}

// Hook to get market overview
export const useMarketOverview = () => {
  return useQuery({
    queryKey: marketKeys.overview(),
    queryFn: marketApi.getMarketOverview,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider stale after 25 seconds
  })
}

// Hook to get single coin market data
export const useCoinMarketData = (coin: string) => {
  return useQuery({
    queryKey: marketKeys.coin(coin),
    queryFn: () => marketApi.getCoinMarketData(coin),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider stale after 25 seconds
  })
}

// Hook to get historical data
export const useHistoricalData = (
  coin: string,
  days: number | string = 7,
  vsCurrency: 'usd' | 'ngn' = 'usd'
) => {
  return useQuery({
    queryKey: marketKeys.history(coin, days, vsCurrency),
    queryFn: () => marketApi.getHistoricalData(coin, days, vsCurrency),
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000, // Consider stale after 4 minutes
  })
}

// Hook to get market health
export const useMarketHealth = () => {
  return useQuery({
    queryKey: marketKeys.health(),
    queryFn: marketApi.getMarketHealth,
    refetchInterval: 60000, // Refetch every minute
  })
}

// WebSocket hook for real-time price updates
// Uses the existing WebSocket connection from websocketService
export const useMarketWebSocket = (
  onPriceUpdate: (data: RealtimePriceData) => void,
  enabled: boolean = true
) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    // Listen for price_update events from the existing WebSocket
    const handlePriceUpdate = (event: CustomEvent) => {
      const priceData = event.detail as RealtimePriceData
      
      // Update React Query cache with new price data
      queryClient.setQueryData(
        marketKeys.realtime(priceData.coin),
        priceData
      )
      
      // Update all realtime prices cache
      queryClient.setQueryData(
        marketKeys.realtime(),
        (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            prices: {
              ...oldData.prices,
              [priceData.coin]: priceData
            }
          }
        }
      )
      
      // Call the callback
      onPriceUpdate(priceData)
    }

    // Subscribe to price_update events
    window.addEventListener('price-update', handlePriceUpdate as EventListener)

    return () => {
      // Cleanup: remove event listener
      window.removeEventListener('price-update', handlePriceUpdate as EventListener)
    }
  }, [enabled, onPriceUpdate, queryClient])

  // Return connection status from the existing WebSocket service
  return { 
    isConnected: typeof window !== 'undefined' && websocketService.isConnected()
  }
}
