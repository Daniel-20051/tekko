// Market data types

// Price data structure
export interface PriceData {
  usd: number
  ngn: number
  usd_24h_change?: number
  usd_market_cap?: number
  usd_24h_vol?: number
}

// Real-time price data
export interface RealtimePriceData {
  coin: string
  base: string
  symbol: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  quoteVolume: number
  priceChange: number
  priceChangePercent: number
  trades: number
  timestamp: number
  date: string
  note?: string
}

// Market overview coin data
export interface MarketCoinData {
  coin: string
  name: string
  symbol: string
  image: string
  currentPrice: {
    usd: number
  }
  marketCap: {
    usd: number
    rank: number
  }
  volume24h: {
    usd: number
  }
  priceChange24h: {
    usd: number
    percent: number
  }
  priceChange7d?: {
    percent: number
  }
  priceChange30d?: {
    percent: number
  }
  allTimeHigh: {
    usd: number
    date: string
    changePercent: number
  }
  allTimeLow: {
    usd: number
    date: string
    changePercent: number
  }
  supply: {
    circulating: number
    total: number
    max: number
  }
  fullyDilutedValuation: number
  lastUpdated: string
  timestamp: number
}

// Historical price point
export interface HistoricalPricePoint {
  timestamp: number
  price: number
  date: string
}

// Historical market cap point
export interface HistoricalMarketCapPoint {
  timestamp: number
  marketCap: number
}

// Historical volume point
export interface HistoricalVolumePoint {
  timestamp: number
  volume: number
}

// API Response Types
export interface PricesResponse {
  success: true
  data: {
    prices: Record<string, PriceData>
    timestamp: number
    cached: boolean
    source: string
  }
  message: string
}

export interface RealtimePriceResponse {
  success: true
  data: RealtimePriceData
  message: string
}

export interface AllRealtimePricesResponse {
  success: true
  data: {
    prices: Record<string, RealtimePriceData>
    timestamp: number
    note: string
  }
  message: string
}

export interface MarketOverviewResponse {
  success: true
  data: {
    coins: MarketCoinData[]
    totalCoins: number
    cached: boolean
    source: string
    timestamp: number
  }
  message: string
}

export interface HistoricalDataResponse {
  success: true
  data: {
    coin: string
    vsCurrency: string
    days: string
    prices: HistoricalPricePoint[]
    marketCaps: HistoricalMarketCapPoint[]
    volumes: HistoricalVolumePoint[]
    dataPoints: number
    timestamp: number
    cached: boolean
  }
  message: string
}

export interface MarketHealthResponse {
  success: true
  data: {
    overall: 'healthy' | 'degraded' | 'down'
    services: {
      coinGecko: {
        status: string
        service: string
      }
      binance: {
        status: string
        service: string
        details?: {
          isRunning: boolean
          totalPairs: number
          activePairs: number
          connections: Record<string, {
            coin: string
            connected: boolean
            readyState: number
            latestPrice?: {
              price: number
              timestamp: number
            }
          }>
        }
      }
    }
    timestamp: number
  }
  message: string
}

// WebSocket message types
export interface WebSocketPriceUpdate {
  type: 'price_update'
  payload: RealtimePriceData
}

export type WebSocketMessage = WebSocketPriceUpdate
