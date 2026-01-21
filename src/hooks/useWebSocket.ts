import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { websocketService } from '../lib/websocket'
import { useCurrentUser } from './useAuth'

/**
 * Hook to manage WebSocket connection for real-time updates
 * Automatically connects when user is authenticated and disconnects on logout
 */
export const useWebSocket = () => {
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  useEffect(() => {
    // Set query client for WebSocket service
    websocketService.setQueryClient(queryClient)
  }, [queryClient])

  useEffect(() => {
    // Set user ID when available
    if (currentUser?.id) {
      websocketService.setUserId(currentUser.id)
    }
  }, [currentUser?.id])

  useEffect(() => {
    // Connect when user is authenticated
    if (currentUser?.id) {
      console.log('🔌 WebSocket: Initializing connection for user', currentUser.id)
      websocketService.connect()
    } else {
      // Disconnect when user is not authenticated
      console.log('🔌 WebSocket: User not authenticated, disconnecting')
      websocketService.disconnect()
    }

    // Cleanup on unmount
    return () => {
      websocketService.disconnect()
    }
  }, [currentUser?.id])

  return {
    isConnected: websocketService.isConnected(),
    reconnect: () => websocketService.connect(),
    disconnect: () => websocketService.disconnect(),
  }
}

/**
 * Hook to listen for deposit status updates
 */
export const useDepositStatusListener = (
  onDepositUpdate?: (event: import('../lib/websocket').DepositEvent) => void
) => {
  useEffect(() => {
    const handleDepositUpdate = (event: CustomEvent) => {
      const depositEvent = event.detail as import('../lib/websocket').DepositEvent
      console.log('💰 Deposit status update:', depositEvent)
      
      if (onDepositUpdate) {
        onDepositUpdate(depositEvent)
      }
    }

    window.addEventListener('deposit-status-update', handleDepositUpdate as EventListener)

    return () => {
      window.removeEventListener('deposit-status-update', handleDepositUpdate as EventListener)
    }
  }, [onDepositUpdate])
}
