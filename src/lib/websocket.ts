import { useTokenStore } from '../store/token.store'
import type { QueryClient } from '@tanstack/react-query'
import { walletKeys } from '../hooks/useWallet'

export interface DepositEvent {
  type: 'deposit'
  userId: number
  currency: string
  amount: string
  reference: string // Redbiller reference
  transactionId: number // Our transaction ID
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
}

export interface PriceUpdateEvent {
  type: 'price_update'
  payload: {
    coin: string
    price: number
    change24h?: number
    volume24h?: number
    high24h?: number
    low24h?: number
    open24h?: number
    trades24h?: number
    [key: string]: any
  }
}

type WebSocketEvent = DepositEvent | PriceUpdateEvent

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private queryClient: QueryClient | null = null
  private userId: number | null = null
  private isConnecting = false

  setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient
  }

  setUserId(userId: number) {
    this.userId = userId
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    const accessToken = useTokenStore.getState().accessToken
    if (!accessToken) {
      console.warn('🔌 WebSocket: No access token, cannot connect')
      return
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 
                  (import.meta.env.VITE_API_BASE_URL?.replace(/^https?/, 'ws') || 'ws://localhost:3000')
    
    const url = `${wsUrl}/ws?token=${accessToken}`
    
    this.isConnecting = true

    try {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.isConnecting = false
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('🔌 WebSocket: Error parsing message', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('🔌 WebSocket: Error', error)
        this.isConnecting = false
      }

      this.ws.onclose = () => {
        this.isConnecting = false
        this.ws = null
        this.attemptReconnect()
      }
    } catch (error) {
      console.error('🔌 WebSocket: Connection error', error)
      this.isConnecting = false
      this.attemptReconnect()
    }
  }

  private handleMessage(data: WebSocketEvent) {
    if (data.type === 'deposit') {
      this.handleDepositEvent(data)
    } else if (data.type === 'price_update') {
      this.handlePriceUpdateEvent(data)
    }
  }

  private handleDepositEvent(event: DepositEvent) {
    // Only process events for the current user
    if (this.userId && event.userId !== this.userId) {
      return
    }

    // Invalidate relevant queries to refresh data
    if (this.queryClient) {
      // Invalidate wallet balances
      this.queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      this.queryClient.invalidateQueries({ queryKey: walletKeys.all })

      // Invalidate transactions
      this.queryClient.invalidateQueries({ queryKey: ['transactions'] })

      // Invalidate specific transaction if we have the ID
      if (event.transactionId) {
        this.queryClient.invalidateQueries({ 
          queryKey: ['transaction', event.transactionId.toString()] 
        })
      }

      // Invalidate deposit address query for the currency
      this.queryClient.invalidateQueries({ 
        queryKey: ['depositAddress', event.currency] 
      })
    }

    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('deposit-status-update', {
      detail: event
    }))
  }

  private handlePriceUpdateEvent(event: PriceUpdateEvent) {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('price-update', {
      detail: event.payload
    }))
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('🔌 WebSocket: Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.reconnectAttempts = 0
    this.isConnecting = false
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const websocketService = new WebSocketService()
