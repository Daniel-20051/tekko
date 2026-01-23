import axios from 'axios'
import type {
  PricesResponse,
  RealtimePriceResponse,
  AllRealtimePricesResponse,
  MarketOverviewResponse,
  HistoricalDataResponse,
  MarketHealthResponse,
  MarketCoinData
} from '../types/market'

const MARKET_BASE_URL = import.meta.env.VITE_MARKET_API_BASE_URL || 'https://zxchange.onrender.com/api/v1'

// Create axios instance for market API (no auth required)
const marketApiClient = axios.create({
  baseURL: MARKET_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Get current prices (all coins)
export const getPrices = async (): Promise<PricesResponse['data']> => {
  const response = await marketApiClient.get<PricesResponse>('/market/prices')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch prices')
}

// Get real-time price (single coin)
export const getRealtimePrice = async (coin: string): Promise<RealtimePriceResponse['data']> => {
  const response = await marketApiClient.get<RealtimePriceResponse>(`/market/realtime/${coin.toUpperCase()}`)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch real-time price')
}

// Get all real-time prices
export const getAllRealtimePrices = async (): Promise<AllRealtimePricesResponse['data']> => {
  const response = await marketApiClient.get<AllRealtimePricesResponse>('/market/realtime')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch real-time prices')
}

// Get market overview
export const getMarketOverview = async (): Promise<MarketOverviewResponse['data']> => {
  const response = await marketApiClient.get<MarketOverviewResponse>('/market/overview')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch market overview')
}

// Get single coin market data
export const getCoinMarketData = async (coin: string): Promise<MarketCoinData> => {
  const response = await marketApiClient.get<{ success: true; message: string; data: MarketCoinData }>(`/market/${coin.toUpperCase()}`)
  if (response.data.success && response.data.data) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch coin market data')
}

// Get historical price data
export const getHistoricalData = async (
  coin: string,
  days: number | string = 7,
  vsCurrency: 'usd' | 'ngn' = 'usd'
): Promise<HistoricalDataResponse['data']> => {
  const response = await marketApiClient.get<HistoricalDataResponse>(
    `/market/${coin.toUpperCase()}/history`,
    {
      params: { days, vsCurrency }
    }
  )
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch historical data')
}

// Get market health status
export const getMarketHealth = async (): Promise<MarketHealthResponse['data']> => {
  const response = await marketApiClient.get<MarketHealthResponse>('/market/health')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch market health')
}
