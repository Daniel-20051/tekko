import { useEffect, useState } from 'react'

/**
 * Hook to detect network connectivity status
 * Returns true when online, false when offline
 */
export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    // Initialize with current network status
    if (typeof window !== 'undefined' && 'navigator' in window) {
      return navigator.onLine
    }
    return true // Default to online if we can't detect
  })

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    // Handle online event
    const handleOnline = () => {
      setIsOnline(true)
    }

    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
