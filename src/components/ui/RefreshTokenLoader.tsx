import { useLoadingStore } from '../../store/loading.store'
import { useEffect } from 'react'
import { removeRefreshLoader } from '../../utils/loader-utils'
import Spinner from './Spinner'

/**
 * RefreshTokenLoader Component
 * 
 * Shows a full-screen loader with blurred background overlay
 * when refresh token is being called (for cases where React is already mounted)
 * Also cleans up any DOM-injected loaders
 */
export default function RefreshTokenLoader() {
  const isRefreshingToken = useLoadingStore((state) => state.isRefreshingToken)

  // Clean up any DOM-injected loader when component mounts
  useEffect(() => {
    removeRefreshLoader()
  }, [])

  // Also clean up when loading finishes
  useEffect(() => {
    if (!isRefreshingToken) {
      removeRefreshLoader()
    }
  }, [isRefreshingToken])

  if (!isRefreshingToken) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-md bg-black/20 dark:bg-black/40 transition-colors"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" variant="primary" />
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Refreshing session...
        </p>
      </div>
    </div>
  )
}

